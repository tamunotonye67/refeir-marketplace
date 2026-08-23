import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { AFRICAN_COUNTRIES } from '../data/countries';
import { CountryFlag } from '../components/common/CountryFlag';
import { formatMoney } from '../data/currencies';
import { CountryMarketplaceStatus } from '../types';
import {
  Shield,
  Settings,
  Globe2,
  AlertTriangle,
  FileText,
  Users,
  Briefcase,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  XCircle,
  Save,
  Lock,
  ArrowRight,
  ExternalLink,
  Wallet,
  Scale,
  BadgeCheck,
  Building2,
  KeyRound,
  UserCheck,
  Bell,
  BellRing,
  Filter,
  Check,
  Trash2,
  Clock,
  Activity,
  Zap,
  UserPlus,
  PlusCircle,
  Search,
  Mail,
  Phone,
  Edit3,
  Camera,
  MessageSquare,
  BookOpen,
  Layers,
  Calendar,
  Award,
  X,
  ChevronRight,
  Eye,
  Sliders,
  ShieldCheck,
  Ticket
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

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onNavigate = () => {} }) => {
  const {
    countrySettings,
    updateCountryStatus,
    platformSettings,
    updatePlatformSettings,
    projectsList,
    referralsList,
    auditLogs,
    riskFlagsList,
    disputesList,
    resolveDispute,
    clientIntroductionsList,
    approveAndGrantAirfeeToken,
    rejectClientIntroduction
  } = useMarketplace();
  const { showToast, addAppNotification } = useNotification();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DASHBOARDS' | 'COUNTRIES' | 'TEAM' | 'SETTINGS' | 'VERIFICATIONS' | 'DISPUTES' | 'FRAUD' | 'AUDIT' | 'AIRFEE'>('OVERVIEW');

  // Airfee Approvals state
  const [rejectingIntroId, setRejectingIntroId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Client did not complete a project hire or name mismatch on registered profile.');
  const [introStatusFilter, setIntroStatusFilter] = useState<'ALL' | 'HIRE_COMPLETED_PENDING_ADMIN' | 'CLIENT_REGISTERED_AWAITING_HIRE' | 'VERIFIED_GRANTED' | 'REJECTED'>('ALL');

  const addAdminNotification = (
    title: string,
    message: string,
    category: 'ESCROW' | 'DISPUTES' | 'FRAUD' | 'GOVERNANCE' | 'SYSTEM' | 'TEAM',
    targetTab: 'OVERVIEW' | 'DASHBOARDS' | 'COUNTRIES' | 'TEAM' | 'SETTINGS' | 'VERIFICATIONS' | 'DISPUTES' | 'FRAUD' | 'AUDIT' | 'AIRFEE' = 'OVERVIEW',
    _badgeColor?: string
  ) => {
    addAppNotification({
      title,
      message,
      type: category === 'FRAUD' || category === 'DISPUTES' ? 'WARNING' : 'SUCCESS',
      category: 'ADMIN',
      link: `/admin?tab=${targetTab}`,
      action_label: `View in ${targetTab} tab`,
      role_target: 'ADMIN'
    });
    showToast(title, message, category === 'FRAUD' || category === 'DISPUTES' ? 'WARNING' : 'SUCCESS');
  };

  // --- WORKERS & TEAM MEMBERS RBAC SYSTEM ---
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'TM-001',
      name: 'Antigravity Admin',
      email: 'admin@refeir.africa',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      country: 'Pan-African Sovereign HQ 🌍',
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
      country: 'Senegal 🇸🇳',
      countryIso: 'SN',
      role: 'COMMUNITY_MANAGER',
      roleTitle: 'Head of Pan-African Community Hub',
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
      lastActive: '12 mins ago'
    },
    {
      id: 'TM-003',
      name: 'Kofi Boateng',
      email: 'kofi.boateng@refeir.africa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      country: 'Ghana 🇬🇭',
      countryIso: 'GH',
      role: 'CONTENT_EDITOR',
      roleTitle: 'Lead Technical Content & Website Editor',
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
    },
    {
      id: 'TM-004',
      name: 'Zainab Al-Hassan',
      email: 'zainab.alhassan@refeir.africa',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',
      country: 'Nigeria 🇳🇬',
      countryIso: 'NG',
      role: 'COMMUNITY_MANAGER',
      roleTitle: 'Regional Guilds & Event Coordinator',
      permissions: {
        manageWebsite: false,
        manageCommunityHub: true,
        moderateForum: true,
        approveAmbassadors: true,
        manageGuildsEvents: true,
        verifyKyc: false,
        arbitrateDisputes: false
      },
      status: 'ACTIVE',
      joinedDate: 'Apr 2026',
      twoFactorEnabled: true,
      lastActive: '3 hours ago'
    },
    {
      id: 'TM-005',
      name: 'Thabo Mokoena',
      email: 'thabo.mokoena@refeir.africa',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      country: 'South Africa 🇿🇦',
      countryIso: 'ZA',
      role: 'DISPUTE_ARBITER',
      roleTitle: 'Escrow & Code Dispute Arbiter',
      permissions: {
        manageWebsite: false,
        manageCommunityHub: false,
        moderateForum: false,
        approveAmbassadors: false,
        manageGuildsEvents: false,
        verifyKyc: true,
        arbitrateDisputes: true
      },
      status: 'ACTIVE',
      joinedDate: 'May 2026',
      twoFactorEnabled: true,
      lastActive: 'Yesterday'
    }
  ]);

  // Team Modals & Filter State
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [teamRoleFilter, setTeamRoleFilter] = useState<string>('ALL');
  const [editingPermissionsMember, setEditingPermissionsMember] = useState<TeamMember | null>(null);

  // New Member Form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberCountry, setNewMemberCountry] = useState('Nigeria 🇳🇬');
  const [newMemberCountryIso, setNewMemberCountryIso] = useState('NG');
  const [newMemberRole, setNewMemberRole] = useState<'SUPER_ADMIN' | 'COMMUNITY_MANAGER' | 'CONTENT_EDITOR' | 'DISPUTE_ARBITER' | 'COMPLIANCE_OFFICER'>('COMMUNITY_MANAGER');
  const [newMemberRoleTitle, setNewMemberRoleTitle] = useState('Pan-African Community Hub Manager');
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
      setNewMemberRoleTitle('Community Hub & Ambassador Manager');
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
      setNewMemberRoleTitle('Technical Content & Website Editor');
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
      setNewMemberRoleTitle('Escrow & Milestone Dispute Arbiter');
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
      setNewMemberRoleTitle('Trust, KYC & Anti-Fraud Officer');
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

  const handleAddTeamMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      showToast('Validation Error', 'Please provide a full name and work email address.', 'ERROR');
      return;
    }

    const newWorker: TeamMember = {
      id: `TM-${String(teamMembers.length + 1).padStart(3, '0')}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + teamMembers.length * 100}?auto=format&fit=crop&w=150&q=80`,
      country: newMemberCountry,
      countryIso: newMemberCountryIso,
      role: newMemberRole,
      roleTitle: newMemberRoleTitle,
      permissions: { ...newMemberPermissions },
      status: 'ACTIVE',
      joinedDate: 'Aug 2026',
      twoFactorEnabled: true,
      lastActive: 'Invited (Pending 1st Login)'
    };

    setTeamMembers(prev => [newWorker, ...prev]);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast(
      'Staff Member Added Successfully',
      `${newWorker.name} has been provisioned with ${newWorker.roleTitle} privileges for Website & Community Hub.`,
      'SUCCESS'
    );
    addAdminNotification(
      'New Team Member Provisioned',
      `Super Admin added ${newWorker.name} (${newWorker.email}) as ${newWorker.roleTitle}.`,
      'TEAM',
      'TEAM',
      '#66BB2A'
    );

    // Reset Form & Close Modal
    setNewMemberName('');
    setNewMemberEmail('');
    setShowAddTeamModal(false);
  };

  const handleToggleWorkerStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, status: nextStatus } : m));
    showToast('Worker Status Updated', `Team member account is now ${nextStatus.toLowerCase()}.`, nextStatus === 'ACTIVE' ? 'SUCCESS' : 'WARNING');
  };

  const handleDeleteWorker = (id: string, name: string) => {
    if (id === 'TM-001') {
      showToast('Action Denied', 'The Primary Root Super Admin cannot be deleted.', 'ERROR');
      return;
    }
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    showToast('Team Member Removed', `${name} has been removed from platform administration.`, 'INFO');
  };

  const handleSaveEditedPermissions = (member: TeamMember) => {
    setTeamMembers(prev => prev.map(m => m.id === member.id ? member : m));
    setEditingPermissionsMember(null);
    showToast('Permissions Updated', `Updated access privileges for ${member.name}.`, 'SUCCESS');
  };

  // Platform settings draft
  const [platformFee, setPlatformFee] = useState(platformSettings.platform_fee_percent.toString());
  const [minRef, setMinRef] = useState(platformSettings.min_referral_percentage.toString());
  const [maxRef, setMaxRef] = useState(platformSettings.max_referral_percentage.toString());
  const [attribWindow, setAttribWindow] = useState(platformSettings.attribution_window_days.toString());
  const [holdDays, setHoldDays] = useState(platformSettings.payout_hold_period_days.toString());

  // Country search state
  const [countrySearch, setCountrySearch] = useState('');

  // Biometric & Face KYC Queue State
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
      capture_type: 'VIDEO',
      match_confidence: 99.6,
      liveness_status: '3D VIDEO MOTION DEPTH (PASSED)',
      consent_timestamp: '2026-08-15 14:32:10 UTC',
      name_aligned: true,
      dob_aligned: true,
      doc_valid: true,
      biometric_aligned: true,
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
      capture_type: 'PHOTO',
      match_confidence: 98.7,
      liveness_status: 'PASSED (Real Human)',
      consent_timestamp: '2026-08-15 16:11:04 UTC',
      name_aligned: true,
      dob_aligned: true,
      doc_valid: true,
      biometric_aligned: true,
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
      capture_type: 'VIDEO',
      match_confidence: 99.4,
      liveness_status: '3D VIDEO MOTION DEPTH (PASSED)',
      consent_timestamp: '2026-08-15 18:45:22 UTC',
      name_aligned: true,
      dob_aligned: true,
      doc_valid: true,
      biometric_aligned: true,
      status: 'PENDING'
    }
  ]);

  const handleApproveKyc = (id: string, name: string) => {
    setKycQueue(prev => prev.map(k => k.id === id ? { ...k, status: 'VERIFIED' } : k));
    showToast('Biometric Verification Approved', `${name} is now Tier 2 Verified with sovereign badge.`, 'SUCCESS');
    addAdminNotification(
      'Biometric KYC Verified',
      `${name} (${id}) biometric face match approved with 99.4% confidence.`,
      'GOVERNANCE',
      'VERIFICATIONS',
      '#66BB2A'
    );
  };

  const handleRejectKyc = (id: string, name: string) => {
    setKycQueue(prev => prev.map(k => k.id === id ? { ...k, status: 'REJECTED' } : k));
    showToast('Verification Marked for Retake', `${name} notified to retake face capture.`, 'WARNING');
  };

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
      `Fee adjusted to ${platformFee}% • Hold period: ${holdDays} days • Min/Max Referral: ${minRef}%–${maxRef}%.`,
      'GOVERNANCE',
      'SETTINGS',
      '#66BB2A'
    );
    showToast('Platform Settings Saved', 'Updated commission parameters and holding windows across Africa.', 'SUCCESS');
  };

  const handleCountryToggle = (countryId: string, status: CountryMarketplaceStatus) => {
    updateCountryStatus(countryId, {
      status,
      payment_rules: status === 'FULLY_OPERATIONAL' || status === 'PAYMENTS_ENABLED' ? 'Enabled' : 'Disabled',
      payout_rules: status === 'FULLY_OPERATIONAL' || status === 'PAYOUTS_ENABLED' ? 'Enabled' : 'Disabled'
    });
    addAdminNotification(
      'Sovereign Country Status Modified',
      `Market jurisdiction ${countryId.toUpperCase()} status updated to "${status}".`,
      'GOVERNANCE',
      'COUNTRIES',
      '#36E0A0'
    );
    showToast('Country Updated', `Status changed to ${status} for ${countryId}.`);
  };

  const handleAdminResolveDispute = (disputeId: string, resolution: 'RESOLVED_TALENT' | 'RESOLVED_CLIENT', notes: string) => {
    resolveDispute(disputeId, resolution, notes);
    addAdminNotification(
      'Dispute Formally Resolved',
      `Tribunal closed dispute ${disputeId} with verdict: "${resolution === 'RESOLVED_TALENT' ? 'In Favor of Talent' : 'Client Refund Issued'}".`,
      'DISPUTES',
      'DISPUTES',
      resolution === 'RESOLVED_TALENT' ? '#66BB2A' : '#FF6B6B'
    );
  };


  const filteredCountries = AFRICAN_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.iso_code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const connectedDashboards = [
    {
      title: 'Scout Network Hub',
      role: 'SCOUT OPERATIONS',
      path: '/dashboard/scout',
      icon: Users,
      color: 'var(--rf-leaf-green)',
      desc: 'Track active introductions, referral links, and 10% guaranteed reward distributions.'
    },
    {
      title: 'Client Project Dashboard',
      role: 'CLIENT ESCROWS',
      path: '/dashboard/client',
      icon: Briefcase,
      color: '#7DA2FF',
      desc: 'Monitor milestone fundings, candidate shortlists, and talent delivery approvals.'
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
      desc: 'Double-entry platform liquidity in NGN, KES, GHS, ZAR, and USD holding pools.'
    },
    {
      title: 'Dispute Resolution Center',
      role: 'ARBITRATION DESK',
      path: '/disputes',
      icon: Scale,
      color: '#FF6B6B',
      desc: 'Independent milestone mediation and client/talent refund tribunal.'
    },
    {
      title: 'Identity & KYC Verification',
      role: 'COMPLIANCE AUDIT',
      path: '/verification',
      icon: BadgeCheck,
      color: 'var(--rf-mint)',
      desc: 'Government ID, selfie liveness, and professional credential verification queue.'
    },
    {
      title: 'Client Job Board',
      role: 'HIRING PIPELINE',
      path: '/jobs',
      icon: Building2,
      color: 'var(--rf-cream)',
      desc: 'Live Pan-African hiring listings and verified job applications.'
    },
    {
      title: '54 Countries Hub',
      role: 'SOVEREIGN MARKETS',
      path: '/countries',
      icon: Globe2,
      color: 'var(--rf-leaf-green)',
      desc: 'Explore regional talent pools and verified local currencies across Africa.'
    }
  ];

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Admin Portal Header with Active Admin Credentials Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Shield size={14} />
            <span>PAN-AFRICAN GOVERNANCE & OPERATIONS</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
            Administrator Console
          </h1>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem', maxWidth: '680px' }}>
            Real-time control over Africa-wide GMV, escrow custody funds, scout referral attributions, country status configurations, and fraud controls.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>

          {/* Super Admin Credentials & Session Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(10, 26, 18, 0.95), rgba(7, 23, 14, 0.98))',
              border: '1px solid rgba(102, 187, 42, 0.4)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
              minWidth: '280px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <KeyRound size={16} color="var(--rf-leaf-green)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-leaf-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Credentials & Access
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--rf-cream)', fontWeight: 700 }}>
              Antigravity Admin (Super Admin)
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', fontFamily: 'var(--rf-font-mono)', marginTop: '2px' }}>
              admin@refeir.africa
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <span className="rf-badge rf-badge-mint rf-text-xs">
                <UserCheck size={12} /> Full Platform Privileges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="rf-tabs" style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('OVERVIEW')} className={`rf-tab ${activeTab === 'OVERVIEW' ? 'active' : ''}`}>
          Overview Analytics
        </button>
        <button onClick={() => setActiveTab('DASHBOARDS')} className={`rf-tab ${activeTab === 'DASHBOARDS' ? 'active' : ''}`}>
          Connected Dashboards (8)
        </button>
        <button onClick={() => setActiveTab('COUNTRIES')} className={`rf-tab ${activeTab === 'COUNTRIES' ? 'active' : ''}`}>
          Country Administration ({AFRICAN_COUNTRIES.length})
        </button>
        <button onClick={() => setActiveTab('TEAM')} className={`rf-tab ${activeTab === 'TEAM' ? 'active' : ''}`}>
          Staff & Team Members ({teamMembers.length})
        </button>
        <button onClick={() => setActiveTab('SETTINGS')} className={`rf-tab ${activeTab === 'SETTINGS' ? 'active' : ''}`}>
          Platform Economics
        </button>
        <button onClick={() => setActiveTab('VERIFICATIONS')} className={`rf-tab ${activeTab === 'VERIFICATIONS' ? 'active' : ''}`}>
          Biometric & Face KYC ({kycQueue.filter(k => k.status === 'PENDING').length} Pending)
        </button>
        <button onClick={() => setActiveTab('DISPUTES')} className={`rf-tab ${activeTab === 'DISPUTES' ? 'active' : ''}`}>
          Dispute Resolution ({disputesList.length})
        </button>
        <button onClick={() => setActiveTab('FRAUD')} className={`rf-tab ${activeTab === 'FRAUD' ? 'active' : ''}`}>
          Fraud & Risk Engine ({riskFlagsList.length})
        </button>
        <button onClick={() => setActiveTab('AUDIT')} className={`rf-tab ${activeTab === 'AUDIT' ? 'active' : ''}`}>
          Immutable Audit Logs ({auditLogs.length})
        </button>
        <button onClick={() => setActiveTab('AIRFEE')} className={`rf-tab ${activeTab === 'AIRFEE' ? 'active' : ''}`} style={{ borderColor: 'rgba(54, 224, 160, 0.5)' }}>
          <Ticket size={14} style={{ display: 'inline-block', marginRight: '0.35rem', verticalAlign: 'middle' }} />
          Airfee Approvals ({clientIntroductionsList.filter(i => i.status === 'HIRE_COMPLETED_PENDING_ADMIN').length} Ready)
        </button>
      </div>

      {/* 1. OVERVIEW ANALYTICS TAB */}
      {activeTab === 'OVERVIEW' && (
        <div>
          <div className="rf-grid-4" style={{ marginBottom: '2rem' }}>
            <div className="rf-card">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Total Africa GMV
              </span>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                ₦48.6M
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', marginTop: '0.25rem' }}>
                +32% month-over-month
              </div>
            </div>

            <div className="rf-card">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Platform Protection Fees
              </span>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '0.25rem' }}>
                ₦2.43M
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                {platformSettings.platform_fee_percent}% client protection fee
              </div>
            </div>

            <div className="rf-card">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Scout Rewards Paid
              </span>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#7DA2FF', marginTop: '0.25rem' }}>
                ₦4.86M
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                Paid to Scouts in 6 nations
              </div>
            </div>

            <div className="rf-card">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Referral Conversions
              </span>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                {referralsList.length} Referrals
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', marginTop: '0.25rem' }}>
                24.2% Hire conversion
              </div>
            </div>
          </div>

          {/* Connected Operational Dashboards Quick-Links Box */}
          <div className="rf-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Connected Operational Dashboards
                </h3>
                <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.875rem' }}>
                  Directly inspect and test live workspaces across Scout, Client, Talent, Escrow, and Dispute roles.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('DASHBOARDS')}
                className="rf-btn rf-btn-secondary rf-btn-sm"
              >
                <span>View Full Workspace Hub</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {connectedDashboards.slice(0, 4).map(dash => {
                const IconComponent = dash.icon;
                return (
                  <button
                    key={dash.path}
                    onClick={() => onNavigate(dash.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      background: 'var(--rf-navy-surface)',
                      border: '1px solid var(--rf-navy-border)',
                      borderRadius: 'var(--rf-radius-md)',
                      padding: '1.25rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    className="rf-dashboard-card-hover"
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComponent size={20} color={dash.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: dash.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {dash.role}
                      </div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--rf-cream)', marginTop: '2px' }}>
                        {dash.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '4px', lineHeight: 1.4 }}>
                        {dash.desc}
                      </div>
                    </div>
                    <ExternalLink size={14} color="var(--rf-slate-500)" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regional Performance Distribution */}
          <div className="rf-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.25rem' }}>
              Regional Marketplace Volume Breakdown
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--rf-navy-surface)', padding: '1rem', borderRadius: 'var(--rf-radius-md)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-blue)' }}>West Africa</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '4px' }}>₦26.4M GMV</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>Nigeria, Ghana, Senegal, CI</div>
              </div>
              <div style={{ background: 'var(--rf-navy-surface)', padding: '1rem', borderRadius: 'var(--rf-radius-md)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-mint)' }}>East Africa</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '4px' }}>KSh 11.2M GMV</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>Kenya, Rwanda, Tanzania, Uganda</div>
              </div>
              <div style={{ background: 'var(--rf-navy-surface)', padding: '1rem', borderRadius: 'var(--rf-radius-md)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#7DA2FF' }}>Southern Africa</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '4px' }}>R 820,000 GMV</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>South Africa, Botswana, Zambia</div>
              </div>
              <div style={{ background: 'var(--rf-navy-surface)', padding: '1rem', borderRadius: 'var(--rf-radius-md)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-warning)' }}>North Africa</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '4px' }}>E£ 420,000 GMV</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>Egypt, Morocco, Tunisia</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONNECTED DASHBOARDS TAB */}
      {activeTab === 'DASHBOARDS' && (
        <div className="rf-card" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              Operational Workspace Control
            </h3>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Instant deep-links into all individual sub-dashboards and user role workspaces for real-time audit and interaction.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {connectedDashboards.map(dash => {
              const IconComponent = dash.icon;
              return (
                <div
                  key={dash.path}
                  style={{
                    background: 'var(--rf-navy-surface)',
                    border: '1px solid var(--rf-navy-border)',
                    borderRadius: 'var(--rf-radius-lg)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComponent size={24} color={dash.color} />
                    </div>
                    <div>
                      <span className="rf-badge rf-text-xs" style={{ background: 'rgba(255,255,255,0.05)', color: dash.color, marginBottom: '0.25rem' }}>
                        {dash.role}
                      </span>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        {dash.title}
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                        {dash.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(dash.path)}
                    className="rf-btn rf-btn-secondary rf-btn-sm"
                    style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <span>Launch {dash.title}</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. COUNTRY ADMINISTRATION TAB */}
      {activeTab === 'COUNTRIES' && (
        <div className="rf-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                Country Operational Status Engine
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem' }}>
                Toggle marketplace discovery, local payment rails, and payout capabilities per country without deploying code.
              </p>
            </div>
            <input
              type="text"
              className="rf-input"
              value={countrySearch}
              onChange={e => setCountrySearch(e.target.value)}
              placeholder="Search African countries..."
              style={{ width: '260px', fontSize: '0.8125rem' }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--rf-navy-border)', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Country</th>
                  <th style={{ padding: '0.75rem 1rem' }}>ISO</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Currency</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Operational Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Admin Toggle Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCountries.map(country => {
                  const setting = countrySettings[country.id] || { status: country.status };
                  return (
                    <tr key={country.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                        <CountryFlag countryIsoOrName={country.name} />
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--rf-font-mono)', color: 'var(--rf-slate-300)' }}>
                        {country.iso_code}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--rf-mint)' }}>
                        {country.currency_code} ({country.currency_symbol})
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span className={`rf-badge rf-text-xs ${
                          setting.status === 'FULLY_OPERATIONAL'
                            ? 'rf-badge-mint'
                            : setting.status === 'PAYMENTS_ENABLED'
                            ? 'rf-badge-blue'
                            : 'rf-badge-neutral'
                        }`}>
                          {setting.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                        <select
                          className="rf-select"
                          value={setting.status}
                          onChange={e => handleCountryToggle(country.id, e.target.value as CountryMarketplaceStatus)}
                          style={{ width: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          <option value="FULLY_OPERATIONAL">FULLY_OPERATIONAL</option>
                          <option value="PAYMENTS_ENABLED">PAYMENTS_ENABLED</option>
                          <option value="PAYOUTS_ENABLED">PAYOUTS_ENABLED</option>
                          <option value="MARKETPLACE_ONLY">MARKETPLACE_ONLY</option>
                          <option value="COMING_SOON">COMING_SOON</option>
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

      {/* 3B. STAFF & TEAM MEMBERS TAB (RBAC & COMMUNITY HUB MANAGERS) */}
      {activeTab === 'TEAM' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Top Metrics Row */}
          <div className="rf-grid-4">
            <div className="rf-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Total Staff & Workers
                </span>
                <Users size={18} color="var(--rf-leaf-green)" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
                {teamMembers.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 700, marginTop: '0.2rem' }}>
                {teamMembers.filter(m => m.status === 'ACTIVE').length} Active • 0 Suspended
              </div>
            </div>

            <div className="rf-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Community Managers
                </span>
                <MessageSquare size={18} color="#F6B21A" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
                {teamMembers.filter(m => m.permissions.manageCommunityHub).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#F6B21A', fontWeight: 700, marginTop: '0.2rem' }}>
                Forum, Guilds & Ambassadors
              </div>
            </div>

            <div className="rf-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Website & Content Editors
                </span>
                <BookOpen size={18} color="#38BDF8" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
                {teamMembers.filter(m => m.permissions.manageWebsite).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, marginTop: '0.2rem' }}>
                Blog, Blueprints & CMS
              </div>
            </div>

            <div className="rf-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  2FA & Biometric Security
                </span>
                <ShieldCheck size={18} color="var(--rf-leaf-green)" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 700, marginTop: '0.2rem' }}>
                Hardware & Multi-Factor Enforced
              </div>
            </div>
          </div>

          {/* Directory Card */}
          <div className="rf-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={20} color="var(--rf-leaf-green)" />
                  <span>Platform Staff, Workers & Community Managers</span>
                </h3>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                  Grant role-based access for workers and team members to manage the website, publish guides, and moderate the Pan-African Community Hub.
                </p>
              </div>

              <button
                onClick={() => setShowAddTeamModal(true)}
                className="rf-btn rf-btn-primary"
                style={{ gap: '0.45rem', fontWeight: 800 }}
              >
                <PlusCircle size={16} />
                <span>Add Worker / Team Member</span>
              </button>
            </div>

            {/* Filter Chips & Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(0, 0, 0, 0.25)', padding: '0.75rem', borderRadius: 'var(--rf-radius-lg)', border: '1px solid var(--rf-navy-border)' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Roles' },
                  { id: 'COMMUNITY_MANAGER', label: 'Community Managers' },
                  { id: 'CONTENT_EDITOR', label: 'Content & Website Editors' },
                  { id: 'SUPER_ADMIN', label: 'Super Admins' },
                  { id: 'DISPUTE_ARBITER', label: 'Dispute Arbiters' },
                  { id: 'COMPLIANCE_OFFICER', label: 'KYC Officers' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setTeamRoleFilter(f.id)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: teamRoleFilter === f.id ? '1px solid var(--rf-leaf-green)' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: teamRoleFilter === f.id ? 'rgba(102, 187, 42, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      color: teamRoleFilter === f.id ? 'var(--rf-leaf-green)' : 'var(--rf-slate-300)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={14} color="var(--rf-slate-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search team members by name or email..."
                  value={teamSearchQuery}
                  onChange={e => setTeamSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.75rem 0.45rem 2rem',
                    borderRadius: 'var(--rf-radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--rf-navy-border)',
                    color: 'var(--rf-cream)',
                    fontSize: '0.8125rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Team Members List Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--rf-navy-border)', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Worker / Team Member</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Role & Scope</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Assigned Access Modules</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Security / 2FA</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers
                    .filter(m => {
                      const matchRole = teamRoleFilter === 'ALL' || m.role === teamRoleFilter;
                      const matchQuery =
                        m.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
                        m.email.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
                        m.roleTitle.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
                        m.country.toLowerCase().includes(teamSearchQuery.toLowerCase());
                      return matchRole && matchQuery;
                    })
                    .map(member => (
                      <tr key={member.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ position: 'relative' }}>
                              <img
                                src={member.avatar}
                                alt={member.name}
                                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--rf-leaf-green)' }}
                              />
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  right: 0,
                                  width: '9px',
                                  height: '9px',
                                  borderRadius: '50%',
                                  background: member.status === 'ACTIVE' ? 'var(--rf-leaf-green)' : '#F4B942',
                                  border: '2px solid #07160D'
                                }}
                              />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--rf-cream)', fontSize: '0.875rem' }}>
                                {member.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', fontFamily: 'var(--rf-font-mono)' }}>
                                {member.email}
                              </div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--rf-leaf-green)', marginTop: '2px' }}>
                                {member.country}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            className={`rf-badge ${
                              member.role === 'SUPER_ADMIN'
                                ? 'rf-badge-gold'
                                : member.role === 'COMMUNITY_MANAGER'
                                ? 'rf-badge-mint'
                                : member.role === 'CONTENT_EDITOR'
                                ? 'rf-badge-blue'
                                : 'rf-badge-warning'
                            } rf-text-xs`}
                            style={{ fontWeight: 800 }}
                          >
                            {member.role.replace('_', ' ')}
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '4px', fontWeight: 600 }}>
                            {member.roleTitle}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: '300px' }}>
                            {member.permissions.manageWebsite && (
                              <span style={{ fontSize: '0.6875rem', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38BDF8', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                                🌐 Website CMS
                              </span>
                            )}
                            {member.permissions.manageCommunityHub && (
                              <span style={{ fontSize: '0.6875rem', background: 'rgba(102, 187, 42, 0.12)', border: '1px solid rgba(102, 187, 42, 0.3)', color: 'var(--rf-leaf-green)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                                💬 Community Hub
                              </span>
                            )}
                            {member.permissions.approveAmbassadors && (
                              <span style={{ fontSize: '0.6875rem', background: 'rgba(246, 178, 26, 0.12)', border: '1px solid rgba(246, 178, 26, 0.3)', color: '#F6B21A', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                                🏆 Ambassadors
                              </span>
                            )}
                            {member.permissions.manageGuildsEvents && (
                              <span style={{ fontSize: '0.6875rem', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#C084FC', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                                ⚡ Guilds & AMAs
                              </span>
                            )}
                            {member.permissions.verifyKyc && (
                              <span style={{ fontSize: '0.6875rem', background: 'rgba(102, 187, 42, 0.12)', border: '1px solid rgba(102, 187, 42, 0.3)', color: 'var(--rf-leaf-green)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                                🛡️ Biometric KYC
                              </span>
                            )}
                            {member.permissions.arbitrateDisputes && (
                              <span style={{ fontSize: '0.6875rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                                ⚖️ Dispute Arbiter
                              </span>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: member.twoFactorEnabled ? 'var(--rf-leaf-green)' : '#F4B942', fontWeight: 700 }}>
                            <ShieldCheck size={14} />
                            <span>{member.twoFactorEnabled ? '2FA Enforced' : 'Pending'}</span>
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                            {member.lastActive}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            className={`rf-badge ${member.status === 'ACTIVE' ? 'rf-badge-mint' : 'rf-badge-warning'} rf-text-xs`}
                            style={{ fontWeight: 800 }}
                          >
                            {member.status}
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                            <button
                              onClick={() => setEditingPermissionsMember(member)}
                              title="Edit Scope & Permissions"
                              style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: 'var(--rf-cream)',
                                padding: '0.35rem 0.65rem',
                                borderRadius: 'var(--rf-radius-sm)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <Edit3 size={13} color="var(--rf-leaf-green)" />
                              <span>Edit Permissions</span>
                            </button>

                            <button
                              onClick={() => handleToggleWorkerStatus(member.id, member.status)}
                              title={member.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                              style={{
                                background: member.status === 'ACTIVE' ? 'rgba(244, 185, 66, 0.15)' : 'rgba(102, 187, 42, 0.15)',
                                border: member.status === 'ACTIVE' ? '1px solid rgba(244, 185, 66, 0.35)' : '1px solid rgba(102, 187, 42, 0.35)',
                                color: member.status === 'ACTIVE' ? '#F4B942' : 'var(--rf-leaf-green)',
                                padding: '0.35rem 0.55rem',
                                borderRadius: 'var(--rf-radius-sm)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {member.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>

                            {member.id !== 'TM-001' && (
                              <button
                                onClick={() => handleDeleteWorker(member.id, member.name)}
                                title="Remove Worker"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#F87171',
                                  padding: '0.35rem',
                                  borderRadius: 'var(--rf-radius-sm)',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={14} />
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

          {/* Role Permission Matrix Information Guide */}
          <div className="rf-card" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(10, 23, 15, 0.8) 0%, rgba(18, 43, 26, 0.6) 100%)', border: '1px solid rgba(102, 187, 42, 0.3)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="var(--rf-leaf-green)" />
              <span>Pan-African Delegation & Community Moderation Standards</span>
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              Workers and Team Members provisioned on Refeir inherit role-based cryptographic sessions to manage different modules independently.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontWeight: 800, color: 'var(--rf-leaf-green)', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                  💬 Community Hub Managers
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', lineHeight: 1.5 }}>
                  Empowered to pin high-value engineering threads in Refeir Forum, approve Ambassador applications across African cities, moderate Guild workspaces, and schedule virtual AMAs.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                  🌐 Website & Content Editors
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', lineHeight: 1.5 }}>
                  Responsible for drafting and publishing in-depth architectural blueprints, Refeir Blog updates, FAQs, case studies, and localized regional translations.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontWeight: 800, color: '#FF6B6B', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                  ⚖️ Dispute & KYC Arbiters
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', lineHeight: 1.5 }}>
                  Neutral third-party reviewers inspecting git milestone deliverables, code commit trees, and verifying 3D face liveness to safeguard payments.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PLATFORM ECONOMICS TAB */}
      {activeTab === 'SETTINGS' && (
        <div className="rf-card" style={{ padding: '2rem', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
            Configurable Platform Economics
          </h3>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Never hardcode fee percentages. Control global commissions and Trust Vault safety windows.
          </p>

          <form onSubmit={handleSavePlatformSettings}>
            <div className="rf-form-group">
              <label className="rf-label">
                <span>Refeir Client Protection Fee (%)</span>
              </label>
              <input
                type="number"
                className="rf-input"
                value={platformFee}
                onChange={e => setPlatformFee(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="rf-form-group">
                <label className="rf-label">Min Referral Reward (%)</label>
                <input
                  type="number"
                  className="rf-input"
                  value={minRef}
                  onChange={e => setMinRef(e.target.value)}
                />
              </div>
              <div className="rf-form-group">
                <label className="rf-label">Max Referral Reward (%)</label>
                <input
                  type="number"
                  className="rf-input"
                  value={maxRef}
                  onChange={e => setMaxRef(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="rf-form-group">
                <label className="rf-label">Attribution Window (Days)</label>
                <input
                  type="number"
                  className="rf-input"
                  value={attribWindow}
                  onChange={e => setAttribWindow(e.target.value)}
                />
              </div>
              <div className="rf-form-group">
                <label className="rf-label">Payout Holding Period (Days)</label>
                <input
                  type="number"
                  className="rf-input"
                  value={holdDays}
                  onChange={e => setHoldDays(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="rf-btn rf-btn-mint rf-btn-lg" style={{ gap: '0.5rem', marginTop: '1rem' }}>
              <Save size={16} />
              <span>Save Platform Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* 4.5. BIOMETRIC & FACE KYC AUDIT TAB */}
      {activeTab === 'VERIFICATIONS' && (
        <div className="rf-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Biometric Facial Liveness & Sovereign KYC Queue
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                Review live face captures side-by-side with government ID documents and algorithmic confidence scores.
              </p>
            </div>
            <span className="rf-badge rf-badge-mint">
              Sovereign Rail: Smile ID / Dojah Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {kycQueue.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--rf-bg-surface)',
                  border: item.status === 'PENDING' ? '1.5px solid rgba(102, 187, 42, 0.4)' : '1px solid var(--rf-bg-card-border)',
                  borderRadius: 'var(--rf-radius-lg)',
                  padding: '1.5rem',
                  boxShadow: 'var(--rf-shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        {item.name}
                      </span>
                      <span className="rf-badge rf-badge-blue rf-text-xs">
                        {item.country}
                      </span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                          background: item.status === 'VERIFIED' ? 'rgba(102, 187, 42, 0.18)' : item.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(244, 185, 66, 0.18)',
                          color: item.status === 'VERIFIED' ? 'var(--rf-leaf-green)' : item.status === 'REJECTED' ? '#EF4444' : '#F4B942'
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-400)' }}>
                      {item.role} • Application ID: <strong style={{ color: 'var(--rf-cream)', fontFamily: 'monospace' }}>{item.id}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>
                      Match Score: {item.match_confidence}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>
                      {item.liveness_status}
                    </div>
                  </div>
                </div>

                {/* Side-by-Side Face & ID Comparison Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: 'var(--rf-radius-md)', marginBottom: '1.25rem' }}>
                  {/* ID Document Photo */}
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)', marginBottom: '0.4rem' }}>
                      Official {item.id_type} ({item.doc_number})
                    </div>
                    <div style={{ height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--rf-bg-card-border)' }}>
                      <img src={item.id_photo} alt="ID Document" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>

                  {/* Live Captured Face / Video */}
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', marginBottom: '0.4rem' }}>
                      {item.capture_type === 'VIDEO' ? 'Live Biometric 3D Video Clip' : 'Live Biometric Face Snapshot'}
                    </div>
                    <div style={{ height: '140px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--rf-leaf-green)', position: 'relative', background: '#000' }}>
                      {item.capture_type === 'VIDEO' && item.video_capture ? (
                        <video
                          src={item.video_capture}
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <img src={item.face_capture} alt="Live Face Snapshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                      <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.75)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', color: 'var(--rf-leaf-green)', fontWeight: 700, pointerEvents: 'none' }}>
                        {item.capture_type === 'VIDEO' ? 'REC 3D Motion ✓' : 'User Consented'}
                      </div>
                    </div>
                  </div>

                  {/* 4-Factor Credential Alignment & Audit Matrix */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '0.78rem', gap: '0.4rem', color: 'var(--rf-slate-300)', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <strong style={{ color: 'var(--rf-slate-400)' }}>1. Name Match:</strong>{' '}
                      <span style={{ color: 'var(--rf-cream)' }}>{item.legal_name_on_doc}</span>{' '}
                      <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 800 }}>✓ Aligned</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--rf-slate-400)' }}>2. DOB & Age:</strong>{' '}
                      <span style={{ color: 'var(--rf-cream)' }}>{item.dob}</span>{' '}
                      <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 800 }}>✓ Validated</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--rf-slate-400)' }}>3. Official ID:</strong>{' '}
                      <span style={{ color: 'var(--rf-cream)', fontFamily: 'monospace' }}>{item.doc_number}</span>{' '}
                      <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 800 }}>✓ Sovereign</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--rf-slate-400)' }}>4. Biometric Vector:</strong>{' '}
                      <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 800 }}>{item.match_confidence}% Match (4/4 Passed) ✓</span>
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
                    >
                      <UserCheck size={14} />
                      <span>Approve Tier 2 Verified Badge</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DISPUTES RESOLUTION TAB */}
      {activeTab === 'DISPUTES' && (
        <div className="rf-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
            Dispute Mediation Console
          </h3>

          {disputesList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {disputesList.map(disp => (
                <div key={disp.id} style={{ background: 'var(--rf-navy-surface)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-lg)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <span className="rf-badge rf-badge-danger rf-text-xs" style={{ marginBottom: '0.25rem' }}>
                        {disp.status}
                      </span>
                      <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        {disp.project_title} ({disp.id})
                      </h4>
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                      {formatMoney(disp.disputed_amount)}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', marginBottom: '1rem' }}>
                    <strong>Reason:</strong> {disp.reason} — {disp.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAdminResolveDispute(disp.id, 'RESOLVED_TALENT', 'Mediated in favor of talent after work inspection.')}
                      className="rf-btn rf-btn-mint rf-btn-sm"
                    >
                      Resolve in Favor of Talent
                    </button>
                    <button
                      onClick={() => handleAdminResolveDispute(disp.id, 'RESOLVED_CLIENT', 'Mediated in favor of client with full refund.')}
                      className="rf-btn rf-btn-danger rf-btn-sm"
                    >
                      Refund Client
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--rf-slate-400)' }}>
              No active dispute claims filed. All projects are proceeding smoothly!
            </p>
          )}
        </div>
      )}

      {/* 6. FRAUD & RISK TAB */}
      {activeTab === 'FRAUD' && (
        <div className="rf-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
            Risk Signal Anomaly Monitor
          </h3>

          {riskFlagsList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {riskFlagsList.map(flag => (
                <div key={flag.id} style={{ background: 'var(--rf-navy-surface)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-lg)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="rf-badge rf-badge-warning rf-text-xs">
                      {flag.signal_type} • Score: {flag.risk_score}/100
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>{new Date(flag.timestamp).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--rf-cream)', fontWeight: 600 }}>{flag.user_name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>{flag.details}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--rf-slate-400)' }}>
              No high-risk anomalies detected. Self-referral filters active.
            </p>
          )}
        </div>
      )}

      {/* 7. IMMUTABLE AUDIT LOGS TAB */}
      {activeTab === 'AUDIT' && (
        <div className="rf-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
            System & Financial Audit Trail
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--rf-navy-border)', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Log ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actor</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Object</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Reason / Details</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--rf-font-mono)', color: 'var(--rf-mint)' }}>{log.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--rf-cream)' }}>{log.actor_name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}><span className="rf-badge rf-badge-blue rf-text-xs">{log.action}</span></td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--rf-slate-300)' }}>{log.object_type} ({log.object_id})</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--rf-slate-300)' }}>{log.reason}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--rf-slate-400)' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. AIRFEE TOKEN VERIFICATION & GRANTING TAB */}
      {activeTab === 'AIRFEE' && (
        <div>
          {/* Header Policy Callout */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(36, 87, 255, 0.12) 0%, rgba(54, 224, 160, 0.08) 100%)',
              border: '1px solid rgba(54, 224, 160, 0.3)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(54, 224, 160, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ticket size={20} color="var(--rf-mint)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Airfee Token Manual Verification & Granting Console
                </h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                  Scouts earn Airfee Tokens strictly by introducing paying clients who register and hire African talent.
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, marginTop: '0.5rem', background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: 'var(--rf-radius-md)' }}>
              <strong>Verification Standard:</strong> Admin must confirm that the <strong>Hiring Manager's Name</strong> and <strong>Business Name</strong> submitted by the Scout match the registered profile on Refeir, and that the client has <strong>successfully funded and closed a deal</strong> with a talent. If the client did not register or hire, no token is issued.
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="rf-grid-4" style={{ marginBottom: '2rem' }}>
            <div className="rf-card" style={{ borderColor: 'rgba(54, 224, 160, 0.4)' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-mint)' }}>
                Ready for Admin Grant
              </span>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '0.25rem' }}>
                {clientIntroductionsList.filter(i => i.status === 'HIRE_COMPLETED_PENDING_ADMIN').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '0.25rem' }}>
                Deal closed & names matched
              </div>
            </div>

            <div className="rf-card">
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Awaiting First Hire
              </span>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#F4B942', marginTop: '0.25rem' }}>
                {clientIntroductionsList.filter(i => i.status === 'CLIENT_REGISTERED_AWAITING_HIRE' || i.status === 'PENDING_VERIFICATION').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                Scout receives nothing yet
              </div>
            </div>

            <div className="rf-card">
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Tokens Granted to Date
              </span>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#7DA2FF', marginTop: '0.25rem' }}>
                {clientIntroductionsList.filter(i => i.status === 'VERIFIED_GRANTED').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                Active monthly fee waivers
              </div>
            </div>

            <div className="rf-card">
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                Claims Rejected
              </span>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#FF6B6B', marginTop: '0.25rem' }}>
                {clientIntroductionsList.filter(i => i.status === 'REJECTED').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                Mismatch or inactivity
              </div>
            </div>
          </div>

          {/* Verification Table Card */}
          <div className="rf-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Client Introductions Verification Queue
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', margin: '0.25rem 0 0 0' }}>
                  Review submitted names against registered profiles and completed milestone escrow settlements.
                </p>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(['ALL', 'HIRE_COMPLETED_PENDING_ADMIN', 'CLIENT_REGISTERED_AWAITING_HIRE', 'VERIFIED_GRANTED', 'REJECTED'] as const).map(filterKey => (
                  <button
                    key={filterKey}
                    onClick={() => setIntroStatusFilter(filterKey)}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.35rem 0.75rem',
                      borderRadius: '100px',
                      border: introStatusFilter === filterKey ? '1px solid var(--rf-mint)' : '1px solid var(--rf-navy-border)',
                      background: introStatusFilter === filterKey ? 'rgba(54, 224, 160, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      color: introStatusFilter === filterKey ? 'var(--rf-mint)' : 'var(--rf-slate-300)',
                      cursor: 'pointer'
                    }}
                  >
                    {filterKey === 'ALL' ? 'All Claims' : filterKey === 'HIRE_COMPLETED_PENDING_ADMIN' ? 'Ready for Grant' : filterKey === 'CLIENT_REGISTERED_AWAITING_HIRE' ? 'Awaiting Hire' : filterKey === 'VERIFIED_GRANTED' ? 'Granted' : 'Rejected'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--rf-navy-border)', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Scout Details</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Submitted Client & Business</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Refeir Registered Profile</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Project Deal Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Verification State</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Admin Verification Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clientIntroductionsList
                    .filter(item => introStatusFilter === 'ALL' || item.status === introStatusFilter)
                    .map(intro => {
                      const isReadyToGrant = intro.status === 'HIRE_COMPLETED_PENDING_ADMIN';
                      const isAlreadyGranted = intro.status === 'VERIFIED_GRANTED';
                      const isRejected = intro.status === 'REJECTED';
                      const isNameMatched = intro.registered_client_name && intro.client_contact_name.toLowerCase().includes(intro.registered_client_name.toLowerCase().split(' ')[0]);

                      return (
                        <tr key={intro.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          {/* Scout */}
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{intro.scout_name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)', fontFamily: 'var(--rf-font-mono)' }}>
                              Code: {intro.referral_link_code}
                            </div>
                          </td>

                          {/* Submitted Details */}
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{intro.client_contact_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#7DA2FF', fontWeight: 600 }}>{intro.company_name}</div>
                            {intro.client_email && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>{intro.client_email}</div>
                            )}
                          </td>

                          {/* Refeir Profile Match */}
                          <td style={{ padding: '1rem' }}>
                            {intro.has_registered ? (
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--rf-cream)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span>{intro.registered_client_name}</span>
                                  {isNameMatched && (
                                    <span className="rf-badge rf-badge-mint rf-text-xs" style={{ padding: '0.1rem 0.4rem' }}>
                                      Match Confirmed
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)' }}>
                                  {intro.registered_company_name || 'Individual Client'}
                                </div>
                              </div>
                            ) : (
                              <span className="rf-badge rf-badge-warning rf-text-xs">
                                Client Not Registered Yet
                              </span>
                            )}
                          </td>

                          {/* Project Deal */}
                          <td style={{ padding: '1rem' }}>
                            {intro.has_closed_deal ? (
                              <div>
                                <div style={{ color: 'var(--rf-mint)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <CheckCircle2 size={13} />
                                  <span>Deal Closed ({intro.deal_amount_formatted})</span>
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)' }}>
                                  {intro.deal_project_title}
                                </div>
                              </div>
                            ) : intro.has_registered ? (
                              <div>
                                <span style={{ color: '#F4B942', fontWeight: 600, fontSize: '0.75rem' }}>
                                  Awaiting First Talent Hire
                                </span>
                                <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>
                                  Scout receives nothing until contract is funded
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--rf-slate-500)', fontSize: '0.75rem' }}>
                                No registration & no project hire
                              </span>
                            )}
                          </td>

                          {/* Verification State */}
                          <td style={{ padding: '1rem' }}>
                            {isAlreadyGranted ? (
                              <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Ticket size={12} /> Granted ({intro.granted_token_code})
                              </span>
                            ) : isReadyToGrant ? (
                              <span className="rf-badge rf-badge-blue rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <ShieldCheck size={12} /> Ready for Admin Grant
                              </span>
                            ) : isRejected ? (
                              <span className="rf-badge rf-badge-error rf-text-xs">
                                Claim Rejected
                              </span>
                            ) : (
                              <span className="rf-badge rf-badge-warning rf-text-xs">
                                Pending Client Action
                              </span>
                            )}
                            {intro.admin_notes && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem', maxWidth: '200px' }}>
                                {intro.admin_notes}
                              </div>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                              {isReadyToGrant && (
                                <button
                                  onClick={() => {
                                    approveAndGrantAirfeeToken(intro.id);
                                    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
                                    addAdminNotification(
                                      'Airfee Token Awarded',
                                      `Granted Monthly 0% Airfee waiver token to Scout ${intro.scout_name} for verified introduction of ${intro.client_contact_name} (${intro.company_name}).`,
                                      'ESCROW',
                                      'AIRFEE'
                                    );
                                    showToast(
                                      'Airfee Token Granted!',
                                      `Token granted to Scout ${intro.scout_name}. 2% Airfee waived for August 2026.`,
                                      'SUCCESS'
                                    );
                                  }}
                                  className="rf-btn rf-btn-mint rf-btn-sm"
                                  style={{ fontWeight: 800, gap: '0.35rem' }}
                                >
                                  <Ticket size={13} />
                                  <span>Confirm & Award Token</span>
                                </button>
                              )}

                              {!isAlreadyGranted && !isRejected && (
                                <button
                                  onClick={() => setRejectingIntroId(intro.id)}
                                  className="rf-btn rf-btn-secondary rf-btn-sm"
                                  style={{ color: '#FF6B6B', borderColor: 'rgba(255, 107, 107, 0.3)', padding: '0.35rem 0.65rem' }}
                                >
                                  <XCircle size={13} />
                                  <span>Reject</span>
                                </button>
                              )}

                              {isAlreadyGranted && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', fontWeight: 700 }}>
                                  ✓ Token Active
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REJECT CLAIM MODAL */}
      {rejectingIntroId && (
        <div className="rf-modal-backdrop" onClick={() => setRejectingIntroId(null)}>
          <div className="rf-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#FF6B6B' }}>
              <XCircle size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Reject Airfee Token Claim
              </h3>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '1.25rem' }}>
              Specify the reason why this client introduction claim does not qualify for an Airfee Token award.
            </p>

            <div className="rf-form-group">
              <label className="rf-label">Rejection Reason</label>
              <select
                className="rf-select"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                style={{ marginBottom: '0.75rem' }}
              >
                <option value="Client did not complete a project hire or name mismatch on registered profile.">
                  Client did not complete a project hire or name mismatch
                </option>
                <option value="Hiring Manager Name & Business Name do not match registered client account.">
                  Hiring Manager Name & Business Name do not match
                </option>
                <option value="Local client never registered or completed onboarding on Refeir.">
                  Local client never registered on Refeir
                </option>
                <option value="Disputed or cancelled project escrow transaction.">
                  Disputed or cancelled project escrow transaction
                </option>
              </select>

              <textarea
                className="rf-input"
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Detailed rejection explanation..."
                style={{ fontSize: '0.8125rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setRejectingIntroId(null)}
                className="rf-btn rf-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectClientIntroduction(rejectingIntroId, rejectReason);
                  setRejectingIntroId(null);
                  showToast('Claim Rejected', 'Client introduction claim rejected and logged to audit trail.', 'INFO');
                }}
                className="rf-btn rf-btn-danger"
                style={{ fontWeight: 800 }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD WORKER / TEAM MEMBER MODAL */}
      {showAddTeamModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 10, 6, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
          onClick={() => setShowAddTeamModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #07170E 0%, #030F08 100%)',
              border: '1px solid rgba(102, 187, 42, 0.4)',
              borderRadius: 'var(--rf-radius-xl)',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <UserPlus size={14} />
                  <span>STAFF & WORKER PROVISIONING</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Add Worker / Team Member
                </h3>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Assign team members and community managers to help administer the Refeir website and Community Hub.
                </p>
              </div>

              <button
                onClick={() => setShowAddTeamModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--rf-slate-300)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddTeamMemberSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Row 1: Name & Work Email */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div className="rf-form-group">
                  <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                    Full Legal / Worker Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Zahra"
                    className="rf-input"
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. fatima.zahra@refeir.africa"
                    className="rf-input"
                    value={newMemberEmail}
                    onChange={e => setNewMemberEmail(e.target.value)}
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* Row 2: Country / Regional Chapter & Primary Role */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div className="rf-form-group">
                  <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                    Assigned Region / Chapter
                  </label>
                  <select
                    className="rf-select"
                    value={newMemberCountry}
                    onChange={e => {
                      setNewMemberCountry(e.target.value);
                      const found = AFRICAN_COUNTRIES.find(c => e.target.value.includes(c.name));
                      if (found) setNewMemberCountryIso(found.iso_code);
                    }}
                    style={{ fontSize: '0.875rem' }}
                  >
                    <option value="Pan-African Sovereign HQ 🌍">Pan-African Sovereign HQ 🌍</option>
                    {AFRICAN_COUNTRIES.map(country => (
                      <option key={country.iso_code} value={`${country.name} ${country.iso_code}`}>
                        {country.name} ({country.iso_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rf-form-group">
                  <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                    Primary Role Preset
                  </label>
                  <select
                    className="rf-select"
                    value={newMemberRole}
                    onChange={e => handleRolePresetChange(e.target.value as any)}
                    style={{ fontSize: '0.875rem' }}
                  >
                    <option value="COMMUNITY_MANAGER">💬 Community Hub & Ambassador Manager</option>
                    <option value="CONTENT_EDITOR">🌐 Technical Content & Website Editor</option>
                    <option value="SUPER_ADMIN">👑 Super Administrator (Full Access)</option>
                    <option value="DISPUTE_ARBITER">⚖️ Escrow & Milestone Dispute Arbiter</option>
                    <option value="COMPLIANCE_OFFICER">🛡️ Trust, KYC & Anti-Fraud Officer</option>
                  </select>
                </div>
              </div>

              {/* Custom Role Title */}
              <div className="rf-form-group">
                <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  Displayed Staff Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Head of Community Hub & Regional Guilds"
                  className="rf-input"
                  value={newMemberRoleTitle}
                  onChange={e => setNewMemberRoleTitle(e.target.value)}
                  style={{ fontSize: '0.875rem' }}
                />
              </div>

              {/* Granular Permission Toggles */}
              <div>
                <label className="rf-label" style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--rf-leaf-green)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>
                  Granular Access Permissions
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {/* Permission 1: Website CMS */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: newMemberPermissions.manageWebsite ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: newMemberPermissions.manageWebsite ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newMemberPermissions.manageWebsite}
                      onChange={e => setNewMemberPermissions({ ...newMemberPermissions, manageWebsite: e.target.checked })}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        🌐 Manage Website & CMS
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                        Publish Blog posts, Tech Blueprints, update FAQs and homepage announcements.
                      </div>
                    </div>
                  </label>

                  {/* Permission 2: Community Hub Forum */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: newMemberPermissions.manageCommunityHub ? 'rgba(102, 187, 42, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: newMemberPermissions.manageCommunityHub ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newMemberPermissions.manageCommunityHub}
                      onChange={e => setNewMemberPermissions({ ...newMemberPermissions, manageCommunityHub: e.target.checked })}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        💬 Manage Community Hub
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                        Moderate Refeir Forum, pin key discussions, and delete inappropriate content.
                      </div>
                    </div>
                  </label>

                  {/* Permission 3: Ambassadors */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: newMemberPermissions.approveAmbassadors ? 'rgba(246, 178, 26, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: newMemberPermissions.approveAmbassadors ? '1px solid rgba(246, 178, 26, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newMemberPermissions.approveAmbassadors}
                      onChange={e => setNewMemberPermissions({ ...newMemberPermissions, approveAmbassadors: e.target.checked })}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        🏆 Approve City Ambassadors
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                        Review Ambassador applications and grant official regional badges.
                      </div>
                    </div>
                  </label>

                  {/* Permission 4: Guilds & Events */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: newMemberPermissions.manageGuildsEvents ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: newMemberPermissions.manageGuildsEvents ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newMemberPermissions.manageGuildsEvents}
                      onChange={e => setNewMemberPermissions({ ...newMemberPermissions, manageGuildsEvents: e.target.checked })}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        ⚡ Guilds & Hackathons
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                        Schedule live virtual AMAs, workshops, and manage specialized Guild clubs.
                      </div>
                    </div>
                  </label>

                  {/* Permission 5: Biometric KYC */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: newMemberPermissions.verifyKyc ? 'rgba(102, 187, 42, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: newMemberPermissions.verifyKyc ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newMemberPermissions.verifyKyc}
                      onChange={e => setNewMemberPermissions({ ...newMemberPermissions, verifyKyc: e.target.checked })}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        🛡️ Biometric KYC Queue
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                        Audit 3D face video motions and government document authenticity.
                      </div>
                    </div>
                  </label>

                  {/* Permission 6: Dispute Arbitration */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: newMemberPermissions.arbitrateDisputes ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: newMemberPermissions.arbitrateDisputes ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newMemberPermissions.arbitrateDisputes}
                      onChange={e => setNewMemberPermissions({ ...newMemberPermissions, arbitrateDisputes: e.target.checked })}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        ⚖️ Escrow Dispute Arbitration
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                        Review code deliverables and execute neutral client/talent payouts.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="rf-btn rf-btn-secondary"
                  style={{ fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rf-btn rf-btn-primary"
                  style={{ fontWeight: 800, gap: '0.45rem' }}
                >
                  <UserPlus size={16} />
                  <span>Provision Worker & Dispatch Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT WORKER PERMISSIONS MODAL */}
      {editingPermissionsMember && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 10, 6, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
          onClick={() => setEditingPermissionsMember(null)}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #07170E 0%, #030F08 100%)',
              border: '1px solid rgba(102, 187, 42, 0.4)',
              borderRadius: 'var(--rf-radius-xl)',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={editingPermissionsMember.avatar}
                  alt={editingPermissionsMember.name}
                  style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--rf-leaf-green)' }}
                />
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    <Sliders size={14} />
                    <span>MODIFY WORKER PRIVILEGES</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: '0.15rem 0 0' }}>
                    {editingPermissionsMember.name}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', fontFamily: 'var(--rf-font-mono)' }}>
                    {editingPermissionsMember.email} • {editingPermissionsMember.country}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditingPermissionsMember(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--rf-slate-300)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Edit Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="rf-form-group">
                <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  Staff Title / Role Label
                </label>
                <input
                  type="text"
                  className="rf-input"
                  value={editingPermissionsMember.roleTitle}
                  onChange={e =>
                    setEditingPermissionsMember({
                      ...editingPermissionsMember,
                      roleTitle: e.target.value
                    })
                  }
                  style={{ fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label className="rf-label" style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--rf-leaf-green)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>
                  Active Module Permissions
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: editingPermissionsMember.permissions.manageWebsite ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: editingPermissionsMember.permissions.manageWebsite ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editingPermissionsMember.permissions.manageWebsite}
                      onChange={e =>
                        setEditingPermissionsMember({
                          ...editingPermissionsMember,
                          permissions: {
                            ...editingPermissionsMember.permissions,
                            manageWebsite: e.target.checked
                          }
                        })
                      }
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        🌐 Manage Website & CMS
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)' }}>
                        Blog, Guides, SEO metadata
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: editingPermissionsMember.permissions.manageCommunityHub ? 'rgba(102, 187, 42, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: editingPermissionsMember.permissions.manageCommunityHub ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editingPermissionsMember.permissions.manageCommunityHub}
                      onChange={e =>
                        setEditingPermissionsMember({
                          ...editingPermissionsMember,
                          permissions: {
                            ...editingPermissionsMember.permissions,
                            manageCommunityHub: e.target.checked
                          }
                        })
                      }
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        💬 Manage Community Hub
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)' }}>
                        Forum moderation, pinned posts
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: editingPermissionsMember.permissions.approveAmbassadors ? 'rgba(246, 178, 26, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: editingPermissionsMember.permissions.approveAmbassadors ? '1px solid rgba(246, 178, 26, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editingPermissionsMember.permissions.approveAmbassadors}
                      onChange={e =>
                        setEditingPermissionsMember({
                          ...editingPermissionsMember,
                          permissions: {
                            ...editingPermissionsMember.permissions,
                            approveAmbassadors: e.target.checked
                          }
                        })
                      }
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        🏆 Approve City Ambassadors
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)' }}>
                        Vet chapter leadership applications
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: editingPermissionsMember.permissions.manageGuildsEvents ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: editingPermissionsMember.permissions.manageGuildsEvents ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editingPermissionsMember.permissions.manageGuildsEvents}
                      onChange={e =>
                        setEditingPermissionsMember({
                          ...editingPermissionsMember,
                          permissions: {
                            ...editingPermissionsMember.permissions,
                            manageGuildsEvents: e.target.checked
                          }
                        })
                      }
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        ⚡ Guilds & Hackathons
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)' }}>
                        Host AMAs, meetups & sprints
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: editingPermissionsMember.permissions.verifyKyc ? 'rgba(102, 187, 42, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: editingPermissionsMember.permissions.verifyKyc ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editingPermissionsMember.permissions.verifyKyc}
                      onChange={e =>
                        setEditingPermissionsMember({
                          ...editingPermissionsMember,
                          permissions: {
                            ...editingPermissionsMember.permissions,
                            verifyKyc: e.target.checked
                          }
                        })
                      }
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        🛡️ Biometric KYC Queue
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)' }}>
                        Approve 3D video liveness & IDs
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: editingPermissionsMember.permissions.arbitrateDisputes ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: editingPermissionsMember.permissions.arbitrateDisputes ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--rf-radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editingPermissionsMember.permissions.arbitrateDisputes}
                      onChange={e =>
                        setEditingPermissionsMember({
                          ...editingPermissionsMember,
                          permissions: {
                            ...editingPermissionsMember.permissions,
                            arbitrateDisputes: e.target.checked
                          }
                        })
                      }
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        ⚖️ Dispute Arbitration
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--rf-slate-300)' }}>
                        Inspect commits & execute refunds
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save & Cancel */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingPermissionsMember(null)}
                  className="rf-btn rf-btn-secondary"
                  style={{ fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEditedPermissions(editingPermissionsMember)}
                  className="rf-btn rf-btn-primary"
                  style={{ fontWeight: 800, gap: '0.45rem' }}
                >
                  <Save size={16} />
                  <span>Save Updated Permissions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
