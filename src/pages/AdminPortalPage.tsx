import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AFRICAN_COUNTRIES } from '../data/countries';
import { CountryFlag } from '../components/common/CountryFlag';
import { formatMoney } from '../data/currencies';
import { CountryMarketplaceStatus } from '../types';
import {
  Shield,
  Settings,
  Globe2,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Save,
  ArrowRight,
  ExternalLink,
  Wallet,
  Scale,
  BadgeCheck,
  Building2,
  UserCheck,
  Check,
  Trash2,
  Clock,
  Activity,
  PlusCircle,
  Search,
  Edit3,
  Award,
  X,
  Eye,
  ShieldCheck,
  Ticket,
  LogOut,
  ArrowLeft,
  Sun,
  Moon,
  AlertTriangle,
  UserPlus,
  BarChart3,
  PieChart,
  DollarSign,
  ArrowUpRight,
  Code2,
  Cpu,
  Palette,
  Layers,
  Zap,
  ChevronRight,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPortalPageProps {
  onNavigate?: (path: string) => void;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  country: string;
  countryIso: string;
  role: 'SUPER_ADMIN' | 'COMMUNITY_MANAGER' | 'CONTENT_EDITOR' | 'DISPUTE_ARBITER' | 'COMPLIANCE_OFFICER';
  roleTitle: string;
  permissions: {
    manageWebsite: boolean;
    manageCommunityHub: boolean;
    moderateForum: boolean;
    approveAmbassadors: boolean;
    manageGuildsEvents: boolean;
    verifyKyc: boolean;
    arbitrateDisputes: boolean;
  };
  status: 'ACTIVE' | 'PENDING_INVITE' | 'SUSPENDED';
  joinedDate: string;
  twoFactorEnabled: boolean;
  lastActive: string;
}

export interface PioneerApplication {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  city?: string;
  roles: string[];
  skills?: string;
  portfolio_url?: string;
  primary_division?: string;
  contribution?: string;
  availability?: string;
  motivation?: string;
  learning_goals?: string;
  discovery_source?: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';
  is_founding_100: boolean;
  pioneer_id?: string;
  internal_notes?: string;
  created_at: string;
}

export type AdminWebsiteTab = 
  | 'OVERVIEW' 
  | 'ANALYTICS' 
  | 'PIONEERS' 
  | 'VERIFICATIONS' 
  | 'DISPUTES' 
  | 'COUNTRIES' 
  | 'TEAM' 
  | 'SETTINGS';

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onNavigate = () => {} }) => {
  const {
    countrySettings,
    updateCountryStatus,
    platformSettings,
    updatePlatformSettings,
    referralsList,
    auditLogs,
    disputesList,
    resolveDispute,
    clientIntroductionsList,
    approveAndGrantAirfeeToken,
    rejectClientIntroduction
  } = useMarketplace();

  const { showToast, addAppNotification } = useNotification();
  const { currentUser, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Tab routing with backwards compatibility
  const getSavedActiveTab = (): AdminWebsiteTab => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab')?.toUpperCase() || '';
      const stored = ((localStorage.getItem('refeir_admin_active_tab') || sessionStorage.getItem('refeir_admin_active_tab')) || '').toUpperCase();
      const raw = urlTab || stored;

      const mapping: Record<string, AdminWebsiteTab> = {
        OVERVIEW: 'OVERVIEW',
        ANALYTICS: 'ANALYTICS',
        DASHBOARDS: 'OVERVIEW',
        PIONEERS: 'PIONEERS',
        VERIFICATIONS: 'VERIFICATIONS',
        DISPUTES: 'DISPUTES',
        AIRFEE: 'DISPUTES',
        COUNTRIES: 'COUNTRIES',
        TEAM: 'TEAM',
        SETTINGS: 'SETTINGS',
        AUDIT: 'SETTINGS',
        FRAUD: 'SETTINGS'
      };

      if (raw && mapping[raw]) {
        return mapping[raw];
      }
    } catch {}
    return 'OVERVIEW';
  };

  const [activeTab, setActiveTabState] = useState<AdminWebsiteTab>(getSavedActiveTab);

  const setActiveTab = (newTab: AdminWebsiteTab) => {
    setActiveTabState(newTab);
    try {
      localStorage.setItem('refeir_admin_active_tab', newTab);
      sessionStorage.setItem('refeir_admin_active_tab', newTab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab.toLowerCase());
      window.history.replaceState(null, '', url.pathname + url.search);
    } catch {}
  };

  // Analytics State
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [analyticsMetric, setAnalyticsMetric] = useState<'ALL' | 'ESCROW' | 'SCOUT'>('ALL');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Pioneer Applications State
  const [pioneerAppsList, setPioneerAppsList] = useState<PioneerApplication[]>([
    {
      id: 'PA-001',
      application_number: 'RP-2026-000101',
      full_name: 'Chinwe Okonkwo',
      email: 'chinwe.okonkwo@dev.ng',
      whatsapp_number: '+234 803 123 4567',
      country: 'Nigeria',
      city: 'Lagos',
      roles: ['Developer', 'AI'],
      skills: 'React, TypeScript, Node.js, Python, Supabase, LLMs',
      portfolio_url: 'https://github.com/chinwe-dev',
      primary_division: 'TECH_PRODUCT',
      contribution: 'Can build platform microservices, assist in refactoring frontend components, and write automated tests for marketplace escrow flows.',
      availability: '6–10 hours/week',
      motivation: 'Passionate about connecting African developers with high-value international and cross-border client opportunities.',
      learning_goals: 'Decentralized trust protocols and scalable micro-frontend architecture.',
      discovery_source: 'Twitter / X',
      status: 'PENDING',
      is_founding_100: true,
      pioneer_id: '',
      internal_notes: 'Strong GitHub portfolio. Experienced in TypeScript and Supabase.',
      created_at: '2026-08-25T14:20:00Z'
    },
    {
      id: 'PA-002',
      application_number: 'RP-2026-000102',
      full_name: 'Kwame Mensah',
      email: 'kwame.mensah@design.gh',
      whatsapp_number: '+233 24 555 7890',
      country: 'Ghana',
      city: 'Accra',
      roles: ['Designer'],
      skills: 'Figma, UI/UX Design, Design Systems, Motion Graphics',
      portfolio_url: 'https://behance.net/kwamemensah',
      primary_division: 'CREATIVE',
      contribution: 'Want to help refine the Pioneer brand identity, create interactive dashboard prototypes, and design marketing campaign collateral.',
      availability: '3–5 hours/week',
      motivation: 'Want to ensure African tech products have world-class visual aesthetics that stand out globally.',
      learning_goals: 'Design systems for large-scale multi-currency fintech web applications.',
      discovery_source: 'LinkedIn',
      status: 'PENDING',
      is_founding_100: false,
      pioneer_id: '',
      internal_notes: 'High visual craft on Behance.',
      created_at: '2026-08-25T16:45:00Z'
    },
    {
      id: 'PA-003',
      application_number: 'RP-2026-000103',
      full_name: 'Faith Chebet',
      email: 'faith.chebet@growth.ke',
      whatsapp_number: '+254 712 345 678',
      country: 'Kenya',
      city: 'Nairobi',
      roles: ['Marketer', 'Business Developer'],
      skills: 'Digital Marketing, Performance SEO, Social Media Strategy, Growth Funnels',
      portfolio_url: 'https://linkedin.com/in/faithchebet',
      primary_division: 'GROWTH',
      contribution: 'Can run referral ambassador campaigns, organize campus recruitment roadshows, and onboard tech agencies in East Africa.',
      availability: '5–8 hours/week',
      motivation: 'Empowering African youth through digital gig opportunities and verified freelance placement.',
      learning_goals: 'Cross-border B2B business development and fintech partnerships.',
      discovery_source: 'Instagram',
      status: 'ACCEPTED',
      is_founding_100: true,
      pioneer_id: 'PION-001',
      internal_notes: 'Top tier marketing candidate. Approved founding cohort member.',
      created_at: '2026-08-24T09:15:00Z'
    }
  ]);

  const [selectedPioneerApp, setSelectedPioneerApp] = useState<PioneerApplication | null>(null);
  const [pioneerSearchQuery, setPioneerSearchQuery] = useState('');
  const [pioneerDivisionFilter, setPioneerDivisionFilter] = useState<string>('ALL');
  const [pioneerStatusFilter, setPioneerStatusFilter] = useState<string>('ALL');
  const [pioneerCountryFilter, setPioneerCountryFilter] = useState<string>('ALL');
  const [editingNotes, setEditingNotes] = useState('');

  // Fetch real applications from Supabase if connected
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase
      .from('pioneer_applications')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setPioneerAppsList(data as PioneerApplication[]);
        }
      });
  }, []);

  // Notifications helper
  const addAdminNotification = (
    title: string,
    message: string,
    category: 'ESCROW' | 'DISPUTES' | 'FRAUD' | 'GOVERNANCE' | 'SYSTEM' | 'TEAM',
    targetTab: AdminWebsiteTab = 'OVERVIEW'
  ) => {
    addAppNotification({
      title,
      message,
      type: category === 'FRAUD' || category === 'DISPUTES' ? 'WARNING' : 'SUCCESS',
      category: 'ADMIN',
      link: `/admin?tab=${targetTab.toLowerCase()}`,
      action_label: `View in ${targetTab}`,
      role_target: 'ADMIN'
    });
    showToast(title, message, category === 'FRAUD' || category === 'DISPUTES' ? 'WARNING' : 'SUCCESS');
  };

  // Staff & Team Members RBAC State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'TM-001',
      name: 'Antigravity Admin',
      email: 'admin@refeir.africa',
      avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=150&q=80',
      country: 'Pan-African Sovereign HQ',
      countryIso: 'NG',
      role: 'SUPER_ADMIN',
      roleTitle: 'Super Administrator',
      permissions: {
        manageWebsite: true,
        manageCommunityHub: true,
        moderateForum: true,
        approveAmbassadors: true,
        manageGuildsEvents: true,
        verifyKyc: true,
        arbitrateDisputes: true
      },
      status: 'ACTIVE',
      joinedDate: 'Jan 2026',
      twoFactorEnabled: true,
      lastActive: 'Active Now'
    },
    {
      id: 'TM-002',
      name: 'Amina Diallo',
      email: 'amina.diallo@refeir.africa',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      country: 'Senegal',
      countryIso: 'SN',
      role: 'COMMUNITY_MANAGER',
      roleTitle: 'Head of Community & Ambassadors',
      permissions: {
        manageWebsite: true,
        manageCommunityHub: true,
        moderateForum: true,
        approveAmbassadors: true,
        manageGuildsEvents: true,
        verifyKyc: false,
        arbitrateDisputes: false
      },
      status: 'ACTIVE',
      joinedDate: 'Feb 2026',
      twoFactorEnabled: true,
      lastActive: '20 mins ago'
    },
    {
      id: 'TM-003',
      name: 'Kofi Mensah',
      email: 'kofi.mensah@refeir.africa',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      country: 'Ghana',
      countryIso: 'GH',
      role: 'CONTENT_EDITOR',
      roleTitle: 'Lead Content & Website Editor',
      permissions: {
        manageWebsite: true,
        manageCommunityHub: true,
        moderateForum: true,
        approveAmbassadors: false,
        manageGuildsEvents: false,
        verifyKyc: false,
        arbitrateDisputes: false
      },
      status: 'ACTIVE',
      joinedDate: 'Mar 2026',
      twoFactorEnabled: true,
      lastActive: '1 hour ago'
    }
  ]);

  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberCountry, setNewMemberCountry] = useState('Nigeria');
  const [newMemberCountryIso, setNewMemberCountryIso] = useState('NG');
  const [newMemberRole, setNewMemberRole] = useState<'SUPER_ADMIN' | 'COMMUNITY_MANAGER' | 'CONTENT_EDITOR' | 'DISPUTE_ARBITER' | 'COMPLIANCE_OFFICER'>('COMMUNITY_MANAGER');
  const [newMemberRoleTitle, setNewMemberRoleTitle] = useState('Community Manager');
  const [newMemberPermissions, setNewMemberPermissions] = useState({
    manageWebsite: true,
    manageCommunityHub: true,
    moderateForum: true,
    approveAmbassadors: true,
    manageGuildsEvents: true,
    verifyKyc: false,
    arbitrateDisputes: false
  });

  const handleRolePresetChange = (role: 'SUPER_ADMIN' | 'COMMUNITY_MANAGER' | 'CONTENT_EDITOR' | 'DISPUTE_ARBITER' | 'COMPLIANCE_OFFICER') => {
    setNewMemberRole(role);
    if (role === 'SUPER_ADMIN') {
      setNewMemberRoleTitle('Platform Super Administrator');
      setNewMemberPermissions({
        manageWebsite: true,
        manageCommunityHub: true,
        moderateForum: true,
        approveAmbassadors: true,
        manageGuildsEvents: true,
        verifyKyc: true,
        arbitrateDisputes: true
      });
    } else if (role === 'COMMUNITY_MANAGER') {
      setNewMemberRoleTitle('Community & Ambassador Manager');
      setNewMemberPermissions({
        manageWebsite: true,
        manageCommunityHub: true,
        moderateForum: true,
        approveAmbassadors: true,
        manageGuildsEvents: true,
        verifyKyc: false,
        arbitrateDisputes: false
      });
    } else if (role === 'CONTENT_EDITOR') {
      setNewMemberRoleTitle('Content & Website Editor');
      setNewMemberPermissions({
        manageWebsite: true,
        manageCommunityHub: true,
        moderateForum: true,
        approveAmbassadors: false,
        manageGuildsEvents: false,
        verifyKyc: false,
        arbitrateDisputes: false
      });
    } else if (role === 'DISPUTE_ARBITER') {
      setNewMemberRoleTitle('Escrow Dispute Arbiter');
      setNewMemberPermissions({
        manageWebsite: false,
        manageCommunityHub: false,
        moderateForum: false,
        approveAmbassadors: false,
        manageGuildsEvents: false,
        verifyKyc: true,
        arbitrateDisputes: true
      });
    } else if (role === 'COMPLIANCE_OFFICER') {
      setNewMemberRoleTitle('Trust & KYC Officer');
      setNewMemberPermissions({
        manageWebsite: false,
        manageCommunityHub: false,
        moderateForum: false,
        approveAmbassadors: false,
        manageGuildsEvents: false,
        verifyKyc: true,
        arbitrateDisputes: false
      });
    }
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      showToast('Validation Error', 'Name and email are required.', 'ERROR');
      return;
    }

    const newWorker: TeamMember = {
      id: `TM-${Date.now().toString().slice(-4)}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim().toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=150&q=80',
      country: newMemberCountry,
      countryIso: newMemberCountryIso,
      role: newMemberRole,
      roleTitle: newMemberRoleTitle,
      permissions: { ...newMemberPermissions },
      status: 'ACTIVE',
      joinedDate: 'Sep 2026',
      twoFactorEnabled: true,
      lastActive: 'Just now'
    };

    setTeamMembers(prev => [newWorker, ...prev]);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast('Staff Member Added', `${newWorker.name} provisioned as ${newWorker.roleTitle}.`, 'SUCCESS');
    addAdminNotification(
      'New Team Member Provisioned',
      `${newWorker.name} (${newWorker.email}) added as ${newWorker.roleTitle}.`,
      'TEAM',
      'TEAM'
    );

    setNewMemberName('');
    setNewMemberEmail('');
    setShowAddTeamModal(false);
  };

  const handleToggleWorkerStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, status: nextStatus } : m));
    showToast('Status Updated', `Team member is now ${nextStatus.toLowerCase()}.`, nextStatus === 'ACTIVE' ? 'SUCCESS' : 'WARNING');
  };

  const handleDeleteWorker = (id: string, name: string) => {
    if (id === 'TM-001') {
      showToast('Action Denied', 'Primary Root Administrator cannot be removed.', 'ERROR');
      return;
    }
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    showToast('Member Removed', `${name} has been removed.`, 'INFO');
  };

  // Platform Economics
  const [platformFee, setPlatformFee] = useState(platformSettings.platform_fee_percent.toString());
  const [minRef, setMinRef] = useState(platformSettings.min_referral_percentage.toString());
  const [maxRef, setMaxRef] = useState(platformSettings.max_referral_percentage.toString());
  const [attribWindow, setAttribWindow] = useState(platformSettings.attribution_window_days.toString());
  const [holdDays, setHoldDays] = useState(platformSettings.payout_hold_period_days.toString());

  const handleSavePlatformSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      platform_fee_percent: parseFloat(platformFee) || 5,
      min_referral_percentage: parseFloat(minRef) || 5,
      max_referral_percentage: parseFloat(maxRef) || 25,
      attribution_window_days: parseInt(attribWindow) || 30,
      payout_hold_period_days: parseInt(holdDays) || 3
    });
    addAdminNotification(
      'Platform Economics Updated',
      `Platform fee: ${platformFee}% • Hold period: ${holdDays} days.`,
      'GOVERNANCE',
      'SETTINGS'
    );
    showToast('Settings Saved', 'Platform economics updated successfully.', 'SUCCESS');
  };

  // KYC Queue State
  const [kycQueue, setKycQueue] = useState([
    {
      id: 'KYC-847291',
      name: 'Chidi Okafor',
      legal_name_on_doc: 'Chidi Emmanuel Okafor',
      dob: '1996-05-18 (30 yrs)',
      role: 'Senior Full-Stack Engineer',
      country: 'Nigeria 🇳🇬',
      id_type: 'National ID / NIN',
      doc_number: 'NIN-7829103948',
      id_photo: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&auto=format&fit=crop&q=80',
      face_capture: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&auto=format&fit=crop&q=80',
      video_capture: '/Refeir_logo.mp4',
      match_confidence: 99.6,
      status: 'PENDING'
    },
    {
      id: 'KYC-592813',
      name: 'Wanjiru Mwangi',
      legal_name_on_doc: 'Wanjiru Faith Mwangi',
      dob: '1994-11-04 (31 yrs)',
      role: 'AI & Data Strategist',
      country: 'Kenya 🇰🇪',
      id_type: 'Passport',
      doc_number: 'KE-P0928374',
      id_photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      face_capture: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
      video_capture: null,
      match_confidence: 98.7,
      status: 'VERIFIED'
    },
    {
      id: 'KYC-301948',
      name: 'Kofi Mensah',
      legal_name_on_doc: 'Kofi Kwabena Mensah',
      dob: '1998-08-22 (28 yrs)',
      role: 'Mobile Architect',
      country: 'Ghana 🇬🇭',
      id_type: 'Ghana Card',
      doc_number: 'GHA-72819203-1',
      id_photo: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&auto=format&fit=crop&q=80',
      face_capture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      video_capture: '/Refeir_logo.mp4',
      match_confidence: 99.4,
      status: 'PENDING'
    }
  ]);

  const handleApproveKyc = (id: string, name: string) => {
    setKycQueue(prev => prev.map(k => k.id === id ? { ...k, status: 'VERIFIED' } : k));
    showToast('KYC Approved', `${name} is now Tier 2 Verified.`, 'SUCCESS');
    addAdminNotification('KYC Verified', `${name} identity verification approved.`, 'GOVERNANCE', 'VERIFICATIONS');
  };

  const handleRejectKyc = (id: string, name: string) => {
    setKycQueue(prev => prev.map(k => k.id === id ? { ...k, status: 'REJECTED' } : k));
    showToast('Retake Requested', `${name} notified to submit new documents.`, 'WARNING');
  };

  // Country status
  const [countrySearch, setCountrySearch] = useState('');
  const filteredCountries = AFRICAN_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.iso_code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountryToggle = (countryId: string, status: CountryMarketplaceStatus) => {
    updateCountryStatus(countryId, {
      status,
      payment_rules: status === 'FULLY_OPERATIONAL' || status === 'PAYMENTS_ENABLED' ? 'Enabled' : 'Disabled',
      payout_rules: status === 'FULLY_OPERATIONAL' || status === 'PAYOUTS_ENABLED' ? 'Enabled' : 'Disabled'
    });
    showToast('Country Updated', `${countryId.toUpperCase()} status set to ${status}.`);
  };

  // Disputes & Airfee
  const handleAdminResolveDispute = (disputeId: string, resolution: 'RESOLVED_TALENT' | 'RESOLVED_CLIENT', notes: string) => {
    resolveDispute(disputeId, resolution, notes);
    addAdminNotification(
      'Dispute Resolved',
      `Verdict: ${resolution === 'RESOLVED_TALENT' ? 'In Favor of Talent' : 'Client Refund Issued'}.`,
      'DISPUTES',
      'DISPUTES'
    );
  };

  const [rejectingIntroId, setRejectingIntroId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Client did not complete a project hire or name mismatch.');

  // Connected sub-dashboards launcher
  const connectedDashboards = [
    {
      title: 'Scout Network Hub',
      role: 'SCOUT OPERATIONS',
      path: '/dashboard/scout',
      icon: Users,
      color: 'var(--rf-leaf-green)',
      desc: 'Track active introductions, referral links, and reward distributions.'
    },
    {
      title: 'Client Project Dashboard',
      role: 'CLIENT ESCROWS',
      path: '/dashboard/client',
      icon: Briefcase,
      color: '#38BDF8',
      desc: 'Monitor milestone fundings, candidate shortlists, and approvals.'
    },
    {
      title: 'Talent Workspace',
      role: 'TALENT EARNINGS',
      path: '/dashboard/talent',
      icon: UserCheck,
      color: 'var(--rf-mint)',
      desc: 'Overview of verified African engineers, designers, and consultants.'
    },
    {
      title: 'Cross-Border Treasury',
      role: 'MULTI-CURRENCY VAULT',
      path: '/wallet',
      icon: Wallet,
      color: '#F4B942',
      desc: 'Liquidity tracking in NGN, KES, GHS, ZAR, and USD holding pools.'
    }
  ];

  const pendingPioneersCount = pioneerAppsList.filter(p => p.status === 'PENDING').length;
  const pendingKycCount = kycQueue.filter(k => k.status === 'PENDING').length;
  const openDisputesCount = disputesList.length;

  return (
    <div className="rf-admin-root">
      {/* 1. DEDICATED MODERN THEME-AWARE TOPBAR */}
      <header className="rf-admin-topbar">
        {/* Left: Brand + Console Pill + Live Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div
            onClick={() => onNavigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            title="Return to Marketplace"
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(46, 125, 50, 0.15)',
                border: '1px solid var(--rf-leaf-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--rf-leaf-green)'
              }}
            >
              <Shield size={18} />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
              Refeir
            </span>
          </div>

          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(46, 125, 50, 0.12)',
              border: '1px solid var(--rf-leaf-green)',
              color: 'var(--rf-leaf-green)'
            }}
          >
            ADMIN CONSOLE
          </span>

          <div
            className="rf-admin-topbar-desktop-only"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.75rem',
              color: 'var(--rf-slate-400)',
              marginLeft: '0.5rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--rf-bg-deep)',
              border: '1px solid var(--rf-bg-card-border)'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--rf-leaf-green)',
                boxShadow: '0 0 6px var(--rf-leaf-green)'
              }}
            />
            <span style={{ fontWeight: 600 }}>54 Sovereign Markets Live</span>
          </div>
        </div>

        {/* Right: Theme Toggle + Role Previews + Exit + Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="rf-btn rf-btn-icon"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid var(--rf-bg-card-border)',
              backgroundColor: 'var(--rf-bg-surface)',
              color: 'var(--rf-cream)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Quick View Links (Desktop only) */}
          <button
            onClick={() => {
              switchRole('CLIENT');
              onNavigate('/dashboard/client');
            }}
            className="rf-btn rf-admin-topbar-desktop-only"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: 'var(--rf-bg-surface)',
              border: '1px solid var(--rf-bg-card-border)',
              color: 'var(--rf-slate-300)',
              borderRadius: '6px'
            }}
            title="Preview Client Dashboard"
          >
            Client View
          </button>

          <button
            onClick={() => {
              switchRole('SCOUT');
              onNavigate('/dashboard/scout');
            }}
            className="rf-btn rf-admin-topbar-desktop-only"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: 'var(--rf-bg-surface)',
              border: '1px solid var(--rf-bg-card-border)',
              color: 'var(--rf-slate-300)',
              borderRadius: '6px'
            }}
            title="Preview Scout Dashboard"
          >
            Scout View
          </button>

          {/* Exit to Website */}
          <button
            onClick={() => onNavigate('/')}
            className="rf-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              border: '1px solid var(--rf-leaf-green)',
              color: 'var(--rf-leaf-green)',
              borderRadius: '6px'
            }}
            title="Exit Admin Console and Return to Marketplace"
          >
            <ArrowLeft size={13} />
            <span>Exit</span>
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--rf-bg-card-border)', margin: '0 0.2rem' }} />

          {/* Admin User Capsule */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--rf-bg-deep)',
              border: '1px solid var(--rf-bg-card-border)'
            }}
          >
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=100&q=80'}
              alt="Admin"
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
              Admin
            </span>
            <button
              onClick={async () => {
                await logout();
                onNavigate('/admin-login');
              }}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--rf-slate-400)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN ADMIN CANVAS */}
      <div className="rf-admin-canvas">
        {/* Executive Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rf-leaf-green)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
              <Shield size={12} />
              <span>Pan-African Operations & Governance</span>
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', margin: 0 }}>
              Administrator Console
            </h1>
            <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.875rem', marginTop: '0.25rem', maxWidth: '600px' }}>
              Central executive hub for analytics, admissions, identity verifications, country parameters, and team management.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div className="rf-admin-stat-pill">
              <span style={{ color: 'var(--rf-slate-400)' }}>Africa GMV:</span>
              <span style={{ fontWeight: 800, color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>₦48.6M</span>
            </div>

            <div className="rf-admin-stat-pill">
              <span style={{ color: 'var(--rf-slate-400)' }}>Pending Actions:</span>
              <span style={{ fontWeight: 800, color: pendingPioneersCount + pendingKycCount > 0 ? '#F4B942' : 'var(--rf-leaf-green)' }}>
                {pendingPioneersCount + pendingKycCount} Items
              </span>
            </div>

            <div className="rf-admin-stat-pill" style={{ color: 'var(--rf-leaf-green)', borderColor: 'var(--rf-leaf-green)' }}>
              <UserCheck size={13} />
              <span style={{ fontWeight: 700 }}>2FA Enforced</span>
            </div>
          </div>
        </div>

        {/* Modern Minimalist Tab Bar (8 Distinct Tabs) */}
        <nav className="rf-admin-tabs-nav">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`rf-admin-tab-btn ${activeTab === 'OVERVIEW' ? 'is-active' : ''}`}
          >
            <Activity size={14} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`rf-admin-tab-btn ${activeTab === 'ANALYTICS' ? 'is-active' : ''}`}
          >
            <BarChart3 size={14} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('PIONEERS')}
            className={`rf-admin-tab-btn ${activeTab === 'PIONEERS' ? 'is-active' : ''}`}
          >
            <Award size={14} />
            <span>Pioneers</span>
            {pendingPioneersCount > 0 && (
              <span className="rf-admin-badge-count">{pendingPioneersCount}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('VERIFICATIONS')}
            className={`rf-admin-tab-btn ${activeTab === 'VERIFICATIONS' ? 'is-active' : ''}`}
          >
            <BadgeCheck size={14} />
            <span>Verifications</span>
            {pendingKycCount > 0 && (
              <span className="rf-admin-badge-count">{pendingKycCount}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('DISPUTES')}
            className={`rf-admin-tab-btn ${activeTab === 'DISPUTES' ? 'is-active' : ''}`}
          >
            <Scale size={14} />
            <span>Disputes</span>
            {openDisputesCount > 0 && (
              <span className="rf-admin-badge-count">{openDisputesCount}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('COUNTRIES')}
            className={`rf-admin-tab-btn ${activeTab === 'COUNTRIES' ? 'is-active' : ''}`}
          >
            <Globe2 size={14} />
            <span>Countries</span>
            <span className="rf-admin-badge-count">{AFRICAN_COUNTRIES.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('TEAM')}
            className={`rf-admin-tab-btn ${activeTab === 'TEAM' ? 'is-active' : ''}`}
          >
            <Users size={14} />
            <span>Staff & Team</span>
            <span className="rf-admin-badge-count">{teamMembers.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`rf-admin-tab-btn ${activeTab === 'SETTINGS' ? 'is-active' : ''}`}
          >
            <Settings size={14} />
            <span>Platform Settings</span>
          </button>
        </nav>

        {/* ========================================================
            TAB 1: OVERVIEW
            ======================================================== */}
        {activeTab === 'OVERVIEW' && (
          <div>
            {/* Action Required Banner Strips */}
            {(pendingPioneersCount > 0 || pendingKycCount > 0 || openDisputesCount > 0) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {pendingPioneersCount > 0 && (
                  <div
                    onClick={() => setActiveTab('PIONEERS')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--rf-radius-md)',
                      backgroundColor: 'rgba(246, 178, 26, 0.12)',
                      border: '1px solid rgba(246, 178, 26, 0.35)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Award size={18} color="#B45309" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                        {pendingPioneersCount} Pioneer Applications awaiting admissions decision
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-leaf-green)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Review Pioneers <ArrowRight size={14} />
                    </span>
                  </div>
                )}

                {pendingKycCount > 0 && (
                  <div
                    onClick={() => setActiveTab('VERIFICATIONS')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--rf-radius-md)',
                      backgroundColor: 'rgba(46, 125, 50, 0.1)',
                      border: '1px solid rgba(46, 125, 50, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <BadgeCheck size={18} color="var(--rf-leaf-green)" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                        {pendingKycCount} Identity Verification requests pending document check
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-leaf-green)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Review KYC <ArrowRight size={14} />
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 4 Key KPI Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="rf-admin-card">
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Total Africa GMV
                </span>
                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                  ₦48.6M
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', marginTop: '0.25rem', fontWeight: 600 }}>
                  +32% month-over-month
                </div>
              </div>

              <div className="rf-admin-card">
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Platform Protection Fees
                </span>
                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-leaf-green)', marginTop: '0.25rem' }}>
                  ₦2.43M
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                  {platformSettings.platform_fee_percent}% client protection fee
                </div>
              </div>

              <div className="rf-admin-card">
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Scout Rewards Distributed
                </span>
                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#38BDF8', marginTop: '0.25rem' }}>
                  ₦4.86M
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                  Paid to Scouts across Africa
                </div>
              </div>

              <div className="rf-admin-card">
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Referral Conversions
                </span>
                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                  {referralsList.length} Referrals
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', marginTop: '0.25rem', fontWeight: 600 }}>
                  24.2% hire conversion
                </div>
              </div>
            </div>

            {/* Connected Workspaces Quick Launch */}
            <div className="rf-admin-card" style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Role Workspaces Quick Launch
                </h3>
                <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Inspect and preview live interfaces across Scout, Client, Talent, and Treasury roles.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {connectedDashboards.map(dash => {
                  const Icon = dash.icon;
                  return (
                    <button
                      key={dash.path}
                      onClick={() => onNavigate(dash.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        padding: '1rem',
                        borderRadius: 'var(--rf-radius-md)',
                        backgroundColor: 'var(--rf-bg-surface)',
                        border: '1px solid var(--rf-bg-card-border)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--rf-bg-deep)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Icon size={18} color={dash.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: dash.color, textTransform: 'uppercase' }}>
                          {dash.role}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)', marginTop: '2px' }}>
                          {dash.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '3px', lineHeight: 1.4 }}>
                          {dash.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Platform Governance Activity */}
            <div className="rf-admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Recent Governance Activity
                </h3>
                <button
                  onClick={() => setActiveTab('SETTINGS')}
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-leaf-green)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  View Full Audit Logs →
                </button>
              </div>

              <div className="rf-admin-table-container">
                <table className="rf-admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Admin / Actor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.slice(0, 5).map(log => (
                      <tr key={log.id}>
                        <td style={{ fontFamily: 'var(--rf-font-mono)', fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ fontWeight: 600 }}>{log.action}</td>
                        <td style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem' }}>{log.actor_name || 'Admin'}</td>
                        <td>
                          <span className="rf-badge rf-badge-mint rf-text-xs">
                            <Check size={11} /> Logged
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: FULL ANALYTICS DASHBOARD
            ======================================================== */}
        {activeTab === 'ANALYTICS' && (() => {
          const analyticsDataByPeriod: Record<string, {
            escrowVolume: string;
            escrowGrowth: string;
            netTake: string;
            scoutPaid: string;
            activeTalents: string;
            talentsGrowth: string;
            avgEscrow: string;
            peakVolume: string;
            timeframeLabel: string;
            maxGmv: number;
            ticks: { y: number; label: string }[];
            points: { label: string; gmv: number; scout: number; gmvText: string; scoutText: string; deals: number }[];
          }> = {
            '7D': {
              escrowVolume: '₦14.20M',
              escrowGrowth: '+14.8% vs last week',
              netTake: '₦710,000',
              scoutPaid: '₦1,420,000',
              activeTalents: '1,420',
              talentsGrowth: '+42 vetted this week',
              avgEscrow: '₦380,000',
              peakVolume: '₦2.42M (Fri)',
              timeframeLabel: 'Last 7 Days',
              maxGmv: 3.0,
              ticks: [
                { y: 35, label: '₦3.0M' },
                { y: 85, label: '₦2.0M' },
                { y: 135, label: '₦1.0M' },
                { y: 185, label: '₦0' }
              ],
              points: [
                { label: 'Mon', gmv: 1.65, scout: 0.165, gmvText: '₦1.65M', scoutText: '₦165K', deals: 8 },
                { label: 'Tue', gmv: 1.82, scout: 0.182, gmvText: '₦1.82M', scoutText: '₦182K', deals: 11 },
                { label: 'Wed', gmv: 2.15, scout: 0.215, gmvText: '₦2.15M', scoutText: '₦215K', deals: 14 },
                { label: 'Thu', gmv: 1.98, scout: 0.198, gmvText: '₦1.98M', scoutText: '₦198K', deals: 12 },
                { label: 'Fri', gmv: 2.42, scout: 0.242, gmvText: '₦2.42M', scoutText: '₦242K', deals: 16 },
                { label: 'Sat', gmv: 2.08, scout: 0.208, gmvText: '₦2.08M', scoutText: '₦208K', deals: 13 },
                { label: 'Sun', gmv: 2.10, scout: 0.210, gmvText: '₦2.10M', scoutText: '₦210K', deals: 12 }
              ]
            },
            '30D': {
              escrowVolume: '₦48.65M',
              escrowGrowth: '+32.4% vs last month',
              netTake: '₦2.43M',
              scoutPaid: '₦4.86M',
              activeTalents: '1,420',
              talentsGrowth: '+18.2% new talents',
              avgEscrow: '₦480,000',
              peakVolume: '₦48.65M (Cumulative)',
              timeframeLabel: 'Last 30 Days (2026)',
              maxGmv: 55.0,
              ticks: [
                { y: 35, label: '₦50M' },
                { y: 85, label: '₦35M' },
                { y: 135, label: '₦20M' },
                { y: 185, label: '₦0' }
              ],
              points: [
                { label: 'Jan', gmv: 12.0, scout: 1.20, gmvText: '₦12.0M', scoutText: '₦1.20M', deals: 64 },
                { label: 'Feb', gmv: 18.4, scout: 1.84, gmvText: '₦18.4M', scoutText: '₦1.84M', deals: 92 },
                { label: 'Mar', gmv: 25.1, scout: 2.51, gmvText: '₦25.1M', scoutText: '₦2.51M', deals: 128 },
                { label: 'Apr', gmv: 31.8, scout: 3.18, gmvText: '₦31.8M', scoutText: '₦3.18M', deals: 165 },
                { label: 'May', gmv: 39.2, scout: 3.92, gmvText: '₦39.2M', scoutText: '₦3.92M', deals: 198 },
                { label: 'Jun', gmv: 48.65, scout: 4.86, gmvText: '₦48.65M', scoutText: '₦4.86M', deals: 248 }
              ]
            },
            '90D': {
              escrowVolume: '₦126.80M',
              escrowGrowth: '+41.2% vs last quarter',
              netTake: '₦6.34M',
              scoutPaid: '₦12.68M',
              activeTalents: '1,420',
              talentsGrowth: '+26.5% quarter growth',
              avgEscrow: '₦520,000',
              peakVolume: '₦126.8M (Cumulative)',
              timeframeLabel: 'Last 90 Days',
              maxGmv: 140.0,
              ticks: [
                { y: 35, label: '₦140M' },
                { y: 85, label: '₦95M' },
                { y: 135, label: '₦50M' },
                { y: 185, label: '₦0' }
              ],
              points: [
                { label: 'Apr 1', gmv: 52.0, scout: 5.20, gmvText: '₦52.0M', scoutText: '₦5.20M', deals: 280 },
                { label: 'Apr 15', gmv: 64.5, scout: 6.45, gmvText: '₦64.5M', scoutText: '₦6.45M', deals: 340 },
                { label: 'May 1', gmv: 78.2, scout: 7.82, gmvText: '₦78.2M', scoutText: '₦7.82M', deals: 410 },
                { label: 'May 15', gmv: 93.6, scout: 9.36, gmvText: '₦93.6M', scoutText: '₦9.36M', deals: 495 },
                { label: 'Jun 1', gmv: 110.4, scout: 11.04, gmvText: '₦110.4M', scoutText: '₦11.04M', deals: 580 },
                { label: 'Jun 15', gmv: 126.8, scout: 12.68, gmvText: '₦126.8M', scoutText: '₦12.68M', deals: 665 }
              ]
            },
            '1Y': {
              escrowVolume: '₦384.20M',
              escrowGrowth: '+112.5% YoY annual surge',
              netTake: '₦19.21M',
              scoutPaid: '₦38.42M',
              activeTalents: '1,420',
              talentsGrowth: '+145% annual verified',
              avgEscrow: '₦540,000',
              peakVolume: '₦384.2M (Annual)',
              timeframeLabel: 'Trailing 12 Months',
              maxGmv: 420.0,
              ticks: [
                { y: 35, label: '₦400M' },
                { y: 85, label: '₦270M' },
                { y: 135, label: '₦140M' },
                { y: 185, label: '₦0' }
              ],
              points: [
                { label: 'Q3 \'25', gmv: 85.0, scout: 8.50, gmvText: '₦85.0M', scoutText: '₦8.50M', deals: 450 },
                { label: 'Q4 \'25', gmv: 130.0, scout: 13.00, gmvText: '₦130.0M', scoutText: '₦13.00M', deals: 680 },
                { label: 'Nov', gmv: 175.0, scout: 17.50, gmvText: '₦175.0M', scoutText: '₦17.50M', deals: 920 },
                { label: 'Dec', gmv: 220.0, scout: 22.00, gmvText: '₦220.0M', scoutText: '₦22.00M', deals: 1150 },
                { label: 'Jan \'26', gmv: 270.0, scout: 27.00, gmvText: '₦270.0M', scoutText: '₦27.00M', deals: 1410 },
                { label: 'Mar', gmv: 315.0, scout: 31.50, gmvText: '₦315.0M', scoutText: '₦31.50M', deals: 1650 },
                { label: 'May', gmv: 350.0, scout: 35.00, gmvText: '₦350.0M', scoutText: '₦35.00M', deals: 1820 },
                { label: 'Jun', gmv: 384.2, scout: 38.42, gmvText: '₦384.2M', scoutText: '₦38.42M', deals: 2014 }
              ]
            }
          };

          const activeDataset = analyticsDataByPeriod[analyticsPeriod] || analyticsDataByPeriod['30D'];
          const maxVal = activeDataset.maxGmv;
          const numPts = activeDataset.points.length;

          // Compute SVG coordinates (viewBox 0 0 760 220)
          const gmvCoords = activeDataset.points.map((pt, idx) => ({
            x: 60 + (idx / (numPts - 1)) * 640,
            y: 185 - (pt.gmv / maxVal) * 145,
            ...pt
          }));

          const scoutCoords = activeDataset.points.map((pt, idx) => ({
            x: 60 + (idx / (numPts - 1)) * 640,
            y: 185 - (pt.scout / maxVal) * 145,
            ...pt
          }));

          // Smooth Bezier Generator
          const buildBezierPath = (pts: { x: number; y: number }[]) => {
            if (pts.length === 0) return '';
            let path = `M ${pts[0].x} ${pts[0].y}`;
            for (let i = 0; i < pts.length - 1; i++) {
              const p0 = pts[i];
              const p1 = pts[i + 1];
              const cpX = (p0.x + p1.x) / 2;
              path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
            }
            return path;
          };

          const gmvLinePath = buildBezierPath(gmvCoords);
          const gmvAreaPath = `${gmvLinePath} L ${gmvCoords[gmvCoords.length - 1].x} 185 L ${gmvCoords[0].x} 185 Z`;

          const scoutLinePath = buildBezierPath(scoutCoords);
          const scoutAreaPath = `${scoutLinePath} L ${scoutCoords[scoutCoords.length - 1].x} 185 L ${scoutCoords[0].x} 185 Z`;

          const sovereignMarketsList = [
            {
              name: 'Nigeria',
              flag: '🇳🇬',
              code: 'NGN',
              volume: '₦21.40M',
              share: 44,
              deals: 348,
              growth: '+28.4% YoY',
              color: 'var(--rf-leaf-green)',
              gradient: 'linear-gradient(90deg, #10B981 0%, #A3E635 100%)'
            },
            {
              name: 'Kenya',
              flag: '🇰🇪',
              code: 'KES',
              volume: '₦11.20M',
              share: 23,
              deals: 182,
              growth: '+34.1% YoY',
              color: '#38BDF8',
              gradient: 'linear-gradient(90deg, #0284C7 0%, #38BDF8 100%)'
            },
            {
              name: 'Ghana',
              flag: '🇬🇭',
              code: 'GHS',
              volume: '₦6.80M',
              share: 14,
              deals: 105,
              growth: '+19.5% YoY',
              color: '#F4B942',
              gradient: 'linear-gradient(90deg, #D97706 0%, #FBBF24 100%)'
            },
            {
              name: 'South Africa',
              flag: '🇿🇦',
              code: 'ZAR',
              volume: '₦5.30M',
              share: 11,
              deals: 88,
              growth: '+22.0% YoY',
              color: '#C084FC',
              gradient: 'linear-gradient(90deg, #9333EA 0%, #C084FC 100%)'
            },
            {
              name: 'Rwanda & EAC',
              flag: '🇷🇼',
              code: 'RWF',
              volume: '₦3.95M',
              share: 8,
              deals: 64,
              growth: '+41.8% YoY',
              color: '#34D399',
              gradient: 'linear-gradient(90deg, #059669 0%, #34D399 100%)'
            }
          ];

          const talentCategoriesList = [
            {
              division: 'Tech & Software Engineering',
              share: 42,
              count: '596 talents',
              avgRate: '₦480K / milestone',
              icon: Code2,
              color: 'var(--rf-leaf-green)',
              accentBg: 'rgba(102, 187, 42, 0.12)'
            },
            {
              division: 'AI & Data Solutions',
              share: 24,
              count: '340 talents',
              avgRate: '₦620K / milestone',
              icon: Cpu,
              color: '#38BDF8',
              accentBg: 'rgba(56, 189, 248, 0.12)'
            },
            {
              division: 'UI/UX & Product Design',
              share: 18,
              count: '255 talents',
              avgRate: '₦380K / milestone',
              icon: Palette,
              color: '#F4B942',
              accentBg: 'rgba(244, 185, 66, 0.12)'
            },
            {
              division: 'Growth, Marketing & SEO',
              share: 10,
              count: '142 talents',
              avgRate: '₦290K / milestone',
              icon: TrendingUp,
              color: '#EC4899',
              accentBg: 'rgba(236, 72, 153, 0.12)'
            },
            {
              division: 'Product & Business Ops',
              share: 6,
              count: '87 talents',
              avgRate: '₦410K / milestone',
              icon: Briefcase,
              color: '#818CF8',
              accentBg: 'rgba(129, 140, 248, 0.12)'
            }
          ];

          const conversionFunnelList = [
            {
              step: '01',
              title: 'Scout Links Clicked',
              count: '12,840',
              subtext: 'Unique Link Visitors',
              badge: 'Top of Funnel',
              yieldText: '24.8% Signup Yield',
              icon: Globe2,
              color: '#38BDF8'
            },
            {
              step: '02',
              title: 'Vetted Talent Profiles',
              count: '3,180',
              subtext: 'Verified African Talents',
              badge: 'Identity Vetted',
              yieldText: '23.4% Hire Conversion',
              icon: Users,
              color: 'var(--rf-leaf-green)'
            },
            {
              step: '03',
              title: 'Client Funded Escrows',
              count: '745',
              subtext: 'Milestones Safeguarded',
              badge: 'Guaranteed Escrow',
              yieldText: '96.4% Completion',
              icon: Wallet,
              color: '#F4B942'
            },
            {
              step: '04',
              title: 'Clean Settled Payouts',
              count: '718',
              subtext: 'Dispute-Free Releases',
              badge: 'Zero Default',
              yieldText: '96.4% Net Throughput',
              icon: ShieldCheck,
              color: 'var(--rf-leaf-green)'
            }
          ];

          const liveTelemetryTransactions = [
            {
              id: 'TXN-9082',
              talent: 'Oluwaseun Adeyemi',
              role: 'Senior Backend Engineer',
              flag: '🇳🇬',
              country: 'Nigeria',
              escrowVal: '₦2,400,000',
              scoutFee: '₦240,000 (10%)',
              status: 'SETTLED',
              time: '12m ago'
            },
            {
              id: 'TXN-9081',
              talent: 'Faith Wanjiku',
              role: 'AI / LLM Specialist',
              flag: '🇰🇪',
              country: 'Kenya',
              escrowVal: 'KES 285,000 (₦3.42M)',
              scoutFee: 'KES 28,500',
              status: 'SETTLED',
              time: '38m ago'
            },
            {
              id: 'TXN-9080',
              talent: 'Kofi Mensah',
              role: 'Lead UI/UX Designer',
              flag: '🇬🇭',
              country: 'Ghana',
              escrowVal: 'GHS 16,500 (₦1.65M)',
              scoutFee: 'GHS 1,650',
              status: 'IN_ESCROW',
              time: '1h ago'
            },
            {
              id: 'TXN-9079',
              talent: 'Ntsika Khumalo',
              role: 'Smart Contract Auditor',
              flag: '🇿🇦',
              country: 'South Africa',
              escrowVal: 'ZAR 42,000 (₦3.36M)',
              scoutFee: 'ZAR 4,200',
              status: 'SETTLED',
              time: '2h ago'
            }
          ];

          const activePoint = hoveredPointIndex !== null ? gmvCoords[hoveredPointIndex] : null;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Analytics Header & Period Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                      Pan-African Marketplace Analytics
                    </h3>
                    <span className="rf-analytics-badge is-positive" style={{ padding: '0.15rem 0.5rem', fontSize: '0.6875rem' }}>
                      <span className="rf-analytics-pulse-dot" style={{ width: '6px', height: '6px' }} />
                      Telemetry Live
                    </span>
                  </div>
                  <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.35rem' }}>
                    Real-time macro escrow volume, platform take rates, sovereign corridors, and talent conversion pipelines.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="rf-admin-period-group">
                    {(['7D', '30D', '90D', '1Y'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setAnalyticsPeriod(p);
                          setHoveredPointIndex(null);
                        }}
                        className={`rf-admin-period-btn ${analyticsPeriod === p ? 'is-active' : ''}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top 4 Elevated KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
                {/* KPI 1: Escrow Volume */}
                <div className="rf-analytics-kpi-card">
                  <div className="rf-analytics-kpi-top">
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--rf-slate-400)' }}>
                      Total Escrow Volume
                    </span>
                    <div className="rf-analytics-kpi-icon-wrap" style={{ backgroundColor: 'rgba(102, 187, 42, 0.14)', color: 'var(--rf-leaf-green)' }}>
                      <Wallet size={19} />
                    </div>
                  </div>
                  <div className="rf-analytics-kpi-val">
                    {activeDataset.escrowVolume}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span className="rf-analytics-badge is-positive">
                      <ArrowUpRight size={13} />
                      {activeDataset.escrowGrowth}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>
                      {activeDataset.timeframeLabel}
                    </span>
                  </div>
                </div>

                {/* KPI 2: Net Platform Take */}
                <div className="rf-analytics-kpi-card">
                  <div className="rf-analytics-kpi-top">
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--rf-slate-400)' }}>
                      Net Platform Take
                    </span>
                    <div className="rf-analytics-kpi-icon-wrap" style={{ backgroundColor: 'rgba(102, 187, 42, 0.14)', color: 'var(--rf-leaf-green)' }}>
                      <TrendingUp size={19} />
                    </div>
                  </div>
                  <div className="rf-analytics-kpi-val" style={{ color: 'var(--rf-leaf-green)' }}>
                    {activeDataset.netTake}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span className="rf-analytics-badge is-positive">
                      <CheckCircle2 size={13} />
                      5.0% Fixed Fee
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>
                      Escrow Service Monetization
                    </span>
                  </div>
                </div>

                {/* KPI 3: Scout Commissions Paid */}
                <div className="rf-analytics-kpi-card">
                  <div className="rf-analytics-kpi-top">
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--rf-slate-400)' }}>
                      Scout Commissions Paid
                    </span>
                    <div className="rf-analytics-kpi-icon-wrap" style={{ backgroundColor: 'rgba(56, 189, 248, 0.14)', color: '#38BDF8' }}>
                      <Award size={19} />
                    </div>
                  </div>
                  <div className="rf-analytics-kpi-val" style={{ color: '#38BDF8' }}>
                    {activeDataset.scoutPaid}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span className="rf-analytics-badge is-cyan">
                      <ArrowUpRight size={13} />
                      10.0% Guaranteed Bounty
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>
                      Talent Referrers
                    </span>
                  </div>
                </div>

                {/* KPI 4: Active Verified Talents */}
                <div className="rf-analytics-kpi-card">
                  <div className="rf-analytics-kpi-top">
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--rf-slate-400)' }}>
                      Active Verified Talents
                    </span>
                    <div className="rf-analytics-kpi-icon-wrap" style={{ backgroundColor: 'rgba(244, 185, 66, 0.14)', color: '#F4B942' }}>
                      <Users size={19} />
                    </div>
                  </div>
                  <div className="rf-analytics-kpi-val">
                    {activeDataset.activeTalents}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span className="rf-analytics-badge is-amber">
                      <ArrowUpRight size={13} />
                      {activeDataset.talentsGrowth}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>
                      5 Sovereign Hubs
                    </span>
                  </div>
                </div>
              </div>

              {/* Modern Fintech Volume & Trajectory Chart (Stripe / Mercury Standard - Never Stretches) */}
              <div className="rf-fintech-chart-card">
                {/* Dynamic Hero Header with Live Counter */}
                <div className="rf-fintech-chart-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="rf-analytics-badge is-positive" style={{ fontSize: '0.6875rem' }}>
                        <span className="rf-analytics-pulse-dot" style={{ width: '6px', height: '6px' }} />
                        Escrow GMV Trajectory
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                        {hoveredPointIndex !== null
                          ? `${activeDataset.points[hoveredPointIndex].label} 2026 Milestone Snapshot`
                          : activeDataset.timeframeLabel}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      <div className="rf-fintech-chart-main-val">
                        {hoveredPointIndex !== null
                          ? activeDataset.points[hoveredPointIndex].gmvText
                          : activeDataset.escrowVolume}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--rf-leaf-green)' }}>
                        <ArrowUpRight size={15} />
                        <span>
                          {hoveredPointIndex !== null
                            ? `${activeDataset.points[hoveredPointIndex].deals} Contracts Verified`
                            : activeDataset.escrowGrowth}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.78125rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                      {hoveredPointIndex !== null
                        ? `Scout attribution payout: ${activeDataset.points[hoveredPointIndex].scoutText} (10%) across verified talent milestones.`
                        : `Macro volume released to African engineers, designers, and creatives across 5 corridors.`}
                    </p>
                  </div>

                  {/* Series Toggle & Legend */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                    <div className="rf-analytics-chart-controls">
                      {(['ALL', 'ESCROW', 'SCOUT'] as const).map(m => (
                        <button
                          key={m}
                          onClick={() => setAnalyticsMetric(m)}
                          className={`rf-analytics-chart-toggle-btn ${analyticsMetric === m ? 'is-active' : ''}`}
                        >
                          {m === 'ALL' ? 'All Series' : m === 'ESCROW' ? 'Gross GMV' : 'Scout Bounties'}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem' }}>
                      {(analyticsMetric === 'ALL' || analyticsMetric === 'ESCROW') && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--rf-leaf-green)', boxShadow: '0 0 6px rgba(102, 187, 42, 0.5)' }} />
                          <span style={{ color: 'var(--rf-cream)', fontWeight: 600 }}>Gross Escrow (₦)</span>
                        </div>
                      )}
                      {(analyticsMetric === 'ALL' || analyticsMetric === 'SCOUT') && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#38BDF8', boxShadow: '0 0 6px rgba(56, 189, 248, 0.5)' }} />
                          <span style={{ color: 'var(--rf-slate-400)' }}>Scout Attributions</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stage: Responsive Dual-Layer Volume Pillars + Smooth Trend Line */}
                <div className="rf-fintech-chart-stage">
                  {/* Background Reference Lines with Tabular Labels */}
                  <div className="rf-fintech-grid-lines">
                    {activeDataset.ticks.map((t, idx) => (
                      <div key={idx} className="rf-fintech-grid-row">
                        <span className="rf-fintech-grid-label">{t.label}</span>
                        <div className="rf-fintech-grid-line" />
                      </div>
                    ))}
                  </div>

                  {/* Overlay Trend Spline SVG (Mathematically Aligned to Column Centers) */}
                  {(() => {
                    const colW = 1000 / numPts;
                    const splineCoords = activeDataset.points.map((pt, i) => ({
                      cx: colW * i + colW / 2,
                      cy: 235 - (pt.gmv / maxVal) * 195
                    }));
                    const scoutSplineCoords = activeDataset.points.map((pt, i) => ({
                      cx: colW * i + colW / 2,
                      cy: 235 - (pt.scout / maxVal) * 195
                    }));

                    const makePath = (coords: { cx: number; cy: number }[]) => {
                      if (coords.length === 0) return '';
                      let d = `M ${coords[0].cx} ${coords[0].cy}`;
                      for (let i = 0; i < coords.length - 1; i++) {
                        const p0 = coords[i];
                        const p1 = coords[i + 1];
                        const mx = (p0.cx + p1.cx) / 2;
                        d += ` C ${mx} ${p0.cy}, ${mx} ${p1.cy}, ${p1.cx} ${p1.cy}`;
                      }
                      return d;
                    };

                    const gmvPath = makePath(splineCoords);
                    const scoutPath = makePath(scoutSplineCoords);

                    return (
                      <svg
                        className="rf-fintech-trend-svg"
                        viewBox="0 0 1000 240"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="fintechGmvLineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="50%" stopColor="#A3E635" />
                            <stop offset="100%" stopColor="#D4F933" />
                          </linearGradient>
                        </defs>

                        {/* Scout Blue Trend Line */}
                        {(analyticsMetric === 'ALL' || analyticsMetric === 'SCOUT') && (
                          <path
                            d={scoutPath}
                            fill="none"
                            stroke="#38BDF8"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            opacity="0.85"
                          />
                        )}

                        {/* Escrow Emerald Trend Line */}
                        {(analyticsMetric === 'ALL' || analyticsMetric === 'ESCROW') && (
                          <path
                            d={gmvPath}
                            fill="none"
                            stroke="url(#fintechGmvLineGrad)"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Nodes on Line */}
                        {splineCoords.map((pt, i) => {
                          const isHovered = hoveredPointIndex === i;
                          return (
                            <g key={i}>
                              {(analyticsMetric === 'ALL' || analyticsMetric === 'ESCROW') && (
                                <>
                                  {isHovered && (
                                    <circle
                                      cx={pt.cx}
                                      cy={pt.cy}
                                      r="8"
                                      fill="var(--rf-leaf-green)"
                                      fillOpacity="0.3"
                                    />
                                  )}
                                  <circle
                                    cx={pt.cx}
                                    cy={pt.cy}
                                    r={isHovered ? '5' : '3.5'}
                                    fill="var(--rf-bg-surface)"
                                    stroke="var(--rf-leaf-green)"
                                    strokeWidth="2.5"
                                  />
                                </>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    );
                  })()}

                  {/* Responsive Column Pillars */}
                  <div
                    className="rf-fintech-columns-wrapper"
                    style={{ gridTemplateColumns: `repeat(${numPts}, 1fr)` }}
                  >
                    {activeDataset.points.map((pt, idx) => {
                      const isHovered = hoveredPointIndex === idx;
                      const barHeightPct = Math.max(14, (pt.gmv / maxVal) * 85);
                      const scoutHeightPct = Math.max(8, (pt.scout / pt.gmv) * 100);

                      return (
                        <div
                          key={pt.label}
                          className={`rf-fintech-col ${isHovered ? 'is-active' : ''}`}
                          onMouseEnter={() => setHoveredPointIndex(idx)}
                          onMouseLeave={() => setHoveredPointIndex(null)}
                        >
                          {/* Floating Glassmorphic Tooltip Card */}
                          {isHovered && (
                            <div className="rf-fintech-tooltip-card">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--rf-bg-card-border)', paddingBottom: '0.35rem', marginBottom: '0.35rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                                  {pt.label} 2026
                                </span>
                                <span className="rf-analytics-badge is-positive" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>
                                  {pt.deals} Deals
                                </span>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                                  <span style={{ color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--rf-leaf-green)' }} />
                                    Escrow GMV:
                                  </span>
                                  <strong style={{ color: 'var(--rf-cream)' }}>{pt.gmvText}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                                  <span style={{ color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                                    Scout Bounty:
                                  </span>
                                  <strong style={{ color: '#38BDF8' }}>{pt.scoutText}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', paddingTop: '0.25rem', borderTop: '1px solid var(--rf-bg-card-border)', fontSize: '0.7rem' }}>
                                  <span style={{ color: 'var(--rf-slate-400)' }}>Net Take (5%):</span>
                                  <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 700 }}>
                                    ₦{(pt.gmv * 0.05).toFixed(2)}M
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Modern Volume Pillar Bar */}
                          <div
                            className="rf-fintech-bar-pillar"
                            style={{
                              height: `${barHeightPct}%`,
                              background: isHovered
                                ? 'linear-gradient(180deg, #A3E635 0%, #2E7D32 60%, rgba(13, 34, 22, 0.9) 100%)'
                                : 'linear-gradient(180deg, rgba(163, 230, 53, 0.85) 0%, rgba(46, 125, 50, 0.6) 60%, rgba(13, 34, 22, 0.4) 100%)',
                              border: isHovered ? '1px solid rgba(163, 230, 53, 0.8)' : '1px solid rgba(102, 187, 42, 0.35)'
                            }}
                          >
                            <span className="rf-fintech-bar-glow-cap" />

                            {/* Nested Scout Attribution Layer */}
                            {(analyticsMetric === 'ALL' || analyticsMetric === 'SCOUT') && (
                              <div
                                style={{
                                  width: '100%',
                                  height: `${scoutHeightPct}%`,
                                  background: 'linear-gradient(180deg, #38BDF8 0%, rgba(2, 132, 199, 0.5) 100%)',
                                  borderRadius: '0 0 2px 2px'
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Responsive Bottom Month Axis Labels */}
                  <div
                    className="rf-fintech-col-footer"
                    style={{ gridTemplateColumns: `repeat(${numPts}, 1fr)` }}
                  >
                    {activeDataset.points.map((pt, idx) => (
                      <span
                        key={pt.label}
                        className={`rf-fintech-col-label ${hoveredPointIndex === idx ? 'is-active' : ''}`}
                      >
                        {pt.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chart Micro Footer Metrics */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--rf-bg-card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--rf-slate-400)' }}>Peak Milestone Volume:</span>
                    <strong style={{ color: 'var(--rf-cream)' }}>{activeDataset.peakVolume}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--rf-slate-400)' }}>Avg Milestone Escrow:</span>
                    <strong style={{ color: 'var(--rf-cream)' }}>{activeDataset.avgEscrow}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--rf-slate-400)' }}>Settlement Clearance:</span>
                    <strong style={{ color: 'var(--rf-leaf-green)' }}>&lt; 2.4 hrs post-signoff</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--rf-slate-400)' }}>Corridors Active:</span>
                    <strong style={{ color: '#38BDF8' }}>5 Sovereign Corridors</strong>
                  </div>
                </div>
              </div>

              {/* Split Row: Sovereign Markets Leaderboard & Category Distribution */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {/* Sovereign Markets Leaderboard */}
                <div className="rf-analytics-chart-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                        Top Sovereign Markets by Volume
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                        Macro escrow throughput across Pan-African fiat corridors.
                      </p>
                    </div>
                    <span className="rf-analytics-badge is-positive">
                      5 Active Corridors
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sovereignMarketsList.map((c, idx) => (
                      <div key={c.name} className="rf-analytics-market-row">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="rf-analytics-rank-chip">#{idx + 1}</span>
                            <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>
                            <span style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{c.name}</span>
                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--rf-bg-deep)', color: 'var(--rf-slate-400)' }}>
                              {c.code}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 800, color: 'var(--rf-cream)' }}>
                              {c.volume}
                            </span>
                            <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem', marginLeft: '0.35rem', fontWeight: 600 }}>
                              ({c.share}%)
                            </span>
                          </div>
                        </div>

                        {/* Custom Modern Progress Bar */}
                        <div className="rf-admin-progress-bar" style={{ height: '7px' }}>
                          <div
                            className="rf-admin-progress-fill"
                            style={{ width: `${c.share}%`, background: c.gradient }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>
                          <span>{c.deals} verified contracts funded</span>
                          <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 700 }}>{c.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--rf-bg-card-border)', fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>
                    <span className="rf-analytics-pulse-dot" style={{ width: '6px', height: '6px' }} />
                    <span>Real-time local fiat clearance via Flutterwave, Paystack, and M-Pesa.</span>
                  </div>
                </div>

                {/* Talent Category Distribution */}
                <div className="rf-analytics-chart-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                        Talent Category Distribution
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                        Headcount and milestone velocity across high-skill divisions.
                      </p>
                    </div>
                    <span className="rf-analytics-badge is-cyan">
                      1,420 Hired
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {talentCategoriesList.map(d => {
                      const IconComp = d.icon;
                      return (
                        <div key={d.division} className="rf-analytics-market-row">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: d.accentBg, color: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconComp size={14} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{d.division}</div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontWeight: 800, color: 'var(--rf-cream)' }}>
                                {d.share}%
                              </span>
                              <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.72rem', marginLeft: '0.35rem' }}>
                                ({d.count})
                              </span>
                            </div>
                          </div>

                          <div className="rf-admin-progress-bar" style={{ height: '7px' }}>
                            <div
                              className="rf-admin-progress-fill"
                              style={{ width: `${d.share}%`, background: d.color }}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>
                            <span>Avg contract benchmark:</span>
                            <span style={{ color: 'var(--rf-cream)', fontWeight: 600 }}>{d.avgRate}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--rf-bg-card-border)', fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>
                    <Zap size={13} style={{ color: '#F4B942' }} />
                    <span>Top skill surging this month: TypeScript Fullstack and AI/LLM Prompt Engineering.</span>
                  </div>
                </div>
              </div>

              {/* Connected Conversion Funnel Pipeline */}
              <div className="rf-analytics-chart-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                      Pan-African Platform Conversion Pipeline
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                      End-to-end attribution conversion from initial Scout link visit to dispute-free milestone payout.
                    </p>
                  </div>
                  <span className="rf-analytics-badge is-positive">
                    96.4% Escrow Settlement Rate
                  </span>
                </div>

                <div className="rf-analytics-funnel-pipeline">
                  {conversionFunnelList.map(item => {
                    const StageIcon = item.icon;
                    return (
                      <div key={item.step} className="rf-analytics-funnel-step">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: 'var(--rf-bg-deep)', color: 'var(--rf-slate-400)' }}>
                            STAGE {item.step}
                          </span>
                          <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: 'var(--rf-bg-deep)', color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <StageIcon size={16} />
                          </div>
                        </div>

                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                          {item.count}
                        </div>

                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', marginTop: '0.35rem' }}>
                          {item.title}
                        </div>

                        <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)', marginTop: '0.2rem' }}>
                          {item.subtext}
                        </div>

                        <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--rf-bg-card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: item.color }}>
                            {item.yieldText}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--rf-slate-400)' }}>
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-Time Settlement Telemetry & Escrow Ledger */}
              <div className="rf-analytics-chart-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                      Live Escrow Settlement Telemetry
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                      Recent automated escrow milestone clearances with guaranteed Scout attribution.
                    </p>
                  </div>
                  <span className="rf-analytics-badge is-positive">
                    <span className="rf-analytics-pulse-dot" style={{ width: '6px', height: '6px' }} />
                    Zero Pending Disputes
                  </span>
                </div>

                <div className="rf-admin-table-container">
                  <table className="rf-admin-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Talent & Sovereign Hub</th>
                        <th>Role / Skillset</th>
                        <th>Milestone Volume</th>
                        <th>Scout Attribution (10%)</th>
                        <th>Settlement Status</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveTelemetryTransactions.map(tx => (
                        <tr key={tx.id}>
                          <td>
                            <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--rf-leaf-green)' }}>
                              {tx.id}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span>{tx.flag}</span>
                              <span style={{ fontWeight: 700 }}>{tx.talent}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>({tx.country})</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                              {tx.role}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 800, color: 'var(--rf-cream)' }}>
                              {tx.escrowVal}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: '#38BDF8' }}>
                              {tx.scoutFee}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`rf-analytics-badge ${tx.status === 'SETTLED' ? 'is-positive' : 'is-amber'}`}
                              style={{ padding: '0.15rem 0.5rem' }}
                            >
                              {tx.status === 'SETTLED' ? 'SETTLED' : 'IN ESCROW'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                              {tx.time}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================================
            TAB 3: PIONEER APPLICATIONS
            ======================================================== */}
        {activeTab === 'PIONEERS' && (
          <div>
            {/* Filter & Search Bar */}
            <div className="rf-admin-card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
                  <input
                    type="text"
                    className="rf-input"
                    placeholder="Search applicant name, email, WhatsApp, or skills..."
                    value={pioneerSearchQuery}
                    onChange={e => setPioneerSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.2rem', fontSize: '0.8125rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <select
                    className="rf-select"
                    value={pioneerDivisionFilter}
                    onChange={e => setPioneerDivisionFilter(e.target.value)}
                    style={{ fontSize: '0.8125rem', width: 'auto' }}
                  >
                    <option value="ALL">All Divisions</option>
                    <option value="TECH_PRODUCT">Tech & Product</option>
                    <option value="CREATIVE">Creative</option>
                    <option value="GROWTH">Growth</option>
                    <option value="BUSINESS">Business</option>
                    <option value="COMMUNITY">Community</option>
                  </select>

                  <select
                    className="rf-select"
                    value={pioneerStatusFilter}
                    onChange={e => setPioneerStatusFilter(e.target.value)}
                    style={{ fontSize: '0.8125rem', width: 'auto' }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending Review</option>
                    <option value="REVIEWING">In Review</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="WAITLISTED">Waitlisted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  <select
                    className="rf-select"
                    value={pioneerCountryFilter}
                    onChange={e => setPioneerCountryFilter(e.target.value)}
                    style={{ fontSize: '0.8125rem', width: 'auto' }}
                  >
                    <option value="ALL">All Countries</option>
                    {AFRICAN_COUNTRIES.map(c => (
                      <option key={c.iso_code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="rf-admin-table-container">
              <table className="rf-admin-table">
                <thead>
                  <tr>
                    <th>App #</th>
                    <th>Applicant</th>
                    <th>Country</th>
                    <th>Division</th>
                    <th>Cohort</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pioneerAppsList
                    .filter(app => {
                      const matchQuery = !pioneerSearchQuery ||
                        app.full_name.toLowerCase().includes(pioneerSearchQuery.toLowerCase()) ||
                        app.email.toLowerCase().includes(pioneerSearchQuery.toLowerCase()) ||
                        app.application_number.toLowerCase().includes(pioneerSearchQuery.toLowerCase()) ||
                        (app.skills && app.skills.toLowerCase().includes(pioneerSearchQuery.toLowerCase()));
                      const matchDivision = pioneerDivisionFilter === 'ALL' || app.primary_division === pioneerDivisionFilter;
                      const matchStatus = pioneerStatusFilter === 'ALL' || app.status === pioneerStatusFilter;
                      const matchCountry = pioneerCountryFilter === 'ALL' || app.country === pioneerCountryFilter;
                      return matchQuery && matchDivision && matchStatus && matchCountry;
                    })
                    .map(app => {
                      const isPending = app.status === 'PENDING';
                      const isAccepted = app.status === 'ACCEPTED';

                      return (
                        <tr key={app.id}>
                          <td style={{ fontFamily: 'var(--rf-font-mono)', fontSize: '0.78rem', color: 'var(--rf-slate-400)' }}>
                            {app.application_number}
                          </td>

                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{app.full_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>{app.email}</div>
                          </td>

                          <td style={{ fontWeight: 600 }}>{app.country}</td>

                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                backgroundColor: 'var(--rf-bg-deep)',
                                border: '1px solid var(--rf-bg-card-border)',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}
                            >
                              {app.primary_division || 'GENERAL'}
                            </span>
                          </td>

                          <td>
                            {app.is_founding_100 ? (
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F6B21A' }}>
                                ★ Founding 100
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>Standard</span>
                            )}
                          </td>

                          <td>
                            <span
                              className={`rf-badge ${isAccepted ? 'rf-badge-mint' : isPending ? 'rf-badge-warning' : 'rf-badge-neutral'} rf-text-xs`}
                              style={{ fontWeight: 800 }}
                            >
                              {app.status}
                            </span>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                setSelectedPioneerApp(app);
                                setEditingNotes(app.internal_notes || '');
                              }}
                              className="rf-btn rf-btn-secondary rf-btn-sm"
                              style={{ gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              <Eye size={13} />
                              <span>Review</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: VERIFICATIONS (KYC)
            ======================================================== */}
        {activeTab === 'VERIFICATIONS' && (
          <div>
            <div className="rf-admin-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Identity & Biometric KYC Queue
              </h3>
              <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                Review live face captures side-by-side with government IDs to grant Tier 2 Verified Sovereign badges.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {kycQueue.map(item => (
                <div key={item.id} className="rf-admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                          {item.name}
                        </span>
                        <span className="rf-badge rf-badge-neutral rf-text-xs">
                          {item.country}
                        </span>
                        <span
                          className={`rf-badge ${item.status === 'VERIFIED' ? 'rf-badge-mint' : item.status === 'REJECTED' ? 'rf-badge-danger' : 'rf-badge-warning'} rf-text-xs`}
                          style={{ fontWeight: 800 }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                        {item.role} • Application ID: <strong style={{ color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>{item.id}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>
                        Match Score: {item.match_confidence}%
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>
                        Document Validated
                      </div>
                    </div>
                  </div>

                  {/* Side by side comparison */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    {/* ID Document Photo */}
                    <div className="rf-admin-box-subtle">
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)', marginBottom: '0.4rem' }}>
                        {item.id_type} ({item.doc_number})
                      </div>
                      <div style={{ height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--rf-bg-card-border)' }}>
                        <img src={item.id_photo} alt="ID Document" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>

                    {/* Live Captured Face */}
                    <div className="rf-admin-box-subtle">
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', marginBottom: '0.4rem' }}>
                        Live Face Capture
                      </div>
                      <div style={{ height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--rf-leaf-green)' }}>
                        <img src={item.face_capture} alt="Face Snapshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>

                    {/* Details Summary */}
                    <div className="rf-admin-box-subtle" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '0.8125rem', gap: '0.35rem' }}>
                      <div>
                        <span style={{ color: 'var(--rf-slate-400)' }}>Legal Name: </span>
                        <strong style={{ color: 'var(--rf-cream)' }}>{item.legal_name_on_doc}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--rf-slate-400)' }}>DOB: </span>
                        <strong style={{ color: 'var(--rf-cream)' }}>{item.dob}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--rf-slate-400)' }}>ID Number: </span>
                        <strong style={{ color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>{item.doc_number}</strong>
                      </div>
                      <div style={{ color: 'var(--rf-leaf-green)', fontWeight: 700, marginTop: '0.25rem' }}>
                        ✓ Biometric Match Confirmed
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {item.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => handleRejectKyc(item.id, item.name)}
                        className="rf-btn rf-btn-secondary rf-btn-sm"
                      >
                        Request Face Retake
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveKyc(item.id, item.name)}
                        className="rf-btn rf-btn-primary rf-btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <UserCheck size={14} />
                        <span>Approve Tier 2 Verified</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: DISPUTES & CLAIMS
            ======================================================== */}
        {activeTab === 'DISPUTES' && (
          <div>
            <div className="rf-admin-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Escrow & Milestone Dispute Arbitration
              </h3>
              <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                Inspect disputed milestones, inspect deliverables, and issue final binding payout or refund rulings.
              </p>
            </div>

            {disputesList.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {disputesList.map(disp => (
                  <div key={disp.id} className="rf-admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <span className="rf-badge rf-badge-danger rf-text-xs" style={{ marginBottom: '0.25rem' }}>
                          {disp.status}
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                          {disp.project_title} ({disp.id})
                        </h4>
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        {formatMoney(disp.disputed_amount)}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-400)', marginBottom: '1rem' }}>
                      <strong style={{ color: 'var(--rf-cream)' }}>Reason:</strong> {disp.reason} — {disp.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleAdminResolveDispute(disp.id, 'RESOLVED_CLIENT', 'Admin issued refund to client upon deliverable review.')}
                        className="rf-btn rf-btn-secondary rf-btn-sm"
                        style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      >
                        Refund Client ({formatMoney(disp.disputed_amount)})
                      </button>
                      <button
                        onClick={() => handleAdminResolveDispute(disp.id, 'RESOLVED_TALENT', 'Admin approved payout to talent upon verified work submission.')}
                        className="rf-btn rf-btn-primary rf-btn-sm"
                      >
                        Release Funds to Talent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rf-admin-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', marginBottom: '2rem' }}>
                <CheckCircle2 size={32} color="var(--rf-leaf-green)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  No Active Disputes
                </h4>
                <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  All platform client-talent milestones are running smoothly without conflicts.
                </p>
              </div>
            )}

            {/* Client Introductions / Airfee Claims Queue */}
            <div className="rf-admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                    Client Introduction Airfee Claims
                  </h3>
                  <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                    Verify scout introductions that completed a hire to award monthly fee waivers.
                  </p>
                </div>
                <span className="rf-badge rf-badge-mint rf-text-xs">
                  {clientIntroductionsList.filter(i => i.status === 'HIRE_COMPLETED_PENDING_ADMIN').length} Ready for Grant
                </span>
              </div>

              <div className="rf-admin-table-container">
                <table className="rf-admin-table">
                  <thead>
                    <tr>
                      <th>Scout</th>
                      <th>Client Submitted</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientIntroductionsList.map(intro => (
                      <tr key={intro.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{intro.scout_name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>Code: {intro.referral_link_code}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{intro.client_contact_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>{intro.company_name}</div>
                        </td>
                        <td>
                          <span className={`rf-badge ${intro.status === 'VERIFIED_GRANTED' ? 'rf-badge-mint' : intro.status === 'HIRE_COMPLETED_PENDING_ADMIN' ? 'rf-badge-warning' : 'rf-badge-neutral'} rf-text-xs`}>
                            {intro.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {intro.status === 'HIRE_COMPLETED_PENDING_ADMIN' ? (
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => setRejectingIntroId(intro.id)}
                                className="rf-btn rf-btn-secondary rf-btn-sm"
                                style={{ color: '#EF4444', fontSize: '0.75rem' }}
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => {
                                  approveAndGrantAirfeeToken(intro.id);
                                  showToast('Token Granted', `Airfee Token granted to ${intro.scout_name}.`, 'SUCCESS');
                                }}
                                className="rf-btn rf-btn-primary rf-btn-sm"
                                style={{ fontSize: '0.75rem' }}
                              >
                                Grant Token
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: COUNTRIES (54) WITH ALL 5 STATUS OPTIONS
            ======================================================== */}
        {activeTab === 'COUNTRIES' && (
          <div className="rf-admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  54 African Sovereign Markets Engine
                </h3>
                <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Configure country status across all operational tiers: Full, Payments Only, Payouts Only, Marketplace Only, or Coming Soon.
                </p>
              </div>

              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
                <input
                  type="text"
                  className="rf-input"
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  placeholder="Search countries or ISO..."
                  style={{ paddingLeft: '2.2rem', fontSize: '0.8125rem' }}
                />
              </div>
            </div>

            <div className="rf-admin-table-container">
              <table className="rf-admin-table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>ISO</th>
                    <th>Currency</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: 'right' }}>Select Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCountries.map(country => {
                    const setting = countrySettings[country.id] || { status: country.status };

                    return (
                      <tr key={country.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <CountryFlag countryIsoOrName={country.iso_code} showName={false} />
                            <span style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{country.name}</span>
                          </div>
                        </td>

                        <td style={{ fontFamily: 'var(--rf-font-mono)', fontSize: '0.78rem', color: 'var(--rf-slate-400)' }}>
                          {country.iso_code}
                        </td>

                        <td style={{ fontWeight: 600 }}>{country.currency_code}</td>

                        <td>
                          <span
                            className={`rf-badge ${
                              setting.status === 'FULLY_OPERATIONAL'
                                ? 'rf-badge-mint'
                                : setting.status === 'PAYMENTS_ENABLED'
                                ? 'rf-badge-blue'
                                : setting.status === 'PAYOUTS_ENABLED'
                                ? 'rf-badge-reward'
                                : setting.status === 'MARKETPLACE_ONLY'
                                ? 'rf-badge-warning'
                                : 'rf-badge-neutral'
                            } rf-text-xs`}
                          >
                            {setting.status}
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <select
                            className="rf-admin-status-select"
                            value={setting.status}
                            onChange={e => handleCountryToggle(country.id, e.target.value as CountryMarketplaceStatus)}
                          >
                            <option value="FULLY_OPERATIONAL">Fully Operational (All Features)</option>
                            <option value="PAYMENTS_ENABLED">Payments Enabled (Clients Pay)</option>
                            <option value="PAYOUTS_ENABLED">Payouts Enabled (Talents Withdraw)</option>
                            <option value="MARKETPLACE_ONLY">Marketplace Only (Discovery)</option>
                            <option value="COMING_SOON">Coming Soon (Waitlist)</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: STAFF & TEAM (DEDICATED SEPARATE TAB)
            ======================================================== */}
        {activeTab === 'TEAM' && (
          <div className="rf-admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Staff & Team Access Management
                </h3>
                <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Manage administrators, editors, community coordinators, and dispute arbiters with role-based access control.
                </p>
              </div>

              <button
                onClick={() => setShowAddTeamModal(true)}
                className="rf-btn rf-btn-primary rf-btn-sm"
                style={{ gap: '0.35rem', fontWeight: 700 }}
              >
                <PlusCircle size={15} />
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="rf-admin-table-container">
              <table className="rf-admin-table">
                <thead>
                  <tr>
                    <th>Team Member</th>
                    <th>Role & Scope</th>
                    <th>2FA</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <img
                            src={member.avatar}
                            alt={member.name}
                            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{member.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>{member.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--rf-cream)' }}>
                          {member.roleTitle}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 700 }}>
                          <ShieldCheck size={13} />
                          <span>Enforced</span>
                        </div>
                      </td>

                      <td>
                        <span className={`rf-badge ${member.status === 'ACTIVE' ? 'rf-badge-mint' : 'rf-badge-warning'} rf-text-xs`}>
                          {member.status}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            onClick={() => handleToggleWorkerStatus(member.id, member.status)}
                            className="rf-btn rf-btn-secondary rf-btn-sm"
                            style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
                          >
                            {member.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>

                          {member.id !== 'TM-001' && (
                            <button
                              onClick={() => handleDeleteWorker(member.id, member.name)}
                              className="rf-btn rf-btn-secondary rf-btn-sm"
                              style={{ padding: '0.25rem 0.4rem', color: '#EF4444' }}
                              title="Delete Member"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: PLATFORM SETTINGS (DEDICATED SEPARATE TAB)
            ======================================================== */}
        {activeTab === 'SETTINGS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Platform Economics Form */}
            <div className="rf-admin-card">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>
                Platform Economics & Escrow Parameters
              </h3>
              <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                Configure platform fee percentages and funds settlement holding windows.
              </p>

              <form onSubmit={handleSavePlatformSettings}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Platform Protection Fee (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="rf-input"
                      value={platformFee}
                      onChange={e => setPlatformFee(e.target.value)}
                    />
                  </div>

                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Min Referral Reward (%)</label>
                    <input
                      type="number"
                      step="1"
                      className="rf-input"
                      value={minRef}
                      onChange={e => setMinRef(e.target.value)}
                    />
                  </div>

                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Max Referral Reward (%)</label>
                    <input
                      type="number"
                      step="1"
                      className="rf-input"
                      value={maxRef}
                      onChange={e => setMaxRef(e.target.value)}
                    />
                  </div>

                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Payout Hold Window (Days)</label>
                    <input
                      type="number"
                      className="rf-input"
                      value={holdDays}
                      onChange={e => setHoldDays(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="rf-btn rf-btn-primary" style={{ gap: '0.4rem', fontWeight: 700 }}>
                  <Save size={15} />
                  <span>Save Economics Settings</span>
                </button>
              </form>
            </div>

            {/* Audit Logs Table */}
            <div className="rf-admin-card">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>
                Immutable Governance Audit Trail
              </h3>
              <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                Cryptographic tamper-evident operational logs for forensic review.
              </p>

              <div className="rf-admin-table-container">
                <table className="rf-admin-table">
                  <thead>
                    <tr>
                      <th>Event ID</th>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Actor</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ fontFamily: 'var(--rf-font-mono)', fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                          {log.id}
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td style={{ fontWeight: 700 }}>{log.action}</td>
                        <td style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem' }}>{log.actor_name || 'System Admin'}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--rf-slate-400)' }}>{log.reason || `${log.object_type}: ${log.object_id}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL: PIONEER APPLICATION REVIEW MODAL (THEME-AWARE)
          ======================================================== */}
      {selectedPioneerApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setSelectedPioneerApp(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--rf-bg-surface)',
              border: '1px solid var(--rf-bg-card-border)',
              borderRadius: 'var(--rf-radius-lg)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: 'var(--rf-shadow-xl)',
              color: 'var(--rf-cream)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rf-leaf-green)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  <Award size={13} />
                  <span>Pioneer Admissions Review</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  {selectedPioneerApp.full_name}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                  {selectedPioneerApp.application_number} • {selectedPioneerApp.email} • {selectedPioneerApp.country}
                </div>
              </div>

              <button
                onClick={() => setSelectedPioneerApp(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--rf-slate-400)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Application Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="rf-admin-box-subtle" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Selected Roles</span>
                  <div style={{ fontWeight: 700, color: 'var(--rf-cream)', fontSize: '0.8125rem', marginTop: '2px' }}>
                    {selectedPioneerApp.roles.join(', ')}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Availability</span>
                  <div style={{ fontWeight: 700, color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', marginTop: '2px' }}>
                    {selectedPioneerApp.availability || 'Not specified'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Source</span>
                  <div style={{ fontWeight: 700, color: 'var(--rf-cream)', fontSize: '0.8125rem', marginTop: '2px' }}>
                    {selectedPioneerApp.discovery_source || 'Direct'}
                  </div>
                </div>
              </div>

              {selectedPioneerApp.skills && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Skills</span>
                  <p style={{ color: 'var(--rf-cream)', fontSize: '0.875rem', marginTop: '0.25rem', padding: '0.6rem 0.85rem', borderRadius: 'var(--rf-radius-sm)', backgroundColor: 'var(--rf-bg-deep)', border: '1px solid var(--rf-bg-card-border)' }}>
                    {selectedPioneerApp.skills}
                  </p>
                </div>
              )}

              {selectedPioneerApp.portfolio_url && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Portfolio Link</span>
                  <div style={{ marginTop: '0.25rem' }}>
                    <a
                      href={selectedPioneerApp.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#38BDF8', fontSize: '0.875rem', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      {selectedPioneerApp.portfolio_url} <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              )}

              {selectedPioneerApp.motivation && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Motivation</span>
                  <p style={{ color: 'var(--rf-cream)', fontSize: '0.875rem', marginTop: '0.25rem', padding: '0.6rem 0.85rem', borderRadius: 'var(--rf-radius-sm)', backgroundColor: 'var(--rf-bg-deep)', border: '1px solid var(--rf-bg-card-border)' }}>
                    {selectedPioneerApp.motivation}
                  </p>
                </div>
              )}

              {/* Admissions Decision Controls */}
              <div className="rf-admin-box-subtle" style={{ marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                  Admissions Decision
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Decision Status</label>
                    <select
                      className="rf-select"
                      value={selectedPioneerApp.status}
                      onChange={e => {
                        const newStatus = e.target.value as any;
                        const updated = { ...selectedPioneerApp, status: newStatus };
                        setSelectedPioneerApp(updated);
                        setPioneerAppsList(prev => prev.map(a => a.id === updated.id ? updated : a));
                        if (isSupabaseConfigured) {
                          supabase.from('pioneer_applications').update({ status: newStatus }).eq('id', selectedPioneerApp.id);
                        }
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWING">REVIEWING</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="WAITLISTED">WAITLISTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Assigned Division</label>
                    <select
                      className="rf-select"
                      value={selectedPioneerApp.primary_division || 'TECH_PRODUCT'}
                      onChange={e => {
                        const newDiv = e.target.value;
                        const updated = { ...selectedPioneerApp, primary_division: newDiv };
                        setSelectedPioneerApp(updated);
                        setPioneerAppsList(prev => prev.map(a => a.id === updated.id ? updated : a));
                        if (isSupabaseConfigured) {
                          supabase.from('pioneer_applications').update({ primary_division: newDiv }).eq('id', selectedPioneerApp.id);
                        }
                      }}
                    >
                      <option value="TECH_PRODUCT">Tech & Product</option>
                      <option value="CREATIVE">Creative</option>
                      <option value="GROWTH">Growth</option>
                      <option value="BUSINESS">Business</option>
                      <option value="COMMUNITY">Community</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="checkbox"
                    id="founding100Check"
                    checked={selectedPioneerApp.is_founding_100}
                    onChange={e => {
                      const checked = e.target.checked;
                      const updated = { ...selectedPioneerApp, is_founding_100: checked };
                      setSelectedPioneerApp(updated);
                      setPioneerAppsList(prev => prev.map(a => a.id === updated.id ? updated : a));
                    }}
                  />
                  <label htmlFor="founding100Check" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)', cursor: 'pointer' }}>
                    ★ Designate as Founding 100 Pioneer
                  </label>
                </div>

                <div className="rf-form-group" style={{ margin: 0 }}>
                  <label className="rf-label">Admissions Notes</label>
                  <textarea
                    rows={2}
                    className="rf-input"
                    placeholder="Confidential admissions review notes..."
                    value={editingNotes}
                    onChange={e => setEditingNotes(e.target.value)}
                    style={{ fontSize: '0.8125rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setSelectedPioneerApp(null)}
                className="rf-btn rf-btn-secondary"
                style={{ fontSize: '0.8125rem' }}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const generatedId = selectedPioneerApp.pioneer_id || `PION-${Math.floor(100 + Math.random() * 900)}`;
                  const updated: PioneerApplication = {
                    ...selectedPioneerApp,
                    status: 'ACCEPTED',
                    pioneer_id: generatedId,
                    internal_notes: editingNotes
                  };
                  setSelectedPioneerApp(updated);
                  setPioneerAppsList(prev => prev.map(a => a.id === updated.id ? updated : a));

                  if (isSupabaseConfigured) {
                    supabase.from('pioneer_applications').update({
                      status: 'ACCEPTED',
                      pioneer_id: generatedId,
                      internal_notes: editingNotes
                    }).eq('id', selectedPioneerApp.id);
                  }

                  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                  showToast('Pioneer Accepted', `${selectedPioneerApp.full_name} accepted as ${generatedId}.`, 'SUCCESS');
                  setSelectedPioneerApp(null);
                }}
                className="rf-btn rf-btn-primary"
                style={{ fontSize: '0.8125rem', fontWeight: 800, gap: '0.35rem' }}
              >
                <CheckCircle2 size={15} />
                <span>Accept & Grant Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD TEAM MEMBER (THEME-AWARE)
          ======================================================== */}
      {showAddTeamModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowAddTeamModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--rf-bg-surface)',
              border: '1px solid var(--rf-bg-card-border)',
              borderRadius: 'var(--rf-radius-lg)',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: 'var(--rf-shadow-xl)',
              color: 'var(--rf-cream)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Add Staff / Team Member
                </h3>
                <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Assign role-based administrator access for platform operations.
                </p>
              </div>

              <button
                onClick={() => setShowAddTeamModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTeamMember}>
              <div className="rf-form-group">
                <label className="rf-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  placeholder="e.g. Amina Diallo"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Work Email</label>
                <input
                  type="email"
                  required
                  className="rf-input"
                  placeholder="e.g. amina@refeir.africa"
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Country Jurisdiction</label>
                <select
                  className="rf-select"
                  value={newMemberCountry}
                  onChange={e => {
                    const country = AFRICAN_COUNTRIES.find(c => c.name === e.target.value);
                    setNewMemberCountry(e.target.value);
                    if (country) setNewMemberCountryIso(country.iso_code);
                  }}
                >
                  {AFRICAN_COUNTRIES.map(c => (
                    <option key={c.iso_code} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Role Preset</label>
                <select
                  className="rf-select"
                  value={newMemberRole}
                  onChange={e => handleRolePresetChange(e.target.value as any)}
                >
                  <option value="COMMUNITY_MANAGER">Community Manager</option>
                  <option value="CONTENT_EDITOR">Content & Website Editor</option>
                  <option value="DISPUTE_ARBITER">Dispute Arbiter</option>
                  <option value="COMPLIANCE_OFFICER">Trust & KYC Officer</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="rf-btn rf-btn-secondary"
                  style={{ fontSize: '0.8125rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rf-btn rf-btn-primary"
                  style={{ fontSize: '0.8125rem', fontWeight: 800 }}
                >
                  Provision Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: REJECT CLAIM (THEME-AWARE)
          ======================================================== */}
      {rejectingIntroId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setRejectingIntroId(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--rf-bg-surface)',
              border: '1px solid var(--rf-bg-card-border)',
              borderRadius: 'var(--rf-radius-lg)',
              maxWidth: '460px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: 'var(--rf-shadow-xl)',
              color: 'var(--rf-cream)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#EF4444' }}>
              <XCircle size={20} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Reject Introduction Claim
              </h3>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginBottom: '1.25rem' }}>
              Specify the reason why this claim does not qualify for an Airfee Token award.
            </p>

            <div className="rf-form-group">
              <label className="rf-label">Rejection Reason</label>
              <textarea
                className="rf-input"
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                style={{ fontSize: '0.8125rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setRejectingIntroId(null)}
                className="rf-btn rf-btn-secondary"
                style={{ fontSize: '0.8125rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectClientIntroduction(rejectingIntroId, rejectReason);
                  setRejectingIntroId(null);
                  showToast('Claim Rejected', 'Client introduction claim rejected.', 'INFO');
                }}
                className="rf-btn rf-btn-danger"
                style={{ fontSize: '0.8125rem', fontWeight: 800 }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
