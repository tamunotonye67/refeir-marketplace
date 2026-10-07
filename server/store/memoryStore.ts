export interface ApplicationRecord {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  city: string;
  roles: string[];
  skills: string | null;
  portfolio_url: string | null;
  primary_division: string | null;
  contribution: string | null;
  availability: string | null;
  motivation: string | null;
  learning_goals: string | null;
  discovery_source: string | null;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';
  is_founding_100: boolean;
  contributor_level?: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';
  pioneer_id?: string | null;
  acceptance_code?: string | null;
  internal_notes?: string | null;
  account_created?: boolean;
  created_at: string;
}

export interface ContributorProfile {
  id: string;
  email: string;
  full_name: string;
  application_number?: string;
  pioneer_id?: string;
  acceptance_code?: string;
  division: string;
  contributor_level: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';
  date_of_birth?: string;
  avatar_url?: string;
  whatsapp_number?: string;
  telegram_handle?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  institution?: string;
  country?: string;
  city?: string;
  bio?: string;
  skills?: string[];
  payout_preference?: 'BANK' | 'CRYPTO_USDT' | 'MOBILE_MONEY';
  payout_details?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  is_profile_completed: boolean;
  password_hash?: string;
  created_at: string;
  profile_completed_at?: string;
  survey_responses?: any[];
  survey_completed_at?: string;
  is_suspended?: boolean;
  suspension_reason?: string;
  suspended_at?: string;
  last_active_at?: string;
  demoted_due_to_inactivity?: boolean;
  last_inactivity_demotion_at?: string;
  previous_level_before_demotion?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'SQUAD_LEAD' | 'TASK_VIEWER' | 'ADMISSIONS_REVIEWER' | 'TASK_VERIFIER';
  assigned_division: string;
  passcode: string;
  password?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  reviews_count: number;
  added_at: string;
}

export interface SquadTask {
  id: string;
  title: string;
  division: string;
  bounty: string;
  points: number;
  frequency: 'WEEKLY' | 'MONTHLY' | 'SPRINT' | 'MILESTONE';
  description: string;
  requirements: string[];
  submission_format: string;
  deadline?: string;
  is_active: boolean;
  is_pinned?: boolean;
  created_at: string;
}

