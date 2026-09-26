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
  Sparkles,
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
  UserPlus
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

export type AdminWebsiteTab = 'OVERVIEW' | 'PIONEERS' | 'VERIFICATIONS' | 'DISPUTES' | 'COUNTRIES' | 'SETTINGS';

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
        DASHBOARDS: 'OVERVIEW',
        PIONEERS: 'PIONEERS',
        VERIFICATIONS: 'VERIFICATIONS',
        DISPUTES: 'DISPUTES',
        AIRFEE: 'DISPUTES',
        COUNTRIES: 'COUNTRIES',
        SETTINGS: 'SETTINGS',
        TEAM: 'SETTINGS',
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
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
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
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
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [teamRoleFilter, setTeamRoleFilter] = useState<string>('ALL');
  const [editingPermissionsMember, setEditingPermissionsMember] = useState<TeamMember | null>(null);

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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
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
      'SETTINGS'
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

  const handleSaveEditedPermissions = (member: TeamMember) => {
    setTeamMembers(prev => prev.map(m => m.id === member.id ? member : m));
    setEditingPermissionsMember(null);
    showToast('Permissions Updated', `Access privileges updated for ${member.name}.`, 'SUCCESS');
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
      id_photo: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400&auto=format&fit=crop&q=80',
      face_capture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
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
      id_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      face_capture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
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
      icon: Sparkles,
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
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
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
              Central executive hub for admissions, escrow disputes, identity verifications, and country configurations.
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

        {/* Modern Minimalist Tab Bar (6 Core Tabs) */}
        <nav className="rf-admin-tabs-nav">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`rf-admin-tab-btn ${activeTab === 'OVERVIEW' ? 'is-active' : ''}`}
          >
            <Activity size={14} />
            <span>Overview</span>
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
            onClick={() => setActiveTab('SETTINGS')}
            className={`rf-admin-tab-btn ${activeTab === 'SETTINGS' ? 'is-active' : ''}`}
          >
            <Settings size={14} />
            <span>Settings & Team</span>
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
            TAB 2: PIONEER APPLICATIONS
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
            TAB 3: VERIFICATIONS (KYC)
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
            TAB 4: DISPUTES & CLAIMS
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
            TAB 5: COUNTRIES (54)
            ======================================================== */}
        {activeTab === 'COUNTRIES' && (
          <div className="rf-admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  54 African Sovereign Markets Engine
                </h3>
                <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Enable or restrict local payment rails and marketplace discovery per country in real time.
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
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Admin Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCountries.map(country => {
                    const setting = countrySettings[country.id] || { status: country.status };
                    const isOperational = setting.status === 'FULLY_OPERATIONAL' || setting.status === 'PAYMENTS_ENABLED';

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
                          <span className={`rf-badge ${isOperational ? 'rf-badge-mint' : 'rf-badge-neutral'} rf-text-xs`}>
                            {setting.status}
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleCountryToggle(country.id, isOperational ? 'COMING_SOON' : 'FULLY_OPERATIONAL')}
                            className="rf-btn rf-btn-secondary rf-btn-sm"
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: isOperational ? '#EF4444' : 'var(--rf-leaf-green)',
                              borderColor: isOperational ? 'rgba(239, 68, 68, 0.4)' : 'var(--rf-leaf-green)'
                            }}
                          >
                            {isOperational ? 'Set Coming Soon' : 'Activate Market'}
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
            TAB 6: SETTINGS & TEAM
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

            {/* Staff & Team RBAC Table */}
            <div className="rf-admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                    Staff & Team Access Management
                  </h3>
                  <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                    Grant role-based administrator access for content editing, community, and compliance.
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

      {/* 3. SLEEK MINIMALIST PROFESSIONAL ADMIN STATUS BAR */}
      <footer className="rf-admin-footer">
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rf-leaf-green)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--rf-leaf-green)' }} />
              <span>CORE_NODE: OPERATIONAL</span>
            </span>
            <span>•</span>
            <span>Refeir Governance Core v2.4</span>
            <span>•</span>
            <span>AWS af-south-1 (Lagos Edge)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span>TLS 1.3 / 256-bit AES</span>
            <span>•</span>
            <span>Audit Trail: Immutable</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--rf-leaf-green)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              Exit to Website →
            </button>
          </div>
        </div>
      </footer>

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
