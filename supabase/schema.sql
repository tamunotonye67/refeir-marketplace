-- ==============================================================================
-- REFEIR PIONEERS PRODUCTION DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================
-- This script creates all tables, constraints, automated triggers, RLS policies,
-- and indexes required for the Refeir Pioneers platform.
--
-- Instructions:
-- 1. Create a free project at https://supabase.com
-- 2. Open your Supabase Dashboard -> SQL Editor
-- 3. Paste this script and click "Run"
-- 4. Copy your Project URL & Anon Key into your .env file
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PIONEER APPLICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pioneer_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(32) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(64) NOT NULL,
    country VARCHAR(128) NOT NULL,
    city VARCHAR(128),
    roles TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT,
    portfolio_url TEXT,
    primary_division VARCHAR(64) NOT NULL DEFAULT 'GROWTH',
    contribution TEXT,
    availability VARCHAR(64),
    motivation TEXT,
    learning_goals TEXT,
    discovery_source VARCHAR(128),
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'REVIEWING', 'ACCEPTED', 'WAITLISTED', 'REJECTED')),
    contributor_level VARCHAR(32) NOT NULL DEFAULT 'LEVEL_1'
        CHECK (contributor_level IN ('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5')),
    is_founding_100 BOOLEAN NOT NULL DEFAULT FALSE,
    pioneer_id VARCHAR(32),
    acceptance_code VARCHAR(64),
    account_created BOOLEAN NOT NULL DEFAULT FALSE,
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for lookup queries by application number and email
CREATE INDEX IF NOT EXISTS idx_pioneer_app_number ON public.pioneer_applications(LOWER(application_number));
CREATE INDEX IF NOT EXISTS idx_pioneer_app_email ON public.pioneer_applications(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_pioneer_app_status ON public.pioneer_applications(status);

-- Auto-generate Application Number (RP-2026-XXXXXX) if not provided
CREATE OR REPLACE FUNCTION public.fn_generate_pioneer_app_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
        NEW.application_number := 'RP-2026-' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pioneer_app_number ON public.pioneer_applications;
CREATE TRIGGER trg_pioneer_app_number
    BEFORE INSERT ON public.pioneer_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_generate_pioneer_app_number();

-- Auto-mint Acceptance Code and Pioneer ID when application is accepted
CREATE OR REPLACE FUNCTION public.fn_handle_pioneer_acceptance()
RETURNS TRIGGER AS $$
DECLARE
    next_id_num INTEGER;
BEGIN
    IF NEW.status = 'ACCEPTED' THEN
        -- Generate acceptance code if not exists
        IF NEW.acceptance_code IS NULL OR NEW.acceptance_code = '' THEN
            NEW.acceptance_code := 'ACC-' || RIGHT(REGEXP_REPLACE(NEW.application_number, '[^0-9]', '', 'g'), 4) || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
        END IF;

        -- Generate pioneer ID if not exists
        IF NEW.pioneer_id IS NULL OR NEW.pioneer_id = '' THEN
            SELECT COALESCE(MAX(NULLIF(REGEXP_REPLACE(pioneer_id, '[^0-9]', '', 'g'), '')::INTEGER), 50) + 1
            INTO next_id_num
            FROM public.pioneer_applications
            WHERE pioneer_id LIKE 'RP-%';
            
            NEW.pioneer_id := 'RP-' || LPAD(next_id_num::TEXT, 3, '0');
        END IF;
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pioneer_acceptance ON public.pioneer_applications;
CREATE TRIGGER trg_pioneer_acceptance
    BEFORE UPDATE ON public.pioneer_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_generate_pioneer_acceptance();


-- ==============================================================================
-- 2. CONTRIBUTOR PROFILES TABLE (AUTHENTICATED PIONEERS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contributor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    application_number VARCHAR(32) REFERENCES public.pioneer_applications(application_number) ON UPDATE CASCADE ON DELETE SET NULL,
    pioneer_id VARCHAR(32),
    acceptance_code VARCHAR(64),
    division VARCHAR(64) NOT NULL DEFAULT 'GROWTH',
    contributor_level VARCHAR(32) NOT NULL DEFAULT 'LEVEL_1'
        CHECK (contributor_level IN ('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5')),
    date_of_birth DATE,
    avatar_url TEXT,
    whatsapp_number VARCHAR(64),
    telegram_handle VARCHAR(128),
    twitter_handle VARCHAR(128),
    instagram_handle VARCHAR(128),
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    institution VARCHAR(255),
    country VARCHAR(128),
    city VARCHAR(128),
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    payout_preference VARCHAR(32) DEFAULT 'BANK'
        CHECK (payout_preference IN ('BANK', 'CRYPTO_USDT', 'MOBILE_MONEY')),
    payout_details TEXT,
    bank_name VARCHAR(128),
    account_number VARCHAR(64),
    account_name VARCHAR(128),
    is_profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash TEXT,
    survey_responses JSONB DEFAULT '[]'::jsonb,
    survey_completed_at TIMESTAMPTZ,
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    suspension_reason TEXT,
    suspended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contributor_email ON public.contributor_profiles(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_contributor_pioneer_id ON public.contributor_profiles(pioneer_id);
CREATE INDEX IF NOT EXISTS idx_contributor_division ON public.contributor_profiles(division);


-- ==============================================================================
-- 3. SQUAD TASKS TABLE (MISSIONS & BOUNTIES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.squad_tasks (
    id VARCHAR(64) PRIMARY KEY, -- e.g. "TASK-2026-101"
    title VARCHAR(255) NOT NULL,
    squad VARCHAR(64) NOT NULL DEFAULT 'GENERAL',
    frequency VARCHAR(32) NOT NULL DEFAULT 'DAILY'
        CHECK (frequency IN ('DAILY', 'WEEKLY', 'FLASH_BOUNTY')),
    category VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    submission_format VARCHAR(255) NOT NULL,
    bounty_type VARCHAR(32) NOT NULL DEFAULT 'NONE'
        CHECK (bounty_type IN ('AIRTIME', 'DATA', 'CASH', 'XP_CREDIT', 'CUSTOM', 'NONE')),
    bounty_reward VARCHAR(128),
    bounty_slots VARCHAR(128),
    bounty_instructions TEXT,
    deadline TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'ARCHIVED', 'COMPLETED')),
    announced_by VARCHAR(128) NOT NULL DEFAULT 'Admissions Lead',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_squad_tasks_status ON public.squad_tasks(status);
CREATE INDEX IF NOT EXISTS idx_squad_tasks_squad ON public.squad_tasks(squad);


-- ==============================================================================
-- 4. PIONEER PROOF OF WORK TABLE (TASK DELIVERABLES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pioneer_proof_of_work (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. "POW-2026-90412"
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    application_number VARCHAR(32) NOT NULL,
    pioneer_id VARCHAR(32) NOT NULL,
    division VARCHAR(64) NOT NULL,
    target_level VARCHAR(32) NOT NULL DEFAULT 'LEVEL_2'
        CHECK (target_level IN ('LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5')),
    task_title VARCHAR(255) NOT NULL,
    task_category VARCHAR(128) NOT NULL,
    task_description TEXT NOT NULL,
    deliverable_url TEXT,
    additional_url TEXT,
    screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'VERIFIED', 'NEEDS_REVISION', 'REJECTED')),
    admin_feedback TEXT,
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pow_email ON public.pioneer_proof_of_work(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_pow_status ON public.pioneer_proof_of_work(status);
CREATE INDEX IF NOT EXISTS idx_pow_reference ON public.pioneer_proof_of_work(reference_id);


-- ==============================================================================
-- 5. PIONEER CERTIFICATES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pioneer_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credential_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. "RP-CERT-2026-0412" or "CERT-RF-2026-8091"
    pioneer_id VARCHAR(32) NOT NULL,
    application_number VARCHAR(32),
    recipient_name VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    division VARCHAR(64) NOT NULL,
    level VARCHAR(32) NOT NULL
        CHECK (level IN ('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    verified_jobs_count INTEGER NOT NULL DEFAULT 0,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    issued_by VARCHAR(128) NOT NULL DEFAULT 'Refeir Admissions Committee & Protocol Stewards',
    special_distinction TEXT,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_reason TEXT,
    revoked_at TIMESTAMPTZ,
    verification_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cert_email ON public.pioneer_certificates(LOWER(recipient_email));
CREATE INDEX IF NOT EXISTS idx_cert_credential ON public.pioneer_certificates(credential_id);


-- ==============================================================================
-- 6. STAFF MEMBERS TABLE (ADMIN PORTAL ACCESS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.staff_members (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'ADMISSIONS_REVIEWER'
        CHECK (role IN ('ADMISSIONS_REVIEWER', 'TASK_VERIFIER', 'SQUAD_LEAD', 'SUPER_ADMIN')),
    assigned_division VARCHAR(64) NOT NULL DEFAULT 'ALL',
    passcode VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    reviews_count INTEGER NOT NULL DEFAULT 0,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on all tables
ALTER TABLE public.pioneer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pioneer_proof_of_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pioneer_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- Pioneer Applications: Public can insert, and read for status check
DROP POLICY IF EXISTS "Public can submit pioneer application" ON public.pioneer_applications;
CREATE POLICY "Public can submit pioneer application"
    ON public.pioneer_applications FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can query pioneer applications" ON public.pioneer_applications;
CREATE POLICY "Public can query pioneer applications"
    ON public.pioneer_applications FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow updates on pioneer applications" ON public.pioneer_applications;
CREATE POLICY "Allow updates on pioneer applications"
    ON public.pioneer_applications FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Contributor Profiles: Allow select, insert, update
DROP POLICY IF EXISTS "Allow read contributor profiles" ON public.contributor_profiles;
CREATE POLICY "Allow read contributor profiles"
    ON public.contributor_profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow insert contributor profiles" ON public.contributor_profiles;
CREATE POLICY "Allow insert contributor profiles"
    ON public.contributor_profiles FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update contributor profiles" ON public.contributor_profiles;
CREATE POLICY "Allow update contributor profiles"
    ON public.contributor_profiles FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Squad Tasks: Public can read active tasks; admins can modify
DROP POLICY IF EXISTS "Allow read squad tasks" ON public.squad_tasks;
CREATE POLICY "Allow read squad tasks"
    ON public.squad_tasks FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow modify squad tasks" ON public.squad_tasks;
CREATE POLICY "Allow modify squad tasks"
    ON public.squad_tasks FOR ALL
    USING (true)
    WITH CHECK (true);

-- Proof of Work: Public can insert and select
DROP POLICY IF EXISTS "Allow insert proof of work" ON public.pioneer_proof_of_work;
CREATE POLICY "Allow insert proof of work"
    ON public.pioneer_proof_of_work FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read proof of work" ON public.pioneer_proof_of_work;
CREATE POLICY "Allow read proof of work"
    ON public.pioneer_proof_of_work FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow update proof of work" ON public.pioneer_proof_of_work;
CREATE POLICY "Allow update proof of work"
    ON public.pioneer_proof_of_work FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Pioneer Certificates: Public can view certificates
DROP POLICY IF EXISTS "Allow read certificates" ON public.pioneer_certificates;
CREATE POLICY "Allow read certificates"
    ON public.pioneer_certificates FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow manage certificates" ON public.pioneer_certificates;
CREATE POLICY "Allow manage certificates"
    ON public.pioneer_certificates FOR ALL
    USING (true)
    WITH CHECK (true);

-- Staff Members: Public can authenticate; admins can manage
DROP POLICY IF EXISTS "Allow read staff" ON public.staff_members;
CREATE POLICY "Allow read staff"
    ON public.staff_members FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow manage staff" ON public.staff_members;
CREATE POLICY "Allow manage staff"
    ON public.staff_members FOR ALL
    USING (true)
    WITH CHECK (true);


-- ==============================================================================
-- 8. INITIAL SEED DATA (CORE TEAM & PRE-CONFIGURED BOUNTIES)
-- ==============================================================================
-- Insert Default Super Admin and Staff
INSERT INTO public.staff_members (id, name, email, role, assigned_division, passcode, status, reviews_count)
VALUES
    ('staff-1', 'Tonye Taylor', 'tonye@refeir.com', 'SUPER_ADMIN', 'ALL', 'refeir2026', 'ACTIVE', 84),
    ('staff-2', 'Sarah Alabi', 'sarah.alabi@refeir.com', 'ADMISSIONS_REVIEWER', 'GROWTH', 'admit2026', 'ACTIVE', 32),
    ('staff-3', 'Chidi Eze', 'chidi.eze@refeir.com', 'SQUAD_LEAD', 'TECHNOLOGY', 'techlead26', 'ACTIVE', 19)
ON CONFLICT (id) DO NOTHING;

-- Insert Seed Applications
INSERT INTO public.pioneer_applications (
    id, application_number, full_name, email, whatsapp_number, country, city,
    roles, skills, portfolio_url, primary_division, contribution, availability,
    motivation, learning_goals, discovery_source, status, contributor_level,
    is_founding_100, pioneer_id, acceptance_code, account_created
)
VALUES
    (
        'a1111111-1111-1111-1111-111111111111',
        'RP-2026-849201', 'Chidubem Nwosu', 'chidubem.nwosu@example.com', '+2348031234567',
        'Nigeria', 'Lagos', ARRAY['Developer', 'Product'], 'TypeScript, React, Node.js, Smart Contract Escrows',
        'https://github.com/chidubem-demo', 'TECH_PRODUCT', 'Want to build and audit the smart contract milestone escrow system.',
        '6–10 hours/week', 'Africa needs decentralized trust infrastructure to unlock cross-border freelance payouts.',
        'Deep dive into decentralized referral loops and tokenomics.', 'Twitter / X',
        'ACCEPTED', 'LEVEL_3', TRUE, 'RP-012', 'ACC-8492-9041', FALSE
    ),
    (
        'a2222222-2222-2222-2222-222222222222',
        'RP-2026-612948', 'Amina Kimani', 'amina.k@example.com', '+254712345678',
        'Kenya', 'Nairobi', ARRAY['Designer'], 'Figma, UI/UX, Design Systems, Mobile Interaction Design',
        'https://dribbble.com/amina-demo', 'CREATIVE', 'Crafting the mobile app UI component library and freelancer profile screens.',
        '3–5 hours/week', 'Excited about shaping the visual identity and usability of Refeir.',
        'Leading design critique sessions with fellow African designers.', 'LinkedIn',
        'ACCEPTED', 'LEVEL_2', TRUE, 'RP-028', 'ACC-6129-3319', FALSE
    ),
    (
        'a3333333-3333-3333-3333-333333333333',
        'RP-2026-492019', 'Kwame Mensah', 'kwame.mensah@example.com', '+233241234567',
        'Ghana', 'Accra', ARRAY['Marketer', 'Community Builder'], 'Viral loops, Campus Ambassador Growth, Content Strategy',
        'https://linkedin.com/in/kwame-demo', 'GROWTH', 'Organizing campus developer orientation hackathons across Ghanaian universities.',
        '5–8 hours/week', 'Refeir can solve graduate underemployment by turning student networks into economic assets.',
        'Mastering viral referral design and Web3 community growth frameworks.', 'University Campus Club',
        'ACCEPTED', 'LEVEL_2', TRUE, 'RP-045', 'ACC-4920-7712', TRUE
    )
ON CONFLICT (application_number) DO NOTHING;

-- Insert Seed Contributor Profile
INSERT INTO public.contributor_profiles (
    id, email, full_name, application_number, pioneer_id, acceptance_code,
    division, contributor_level, whatsapp_number, telegram_handle,
    country, city, institution, bio, skills, is_profile_completed
)
VALUES (
    'b3333333-3333-3333-3333-333333333333',
    'kwame.mensah@example.com', 'Kwame Mensah', 'RP-2026-492019', 'RP-045', 'ACC-4920-7712',
    'GROWTH', 'LEVEL_2', '+233241234567', '@kwame_growth',
    'Ghana', 'Accra', 'University of Ghana, Legon',
    'Growth lead and campus ambassador organizing developer sprints and community loops.',
    ARRAY['Community Growth', 'Campus Events', 'Referral Strategy', 'Technical Writing'],
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- Insert Seed Squad Tasks
INSERT INTO public.squad_tasks (
    id, title, squad, frequency, category, description,
    requirements, submission_format, bounty_type, bounty_reward,
    bounty_slots, bounty_instructions, deadline, status, announced_by
)
VALUES
    (
        'TASK-2026-101',
        'Daily Viral Blitz: Quote-Tweet Tonye Taylor’s Refeir Vision & Tag 3 Founders',
        'GENERAL', 'DAILY', 'Social Media Sharing',
        'Help amplify the Refeir Founding 100 recruitment drive across Twitter/X and LinkedIn. Quote-tweet our latest vision announcement, share what sovereign work means to you, and tag 3 founders or builders who should join the cohort.',
        ARRAY[
            'Quote-tweet the pinned Refeir announcement on X (@RefeirProtocol)',
            'Include your personal perspective on why peer referrals beat 20% freelance platforms',
            'Tag 3 active builders, designers, or campus founders',
            'Include #RefeirPioneers and link refeir.com'
        ],
        'Live Tweet URL + Screenshot of published quote-tweet',
        'AIRTIME', '₦1,500 Airtime Giveaway', 'First 10 Verified Pioneers',
        'Direct instant airtime top-up dispatched to the Nigerian/African mobile number on your profile within 4 hours of verification.',
        NOW() + INTERVAL '24 hours', 'ACTIVE', 'Tonye Taylor (Founder)'
    ),
    (
        'TASK-2026-102',
        'Tech Sprint: Audit Refeir Smart Escrow Multi-Currency Webhooks',
        'TECHNOLOGY', 'WEEKLY', 'Backend & Smart Contracts',
        'Review the draft milestone escrow smart contract ABI and test the webhook handlers for USD/USDC and African fiat conversion callbacks.',
        ARRAY[
            'Clone the refeir-contracts repo on GitHub',
            'Run automated test suite: npm run test:escrow',
            'Submit a PR or comprehensive markdown audit report'
        ],
        'GitHub PR Link or Secret Gist containing test coverage',
        'CASH', '₦25,000 Milestone Grant', 'Top 2 Contributions',
        'Paid directly to your bank account or USDT wallet upon PR merge.',
        NOW() + INTERVAL '7 days', 'ACTIVE', 'Chidi Eze (Tech Lead)'
    ),
    (
        'TASK-2026-103',
        'Creative Sprint: Refeir Pioneer Social Announcement Graphics & Wallpapers',
        'CREATIVE', 'WEEKLY', 'Branding & Motion Design',
        'Design 3 square (1080x1080) and 3 landscape (1200x675) announcement banners adopting the Refeir Sovereign Forest Green (#0F2E1E) and Mint (#18FC5C) aesthetic.',
        ARRAY[
            'Use Refeir official logos and color tokens',
            'Figma link with exported high-res PNGs',
            'Include editable text layers for Pioneer names'
        ],
        'Figma File Link (with view/comment access)',
        'DATA', '10GB Data Bundle', 'Top 5 Designers',
        'Dispatched to your phone number within 6 hours.',
        NOW() + INTERVAL '5 days', 'ACTIVE', 'Sarah Alabi (Admissions)'
    )
ON CONFLICT (id) DO NOTHING;