export interface TaskSubmissionRecord {
  reference_id: string;
  task_id: string;
  task_title: string;
  division: string;
  applicant_name: string;
  email: string;
  whatsapp_number?: string;
  deliverable_url: string;
  notes?: string;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
  admin_feedback?: string;
  awarded_reward?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface PioneerCertificate {
  id: string;
  certificate_number: string;
  pioneer_name: string;
  pioneer_email: string;
  pioneer_id: string;
  division: string;
  tier_completed: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';
  tier_name: string;
  issued_at: string;
  issued_by: string;
  verified: boolean;
  metadata?: {
    total_deliverables: number;
    cohort?: string;
    skills_demonstrated?: string[];
  };
}

// ── In-Memory Database Store ──
export const memoryStore = {
  applications: [
    {
      id: 'app-seed-1',
      application_number: 'RP-2026-849201',
      full_name: 'Amara Diallo',
      email: 'amara.diallo@example.com',
      whatsapp_number: '+2348012345678',
      country: 'Nigeria',
      city: 'Lagos',
      roles: ['Developer', 'AI'],
      skills: 'React, TypeScript, Node.js, Python',
      portfolio_url: 'https://github.com/example',
      primary_division: 'TECH_PRODUCT',
      contribution: 'Full stack development & platform architecture',
      availability: '6-10 hours/week',
      motivation: 'Building decentralized work solutions across Africa',
      learning_goals: 'Refeir architecture & growth loops',
      discovery_source: 'Twitter / X',
      status: 'ACCEPTED' as const,
      is_founding_100: true,
      contributor_level: 'LEVEL_1' as const,
      pioneer_id: 'RP-001',
      acceptance_code: 'ACC-8492-3104',
      internal_notes: 'Approved during initial Pioneer batch',
      account_created: false,
      created_at: '2026-02-01T10:00:00.000Z'
    }
  ] as ApplicationRecord[],

  contributors: [
    {
      id: 'usr-demo-1',
      email: 'kwame.mensah@example.com',
      full_name: 'Kwame Mensah',
      application_number: 'RP-2026-492019',
      pioneer_id: 'RP-045',
      acceptance_code: 'ACC-4920-7712',
      division: 'GROWTH',
      contributor_level: 'LEVEL_2',
      whatsapp_number: '+233241234567',
      telegram_handle: '@kwame_growth',
      country: 'Ghana',
      city: 'Accra',
      date_of_birth: '1998-05-14',
      institution: 'University of Ghana, Legon',
      bio: 'Growth lead and campus ambassador organizing developer sprints and community loops.',
      skills: ['Community Growth', 'Campus Events', 'Referral Strategy', 'Technical Writing'],
      is_profile_completed: true,
      password_hash: 'password123',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      profile_completed_at: new Date(Date.now() - 3600000 * 40).toISOString(),
      last_active_at: new Date().toISOString()
    }
  ] as ContributorProfile[],

  staff: [
    {
      id: 'staff-1',
      name: 'Tonye Taylor',
      email: 'tonye@refeir.com',
      role: 'SUPER_ADMIN',
      assigned_division: 'ALL',
      passcode: 'refeir2026',
      password: 'Refeir@2026!',
      status: 'ACTIVE',
      reviews_count: 84,
      added_at: '2026-01-15T00:00:00.000Z'
    },
    {
      id: 'staff-mgr',
      name: 'Nkechi Okafor',
      email: 'manager@refeir.com',
      role: 'MANAGER',
      assigned_division: 'ALL',
      passcode: 'manager2026',
      password: 'Manager@2026!',
      status: 'ACTIVE',
      reviews_count: 51,
      added_at: '2026-01-20T00:00:00.000Z'
    },
    {
      id: 'staff-2',
      name: 'Sarah Alabi',
      email: 'sarah.alabi@refeir.com',
      role: 'ADMISSIONS_REVIEWER',
      assigned_division: 'GROWTH',
      passcode: 'admit2026',
      password: 'Sarah@Admit2026',
      status: 'ACTIVE',
      reviews_count: 32,
      added_at: '2026-02-01T00:00:00.000Z'
    },
    {
      id: 'staff-3',
      name: 'Chidi Eze',
      email: 'chidi.eze@refeir.com',
      role: 'SQUAD_LEAD',
      assigned_division: 'TECH_PRODUCT',
      passcode: 'techlead26',
      password: 'Chidi@TechLead26',
      status: 'ACTIVE',
      reviews_count: 19,
      added_at: '2026-02-10T00:00:00.000Z'
    },
    {
      id: 'staff-viewer',
      name: 'Zainab Bello',
      email: 'viewer@refeir.com',
      role: 'TASK_VIEWER',
      assigned_division: 'ALL',
      passcode: 'viewer2026',
      password: 'Viewer@2026!',
      status: 'ACTIVE',
      reviews_count: 12,
      added_at: '2026-02-15T00:00:00.000Z'
    }
  ] as StaffMember[],

  tasks: [
    {
      id: 'task-1',
      title: 'Design 3 Social Launch Graphics for Refeir Pioneers',
      division: 'CREATIVE',
      bounty: 'Level 2 Milestone Credit + $25 USDT Bounty',
      points: 25,
      frequency: 'WEEKLY',
      description: 'Create high-impact social media creatives announcing the Pioneers recruitment campaign using brand colors.',
      requirements: ['Figma or Canva link', 'Export PNG/JPG 1080x1350', 'Include official Refeir logo'],
      submission_format: 'Figma link or Google Drive folder URL',
      deadline: '2026-04-30T23:59:59.000Z',
      is_active: true,
      is_pinned: true,
      created_at: '2026-02-01T00:00:00.000Z'
    },
    {
      id: 'task-2',
      title: 'Host a Refeir Campus Sesh / Community Demo',
      division: 'GROWTH',
      bounty: 'Level 3 Progression Credit + $50 USDT Bounty',
      points: 50,
      frequency: 'SPRINT',
      description: 'Organize a physical or virtual campus session introducing Refeir Pioneers to at least 15 students/builders.',
      requirements: ['Attendance sheet / screenshots', 'Summary tweet or LinkedIn post', 'Minimum 10 registrations'],
      submission_format: 'Event report link with photos/videos',
      deadline: '2026-05-15T23:59:59.000Z',
      is_active: true,
      is_pinned: false,
      created_at: '2026-02-05T00:00:00.000Z'
    }
  ] as SquadTask[],

  submissions: [] as TaskSubmissionRecord[],
  certificates: [] as PioneerCertificate[]
};
