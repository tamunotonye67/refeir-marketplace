-- ==============================================================================
-- REFEIR PAN-AFRICAN MARKETPLACE DATABASE SCHEMA
-- Multi-currency, Milestone Escrow, 10% Scout Referral System, Realtime Chat
-- ==============================================================================

-- 1. PROFILES & USER MANAGEMENT
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  roles TEXT[] DEFAULT ARRAY['CLIENT']::TEXT[],
  active_role TEXT DEFAULT 'CLIENT',
  country TEXT DEFAULT 'Nigeria',
  city TEXT,
  bio TEXT,
  verification_status TEXT DEFAULT 'UNVERIFIED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TALENT PROFILES
CREATE TABLE IF NOT EXISTS public.talent_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Professional',
  hourly_rate NUMERIC(10, 2) DEFAULT 35.00,
  currency TEXT DEFAULT 'USD',
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_pro BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  review_count INTEGER DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  response_time TEXT DEFAULT '< 2 hours',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES (PACKAGES)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  delivery_days INTEGER DEFAULT 3,
  scout_reward_percent NUMERIC(4, 2) DEFAULT 10.00,
  image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REFERRAL LINKS & ATTRIBUTION (SCOUT ENGINE)
CREATE TABLE IF NOT EXISTS public.referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  target_type TEXT NOT NULL DEFAULT 'GENERAL', -- 'GENERAL', 'TALENT', 'SERVICE'
  target_id TEXT,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referral_attributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_link_id UUID REFERENCES public.referral_links(id) ON DELETE SET NULL,
  commission_percent NUMERIC(4, 2) DEFAULT 10.00,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTRACTS & MILESTONES (TRUST VAULT ESCROW)
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  talent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  scout_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'ACTIVE', 'COMPLETED', 'DISPUTED', 'CANCELLED'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  milestone_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'FUNDED', 'SUBMITTED', 'RELEASED', 'DISPUTED'
  submission_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MULTI-CURRENCY WALLETS & LEDGER
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  currency TEXT NOT NULL,
  available_balance NUMERIC(12, 2) DEFAULT 0.00,
  escrow_locked_balance NUMERIC(12, 2) DEFAULT 0.00,
  pending_rewards_balance NUMERIC(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, currency)
);

CREATE TABLE IF NOT EXISTS public.ledger_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'DEPOSIT', 'ESCROW_LOCK', 'ESCROW_RELEASE', 'SCOUT_REWARD', 'WITHDRAWAL', 'FEE'
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL,
  description TEXT,
  reference_id TEXT,
  status TEXT DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REAL-TIME MESSAGING
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids UUID[] NOT NULL,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- AUTOMATIC PROFILE & WALLET CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.profiles
  INSERT INTO public.profiles (id, name, email, avatar_url, roles, active_role, country)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    ARRAY[COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')]::TEXT[],
    COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'Nigeria')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Initialize Default USD & NGN Wallets
  INSERT INTO public.wallets (user_id, currency, available_balance) 
  VALUES (NEW.id, 'USD', 0.00)
  ON CONFLICT (user_id, currency) DO NOTHING;

  INSERT INTO public.wallets (user_id, currency, available_balance) 
  VALUES (NEW.id, 'NGN', 0.00)
  ON CONFLICT (user_id, currency) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Talent profiles are viewable by everyone" ON public.talent_profiles;
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own talent profile" ON public.talent_profiles;
DROP POLICY IF EXISTS "Users can manage own services" ON public.services;
DROP POLICY IF EXISTS "Users can view own wallets" ON public.wallets;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.ledger_transactions;
DROP POLICY IF EXISTS "Participants can view contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users can insert referral links" ON public.referral_links;
DROP POLICY IF EXISTS "Users can view referral links" ON public.referral_links;

-- Public Read Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Talent profiles are viewable by everyone" ON public.talent_profiles FOR SELECT USING (true);
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);

-- User Update Policies
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can update own talent profile" ON public.talent_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own services" ON public.services FOR ALL USING (auth.uid() = talent_id);
CREATE POLICY "Users can view own wallets" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON public.ledger_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Participants can view contracts" ON public.contracts FOR SELECT USING (auth.uid() = client_id OR auth.uid() = talent_id OR auth.uid() = scout_id);
CREATE POLICY "Users can insert referral links" ON public.referral_links FOR INSERT WITH CHECK (auth.uid() = scout_id);
CREATE POLICY "Users can view referral links" ON public.referral_links FOR SELECT USING (true);
