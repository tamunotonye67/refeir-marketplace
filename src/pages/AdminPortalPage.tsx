import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Shield, Search, Filter, CheckCircle2, Clock, XCircle, AlertCircle,
  ExternalLink, Download, MessageSquare, Mail, RefreshCw, UserCheck,
  ChevronDown, ChevronUp, ChevronRight, Edit3, Save, Lock, LogOut, ArrowRight, ArrowLeft, Star,
  Image as ImageIcon, Award, Eye, Check, FileCheck, Users,
  UserPlus, Trash2, Key, EyeOff, Copy, Ban, UserX, Calendar,
  Building2, Globe, Phone, Send, AtSign, Share2, Briefcase,
  AlertTriangle, Brain, Gift, Zap, Megaphone, PlusCircle, Radio, DollarSign,
  Bell, X, CheckCheck, Menu, BarChart3, Activity, TrendingUp, Target, PieChart, Info, HelpCircle
} from 'lucide-react';
import { db, isFirebaseConfigured, checkFirebaseConnection, FirebaseHealthStatus } from '../lib/firebase';
import {
  TaskSubmissionRecord,
  getTaskSubmissions,
  updateTaskSubmissionStatus,
  MIN_JOBS_FOR_PROMOTION,
  syncTaskSubmissionsToFirebase,
  syncTaskSubmissionsToSupabase
} from '../lib/taskSubmissions';
import {
  updateContributorLevel,
  getAllContributors,
  suspendContributor,
  activateContributor,
  ContributorProfile,
  syncContributorsToFirebase,
  syncContributorsToSupabase,
  fetchContributorsFromDatabase,
  enforceInactivityRule,
  getContributorActivityStatus,
  INACTIVITY_LIMIT_DAYS
} from '../lib/contributorAuth';
import {
  PioneerApplicationRecord,
  getStoredApplications,
  generateAcceptanceCode,
  updateStoredApplication,
  syncApplicationsToFirebase,
  syncApplicationsToSupabase,
  fetchApplicationsFromDatabase
} from '../lib/pioneerApplications';
import {
  StaffMember,
  StaffRole,
  StaffPermissions,
  getStaffMembers,
  saveStaffMembers,
  addStaffMember,
  updateStaffMember,
  updateStaffPassword,
  toggleStaffStatus,
  deleteStaffMember,
  verifyStaffPasscode,
  verifyStaffEmailPassword,
  getActiveStaffSession,
  setActiveStaffSession,
  isTabAuthorized,
  getStaffPermissions,
  fetchStaffMembersFromDatabase,
  syncStaffMembersToFirebase
} from '../lib/staffManagement';
import {
  PioneerCertificate,
  getAllCertificates,
  issueCertificate,
  revokeCertificate,
  getCertificatesByEmail,
  LEVEL_NAMES,
  LEVEL_DESCRIPTIONS,
  syncCertificatesToFirebase,
  syncCertificatesToSupabase,
  fetchCertificatesFromDatabase
} from '../lib/certificates';
import { CertificateModal } from '../components/CertificateModal';
import {
  SquadTask,
  SquadDivision,
  BountyType,
  TaskFrequency,
  SQUAD_INFO,
  getAllSquadTasks,
  createSquadTask,
  deleteSquadTask,
  toggleTaskStatus,
  generateWhatsAppBroadcast,
  openWhatsAppShare,
  syncSquadTasksToFirebase,
  syncSquadTasksToSupabase,
  fetchSquadTasksFromDatabase
} from '../lib/squadTasks';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW,
  RF_ORANGE
} from '../constants/brand';

interface AdminPortalPageProps {
  onNavigate: (path: string) => void;
}

export type ReviewStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';
export type ContributorTier = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';

export interface ApplicationRecord {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  city?: string | null;
  roles: string[];
  skills?: string | null;
  portfolio_url?: string | null;
  primary_division?: string | null;
  contribution?: string | null;
  availability?: string | null;
  motivation?: string | null;
  learning_goals?: string | null;
  discovery_source?: string | null;
  status: ReviewStatus;
  contributor_level?: ContributorTier;
  is_founding_100: boolean;
  pioneer_id?: string | null;
  acceptance_code?: string | null;
  account_created?: boolean;
  internal_notes?: string | null;
  created_at: string;
}

const DEFAULT_PASSCODE = 'refeir2026';

// Realistic sample applications for preview when no live database records exist
const DEMO_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'demo-1',
    application_number: 'RP-2026-849201',
    full_name: 'Chidubem Nwosu',
    email: 'chidubem.nwosu@example.com',
    whatsapp_number: '+2348031234567',
    country: 'Nigeria',
    city: 'Lagos',
    roles: ['Developer', 'Product'],
    skills: 'TypeScript, React, Node.js, Smart Contract Escrows, PostgreSQL',
    portfolio_url: 'https://github.com/chidubem-demo',
    primary_division: 'TECH_PRODUCT',
    contribution: 'Want to build and audit the smart contract milestone escrow system.',
    availability: '6–10 hours/week',
    motivation: 'Africa needs decentralized trust infrastructure to unlock cross-border freelance payouts.',
    learning_goals: 'Deep dive into decentralized referral loops and tokenomics.',
    discovery_source: 'Twitter / X',
    status: 'ACCEPTED',
    contributor_level: 'LEVEL_3',
    is_founding_100: true,
    pioneer_id: 'RP-012',
    internal_notes: 'Strong fullstack candidate. Approved for Tech & Product squad. Delivered smart escrow contract tests.',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'demo-2',
    application_number: 'RP-2026-612948',
    full_name: 'Amina Kimani',
    email: 'amina.k@example.com',
    whatsapp_number: '+254712345678',
    country: 'Kenya',
    city: 'Nairobi',
    roles: ['Designer'],
    skills: 'Figma, UI/UX, Design Systems, Mobile Interaction Design',
    portfolio_url: 'https://dribbble.com/amina-demo',
    primary_division: 'CREATIVE',
    contribution: 'Crafting the mobile app UI component library and freelancer profile screens.',
    availability: '3–5 hours/week',
    motivation: 'Excited about shaping the visual identity and usability of Refeir.',
    learning_goals: 'Leading design critique sessions with fellow African designers.',
    discovery_source: 'LinkedIn',
    status: 'ACCEPTED',
    contributor_level: 'LEVEL_2',
    is_founding_100: true,
    pioneer_id: 'RP-028',
    internal_notes: 'High-quality portfolio. Submitted pioneer mobile design mocks.',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'demo-3',
    application_number: 'RP-2026-492019',
    full_name: 'Kwame Mensah',
    email: 'kwame.mensah@example.com',
    whatsapp_number: '+233241234567',
    country: 'Ghana',
    city: 'Accra',
    roles: ['Marketer', 'Community Builder'],
    skills: 'Viral loops, Campus Ambassador Growth, Content Strategy',
    portfolio_url: 'https://linkedin.com/in/kwame-demo',
    primary_division: 'GROWTH',
    contribution: 'Setting up campus developer chapters across University of Ghana and KNUST.',
    availability: '6–10 hours/week',
    motivation: 'I run a 5,000+ member student tech community eager for verified freelance opportunities.',
    learning_goals: 'Mastering platform referral economics and community scaling.',
    discovery_source: 'WhatsApp Community',
    status: 'PENDING',
    contributor_level: 'LEVEL_1',
    is_founding_100: false,
    pioneer_id: null,
    internal_notes: '',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'demo-4',
    application_number: 'RP-2026-728193',
    full_name: 'Thabo Mokoena',
    email: 'thabo.m@example.com',
    whatsapp_number: '+27821234567',
    country: 'South Africa',
    city: 'Johannesburg',
    roles: ['Business Developer', 'Entrepreneur'],
    skills: 'B2B Sales, Fintech Partnerships, Legal Frameworks',
    portfolio_url: 'https://linkedin.com/in/thabo-demo',
    primary_division: 'BUSINESS',
    contribution: 'Connecting Refeir with South African venture studios and tech agencies for pilot jobs.',
    availability: '3–5 hours/week',
    motivation: 'Refeir’s referral model solves the trust deficit between foreign clients and African talent.',
    learning_goals: 'Exploring cross-border fiat-to-stablecoin rails.',
    discovery_source: 'TechCabal Article',
    status: 'PENDING',
    is_founding_100: false,
    pioneer_id: null,
    internal_notes: '',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onNavigate }) => {
  // Mobile Lockout Detection
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isSmallScreen = window.innerWidth < 1024;
    const isTouchMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isSmallScreen || isTouchMobile;
  });

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 1024;
      const isTouchMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isSmallScreen || isTouchMobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('refeir_admin_auth') === 'true';
  });
  const [loggedInStaff, setLoggedInStaff] = useState<StaffMember | null>(() => getActiveStaffSession());
  const [loginMode, setLoginMode] = useState<'email' | 'passcode'>('email');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Data & Management State
  type AdminTabType = 'applications' | 'proofs' | 'members' | 'workers' | 'certificates' | 'tasks' | 'analytics';

  const getSavedTab = (): AdminTabType => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab')?.toLowerCase();
      const storedTab = (localStorage.getItem('refeir_admin_tab') || sessionStorage.getItem('refeir_admin_tab'))?.toLowerCase();
      const candidate = urlTab || storedTab;

      if (candidate === 'tasks' || candidate === 'squad-tasks' || candidate === 'bounties') return 'tasks';
      if (candidate === 'proofs' || candidate === 'submissions') return 'proofs';
      if (candidate === 'members' || candidate === 'pioneers') return 'members';
      if (candidate === 'workers' || candidate === 'staff' || candidate === 'team') return 'workers';
      if (candidate === 'certificates' || candidate === 'accreditations') return 'certificates';
      if (candidate === 'analytics' || candidate === 'telemetry') return 'analytics';
      if (candidate === 'applications' || candidate === 'admissions') return 'applications';
    } catch {}
    return 'applications';
  };

  const [adminTab, setAdminTabState] = useState<AdminTabType>(getSavedTab);

  const setAdminTab = (newTab: AdminTabType) => {
    setAdminTabState(newTab);
    try {
      localStorage.setItem('refeir_admin_tab', newTab);
      sessionStorage.setItem('refeir_admin_tab', newTab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState(null, '', url.pathname + url.search);
    } catch {}
  };

  const [refreshSuccessToast, setRefreshSuccessToast] = useState('');

  const [adminMobileNavOpen, setAdminMobileNavOpen] = useState(false);
  const [adminProfileDockerOpen, setAdminProfileDockerOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmissionRecord[]>([]);
  const [membersList, setMembersList] = useState<ContributorProfile[]>(() => getAllContributors());
  const [certificatesList, setCertificatesList] = useState<PioneerCertificate[]>(() => getAllCertificates());
  const [selectedCertificateForModal, setSelectedCertificateForModal] = useState<PioneerCertificate | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [issueCertModalOpen, setIssueCertModalOpen] = useState(false);
  const [issueCertMemberEmail, setIssueCertMemberEmail] = useState('');
  const [issueCertLevel, setIssueCertLevel] = useState<ContributorTier>('LEVEL_1');
  const [issueCertDistinction, setIssueCertDistinction] = useState('Founding Pioneer Accreditations & Verified Proof-of-Work Deliverables');
  const [certSearchTerm, setCertSearchTerm] = useState('');
  const [certLevelFilter, setCertLevelFilter] = useState('ALL');
  const [certStatusFilter, setCertStatusFilter] = useState<'ALL' | 'ISSUED' | 'REVOKED'>('ALL');
  const [certFeedbackMsg, setCertFeedbackMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeApp, setActiveApp] = useState<ApplicationRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Pioneer Members State
  const [selectedMember, setSelectedMember] = useState<ContributorProfile | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [surveyExpanded, setSurveyExpanded] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [memberDivisionFilter, setMemberDivisionFilter] = useState('ALL');
  const [memberLevelFilter, setMemberLevelFilter] = useState('ALL');
  const [suspendModalMember, setSuspendModalMember] = useState<ContributorProfile | null>(null);
  const [suspendReasonInput, setSuspendReasonInput] = useState('Violation of Refeir Pioneer Code of Conduct');
  const [memberActionFeedback, setMemberActionFeedback] = useState('');

  // Staff / Workers Management State
  const [staffList, setStaffList] = useState<StaffMember[]>(() => getStaffMembers());
  const [addWorkerModalOpen, setAddWorkerModalOpen] = useState(false);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('ALL');
  const [revealedPasscodes, setRevealedPasscodes] = useState<Record<string, boolean>>({});
  const [copiedPasscodeId, setCopiedPasscodeId] = useState<string | null>(null);

  // Squad Lead Appointment from Pioneer Members State
  const [appointSquadLeadModalOpen, setAppointSquadLeadModalOpen] = useState(false);
  const [appointLeadMember, setAppointLeadMember] = useState<ContributorProfile | null>(null);
  const [appointLeadDivision, setAppointLeadDivision] = useState<string>('TECH_PRODUCT');
  const [appointLeadPasscode, setAppointLeadPasscode] = useState<string>('');
  const [appointLeadPassword, setAppointLeadPassword] = useState<string>('');
  const [appointLeadError, setAppointLeadError] = useState<string>('');
  const [appointLeadSearchTerm, setAppointLeadSearchTerm] = useState<string>('');

  // New Worker Form Fields
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerEmail, setNewWorkerEmail] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState<StaffRole>('ADMISSIONS_REVIEWER');
  const [newWorkerDivision, setNewWorkerDivision] = useState('ALL');
  const [newWorkerPasscode, setNewWorkerPasscode] = useState('');
  const [newWorkerPassword, setNewWorkerPassword] = useState('');
  const [workerFormError, setWorkerFormError] = useState('');

  // Edit Staff Member & Reset Password State
  const [editStaffModalOpen, setEditStaffModalOpen] = useState(false);
  const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null);
  const [editStaffName, setEditStaffName] = useState('');
  const [editStaffEmail, setEditStaffEmail] = useState('');
  const [editStaffRole, setEditStaffRole] = useState<StaffRole>('ADMISSIONS_REVIEWER');
  const [editStaffDivision, setEditStaffDivision] = useState('ALL');
  const [editStaffPasscode, setEditStaffPasscode] = useState('');
  const [editStaffPassword, setEditStaffPassword] = useState('');
  const [editStaffStatus, setEditStaffStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [showEditStaffPassword, setShowEditStaffPassword] = useState(false);
  const [editStaffError, setEditStaffError] = useState('');
  const [editStaffSuccess, setEditStaffSuccess] = useState('');

  // Proofs of Work Review State
  const [activeTask, setActiveTask] = useState<TaskSubmissionRecord | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskFeedback, setTaskFeedback] = useState('');
  const [updatingTask, setUpdatingTask] = useState(false);
  const [screenshotModalUrl, setScreenshotModalUrl] = useState<string | null>(null);
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('ALL');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [divisionFilter, setDivisionFilter] = useState<string>('ALL');
  const [foundingOnly, setFoundingOnly] = useState(false);

  // Edit / Action State inside Modal
  const [editStatus, setEditStatus] = useState<ReviewStatus>('PENDING');
  const [editContributorLevel, setEditContributorLevel] = useState<ContributorTier>('LEVEL_1');
  const [editIsFounding, setEditIsFounding] = useState(false);
  const [editPioneerId, setEditPioneerId] = useState('');
  const [editAcceptanceCode, setEditAcceptanceCode] = useState<string | null>(null);
  const [copiedCodeAppId, setCopiedCodeAppId] = useState<string | null>(null);
  const [copiedModalCode, setCopiedModalCode] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [savingChanges, setSavingChanges] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Handle Login — supports email+password (primary) and passcode (legacy)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    let staff = null;

    if (loginMode === 'email') {
      const email = loginEmail.trim();
      const pwd = loginPassword.trim();
      if (!email) { setAuthError('Please enter your email address.'); return; }
      if (!pwd) { setAuthError('Please enter your password.'); return; }
      staff = verifyStaffEmailPassword(email, pwd);
      if (!staff) {
        setAuthError('No matching active staff account. Check your email or password, or contact the Super Admin.');
        return;
      }
    } else {
      const cleanPass = passcode.trim();
      staff = verifyStaffPasscode(cleanPass);
      if (!staff) {
        setAuthError('Invalid passcode. Use your assigned worker passcode or master key "refeir2026".');
        return;
      }
    }

    sessionStorage.setItem('refeir_admin_auth', 'true');
    setActiveStaffSession(staff);
    setLoggedInStaff(staff);
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('refeir_admin_auth');
    setActiveStaffSession(null);
    setLoggedInStaff(null);
    setIsAuthenticated(false);
    setPasscode('');
    setLoginEmail('');
    setLoginPassword('');
  };

  const isSuperAdmin = loggedInStaff?.role === 'SUPER_ADMIN';

  // Role-Based Access Control (RBAC) Permissions
  const permissions: StaffPermissions = useMemo(() => {
    return getStaffPermissions(loggedInStaff?.role || 'TASK_VIEWER');
  }, [loggedInStaff]);

  // Toggle Worker Active / Suspended (Super Admin Only)
  const handleToggleStaff = (id: string) => {
    if (!permissions.canManageStaff) {
      alert('Unauthorized: Only Super Admin (Tonye Taylor) has permission to suspend or activate staff members.');
      return;
    }
    toggleStaffStatus(id);
    setStaffList(getStaffMembers());
  };

  // Delete Worker (Super Admin Only)
  const handleDeleteStaff = (id: string) => {
    if (!permissions.canManageStaff) {
      alert('Unauthorized: Only Super Admin (Tonye Taylor) has permission to remove staff members.');
      return;
    }
    if (window.confirm('Are you sure you want to remove this staff worker? Their access will be revoked immediately.')) {
      deleteStaffMember(id);
      setStaffList(getStaffMembers());
    }
  };

  // Add Worker Modal Submission (Super Admin Only)
  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkerFormError('');

    if (!isSuperAdmin) {
      setWorkerFormError('Unauthorized: Only Super Admin (Tonye Taylor) can register new staff workers.');
      return;
    }

    if (!newWorkerName.trim()) {
      setWorkerFormError('Please enter the worker’s full name.');
      return;
    }
    if (!newWorkerEmail.trim() || !newWorkerEmail.includes('@')) {
      setWorkerFormError('Please enter a valid email address.');
      return;
    }
    if (!newWorkerPasscode.trim()) {
      setWorkerFormError('Please enter an access passcode for this worker.');
      return;
    }

    const defaultPwd = newWorkerPassword.trim() || `${newWorkerName.trim().split(' ')[0]}@Refeir2026!`;

    addStaffMember({
      name: newWorkerName.trim(),
      email: newWorkerEmail.trim().toLowerCase(),
      role: newWorkerRole,
      assigned_division: newWorkerDivision,
      passcode: newWorkerPasscode.trim(),
      password: defaultPwd,
      status: 'ACTIVE'
    });

    setStaffList(getStaffMembers());
    setNewWorkerName('');
    setNewWorkerEmail('');
    setNewWorkerPasscode('');
    setNewWorkerPassword('');
    setAddWorkerModalOpen(false);
  };

  // Open Edit Staff Modal
  const handleOpenEditStaff = (member: StaffMember) => {
    if (!permissions.canManageStaff) {
      alert('Unauthorized: Only Super Admin (Tonye Taylor) can edit staff details or reset credentials.');
      return;
    }
    setEditingStaffMember(member);
    setEditStaffName(member.name);
    setEditStaffEmail(member.email);
    setEditStaffRole(member.role);
    setEditStaffDivision(member.assigned_division);
    setEditStaffPasscode(member.passcode);
    setEditStaffPassword(member.password || '');
    setEditStaffStatus(member.status);
    setShowEditStaffPassword(false);
    setEditStaffError('');
    setEditStaffSuccess('');
    setEditStaffModalOpen(true);
  };

  // Save Edit Staff Changes
  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setEditStaffError('');
    setEditStaffSuccess('');

    if (!permissions.canManageStaff || !editingStaffMember) {
      setEditStaffError('Unauthorized: Only Super Admin has permission to modify staff records.');
      return;
    }

    if (!editStaffName.trim()) {
      setEditStaffError('Please enter the staff member’s full name.');
      return;
    }
    if (!editStaffEmail.trim() || !editStaffEmail.includes('@')) {
      setEditStaffError('Please enter a valid email address.');
      return;
    }
    if (!editStaffPasscode.trim()) {
      setEditStaffError('Access passcode cannot be empty.');
      return;
    }

    const updated = updateStaffMember(editingStaffMember.id, {
      name: editStaffName.trim(),
      email: editStaffEmail.trim().toLowerCase(),
      role: editStaffRole,
      assigned_division: editStaffDivision,
      passcode: editStaffPasscode.trim(),
      password: editStaffPassword.trim() || undefined,
      status: editStaffStatus
    });

    if (updated) {
      setStaffList(getStaffMembers());
      // If the Super Admin edited their own account, update session too
      if (loggedInStaff?.id === updated.id) {
        setLoggedInStaff(updated);
        setActiveStaffSession(updated);
      }
      setEditStaffSuccess('Staff details and credentials updated successfully!');
      setTimeout(() => {
        setEditStaffModalOpen(false);
        setEditingStaffMember(null);
      }, 1000);
    } else {
      setEditStaffError('Failed to update staff record. Please try again.');
    }
  };

  const handleCopyPasscode = (id: string, code: string) => {
    if (!isSuperAdmin) {
      alert('Unauthorized: Passcode access is strictly restricted to Super Admin.');
      return;
    }
    navigator.clipboard.writeText(code);
    setCopiedPasscodeId(id);
    setTimeout(() => setCopiedPasscodeId(null), 2000);
  };

  // Helper to count verified jobs for any contributor
  const getVerifiedJobsCount = (email: string, includeCurrentTaskId?: string): number => {
    return taskSubmissions.filter(t => {
      const matchEmail = t.email.toLowerCase() === email.toLowerCase();
      if (!matchEmail) return false;
      if (includeCurrentTaskId && t.id === includeCurrentTaskId) return true;
      return t.status === 'VERIFIED';
    }).length;
  };

  // Fetch Applications and Task Submissions
  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Fetch task submissions
      try {
        const tasks = await getTaskSubmissions();
        setTaskSubmissions(tasks);
      } catch (e) {
        console.warn('Error loading task submissions:', e);
      }

      if (isFirebaseConfigured) {
        const apps = await fetchApplicationsFromDatabase();
        if (apps && apps.length > 0) {
          setApplications(apps as ApplicationRecord[]);
          setLoading(false);
          return;
        }
      }
      // Load from local storage registry with acceptance codes
      const stored = getStoredApplications();
      setApplications(stored as ApplicationRecord[]);
    } catch (err) {
      console.error(err);
      setApplications(getStoredApplications() as ApplicationRecord[]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTaskModal = (task: TaskSubmissionRecord) => {
    setActiveTask(task);
    setTaskFeedback(task.admin_feedback || '');
    setTaskModalOpen(true);
  };

  const handleUpdateTaskStatus = async (newStatus: 'VERIFIED' | 'NEEDS_REVISION' | 'REJECTED') => {
    if (!activeTask) return;
    if (!permissions.canVerifyTasks) {
      alert('Unauthorized: You do not have permission to verify or reject proofs of work.');
      return;
    }
    if (loggedInStaff?.role === 'SQUAD_LEAD' && loggedInStaff.assigned_division !== 'ALL' && activeTask.division !== loggedInStaff.assigned_division) {
      alert(`Unauthorized: As Squad Lead for ${loggedInStaff.assigned_division.replace('_', ' ')}, you can only verify deliverables submitted to your assigned squad.`);
      return;
    }
    setUpdatingTask(true);
    try {
      await updateTaskSubmissionStatus(activeTask.id, newStatus, taskFeedback.trim());
      setTaskSubmissions(prev =>
        prev.map(t => (t.id === activeTask.id ? { ...t, status: newStatus, admin_feedback: taskFeedback.trim() } : t))
      );

      // Promotion qualification check: Contributors are NOT promoted automatically on a single task.
      // Must satisfy the required threshold of verified completed jobs.
      if (newStatus === 'VERIFIED') {
        const contributorEmail = activeTask.email.toLowerCase();
        const previouslyVerified = taskSubmissions.filter(
          t => t.email.toLowerCase() === contributorEmail && t.id !== activeTask.id && t.status === 'VERIFIED'
        ).length;
        const totalVerifiedJobs = previouslyVerified + 1;

        const targetTier = activeTask.target_level;
        const requiredJobs = MIN_JOBS_FOR_PROMOTION[targetTier] || 15;

        const matchingApp = applications.find(
          a =>
            (activeTask.application_number && a.application_number === activeTask.application_number) ||
            a.email.toLowerCase() === contributorEmail
        );

        if (totalVerifiedJobs >= requiredJobs) {
          // Meets or exceeds required job threshold -> Promote
          if (matchingApp) {
            setApplications(prev =>
              prev.map(a =>
                a.id === matchingApp.id ? { ...a, contributor_level: targetTier, status: 'ACCEPTED' } : a
              )
            );
          }
          updateContributorLevel(activeTask.email, targetTier);

          // Auto-issue Certificate for qualified level
          issueCertificate({
            pioneer_id: activeTask.pioneer_id || matchingApp?.pioneer_id || undefined,
            application_number: activeTask.application_number || matchingApp?.application_number || undefined,
            recipient_name: activeTask.full_name,
            recipient_email: contributorEmail,
            level: targetTier,
            division: activeTask.division,
            verified_jobs_count: totalVerifiedJobs,
            issued_by: loggedInStaff ? `${loggedInStaff.name} (${loggedInStaff.role.replace('_', ' ')})` : 'Tonye Taylor (Platform Architect & Founder)'
          });
          setCertificatesList(getAllCertificates());
        } else {
          // Do not promote yet. Keep level and accept application if pending.
          if (matchingApp && matchingApp.status !== 'ACCEPTED') {
            setApplications(prev =>
              prev.map(a =>
                a.id === matchingApp.id ? { ...a, status: 'ACCEPTED' } : a
              )
            );
          }
        }
      }

      setTaskModalOpen(false);
    } catch (err) {
      console.error('Task status update failed:', err);
    } finally {
      setUpdatingTask(false);
    }
  };

  // Comprehensive Unified Refresh Handler
  const handleRefreshData = async () => {
    setLoading(true);
    try {
      // 1. Refresh Applications from DB / Storage
      await fetchApplications();

      // 2. Refresh Task Submissions
      try {
        const tasks = await getTaskSubmissions();
        setTaskSubmissions(tasks);
      } catch (e) {
        console.warn('Error reloading task submissions:', e);
      }

      // 3. Refresh Pioneer Members & Enforce 14-Day Inactivity Rule
      try {
        let loadedMembers: ContributorProfile[] = [];
        if (isFirebaseConfigured) {
          const dbContributors = await fetchContributorsFromDatabase();
          if (dbContributors && dbContributors.length > 0) {
            loadedMembers = dbContributors;
          } else {
            loadedMembers = getAllContributors();
          }
        } else {
          loadedMembers = getAllContributors();
        }

        // Enforce strict 14-day inactivity demotion rule to Level 1
        const currentTasks = await getTaskSubmissions().catch(() => taskSubmissions);
        const { updatedContributors, demotedCount } = enforceInactivityRule(loadedMembers, currentTasks);
        if (demotedCount > 0) {
          loadedMembers = updatedContributors || getAllContributors();
        }
        setMembersList(loadedMembers);
      } catch {
        setMembersList(getAllContributors());
      }

      // 4. Refresh Staff
      try {
        if (isFirebaseConfigured) {
          const dbStaff = await fetchStaffMembersFromDatabase();
          setStaffList(dbStaff || getStaffMembers());
        } else {
          setStaffList(getStaffMembers());
        }
      } catch {
        setStaffList(getStaffMembers());
      }

      // 5. Refresh Certificates
      try {
        if (isFirebaseConfigured) {
          const dbCerts = await fetchCertificatesFromDatabase();
          if (dbCerts && dbCerts.length > 0) {
            setCertificatesList(dbCerts);
          } else {
            setCertificatesList(getAllCertificates());
          }
        } else {
          setCertificatesList(getAllCertificates());
        }
      } catch {
        setCertificatesList(getAllCertificates());
      }

      // 6. Refresh Squad Tasks
      try {
        if (isFirebaseConfigured) {
          const dbTasks = await fetchSquadTasksFromDatabase();
          if (dbTasks && dbTasks.length > 0) {
            setTasksList(dbTasks);
          } else {
            setTasksList(getAllSquadTasks());
          }
        } else {
          setTasksList(getAllSquadTasks());
        }
      } catch {
        setTasksList(getAllSquadTasks());
      }

      setRefreshSuccessToast('Portal data synchronized & refreshed successfully!');
      setTimeout(() => setRefreshSuccessToast(''), 3500);
    } catch (err) {
      console.error('Error refreshing portal data:', err);
      setRefreshSuccessToast('Portal data reloaded from local storage.');
      setTimeout(() => setRefreshSuccessToast(''), 3500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleRefreshData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && loggedInStaff) {
      if (!isTabAuthorized(loggedInStaff.role, adminTab)) {
        const allowed: AdminTabType[] = ['applications', 'proofs', 'members', 'workers', 'certificates', 'tasks', 'analytics'];
        const firstAllowed = allowed.find(t => isTabAuthorized(loggedInStaff.role, t));
        if (firstAllowed) {
          setAdminTabState(firstAllowed);
          return;
        }
      }
    }
    try {
      const saved = getSavedTab();
      if (saved && saved !== adminTab && (!loggedInStaff || isTabAuthorized(loggedInStaff.role, saved))) {
        setAdminTabState(saved);
      }
      localStorage.setItem('refeir_admin_tab', adminTab);
      sessionStorage.setItem('refeir_admin_tab', adminTab);
      const url = new URL(window.location.href);
      if (url.searchParams.get('tab') !== adminTab) {
        url.searchParams.set('tab', adminTab);
        window.history.replaceState(null, '', url.pathname + url.search);
      }
    } catch {}
  }, [adminTab, isAuthenticated, loggedInStaff]);

  // Filtered Applications List
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch =
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.city && app.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.pioneer_id && app.pioneer_id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const matchesDivision = divisionFilter === 'ALL' || app.primary_division === divisionFilter;
      const matchesFounding = !foundingOnly || app.is_founding_100;

      return matchesSearch && matchesStatus && matchesDivision && matchesFounding;
    });
  }, [applications, searchTerm, statusFilter, divisionFilter, foundingOnly]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'PENDING').length;
    const reviewing = applications.filter(a => a.status === 'REVIEWING').length;
    const accepted = applications.filter(a => a.status === 'ACCEPTED').length;
    const founding = applications.filter(a => a.is_founding_100).length;
    return { total, pending, reviewing, accepted, founding };
  }, [applications]);

  // Task Submissions Statistics
  const taskStats = useMemo(() => {
    const total = taskSubmissions.length;
    const pending = taskSubmissions.filter(t => t.status === 'PENDING').length;
    const verified = taskSubmissions.filter(t => t.status === 'VERIFIED').length;
    const needsRevision = taskSubmissions.filter(t => t.status === 'NEEDS_REVISION').length;
    return { total, pending, verified, needsRevision };
  }, [taskSubmissions]);

  // Filtered Task Submissions
  const filteredTasks = useMemo(() => {
    return taskSubmissions.filter(t => {
      const matchSearch =
        t.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = taskFilterStatus === 'ALL' || t.status === taskFilterStatus;
      const matchDivision = divisionFilter === 'ALL' || t.division === divisionFilter;
      return matchSearch && matchStatus && matchDivision;
    });
  }, [taskSubmissions, searchTerm, taskFilterStatus, divisionFilter]);

  // Filtered Staff Workers
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
        s.assigned_division.toLowerCase().includes(staffSearchTerm.toLowerCase());
      const matchRole = staffRoleFilter === 'ALL' || s.role === staffRoleFilter;
      return matchSearch && matchRole;
    });
  }, [staffList, staffSearchTerm, staffRoleFilter]);

  // Filtered Members Memo
  const filteredMembers = useMemo(() => {
    return membersList.filter(m => {
      const q = memberSearchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.pioneer_id && m.pioneer_id.toLowerCase().includes(q)) ||
        (m.application_number && m.application_number.toLowerCase().includes(q)) ||
        (m.country && m.country.toLowerCase().includes(q)) ||
        (m.city && m.city.toLowerCase().includes(q)) ||
        (m.institution && m.institution.toLowerCase().includes(q));

      const matchStatus =
        memberStatusFilter === 'ALL' ||
        (memberStatusFilter === 'SUSPENDED' && m.is_suspended) ||
        (memberStatusFilter === 'ACTIVE' && !m.is_suspended);

      const matchDivision =
        memberDivisionFilter === 'ALL' || m.division === memberDivisionFilter;

      const matchLevel =
        memberLevelFilter === 'ALL' || m.contributor_level === memberLevelFilter;

      return matchSearch && matchStatus && matchDivision && matchLevel;
    });
  }, [membersList, memberSearchTerm, memberStatusFilter, memberDivisionFilter, memberLevelFilter]);

  const memberStats = useMemo(() => {
    return {
      total: membersList.length,
      active: membersList.filter(m => !m.is_suspended).length,
      suspended: membersList.filter(m => m.is_suspended).length,
      completed: membersList.filter(m => m.is_profile_completed).length
    };
  }, [membersList]);

  const refreshMembers = () => {
    setMembersList(getAllContributors());
  };

  const handleOpenMemberModal = (member: ContributorProfile) => {
    setSelectedMember(member);
    setSurveyExpanded(false);
    setMemberModalOpen(true);
  };

  const handleOpenSuspendModal = (member: ContributorProfile) => {
    if (!permissions.canSuspendMembers) {
      alert('Unauthorized: You do not have permission to suspend pioneer accounts.');
      return;
    }
    setSuspendModalMember(member);
    setSuspendReasonInput('Violation of Refeir Pioneer Code of Conduct');
  };

  const handleConfirmSuspend = () => {
    if (!suspendModalMember) return;
    if (!permissions.canSuspendMembers) {
      alert('Unauthorized: You do not have permission to suspend pioneer accounts.');
      return;
    }
    try {
      const updated = suspendContributor(suspendModalMember.email, suspendReasonInput);
      refreshMembers();
      if (selectedMember?.email.toLowerCase() === suspendModalMember.email.toLowerCase()) {
        setSelectedMember(updated);
      }
      setMemberActionFeedback(`Account for ${suspendModalMember.full_name} was suspended.`);
      setTimeout(() => setMemberActionFeedback(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to suspend member');
    } finally {
      setSuspendModalMember(null);
    }
  };

  const handleReactivateMember = (member: ContributorProfile) => {
    if (!permissions.canSuspendMembers) {
      alert('Unauthorized: You do not have permission to reactivate pioneer accounts.');
      return;
    }
    try {
      const updated = activateContributor(member.email);
      refreshMembers();
      if (selectedMember?.email.toLowerCase() === member.email.toLowerCase()) {
        setSelectedMember(updated);
      }
      setMemberActionFeedback(`Account for ${member.full_name} was reactivated.`);
      setTimeout(() => setMemberActionFeedback(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to reactivate member');
    }
  };

  const handlePromoteMemberLevel = (email: string, newLevel: ContributorTier) => {
    if (!permissions.canModifyMemberTier) {
      alert('Unauthorized: Only Super Admin has authority to manually override or promote pioneer ranks.');
      return;
    }
    updateContributorLevel(email, newLevel);
    refreshMembers();
    if (selectedMember?.email.toLowerCase() === email.toLowerCase()) {
      setSelectedMember(prev => prev ? { ...prev, contributor_level: newLevel } : null);
    }

    // Auto-issue Certificate for newly accredited level
    const targetMember = membersList.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (targetMember) {
      issueCertificate({
        pioneer_id: targetMember.pioneer_id,
        application_number: targetMember.application_number,
        recipient_name: targetMember.full_name,
        recipient_email: targetMember.email,
        level: newLevel,
        division: targetMember.division,
        verified_jobs_count: getVerifiedJobsCount(email),
        issued_by: loggedInStaff ? `${loggedInStaff.name} (${loggedInStaff.role.replace('_', ' ')})` : 'Tonye Taylor (Platform Architect & Founder)'
      });
      setCertificatesList(getAllCertificates());
    }

    setMemberActionFeedback(`Rank upgraded to ${newLevel.replace('_', ' ')} and Certificate issued.`);
    setTimeout(() => setMemberActionFeedback(''), 4000);
  };

  const handleOpenAppointSquadLead = (member?: ContributorProfile) => {
    if (!permissions.canManageStaff) {
      alert('Unauthorized: Only Super Admin can appoint Squad Leads.');
      return;
    }
    if (member) {
      setAppointLeadMember(member);
      const app = applications.find(a => a.email.toLowerCase() === member.email.toLowerCase());
      setAppointLeadDivision(app?.primary_division || 'TECH_PRODUCT');
    } else {
      setAppointLeadMember(null);
      setAppointLeadDivision('TECH_PRODUCT');
    }
    const randomPin = Math.floor(1000 + Math.random() * 9000);
    const cleanFirst = member?.full_name?.split(' ')[0]?.toLowerCase() || 'lead';
    setAppointLeadPasscode(`${cleanFirst}${randomPin}`);
    setAppointLeadPassword(`Refeir@${randomPin}!`);
    setAppointLeadError('');
    setAppointLeadSearchTerm('');
    setAppointSquadLeadModalOpen(true);
  };

  const handleConfirmAppointSquadLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canManageStaff) {
      setAppointLeadError('Unauthorized: Only Super Admin can appoint Squad Leads.');
      return;
    }
    if (!appointLeadMember) {
      setAppointLeadError('Please select a pioneer member to appoint as Squad Lead.');
      return;
    }
    if (!appointLeadDivision) {
      setAppointLeadError('Please select an assigned division.');
      return;
    }
    if (!appointLeadPasscode.trim()) {
      setAppointLeadError('Please enter a passcode for the Squad Lead.');
      return;
    }

    // Check if member already has a staff account
    const existingStaff = staffList.find(s => s.email.toLowerCase() === appointLeadMember.email.toLowerCase());
    if (existingStaff) {
      const updated = staffList.map(s => s.id === existingStaff.id ? {
        ...s,
        role: 'SQUAD_LEAD' as StaffRole,
        assigned_division: appointLeadDivision,
        passcode: appointLeadPasscode.trim(),
        password: appointLeadPassword.trim() || s.password || `Refeir@2026!`,
        status: 'ACTIVE' as const
      } : s);
      saveStaffMembers(updated);
      setStaffList(updated);
    } else {
      addStaffMember({
        name: appointLeadMember.full_name,
        email: appointLeadMember.email,
        role: 'SQUAD_LEAD',
        assigned_division: appointLeadDivision,
        passcode: appointLeadPasscode.trim(),
        password: appointLeadPassword.trim() || `Refeir@2026!`,
        status: 'ACTIVE'
      });
      setStaffList(getStaffMembers());
    }

    // Upgrade rank to Level 3 (Squad Architect) if lower
    if (!appointLeadMember.contributor_level || appointLeadMember.contributor_level === 'LEVEL_1' || appointLeadMember.contributor_level === 'LEVEL_2') {
      updateContributorLevel(appointLeadMember.email, 'LEVEL_3');
      refreshMembers();
    }

    setAppointSquadLeadModalOpen(false);
    setRefreshSuccessToast(`⭐ ${appointLeadMember.full_name} was successfully appointed as Squad Lead for ${appointLeadDivision.replace('_', ' ')}!`);
    setTimeout(() => setRefreshSuccessToast(''), 5000);
  };

  const refreshCertificates = () => {
    setCertificatesList(getAllCertificates());
  };

  const handleOpenIssueCertModal = (memberEmail?: string, defaultLevel?: ContributorTier) => {
    if (!permissions.canIssueCertificates) {
      alert('Unauthorized: You do not have permission to issue certificates.');
      return;
    }
    if (memberEmail) {
      setIssueCertMemberEmail(memberEmail);
    } else if (membersList.length > 0) {
      setIssueCertMemberEmail(membersList[0].email);
    }
    if (defaultLevel) {
      setIssueCertLevel(defaultLevel);
    }
    setIssueCertModalOpen(true);
  };

  const handleConfirmIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canIssueCertificates) {
      alert('Unauthorized: You do not have permission to issue certificates.');
      return;
    }
    const targetMember = membersList.find(m => m.email.toLowerCase() === issueCertMemberEmail.toLowerCase());
    if (!targetMember) {
      alert('Selected pioneer member was not found');
      return;
    }
    const cert = issueCertificate({
      pioneer_id: targetMember.pioneer_id,
      application_number: targetMember.application_number,
      recipient_name: targetMember.full_name,
      recipient_email: targetMember.email,
      level: issueCertLevel,
      division: targetMember.division,
      verified_jobs_count: getVerifiedJobsCount(targetMember.email),
      issued_by: loggedInStaff ? `${loggedInStaff.name} (${loggedInStaff.role.replace('_', ' ')})` : 'Tonye Taylor (Platform Architect & Founder)',
      special_distinction: issueCertDistinction.trim()
    });

    setCertificatesList(getAllCertificates());
    setIssueCertModalOpen(false);
    setCertFeedbackMsg(`Official Certificate (${cert.id}) minted for ${targetMember.full_name}!`);
    setTimeout(() => setCertFeedbackMsg(''), 5000);
  };

  const handleRevokeCertificate = (id: string) => {
    if (!permissions.canRevokeCertificates) {
      alert('Unauthorized: Only Super Admin has authority to revoke minted certificates.');
      return;
    }
    const reason = window.prompt('Enter reason for revoking this certificate:');
    if (reason === null) return;
    revokeCertificate(id, reason.trim() || 'Administrative revocation');
    setCertificatesList(getAllCertificates());
    setCertFeedbackMsg('Certificate has been revoked.');
    setTimeout(() => setCertFeedbackMsg(''), 4000);
  };

  const handleViewCertificate = (cert: PioneerCertificate) => {
    setSelectedCertificateForModal(cert);
    setIsCertificateModalOpen(true);
  };

  // Filtered Certificates List
  const filteredCertificates = useMemo(() => {
    return certificatesList.filter(c => {
      const q = certSearchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.recipient_name.toLowerCase().includes(q) ||
        c.recipient_email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.pioneer_id.toLowerCase().includes(q) ||
        c.division.toLowerCase().includes(q) ||
        c.verification_hash.toLowerCase().includes(q);

      const matchLevel = certLevelFilter === 'ALL' || c.level === certLevelFilter;
      const matchStatus = certStatusFilter === 'ALL' || c.status === certStatusFilter;

      return matchSearch && matchLevel && matchStatus;
    });
  }, [certificatesList, certSearchTerm, certLevelFilter, certStatusFilter]);

  // Certificate Statistics
  const certificateStats = useMemo(() => {
    return {
      total: certificatesList.length,
      level1: certificatesList.filter(c => c.level === 'LEVEL_1').length,
      advanced: certificatesList.filter(c => c.level !== 'LEVEL_1').length,
      revoked: certificatesList.filter(c => c.status === 'REVOKED').length
    };
  }, [certificatesList]);

  // Squad Tasks Management State
  const [tasksList, setTasksList] = useState<SquadTask[]>(() => getAllSquadTasks());
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [taskSquadFilter, setTaskSquadFilter] = useState('ALL');
  const [taskBountyFilter, setTaskBountyFilter] = useState('ALL');
  const [taskFrequencyFilter, setTaskFrequencyFilter] = useState('ALL');
  const [taskStatusFilter, setTaskStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');
  const [taskFeedbackMsg, setTaskFeedbackMsg] = useState('');
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [copiedTaskBroadcastId, setCopiedTaskBroadcastId] = useState<string | null>(null);

  // New Task Form Fields
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSquad, setNewTaskSquad] = useState<SquadDivision>('GENERAL');
  const [newTaskCategory, setNewTaskCategory] = useState('Liking, Commenting & Viral Loop Sharing');
  const [newTaskFrequency, setNewTaskFrequency] = useState<TaskFrequency>('DAILY');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskRequirements, setNewTaskRequirements] = useState(
    '1. Like and leave an insightful comment on the linked post\n2. Share to your WhatsApp status or story\n3. Take a screenshot showing your engagement\n4. Submit proof via Refeir Pioneers submit portal'
  );
  const [newTaskBountyType, setNewTaskBountyType] = useState<BountyType>('AIRTIME');
  const [newTaskBountyReward, setNewTaskBountyReward] = useState('₦1,500 Airtime Voucher');
  const [newTaskBountyInstructions, setNewTaskBountyInstructions] = useState('First 10 verified submissions will receive instant mobile airtime recharge code on WhatsApp.');
  const [newTaskDeadline, setNewTaskDeadline] = useState('Today 11:59 PM WAT');
  const [newTaskMaxClaims, setNewTaskMaxClaims] = useState(10);

  // Global Escape Key Listener for Modals, Popups, and Dockers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (screenshotModalUrl) {
          setScreenshotModalUrl(null);
          return;
        }
        if (isCertificateModalOpen) {
          setIsCertificateModalOpen(false);
          return;
        }
        if (suspendModalMember) {
          setSuspendModalMember(null);
          return;
        }
        if (issueCertModalOpen) {
          setIssueCertModalOpen(false);
          return;
        }
        if (newTaskModalOpen) {
          setNewTaskModalOpen(false);
          return;
        }
        if (memberModalOpen) {
          setMemberModalOpen(false);
          return;
        }
        if (taskModalOpen) {
          setTaskModalOpen(false);
          return;
        }
        if (editStaffModalOpen) {
          setEditStaffModalOpen(false);
          return;
        }
        if (appointSquadLeadModalOpen) {
          setAppointSquadLeadModalOpen(false);
          return;
        }
        if (addWorkerModalOpen) {
          setAddWorkerModalOpen(false);
          return;
        }
        if (modalOpen) {
          setModalOpen(false);
          return;
        }
        if (adminProfileDockerOpen) {
          setAdminProfileDockerOpen(false);
          return;
        }
        if (adminMobileNavOpen) {
          setAdminMobileNavOpen(false);
          return;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    screenshotModalUrl,
    isCertificateModalOpen,
    suspendModalMember,
    issueCertModalOpen,
    newTaskModalOpen,
    memberModalOpen,
    taskModalOpen,
    editStaffModalOpen,
    appointSquadLeadModalOpen,
    addWorkerModalOpen,
    modalOpen,
    adminProfileDockerOpen,
    adminMobileNavOpen
  ]);

  // Comprehensive Analytics Calculations across all admin modules
  const analytics = useMemo(() => {
    // 1. Applications Funnel Analytics
    const totalApps = applications.length;
    const acceptedApps = applications.filter(a => a.status === 'ACCEPTED').length;
    const pendingApps = applications.filter(a => a.status === 'PENDING').length;
    const reviewingApps = applications.filter(a => a.status === 'REVIEWING').length;
    const waitlistedApps = applications.filter(a => a.status === 'WAITLISTED').length;
    const rejectedApps = applications.filter(a => a.status === 'REJECTED').length;
    const foundingApps = applications.filter(a => a.is_founding_100).length;
    const acceptanceRate = totalApps > 0 ? ((acceptedApps / totalApps) * 100).toFixed(1) : '0.0';
    const pendingRate = totalApps > 0 ? ((pendingApps / totalApps) * 100).toFixed(1) : '0.0';
    const foundingCapPct = Math.min(100, Math.round((foundingApps / 100) * 100));

    // Division breakdown of applications
    const appsByDivision: Record<string, number> = {};
    applications.forEach(a => {
      const div = a.primary_division || 'GENERAL';
      appsByDivision[div] = (appsByDivision[div] || 0) + 1;
    });

    // 2. Task Proofs Delivery Velocity
    const totalProofs = taskSubmissions.length;
    const verifiedProofs = taskSubmissions.filter(t => t.status === 'VERIFIED').length;
    const pendingProofs = taskSubmissions.filter(t => t.status === 'PENDING').length;
    const revisionProofs = taskSubmissions.filter(t => t.status === 'NEEDS_REVISION').length;
    const verificationRate = totalProofs > 0 ? ((verifiedProofs / totalProofs) * 100).toFixed(1) : '0.0';
    const revisionRate = totalProofs > 0 ? ((revisionProofs / totalProofs) * 100).toFixed(1) : '0.0';

    // Proofs by division
    const proofsByDivision: Record<string, number> = {};
    taskSubmissions.forEach(t => {
      const div = t.division || 'GENERAL';
      proofsByDivision[div] = (proofsByDivision[div] || 0) + 1;
    });

    // 3. Pioneer Members & Tiers
    const totalMembers = membersList.length;
    const activeMembers = membersList.filter(m => !m.is_suspended).length;
    const suspendedMembers = membersList.filter(m => m.is_suspended).length;
    const completedMembers = membersList.filter(m => m.is_profile_completed).length;
    const activeRate = totalMembers > 0 ? ((activeMembers / totalMembers) * 100).toFixed(1) : '0.0';
    const profileCompRate = totalMembers > 0 ? ((completedMembers / totalMembers) * 100).toFixed(1) : '0.0';

    const levelCounts: Record<string, number> = {
      LEVEL_1: 0,
      LEVEL_2: 0,
      LEVEL_3: 0,
      LEVEL_4: 0,
      LEVEL_5: 0
    };
    membersList.forEach(m => {
      if (levelCounts[m.contributor_level] !== undefined) {
        levelCounts[m.contributor_level]++;
      }
    });

    // 4. Certificates Minting
    const totalCerts = certificatesList.length;
    const activeCerts = certificatesList.filter(c => c.status === 'ISSUED').length;
    const revokedCerts = certificatesList.filter(c => c.status === 'REVOKED').length;
    const level1Certs = certificatesList.filter(c => c.level === 'LEVEL_1').length;
    const advancedCerts = totalCerts - level1Certs;
    const activeCertRate = totalCerts > 0 ? ((activeCerts / totalCerts) * 100).toFixed(1) : '0.0';

    // 5. Squad Tasks & Bounty Valuation
    const activeTasks = tasksList.filter(t => t.status === 'ACTIVE');
    let totalCashBountyVal = 0;
    let airtimeBounties = 0;
    let dataBounties = 0;
    activeTasks.forEach(t => {
      if (t.bounty_type === 'CASH') {
        const valMatch = (t.bounty_reward || '').match(/[0-9,]+/);
        if (valMatch) {
          totalCashBountyVal += parseInt(valMatch[0].replace(/,/g, ''), 10) || 0;
        } else {
          totalCashBountyVal += 10000;
        }
      } else if (t.bounty_type === 'AIRTIME') {
        airtimeBounties++;
      } else if (t.bounty_type === 'DATA') {
        dataBounties++;
      }
    });

    return {
      totalApps,
      acceptedApps,
      pendingApps,
      reviewingApps,
      waitlistedApps,
      rejectedApps,
      foundingApps,
      acceptanceRate,
      pendingRate,
      foundingCapPct,
      appsByDivision,
      totalProofs,
      verifiedProofs,
      pendingProofs,
      revisionProofs,
      verificationRate,
      revisionRate,
      proofsByDivision,
      totalMembers,
      activeMembers,
      suspendedMembers,
      completedMembers,
      activeRate,
      profileCompRate,
      levelCounts,
      totalCerts,
      activeCerts,
      revokedCerts,
      level1Certs,
      advancedCerts,
      activeCertRate,
      activeTasksCount: activeTasks.length,
      totalCashBountyVal,
      airtimeBounties,
      dataBounties
    };
  }, [applications, taskSubmissions, membersList, certificatesList, tasksList]);

  const formatDOB = (dob?: string) => {
    if (!dob) return null;
    try {
      const d = new Date(dob);
      if (!isNaN(d.getTime()) && (dob.includes('-') || dob.includes('/'))) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {}
    return dob;
  };

  const formatTaskDeadline = (deadline?: string) => {
    if (!deadline) return null;
    try {
      const d = new Date(deadline);
      if (!isNaN(d.getTime()) && (deadline.includes('T') || (deadline.includes('-') && deadline.length > 8))) {
        const now = new Date();
        const isSameYear = d.getFullYear() === now.getFullYear();
        const datePart = d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          ...(isSameYear ? {} : { year: 'numeric' })
        });
        const timePart = d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        return `${datePart} • ${timePart}`;
      }
    } catch {
      // fallback
    }
    return deadline;
  };

  const refreshTasks = () => {
    setTasksList(getAllSquadTasks());
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canAnnounceTasks) {
      alert('Unauthorized: You do not have permission to announce squad tasks.');
      return;
    }
    if (loggedInStaff?.role === 'SQUAD_LEAD' && loggedInStaff.assigned_division !== 'ALL') {
      if (newTaskSquad !== loggedInStaff.assigned_division && newTaskSquad !== 'GENERAL') {
        alert(`Unauthorized: As Squad Lead for ${loggedInStaff.assigned_division.replace('_', ' ')}, you can only announce tasks for your division or General missions.`);
        return;
      }
    }
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    const reqs = newTaskRequirements
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const created = createSquadTask({
      title: newTaskTitle.trim(),
      squad: newTaskSquad,
      category: newTaskCategory.trim() || 'General Mission',
      frequency: newTaskFrequency,
      description: newTaskDescription.trim(),
      requirements: reqs.length > 0 ? reqs : ['Complete task objectives and upload screenshot proof.'],
      submission_format: 'Screenshot Proof + Live URL',
      bounty_type: newTaskBountyType,
      bounty_reward: newTaskBountyReward.trim() || undefined,
      bounty_slots: `First ${newTaskMaxClaims} Verified Submissions`,
      bounty_instructions: newTaskBountyInstructions.trim() || undefined,
      deadline: newTaskDeadline.trim() || 'Today 11:59 PM WAT',
      status: 'ACTIVE',
      announced_by: loggedInStaff ? `${loggedInStaff.name} (${loggedInStaff.role.replace('_', ' ')})` : 'Refeir Squad Leadership'
    });

    setTasksList(getAllSquadTasks());
    setNewTaskModalOpen(false);
    setTaskFeedbackMsg(`Mission "${created.title}" successfully announced and broadcast-ready!`);
    setTimeout(() => setTaskFeedbackMsg(''), 5000);

    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleDeleteTask = (id: string, title: string) => {
    if (!permissions.canDeleteTasks) {
      alert('Unauthorized: Only Super Admin and authorized managers can delete squad missions.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete mission "${title}"?`)) return;
    deleteSquadTask(id);
    setTasksList(getAllSquadTasks());
    setTaskFeedbackMsg('Mission deleted.');
    setTimeout(() => setTaskFeedbackMsg(''), 3000);
  };

  const handleToggleTaskStatus = (id: string) => {
    if (!permissions.canAnnounceTasks) {
      alert('Unauthorized: You do not have permission to toggle squad task status.');
      return;
    }
    toggleTaskStatus(id);
    setTasksList(getAllSquadTasks());
  };

  const handleCopyBroadcast = (task: SquadTask) => {
    const text = generateWhatsAppBroadcast(task);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTaskBroadcastId(task.id);
      setTimeout(() => setCopiedTaskBroadcastId(null), 3000);
    });
  };




  const filteredSquadTasks = useMemo(() => {
    return tasksList.filter(t => {
      const q = taskSearchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.bounty_reward && t.bounty_reward.toLowerCase().includes(q));

      const matchSquad = taskSquadFilter === 'ALL' || t.squad === taskSquadFilter;
      const matchBounty = taskBountyFilter === 'ALL' || t.bounty_type === taskBountyFilter;
      const matchFreq = taskFrequencyFilter === 'ALL' || t.frequency === taskFrequencyFilter;
      const matchStatus = taskStatusFilter === 'ALL' || t.status === taskStatusFilter;

      return matchSearch && matchSquad && matchBounty && matchFreq && matchStatus;
    });
  }, [tasksList, taskSearchTerm, taskSquadFilter, taskBountyFilter, taskFrequencyFilter, taskStatusFilter]);

  const squadTaskStats = useMemo(() => {
    const activeTasks = tasksList.filter(t => t.status === 'ACTIVE');
    return {
      total: tasksList.length,
      active: activeTasks.length,
      bounties: activeTasks.filter(t => t.bounty_type !== 'NONE').length,
      airtime: activeTasks.filter(t => t.bounty_type === 'AIRTIME').length,
      data: activeTasks.filter(t => t.bounty_type === 'DATA').length,
      cash: activeTasks.filter(t => t.bounty_type === 'CASH').length,
      daily: activeTasks.filter(t => t.frequency === 'DAILY').length
    };
  }, [tasksList]);

  // ─── NOTIFICATION CENTER STATE & ACTIVITY FEED ──────────────────────────────
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('refeir_admin_read_notifs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [notifFilter, setNotifFilter] = useState<'all' | 'action'>('all');
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close notifications popover on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isMobile && notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotificationOpen(false);
    };
    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notificationOpen, isMobile]);

  // Prevent body scroll jitter/shaking on mobile when full-screen drawer or notification/profile docker is open
  useEffect(() => {
    if ((adminMobileNavOpen && isMobile) || (notificationOpen && isMobile) || (adminProfileDockerOpen && isMobile)) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      const origTouchAction = document.body.style.touchAction;
      const origBodyOverscroll = document.body.style.overscrollBehavior;
      const origHtmlOverscroll = document.documentElement.style.overscrollBehavior;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        document.body.style.touchAction = origTouchAction;
        document.body.style.overscrollBehavior = origBodyOverscroll;
        document.documentElement.style.overscrollBehavior = origHtmlOverscroll;
      };
    }
  }, [adminMobileNavOpen, notificationOpen, adminProfileDockerOpen, isMobile]);

  const notificationsList = useMemo(() => {
    const list: Array<{
      id: string;
      type: 'action' | 'info' | 'success' | 'alert';
      title: string;
      desc: string;
      time: string;
      targetTab: 'applications' | 'proofs' | 'members' | 'workers' | 'certificates' | 'tasks';
      unread?: boolean;
    }> = [];

    // Pending applications needing evaluation
    if (stats.pending > 0) {
      list.push({
        id: `apps-pending-${stats.pending}`,
        type: 'action',
        title: `${stats.pending} Application${stats.pending > 1 ? 's' : ''} Pending Evaluation`,
        desc: `${stats.pending} candidate submission${stats.pending > 1 ? 's' : ''} awaiting admissions review.`,
        time: 'Action Required',
        targetTab: 'applications'
      });
    }

    // Pending task proofs
    if (taskStats.pending > 0) {
      list.push({
        id: `proofs-pending-${taskStats.pending}`,
        type: 'action',
        title: `${taskStats.pending} Task Proof${taskStats.pending > 1 ? 's' : ''} Awaiting Approval`,
        desc: 'Pioneers have submitted work proofs ready for verification & bounty rewards.',
        time: 'Needs Review',
        targetTab: 'proofs'
      });
    }

    // Founding 100 Seats progress
    list.push({
      id: 'founding-100-milestone',
      type: 'info',
      title: `Founding 100 Cohort: ${stats.founding}/100 Confirmed`,
      desc: `${Math.max(0, 100 - stats.founding)} Founding Pioneer seats remaining across all 6 squads.`,
      time: 'Milestone',
      targetTab: 'applications'
    });

    // Active squad missions & bounties
    if (squadTaskStats.active > 0) {
      list.push({
        id: `active-missions-${squadTaskStats.active}`,
        type: 'info',
        title: `${squadTaskStats.active} Live Squad Missions Active`,
        desc: `${squadTaskStats.bounties} missions with active cash, airtime, or data bounties.`,
        time: 'Live',
        targetTab: 'tasks'
      });
    }

    // Pioneer Certifications
    if (certificatesList.length > 0) {
      list.push({
        id: `certs-count-${certificatesList.length}`,
        type: 'success',
        title: `${certificatesList.length} Accreditations Issued`,
        desc: 'Verified level credentials active in the Pioneer certificate registry.',
        time: 'Credentials',
        targetTab: 'certificates'
      });
    }

    return list.map(item => ({
      ...item,
      unread: !readNotificationIds.includes(item.id)
    }));
  }, [stats.pending, stats.founding, taskStats.pending, squadTaskStats.active, squadTaskStats.bounties, certificatesList.length, readNotificationIds]);

  const unreadNotifCount = useMemo(() => {
    return notificationsList.filter(n => n.unread).length;
  }, [notificationsList]);

  const handleMarkAllNotificationsRead = () => {
    const allIds = notificationsList.map(n => n.id);
    setReadNotificationIds(allIds);
    try {
      localStorage.setItem('refeir_admin_read_notifs', JSON.stringify(allIds));
    } catch {}
  };

  const handleNotificationClick = (item: typeof notificationsList[0]) => {
    if (!readNotificationIds.includes(item.id)) {
      const updated = [...readNotificationIds, item.id];
      setReadNotificationIds(updated);
      try {
        localStorage.setItem('refeir_admin_read_notifs', JSON.stringify(updated));
      } catch {}
    }
    setAdminTab(item.targetTab);
    setNotificationOpen(false);
  };

  // Open Detailed Review Modal
  const openReviewModal = (app: ApplicationRecord) => {
    setActiveApp(app);
    setEditStatus(app.status);
    setEditContributorLevel(app.contributor_level || 'LEVEL_1');
    setEditIsFounding(app.is_founding_100);
    setEditPioneerId(app.pioneer_id || '');
    setEditNotes(app.internal_notes || '');
    setEditAcceptanceCode(app.acceptance_code || null);
    setSaveSuccessMsg('');
    setModalOpen(true);
  };

  // Save Application Changes
  const handleSaveChanges = async () => {
    if (!activeApp) return;
    if (!permissions.canReviewApplications) {
      alert('Unauthorized: You do not have permission to review or evaluate applications.');
      return;
    }
    if (!permissions.canModifyMemberTier && editContributorLevel !== (activeApp.contributor_level || 'LEVEL_1')) {
      alert('Unauthorized: Only Super Admin has authority to manually modify or assign contributor levels.');
      return;
    }
    setSavingChanges(true);
    setSaveSuccessMsg('');

    let finalAcceptanceCode = editAcceptanceCode || activeApp.acceptance_code;
    if (editStatus === 'ACCEPTED' && !finalAcceptanceCode) {
      finalAcceptanceCode = generateAcceptanceCode(activeApp.application_number);
      setEditAcceptanceCode(finalAcceptanceCode);
    }

    let finalPioneerId = editPioneerId.trim() || activeApp.pioneer_id || '';
    if (editStatus === 'ACCEPTED' && !finalPioneerId) {
      const existingSeats = applications.map(a => a.pioneer_id).filter(Boolean) as string[];
      const numbers = existingSeats.map(s => {
        const match = s.match(/RP-(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
      });
      const maxNum = numbers.length > 0 ? Math.max(...numbers, 45) : 45;
      finalPioneerId = `RP-${String(maxNum + 1).padStart(3, '0')}`;
      setEditPioneerId(finalPioneerId);
    }

    const updatedFields: Partial<ApplicationRecord> = {
      status: editStatus,
      contributor_level: editContributorLevel,
      is_founding_100: editIsFounding,
      pioneer_id: finalPioneerId || null,
      acceptance_code: finalAcceptanceCode || null,
      internal_notes: editNotes.trim() || null
    };

    try {
      // Update in persistent applications storage (and Firestore if configured)
      updateStoredApplication(activeApp.id, updatedFields);

      // Update local state
      setApplications(prev => prev.map(a => {
        if (a.id === activeApp.id) {
          return { ...a, ...updatedFields };
        }
        return a;
      }));

      setActiveApp(prev => prev ? { ...prev, ...updatedFields } : null);
      setSaveSuccessMsg('Status & Acceptance Code updated successfully!');
    } catch (err) {
      console.error(err);
      setSaveSuccessMsg('Saved locally.');
    } finally {
      setSavingChanges(false);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    }
  };

  // Auto-generate next Pioneer ID
  const generateNextPioneerId = () => {
    const nextNum = stats.founding + 1;
    const formatted = `RP-${String(nextNum).padStart(3, '0')}`;
    setEditPioneerId(formatted);
    setEditIsFounding(true);
    setEditStatus('ACCEPTED');
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredApps.length === 0) return;
    const headers = [
      'Application Number', 'Full Name', 'Email', 'WhatsApp Number', 'Country', 'City',
      'Division', 'Roles', 'Status', 'Founding 100', 'Pioneer ID', 'Date Applied'
    ];

    const rows = filteredApps.map(a => [
      a.application_number,
      `"${a.full_name}"`,
      a.email,
      `"${a.whatsapp_number}"`,
      a.country,
      `"${a.city || ''}"`,
      a.primary_division || '',
      `"${(a.roles || []).join(', ')}"`,
      a.status,
      a.is_founding_100 ? 'YES' : 'NO',
      a.pioneer_id || '',
      new Date(a.created_at).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `refeir_pioneer_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Component
  const renderStatusBadge = (status: ReviewStatus) => {
    const baseStyle = {
      padding: isMobile ? '2.5px 7px' : '4px 10px',
      borderRadius: 100,
      fontSize: isMobile ? 10 : 11.5,
      fontWeight: 700,
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap' as const,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    };
    switch (status) {
      case 'ACCEPTED':
        return (
          <span style={{
            ...baseStyle,
            background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT, border: `1px solid ${RF_LEAF_GREEN}55`,
          }}>
            <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: RF_MINT_ACCENT, flexShrink: 0 }} />
            ACCEPTED
          </span>
        );
      case 'REVIEWING':
        return (
          <span style={{
            ...baseStyle,
            background: 'rgba(246, 178, 26, 0.12)', color: RF_GOLD_YELLOW, border: `1px solid ${RF_GOLD_YELLOW}55`,
          }}>
            <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: RF_GOLD_YELLOW, flexShrink: 0 }} />
            REVIEWING
          </span>
        );
      case 'WAITLISTED':
        return (
          <span style={{
            ...baseStyle,
            background: 'rgba(244, 124, 32, 0.12)', color: '#FFB27D', border: `1px solid rgba(244, 124, 32, 0.5)`,
          }}>
            <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: '#FFB27D', flexShrink: 0 }} />
            WAITLISTED
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{
            ...baseStyle,
            background: 'rgba(239, 68, 68, 0.12)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.4)',
          }}>
            <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
            REJECTED
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span style={{
            ...baseStyle,
            background: 'rgba(255, 255, 255, 0.08)', color: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)',
            fontWeight: 600,
          }}>
            <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.5)', flexShrink: 0 }} />
            PENDING
          </span>
        );
    }
  };

  const renderTaskStatusBadge = (status: string) => {
    const baseStyle = {
      padding: isMobile ? '2.5px 7px' : '4px 10px',
      borderRadius: 100,
      fontSize: isMobile ? 10 : 11.5,
      fontWeight: 700,
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap' as const,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    };
    switch (status) {
      case 'VERIFIED':
        return (
          <span style={{
            ...baseStyle,
            background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT, border: `1px solid ${RF_LEAF_GREEN}66`,
          }}>
            <Check size={isMobile ? 10 : 12} style={{ flexShrink: 0 }} /> VERIFIED
          </span>
        );
      case 'NEEDS_REVISION':
        return (
          <span style={{
            ...baseStyle,
            background: 'rgba(244, 124, 32, 0.12)', color: '#FFB27D', border: `1px solid rgba(244, 124, 32, 0.5)`,
          }}>
            <AlertTriangle size={isMobile ? 10 : 12} style={{ flexShrink: 0 }} /> NEEDS REVISION
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{
            ...baseStyle,
            background: 'rgba(239, 68, 68, 0.12)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.4)',
          }}>
            <XCircle size={isMobile ? 10 : 12} style={{ flexShrink: 0 }} /> REJECTED
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span style={{
            ...baseStyle,
            background: 'rgba(246, 178, 26, 0.12)', color: RF_GOLD_YELLOW, border: '1px solid rgba(246, 178, 26, 0.45)',
          }}>
            <Clock size={isMobile ? 10 : 12} style={{ flexShrink: 0 }} /> PENDING PROOF
          </span>
        );
    }
  };

  const renderStaffRoleBadge = (role: StaffRole) => {
    const badgeStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: isMobile ? '2.5px 8px' : '3px 9px',
      borderRadius: 100,
      fontSize: isMobile ? 10 : 11,
      fontWeight: 700,
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap' as const,
      flexShrink: 0
    };
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span style={{
            ...badgeStyle,
            background: `${RF_GOLD_YELLOW}15`, color: RF_GOLD_YELLOW, border: `1px solid ${RF_GOLD_YELLOW}55`,
          }}>
            <Shield size={isMobile ? 10 : 11} style={{ flexShrink: 0 }} /> SUPER ADMIN
          </span>
        );
      case 'MANAGER':
        return (
          <span style={{
            ...badgeStyle,
            background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.45)',
          }}>
            <Briefcase size={isMobile ? 10 : 11} style={{ flexShrink: 0 }} /> MANAGER
          </span>
        );
      case 'SQUAD_LEAD':
        return (
          <span style={{
            ...badgeStyle,
            background: `${RF_ORANGE}15`, color: '#FFB27D', border: `1px solid ${RF_ORANGE}55`,
          }}>
            <Star size={isMobile ? 10 : 11} style={{ flexShrink: 0 }} /> SQUAD LEAD
          </span>
        );
      case 'TASK_VIEWER':
      case 'TASK_VERIFIER':
        return (
          <span style={{
            ...badgeStyle,
            background: `${RF_LEAF_GREEN}15`, color: RF_LEAF_GREEN, border: `1px solid ${RF_LEAF_GREEN}55`,
          }}>
            <Eye size={isMobile ? 10 : 11} style={{ flexShrink: 0 }} /> TASK VIEWER
          </span>
        );
      case 'ADMISSIONS_REVIEWER':
      default:
        return (
          <span style={{
            ...badgeStyle,
            background: `${RF_MINT_ACCENT}15`, color: RF_MINT_ACCENT, border: `1px solid ${RF_MINT_ACCENT}55`,
          }}>
            <UserCheck size={isMobile ? 10 : 11} style={{ flexShrink: 0 }} /> ADMISSIONS REVIEWER
          </span>
        );
    }
  };

  // ─── LOGIN SCREEN ────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: isMobile ? '24px 16px' : 32, color: '#FFFFFF'
      }}>
        <div style={{
          maxWidth: 440, width: '100%', background: 'rgba(15, 42, 26, 0.88)',
          borderRadius: isMobile ? 20 : 24, padding: isMobile ? '32px 20px' : '40px 32px',
          border: '1px solid rgba(102, 187, 42, 0.3)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65)', textAlign: 'center', backdropFilter: 'blur(20px)'
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: `${RF_LEAF_GREEN}20`,
            border: `1px solid ${RF_LEAF_GREEN}44`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px', color: RF_MINT_ACCENT
          }}>
            <Lock size={24} />
          </div>

          <h2 style={{
            fontSize: 24, fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif',
            marginBottom: 6, color: '#FFFFFF', letterSpacing: '-0.02em'
          }}>
            Refeir Admissions Suite
          </h2>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24 }}>
            Staff-only access portal. Sign in with your assigned credentials.
          </p>

          {/* Login Mode Toggle */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 100,
            padding: 3, marginBottom: 22, border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {(['email', 'passcode'] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => { setLoginMode(mode); setAuthError(''); }}
                style={{
                  flex: 1, padding: '7px 0', borderRadius: 100, border: 'none', fontSize: 12.5,
                  fontWeight: loginMode === mode ? 700 : 500,
                  background: loginMode === mode ? RF_LEAF_GREEN : 'transparent',
                  color: loginMode === mode ? RF_DEEP_GREEN : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {mode === 'email' ? '✉ Email & Password' : '🔑 Passcode'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loginMode === 'email' ? (
              <>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(102, 187, 42, 0.25)',
                    color: '#FFFFFF', fontSize: 14, outline: 'none'
                  }}
                />
                <div style={{ position: 'relative' }}>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 44px 12px 16px', borderRadius: 12, boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(102, 187, 42, 0.25)',
                      color: '#FFFFFF', fontSize: 14, outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(p => !p)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center'
                    }}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </>
            ) : (
              <input
                type="password"
                placeholder="Enter admissions passcode..."
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                autoFocus
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(102, 187, 42, 0.25)',
                  color: '#FFFFFF', fontSize: 14, outline: 'none', textAlign: 'center'
                }}
              />
            )}

            {authError && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', fontSize: 12.5, textAlign: 'left'
              }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              style={{
                background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                padding: '13px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 4px 16px ${RF_LEAF_GREEN}44`,
                marginTop: 4
              }}
            >
              {loginMode === 'email' ? 'Sign In to Portal' : 'Access Admissions Portal'}
            </button>
          </form>

          {loginMode === 'passcode' && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 8px' }}>
                Quick fill (demo):
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: 'Tonye (Super Admin)', code: 'refeir2026', accent: true },
                  { label: 'Nkechi (Manager)', code: 'manager2026', accent: false },
                  { label: 'Chidi (Squad Lead)', code: 'techlead26', accent: false },
                  { label: 'Zainab (Task Viewer)', code: 'viewer2026', accent: false },
                  { label: 'Sarah (Admissions)', code: 'admit2026', accent: false },
                ].map(({ label, code, accent }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setPasscode(code)}
                    style={{
                      background: accent ? 'rgba(24, 252, 92, 0.08)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${accent ? 'rgba(24, 252, 92, 0.25)' : 'rgba(255,255,255,0.15)'}`,
                      color: accent ? RF_MINT_ACCENT : 'rgba(255,255,255,0.8)',
                      padding: '3px 10px', borderRadius: 100, fontSize: 11, cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loginMode === 'email' && (
            <p style={{ marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              Don't have login credentials? Contact the Super Admin to be added to the staff registry.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED ADMIN SUITE ───────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: '#07180F',
      color: '#FFFFFF',
      paddingTop: 0,
      fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}>
      {/* Modern Minimalist Top Admin Navigation Bar */}
      <header style={{
        background: 'rgba(8, 26, 17, 0.94)',
        borderBottom: '1px solid rgba(102, 187, 42, 0.16)',
        padding: isMobile ? '10px 14px' : '12px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          gap: isMobile ? 8 : 14
        }}>
          {/* Brand & Suite Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10, minWidth: 0, flexShrink: 1 }}>
            {/* Mobile Admin Navigation Hamburger Toggle */}
            {isMobile && (
              <button
                onClick={() => {
                  setAdminMobileNavOpen(prev => !prev);
                  setAdminProfileDockerOpen(false);
                }}
                aria-label="Toggle Admin Navigation Menu"
                style={{
                  background: adminMobileNavOpen ? 'rgba(24, 252, 92, 0.16)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${adminMobileNavOpen ? RF_MINT_ACCENT : 'rgba(255, 255, 255, 0.12)'}`,
                  color: adminMobileNavOpen ? RF_MINT_ACCENT : '#FFFFFF',
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                {adminMobileNavOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            )}

            <div style={{
              background: 'rgba(24, 252, 92, 0.12)',
              border: '1px solid rgba(24, 252, 92, 0.28)',
              width: isMobile ? 28 : 34,
              height: isMobile ? 28 : 34,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: RF_MINT_ACCENT,
              flexShrink: 0
            }}>
              <Shield size={isMobile ? 15 : 17} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                fontSize: isMobile ? 15 : 19,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {isMobile ? 'Refeir Admissions' : 'Refeir Admissions Suite'}
              </h1>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: isMobile ? 'none' : 'block', marginTop: 2 }}>
                Live admissions, verification &amp; pioneer governance console
              </span>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 8, position: 'relative', flexShrink: 0 }} ref={notifDropdownRef}>
            {/* Notification Center Trigger */}
            <button
              onClick={() => {
                setNotificationOpen(prev => !prev);
                setAdminMobileNavOpen(false);
                setAdminProfileDockerOpen(false);
              }}
              title="Notification Center"
              style={{
                background: notificationOpen ? 'rgba(24, 252, 92, 0.18)' : 'rgba(255,255,255,0.05)',
                border: notificationOpen ? `1px solid ${RF_MINT_ACCENT}55` : '1px solid rgba(255,255,255,0.12)',
                color: notificationOpen ? RF_MINT_ACCENT : '#FFFFFF',
                height: 34,
                width: 34,
                borderRadius: 9,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              <Bell size={15} />
              {unreadNotifCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  background: RF_MINT_ACCENT,
                  color: RF_DEEP_GREEN,
                  fontSize: 9.5,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 0 8px rgba(24, 252, 92, 0.6)'
                }}>
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Mobile Staff Avatar Button (Tapping opens dedicated Staff Profile Docker) */}
            {isMobile && loggedInStaff && (
              <button
                onClick={() => {
                  setAdminProfileDockerOpen(prev => !prev);
                  setAdminMobileNavOpen(false);
                  setNotificationOpen(false);
                }}
                title={`Staff Profile: ${loggedInStaff.name} (${loggedInStaff.role})`}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: adminProfileDockerOpen ? 'rgba(24, 252, 92, 0.22)' : 'rgba(24, 252, 92, 0.12)',
                  border: `1.5px solid ${adminProfileDockerOpen ? RF_MINT_ACCENT : 'rgba(24, 252, 92, 0.35)'}`,
                  color: RF_MINT_ACCENT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                  padding: 0
                }}
              >
                {loggedInStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                <span style={{
                  position: 'absolute',
                  bottom: -1,
                  right: -1,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: RF_MINT_ACCENT,
                  border: '1.5px solid #07180F'
                }} />
              </button>
            )}

            {/* Desktop Staff Profile Badge */}
            {!isMobile && loggedInStaff && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '3px 8px',
                borderRadius: 8,
                height: 32
              }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'rgba(24, 252, 92, 0.15)',
                  color: RF_MINT_ACCENT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {loggedInStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                  {loggedInStaff.name}
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: RF_MINT_ACCENT,
                  background: 'rgba(24, 252, 92, 0.1)',
                  border: '1px solid rgba(24, 252, 92, 0.2)',
                  padding: '1px 5px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {loggedInStaff.role.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Desktop Return to Website Button */}
            {!isMobile && (
              <button
                onClick={() => onNavigate('/')}
                title="Return to Main Website"
                style={{
                  background: 'rgba(24, 252, 92, 0.08)',
                  border: '1px solid rgba(24, 252, 92, 0.22)',
                  color: RF_MINT_ACCENT,
                  height: 32,
                  padding: '0 13px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(24, 252, 92, 0.16)';
                  e.currentTarget.style.borderColor = RF_MINT_ACCENT;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(24, 252, 92, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(24, 252, 92, 0.22)';
                }}
              >
                <ArrowLeft size={13} />
                <span>Return to Website</span>
              </button>
            )}

            {/* Desktop Exit / Sign Out */}
            {!isMobile && (
              <button
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.22)',
                  color: '#FCA5A5',
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.15s ease'
                }}
              >
                <LogOut size={12} />
                <span>Exit</span>
              </button>
            )}

            {/* Notification Center Popover (Desktop only) */}
            {notificationOpen && !isMobile && (
              /* Desktop Popover Dropdown */
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: 420,
                maxWidth: 'calc(100vw - 32px)',
                background: 'rgba(7, 22, 14, 0.96)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(24, 252, 92, 0.08)',
                backdropFilter: 'blur(30px) saturate(160%)',
                WebkitBackdropFilter: 'blur(30px) saturate(160%)',
                zIndex: 1000,
                overflow: 'hidden',
                animation: 'rp-fade-slide 0.2s ease-out'
              }}>
                {/* Header */}
                <div style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bell size={15} color={RF_MINT_ACCENT} />
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                      Notifications
                    </span>
                    {unreadNotifCount > 0 && (
                      <span style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '1px 8px',
                        borderRadius: 100,
                        background: 'rgba(24, 252, 92, 0.12)',
                        color: RF_MINT_ACCENT,
                        border: '1px solid rgba(24, 252, 92, 0.25)'
                      }}>
                        {unreadNotifCount} new
                      </span>
                    )}
                  </div>

                  {unreadNotifCount > 0 && (
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: RF_MINT_ACCENT,
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '4px 10px',
                        borderRadius: 100,
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(24, 252, 92, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(24, 252, 92, 0.3)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <CheckCheck size={13} />
                      Mark read
                    </button>
                  )}
                </div>

                {/* Modern Segmented Filter Tabs */}
                <div style={{
                  display: 'flex',
                  gap: 6,
                  padding: '8px 14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}>
                  <button
                    onClick={() => setNotifFilter('all')}
                    style={{
                      background: notifFilter === 'all' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      border: notifFilter === 'all' ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid transparent',
                      color: notifFilter === 'all' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    All ({notificationsList.length})
                  </button>
                  <button
                    onClick={() => setNotifFilter('action')}
                    style={{
                      background: notifFilter === 'action' ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
                      border: notifFilter === 'action' ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid transparent',
                      color: notifFilter === 'action' ? RF_GOLD_YELLOW : 'rgba(255, 255, 255, 0.5)',
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Action Needed ({notificationsList.filter(n => n.type === 'action').length})
                  </button>
                </div>

                {/* Notifications List */}
                <div className="rp-sleek-scroll" style={{ maxHeight: 360, overflowY: 'auto', padding: '8px 10px' }}>
                  {notificationsList
                    .filter(n => notifFilter === 'all' || n.type === 'action')
                    .map(n => {
                      const isUnread = n.unread;
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          style={{
                            padding: '11px 13px',
                            borderRadius: 12,
                            background: isUnread ? 'rgba(24, 252, 92, 0.03)' : 'transparent',
                            border: isUnread ? '1px solid rgba(24, 252, 92, 0.14)' : '1px solid transparent',
                            marginBottom: 4,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            gap: 12,
                            alignItems: 'flex-start'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = isUnread ? 'rgba(24, 252, 92, 0.03)' : 'transparent'}
                        >
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 1,
                            background:
                              n.type === 'action' ? 'rgba(251, 191, 36, 0.12)' :
                              n.type === 'success' ? 'rgba(24, 252, 92, 0.12)' :
                              n.type === 'alert' ? 'rgba(239, 68, 68, 0.12)' :
                              'rgba(56, 189, 248, 0.12)',
                            color:
                              n.type === 'action' ? RF_GOLD_YELLOW :
                              n.type === 'success' ? RF_MINT_ACCENT :
                              n.type === 'alert' ? '#FCA5A5' :
                              '#38BDF8'
                          }}>
                            {n.type === 'action' ? <AlertCircle size={15} /> :
                             n.type === 'success' ? <CheckCircle2 size={15} /> :
                             n.type === 'alert' ? <AlertTriangle size={15} /> :
                             <Shield size={15} />}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                              <span style={{
                                fontSize: 9.5,
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: 4,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                background:
                                  n.type === 'action' ? 'rgba(251, 191, 36, 0.14)' :
                                  n.type === 'success' ? 'rgba(24, 252, 92, 0.12)' :
                                  n.type === 'alert' ? 'rgba(239, 68, 68, 0.12)' :
                                  'rgba(56, 189, 248, 0.12)',
                                color:
                                  n.type === 'action' ? RF_GOLD_YELLOW :
                                  n.type === 'success' ? RF_MINT_ACCENT :
                                  n.type === 'alert' ? '#FCA5A5' :
                                  '#38BDF8'
                              }}>
                                {n.time}
                              </span>
                              {isUnread && (
                                <span style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  background: RF_MINT_ACCENT,
                                  boxShadow: '0 0 6px rgba(24, 252, 92, 0.8)'
                                }} />
                              )}
                            </div>
                            <h4 style={{
                              fontSize: 12.5,
                              fontWeight: isUnread ? 700 : 600,
                              color: '#FFFFFF',
                              margin: '2px 0 0',
                              lineHeight: 1.35,
                              whiteSpace: 'normal',
                              wordBreak: 'break-word'
                            }}>
                              {n.title}
                            </h4>
                            <p style={{
                              fontSize: 11.5,
                              color: 'rgba(255, 255, 255, 0.62)',
                              margin: '3px 0 0',
                              lineHeight: 1.4
                            }}>
                              {n.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Footer */}
                <div style={{
                  padding: '10px 16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 0, 0, 0.22)'
                }}>
                  <span style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.45)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: RF_MINT_ACCENT, boxShadow: '0 0 6px rgba(24,252,92,0.6)' }} />
                    Live Activity Feed
                  </span>
                  <span style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.45)' }}>
                    Refeir Admissions Suite
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── FULL-VIEWPORT MOBILE NOTIFICATIONS DOCKER ─── */}
      {notificationOpen && isMobile && (
        <div
          onClick={() => setNotificationOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            minHeight: '100dvh',
            maxHeight: '100dvh',
            zIndex: 999999,
            background: 'rgba(4, 15, 9, 0.98)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            overscrollBehavior: 'none',
            touchAction: 'none'
          }}
        >
          {/* Top Docker Header Bar */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              padding: '16px 18px 14px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(8, 25, 16, 0.95)',
              flexShrink: 0,
              touchAction: 'none'
            }}
          >
            {/* Left: Icon + Title + Status Subtitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{
                background: 'rgba(24, 252, 92, 0.12)',
                border: '1px solid rgba(24, 252, 92, 0.28)',
                width: 36,
                height: 36,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: RF_MINT_ACCENT,
                flexShrink: 0
              }}>
                <Bell size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h2 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  Notifications
                </h2>
                <div style={{
                  fontSize: 11.5,
                  color: unreadNotifCount > 0 ? RF_MINT_ACCENT : 'rgba(255, 255, 255, 0.5)',
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}>
                  {unreadNotifCount > 0 && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: RF_MINT_ACCENT }} />
                  )}
                  <span>
                    {unreadNotifCount > 0 ? `${unreadNotifCount} unread alert${unreadNotifCount > 1 ? 's' : ''}` : 'All caught up'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Exactly 2 balanced controls - "Mark read" (if unread) + Close Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {unreadNotifCount > 0 && (
                <button
                  onClick={handleMarkAllNotificationsRead}
                  style={{
                    background: 'rgba(24, 252, 92, 0.1)',
                    border: '1px solid rgba(24, 252, 92, 0.25)',
                    color: RF_MINT_ACCENT,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 12px',
                    borderRadius: 100,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <CheckCheck size={13} />
                  <span>Mark read</span>
                </button>
              )}
              <button
                onClick={() => setNotificationOpen(false)}
                aria-label="Close notification center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Filter Chips Bar */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              gap: 8,
              padding: '12px 18px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(0, 0, 0, 0.2)',
              flexShrink: 0,
              touchAction: 'none'
            }}
          >
            <button
              onClick={() => setNotifFilter('all')}
              style={{
                background: notifFilter === 'all' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: notifFilter === 'all' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(255, 255, 255, 0.07)',
                color: notifFilter === 'all' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                padding: '6px 14px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              All ({notificationsList.length})
            </button>
            <button
              onClick={() => setNotifFilter('action')}
              style={{
                background: notifFilter === 'action' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: notifFilter === 'action' ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255, 255, 255, 0.07)',
                color: notifFilter === 'action' ? RF_GOLD_YELLOW : 'rgba(255, 255, 255, 0.6)',
                padding: '6px 14px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Action Needed ({notificationsList.filter(n => n.type === 'action').length})
            </button>
          </div>

          {/* Scrollable Notifications List */}
          <div
            onClick={e => e.stopPropagation()}
            className="rp-sleek-scroll"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y',
              padding: '16px 18px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            {notificationsList
              .filter(n => notifFilter === 'all' || n.type === 'action')
              .map(n => {
                const isUnread = n.unread;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    style={{
                      padding: '15px 16px',
                      borderRadius: 16,
                      background: isUnread ? 'rgba(24, 252, 92, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                      border: isUnread ? '1px solid rgba(24, 252, 92, 0.18)' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 13,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background:
                        n.type === 'action' ? 'rgba(251, 191, 36, 0.12)' :
                        n.type === 'alert' ? 'rgba(239, 68, 68, 0.12)' :
                        n.type === 'success' ? 'rgba(24, 252, 92, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                      border: `1px solid ${
                        n.type === 'action' ? 'rgba(251, 191, 36, 0.25)' :
                        n.type === 'alert' ? 'rgba(239, 68, 68, 0.25)' :
                        n.type === 'success' ? 'rgba(24, 252, 92, 0.25)' : 'rgba(56, 189, 248, 0.25)'
                      }`,
                      color:
                        n.type === 'action' ? RF_GOLD_YELLOW :
                        n.type === 'alert' ? '#FCA5A5' :
                        n.type === 'success' ? RF_MINT_ACCENT : '#38BDF8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1
                    }}>
                      {n.type === 'action' && <AlertCircle size={17} />}
                      {n.type === 'alert' && <AlertTriangle size={17} />}
                      {n.type === 'success' && <CheckCircle2 size={17} />}
                      {n.type === 'info' && <Shield size={17} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          background:
                            n.type === 'action' ? 'rgba(251, 191, 36, 0.14)' :
                            n.type === 'alert' ? 'rgba(239, 68, 68, 0.14)' :
                            n.type === 'success' ? 'rgba(24, 252, 92, 0.12)' :
                            'rgba(56, 189, 248, 0.12)',
                          color:
                            n.type === 'action' ? RF_GOLD_YELLOW :
                            n.type === 'alert' ? '#FCA5A5' :
                            n.type === 'success' ? RF_MINT_ACCENT :
                            '#38BDF8'
                        }}>
                          {n.time}
                        </span>
                        {isUnread && (
                          <span style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: RF_MINT_ACCENT,
                            boxShadow: '0 0 8px rgba(24, 252, 92, 0.8)'
                          }} />
                        )}
                      </div>

                      <h4 style={{
                        fontSize: 14,
                        fontWeight: isUnread ? 700 : 600,
                        color: isUnread ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        lineHeight: 1.35
                      }}>
                        {n.title}
                      </h4>

                      <p style={{
                        fontSize: 12.5,
                        color: 'rgba(255, 255, 255, 0.65)',
                        margin: '4px 0 0',
                        lineHeight: 1.45
                      }}>
                        {n.desc}
                      </p>

                      <div style={{
                        fontSize: 11,
                        color: RF_MINT_ACCENT,
                        marginTop: 7,
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        opacity: 0.85
                      }}>
                        Tap to open section →
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Docker Footer */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              padding: '14px 18px calc(14px + env(safe-area-inset-bottom, 16px))',
              borderTop: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(4, 16, 10, 0.98)',
              flexShrink: 0,
              touchAction: 'none'
            }}
          >
            <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.45)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: RF_MINT_ACCENT, boxShadow: '0 0 6px rgba(24,252,92,0.6)' }} />
              Live Activity Feed
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.45)' }}>
              Refeir Admissions Suite
            </span>
          </div>
        </div>
      )}

      {/* Full-Viewport Mobile Admin Navigation Drawer */}
      {adminMobileNavOpen && isMobile && (
        <div
          onClick={() => setAdminMobileNavOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            minHeight: '100dvh',
            maxHeight: '100dvh',
            zIndex: 99999,
            background: 'rgba(3, 12, 7, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            overscrollBehavior: 'none',
            touchAction: 'none'
          }}
        >
          {/* Drawer Top Navigation Bar */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 46, 30, 0.95)',
              flexShrink: 0,
              touchAction: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: 'rgba(24, 252, 92, 0.15)',
                border: '1px solid rgba(24, 252, 92, 0.35)',
                width: 32,
                height: 32,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: RF_MINT_ACCENT
              }}>
                <Shield size={16} />
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  Refeir Admissions Suite
                </div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>
                  Navigation &amp; Governance Center
                </div>
              </div>
            </div>

            <button
              onClick={() => setAdminMobileNavOpen(false)}
              aria-label="Close navigation"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={17} />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y',
              padding: '16px 18px calc(24px + env(safe-area-inset-bottom, 20px))',
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}
          >
            {/* Staff identity card */}
            {loggedInStaff && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', background: 'rgba(24, 252, 92, 0.15)',
                    border: '1px solid rgba(24, 252, 92, 0.3)',
                    color: RF_MINT_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800
                  }}>
                    {loggedInStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFFFF' }}>{loggedInStaff.name}</div>
                    <div style={{ fontSize: 11, color: RF_MINT_ACCENT, fontWeight: 600 }}>{loggedInStaff.role.replace('_', ' ')}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>STAFF ID: {loggedInStaff.id}</span>
              </div>
            )}

            {/* Nav modules list with distinct icons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'applications', label: 'Applications & Admissions', icon: UserCheck, count: stats.total, desc: 'Review candidate dossiers & Founding 100 quota' },
                { id: 'proofs', label: 'Task Proofs of Work', icon: FileCheck, count: taskStats.total, desc: 'Verify mission deliverables & points verification' },
                { id: 'members', label: 'Pioneer Profiles', icon: Users, count: membersList.length, desc: 'Contributor directory, DOB records & accounts', onClick: refreshMembers },
                { id: 'workers', label: 'Review Team & Staff', icon: Briefcase, count: staffList.length, desc: 'Manage reviewer credentials & passcodes' },
                { id: 'certificates', label: 'Pioneer Certifications', icon: Award, count: certificatesList.length, desc: 'Issue & inspect sovereign completion credentials', onClick: refreshCertificates },
                { id: 'tasks', label: 'Squad Missions & Bounties', icon: Megaphone, count: tasksList.filter(t => t.status === 'ACTIVE').length, desc: 'Broadcast daily missions with airtime & cash', onClick: refreshTasks },
                { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3, count: 0, desc: 'Platform telemetry, growth trends & live charts' },
              ]
                .filter(item => isTabAuthorized(loggedInStaff?.role || 'SUPER_ADMIN', item.id))
                .map(item => {
                  const isActive = adminTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setAdminTab(item.id as any);
                        if (item.onClick) item.onClick();
                        setAdminMobileNavOpen(false);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 14px', borderRadius: 12,
                        background: isActive ? 'rgba(24, 252, 92, 0.12)' : 'rgba(255,255,255,0.03)',
                        border: isActive ? '1px solid rgba(24, 252, 92, 0.35)' : '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                        boxShadow: isActive ? '0 4px 14px rgba(24, 252, 92, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: isActive ? 'rgba(24, 252, 92, 0.22)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isActive ? RF_MINT_ACCENT : 'rgba(255,255,255,0.1)'}`,
                          color: isActive ? RF_MINT_ACCENT : 'rgba(255,255,255,0.6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <Icon size={17} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: isActive ? 700 : 600, color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.85)' }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100,
                        background: isActive ? 'rgba(24, 252, 92, 0.2)' : 'rgba(255,255,255,0.07)',
                        color: isActive ? RF_MINT_ACCENT : 'rgba(255,255,255,0.55)', flexShrink: 0
                      }}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
            </div>

            {/* Quick action bar */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
              paddingTop: 14,
              paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 14px))',
              borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 'auto'
            }}>
              <button
                onClick={() => {
                  setAdminMobileNavOpen(false);
                  onNavigate('/');
                }}
                style={{
                  background: 'rgba(24, 252, 92, 0.12)', border: '1px solid rgba(24, 252, 92, 0.3)',
                  color: RF_MINT_ACCENT, padding: '12px 10px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <ArrowLeft size={14} /> Back to Website
              </button>
              <button
                onClick={() => { handleLogout(); setAdminMobileNavOpen(false); }}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5', padding: '12px 10px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <LogOut size={14} /> Exit Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MOBILE STAFF PROFILE DOCKER (Bottom Sheet) ─── */}
      {isMobile && adminProfileDockerOpen && loggedInStaff && (
        <div
          onClick={() => setAdminProfileDockerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(3, 10, 6, 0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#081C12',
              borderTop: `1.5px solid ${RF_MINT_ACCENT}55`,
              borderRadius: '24px 24px 0 0',
              padding: '16px 20px calc(24px + env(safe-area-inset-bottom, 20px))',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
              maxHeight: '85dvh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            {/* Drag Pill */}
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.2)',
                margin: '0 auto 4px',
                cursor: 'pointer'
              }}
              onClick={() => setAdminProfileDockerOpen(false)}
            />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 11, color: RF_MINT_ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, display: 'block' }}>
                  Authenticated Staff Docker
                </span>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>
                  Reviewer Profile &amp; Settings
                </h3>
              </div>
              <button
                onClick={() => setAdminProfileDockerOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                ✕
              </button>
            </div>

            {/* Profile Identity Card */}
            <div style={{
              background: 'rgba(24, 252, 92, 0.04)',
              border: '1px solid rgba(24, 252, 92, 0.18)',
              borderRadius: 16,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(24, 252, 92, 0.15)',
                border: `2px solid ${RF_MINT_ACCENT}`,
                color: RF_MINT_ACCENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                fontWeight: 800,
                flexShrink: 0
              }}>
                {loggedInStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {loggedInStaff.name}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: isSuperAdmin ? RF_GOLD_YELLOW : RF_MINT_ACCENT,
                    background: isSuperAdmin ? 'rgba(246, 178, 26, 0.15)' : 'rgba(24, 252, 92, 0.12)',
                    padding: '2px 7px',
                    borderRadius: 100,
                    border: `1px solid ${isSuperAdmin ? 'rgba(246, 178, 26, 0.35)' : 'rgba(24, 252, 92, 0.3)'}`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {loggedInStaff.role === 'SUPER_ADMIN' ? 'Super Admin' : loggedInStaff.role.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {loggedInStaff.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: RF_MINT_ACCENT, boxShadow: `0 0 6px ${RF_MINT_ACCENT}` }} />
                  <span style={{ fontSize: 11, color: RF_MINT_ACCENT, fontWeight: 600 }}>Active Session</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>•</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                    {loggedInStaff.assigned_division ? loggedInStaff.assigned_division.replace('_', ' ') : 'All Squads'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Session Stats Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '10px 8px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', display: 'block' }}>Applicants</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginTop: 2, display: 'block' }}>{stats.total}</span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '10px 8px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', display: 'block' }}>Pending</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: RF_GOLD_YELLOW, marginTop: 2, display: 'block' }}>{stats.pending}</span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '10px 8px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', display: 'block' }}>Verified</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: RF_MINT_ACCENT, marginTop: 2, display: 'block' }}>{taskStats.verified}</span>
              </div>
            </div>

            {/* Actions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Switch Profile Button */}
              <button
                onClick={() => {
                  setAdminProfileDockerOpen(false);
                  handleLogout();
                }}
                style={{
                  background: 'rgba(24, 252, 92, 0.12)',
                  border: `1px solid ${RF_MINT_ACCENT}55`,
                  color: RF_MINT_ACCENT,
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users size={16} />
                  <span>Switch Reviewer Profile</span>
                </div>
                <ChevronRight size={15} style={{ opacity: 0.6 }} />
              </button>

              {/* Refresh Pipeline Data */}
              <button
                onClick={() => {
                  handleRefreshData();
                  setAdminProfileDockerOpen(false);
                }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RefreshCw size={16} />
                  <span>Sync &amp; Refresh Portal Data</span>
                </div>
                <ChevronRight size={15} style={{ opacity: 0.6 }} />
              </button>

              {/* Export Applications CSV */}
              <button
                onClick={() => {
                  handleExportCSV();
                  setAdminProfileDockerOpen(false);
                }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Download size={16} />
                  <span>Export Applications (.CSV)</span>
                </div>
                <ChevronRight size={15} style={{ opacity: 0.6 }} />
              </button>

              {/* Sign Out / Exit */}
              <button
                onClick={() => {
                  setAdminProfileDockerOpen(false);
                  handleLogout();
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 4
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <LogOut size={16} />
                  <span>Sign Out of Admin Portal</span>
                </div>
                <ChevronRight size={15} style={{ opacity: 0.6 }} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '16px 14px calc(90px + env(safe-area-inset-bottom, 24px))' : '26px 24px 80px' }}>
        {/* Mobile Active Section Breadcrumb & Switcher Trigger */}
        {isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(24, 252, 92, 0.15)', color: RF_MINT_ACCENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {adminTab === 'applications' && <UserCheck size={15} />}
                {adminTab === 'proofs' && <FileCheck size={15} />}
                {adminTab === 'members' && <Users size={15} />}
                {adminTab === 'workers' && <Briefcase size={15} />}
                {adminTab === 'certificates' && <Award size={15} />}
                {adminTab === 'tasks' && <Megaphone size={15} />}
                {adminTab === 'analytics' && <BarChart3 size={15} />}
              </div>
              <div>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                  Current Section
                </span>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                  {adminTab === 'applications' && 'Candidate Applications'}
                  {adminTab === 'proofs' && 'Task Proofs of Work'}
                  {adminTab === 'members' && 'Pioneer Profiles Registry'}
                  {adminTab === 'workers' && 'Review Staff Team'}
                  {adminTab === 'certificates' && 'Pioneer Certifications'}
                  {adminTab === 'tasks' && 'Squad Missions & Bounties'}
                  {adminTab === 'analytics' && 'Analytics Dashboard'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setAdminMobileNavOpen(true)}
              style={{
                background: 'rgba(24, 252, 92, 0.12)', border: '1px solid rgba(24, 252, 92, 0.28)',
                color: RF_MINT_ACCENT, padding: '6px 12px', borderRadius: 100, fontSize: 11.5,
                fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5
              }}
            >
              <Menu size={12} /> Switch
            </button>
          </div>
        )}

        {/* Desktop Navigation Tabs (Hidden on mobile) */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 26,
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 12,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {[
              { id: 'applications', label: 'Applications', icon: UserCheck, count: stats.total },
              { id: 'proofs', label: 'Task Proofs', icon: FileCheck, count: taskStats.total },
              { id: 'members', label: 'Pioneer Profiles', icon: Users, count: membersList.length, onClick: refreshMembers },
              { id: 'workers', label: 'Review Team', icon: Briefcase, count: staffList.length },
              { id: 'certificates', label: 'Certifications', icon: Award, count: certificatesList.length, onClick: refreshCertificates },
              { id: 'tasks', label: 'Squad Missions', icon: Megaphone, count: tasksList.filter(t => t.status === 'ACTIVE').length, onClick: refreshTasks },
              { id: 'analytics', label: 'Analytics', icon: BarChart3, count: 0 },
            ]
              .filter(tab => isTabAuthorized(loggedInStaff?.role || 'SUPER_ADMIN', tab.id))
              .map(tab => {
                const isActive = adminTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setAdminTab(tab.id as any);
                      if (tab.onClick) tab.onClick();
                    }}
                    style={{
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      height: 36,
                      padding: '0 16px',
                      borderRadius: 8,
                      fontSize: 12.5,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? RF_MINT_ACCENT : 'rgba(255, 255, 255, 0.65)',
                      background: isActive ? 'rgba(24, 252, 92, 0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(24, 252, 92, 0.28)' : '1px solid transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      transition: 'all 0.16s ease'
                    }}
                  >
                    <Icon size={14} style={{ opacity: isActive ? 1 : 0.7 }} />
                    <span>{tab.label}</span>
                    {tab.id !== 'analytics' && (
                      <span style={{
                        background: isActive ? 'rgba(24, 252, 92, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? RF_MINT_ACCENT : 'rgba(255, 255, 255, 0.55)',
                        padding: '1px 6px',
                        borderRadius: 6,
                        fontSize: 10.5,
                        fontWeight: 700
                      }}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        )}

        {adminTab === 'applications' && (
          <div>
            {/* Section Header with Title & Action Controls */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
              marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: isMobile ? 10 : 16
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    {isMobile ? 'Admissions' : 'Pioneer Admissions & Applications'}
                  </h2>
                  <span style={{
                    fontSize: 10, fontWeight: 700, background: 'rgba(24, 252, 92, 0.12)',
                    color: RF_MINT_ACCENT, border: `1px solid ${RF_MINT_ACCENT}55`,
                    padding: '2.5px 7px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4,
                    textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap'
                  }}>
                    <UserCheck size={10} /> {stats.total} Total Applicants
                  </span>
                </div>
                <p style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 820, lineHeight: 1.5 }}>
                  Review candidate applications, verify portfolios, and manage squad admissions.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: isMobile ? '100%' : 'auto' }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                    padding: isMobile ? '7px 12px' : '8px 18px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12.5, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                    boxShadow: `0 3px 12px ${RF_LEAF_GREEN}33`, transition: 'all 0.2s',
                    flex: isMobile ? 1 : 'initial', justifyContent: 'center'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = RF_MINT_ACCENT)}
                  onMouseLeave={e => (e.currentTarget.style.background = RF_LEAF_GREEN)}
                >
                  <Download size={13} /> Export CSV
                </button>

                <button
                  onClick={handleRefreshData}
                  disabled={loading}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
                    color: '#FFFFFF', padding: isMobile ? '7px 12px' : '8px 16px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12.5,
                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5
                  }}
                >
                  <RefreshCw size={13} className={loading ? 'rp-spin' : ''} /> {loading ? 'Syncing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* KPI & Metrics Bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? 10 : 14, marginBottom: isMobile ? 18 : 26
        }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Applications</span>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>{stats.total}</div>
            <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: RF_MINT_ACCENT }}>All time received</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pending Review</span>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_GOLD_YELLOW, marginTop: 3 }}>{stats.pending}</div>
            <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Requires decision</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Accepted Pioneers</span>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 3 }}>{stats.accepted}</div>
            <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Approved candidates</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Founding 100 Seats</span>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>
              {stats.founding} <span style={{ fontSize: isMobile ? 13 : 16, color: 'rgba(255,255,255,0.4)' }}>/ 100</span>
            </div>
            <div style={{ width: '100%', height: 4, borderRadius: 100, background: 'rgba(255,255,255,0.1)', marginTop: 6 }}>
              <div style={{ width: `${Math.min(100, stats.founding)}%`, height: '100%', borderRadius: 100, background: RF_MINT_ACCENT }} />
            </div>
          </div>
        </div>

        {/* Admissions Funnel & Capacity Analytics */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.025)',
          border: '1px solid rgba(24, 252, 92, 0.16)',
          borderRadius: isMobile ? 12 : 16,
          padding: isMobile ? '12px 14px' : '16px 20px',
          marginBottom: isMobile ? 16 : 24,
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Activity size={14} />
              </div>
              <span style={{ fontSize: isMobile ? 12.5 : 14, fontWeight: 700, color: '#FFFFFF' }}>
                {isMobile ? 'Admissions Telemetry' : 'Admissions Funnel & Capacity Telemetry'}
              </span>
            </div>
            <span style={{
              fontSize: 10.5, color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)',
              padding: '2.5px 8px', borderRadius: 100, fontWeight: 600, border: '1px solid rgba(24, 252, 92, 0.2)',
              whiteSpace: 'nowrap'
            }}>
              Founding 100: {analytics.foundingCapPct}% Fulfilled
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(3, minmax(0, 1fr))',
            gap: isMobile ? 10 : 16,
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}>
            {/* Founding 100 Quota Bar */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 10,
              padding: isMobile ? '10px 12px' : '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              minWidth: 0,
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8 }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Founding Quota Cap</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: RF_MINT_ACCENT, whiteSpace: 'nowrap' }}>{analytics.foundingApps} / 100</span>
              </div>
              <div style={{ width: '100%', maxWidth: '100%', height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', boxSizing: 'border-box' }}>
                <div style={{
                  width: `${Math.min(100, Math.max(0, analytics.foundingCapPct))}%`,
                  height: '100%',
                  borderRadius: 100,
                  background: `linear-gradient(90deg, ${RF_LEAF_GREEN}, ${RF_MINT_ACCENT})`,
                  boxShadow: `0 0 8px ${RF_MINT_ACCENT}55`
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'rgba(255,255,255,0.45)', flexWrap: 'wrap', gap: 4 }}>
                <span>{100 - analytics.foundingApps > 0 ? `${100 - analytics.foundingApps} slots left` : 'Capacity reached'}</span>
                <span>Max 100 seats</span>
              </div>
            </div>

            {/* Funnel Conversion Rates */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 10,
              padding: isMobile ? '10px 12px' : '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              minWidth: 0,
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                Conversion Velocity
              </span>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 0,
                alignItems: 'center',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ minWidth: 0, textAlign: 'left', paddingRight: 8 }}>
                  <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: RF_MINT_ACCENT }}>{analytics.acceptanceRate}%</div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Accept ({analytics.acceptedApps})
                  </span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 8px', minWidth: 0, textAlign: 'left' }}>
                  <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: RF_GOLD_YELLOW }}>{analytics.pendingRate}%</div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Pending ({analytics.pendingApps})
                  </span>
                </div>
                <div style={{ minWidth: 0, textAlign: 'left', paddingLeft: 8 }}>
                  <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#38BDF8' }}>{analytics.waitlistedApps}</div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Waitlisted
                  </span>
                </div>
              </div>
            </div>

            {/* Division Talent Pipeline */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 10,
              padding: isMobile ? '10px 12px' : '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              minWidth: 0,
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                Squad Division Pipeline
              </span>
              <div style={{
                display: 'flex',
                flexWrap: isMobile ? 'nowrap' : 'wrap',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                gap: 5,
                paddingBottom: isMobile ? 2 : 0,
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                boxSizing: 'border-box'
              }} className="rp-sleek-scroll">
                {Object.keys(analytics.appsByDivision).length === 0 ? (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>No division data yet</span>
                ) : (
                  Object.entries(analytics.appsByDivision).map(([div, count]) => (
                    <span
                      key={div}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        padding: '2.5px 7px',
                        borderRadius: 5,
                        fontSize: 10.5,
                        color: '#FFFFFF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{div.replace('_', ' ')}</span>
                      <strong style={{ color: RF_MINT_ACCENT }}>{count}</strong>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Controls */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px' : '16px 20px',
          border: '1px solid rgba(255,255,255,0.08)', marginBottom: isMobile ? 14 : 20,
          display: 'flex', flexWrap: 'wrap', gap: isMobile ? 8 : 12, alignItems: 'center', justifyContent: 'space-between'
        }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: isMobile ? '1 1 100%' : '1 1 280px', maxWidth: isMobile ? '100%' : 420 }}>
            <Search size={14} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search candidate, email, ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: isMobile ? '8px 14px 8px 36px' : '9px 16px 9px 40px', borderRadius: 100,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFFFFF', fontSize: isMobile ? 12 : 12.5, outline: 'none'
              }}
            />
          </div>

          {/* Filter Dropdowns */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                flex: isMobile ? 1 : 'none', cursor: 'pointer'
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="REVIEWING">Under Review</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="WAITLISTED">Waitlisted</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              value={divisionFilter}
              onChange={e => setDivisionFilter(e.target.value)}
              style={{
                background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                flex: isMobile ? 1 : 'none', cursor: 'pointer'
              }}
            >
              <option value="ALL">All Divisions</option>
              <option value="TECH_PRODUCT">Tech & Product</option>
              <option value="CREATIVE">Creative</option>
              <option value="GROWTH">Growth</option>
              <option value="BUSINESS">Business</option>
              <option value="COMMUNITY">Community</option>
              <option value="RESEARCH_TESTING">Research & Testing</option>
            </select>

            <label style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: isMobile ? 11 : 12,
              color: 'rgba(255,255,255,0.75)', cursor: 'pointer', userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={foundingOnly}
                onChange={e => setFoundingOnly(e.target.checked)}
                style={{ accentColor: RF_MINT_ACCENT }}
              />
              Founding 100 Only
            </label>
          </div>
        </div>

        {/* Applications Data Table */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 14 : 18, border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden', width: '100%', maxWidth: '100%', boxSizing: 'border-box'
        }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="rp-sleek-scroll">
            <table style={{ width: '100%', minWidth: isMobile ? 880 : 780, borderCollapse: 'collapse', textAlign: 'left', fontSize: isMobile ? 12 : 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', minWidth: 190 }}>Application ID</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', minWidth: 210 }}>Candidate</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', minWidth: 170 }}>Division &amp; Roles</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', minWidth: 130 }}>Status</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', minWidth: 90 }}>Submitted</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', whiteSpace: 'nowrap', minWidth: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>
                      No applications match the current filter or search term.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map(app => (
                    <tr
                      key={app.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background 0.2s', cursor: 'pointer'
                      }}
                      onClick={() => openReviewModal(app)}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* ID & Founding & Acceptance Code */}
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 190, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: isMobile ? 12 : 13, fontWeight: 700, color: RF_MINT_ACCENT, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                          {app.application_number}
                        </div>
                        {app.is_founding_100 && (
                          <div style={{ marginTop: 3 }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, color: RF_GOLD_YELLOW,
                              background: 'rgba(246, 178, 26, 0.12)', border: '1px solid rgba(246, 178, 26, 0.3)',
                              padding: '1.5px 6px', borderRadius: 4, whiteSpace: 'nowrap', letterSpacing: '0.03em'
                            }}>
                              ⭐ {app.pioneer_id || 'FOUNDING 100'}
                            </span>
                          </div>
                        )}
                        {app.status === 'ACCEPTED' && (
                          <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                            <span style={{
                              fontSize: 10, fontFamily: 'monospace', color: RF_MINT_ACCENT,
                              background: 'rgba(24, 252, 92, 0.1)', padding: '2px 6px', borderRadius: 4,
                              border: `1px solid ${RF_LEAF_GREEN}55`, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3,
                              whiteSpace: 'nowrap'
                            }}>
                              <Key size={9} style={{ flexShrink: 0 }} />
                              {app.acceptance_code || 'ACC-PENDING'}
                            </span>
                            {app.acceptance_code && (
                              <button
                                title="Copy Acceptance Code"
                                onClick={e => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(app.acceptance_code!);
                                  setCopiedCodeAppId(app.id);
                                  setTimeout(() => setCopiedCodeAppId(null), 2000);
                                }}
                                style={{
                                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                                  borderRadius: 4, color: copiedCodeAppId === app.id ? RF_MINT_ACCENT : 'rgba(255,255,255,0.6)',
                                  cursor: 'pointer', padding: '2px 6px', display: 'inline-flex', alignItems: 'center', gap: 3,
                                  fontSize: 10, fontWeight: 600, transition: 'all 0.15s ease', whiteSpace: 'nowrap'
                                }}
                              >
                                {copiedCodeAppId === app.id ? <Check size={10} strokeWidth={3} /> : <Copy size={10} />}
                                <span>{copiedCodeAppId === app.id ? 'Copied' : 'Copy'}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Candidate Name & Location */}
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 210, verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: isMobile ? 13 : 13.5 }}>{app.full_name}</div>
                        <div style={{ fontSize: isMobile ? 11 : 11.5, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                          {app.city ? `${app.city}, ` : ''}{app.country} • {app.email}
                        </div>
                      </td>

                      {/* Division & Roles */}
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 170, verticalAlign: 'middle' }}>
                        <div style={{ fontSize: isMobile ? 12 : 12.5, fontWeight: 600, color: '#FFFFFF' }}>
                          {app.primary_division?.replace('_', ' ') || 'General'}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                          {(app.roles || []).join(', ')}
                        </div>
                      </td>

                      {/* Review Status & Contributor Level */}
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 130, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div>{renderStatusBadge(app.status)}</div>
                        <div style={{ marginTop: 3 }}>
                          <span style={{
                            fontSize: 9.5, fontWeight: 700,
                            color: app.contributor_level === 'LEVEL_5' ? '#38BDF8'
                              : app.contributor_level === 'LEVEL_4' ? RF_GOLD_YELLOW
                              : app.contributor_level === 'LEVEL_3' ? RF_MINT_ACCENT
                              : app.contributor_level === 'LEVEL_2' ? RF_LEAF_GREEN
                              : '#94A3B8',
                            letterSpacing: '0.03em'
                          }}>
                            {app.contributor_level === 'LEVEL_5' ? '★ L5: Core'
                              : app.contributor_level === 'LEVEL_4' ? '🎖️ L4: Lead'
                              : app.contributor_level === 'LEVEL_3' ? '⚡ L3: Builder'
                              : app.contributor_level === 'LEVEL_2' ? '🌱 L2: Pioneer'
                              : '👤 L1: Member'}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 90, verticalAlign: 'middle', color: 'rgba(255,255,255,0.5)', fontSize: isMobile ? 11 : 12, whiteSpace: 'nowrap' }}>
                        {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>

                      {/* Action Button */}
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 80, textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={e => { e.stopPropagation(); openReviewModal(app); }}
                          style={{
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
                            color: '#FFFFFF', padding: isMobile ? '4px 10px' : '5px 14px', borderRadius: 6, fontSize: isMobile ? 11 : 12,
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
                          }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

    {adminTab === 'proofs' && (
      <div>
        {/* Section Header with Title & Action Controls */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
          marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: isMobile ? 10 : 16
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                {isMobile ? 'Task Proofs' : 'Proof of Work & Task Verifications'}
              </h2>
              <span style={{
                fontSize: 10, fontWeight: 700, background: 'rgba(255, 209, 102, 0.12)',
                color: RF_GOLD_YELLOW, border: `1px solid ${RF_GOLD_YELLOW}55`,
                padding: '2.5px 7px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4,
                textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap'
              }}>
                <Clock size={10} /> {taskStats.pending} Pending Review
              </span>
            </div>
            <p style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 820, lineHeight: 1.5 }}>
              Audit deliverable proofs, award contribution points, and request revisions.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: isMobile ? '100%' : 'auto' }}>
            <button
              onClick={handleExportCSV}
              style={{
                background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                padding: isMobile ? '7px 12px' : '8px 18px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12.5, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                boxShadow: `0 3px 12px ${RF_LEAF_GREEN}33`, transition: 'all 0.2s',
                flex: isMobile ? 1 : 'initial', justifyContent: 'center'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = RF_MINT_ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.background = RF_LEAF_GREEN)}
            >
              <Download size={13} /> Export Proofs
            </button>

            <button
              onClick={handleRefreshData}
              disabled={loading}
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
                color: '#FFFFFF', padding: isMobile ? '7px 12px' : '8px 16px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12.5,
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5
              }}
            >
              <RefreshCw size={13} className={loading ? 'rp-spin' : ''} /> {loading ? 'Syncing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* KPI Bar for Task Submissions */}
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? 10 : 14, marginBottom: isMobile ? 18 : 26
        }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Submissions</span>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>{taskStats.total}</div>
            <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: RF_MINT_ACCENT }}>All time reported</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pending Review</span>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_GOLD_YELLOW, marginTop: 3 }}>{taskStats.pending}</div>
            <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Requires squad review</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verified &amp; Promoted</span>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 3 }}>{taskStats.verified}</div>
            <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Ladder rank upgraded</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Needs Revision</span>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFB27D', marginTop: 3 }}>{taskStats.needsRevision}</div>
            <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Actionable notes sent</span>
          </div>
        </div>

        {/* Deliverable Verification & Throughput Analytics */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.025)',
          border: '1px solid rgba(24, 252, 92, 0.16)',
          borderRadius: isMobile ? 12 : 16,
          padding: isMobile ? '12px 14px' : '16px 20px',
          marginBottom: isMobile ? 16 : 24,
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <TrendingUp size={14} />
              </div>
              <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                {isMobile ? 'Throughput Analytics' : 'Deliverable Verification & Throughput Analytics'}
              </span>
            </div>
            <span style={{
              fontSize: 10.5, color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)',
              padding: '2.5px 9px', borderRadius: 100, fontWeight: 600, border: '1px solid rgba(24, 252, 92, 0.2)',
              flexShrink: 0
            }}>
              Throughput Rate: {analytics.verificationRate}% Verified
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(3, minmax(0, 1fr))',
            gap: isMobile ? 10 : 14
          }}>
            {/* Verification Velocity Bar */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 10,
              padding: isMobile ? '10px 12px' : '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              minWidth: 0,
              overflow: 'hidden',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Ratio</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: RF_MINT_ACCENT }}>{analytics.verificationRate}%</span>
              </div>
              <div style={{ width: '100%', height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex' }}>
                <div style={{
                  width: `${analytics.verificationRate}%`,
                  height: '100%',
                  background: RF_MINT_ACCENT
                }} />
                <div style={{
                  width: `${analytics.revisionRate}%`,
                  height: '100%',
                  background: '#FFB27D'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginTop: 6, fontSize: 10.5, color: 'rgba(255,255,255,0.45)' }}>
                <span style={{ whiteSpace: 'nowrap' }}>{analytics.verifiedProofs} Verified</span>
                <span style={{ whiteSpace: 'nowrap' }}>{analytics.revisionProofs} Revisions ({analytics.revisionRate}%)</span>
              </div>
            </div>

            {/* Audits Pipeline Velocity */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 10,
              padding: isMobile ? '10px 12px' : '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              minWidth: 0,
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                Audit Pipeline State
              </span>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 0,
                alignItems: 'center',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ minWidth: 0, textAlign: 'left', paddingRight: 8 }}>
                  <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: RF_GOLD_YELLOW }}>{analytics.pendingProofs}</div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pending</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 8px', minWidth: 0, textAlign: 'left' }}>
                  <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: RF_MINT_ACCENT }}>{analytics.verifiedProofs}</div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Promoted</span>
                </div>
                <div style={{ minWidth: 0, textAlign: 'left', paddingLeft: 8 }}>
                  <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#FFB27D' }}>{analytics.revisionProofs}</div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Revisions</span>
                </div>
              </div>
            </div>

            {/* Division Submissions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 10,
              padding: isMobile ? '10px 12px' : '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              minWidth: 0,
              overflow: 'hidden',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                Squad Output
              </span>
              <div style={{
                display: 'flex',
                flexWrap: isMobile ? 'nowrap' : 'wrap',
                overflowX: isMobile ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                gap: 5,
                paddingBottom: isMobile ? 2 : 0
              }}>
                {Object.keys(analytics.proofsByDivision).length === 0 ? (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>No submissions yet</span>
                ) : (
                  Object.entries(analytics.proofsByDivision).map(([div, count]) => (
                    <span
                      key={div}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        padding: '2.5px 7px',
                        borderRadius: 5,
                        fontSize: 10.5,
                        color: '#FFFFFF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{div.replace('_', ' ')}</span>
                      <strong style={{ color: RF_MINT_ACCENT }}>{count}</strong>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Proofs Filter Bar */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px' : '16px 20px',
          border: '1px solid rgba(255,255,255,0.08)', marginBottom: isMobile ? 16 : 24,
          display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: isMobile ? '1 1 100%' : '1 1 280px', maxWidth: isMobile ? '100%' : 420 }}>
            <Search size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by contributor, title, email, POW..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: isMobile ? '8px 14px 8px 36px' : '9px 16px 9px 40px', borderRadius: 100,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFFFFF', fontSize: isMobile ? 12 : 12.5, outline: 'none'
              }}
            />
          </div>

          {/* Status & Division Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
            <select
              value={taskFilterStatus}
              onChange={e => setTaskFilterStatus(e.target.value)}
              style={{
                background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                flex: isMobile ? 1 : 'none', cursor: 'pointer'
              }}
            >
              <option value="ALL">All Proofs ({taskStats.total})</option>
              <option value="PENDING">Pending Review ({taskStats.pending})</option>
              <option value="VERIFIED">Verified ({taskStats.verified})</option>
              <option value="NEEDS_REVISION">Needs Revision ({taskStats.needsRevision})</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              value={divisionFilter}
              onChange={e => setDivisionFilter(e.target.value)}
              style={{
                background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                flex: isMobile ? 1 : 'none', cursor: 'pointer'
              }}
            >
              <option value="ALL">All Divisions</option>
              <option value="TECHNOLOGY">Tech &amp; Engineering</option>
              <option value="DESIGN">Creative &amp; Design</option>
              <option value="GROWTH">Growth &amp; Referrals</option>
              <option value="COMMUNITY">Community &amp; Campus</option>
              <option value="OPERATIONS">Operations &amp; QA</option>
              <option value="BUSINESS">Business &amp; Partnerships</option>
            </select>
          </div>
        </div>

          {/* Proofs Table */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16,
            border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden'
          }}>
            <div className="rp-sleek-scroll" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
              <table style={{ width: '100%', minWidth: 980, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', minWidth: 140, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Reference / Date</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', minWidth: 200, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Contributor</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', minWidth: 110, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Target Rank</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', minWidth: 230, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Mission &amp; Category</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', minWidth: 120, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Evidence</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', minWidth: 140, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', minWidth: 120, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', whiteSpace: 'nowrap' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12.5 }}>
                      No task completion proofs found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => (
                    <tr
                      key={task.id}
                      onClick={() => handleOpenTaskModal(task)}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer', transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 140, whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, fontFamily: 'monospace', color: RF_MINT_ACCENT, display: 'block' }}>
                          {task.reference_id}
                        </span>
                        <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 2, display: 'block' }}>
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 200 }}>
                        <span style={{ fontSize: isMobile ? 12.5 : 13, fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
                          {task.full_name}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: 2 }}>
                          {task.email}
                        </span>
                        <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                          {task.application_number && (
                            <span style={{ fontSize: 10, fontFamily: 'monospace', color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.08)', padding: '1.5px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                              {task.application_number}
                            </span>
                          )}
                          {task.pioneer_id && (
                            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: RF_GOLD_YELLOW, background: 'rgba(246, 178, 26, 0.1)', padding: '1.5px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                              {task.pioneer_id}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 110, whiteSpace: 'nowrap' }}>
                        <span style={{
                          padding: '2.5px 8px', borderRadius: 100, fontSize: 10.5, fontWeight: 700,
                          background: task.target_level === 'LEVEL_2' ? `${RF_MINT_ACCENT}15` : `${RF_GOLD_YELLOW}15`,
                          border: `1px solid ${task.target_level === 'LEVEL_2' ? RF_MINT_ACCENT : RF_GOLD_YELLOW}55`,
                          color: task.target_level === 'LEVEL_2' ? RF_MINT_ACCENT : RF_GOLD_YELLOW,
                          whiteSpace: 'nowrap', display: 'inline-block'
                        }}>
                          {task.target_level.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 230 }}>
                        <span style={{ fontSize: isMobile ? 12 : 12.5, fontWeight: 600, color: '#FFFFFF', display: 'block', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.task_title}
                        </span>
                        <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', marginTop: 2, display: 'block' }}>
                          {task.task_category}
                        </span>
                      </td>
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 120, whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                          <ImageIcon size={13} color={task.screenshots.length > 0 ? RF_MINT_ACCENT : 'rgba(255,255,255,0.4)'} />
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: task.screenshots.length > 0 ? '#FFFFFF' : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                            {task.screenshots.length} Shot{task.screenshots.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 140, whiteSpace: 'nowrap' }}>
                        {renderTaskStatusBadge(task.status)}
                      </td>
                      <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', minWidth: 120, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={e => { e.stopPropagation(); handleOpenTaskModal(task); }}
                          style={{
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
                            color: '#FFFFFF', height: isMobile ? 28 : 30, padding: isMobile ? '0 10px' : '0 14px', borderRadius: 6, fontSize: isMobile ? 11 : 12,
                            fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex',
                            alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = RF_MINT_ACCENT; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
                        >
                          Review Proof
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── PIONEER MEMBERS & PROFILES MANAGEMENT TAB ────────────────────────── */}
      {adminTab === 'members' && (
        <div>
          {/* Action Feedback Banner */}
          {memberActionFeedback && (
            <div style={{
              background: 'rgba(24, 252, 92, 0.12)', border: `1px solid ${RF_LEAF_GREEN}66`,
              padding: '10px 16px', borderRadius: 10, marginBottom: 16, display: 'flex',
              alignItems: 'center', gap: 8, color: '#FFFFFF', fontSize: 13
            }}>
              <CheckCircle2 size={16} color={RF_MINT_ACCENT} />
              <span>{memberActionFeedback}</span>
            </div>
          )}

          {/* Header with Title & Refresh */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
            marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: isMobile ? 10 : 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {isMobile ? 'Pioneers Directory' : 'Pioneer Members & Contributor Profiles'}
                </h2>
                <span style={{
                  fontSize: 10, fontWeight: 700, background: 'rgba(24, 252, 92, 0.12)',
                  color: RF_MINT_ACCENT, border: `1px solid ${RF_LEAF_GREEN}44`,
                  padding: '2.5px 7px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4,
                  textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap'
                }}>
                  <Users size={10} /> {membersList.length} Registered Pioneers
                </span>
              </div>
              <p style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 760, lineHeight: 1.5 }}>
                Directory of verified pioneers, contributor identities, and rank records.
              </p>
            </div>

            <button
              onClick={handleRefreshData}
              disabled={loading}
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
                color: '#FFFFFF', padding: isMobile ? '7px 12px' : '8px 18px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12.5,
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.2s', width: isMobile ? '100%' : 'auto', justifyContent: 'center'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              <RefreshCw size={13} className={loading ? 'rp-spin' : ''} /> {loading ? 'Syncing...' : 'Refresh Directory'}
            </button>
          </div>

          {/* Members KPI Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: isMobile ? 10 : 14, marginBottom: isMobile ? 18 : 26
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Pioneers</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>{memberStats.total}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Enrolled in network</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Pioneers</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 3 }}>{memberStats.active}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Good standing &amp; active</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suspended Accounts</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: memberStats.suspended > 0 ? '#EF4444' : 'rgba(255,255,255,0.4)', marginTop: 3 }}>
                {memberStats.suspended}
              </div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: memberStats.suspended > 0 ? '#FCA5A5' : 'rgba(255,255,255,0.5)' }}>Access restricted</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completed Profiles</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_GOLD_YELLOW, marginTop: 3 }}>{memberStats.completed}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>With permanent DOB</span>
            </div>
          </div>

          {/* Community Health & Tier Ladder Distribution */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(24, 252, 92, 0.16)',
            borderRadius: isMobile ? 12 : 16,
            padding: isMobile ? '12px 14px' : '16px 20px',
            marginBottom: isMobile ? 16 : 24,
            overflow: 'hidden',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Users size={14} />
                </div>
                <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                  {isMobile ? 'Community Vitality' : 'Community Health & Contributor Tier Ladder'}
                </span>
              </div>
              <span style={{
                fontSize: 10.5, color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)',
                padding: '2.5px 9px', borderRadius: 100, fontWeight: 600, border: '1px solid rgba(24, 252, 92, 0.2)',
                flexShrink: 0
              }}>
                Network Vitality: {analytics.activeRate}% Active
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(3, minmax(0, 1fr))',
              gap: isMobile ? 10 : 14
            }}>
              {/* Profile Completion Ratio */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: isMobile ? '10px 12px' : '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DOB &amp; Settlement</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: RF_GOLD_YELLOW }}>{analytics.profileCompRate}%</span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${analytics.profileCompRate}%`,
                    height: '100%',
                    borderRadius: 100,
                    background: `linear-gradient(90deg, ${RF_GOLD_YELLOW}, ${RF_MINT_ACCENT})`
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'rgba(255,255,255,0.45)' }}>
                  <span>{analytics.completedMembers} of {analytics.totalMembers} Completed</span>
                  <span>KYC Verified</span>
                </div>
              </div>

              {/* Account Standing Ratios */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: isMobile ? '10px 12px' : '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                minWidth: 0,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                  Account Health Standing
                </span>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 0,
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ minWidth: 0, textAlign: 'left', paddingRight: 8 }}>
                    <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: RF_MINT_ACCENT }}>{analytics.activeMembers}</div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Active</span>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 8px', minWidth: 0, textAlign: 'left' }}>
                    <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: analytics.suspendedMembers > 0 ? '#EF4444' : 'rgba(255,255,255,0.4)' }}>
                      {analytics.suspendedMembers}
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Suspended</span>
                  </div>
                  <div style={{ minWidth: 0, textAlign: 'left', paddingLeft: 8 }}>
                    <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#38BDF8' }}>{analytics.totalMembers}</div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total</span>
                  </div>
                </div>
              </div>

              {/* Contributor Tier Ladder */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: isMobile ? '10px 12px' : '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                  Rank Ladder
                </span>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {(['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5'] as const).map(lvl => (
                    <span
                      key={lvl}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        padding: '2.5px 7px',
                        borderRadius: 5,
                        fontSize: 10.5,
                        color: '#FFFFFF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{lvl.replace('LEVEL_', 'L')}</span>
                      <strong style={{ color: RF_MINT_ACCENT }}>{analytics.levelCounts[lvl] || 0}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Members Search & Filter Controls */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px' : '16px 20px',
            border: '1px solid rgba(255,255,255,0.08)', marginBottom: isMobile ? 16 : 24,
            display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between'
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: isMobile ? '1 1 100%' : '1 1 280px', maxWidth: isMobile ? '100%' : 420 }}>
              <Search size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by name, email, Pioneer ID, App #..."
                value={memberSearchTerm}
                onChange={e => setMemberSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: isMobile ? '8px 14px 8px 36px' : '9px 16px 9px 40px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF', fontSize: isMobile ? 12 : 12.5, outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
              {/* Account Status Filter */}
              <select
                value={memberStatusFilter}
                onChange={e => setMemberStatusFilter(e.target.value as any)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? '1 1 calc(50% - 4px)' : 'initial', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>

              {/* Squad Division Filter */}
              <select
                value={memberDivisionFilter}
                onChange={e => setMemberDivisionFilter(e.target.value)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? '1 1 calc(50% - 4px)' : 'initial', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Squads</option>
                <option value="GENERAL">General</option>
                <option value="TECHNOLOGY">Technology</option>
                <option value="DESIGN">Design</option>
                <option value="GROWTH">Growth</option>
                <option value="COMMUNITY">Community</option>
                <option value="OPERATIONS">Operations</option>
                <option value="BUSINESS">Business</option>
              </select>

              {/* Contributor Rank Filter */}
              <select
                value={memberLevelFilter}
                onChange={e => setMemberLevelFilter(e.target.value)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? '1 1 100%' : 'initial', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Tiers</option>
                <option value="LEVEL_1">Level 1 (Pioneer Associate)</option>
                <option value="LEVEL_2">Level 2 (Lead Builder)</option>
                <option value="LEVEL_3">Level 3 (Squad Architect)</option>
                <option value="LEVEL_4">Level 4 (Division Strategist)</option>
                <option value="LEVEL_5">Level 5 (Founding Partner)</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16, border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: 920, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Member / Pioneer</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Pioneer ID &amp; App #</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Squad &amp; Rank</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Date of Birth</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Location</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Account Status</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12.5 }}>
                      No pioneer members found matching your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map(member => {
                    const initials = member.full_name
                      .split(' ')
                      .map(n => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();

                    const squadInfo = Object.values(SQUAD_INFO).find(
                      s => s.name.toUpperCase().includes((member.division || '').toUpperCase()) || (member.division || '').toUpperCase().includes(s.tag)
                    ) || SQUAD_INFO.GENERAL;

                    const activityStatus = getContributorActivityStatus(member, taskSubmissions);

                    return (
                      <tr
                        key={member.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: member.is_suspended ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = member.is_suspended ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = member.is_suspended ? 'rgba(239, 68, 68, 0.04)' : 'transparent')}
                      >
                        {/* Member Identity */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', maxWidth: 220 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {member.avatar_url ? (
                              <img
                                src={member.avatar_url}
                                alt={member.full_name}
                                style={{
                                  width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                                  border: `2px solid ${member.is_suspended ? '#EF4444' : RF_LEAF_GREEN}`
                                }}
                              />
                            ) : (
                              <div style={{
                                width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: '50%', flexShrink: 0,
                                background: member.is_suspended ? 'rgba(239, 68, 68, 0.2)' : `${RF_LEAF_GREEN}25`,
                                border: `1px solid ${member.is_suspended ? '#EF4444' : RF_LEAF_GREEN}66`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: member.is_suspended ? '#FCA5A5' : RF_MINT_ACCENT,
                                fontSize: isMobile ? 12 : 13, fontWeight: 700
                              }}>
                                {initials || 'RP'}
                              </div>
                            )}
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ fontSize: isMobile ? 12.5 : 13.5, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
                                  {member.full_name}
                                </span>
                                {member.is_profile_completed && (
                                  <span title="Profile Completed" style={{ display: 'inline-flex', flexShrink: 0 }}>
                                    <CheckCircle2 size={12} color={RF_MINT_ACCENT} />
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Pioneer ID & Application Number */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_LEAF_GREEN}44`, padding: '2px 7px', borderRadius: 5 }}>
                            <Award size={11} color={RF_MINT_ACCENT} style={{ flexShrink: 0 }} />
                            <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: RF_MINT_ACCENT }}>
                              {member.pioneer_id || 'PENDING'}
                            </span>
                          </div>
                          {member.application_number && (
                            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 3, fontFamily: 'monospace' }}>
                              {member.application_number}
                            </div>
                          )}
                        </td>

                        {/* Squad & Rank */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ marginBottom: 4 }}>
                            <span style={{
                              fontSize: 10.5, fontWeight: 700, color: squadInfo.color,
                              background: `${squadInfo.color}18`, border: `1px solid ${squadInfo.color}44`,
                              padding: '2px 6px', borderRadius: 5, letterSpacing: '0.02em'
                            }}>
                              {member.division || 'Unassigned'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700,
                              color: RF_GOLD_YELLOW, background: 'rgba(255, 209, 102, 0.1)',
                              border: '1px solid rgba(255, 209, 102, 0.3)',
                              padding: '1.5px 6px', borderRadius: 5, textTransform: 'uppercase'
                            }}>
                              {(member.contributor_level || 'LEVEL_1').replace('_', ' ')}
                            </span>
                            {member.demoted_due_to_inactivity && (
                              <span style={{
                                fontSize: 9,
                                fontWeight: 700,
                                color: '#FFB27D',
                                background: 'rgba(244, 124, 32, 0.14)',
                                border: '1px solid rgba(244, 124, 32, 0.4)',
                                padding: '1px 5px',
                                borderRadius: 4,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3
                              }} title="Reset to Level 1 due to 14+ days of inactivity">
                                <AlertTriangle size={8} /> 14d Inactivity Reset
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date of Birth */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          {member.date_of_birth ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <Calendar size={12} color={RF_MINT_ACCENT} style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                                {formatDOB(member.date_of_birth)}
                              </span>
                              <span title="Permanent Record" style={{ display: 'inline-flex', alignItems: 'center', opacity: 0.5, flexShrink: 0 }}>
                                <Lock size={9} />
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                              Not provided
                            </span>
                          )}
                        </td>

                        {/* Location */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                            {member.city ? `${member.city}, ` : ''}{member.country || 'Global'}
                          </div>
                          {member.institution && (
                            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 2, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {member.institution}
                            </div>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          {member.is_suspended ? (
                            <div>
                              <span style={{
                                padding: '2.5px 7px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                                background: 'rgba(239, 68, 68, 0.12)', color: '#FCA5A5',
                                border: '1px solid rgba(239, 68, 68, 0.35)', display: 'inline-flex', alignItems: 'center', gap: 4,
                                flexShrink: 0, whiteSpace: 'nowrap'
                              }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                                SUSPENDED
                              </span>
                              {member.suspension_reason && (
                                <div style={{ fontSize: 10.5, color: '#FCA5A5', marginTop: 3, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }} title={member.suspension_reason}>
                                  {member.suspension_reason}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                              <span style={{
                                padding: '2.5px 7px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                                background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                                border: `1px solid ${RF_LEAF_GREEN}55`, display: 'inline-flex', alignItems: 'center', gap: 4,
                                flexShrink: 0, whiteSpace: 'nowrap'
                              }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: RF_MINT_ACCENT, display: 'inline-block' }} />
                                ACTIVE
                              </span>
                              {activityStatus.isAtRisk && !member.demoted_due_to_inactivity && (
                                <span style={{
                                  fontSize: 9.5,
                                  fontWeight: 700,
                                  color: RF_GOLD_YELLOW,
                                  background: 'rgba(255, 209, 102, 0.12)',
                                  border: '1px solid rgba(255, 209, 102, 0.3)',
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3
                                }} title={`Inactive for ${activityStatus.daysSinceActive} days. Progress resets to Level 1 after 14 days.`}>
                                  <Clock size={9} /> At Risk ({14 - activityStatus.daysSinceActive}d left)
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleOpenMemberModal(member)}
                              style={{
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                                color: '#FFFFFF', height: isMobile ? 28 : 30, padding: isMobile ? '0 9px' : '0 12px', borderRadius: 6, fontSize: isMobile ? 11 : 12,
                                fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                                transition: 'all 0.15s', whiteSpace: 'nowrap'
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                            >
                              <Eye size={12} style={{ flexShrink: 0 }} /> View Profile
                            </button>

                            {member.is_suspended ? (
                              <button
                                onClick={() => handleReactivateMember(member)}
                                style={{
                                  background: 'rgba(24, 252, 92, 0.12)', border: `1px solid ${RF_LEAF_GREEN}66`,
                                  color: RF_MINT_ACCENT, height: isMobile ? 28 : 30, padding: isMobile ? '0 9px' : '0 11px', borderRadius: 6, fontSize: isMobile ? 11 : 12,
                                  fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                                  transition: 'all 0.15s', whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24, 252, 92, 0.22)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(24, 252, 92, 0.12)')}
                              >
                                <CheckCircle2 size={12} style={{ flexShrink: 0 }} /> Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenSuspendModal(member)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)',
                                  color: '#FCA5A5', height: isMobile ? 28 : 30, padding: isMobile ? '0 9px' : '0 11px', borderRadius: 6, fontSize: isMobile ? 11 : 12,
                                  fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3,
                                  transition: 'all 0.15s', whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                              >
                                <Ban size={11} style={{ flexShrink: 0 }} /> Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── REVIEW TEAM & WORKERS MANAGEMENT TAB ──────────────────────────────── */}
      {adminTab === 'workers' && (
        <div>
          {/* Header with Title & Action Controls */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
            marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: isMobile ? 10 : 16,
            overflow: 'hidden', width: '100%', boxSizing: 'border-box'
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px', flexWrap: 'wrap', minWidth: 0 }}>
                <h2 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#FFFFFF', margin: 0, whiteSpace: isMobile ? 'nowrap' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
                  {isMobile ? 'Review Team' : 'Review Team & Squad Workers'}
                </h2>
                {isSuperAdmin ? (
                  <span style={{
                    fontSize: 10, fontWeight: 700, background: 'rgba(24, 252, 92, 0.12)',
                    color: RF_MINT_ACCENT, border: `1px solid ${RF_MINT_ACCENT}55`,
                    padding: '2.5px 7px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4,
                    textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap'
                  }}>
                    <Shield size={10} /> {isMobile ? 'Super Admin' : 'Super Admin Privilege Active'}
                  </span>
                ) : (
                  <span style={{
                    fontSize: 10, fontWeight: 700, background: 'rgba(255, 209, 102, 0.12)',
                    color: RF_GOLD_YELLOW, border: `1px solid ${RF_GOLD_YELLOW}55`,
                    padding: '2.5px 7px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4,
                    textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap'
                  }}>
                    <Lock size={10} /> {isMobile ? 'Staff Directory' : 'Read-Only Staff Directory'}
                  </span>
                )}
              </div>
              <p style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 820, lineHeight: 1.5 }}>
                Manage staff reviewers, assign squad leads, and oversee permissions.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: isMobile ? '100%' : 'auto',
              flexWrap: 'wrap'
            }}>
              {isSuperAdmin && (
                <>
                  <button
                    onClick={() => handleOpenAppointSquadLead()}
                    style={{
                      background: 'rgba(251, 191, 36, 0.14)',
                      border: '1px solid rgba(251, 191, 36, 0.35)',
                      color: RF_GOLD_YELLOW,
                      padding: isMobile ? '7px 12px' : '8px 18px',
                      borderRadius: 100,
                      fontSize: isMobile ? 11.5 : 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      flex: isMobile ? 1 : 'initial'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(251, 191, 36, 0.25)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(251, 191, 36, 0.14)';
                    }}
                  >
                    <Star size={13} /> Appoint Squad Lead
                  </button>

                  <button
                    onClick={() => {
                      setNewWorkerPasscode(`worker26_${Math.floor(100 + Math.random() * 900)}`);
                      setWorkerFormError('');
                      setAddWorkerModalOpen(true);
                    }}
                    style={{
                      background: RF_LEAF_GREEN,
                      color: RF_DEEP_GREEN,
                      border: 'none',
                      padding: isMobile ? '7px 12px' : '8px 18px',
                      borderRadius: 100,
                      fontSize: isMobile ? 11.5 : 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      boxShadow: `0 3px 12px ${RF_LEAF_GREEN}33`,
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      flex: isMobile ? 1 : 'initial'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = RF_MINT_ACCENT)}
                    onMouseLeave={e => (e.currentTarget.style.background = RF_LEAF_GREEN)}
                  >
                    <UserPlus size={13} /> Add Worker
                  </button>
                </>
              )}

              <button
                onClick={handleRefreshData}
                disabled={loading}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#FFFFFF',
                  padding: isMobile ? '7px 12px' : '8px 18px',
                  borderRadius: 100,
                  fontSize: isMobile ? 11.5 : 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <RefreshCw size={13} className={loading ? 'rp-spin' : ''} /> {loading ? 'Syncing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Workers KPI Metrics */}
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: isMobile ? 10 : 14, marginBottom: isMobile ? 18 : 26
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Review Staff</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>{staffList.length}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: RF_MINT_ACCENT }}>Provisioned accounts</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Reviewers</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 3 }}>
                {staffList.filter(s => s.status === 'ACTIVE').length}
              </div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Authorized to verify</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suspended Staff</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: staffList.filter(s => s.status === 'SUSPENDED').length > 0 ? '#EF4444' : 'rgba(255,255,255,0.4)', marginTop: 3 }}>
                {staffList.filter(s => s.status === 'SUSPENDED').length}
              </div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Revoked credentials</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Super Admins</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_GOLD_YELLOW, marginTop: 3 }}>
                {staffList.filter(s => s.role === 'SUPER_ADMIN').length}
              </div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Full root authority</span>
            </div>
          </div>

          {/* Workers Filter & Search Bar */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px' : '16px 20px',
            border: '1px solid rgba(255,255,255,0.08)', marginBottom: isMobile ? 16 : 24,
            display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between'
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: isMobile ? '1 1 100%' : '1 1 280px', maxWidth: isMobile ? '100%' : 420 }}>
              <Search size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search worker by name, email, or division..."
                value={staffSearchTerm}
                onChange={e => setStaffSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: isMobile ? '8px 14px 8px 36px' : '9px 16px 9px 40px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF', fontSize: isMobile ? 12 : 12.5, outline: 'none'
                }}
              />
            </div>

            {/* Role Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: isMobile ? '100%' : 'auto' }}>
              <select
                value={staffRoleFilter}
                onChange={e => setStaffRoleFilter(e.target.value)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? 1 : 'none', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMISSIONS_REVIEWER">Admissions Reviewer</option>
                <option value="TASK_VERIFIER">Task Verifier</option>
                <option value="SQUAD_LEAD">Squad Lead</option>
              </select>
            </div>
          </div>

          {/* Workers Table */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16, border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: isMobile ? 780 : 700, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: isMobile ? '12px 14px' : '16px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Worker / Reviewer</th>
                  <th style={{ padding: isMobile ? '12px 14px' : '16px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Role</th>
                  <th style={{ padding: isMobile ? '12px 14px' : '16px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Assigned Squad</th>
                  <th style={{ padding: isMobile ? '12px 14px' : '16px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Access Passcode</th>
                  <th style={{ padding: isMobile ? '12px 14px' : '16px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Reviews Handled</th>
                  <th style={{ padding: isMobile ? '12px 14px' : '16px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ padding: isMobile ? '12px 14px' : '16px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                      No workers found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map(member => {
                    const isRevealed = !!revealedPasscodes[member.id];
                    const isRootSuperAdmin = member.passcode === 'refeir2026';

                    return (
                      <tr
                        key={member.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Worker Identity */}
                        <td style={{ padding: isMobile ? '12px 14px' : '16px 20px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: '50%',
                              background: member.role === 'SUPER_ADMIN' ? `${RF_GOLD_YELLOW}25` : `${RF_LEAF_GREEN}20`,
                              border: `1px solid ${member.role === 'SUPER_ADMIN' ? RF_GOLD_YELLOW : RF_LEAF_GREEN}55`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: member.role === 'SUPER_ADMIN' ? RF_GOLD_YELLOW : RF_MINT_ACCENT,
                              fontWeight: 800, fontSize: isMobile ? 12.5 : 14, flexShrink: 0
                            }}>
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: '#FFFFFF' }}>
                                {member.name}
                              </div>
                              <div style={{ fontSize: isMobile ? 11 : 11.5, color: 'rgba(255,255,255,0.5)' }}>
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td style={{ padding: isMobile ? '12px 14px' : '16px 20px', whiteSpace: 'nowrap' }}>
                          {renderStaffRoleBadge(member.role)}
                        </td>

                        {/* Squad */}
                        <td style={{ padding: isMobile ? '12px 14px' : '16px 20px', whiteSpace: 'nowrap' }}>
                          <span style={{
                            fontSize: isMobile ? 11 : 12, fontWeight: 600,
                            color: member.assigned_division === 'ALL' ? RF_MINT_ACCENT : 'rgba(255,255,255,0.85)',
                            background: 'rgba(255,255,255,0.05)', padding: '2.5px 8px', borderRadius: 6,
                            whiteSpace: 'nowrap', display: 'inline-block'
                          }}>
                            {member.assigned_division === 'ALL' ? '🌐 All Squads' : member.assigned_division}
                          </span>
                        </td>

                        {/* Passcode */}
                        <td style={{ padding: isMobile ? '12px 14px' : '16px 20px', whiteSpace: 'nowrap' }}>
                          {isSuperAdmin ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
                              <span style={{ fontFamily: 'monospace', fontSize: isMobile ? 11 : 12, color: isRevealed ? RF_MINT_ACCENT : 'rgba(255,255,255,0.5)', minWidth: 68 }}>
                                {isRevealed ? member.passcode : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setRevealedPasscodes(prev => ({ ...prev, [member.id]: !prev[member.id] }))}
                                title={isRevealed ? 'Hide passcode' : 'Show passcode'}
                                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 2, display: 'inline-flex', alignItems: 'center' }}
                              >
                                {isRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyPasscode(member.id, member.passcode)}
                                title="Copy passcode"
                                style={{ background: 'none', border: 'none', color: copiedPasscodeId === member.id ? RF_MINT_ACCENT : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 2, display: 'inline-flex', alignItems: 'center' }}
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.4)', fontSize: 11.5, fontFamily: 'monospace' }}>
                              <Lock size={11} color="rgba(255,255,255,0.3)" /> ••••••••
                            </div>
                          )}
                        </td>

                        {/* Reviews Conducted */}
                        <td style={{ padding: isMobile ? '12px 14px' : '16px 20px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#FFFFFF' }}>
                            {member.reviews_count}
                          </span>
                          <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.45)', marginLeft: 4 }}>
                            verified
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: isMobile ? '12px 14px' : '16px 20px', whiteSpace: 'nowrap' }}>
                          <span style={{
                            padding: isMobile ? '2.5px 8px' : '3px 9px', borderRadius: 100, fontSize: isMobile ? 10 : 11, fontWeight: 700,
                            background: member.status === 'ACTIVE' ? 'rgba(24, 252, 92, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: member.status === 'ACTIVE' ? RF_MINT_ACCENT : '#FCA5A5',
                            border: `1px solid ${member.status === 'ACTIVE' ? RF_LEAF_GREEN : '#EF4444'}55`,
                            display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', flexShrink: 0
                          }}>
                            <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: member.status === 'ACTIVE' ? RF_MINT_ACCENT : '#EF4444', flexShrink: 0 }} />
                            {member.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: isMobile ? '12px 14px' : '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {isSuperAdmin ? (
                              <>
                                <button
                                  onClick={() => handleOpenEditStaff(member)}
                                  title="Edit details & reset password"
                                  style={{
                                    background: 'rgba(56, 189, 248, 0.12)',
                                    border: '1px solid rgba(56, 189, 248, 0.35)',
                                    color: '#38BDF8',
                                    padding: isMobile ? '3px 8px' : '4px 11px',
                                    borderRadius: 6,
                                    fontSize: isMobile ? 10.5 : 11.5,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    transition: 'all 0.15s'
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.22)')}
                                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)')}
                                >
                                  <Edit3 size={isMobile ? 11 : 12} /> Edit
                                </button>

                                {!isRootSuperAdmin && (
                                  <button
                                    onClick={() => handleToggleStaff(member.id)}
                                    style={{
                                      background: member.status === 'ACTIVE' ? 'rgba(244, 124, 32, 0.1)' : 'rgba(24, 252, 92, 0.1)',
                                      border: `1px solid ${member.status === 'ACTIVE' ? RF_ORANGE : RF_LEAF_GREEN}44`,
                                      color: member.status === 'ACTIVE' ? '#FFB27D' : RF_MINT_ACCENT,
                                      padding: isMobile ? '3px 9px' : '4px 12px', borderRadius: 6, fontSize: isMobile ? 10.5 : 11.5, fontWeight: 600,
                                      cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4,
                                      transition: 'all 0.15s'
                                    }}
                                  >
                                    {member.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                  </button>
                                )}

                                {!isRootSuperAdmin && (
                                  <button
                                    onClick={() => handleDeleteStaff(member.id)}
                                    title="Delete worker account"
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                                      color: '#FCA5A5', width: isMobile ? 26 : 28, height: isMobile ? 26 : 28,
                                      minWidth: isMobile ? 26 : 28, maxWidth: isMobile ? 26 : 28,
                                      borderRadius: 6, cursor: 'pointer', flexShrink: 0, padding: 0,
                                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                      transition: 'all 0.15s'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                                  >
                                    <Trash2 size={isMobile ? 12 : 13} style={{ flexShrink: 0 }} />
                                  </button>
                                )}
                              </>
                            ) : (
                              <span style={{ fontSize: isMobile ? 10.5 : 11, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                <Lock size={10} /> View only
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── CERTIFICATE ISSUANCE & ACCREDITATIONS TAB ───────────────────────── */}
      {adminTab === 'certificates' && (
        <div>
          {/* Action Feedback Banner */}
          {certFeedbackMsg && (
            <div style={{
              background: 'rgba(24, 252, 92, 0.12)', border: `1px solid ${RF_LEAF_GREEN}66`,
              padding: '10px 16px', borderRadius: 10, marginBottom: 16, display: 'flex',
              alignItems: 'center', gap: 8, color: '#FFFFFF', fontSize: 13
            }}>
              <CheckCircle2 size={16} color={RF_MINT_ACCENT} />
              <span>{certFeedbackMsg}</span>
            </div>
          )}

          {/* Header with Title, "+ Issue Certificate" CTA & Refresh */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
            marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: isMobile ? 10 : 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {isMobile ? 'Certificates' : 'Pioneer Certificates & Level Accreditations'}
                </h2>
                <span style={{
                  fontSize: 10, fontWeight: 700, background: 'rgba(255, 209, 102, 0.12)',
                  color: RF_GOLD_YELLOW, border: `1px solid ${RF_GOLD_YELLOW}55`,
                  padding: '2.5px 7px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4,
                  textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap'
                }}>
                  <Award size={10} /> {certificatesList.length} Minted
                </span>
              </div>
              <p style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 780, lineHeight: 1.5 }}>
                Issue, verify, and inspect official pioneer completion certificates.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: isMobile ? '100%' : 'auto' }}>
              <button
                onClick={() => handleOpenIssueCertModal()}
                style={{
                  background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                  padding: isMobile ? '7px 12px' : '8px 18px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12.5, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  boxShadow: `0 3px 12px ${RF_LEAF_GREEN}33`, transition: 'all 0.2s',
                  flex: isMobile ? 1 : 'initial', justifyContent: 'center'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = RF_MINT_ACCENT)}
                onMouseLeave={e => (e.currentTarget.style.background = RF_LEAF_GREEN)}
              >
                <Award size={13} /> Issue Certificate
              </button>

              <button
                onClick={handleRefreshData}
                disabled={loading}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
                  color: '#FFFFFF', padding: isMobile ? '7px 12px' : '8px 18px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12.5,
                  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  flexShrink: 0
                }}
              >
                <RefreshCw size={13} className={loading ? 'rp-spin' : ''} /> {loading ? 'Syncing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Certificate KPI Metrics */}
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: isMobile ? 10 : 14, marginBottom: isMobile ? 18 : 26
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Certificates</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>{certificateStats.total}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>All minted credentials</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Level 1 Passes</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 3 }}>{certificateStats.level1}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Orientation &amp; onboarding</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Advanced Tier Awards</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_GOLD_YELLOW, marginTop: 3 }}>{certificateStats.advanced}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Level 2 through 5</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Verifiable</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#38BDF8', marginTop: 3 }}>
                {certificateStats.total - certificateStats.revoked}
              </div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Tamper-evident status</span>
            </div>
          </div>

          {/* Sovereign Credential Minting & Integrity Telemetry */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(24, 252, 92, 0.16)',
            borderRadius: isMobile ? 12 : 16,
            padding: isMobile ? '12px 14px' : '16px 20px',
            marginBottom: isMobile ? 16 : 24,
            overflow: 'hidden',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={14} />
                </div>
                <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                  {isMobile ? 'Integrity Telemetry' : 'Sovereign Credential Minting & Integrity Telemetry'}
                </span>
              </div>
              <span style={{
                fontSize: 10.5, color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)',
                padding: '2.5px 9px', borderRadius: 100, fontWeight: 600, border: '1px solid rgba(24, 252, 92, 0.2)',
                flexShrink: 0
              }}>
                Integrity: {analytics.activeCertRate}% Valid
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(3, minmax(0, 1fr))',
              gap: isMobile ? 10 : 14
            }}>
              {/* Level 1 vs Advanced Tier Minting */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: isMobile ? '10px 12px' : '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Level 1 Ratio</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: RF_MINT_ACCENT }}>
                    {analytics.totalCerts > 0 ? Math.round((analytics.level1Certs / analytics.totalCerts) * 100) : 0}%
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${analytics.totalCerts > 0 ? Math.round((analytics.level1Certs / analytics.totalCerts) * 100) : 0}%`,
                    height: '100%',
                    borderRadius: 100,
                    background: `linear-gradient(90deg, ${RF_LEAF_GREEN}, ${RF_MINT_ACCENT})`
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'rgba(255,255,255,0.45)' }}>
                  <span>{analytics.level1Certs} Level 1</span>
                  <span>{analytics.advancedCerts} Advanced</span>
                </div>
              </div>

              {/* Cryptographic Validity Status */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: isMobile ? '10px 12px' : '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                minWidth: 0,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                  Cryptographic Authenticity
                </span>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 0,
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ minWidth: 0, textAlign: 'left', paddingRight: 8 }}>
                    <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: RF_MINT_ACCENT }}>{analytics.activeCerts}</div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Active</span>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 8px', minWidth: 0, textAlign: 'left' }}>
                    <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: analytics.revokedCerts > 0 ? '#EF4444' : 'rgba(255,255,255,0.4)' }}>
                      {analytics.revokedCerts}
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Revoked</span>
                  </div>
                  <div style={{ minWidth: 0, textAlign: 'left', paddingLeft: 8 }}>
                    <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#38BDF8' }}>{analytics.totalCerts}</div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total</span>
                  </div>
                </div>
              </div>

              {/* Security Audit Badge */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: isMobile ? '10px 12px' : '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Shield size={14} color={RF_MINT_ACCENT} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FFFFFF' }}>SHA-256 Verifiable Proof</span>
                </div>
                <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>
                  Every minted certificate carries an immutable public verification URL and cryptographic checksum.
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Filter & Search Bar */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px' : '16px 20px',
            border: '1px solid rgba(255,255,255,0.08)', marginBottom: isMobile ? 16 : 24,
            display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between'
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: isMobile ? '1 1 100%' : '1 1 280px', maxWidth: isMobile ? '100%' : 420 }}>
              <Search size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by recipient, email, Pioneer ID, serial..."
                value={certSearchTerm}
                onChange={e => setCertSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: isMobile ? '8px 14px 8px 36px' : '9px 16px 9px 40px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF', fontSize: isMobile ? 12 : 12.5, outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
              {/* Level Filter */}
              <select
                value={certLevelFilter}
                onChange={e => setCertLevelFilter(e.target.value)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? '1 1 calc(50% - 4px)' : 'initial', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Tier Levels</option>
                <option value="LEVEL_1">Level 1: Pioneer Associate</option>
                <option value="LEVEL_2">Level 2: Refeir Pioneer</option>
                <option value="LEVEL_3">Level 3: Refeir Builder</option>
                <option value="LEVEL_4">Level 4: Refeir Lead</option>
                <option value="LEVEL_5">Level 5: Refeir Core Team</option>
              </select>

              {/* Status Filter */}
              <select
                value={certStatusFilter}
                onChange={e => setCertStatusFilter(e.target.value as any)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF', padding: isMobile ? '6px 32px 6px 12px' : '8px 36px 8px 14px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? '1 1 calc(50% - 4px)' : 'initial', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="ISSUED">Active (Issued)</option>
                <option value="REVOKED">Revoked</option>
              </select>
            </div>
          </div>

          {/* Certificates Table */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16, border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: 920, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Certificate Serial &amp; Hash</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Recipient Pioneer</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Certified Level</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Squad</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Verified Tasks</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Issued At</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ padding: isMobile ? '10px 14px' : '13px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12.5 }}>
                      No certificates found matching your search. Click "+ Issue Certificate" to mint one.
                    </td>
                  </tr>
                ) : (
                  filteredCertificates.map(cert => {
                    const squadInfo = Object.values(SQUAD_INFO).find(
                      s => s.name.toUpperCase().includes(cert.division.toUpperCase()) || cert.division.toUpperCase().includes(s.tag)
                    ) || SQUAD_INFO.GENERAL;

                    return (
                      <tr
                        key={cert.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Certificate Serial */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ fontFamily: 'monospace', fontSize: isMobile ? 12 : 12.5, fontWeight: 700, color: RF_GOLD_YELLOW, letterSpacing: '0.02em' }}>
                            {cert.id}
                          </div>
                          <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                            {cert.verification_hash.slice(0, 14)}...
                          </div>
                        </td>

                        {/* Recipient Pioneer */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', maxWidth: 220 }}>
                          <div style={{ fontSize: isMobile ? 12.5 : 13.5, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
                            {cert.recipient_name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                            <span style={{
                              fontFamily: 'monospace', fontSize: 10.5, fontWeight: 700, color: RF_MINT_ACCENT,
                              background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_LEAF_GREEN}44`,
                              padding: '1px 5px', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0
                            }}>
                              {cert.pioneer_id}
                            </span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {cert.recipient_email}
                            </span>
                          </div>
                        </td>

                        {/* Certified Level */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            background: 'rgba(255, 209, 102, 0.12)', color: RF_GOLD_YELLOW,
                            border: `1px solid ${RF_GOLD_YELLOW}44`, padding: '2.5px 8px',
                            borderRadius: 6, fontSize: 11, fontWeight: 700
                          }}>
                            <Award size={11} style={{ flexShrink: 0 }} />
                            <span>{cert.level_title}</span>
                          </div>
                        </td>

                        {/* Squad Division */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <span style={{
                            fontSize: 10.5, fontWeight: 700, color: squadInfo.color,
                            background: `${squadInfo.color}18`, border: `1px solid ${squadInfo.color}44`,
                            padding: '2px 7px', borderRadius: 5, letterSpacing: '0.02em'
                          }}>
                            {cert.division}
                          </span>
                        </td>

                        {/* Verified Deliverables */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: isMobile ? 12 : 12.5, fontWeight: 600, color: '#FFFFFF' }}>
                            {cert.verified_jobs_count > 0 ? `${cert.verified_jobs_count} verified jobs` : 'Orientation Pass'}
                          </div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
                            Approved deliverable quota
                          </div>
                        </td>

                        {/* Issued Date & Authority */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: '#FFFFFF' }}>
                            {new Date(cert.issued_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 1, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={cert.issued_by}>
                            {cert.issued_by}
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          {cert.status === 'ISSUED' ? (
                            <span style={{
                              padding: '2.5px 7px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                              background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                              border: `1px solid ${RF_LEAF_GREEN}55`,
                              display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0, whiteSpace: 'nowrap'
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: RF_MINT_ACCENT, display: 'inline-block' }} />
                              ACTIVE
                            </span>
                          ) : (
                            <span style={{
                              padding: '2.5px 7px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                              background: 'rgba(239, 68, 68, 0.12)', color: '#FCA5A5',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0, whiteSpace: 'nowrap'
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                              REVOKED
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: isMobile ? '12px 14px' : '14px 18px', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleViewCertificate(cert)}
                              style={{
                                background: 'rgba(255, 209, 102, 0.12)', border: `1px solid ${RF_GOLD_YELLOW}55`,
                                color: RF_GOLD_YELLOW, height: isMobile ? 28 : 30, padding: isMobile ? '0 9px' : '0 12px', borderRadius: 6, fontSize: isMobile ? 11 : 12,
                                fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                                transition: 'all 0.15s', whiteSpace: 'nowrap'
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 209, 102, 0.22)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 209, 102, 0.12)')}
                              title="Inspect & Download Credential"
                            >
                              <Eye size={12} style={{ flexShrink: 0 }} /> Inspect
                            </button>

                            {cert.status === 'ISSUED' && (
                              <button
                                onClick={() => handleRevokeCertificate(cert.id)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)',
                                  color: '#FCA5A5', height: isMobile ? 28 : 30, padding: isMobile ? '0 9px' : '0 11px', borderRadius: 6, fontSize: isMobile ? 11 : 12,
                                  fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3,
                                  transition: 'all 0.15s', whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                                title="Revoke Accreditation"
                              >
                                <Ban size={11} style={{ flexShrink: 0 }} /> Revoke
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── SQUAD TASKS & DAILY BOUNTIES MANAGEMENT TAB ─────────────────────── */}
      {adminTab === 'tasks' && (
        <div>
          {/* Action Feedback Banner */}
          {taskFeedbackMsg && (
            <div style={{
              background: 'rgba(24, 252, 92, 0.12)', border: `1px solid ${RF_LEAF_GREEN}66`,
              padding: '12px 18px', borderRadius: 12, marginBottom: 20, display: 'flex',
              alignItems: 'center', gap: 10, color: '#FFFFFF', fontSize: 13.5
            }}>
              <CheckCircle2 size={18} color={RF_MINT_ACCENT} />
              <span>{taskFeedbackMsg}</span>
            </div>
          )}

          {/* Header with Title, "+ Announce Daily/Weekly Task" CTA & Refresh */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
            marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: isMobile ? 10 : 16,
            overflow: 'hidden', width: '100%', boxSizing: 'border-box'
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px', flexWrap: 'wrap', minWidth: 0 }}>
                <h2 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#FFFFFF', margin: 0, whiteSpace: isMobile ? 'nowrap' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
                  {isMobile ? 'Squad Missions' : 'Daily Squad Tasks & Bounties Management'}
                </h2>
                <span style={{
                  fontSize: 10, fontWeight: 700, background: 'rgba(24, 252, 92, 0.12)',
                  color: RF_MINT_ACCENT, border: `1px solid ${RF_MINT_ACCENT}55`,
                  padding: '2.5px 7px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4,
                  textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap'
                }}>
                  <Radio size={10} /> {squadTaskStats.active} Active
                </span>
              </div>
              <p style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 820, lineHeight: 1.5 }}>
                Broadcast squad missions, manage bounties, and distribute tasks.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: isMobile ? '100%' : 'auto' }}>
              <button
                onClick={() => setNewTaskModalOpen(true)}
                style={{
                  background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                  padding: isMobile ? '7px 12px' : '8px 18px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12.5, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  boxShadow: `0 4px 14px ${RF_LEAF_GREEN}44`, transition: 'all 0.2s',
                  flex: isMobile ? 1 : 'initial', justifyContent: 'center'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = RF_MINT_ACCENT)}
                onMouseLeave={e => (e.currentTarget.style.background = RF_LEAF_GREEN)}
              >
                <Radio size={13} /> Announce Task
              </button>

              <button
                onClick={handleRefreshData}
                disabled={loading}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
                  color: '#FFFFFF', padding: isMobile ? '7px 12px' : '8px 18px', borderRadius: 100, fontSize: isMobile ? 11.5 : 12.5,
                  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  flexShrink: 0
                }}
              >
                <RefreshCw size={13} className={loading ? 'rp-spin' : ''} /> {loading ? 'Syncing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* KPI Metrics */}
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: isMobile ? 10 : 14, marginBottom: isMobile ? 18 : 26
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Missions</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>{squadTaskStats.active}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Across 6 squads &amp; general</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bounties</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 4 }}>{squadTaskStats.bounties}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>
                {squadTaskStats.airtime} Airtime • {squadTaskStats.data} Data • {squadTaskStats.cash} Cash
              </span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Tasks</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_GOLD_YELLOW, marginTop: 4 }}>{squadTaskStats.daily}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>24-hour fast sprints</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px 14px' : '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Announcements</span>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#38BDF8', marginTop: 4 }}>{squadTaskStats.total}</div>
              <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>Lifetime cataloged</span>
            </div>
          </div>

          {/* Bounty Pool Valuation & Mission Economics */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(24, 252, 92, 0.16)',
            borderRadius: isMobile ? 12 : 16,
            padding: isMobile ? '12px 14px' : '16px 20px',
            marginBottom: isMobile ? 18 : 26,
            overflow: 'hidden',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Zap size={14} />
                </div>
                <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                  {isMobile ? 'Bounty Economics' : 'Bounty Pool Valuation & Mission Economics'}
                </span>
              </div>
              <span style={{
                fontSize: 10.5, color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)',
                padding: '2.5px 8px', borderRadius: 100, fontWeight: 600, border: '1px solid rgba(24, 252, 92, 0.2)',
                flexShrink: 0
              }}>
                Active Pool: ₦{analytics.totalCashBountyVal.toLocaleString()} Cash Value
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(3, minmax(0, 1fr))',
              gap: isMobile ? 10 : 16
            }}>
              {/* Monetary Bounty Valuation */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: isMobile ? '10px 12px' : '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
                  Cash Bounty Reserve
                </span>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: RF_MINT_ACCENT }}>
                  ₦{analytics.totalCashBountyVal.toLocaleString()}
                </div>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', marginTop: 2, display: 'block' }}>
                  Allocated across cash challenges
                </span>
              </div>

              {/* Utility Bounties */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: isMobile ? '10px 12px' : '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                minWidth: 0,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                  Network Utility Bounties
                </span>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 0,
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ minWidth: 0, textAlign: 'left', paddingRight: 8 }}>
                    <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: RF_GOLD_YELLOW }}>{analytics.airtimeBounties}</div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Airtime</span>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 8px', minWidth: 0, textAlign: 'left' }}>
                    <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#38BDF8' }}>{analytics.dataBounties}</div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Data</span>
                  </div>
                  <div style={{ minWidth: 0, textAlign: 'left', paddingLeft: 8 }}>
                    <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#FFFFFF' }}>{analytics.activeTasksCount}</div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Active</span>
                  </div>
                </div>
              </div>

              {/* Broadcast & Reach */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 10,
                padding: isMobile ? '10px 12px' : '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <Share2 size={14} color={RF_MINT_ACCENT} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FFFFFF' }}>WhatsApp Broadcast</span>
                </div>
                <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.35 }}>
                  1-click sharing formats missions for community WhatsApp channels.
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '12px' : '16px 20px',
            border: '1px solid rgba(255,255,255,0.08)', marginBottom: isMobile ? 18 : 24, display: 'flex',
            flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, flex: isMobile ? '1 1 100%' : '1 1 240px',
              background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: isMobile ? '7px 12px' : '8px 14px'
            }}>
              <Search size={14} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={taskSearchTerm}
                onChange={e => setTaskSearchTerm(e.target.value)}
                placeholder="Search missions, rewards..."
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: '#FFFFFF', fontSize: isMobile ? 12 : 12.5, width: '100%'
                }}
              />
              {taskSearchTerm && (
                <button
                  onClick={() => setTaskSearchTerm('')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11 }}
                >
                  Clear
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
              {/* Squad Filter */}
              <select
                value={taskSquadFilter}
                onChange={e => setTaskSquadFilter(e.target.value)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF', borderRadius: 8, padding: isMobile ? '6px 30px 6px 10px' : '8px 34px 8px 12px', fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? '1 1 calc(50% - 4px)' : 'initial', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Squads &amp; Divisions</option>
                <option value="GENERAL">General Community (All)</option>
                <option value="TECHNOLOGY">Technology &amp; Protocol</option>
                <option value="CREATIVE">Brand &amp; Creative</option>
                <option value="GROWTH">Growth &amp; Virality</option>
                <option value="COMMUNITY">Community &amp; Culture</option>
                <option value="OPERATIONS">Operations &amp; Delivery</option>
                <option value="ENTERPRISE">Enterprise &amp; BD</option>
              </select>

              {/* Bounty Filter */}
              <select
                value={taskBountyFilter}
                onChange={e => setTaskBountyFilter(e.target.value)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF', borderRadius: 8, padding: isMobile ? '6px 30px 6px 10px' : '8px 34px 8px 12px', fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? '1 1 calc(50% - 4px)' : 'initial', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Bounty Types</option>
                <option value="AIRTIME_GIVEAWAY">Airtime Giveaways</option>
                <option value="DATA_SUBSCRIPTION">Data Subscriptions</option>
                <option value="MONETARY_CASH">Monetary Cash Bounties</option>
                <option value="SOVEREIGN_XP">Sovereign XP Only</option>
              </select>

              {/* Frequency Filter */}
              <select
                value={taskFrequencyFilter}
                onChange={e => setTaskFrequencyFilter(e.target.value)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF', borderRadius: 8, padding: isMobile ? '6px 30px 6px 10px' : '8px 34px 8px 12px', fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? '1 1 calc(50% - 4px)' : 'initial', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Cycles</option>
                <option value="DAILY">Daily Tasks</option>
                <option value="WEEKLY">Weekly Tasks</option>
                <option value="FLASH_BOUNTY">Flash Bounties</option>
              </select>

              {/* Status Filter */}
              <select
                value={taskStatusFilter}
                onChange={e => setTaskStatusFilter(e.target.value as any)}
                style={{
                  background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF', borderRadius: 8, padding: isMobile ? '6px 30px 6px 10px' : '8px 34px 8px 12px', fontSize: isMobile ? 11.5 : 12, outline: 'none',
                  flex: isMobile ? '1 1 calc(50% - 4px)' : 'initial', cursor: 'pointer'
                }}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          {/* Tasks List — card stack on mobile, table on desktop */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 16,
            border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
            width: '100%', maxWidth: '100%', boxSizing: 'border-box'
          }}>
            {isMobile ? (
              /* ─── MOBILE CARD STACK ─── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {filteredSquadTasks.length === 0 ? (
                  <div style={{ padding: '36px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                    No tasks found. Tap &ldquo;Announce Task&rdquo; to create one.
                  </div>
                ) : (
                  filteredSquadTasks.map((task, idx) => {
                    const squadInfo = SQUAD_INFO[task.squad] || SQUAD_INFO.GENERAL;
                    const isCopied = copiedTaskBroadcastId === task.id;
                    const formattedDeadline = formatTaskDeadline(task.deadline);
                    const getBountyLabel = () => {
                      if (task.bounty_type === 'AIRTIME') return { label: task.bounty_reward || 'Airtime', color: RF_GOLD_YELLOW, bg: 'rgba(255,209,102,0.12)', border: `1px solid ${RF_GOLD_YELLOW}55` };
                      if (task.bounty_type === 'DATA') return { label: task.bounty_reward || 'Data', color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.4)' };
                      if (task.bounty_type === 'CASH') return { label: task.bounty_reward || 'Cash Bounty', color: RF_MINT_ACCENT, bg: 'rgba(24,252,92,0.12)', border: `1px solid ${RF_MINT_ACCENT}55` };
                      return { label: task.bounty_reward || 'Deliverable XP', color: '#C084FC', bg: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)' };
                    };
                    const bounty = getBountyLabel();
                    return (
                      <div
                        key={task.id}
                        style={{
                          padding: '12px 14px',
                          borderBottom: idx < filteredSquadTasks.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                          width: '100%', boxSizing: 'border-box', overflow: 'hidden'
                        }}
                      >
                        {/* Row 1: Squad badge + cycle pill + status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6, width: '100%' }}>
                          <span style={{
                            background: `${squadInfo.color}18`, color: squadInfo.color,
                            border: `1px solid ${squadInfo.color}44`, padding: '2px 7px',
                            borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.03em',
                            whiteSpace: 'nowrap', flexShrink: 0
                          }}>
                            {squadInfo.name}
                          </span>
                          <span style={{
                            background: task.frequency === 'DAILY' ? 'rgba(255,209,102,0.12)' : task.frequency === 'WEEKLY' ? 'rgba(56,189,248,0.12)' : 'rgba(167,139,250,0.12)',
                            color: task.frequency === 'DAILY' ? RF_GOLD_YELLOW : task.frequency === 'WEEKLY' ? '#38BDF8' : '#C084FC',
                            border: `1px solid ${task.frequency === 'DAILY' ? RF_GOLD_YELLOW + '44' : task.frequency === 'WEEKLY' ? '#38BDF844' : '#C084FC44'}`,
                            padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                            whiteSpace: 'nowrap', flexShrink: 0
                          }}>
                            {task.frequency.replace('_', ' ')}
                          </span>
                          <span style={{
                            marginLeft: 'auto', flexShrink: 0,
                            background: task.status === 'ACTIVE' ? 'rgba(24,252,92,0.12)' : 'rgba(255,255,255,0.06)',
                            color: task.status === 'ACTIVE' ? RF_MINT_ACCENT : 'rgba(255,255,255,0.45)',
                            border: `1px solid ${task.status === 'ACTIVE' ? RF_MINT_ACCENT + '55' : 'rgba(255,255,255,0.15)'}`,
                            padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                            cursor: 'pointer', whiteSpace: 'nowrap'
                          }}
                            onClick={() => handleToggleTaskStatus(task.id)}
                          >
                            {task.status}
                          </span>
                        </div>

                        {/* Row 2: Title */}
                        <div style={{
                          fontWeight: 700, color: '#FFFFFF', fontSize: 13, lineHeight: 1.35,
                          marginBottom: 4, width: '100%', wordBreak: 'break-word', overflow: 'hidden'
                        }}>
                          {task.title}
                        </div>

                        {/* Row 3: Category + deadline */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                          <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{task.category}</span>
                          {formattedDeadline && (
                            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Clock size={10} style={{ flexShrink: 0 }} /> {formattedDeadline}
                            </span>
                          )}
                        </div>

                        {/* Row 4: Bounty pill */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: bounty.bg, color: bounty.color, border: bounty.border,
                          padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                          marginBottom: 10, maxWidth: '100%', overflow: 'hidden'
                        }}>
                          <Award size={11} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {bounty.label}
                          </span>
                        </div>

                        {/* Row 5: Actions */}
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button
                            onClick={() => openWhatsAppShare(task)}
                            style={{
                              background: '#25D366', color: '#FFFFFF', border: 'none',
                              height: 28, padding: '0 10px', borderRadius: 6, fontSize: 11,
                              fontWeight: 600, cursor: 'pointer', display: 'inline-flex',
                              alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(37,211,102,0.25)', whiteSpace: 'nowrap'
                            }}
                          >
                            <MessageSquare size={12} style={{ flexShrink: 0 }} /> Broadcast
                          </button>
                          <button
                            onClick={() => handleCopyBroadcast(task)}
                            style={{
                              background: isCopied ? 'rgba(24,252,92,0.15)' : 'rgba(255,255,255,0.07)',
                              border: `1px solid ${isCopied ? RF_MINT_ACCENT + '66' : 'rgba(255,255,255,0.15)'}`,
                              color: isCopied ? RF_MINT_ACCENT : '#FFFFFF',
                              height: 28, padding: '0 10px', borderRadius: 6, fontSize: 11,
                              fontWeight: 500, cursor: 'pointer', display: 'inline-flex',
                              alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {isCopied ? <CheckCircle2 size={12} style={{ flexShrink: 0 }} /> : <Copy size={12} style={{ flexShrink: 0 }} />}
                            {isCopied ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id, task.title)}
                            style={{
                              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                              color: '#FCA5A5', width: 28, height: 28, borderRadius: 6,
                              cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                              justifyContent: 'center', flexShrink: 0
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* ─── DESKTOP TABLE ─── */
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: 880, borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Target Squad &amp; Mission</th>
                    <th style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Cycle &amp; Deadline</th>
                    <th style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Special Bounty Incentive</th>
                    <th style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', whiteSpace: 'nowrap' }}>Broadcast &amp; Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSquadTasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '36px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                        No tasks found matching current filters. Click &ldquo;+ Announce Task&rdquo; to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredSquadTasks.map(task => {
                      const squadInfo = SQUAD_INFO[task.squad] || SQUAD_INFO.GENERAL;
                      const isCopied = copiedTaskBroadcastId === task.id;
                      const formattedDeadline = formatTaskDeadline(task.deadline);

                      const getBountyPill = () => {
                        let icon = <Award size={12} style={{ flexShrink: 0 }} />;
                        let bg = 'rgba(167, 139, 250, 0.12)';
                        let color = '#C084FC';
                        let border = '1px solid rgba(167, 139, 250, 0.3)';
                        let label = task.bounty_reward || 'Deliverable XP';

                        if (task.bounty_type === 'AIRTIME') {
                          icon = <Gift size={12} style={{ flexShrink: 0 }} />;
                          bg = 'rgba(255, 209, 102, 0.12)';
                          color = RF_GOLD_YELLOW;
                          border = `1px solid ${RF_GOLD_YELLOW}55`;
                          label = task.bounty_reward || 'Airtime Giveaway';
                        } else if (task.bounty_type === 'DATA') {
                          icon = <Zap size={12} style={{ flexShrink: 0 }} />;
                          bg = 'rgba(56, 189, 248, 0.12)';
                          color = '#38BDF8';
                          border = '1px solid rgba(56, 189, 248, 0.4)';
                          label = task.bounty_reward || 'Data Subscription';
                        } else if (task.bounty_type === 'CASH') {
                          icon = <DollarSign size={12} style={{ flexShrink: 0 }} />;
                          bg = 'rgba(24, 252, 92, 0.12)';
                          color = RF_MINT_ACCENT;
                          border = `1px solid ${RF_MINT_ACCENT}55`;
                          label = task.bounty_reward || 'Cash Bounty';
                        }

                        return (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            background: bg,
                            color,
                            border,
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            maxWidth: '100%'
                          }}>
                            {icon}
                            <span style={{ wordBreak: 'break-word' }}>{label}</span>
                          </div>
                        );
                      };

                      return (
                        <tr
                          key={task.id}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          {/* Squad & Mission */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle', maxWidth: 320 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <span style={{
                                background: `${squadInfo.color}18`, color: squadInfo.color,
                                border: `1px solid ${squadInfo.color}44`, padding: '2px 7px',
                                borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.03em'
                              }}>
                                {squadInfo.name}
                              </span>
                              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>• {task.category}</span>
                            </div>
                            <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 13, lineHeight: 1.35 }}>
                              {task.title}
                            </div>
                            <div style={{
                              fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 2, lineHeight: 1.4,
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                            }}>
                              {task.description}
                            </div>
                          </td>

                          {/* Frequency & Deadline */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                            <span style={{
                              background: task.frequency === 'DAILY' ? 'rgba(255, 209, 102, 0.12)' : task.frequency === 'WEEKLY' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(167, 139, 250, 0.12)',
                              color: task.frequency === 'DAILY' ? RF_GOLD_YELLOW : task.frequency === 'WEEKLY' ? '#38BDF8' : '#C084FC',
                              border: `1px solid ${task.frequency === 'DAILY' ? RF_GOLD_YELLOW + '44' : task.frequency === 'WEEKLY' ? '#38BDF844' : '#C084FC44'}`,
                              padding: '2.5px 7px', borderRadius: 4, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em'
                            }}>
                              {task.frequency.replace('_', ' ')}
                            </span>
                            {formattedDeadline && (
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={11} style={{ flexShrink: 0, opacity: 0.7 }} />
                                <span>{formattedDeadline}</span>
                              </div>
                            )}
                          </td>

                          {/* Bounty & Value */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle', minWidth: 160 }}>
                            <div style={{ marginBottom: 2 }}>
                              {getBountyPill()}
                            </div>
                            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                              <span>{task.bounty_slots || 'Verified Submissions'}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                            <button
                              onClick={() => handleToggleTaskStatus(task.id)}
                              style={{
                                background: task.status === 'ACTIVE' ? 'rgba(24, 252, 92, 0.12)' : 'rgba(255,255,255,0.06)',
                                color: task.status === 'ACTIVE' ? RF_MINT_ACCENT : 'rgba(255,255,255,0.45)',
                                border: `1px solid ${task.status === 'ACTIVE' ? RF_MINT_ACCENT + '55' : 'rgba(255,255,255,0.15)'}`,
                                padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                                transition: 'all 0.15s', whiteSpace: 'nowrap'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = task.status === 'ACTIVE' ? 'rgba(24, 252, 92, 0.2)' : 'rgba(255,255,255,0.12)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = task.status === 'ACTIVE' ? 'rgba(24, 252, 92, 0.12)' : 'rgba(255,255,255,0.06)'; }}
                              title="Click to toggle Active / Archived"
                            >
                              <span style={{
                                width: 5, height: 5, borderRadius: '50%',
                                background: task.status === 'ACTIVE' ? RF_MINT_ACCENT : 'rgba(255,255,255,0.4)',
                                display: 'inline-block'
                              }} />
                              {task.status}
                            </button>
                          </td>

                          {/* Broadcast & Actions */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => openWhatsAppShare(task)}
                                style={{
                                  background: '#25D366', color: '#FFFFFF', border: 'none',
                                  height: 28, padding: '0 10px', borderRadius: 6, fontSize: 11,
                                  fontWeight: 600, cursor: 'pointer', display: 'inline-flex',
                                  alignItems: 'center', gap: 4, boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
                                  transition: 'all 0.15s', whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                                onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                                title="Broadcast task directly to WhatsApp group"
                              >
                                <MessageSquare size={12} style={{ flexShrink: 0 }} /> Broadcast
                              </button>
                              <button
                                onClick={() => handleCopyBroadcast(task)}
                                style={{
                                  background: isCopied ? 'rgba(24, 252, 92, 0.15)' : 'rgba(255,255,255,0.06)',
                                  border: `1px solid ${isCopied ? RF_MINT_ACCENT + '66' : 'rgba(255,255,255,0.15)'}`,
                                  color: isCopied ? RF_MINT_ACCENT : '#FFFFFF',
                                  height: 28, padding: '0 10px', borderRadius: 6, fontSize: 11,
                                  fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                                  transition: 'all 0.15s', whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={e => { if (!isCopied) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                                onMouseLeave={e => { if (!isCopied) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                title="Copy preformatted announcement text"
                              >
                                {isCopied ? <CheckCircle2 size={12} style={{ flexShrink: 0 }} /> : <Copy size={12} style={{ flexShrink: 0 }} />}
                                {isCopied ? 'Copied' : 'Copy'}
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id, task.title)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)',
                                  color: '#FCA5A5', width: 28, height: 28, borderRadius: 6,
                                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.15s', flexShrink: 0
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                                title="Delete task"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      )}

      {/* ─── ANALYTICS DASHBOARD TAB ─────────────────────────────────────── */}
      {adminTab === 'analytics' && (() => {
        // ── Minimalist SVG Curve Line Chart ──────────────────────────
        const LineChart = ({
          data,
          color,
          height = 135,
          id
        }: {
          data: { label: string; value: number }[];
          color: string;
          height?: number;
          id: string;
        }) => {
          const w = 500;
          const padX = 28;
          const padY = 22;
          const innerW = w - padX * 2;
          const innerH = height - padY * 2;
          const vals = data.map(d => d.value);
          const maxVal = Math.max(...vals, 1);
          const minVal = 0;
          const range = maxVal - minVal || 1;

          const pts = data.map((d, i) => {
            const x = padX + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2);
            const y = padY + innerH - ((d.value - minVal) / range) * innerH;
            return { x, y, value: d.value, label: d.label };
          });

          let lineD = '';
          if (pts.length > 0) {
            lineD = `M ${pts[0].x} ${pts[0].y}`;
            for (let i = 0; i < pts.length - 1; i++) {
              const p0 = pts[i];
              const p1 = pts[i + 1];
              const cpX = (p0.x + p1.x) / 2;
              lineD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
            }
          }

          const baseY = height - padY + 6;
          const areaD = pts.length > 0
            ? `${lineD} L ${pts[pts.length - 1].x} ${baseY} L ${pts[0].x} ${baseY} Z`
            : '';

          const gradId = `anlGrad_${id}`;

          return (
            <div style={{ width: '100%', overflow: 'hidden' }}>
              <svg
                width="100%"
                viewBox={`0 0 ${w} ${height + 22}`}
                style={{ display: 'block', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle horizontal guidelines */}
                {[0.25, 0.5, 0.75].map((ratio, idx) => (
                  <line
                    key={idx}
                    x1={padX}
                    y1={padY + innerH * ratio}
                    x2={w - padX}
                    y2={padY + innerH * ratio}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="3 3"
                  />
                ))}

                {/* Baseline */}
                <line
                  x1={padX}
                  y1={baseY}
                  x2={w - padX}
                  y2={baseY}
                  stroke="rgba(255, 255, 255, 0.08)"
                />

                {/* Soft glow area */}
                {areaD && <path d={areaD} fill={`url(#${gradId})`} />}

                {/* Smooth curve line */}
                {lineD && (
                  <path
                    d={lineD}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Datapoints & labels */}
                {pts.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#07180F"
                      stroke={color}
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {pt.value}
                    </text>
                    <text
                      x={pt.x}
                      y={baseY + 15}
                      fill="rgba(255, 255, 255, 0.4)"
                      fontSize="10"
                      fontWeight="500"
                      textAnchor="middle"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          );
        };

        // ── Minimalist Progress Bar Track ────────────────────────────
        const ProgressTrack = ({
          pct,
          color = RF_MINT_ACCENT
        }: {
          pct: number;
          color?: string;
        }) => (
          <div style={{
            width: '100%',
            height: 5,
            borderRadius: 100,
            background: 'rgba(255, 255, 255, 0.07)',
            overflow: 'hidden',
            marginTop: 6
          }}>
            <div style={{
              width: `${Math.min(100, Math.max(0, pct))}%`,
              height: '100%',
              borderRadius: 100,
              background: color,
              transition: 'width 0.5s ease'
            }} />
          </div>
        );

        // ── 7-Day Activity Aggregation ───────────────────────────────
        const nowMs = Date.now();
        const DAY_MS = 86_400_000;
        const days7 = Array.from({ length: 7 }, (_, idx) => {
          const dayStart = nowMs - (6 - idx) * DAY_MS;
          const dayEnd = dayStart + DAY_MS;
          const label = new Date(dayStart).toLocaleDateString('en-US', { weekday: 'short' });
          const appCount = applications.filter(a => {
            const t = new Date(a.created_at).getTime();
            return t >= dayStart && t < dayEnd;
          }).length;
          const proofCount = taskSubmissions.filter(s => {
            const t = new Date(s.created_at).getTime();
            return t >= dayStart && t < dayEnd;
          }).length;
          return { label, appCount, proofCount };
        });

        // ── Card Style Tokens Matching All Other Admin Tabs ──────────
        const cardStyle: React.CSSProperties = {
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: isMobile ? 12 : 16,
          padding: isMobile ? '12px 14px' : '16px 20px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        };

        const cardHeaderStyle: React.CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          flexWrap: 'wrap',
          gap: 8
        };

        return (
          <div style={{ paddingBottom: 32 }}>
            {/* ── Section Header ───────────────────────────────────── */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              marginBottom: isMobile ? 16 : 24,
              flexWrap: 'wrap',
              gap: isMobile ? 10 : 14
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    {isMobile ? 'Platform Analytics' : 'Platform Analytics & Intelligence'}
                  </h2>
                  <span style={{
                    fontSize: 10, fontWeight: 700, background: 'rgba(24, 252, 92, 0.12)',
                    color: RF_MINT_ACCENT, border: `1px solid ${RF_MINT_ACCENT}55`,
                    padding: '2.5px 7px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4,
                    textTransform: 'uppercase'
                  }}>
                    <Activity size={10} /> Real-Time Telemetry
                  </span>
                </div>
                <p style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 820, lineHeight: 1.5 }}>
                  Track admissions conversion, task velocity, contributor tiers, and bounties.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: isMobile ? '100%' : 'auto' }}>
                <button
                  onClick={handleRefreshData}
                  disabled={loading}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#FFFFFF',
                    padding: isMobile ? '7px 12px' : '8px 18px',
                    borderRadius: 100,
                    fontSize: isMobile ? 11.5 : 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    flex: isMobile ? 1 : 'initial',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <RefreshCw size={13} className={loading ? 'rp-spin' : ''} /> {loading ? 'Syncing...' : 'Refresh Data'}
                </button>
              </div>
            </div>

            {/* ── KPI Metrics Bar (Exact standard matching Applications/Missions) ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: isMobile ? 10 : 14,
              marginBottom: isMobile ? 18 : 26
            }}>
              <div style={cardStyle}>
                <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Total Applicants
                </span>
                <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
                  {analytics.totalApps}
                </div>
                <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: RF_MINT_ACCENT }}>
                  {analytics.acceptanceRate}% acceptance rate
                </span>
              </div>

              <div style={cardStyle}>
                <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Deliverable Proofs
                </span>
                <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 4 }}>
                  {analytics.totalProofs}
                </div>
                <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>
                  {analytics.verificationRate}% verified rate
                </span>
              </div>

              <div style={cardStyle}>
                <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Pioneer Community
                </span>
                <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
                  {analytics.totalMembers}
                </div>
                <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: RF_GOLD_YELLOW }}>
                  {analytics.activeMembers} active ({analytics.activeRate}%)
                </span>
              </div>

              <div style={cardStyle}>
                <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Active Bounty Pool
                </span>
                <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: RF_GOLD_YELLOW, marginTop: 4 }}>
                  ₦{analytics.totalCashBountyVal.toLocaleString()}
                </div>
                <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.5)' }}>
                  Across {analytics.activeTasksCount} missions
                </span>
              </div>
            </div>

            {/* ── Visual Line Charts Row ────────────────────────────── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 10 : 16,
              marginBottom: isMobile ? 18 : 26
            }}>
              {/* Applications Velocity Line Chart */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <TrendingUp size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                        Admissions Trajectory
                      </div>
                      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)' }}>
                        Applications over last 7 days
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10.5, color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)',
                    padding: '2.5px 8px', borderRadius: 100, fontWeight: 600, border: '1px solid rgba(24, 252, 92, 0.2)'
                  }}>
                    {analytics.totalApps} Total
                  </span>
                </div>
                <div style={{ padding: '6px 0 2px' }}>
                  <LineChart
                    data={days7.map(d => ({ label: d.label, value: d.appCount }))}
                    color={RF_MINT_ACCENT}
                    id="apps"
                  />
                </div>
              </div>

              {/* Task Proofs Throughput Line Chart */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: 'rgba(246, 178, 26, 0.12)', color: RF_GOLD_YELLOW,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Activity size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                        Deliverable Flow
                      </div>
                      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)' }}>
                        Proofs verified over last 7 days
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10.5, color: RF_GOLD_YELLOW, background: 'rgba(246, 178, 26, 0.1)',
                    padding: '2.5px 8px', borderRadius: 100, fontWeight: 600, border: '1px solid rgba(246, 178, 26, 0.2)'
                  }}>
                    {analytics.totalProofs} Proofs
                  </span>
                </div>
                <div style={{ padding: '6px 0 2px' }}>
                  <LineChart
                    data={days7.map(d => ({ label: d.label, value: d.proofCount }))}
                    color={RF_GOLD_YELLOW}
                    id="proofs"
                  />
                </div>
              </div>
            </div>

            {/* ── Conversion Funnels & Throughput Breakdown ─────────── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 10 : 16,
              marginBottom: isMobile ? 18 : 26
            }}>
              {/* Admissions Funnel */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <UserCheck size={14} />
                    </div>
                    <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                      Admissions Pipeline Funnel
                    </span>
                  </div>
                  <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                    {analytics.totalApps} Candidates
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Accepted Pioneers', count: analytics.acceptedApps, color: RF_MINT_ACCENT },
                    { label: 'Under Review', count: analytics.reviewingApps, color: 'rgba(255, 255, 255, 0.7)' },
                    { label: 'Pending Decisions', count: analytics.pendingApps, color: RF_GOLD_YELLOW },
                    { label: 'Waitlisted', count: analytics.waitlistedApps, color: 'rgba(255, 255, 255, 0.4)' },
                    { label: 'Rejected', count: analytics.rejectedApps, color: 'rgba(239, 68, 68, 0.85)' }
                  ].map(item => {
                    const pct = analytics.totalApps > 0 ? Math.round((item.count / analytics.totalApps) * 100) : 0;
                    return (
                      <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{pct}%</span>
                            <span style={{ fontWeight: 700, color: '#FFFFFF', minWidth: 24, textAlign: 'right', fontSize: 12 }}>
                              {item.count}
                            </span>
                          </div>
                        </div>
                        <ProgressTrack pct={pct} color={item.color} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deliverables & Credential Verification */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FileCheck size={14} />
                    </div>
                    <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                      Deliverable &amp; Credential Flow
                    </span>
                  </div>
                  <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                    {analytics.totalProofs} Proofs
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Verified Proofs', count: analytics.verifiedProofs, total: analytics.totalProofs, color: RF_MINT_ACCENT },
                    { label: 'Pending Review', count: analytics.pendingProofs, total: analytics.totalProofs, color: RF_GOLD_YELLOW },
                    { label: 'Needs Revision', count: analytics.revisionProofs, total: analytics.totalProofs, color: RF_ORANGE },
                    { label: 'Active Credentials', count: analytics.activeCerts, total: analytics.totalCerts, color: RF_MINT_ACCENT },
                    { label: 'Revoked Credentials', count: analytics.revokedCerts, total: analytics.totalCerts, color: 'rgba(239, 68, 68, 0.85)' }
                  ].map(item => {
                    const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
                    return (
                      <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{pct}%</span>
                            <span style={{ fontWeight: 700, color: '#FFFFFF', minWidth: 24, textAlign: 'right', fontSize: 12 }}>
                              {item.count}
                            </span>
                          </div>
                        </div>
                        <ProgressTrack pct={pct} color={item.color} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Community Progression & Bounty Economics ──────────── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 10 : 16,
              marginBottom: isMobile ? 18 : 26
            }}>
              {/* Pioneer Tier Ladder */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Users size={14} />
                    </div>
                    <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                      Pioneer Tier Ladder
                    </span>
                  </div>
                  <span style={{ fontSize: 10.5, color: RF_MINT_ACCENT, fontWeight: 600 }}>
                    {analytics.totalMembers} Members
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Level 1 — Contributor', count: analytics.levelCounts.LEVEL_1 },
                    { label: 'Level 2 — Pioneer', count: analytics.levelCounts.LEVEL_2 },
                    { label: 'Level 3 — Builder', count: analytics.levelCounts.LEVEL_3 },
                    { label: 'Level 4 — Lead', count: analytics.levelCounts.LEVEL_4 },
                    { label: 'Level 5 — Core Team', count: analytics.levelCounts.LEVEL_5 }
                  ].map(item => {
                    const pct = analytics.totalMembers > 0 ? Math.round((item.count / analytics.totalMembers) * 100) : 0;
                    return (
                      <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{pct}%</span>
                            <span style={{ fontWeight: 700, color: '#FFFFFF', minWidth: 24, textAlign: 'right', fontSize: 12 }}>
                              {item.count}
                            </span>
                          </div>
                        </div>
                        <ProgressTrack pct={pct} color={RF_MINT_ACCENT} />
                      </div>
                    );
                  })}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 8,
                    marginTop: 2,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.45)'
                  }}>
                    <span>Active Contributors</span>
                    <span style={{ color: RF_MINT_ACCENT, fontWeight: 600 }}>
                      {analytics.activeMembers} of {analytics.totalMembers} active
                    </span>
                  </div>
                </div>
              </div>

              {/* Founding 100 Quota & Mission Bounty Economics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 16 }}>
                {/* Founding 100 Seats Quota */}
                <div style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: 'rgba(246, 178, 26, 0.12)', color: RF_GOLD_YELLOW,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Award size={14} />
                      </div>
                      <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                        Founding 100 Capacity
                      </span>
                    </div>
                    <span style={{
                      fontSize: 10.5, color: RF_GOLD_YELLOW, background: 'rgba(246, 178, 26, 0.1)',
                      padding: '2px 7px', borderRadius: 100, fontWeight: 600, border: '1px solid rgba(246, 178, 26, 0.2)'
                    }}>
                      {analytics.foundingCapPct}% Filled
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Seats Allocated</span>
                    <span style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: RF_GOLD_YELLOW }}>
                      {analytics.foundingApps} <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.35)' }}>/ 100</span>
                    </span>
                  </div>

                  <div style={{
                    width: '100%', height: 5, borderRadius: 100,
                    background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${analytics.foundingCapPct}%`, height: '100%', borderRadius: 100,
                      background: `linear-gradient(90deg, ${RF_GOLD_YELLOW}, ${RF_ORANGE})`,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>
                    <span>0 Reserved</span>
                    <span>100 Maximum Cohort Limit</span>
                  </div>
                </div>

                {/* Active Bounty Pool Breakdown */}
                <div style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <DollarSign size={14} />
                      </div>
                      <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                        Mission Bounty Valuation
                      </span>
                    </div>
                    <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                      {analytics.activeTasksCount} Active
                    </span>
                  </div>

                  <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                    ₦{analytics.totalCashBountyVal.toLocaleString()}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                    Active escrow-ready reward pool
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginTop: 10 }}>
                    {[
                      { label: 'Cash', value: analytics.totalCashBountyVal > 0 ? `₦${(analytics.totalCashBountyVal / 1000).toFixed(0)}k` : '—', color: RF_MINT_ACCENT },
                      { label: 'Airtime', value: `${analytics.airtimeBounties} tasks`, color: RF_GOLD_YELLOW },
                      { label: 'Data', value: `${analytics.dataBounties} tasks`, color: 'rgba(255,255,255,0.7)' }
                    ].map(b => (
                      <div key={b.label} style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: 8,
                        padding: '8px 6px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: b.color }}>{b.value}</div>
                        <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {b.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Review Team Composition Overview ──────────────────── */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: 'rgba(24, 252, 92, 0.12)', color: RF_MINT_ACCENT,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Briefcase size={14} />
                  </div>
                  <span style={{ fontSize: isMobile ? 13 : 14.5, fontWeight: 700, color: '#FFFFFF' }}>
                    Staff Registry Breakdown
                  </span>
                </div>
                <span style={{ fontSize: 10.5, color: RF_MINT_ACCENT, fontWeight: 600 }}>
                  {staffList.length} Active Staff
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: isMobile ? 8 : 12
              }}>
                {([
                  { role: 'SUPER_ADMIN', label: 'Super Admin', color: RF_GOLD_YELLOW },
                  { role: 'ADMISSIONS_REVIEWER', label: 'Admissions Reviewer', color: RF_MINT_ACCENT },
                  { role: 'TASK_VERIFIER', label: 'Task Verifier', color: '#FFFFFF' },
                  { role: 'SQUAD_LEAD', label: 'Squad Lead', color: '#FFFFFF' }
                ] as const).map(({ role, label, color }) => {
                  const total = staffList.filter(s => s.role === role).length;
                  const active = staffList.filter(s => s.role === role && s.status === 'ACTIVE').length;
                  return (
                    <div key={role} style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 10,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      padding: isMobile ? '10px 12px' : '12px 14px'
                    }}>
                      <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>
                        {total}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                        {label}
                      </div>
                      <div style={{
                        fontSize: 10,
                        color: active === total && total > 0 ? RF_MINT_ACCENT : 'rgba(255,255,255,0.35)',
                        marginTop: 4
                      }}>
                        {total > 0 ? `${active}/${total} active` : '0 assigned'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
      </div>




      {/* ─── DETAILED APPLICANT REVIEW MODAL ────────────────────────────────────── */}
      {modalOpen && activeApp && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5, 18, 11, 0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '12px 10px calc(16px + env(safe-area-inset-bottom, 16px))' : 20
        }} onClick={() => setModalOpen(false)}>
          <div style={{
            background: 'linear-gradient(145deg, #0B2416 0%, #061A0F 100%)',
            border: '1px solid rgba(102, 187, 42, 0.35)',
            borderRadius: isMobile ? 18 : 24, maxWidth: 680, width: '100%',
            maxHeight: isMobile ? 'calc(100dvh - 28px - env(safe-area-inset-bottom, 16px))' : '90vh',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)', position: 'relative',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: isMobile ? '16px 18px' : '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 11.5, fontWeight: 700, fontFamily: 'monospace', color: RF_MINT_ACCENT,
                    background: 'rgba(24, 252, 92, 0.1)', padding: '2px 8px', borderRadius: 6,
                    border: `1px solid ${RF_LEAF_GREEN}44`, whiteSpace: 'nowrap'
                  }}>
                    {activeApp.application_number}
                  </span>
                  {renderStatusBadge(editStatus)}
                </div>
                <h3 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {activeApp.full_name}
                </h3>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)',
                  width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="rp-sleek-scroll" style={{
              flex: 1,
              minHeight: 0,
              padding: isMobile ? '16px 14px' : '24px 28px',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              {/* Quick Contact Bar */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px 18px',
                border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexWrap: 'wrap', gap: 14,
                alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                  📍 {activeApp.city ? `${activeApp.city}, ` : ''}{activeApp.country} • ⏱️ {activeApp.availability || 'Not specified'}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={`https://wa.me/${activeApp.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${activeApp.full_name}, this is the Refeir Admissions Team regarding your application (${activeApp.application_number}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#25D366', color: '#FFFFFF', padding: '6px 12px',
                      borderRadius: 100, fontSize: 12, fontWeight: 600, textDecoration: 'none',
                      display: 'inline-flex', alignItems: 'center', gap: 4
                    }}
                  >
                    <MessageSquare size={13} /> WhatsApp
                  </a>

                  <a
                    href={`mailto:${activeApp.email}`}
                    style={{
                      background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', padding: '6px 12px',
                      borderRadius: 100, fontSize: 12, fontWeight: 500, textDecoration: 'none',
                      display: 'inline-flex', alignItems: 'center', gap: 4
                    }}
                  >
                    <Mail size={13} /> Email
                  </a>
                </div>
              </div>

              {/* Roles & Portfolio */}
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Target Roles & Skills</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {(activeApp.roles || []).map(r => (
                    <span key={r} style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 100, fontSize: 12 }}>
                      {r}
                    </span>
                  ))}
                </div>
                {activeApp.skills && (
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 8, lineHeight: 1.5 }}>
                    <strong>Tools:</strong> {activeApp.skills}
                  </p>
                )}
                {activeApp.portfolio_url && (
                  <div style={{ marginTop: 8 }}>
                    <a
                      href={activeApp.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: RF_MINT_ACCENT, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      View Portfolio / GitHub <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* Motivation & Contribution */}
              {activeApp.motivation && (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Candidate Motivation</span>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '6px 0 0' }}>
                    "{activeApp.motivation}"
                  </p>
                </div>
              )}

              {/* Admissions Decision Panel */}
              <div style={{
                background: 'rgba(102, 187, 42, 0.08)', padding: '18px 20px', borderRadius: 14,
                border: '1px solid rgba(102, 187, 42, 0.25)', display: 'flex', flexDirection: 'column', gap: 14
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: RF_MINT_ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Admissions Decision & Seat Assignment
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                      Review Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value as ReviewStatus)}
                      style={{
                        width: '100%', padding: '10px 40px 10px 14px', borderRadius: 10,
                        background: '#07180F', border: '1px solid rgba(255,255,255,0.2)',
                        color: '#FFFFFF', fontSize: 13, outline: 'none', cursor: 'pointer'
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWING">REVIEWING</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="WAITLISTED">WAITLISTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                      Contributor Ladder Rank
                    </label>
                    <select
                      value={editContributorLevel}
                      onChange={e => setEditContributorLevel(e.target.value as ContributorTier)}
                      style={{
                        width: '100%', padding: '10px 40px 10px 14px', borderRadius: 10,
                        background: '#07180F', border: '1px solid rgba(255,255,255,0.2)',
                        color: RF_MINT_ACCENT, fontSize: 13, outline: 'none', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      <option value="LEVEL_1">Level 1: Refeir Member (Starting • 0 jobs)</option>
                      <option value="LEVEL_2">Level 2: Refeir Pioneer (15+ verified jobs required)</option>
                      <option value="LEVEL_3">Level 3: Refeir Builder (40+ verified jobs required)</option>
                      <option value="LEVEL_4">Level 4: Refeir Lead (75+ verified jobs required)</option>
                      <option value="LEVEL_5">Level 5: Refeir Core Team (125+ verified jobs required)</option>
                    </select>

                    <div style={{ marginTop: 6, fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>
                      Verified Jobs Completed: <strong style={{ color: RF_MINT_ACCENT }}>{getVerifiedJobsCount(activeApp.email)}</strong>
                    </div>

                    {getVerifiedJobsCount(activeApp.email) < (MIN_JOBS_FOR_PROMOTION[editContributorLevel] || 0) && (
                      <div style={{
                        marginTop: 6, padding: '6px 10px', borderRadius: 6,
                        background: 'rgba(244, 124, 32, 0.12)', border: '1px solid rgba(244, 124, 32, 0.35)',
                        color: '#FFB27D', fontSize: 11
                      }}>
                        ⚠️ Notice: Candidate has {getVerifiedJobsCount(activeApp.email)} verified job(s). {editContributorLevel.replace('_', ' ')} requires at least {MIN_JOBS_FOR_PROMOTION[editContributorLevel]} verified jobs before qualification.
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                      Pioneer ID (Seat Number)
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        placeholder="e.g. RP-042"
                        value={editPioneerId}
                        onChange={e => setEditPioneerId(e.target.value)}
                        style={{
                          width: '100%', padding: '9px 12px', borderRadius: 8,
                          background: '#07180F', border: '1px solid rgba(255,255,255,0.2)',
                          color: '#FFFFFF', fontSize: 13, outline: 'none', fontFamily: 'monospace'
                        }}
                      />
                      <button
                        type="button"
                        onClick={generateNextPioneerId}
                        title="Auto-generate next Founding 100 seat"
                        style={{
                          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                          color: RF_MINT_ACCENT, padding: '0 10px', borderRadius: 8, fontSize: 11,
                          fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'
                        }}
                      >
                        Auto
                      </button>
                    </div>
                  </div>
                </div>

                {/* Official Acceptance Code Display */}
                {editStatus === 'ACCEPTED' && (
                  <div style={{
                    background: 'rgba(24, 252, 92, 0.08)', border: `1px solid ${RF_LEAF_GREEN}66`,
                    borderRadius: 12, padding: isMobile ? '12px 14px' : '16px 18px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, width: '100%', boxSizing: 'border-box'
                  }}>
                    <div style={{ minWidth: 0, flex: '1 1 240px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: RF_MINT_ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Key size={13} style={{ flexShrink: 0 }} /> Official Acceptance Code Issued
                      </div>
                      <div style={{
                        fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace',
                        marginTop: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(24, 252, 92, 0.25)',
                        padding: '6px 12px', borderRadius: 8, display: 'inline-block', letterSpacing: '0.04em',
                        wordBreak: 'break-all'
                      }}>
                        {editAcceptanceCode || activeApp.acceptance_code || '(Will be automatically generated upon saving)'}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 1.4 }}>
                        Share this code with the candidate. They must provide it with Application ID ({activeApp.application_number}) to activate their contributor profile.
                      </div>
                    </div>

                    {(editAcceptanceCode || activeApp.acceptance_code) && (
                      <button
                        type="button"
                        onClick={() => {
                          const codeToCopy = editAcceptanceCode || activeApp.acceptance_code!;
                          navigator.clipboard.writeText(codeToCopy);
                          setCopiedModalCode(true);
                          setTimeout(() => setCopiedModalCode(false), 2000);
                        }}
                        style={{
                          background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                          padding: '10px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                          width: isMobile ? '100%' : 'auto', justifyContent: 'center', flexShrink: 0
                        }}
                      >
                        {copiedModalCode ? <Check size={13} /> : <Copy size={13} />}
                        {copiedModalCode ? 'Copied Code' : 'Copy Acceptance Code'}
                      </button>
                    )}
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={editIsFounding}
                    onChange={e => setEditIsFounding(e.target.checked)}
                    style={{ accentColor: RF_MINT_ACCENT }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
                    Designate as Founding 100 Pioneer ⭐
                  </span>
                </label>

                <div>
                  <label style={{ display: 'block', fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                    Internal Admissions Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Candidate strengths, assigned projects, onboarding status..."
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: 8,
                      background: '#07180F', border: '1px solid rgba(255,255,255,0.2)',
                      color: '#FFFFFF', fontSize: 13, outline: 'none', resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {saveSuccessMsg && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8, background: 'rgba(24, 252, 92, 0.15)',
                  border: `1px solid ${RF_LEAF_GREEN}66`, color: RF_MINT_ACCENT, fontSize: 13
                }}>
                  {saveSuccessMsg}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div style={{
              flexShrink: 0,
              padding: isMobile ? '12px 16px calc(14px + env(safe-area-inset-bottom, 12px))' : '18px 28px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(5, 18, 11, 0.95)'
            }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
                  fontSize: 13, cursor: 'pointer'
                }}
              >
                Close
              </button>

              <button
                type="button"
                disabled={savingChanges}
                onClick={handleSaveChanges}
                style={{
                  background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                  padding: '10px 24px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                  cursor: savingChanges ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <Save size={14} />
                {savingChanges ? 'Saving...' : 'Save Decision'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DETAILED TASK PROOF REVIEW MODAL ────────────────────────────────────── */}
      {taskModalOpen && activeTask && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5, 18, 11, 0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '12px 10px calc(16px + env(safe-area-inset-bottom, 16px))' : 20
        }} onClick={() => setTaskModalOpen(false)}>
          <div style={{
            background: 'linear-gradient(145deg, #0B2416 0%, #061A0F 100%)',
            border: '1px solid rgba(102, 187, 42, 0.35)',
            borderRadius: isMobile ? 18 : 24, maxWidth: 740, width: '100%',
            maxHeight: isMobile ? 'calc(100dvh - 28px - env(safe-area-inset-bottom, 16px))' : '90vh',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)', position: 'relative',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: isMobile ? '14px 16px' : '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: RF_MINT_ACCENT }}>
                    {activeTask.reference_id}
                  </span>
                  {renderTaskStatusBadge(activeTask.status)}
                </div>
                <h3 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.35, wordBreak: 'break-word' }}>
                  {activeTask.task_title}
                </h3>
              </div>

              <button
                onClick={() => setTaskModalOpen(false)}
                aria-label="Close"
                style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)',
                  width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: -2
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="rp-sleek-scroll" style={{
              flex: 1,
              minHeight: 0,
              padding: isMobile ? '14px 14px' : '20px 24px',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}>
              {/* Contributor Card */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '10px 14px',
                border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexWrap: 'wrap', gap: 10,
                alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeTask.full_name}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeTask.email} {activeTask.application_number ? `• App: ${activeTask.application_number}` : ''}
                  </div>
                </div>

                <span style={{
                  padding: '3px 9px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                  background: `${RF_LEAF_GREEN}18`, color: RF_MINT_ACCENT, border: `1px solid ${RF_LEAF_GREEN}38`,
                  whiteSpace: 'nowrap'
                }}>
                  Target: {activeTask.target_level.replace('_', ' ')}
                </span>
              </div>

              {/* Promotion Qualification & Completed Jobs Progress Meter */}
              {(() => {
                const priorVerified = taskSubmissions.filter(
                  t => t.email.toLowerCase() === activeTask.email.toLowerCase() && t.status === 'VERIFIED' && t.id !== activeTask.id
                ).length;
                const totalAfterVerify = priorVerified + 1;
                const requiredJobs = MIN_JOBS_FOR_PROMOTION[activeTask.target_level] || 15;
                const qualifies = totalAfterVerify >= requiredJobs;

                return (
                  <div style={{
                    background: qualifies ? 'rgba(24, 252, 92, 0.06)' : 'rgba(255, 209, 102, 0.06)',
                    border: `1px solid ${qualifies ? RF_LEAF_GREEN : RF_GOLD_YELLOW}38`,
                    borderRadius: 12, padding: '10px 14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, gap: 8 }}>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: qualifies ? RF_MINT_ACCENT : RF_GOLD_YELLOW
                      }}>
                        {qualifies ? '✓ Promotion Ready' : 'Promotion Progress'}
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FFFFFF' }}>
                        {totalAfterVerify} / {requiredJobs} Jobs
                      </span>
                    </div>

                    <div style={{
                      width: '100%', height: 4, background: 'rgba(255,255,255,0.08)',
                      borderRadius: 6, overflow: 'hidden', margin: '6px 0'
                    }}>
                      <div style={{
                        width: `${Math.min(100, (totalAfterVerify / requiredJobs) * 100)}%`,
                        height: '100%',
                        background: qualifies ? RF_MINT_ACCENT : RF_GOLD_YELLOW,
                        borderRadius: 6, transition: 'width 0.3s ease'
                      }} />
                    </div>

                    <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
                      {qualifies ? (
                        <>Job #{totalAfterVerify} qualifies member for promotion to <strong>{activeTask.target_level.replace('_', ' ')}</strong>.</>
                      ) : (
                        <>{requiredJobs - totalAfterVerify} more verified mission{requiredJobs - totalAfterVerify === 1 ? '' : 's'} needed for promotion.</>
                      )}
                    </p>
                  </div>
                );
              })()}

              {/* Task Category */}
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Category &amp; Division
                </span>
                <p style={{ fontSize: 12.5, color: '#FFFFFF', marginTop: 3, margin: '3px 0 0 0' }}>
                  <strong style={{ color: RF_MINT_ACCENT }}>{activeTask.division}</strong> • {activeTask.task_category}
                </p>
              </div>

              {/* Description */}
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Work Summary
                </span>
                <p style={{
                  fontSize: 12.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.55,
                  background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: 8,
                  marginTop: 4, whiteSpace: 'pre-wrap', margin: '4px 0 0 0'
                }}>
                  {activeTask.task_description}
                </p>
              </div>

              {/* Deliverable Links */}
              {(activeTask.deliverable_url || activeTask.additional_url) && (
                <div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 5 }}>
                    Deliverable Links
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {activeTask.deliverable_url && (
                      <a
                        href={activeTask.deliverable_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'rgba(24, 252, 92, 0.08)', border: `1px solid ${RF_LEAF_GREEN}44`,
                          color: RF_MINT_ACCENT, padding: '6px 12px', borderRadius: 7, fontSize: 12,
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <ExternalLink size={12} /> {isMobile ? 'Deliverable Link' : 'Primary Deliverable'}
                      </a>
                    )}
                    {activeTask.additional_url && (
                      <a
                        href={activeTask.additional_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#FFFFFF', padding: '6px 12px', borderRadius: 7, fontSize: 12,
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <ExternalLink size={12} /> Verification Link
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Attached Screenshots Gallery */}
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                  Screenshots ({activeTask.screenshots.length})
                </span>
                {activeTask.screenshots.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', margin: 0 }}>
                    No screenshots attached.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(130px, 1fr))' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                    {activeTask.screenshots.map((s, idx) => (
                      <div
                        key={s.id || idx}
                        onClick={() => setScreenshotModalUrl(s.data_url)}
                        style={{
                          background: 'rgba(0,0,0,0.35)', borderRadius: 9, overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.09)', cursor: 'pointer',
                          transition: 'transform 0.15s, border-color 0.15s'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = RF_MINT_ACCENT;
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                          e.currentTarget.style.transform = '';
                        }}
                      >
                        <div style={{ height: isMobile ? 85 : 100, position: 'relative', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img
                            src={s.data_url}
                            alt={s.name || `Screenshot ${idx + 1}`}
                            onError={e => {
                              // Hide broken image and keep container clean
                              (e.currentTarget as HTMLImageElement).style.opacity = '0';
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute', bottom: 4, right: 5,
                            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', borderRadius: 4, padding: '2px 5px',
                            fontSize: 9.5, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 3
                          }}>
                            <Eye size={10} /> Enlarge
                          </div>
                        </div>
                        <div style={{ padding: '6px 8px' }}>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.name || `Image #${idx + 1}`}
                          </div>
                          {s.caption && (
                            <div style={{ fontSize: 10, color: RF_MINT_ACCENT, marginTop: 2, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              "{s.caption}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Squad / Admin Feedback Notes */}
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>
                  Verification Feedback
                </span>
                <textarea
                  rows={2}
                  placeholder="Add feedback or review remarks for contributor..."
                  value={taskFeedback}
                  onChange={e => setTaskFeedback(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#FFFFFF', fontSize: 12.5, outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit', resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              flexShrink: 0,
              padding: isMobile ? '10px 14px calc(12px + env(safe-area-inset-bottom, 12px))' : '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'stretch' : 'space-between', gap: 10,
              background: 'rgba(5, 18, 11, 0.95)'
            }}>
              {!isMobile && (
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
                    fontSize: 13, cursor: 'pointer', padding: '6px 12px'
                  }}
                >
                  Close
                </button>
              )}

              <div style={{ display: 'flex', gap: 8, width: isMobile ? '100%' : 'auto', flex: isMobile ? 1 : 'initial' }}>
                <button
                  type="button"
                  disabled={updatingTask}
                  onClick={() => handleUpdateTaskStatus('NEEDS_REVISION')}
                  style={{
                    background: 'rgba(244, 124, 32, 0.12)', border: `1px solid rgba(244, 124, 32, 0.4)`,
                    color: '#FFB27D', padding: isMobile ? '10px 8px' : '9px 16px', borderRadius: 8, fontSize: 12,
                    fontWeight: 600, cursor: updatingTask ? 'not-allowed' : 'pointer',
                    flex: isMobile ? 1 : 'initial', textAlign: 'center', whiteSpace: 'nowrap'
                  }}
                >
                  Request Revision
                </button>

                {(() => {
                  const priorVerified = taskSubmissions.filter(
                    t => t.email.toLowerCase() === activeTask.email.toLowerCase() && t.status === 'VERIFIED' && t.id !== activeTask.id
                  ).length;
                  const totalAfterVerify = priorVerified + 1;
                  const requiredJobs = MIN_JOBS_FOR_PROMOTION[activeTask.target_level] || 15;
                  const qualifies = totalAfterVerify >= requiredJobs;

                  return (
                    <button
                      type="button"
                      disabled={updatingTask}
                      onClick={() => handleUpdateTaskStatus('VERIFIED')}
                      style={{
                        background: qualifies ? RF_LEAF_GREEN : 'rgba(24, 252, 92, 0.18)',
                        color: qualifies ? RF_DEEP_GREEN : RF_MINT_ACCENT,
                        border: qualifies ? 'none' : `1px solid ${RF_LEAF_GREEN}55`,
                        padding: isMobile ? '10px 10px' : '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        cursor: updatingTask ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        flex: isMobile ? 1.3 : 'initial', textAlign: 'center', whiteSpace: 'nowrap'
                      }}
                    >
                      <Check size={14} />
                      {updatingTask ? (
                        'Verifying...'
                      ) : qualifies ? (
                        isMobile ? 'Verify & Promote' : `Verify Proof & Promote to ${activeTask.target_level.replace('_', ' ')}`
                      ) : (
                        isMobile ? `Verify Proof (${totalAfterVerify}/${requiredJobs})` : `Verify Task Proof (${totalAfterVerify}/${requiredJobs} Done)`
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── FULL-SCREEN SCREENSHOT LIGHTBOX MODAL ──────────────────────────────── */}
      {screenshotModalUrl && (
        <div
          onClick={() => setScreenshotModalUrl(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(5, 18, 11, 0.92)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '12px 10px calc(16px + env(safe-area-inset-bottom, 16px))' : 24
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: isMobile ? 'calc(100dvh - 32px - env(safe-area-inset-bottom, 16px))' : '92vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src={screenshotModalUrl}
              alt="Screenshot Full View"
              style={{
                maxWidth: '100%',
                maxHeight: isMobile ? 'calc(100dvh - 60px - env(safe-area-inset-bottom, 20px))' : '88vh',
                borderRadius: isMobile ? 12 : 16,
                border: '1px solid rgba(255,255,255,0.2)',
                objectFit: 'contain'
              }}
            />
            <button
              onClick={() => setScreenshotModalUrl(null)}
              style={{
                position: 'absolute', top: isMobile ? 8 : -14, right: isMobile ? 8 : -14,
                width: 34, height: 34, borderRadius: '50%',
                background: '#FFFFFF', color: '#000000', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontWeight: 800, boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ─── ADD NEW WORKER MODAL ──────────────────────────────────────────────── */}
      {addWorkerModalOpen && (
        <div
          onClick={() => setAddWorkerModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(5, 18, 11, 0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '12px 10px calc(16px + env(safe-area-inset-bottom, 16px))' : 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #0B2416 0%, #061A0F 100%)',
              border: '1px solid rgba(102, 187, 42, 0.35)',
              borderRadius: isMobile ? 18 : 24, maxWidth: 500, width: '100%',
              maxHeight: isMobile ? 'calc(100dvh - 28px - env(safe-area-inset-bottom, 16px))' : '90vh',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              flexShrink: 0,
              padding: isMobile ? '16px 18px 14px' : '24px 28px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: `${RF_LEAF_GREEN}20`,
                  border: `1px solid ${RF_LEAF_GREEN}44`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: RF_MINT_ACCENT
                }}>
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Add Review Worker
                  </h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: '2px 0 0' }}>
                    Grant verification &amp; admission review permissions
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAddWorkerModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)',
                  width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateWorker}
              className="rp-sleek-scroll"
              style={{
                flex: 1,
                minHeight: 0,
                padding: isMobile ? '16px 18px calc(24px + env(safe-area-inset-bottom, 18px))' : '24px 28px',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain'
              }}
            >
              {workerFormError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444',
                  borderRadius: 10, padding: '10px 14px', color: '#FCA5A5',
                  fontSize: 13, marginBottom: 16
                }}>
                  {workerFormError}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                  Worker Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amara Okafor"
                  value={newWorkerName}
                  onChange={e => setNewWorkerName(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. amara@refeir.com"
                  value={newWorkerEmail}
                  onChange={e => setNewWorkerEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                    Assigned Role *
                  </label>
                  <select
                    value={newWorkerRole}
                    onChange={e => setNewWorkerRole(e.target.value as StaffRole)}
                    style={{
                      width: '100%', padding: '11px 40px 11px 14px', borderRadius: 10,
                      background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box', cursor: 'pointer'
                    }}
                  >
                    <option value="ADMISSIONS_REVIEWER">Admissions Reviewer</option>
                    <option value="TASK_VERIFIER">Task Verifier</option>
                    <option value="SQUAD_LEAD">Squad Lead</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                    Division Squad Scope *
                  </label>
                  <select
                    value={newWorkerDivision}
                    onChange={e => setNewWorkerDivision(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 40px 11px 14px', borderRadius: 10,
                      background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box', cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">All Squads (Global)</option>
                    <option value="TECHNOLOGY">Technology &amp; Architecture</option>
                    <option value="DESIGN">Product &amp; Design</option>
                    <option value="GROWTH">Growth &amp; Referrals</option>
                    <option value="COMMUNITY">Community &amp; Chapters</option>
                    <option value="OPERATIONS">Operations &amp; QA</option>
                    <option value="BUSINESS">Business Development</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 24 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                      Access Passcode *
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewWorkerPasscode(`worker26_${Math.floor(100 + Math.random() * 900)}`)}
                      style={{ background: 'none', border: 'none', color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Generate
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={newWorkerPasscode}
                      onChange={e => setNewWorkerPasscode(e.target.value)}
                      placeholder="e.g. worker26_482"
                      style={{
                        width: '100%', padding: '11px 14px 11px 36px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF', fontSize: 13.5, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <Key size={15} style={{ position: 'absolute', left: 12, top: 13, color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                      Password (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const base = newWorkerName.trim() ? newWorkerName.trim().split(' ')[0] : 'Worker';
                        setNewWorkerPassword(`${base}@Refeir2026!`);
                      }}
                      style={{ background: 'none', border: 'none', color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Generate
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={newWorkerPassword}
                      onChange={e => setNewWorkerPassword(e.target.value)}
                      placeholder="Auto-generated if empty"
                      style={{
                        width: '100%', padding: '11px 14px 11px 36px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <Lock size={15} style={{ position: 'absolute', left: 12, top: 13, color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setAddWorkerModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF', padding: '10px 18px', borderRadius: 100, fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                    padding: '10px 22px', borderRadius: 100, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: `0 2px 12px ${RF_LEAF_GREEN}44`
                  }}
                >
                  <UserPlus size={14} /> Add Worker to Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT STAFF MEMBER & RESET PASSWORD MODAL ───────────────────────── */}
      {editStaffModalOpen && editingStaffMember && (
        <div
          onClick={() => {
            setEditStaffModalOpen(false);
            setEditingStaffMember(null);
          }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(5, 18, 11, 0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '12px 10px calc(16px + env(safe-area-inset-bottom, 16px))' : 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #0B2416 0%, #061A0F 100%)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: isMobile ? 18 : 24, maxWidth: 540, width: '100%',
              maxHeight: isMobile ? 'calc(100dvh - 28px - env(safe-area-inset-bottom, 16px))' : '90vh',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              flexShrink: 0,
              padding: isMobile ? '16px 18px 14px' : '22px 28px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#38BDF8'
                }}>
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Edit Staff &amp; Reset Credentials
                  </h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: '2px 0 0' }}>
                    {editingStaffMember.name} • {editingStaffMember.role.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditStaffModalOpen(false);
                  setEditingStaffMember(null);
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)',
                  width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSaveEditStaff}
              className="rp-sleek-scroll"
              style={{
                flex: 1,
                minHeight: 0,
                padding: isMobile ? '16px 18px calc(24px + env(safe-area-inset-bottom, 18px))' : '22px 28px',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain'
              }}
            >
              {editStaffError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444',
                  borderRadius: 10, padding: '10px 14px', color: '#FCA5A5',
                  fontSize: 13, marginBottom: 14
                }}>
                  {editStaffError}
                </div>
              )}

              {editStaffSuccess && (
                <div style={{
                  background: 'rgba(24, 252, 92, 0.15)', border: `1px solid ${RF_MINT_ACCENT}`,
                  borderRadius: 10, padding: '10px 14px', color: RF_MINT_ACCENT,
                  fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <CheckCircle2 size={16} /> {editStaffSuccess}
                </div>
              )}

              {/* Account Metadata Badge */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8
              }}>
                <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>
                  ID: {editingStaffMember.id}
                </span>
                <span style={{ fontSize: 11.5, color: RF_MINT_ACCENT, fontWeight: 600 }}>
                  {editingStaffMember.reviews_count} reviews handled
                </span>
              </div>

              {/* Name & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editStaffName}
                    onChange={e => setEditStaffName(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 9,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editStaffEmail}
                    onChange={e => setEditStaffEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 9,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Role & Squad Division */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                    Assigned Role *
                  </label>
                  <select
                    value={editStaffRole}
                    onChange={e => setEditStaffRole(e.target.value as StaffRole)}
                    style={{
                      width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9,
                      background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF', fontSize: 12.5, outline: 'none', boxSizing: 'border-box', cursor: 'pointer'
                    }}
                  >
                    <option value="SUPER_ADMIN">Super Admin (Full Root Authority)</option>
                    <option value="MANAGER">Manager (Full Ops except Staff Admin)</option>
                    <option value="ADMISSIONS_REVIEWER">Admissions Reviewer (Candidates)</option>
                    <option value="SQUAD_LEAD">Squad Lead (Missions &amp; Proofs)</option>
                    <option value="TASK_VERIFIER">Task Verifier (Proofs of Work)</option>
                    <option value="TASK_VIEWER">Task Viewer (Read Only)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                    Squad Scope *
                  </label>
                  <select
                    value={editStaffDivision}
                    onChange={e => setEditStaffDivision(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9,
                      background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF', fontSize: 12.5, outline: 'none', boxSizing: 'border-box', cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">All Squads (Global)</option>
                    <option value="TECH_PRODUCT">Tech &amp; Product</option>
                    <option value="CREATIVE">Creative</option>
                    <option value="GROWTH">Growth</option>
                    <option value="BUSINESS">Business</option>
                    <option value="COMMUNITY">Community</option>
                    <option value="RESEARCH_TESTING">Research &amp; Testing</option>
                  </select>
                </div>
              </div>

              {/* Status Selector */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                  Account Status
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setEditStaffStatus('ACTIVE')}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 8, fontSize: 12.5, fontWeight: 700,
                      background: editStaffStatus === 'ACTIVE' ? 'rgba(24, 252, 92, 0.18)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${editStaffStatus === 'ACTIVE' ? RF_MINT_ACCENT : 'rgba(255,255,255,0.1)'}`,
                      color: editStaffStatus === 'ACTIVE' ? RF_MINT_ACCENT : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: editStaffStatus === 'ACTIVE' ? RF_MINT_ACCENT : 'rgba(255,255,255,0.4)' }} />
                    ACTIVE (Access Allowed)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStaffStatus('SUSPENDED')}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 8, fontSize: 12.5, fontWeight: 700,
                      background: editStaffStatus === 'SUSPENDED' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${editStaffStatus === 'SUSPENDED' ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                      color: editStaffStatus === 'SUSPENDED' ? '#FCA5A5' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: editStaffStatus === 'SUSPENDED' ? '#EF4444' : 'rgba(255,255,255,0.4)' }} />
                    SUSPENDED (Access Blocked)
                  </button>
                </div>
              </div>

              {/* Credential Reset Container */}
              <div style={{
                background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '14px 16px', marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                  <Key size={15} color={RF_GOLD_YELLOW} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF' }}>
                    Reset Authentication Credentials
                  </span>
                </div>

                {/* Passcode Row */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                      Access Passcode (Short Code Login)
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditStaffPasscode(`worker26_${Math.floor(100 + Math.random() * 900)}`)}
                      style={{ background: 'none', border: 'none', color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Generate New Passcode
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={editStaffPasscode}
                      onChange={e => setEditStaffPasscode(e.target.value)}
                      placeholder="e.g. worker26_482"
                      style={{
                        width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF', fontSize: 13, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <Key size={14} style={{ position: 'absolute', left: 11, top: 11, color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                </div>

                {/* Password Row */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                      Password (Email + Password Login)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const base = editStaffName.trim() ? editStaffName.trim().split(' ')[0] : 'Staff';
                        setEditStaffPassword(`${base}@Refeir${Math.floor(100 + Math.random() * 900)}!`);
                        setShowEditStaffPassword(true);
                      }}
                      style={{ background: 'none', border: 'none', color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Generate Strong Password
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showEditStaffPassword ? 'text' : 'password'}
                      value={editStaffPassword}
                      onChange={e => setEditStaffPassword(e.target.value)}
                      placeholder="e.g. Sarah@Admit2026"
                      style={{
                        width: '100%', padding: '9px 40px 9px 34px', borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <Lock size={14} style={{ position: 'absolute', left: 11, top: 11, color: 'rgba(255,255,255,0.4)' }} />
                    <button
                      type="button"
                      onClick={() => setShowEditStaffPassword(!showEditStaffPassword)}
                      style={{
                        position: 'absolute', right: 10, top: 9, background: 'none', border: 'none',
                        color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 2
                      }}
                    >
                      {showEditStaffPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4, display: 'block' }}>
                    Staff member can log in using either their email + password or their access passcode.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditStaffModalOpen(false);
                    setEditingStaffMember(null);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF', padding: '9px 18px', borderRadius: 100, fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#38BDF8', color: '#04101A', border: 'none',
                    padding: '9px 22px', borderRadius: 100, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 2px 14px rgba(56, 189, 248, 0.4)'
                  }}
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── APPOINT SQUAD LEAD MODAL ────────────────────────────────────────── */}
      {appointSquadLeadModalOpen && (
        <div
          onClick={() => setAppointSquadLeadModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(5, 18, 11, 0.88)', backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '12px 10px calc(16px + env(safe-area-inset-bottom, 16px))' : 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #0D281A 0%, #061A0F 100%)',
              border: `1.5px solid ${RF_GOLD_YELLOW}55`,
              borderRadius: isMobile ? 18 : 24, maxWidth: 520, width: '100%',
              maxHeight: isMobile ? 'calc(100dvh - 28px - env(safe-area-inset-bottom, 16px))' : '90vh',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(246, 178, 26, 0.15)',
              position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              flexShrink: 0,
              padding: isMobile ? '16px 18px 14px' : '22px 26px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(246, 178, 26, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: 'rgba(246, 178, 26, 0.15)',
                  border: '1px solid rgba(246, 178, 26, 0.35)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: RF_GOLD_YELLOW
                }}>
                  <Star size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Appoint Squad Lead
                  </h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: '2px 0 0' }}>
                    Promote a pioneer to lead a squad &amp; verify deliverables
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAppointSquadLeadModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)',
                  width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleConfirmAppointSquadLead}
              className="rp-sleek-scroll"
              style={{
                flex: 1,
                minHeight: 0,
                padding: isMobile ? '16px 18px calc(24px + env(safe-area-inset-bottom, 18px))' : '22px 26px',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}
            >
              {appointLeadError && (
                <div style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <AlertCircle size={15} /> {appointLeadError}
                </div>
              )}

              {/* Target Pioneer Member */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
                  Target Pioneer Member *
                </label>

                {appointLeadMember ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: `${RF_LEAF_GREEN}22`,
                        border: `1px solid ${RF_MINT_ACCENT}66`, color: RF_MINT_ACCENT,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0
                      }}>
                        {appointLeadMember.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {appointLeadMember.full_name}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {appointLeadMember.email} • {appointLeadMember.pioneer_id || 'Pioneer'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppointLeadMember(null)}
                      style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.7)', fontSize: 11, padding: '4px 8px', borderRadius: 6,
                        cursor: 'pointer', flexShrink: 0
                      }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Search member by name or email..."
                      value={appointLeadSearchTerm}
                      onChange={e => setAppointLeadSearchTerm(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 8
                      }}
                    />
                    <div className="rp-sleek-scroll" style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, background: 'rgba(0,0,0,0.2)' }}>
                      {membersList
                        .filter(m => {
                          const q = appointLeadSearchTerm.toLowerCase();
                          return !q || m.full_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
                        })
                        .slice(0, 15)
                        .map(m => (
                          <div
                            key={m.id}
                            onClick={() => {
                              setAppointLeadMember(m);
                              const app = applications.find(a => a.email.toLowerCase() === m.email.toLowerCase());
                              setAppointLeadDivision(app?.primary_division || 'TECH_PRODUCT');
                              const randomPin = Math.floor(1000 + Math.random() * 9000);
                              const cleanFirst = m.full_name.split(' ')[0].toLowerCase();
                              setAppointLeadPasscode(`${cleanFirst}${randomPin}`);
                              setAppointLeadPassword(`Refeir@${randomPin}!`);
                            }}
                            style={{
                              padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              transition: 'background 0.15s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24, 252, 92, 0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{m.full_name}</div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{m.email}</div>
                            </div>
                            <span style={{ fontSize: 10.5, color: RF_GOLD_YELLOW, fontWeight: 700 }}>
                              Select →
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Assigned Squad Division */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
                  Assigned Squad Division *
                </label>
                <select
                  value={appointLeadDivision}
                  onChange={e => setAppointLeadDivision(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.18)',
                    color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box', cursor: 'pointer'
                  }}
                >
                  <option value="TECH_PRODUCT">Tech &amp; Architecture Squad</option>
                  <option value="CREATIVE">Creative &amp; Design Squad</option>
                  <option value="GROWTH">Growth &amp; Referrals Squad</option>
                  <option value="BUSINESS">Business Development Squad</option>
                  <option value="COMMUNITY">Community &amp; Chapters Squad</option>
                  <option value="RESEARCH_TESTING">Research &amp; QA Squad</option>
                </select>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4, display: 'block' }}>
                  The appointed lead will manage squad missions, task verifications, and member deliverables for this division.
                </span>
              </div>

              {/* Passcode & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                    Staff Passcode *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={appointLeadPasscode}
                      onChange={e => setAppointLeadPasscode(e.target.value)}
                      placeholder="e.g. lead4829"
                      style={{
                        width: '100%', padding: '10px 12px 10px 32px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF', fontSize: 13, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <Key size={14} style={{ position: 'absolute', left: 10, top: 12, color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                    Portal Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={appointLeadPassword}
                      onChange={e => setAppointLeadPassword(e.target.value)}
                      placeholder="Refeir@2026!"
                      style={{
                        width: '100%', padding: '10px 12px 10px 32px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF', fontSize: 13, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                    <Lock size={14} style={{ position: 'absolute', left: 10, top: 12, color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                </div>
              </div>

              {/* Automatic Promotion Notice */}
              <div style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(246, 178, 26, 0.08)', border: '1px solid rgba(246, 178, 26, 0.25)',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Award size={16} color={RF_GOLD_YELLOW} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)' }}>
                  Appointing will automatically elevate this pioneer's registry badge to <strong style={{ color: RF_GOLD_YELLOW }}>Level 3 (Squad Architect)</strong>.
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setAppointSquadLeadModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF', padding: '10px 18px', borderRadius: 100, fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: RF_GOLD_YELLOW, color: '#07180F', border: 'none',
                    padding: '10px 22px', borderRadius: 100, fontSize: 13, fontWeight: 800,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 2px 14px rgba(246, 178, 26, 0.4)'
                  }}
                >
                  <Star size={14} /> Confirm Squad Lead Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── SELECTED MEMBER FULL PROFILE MODAL ──────────────────────────────── */}
      {memberModalOpen && selectedMember && (
        <div
          onClick={() => setMemberModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(3, 10, 6, 0.88)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '12px 10px calc(16px + env(safe-area-inset-bottom, 16px))' : '24px 20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="rp-sleek-scroll"
            style={{
              maxWidth: 860, width: '100%',
              maxHeight: isMobile ? 'calc(100dvh - 28px - env(safe-area-inset-bottom, 16px))' : '90vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              background: 'linear-gradient(160deg, #0A2417 0%, #06170E 100%)',
              borderRadius: isMobile ? 20 : 24,
              border: '1px solid rgba(24, 252, 92, 0.22)',
              padding: isMobile ? '20px 16px calc(28px + env(safe-area-inset-bottom, 20px))' : '32px 32px 34px',
              position: 'relative',
              boxShadow: '0 28px 70px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setMemberModalOpen(false)}
              aria-label="Close modal"
              style={{
                position: 'absolute', top: isMobile ? 14 : 20, right: isMobile ? 14 : 20,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)', width: 34, height: 34, borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, zIndex: 10, transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              <X size={16} />
            </button>

            {/* Suspended Banner */}
            {selectedMember.is_suspended && (
              <div style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: 14, padding: '12px 18px', marginBottom: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Ban size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#FCA5A5' }}>Account Suspended</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(252,165,165,0.75)', marginTop: 1 }}>
                      {selectedMember.suspension_reason || 'Administrative restriction'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleReactivateMember(selectedMember)}
                  style={{
                    background: 'rgba(24,252,92,0.12)', border: `1px solid ${RF_LEAF_GREEN}`,
                    color: RF_MINT_ACCENT, padding: '6px 14px', borderRadius: 100, fontSize: 12,
                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0
                  }}
                >
                  <CheckCircle2 size={12} /> Lift Suspension
                </button>
              </div>
            )}

            {/* ── HEADER & IDENTITY ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 20,
              marginBottom: 24, paddingBottom: 22, borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              {selectedMember.avatar_url ? (
                <img src={selectedMember.avatar_url} alt={selectedMember.full_name} style={{
                  width: isMobile ? 60 : 72, height: isMobile ? 60 : 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                  border: `2px solid ${selectedMember.is_suspended ? '#EF4444' : RF_MINT_ACCENT}`,
                  boxShadow: `0 0 16px ${selectedMember.is_suspended ? 'rgba(239,68,68,0.3)' : 'rgba(24,252,92,0.25)'}`
                }} />
              ) : (
                <div style={{
                  width: isMobile ? 60 : 72, height: isMobile ? 60 : 72, borderRadius: '50%', flexShrink: 0,
                  background: selectedMember.is_suspended ? 'rgba(239,68,68,0.15)' : `${RF_LEAF_GREEN}20`,
                  border: `2px solid ${selectedMember.is_suspended ? '#EF4444' : RF_MINT_ACCENT}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: selectedMember.is_suspended ? '#FCA5A5' : RF_MINT_ACCENT,
                  fontSize: isMobile ? 20 : 24, fontWeight: 800,
                  boxShadow: `0 0 16px ${selectedMember.is_suspended ? 'rgba(239,68,68,0.3)' : 'rgba(24,252,92,0.25)'}`
                }}>
                  {selectedMember.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
                    {selectedMember.full_name}
                  </h2>
                  {selectedMember.is_founding_100 && (
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: RF_GOLD_YELLOW, background: 'rgba(246,178,26,0.14)',
                      border: '1px solid rgba(246,178,26,0.35)', padding: '2px 8px', borderRadius: 100,
                      textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 4
                    }}>
                      <Star size={10} fill={RF_GOLD_YELLOW} /> Founding 100
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {selectedMember.pioneer_id && (
                    <span style={{
                      fontFamily: 'monospace', fontSize: 11.5, fontWeight: 700, color: RF_MINT_ACCENT,
                      background: 'rgba(24,252,92,0.1)', border: '1px solid rgba(24,252,92,0.25)',
                      padding: '3px 9px', borderRadius: 6
                    }}>
                      {selectedMember.pioneer_id}
                    </span>
                  )}
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: RF_GOLD_YELLOW,
                    background: 'rgba(246,178,26,0.1)', border: '1px solid rgba(246,178,26,0.25)',
                    padding: '3px 9px', borderRadius: 6
                  }}>
                    {(selectedMember.contributor_level || 'LEVEL_1').replace('_', ' ')}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
                    background: selectedMember.is_suspended ? 'rgba(239,68,68,0.15)' : 'rgba(24,252,92,0.12)',
                    color: selectedMember.is_suspended ? '#FCA5A5' : RF_MINT_ACCENT,
                    border: `1px solid ${selectedMember.is_suspended ? 'rgba(239,68,68,0.3)' : 'rgba(24,252,92,0.25)'}`
                  }}>
                    {selectedMember.is_suspended ? 'SUSPENDED' : 'ACTIVE MEMBER'}
                  </span>
                  {selectedMember.application_number && (
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                      App #{selectedMember.application_number}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── 2-COLUMN RESPONSIVE DATA GRID ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 16,
              marginBottom: 20
            }}>
              {/* Card A: Identity & Contact Channels */}
              <div style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '10px 16px',
                  background: 'rgba(24,252,92,0.06)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <Shield size={12} color={RF_MINT_ACCENT} />
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: RF_MINT_ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Identity &amp; Channels
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* Squad */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.015)' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Assigned Squad</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF' }}>{selectedMember.division || '—'}</span>
                  </div>

                  {/* DOB */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Date of Birth</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', fontFamily: 'monospace' }}>{selectedMember.date_of_birth || '—'}</span>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.015)' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Email</span>
                    <a href={`mailto:${selectedMember.email}`} style={{ fontSize: 12, color: RF_MINT_ACCENT, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                      {selectedMember.email}
                    </a>
                  </div>

                  {/* WhatsApp */}
                  {selectedMember.whatsapp_number && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.01)' }}>
                      <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>WhatsApp</span>
                      <a href={`https://wa.me/${selectedMember.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={11} /> {selectedMember.whatsapp_number}
                      </a>
                    </div>
                  )}

                  {/* Telegram */}
                  {selectedMember.telegram_handle && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.015)' }}>
                      <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Telegram</span>
                      <span style={{ fontSize: 12.5, color: '#0088cc' }}>{selectedMember.telegram_handle}</span>
                    </div>
                  )}

                  {/* Location */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Location</span>
                    <span style={{ fontSize: 12.5, color: '#FFFFFF' }}>{selectedMember.city ? `${selectedMember.city}, ` : ''}{selectedMember.country || '—'}</span>
                  </div>

                  {/* Institution */}
                  {selectedMember.institution && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.015)' }}>
                      <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Institution</span>
                      <span style={{ fontSize: 12, color: '#FFFFFF', textAlign: 'right', maxWidth: '60%' }}>{selectedMember.institution}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card B: Settlement, Banking & Rails */}
              <div style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '10px 16px',
                  background: 'rgba(246,178,26,0.06)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <DollarSign size={12} color={RF_GOLD_YELLOW} />
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: RF_GOLD_YELLOW, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Settlement &amp; Rails
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* Payout Method */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.015)' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Payout Preference</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#FFFFFF' }}>{selectedMember.payout_preference ? selectedMember.payout_preference.replace('_', ' ') : 'Bank Settlement'}</span>
                  </div>

                  {/* Bank Name */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Bank / Platform</span>
                    <span style={{ fontSize: 12.5, color: '#FFFFFF' }}>{selectedMember.bank_name || '—'}</span>
                  </div>

                  {/* Account No */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.015)' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Account No.</span>
                    <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: RF_MINT_ACCENT }}>
                      {selectedMember.account_number || '••••••••••'}
                    </span>
                  </div>

                  {/* Account Name */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Account Name</span>
                    <span style={{ fontSize: 12.5, color: '#FFFFFF' }}>{selectedMember.account_name || '—'}</span>
                  </div>

                  {/* External Links */}
                  <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.015)', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginRight: 2 }}>Web:</span>
                    {selectedMember.github_url && <a href={selectedMember.github_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 6 }}>GitHub</a>}
                    {selectedMember.linkedin_url && <a href={selectedMember.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#0077B5', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 6 }}>LinkedIn</a>}
                    {selectedMember.twitter_handle && <a href={`https://twitter.com/${selectedMember.twitter_handle.replace('@','')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#1DA1F2', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 6 }}>X / Twitter</a>}
                    {selectedMember.portfolio_url && <a href={selectedMember.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: RF_MINT_ACCENT, textDecoration: 'none', background: 'rgba(24,252,92,0.08)', border: '1px solid rgba(24,252,92,0.2)', padding: '3px 8px', borderRadius: 6 }}>Portfolio</a>}
                    {!selectedMember.github_url && !selectedMember.linkedin_url && !selectedMember.twitter_handle && !selectedMember.portfolio_url && (
                      <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)' }}>No external links provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── BIO & SKILLS ── */}
            {(selectedMember.bio || (selectedMember.skills && selectedMember.skills.length > 0)) && (
              <div style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '14px 18px', marginBottom: 20
              }}>
                {selectedMember.bio && (
                  <p style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 12px',
                    fontStyle: 'italic', borderLeft: `2px solid ${RF_MINT_ACCENT}55`, paddingLeft: 12
                  }}>
                    "{selectedMember.bio}"
                  </p>
                )}
                {selectedMember.skills && selectedMember.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedMember.skills.map((skill, i) => (
                      <span key={i} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.8)', padding: '4px 11px', borderRadius: 100, fontSize: 11.5
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── COLLAPSIBLE CULTURE & REASONING SURVEY ── */}
            <div style={{
              marginBottom: isMobile ? 16 : 20,
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${surveyExpanded ? 'rgba(24,252,92,0.3)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 14,
              overflow: 'hidden',
              transition: 'border-color 0.2s ease'
            }}>
              {/* Accordion Trigger Header */}
              <div
                onClick={() => setSurveyExpanded(prev => !prev)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: isMobile ? '11px 13px' : '14px 18px', cursor: 'pointer',
                  background: surveyExpanded ? 'rgba(24,252,92,0.05)' : 'rgba(255,255,255,0.015)',
                  userSelect: 'none', transition: 'background 0.2s ease', gap: 10
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(24,252,92,0.12)', border: '1px solid rgba(24,252,92,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: RF_MINT_ACCENT,
                    flexShrink: 0
                  }}>
                    <Brain size={14} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: isMobile ? 12.5 : 13, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                        Reasoning Survey
                      </span>
                      {selectedMember.survey_responses && selectedMember.survey_responses.length > 0 ? (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: RF_MINT_ACCENT,
                          background: 'rgba(24,252,92,0.12)', padding: '1px 6px', borderRadius: 100,
                          whiteSpace: 'nowrap'
                        }}>
                          {selectedMember.survey_responses.length}/10
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)',
                          background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 100,
                          whiteSpace: 'nowrap'
                        }}>
                          Pending
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {surveyExpanded ? 'Tap header to collapse' : '10-question evaluation'}
                    </div>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: surveyExpanded ? RF_MINT_ACCENT : 'rgba(255,255,255,0.65)',
                    background: surveyExpanded ? 'rgba(24,252,92,0.1)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${surveyExpanded ? 'rgba(24,252,92,0.25)' : 'rgba(255,255,255,0.1)'}`,
                    padding: '4px 9px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 3,
                    whiteSpace: 'nowrap'
                  }}>
                    {surveyExpanded ? 'Hide' : 'View'}
                    {surveyExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </span>
                </div>
              </div>

              {/* Collapsed Preview Strip */}
              {!surveyExpanded && selectedMember.survey_responses && selectedMember.survey_responses.length > 0 && (
                <div style={{
                  padding: '8px 14px 9px',
                  background: 'rgba(0,0,0,0.2)',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  fontSize: 11, color: 'rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8
                }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    ✓ 10 situational judgment responses verified
                  </span>
                  <span style={{ color: RF_MINT_ACCENT, fontWeight: 600, fontSize: 10.5, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }} onClick={() => setSurveyExpanded(true)}>
                    Read →
                  </span>
                </div>
              )}

              {/* Expanded Survey Content */}
              {surveyExpanded && (
                <div style={{
                  padding: isMobile ? '12px 14px' : '14px 18px 18px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(0,0,0,0.25)'
                }}>
                  {selectedMember.survey_responses && selectedMember.survey_responses.length > 0 ? (
                    <div className="rp-sleek-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 9, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
                      {selectedMember.survey_responses.map((resp, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 10, padding: '10px 12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                            <span style={{
                              fontSize: 9.5, fontWeight: 800, color: RF_MINT_ACCENT,
                              background: 'rgba(24,252,92,0.1)', padding: '2px 5px', borderRadius: 4, fontFamily: 'monospace',
                              flexShrink: 0
                            }}>
                              Q{resp.question_id || idx + 1}
                            </span>
                            <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', fontWeight: 500, lineHeight: 1.3 }}>
                              {(resp as any).question_text || resp.question || `Scenario Question ${idx + 1}`}
                            </span>
                          </div>

                          <div style={{
                            fontSize: 12, fontWeight: 700, color: '#FFFFFF',
                            background: 'rgba(24,252,92,0.06)', borderLeft: `2px solid ${RF_MINT_ACCENT}`,
                            padding: '5px 8px', borderRadius: '0 5px 5px 0', marginBottom: resp.reasoning_notes ? 5 : 0
                          }}>
                            {resp.selected_option}
                          </div>

                          {resp.reasoning_notes && (
                            <div style={{
                              fontSize: 11, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic',
                              paddingLeft: 8, marginTop: 3, lineHeight: 1.35
                            }}>
                              "{resp.reasoning_notes}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', padding: '14px 0', textAlign: 'center' }}>
                      Reasoning survey responses have not been recorded for this profile yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── CERTIFICATES & ACCREDITATIONS ── */}
            <div style={{ marginBottom: isMobile ? 18 : 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 10 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <Award size={13} color={RF_GOLD_YELLOW} style={{ flexShrink: 0 }} />
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap'
                  }}>
                    {isMobile ? 'Certificates' : 'Certificates & Accreditations'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenIssueCertModal(selectedMember.email, selectedMember.contributor_level)}
                  style={{
                    background: 'rgba(246,178,26,0.1)', border: `1px solid ${RF_GOLD_YELLOW}55`,
                    color: RF_GOLD_YELLOW, padding: isMobile ? '4px 10px' : '5px 13px', borderRadius: 100, fontSize: 11,
                    fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s ease', whiteSpace: 'nowrap', flexShrink: 0
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(246,178,26,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(246,178,26,0.1)'; }}
                >
                  <Award size={11} /> {isMobile ? '+ Issue' : 'Issue Certificate'}
                </button>
              </div>

              {(() => {
                const memberCerts = getCertificatesByEmail(selectedMember.email);
                if (memberCerts.length === 0) {
                  return (
                    <div style={{
                      fontSize: 12, color: 'rgba(255,255,255,0.35)', padding: '14px',
                      background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 12, textAlign: 'center'
                    }}>
                      No certificates issued yet for this member.
                    </div>
                  );
                }
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {memberCerts.map(cert => (
                      <div key={cert.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 10, padding: isMobile ? '10px 12px' : '12px 16px'
                      }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cert.level_title}
                          </div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {new Date(cert.issued_at).toLocaleDateString()} · {cert.verified_jobs_count > 0 ? `${cert.verified_jobs_count} jobs` : 'Induction'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                            background: cert.status === 'ISSUED' ? 'rgba(24,252,92,0.12)' : 'rgba(239,68,68,0.12)',
                            color: cert.status === 'ISSUED' ? RF_MINT_ACCENT : '#FCA5A5',
                            border: `1px solid ${cert.status === 'ISSUED' ? 'rgba(24,252,92,0.25)' : 'rgba(239,68,68,0.25)'}`,
                            whiteSpace: 'nowrap'
                          }}>
                            {cert.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleViewCertificate(cert)}
                            style={{
                              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                              color: 'rgba(255,255,255,0.85)', padding: '4px 10px', borderRadius: 6, fontSize: 11,
                              fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Eye size={11} /> View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* ── FOOTER ACTIONS ── */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between',
              gap: 12,
              paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              {/* Rank Dropdown */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'flex-start',
                gap: 8, background: isMobile ? 'rgba(0,0,0,0.25)' : 'transparent',
                border: isMobile ? '1px solid rgba(255,255,255,0.08)' : 'none',
                borderRadius: isMobile ? 10 : 0, padding: isMobile ? '6px 12px' : 0
              }}>
                <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  Rank Promotion:
                </span>
                <select
                  value={selectedMember.contributor_level || 'LEVEL_1'}
                  onChange={e => handlePromoteMemberLevel(selectedMember.email, e.target.value as any)}
                  style={{
                    background: isMobile ? 'transparent' : 'rgba(0,0,0,0.4)',
                    border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    color: RF_GOLD_YELLOW, padding: isMobile ? '4px 0' : '7px 28px 7px 12px',
                    borderRadius: 8, fontSize: 12,
                    fontWeight: 700, outline: 'none', cursor: 'pointer',
                    textAlign: isMobile ? 'right' : 'left'
                  }}
                >
                  <option value="LEVEL_1">L1 · Associate</option>
                  <option value="LEVEL_2">L2 · Lead Builder</option>
                  <option value="LEVEL_3">L3 · Squad Architect</option>
                  <option value="LEVEL_4">L4 · Division Strategist</option>
                  <option value="LEVEL_5">L5 · Founding Partner</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: isMobile ? '100%' : 'auto', flexWrap: 'wrap'
              }}>
                {(isSuperAdmin || loggedInStaff?.role === 'MANAGER') && !selectedMember.is_suspended && (
                  <button
                    onClick={() => {
                      setMemberModalOpen(false);
                      handleOpenAppointSquadLead(selectedMember);
                    }}
                    style={{
                      flex: isMobile ? 1 : 'none',
                      background: 'rgba(251, 191, 36, 0.14)', border: '1px solid rgba(251, 191, 36, 0.4)',
                      color: RF_GOLD_YELLOW, padding: isMobile ? '10px 14px' : '8px 16px', borderRadius: 100, fontSize: 12,
                      fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(251, 191, 36, 0.25)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(251, 191, 36, 0.14)')}
                  >
                    <Star size={13} /> Appoint Squad Lead
                  </button>
                )}
                {selectedMember.is_suspended ? (
                  <button
                    onClick={() => handleReactivateMember(selectedMember)}
                    style={{
                      flex: isMobile ? 1 : 'none',
                      background: 'rgba(24,252,92,0.15)', border: `1px solid ${RF_LEAF_GREEN}`,
                      color: RF_MINT_ACCENT, padding: isMobile ? '10px 14px' : '8px 16px', borderRadius: 100, fontSize: 12,
                      fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <CheckCircle2 size={13} /> Reactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenSuspendModal(selectedMember)}
                    style={{
                      flex: isMobile ? 1 : 'none',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)',
                      color: '#FCA5A5', padding: isMobile ? '10px 14px' : '8px 16px', borderRadius: 100, fontSize: 12,
                      fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Ban size={13} /> Suspend Member
                  </button>
                )}
                <button
                  onClick={() => setMemberModalOpen(false)}
                  style={{
                    flex: isMobile ? 1 : 'none',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF', padding: isMobile ? '10px 16px' : '8px 20px', borderRadius: 100, fontSize: 12,
                    fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ─── SUSPEND MEMBER CONFIRMATION MODAL ──────────────────────────────── */}
      {suspendModalMember && (
        <div
          onClick={() => setSuspendModalMember(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(5, 18, 11, 0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '12px 10px calc(16px + env(safe-area-inset-bottom, 16px))' : 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="rp-sleek-scroll"
            style={{
              maxWidth: 540, width: '100%',
              maxHeight: isMobile ? 'calc(100dvh - 28px - env(safe-area-inset-bottom, 16px))' : '90vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              background: 'linear-gradient(145deg, #180B0B 0%, #0D0505 100%)', borderRadius: isMobile ? 18 : 24,
              border: '1px solid rgba(239, 68, 68, 0.45)',
              padding: isMobile ? '20px 18px calc(24px + env(safe-area-inset-bottom, 18px))' : 32,
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#EF4444'
              }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Suspend Pioneer Member
                </h3>
                <div style={{ fontSize: 13, color: '#FCA5A5', marginTop: 2 }}>
                  {suspendModalMember.full_name} ({suspendModalMember.email})
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 18 }}>
              Suspending this pioneer will immediately block their account access, revoke login sessions, and prevent them from submitting task proofs. The member will see the administrative reason provided below when attempting to sign in.
            </p>

            {/* Preset Common Reasons */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                Preset Suspension Reasons (Click to apply)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  'Violation of Refeir Pioneer Code of Conduct',
                  'Fraudulent or falsified task submission proof',
                  'Plagiarism or unauthorized work duplication',
                  'Inactivity or unresponsive during squad deliverables',
                  'Platform or community safety concern'
                ].map((reason, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSuspendReasonInput(reason)}
                    style={{
                      background: suspendReasonInput === reason ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${suspendReasonInput === reason ? '#EF4444' : 'rgba(255,255,255,0.12)'}`,
                      color: suspendReasonInput === reason ? '#FCA5A5' : 'rgba(255,255,255,0.8)',
                      padding: '4px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Reason Input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>
                Reason for Suspension (Visible to Member) *
              </label>
              <textarea
                value={suspendReasonInput}
                onChange={e => setSuspendReasonInput(e.target.value)}
                placeholder="Explain the specific reason for suspending this account..."
                rows={3}
                className="rp-input-modern rp-sleek-scroll"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setSuspendModalMember(null)}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
                  color: '#FFFFFF', padding: '10px 18px', borderRadius: 100, fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmSuspend}
                disabled={!suspendReasonInput.trim()}
                style={{
                  background: '#EF4444', color: '#FFFFFF', border: 'none',
                  padding: '10px 22px', borderRadius: 100, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                }}
              >
                <Ban size={14} /> Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ISSUE CERTIFICATE MODAL ────────────────────────────────────── */}
      {issueCertModalOpen && (
        <div
          onClick={() => setIssueCertModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(5, 18, 11, 0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '12px 10px calc(16px + env(safe-area-inset-bottom, 16px))' : 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="rp-sleek-scroll"
            style={{
              maxWidth: 580, width: '100%',
              maxHeight: isMobile ? 'calc(100dvh - 28px - env(safe-area-inset-bottom, 16px))' : '90vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              background: 'linear-gradient(145deg, #0B2416 0%, #061A0F 100%)', borderRadius: isMobile ? 18 : 24,
              border: '1px solid rgba(102, 187, 42, 0.35)',
              padding: isMobile ? '20px 16px calc(28px + env(safe-area-inset-bottom, 20px))' : '32px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)', position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, background: 'rgba(255, 209, 102, 0.15)',
                  border: `1px solid ${RF_GOLD_YELLOW}66`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: RF_GOLD_YELLOW, flexShrink: 0
                }}>
                  <Award size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Issue Pioneer Certificate
                  </h3>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                    Mint a tamper-evident accreditation credential for a verified contributor
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIssueCertModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)',
                  width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmIssueCertificate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Select Member */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>
                  Select Pioneer Contributor *
                </label>
                <select
                  value={issueCertMemberEmail}
                  onChange={e => setIssueCertMemberEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10,
                    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#FFFFFF', fontSize: 13, outline: 'none'
                  }}
                  required
                >
                  {membersList.map(m => (
                    <option key={m.id} value={m.email}>
                      {m.full_name} ({m.pioneer_id || 'PENDING'} • {m.division} • {getVerifiedJobsCount(m.email)} verified jobs)
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Level to Certify */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>
                  Accreditation Tier Level *
                </label>
                <select
                  value={issueCertLevel}
                  onChange={e => setIssueCertLevel(e.target.value as any)}
                  style={{
                    width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10,
                    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)',
                    color: RF_GOLD_YELLOW, fontSize: 13, fontWeight: 700, outline: 'none'
                  }}
                  required
                >
                  <option value="LEVEL_1">Level 1: Pioneer Associate (Orientation)</option>
                  <option value="LEVEL_2">Level 2: Refeir Pioneer (15+ verified deliverables)</option>
                  <option value="LEVEL_3">Level 3: Refeir Builder (40+ verified deliverables)</option>
                  <option value="LEVEL_4">Level 4: Refeir Lead (75+ verified deliverables)</option>
                  <option value="LEVEL_5">Level 5: Refeir Core Team (125+ verified deliverables)</option>
                </select>
              </div>

              {/* Verified Jobs Notice */}
              {(() => {
                const targetMember = membersList.find(m => m.email.toLowerCase() === issueCertMemberEmail.toLowerCase());
                const verifiedCount = targetMember ? getVerifiedJobsCount(targetMember.email) : 0;
                const required = MIN_JOBS_FOR_PROMOTION[issueCertLevel] || 0;
                const meets = verifiedCount >= required;

                return (
                  <div style={{
                    background: meets ? 'rgba(24, 252, 92, 0.08)' : 'rgba(255, 209, 102, 0.08)',
                    border: `1px solid ${meets ? RF_LEAF_GREEN : RF_GOLD_YELLOW}44`,
                    padding: '10px 14px', borderRadius: 10, fontSize: 12, color: '#FFFFFF'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: 2 }}>
                      <span>Verified Deliverables Logged:</span>
                      <span style={{ color: meets ? RF_MINT_ACCENT : RF_GOLD_YELLOW }}>{verifiedCount} / {required} required</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
                      {meets ? '✓ Contributor satisfies the 5x verified proof-of-work quota for this accreditation.' : '⚠️ Contributor has not reached the standard 5x quota. Administrator manual override is active.'}
                    </span>
                  </div>
                );
              })()}

              {/* Commendation / Special Distinction */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>
                  Special Distinction &amp; Commendation Note
                </label>
                <input
                  type="text"
                  value={issueCertDistinction}
                  onChange={e => setIssueCertDistinction(e.target.value)}
                  placeholder="e.g. Founding 100 Distinction • Outstanding UI Architecture"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIssueCertModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
                    color: '#FFFFFF', padding: '10px 18px', borderRadius: 100, fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                    padding: '10px 22px', borderRadius: 100, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: `0 4px 14px ${RF_LEAF_GREEN}44`
                  }}
                >
                  <Award size={15} /> Issue &amp; Mint Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ANNOUNCE NEW SQUAD TASK / BOUNTY MODAL ───────────────────────── */}
      {newTaskModalOpen && (
        <div
          onClick={() => setNewTaskModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(3, 10, 6, 0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: isMobile ? 'flex-end' : 'center',
            justifyContent: 'center',
            padding: isMobile ? 0 : 20,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="rp-sleek-scroll"
            style={{
              maxWidth: 720,
              width: '100%',
              maxHeight: isMobile ? 'calc(100dvh - 20px)' : '88vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              background: 'linear-gradient(175deg, #0A2216 0%, #05140C 100%)',
              borderRadius: isMobile ? '24px 24px 0 0' : 24,
              border: '1px solid rgba(24, 252, 92, 0.22)',
              boxShadow: '0 32px 80px -16px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.04) inset',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Top Glowing Emerald Accent Line */}
            <div
              style={{
                height: 2,
                width: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(24, 252, 92, 0.6), transparent)',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}
            />

            {/* Modal Header */}
            <div
              style={{
                padding: isMobile ? '18px 20px 14px' : '26px 30px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 2,
                background: 'rgba(10, 34, 22, 0.96)',
                backdropFilter: 'blur(16px)',
                zIndex: 5
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(24, 252, 92, 0.12)',
                    border: '1px solid rgba(24, 252, 92, 0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: RF_MINT_ACCENT,
                    flexShrink: 0
                  }}
                >
                  <Radio size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: isMobile ? 17 : 19, fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
                      Squad Mission Broadcast
                    </h3>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: RF_MINT_ACCENT,
                        background: 'rgba(24, 252, 92, 0.12)',
                        border: '1px solid rgba(24, 252, 92, 0.25)',
                        padding: '2px 7px',
                        borderRadius: 100,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      Protocol
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                    Publish missions and distribute Airtime, Data, or Cash bounties across squads
                  </div>
                </div>
              </div>

              <button
                onClick={() => setNewTaskModalOpen(false)}
                aria-label="Close modal"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.75)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form
              onSubmit={handleCreateTask}
              style={{
                padding: isMobile ? '20px 18px calc(24px + env(safe-area-inset-bottom, 16px))' : '26px 30px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20
              }}
            >
              {/* Mission Title */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Mission Title *
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Campus Viral Loop: Share Refeir Milestone Carousel to WhatsApp Status"
                  className="rp-input-modern"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.035)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: 13.5,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              {/* Target Squad & Cycle Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Target Squad / Division *
                  </label>
                  <select
                    value={newTaskSquad}
                    onChange={e => setNewTaskSquad(e.target.value as any)}
                    className="rp-input-modern"
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 14px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.035)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: 13,
                      outline: 'none'
                    }}
                    required
                  >
                    <option value="GENERAL">General Community (All Squads)</option>
                    <option value="TECHNOLOGY">Technology &amp; Protocol</option>
                    <option value="CREATIVE">Brand Strategy &amp; Creative</option>
                    <option value="GROWTH">Growth &amp; Virality</option>
                    <option value="COMMUNITY">Community &amp; Culture</option>
                    <option value="OPERATIONS">Operations &amp; Delivery</option>
                    <option value="ENTERPRISE">Enterprise &amp; BD</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Sprint Cycle / Frequency *
                  </label>
                  <select
                    value={newTaskFrequency}
                    onChange={e => setNewTaskFrequency(e.target.value as any)}
                    className="rp-input-modern"
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 14px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.035)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: 13,
                      outline: 'none'
                    }}
                    required
                  >
                    <option value="DAILY">Daily Task (24-Hour Sprint)</option>
                    <option value="WEEKLY">Weekly Sprint Objective</option>
                    <option value="FLASH_BOUNTY">Flash Bounty (Limited Window)</option>
                  </select>
                </div>
              </div>

              {/* Category & Deadline Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Task Category *
                  </label>
                  <input
                    type="text"
                    value={newTaskCategory}
                    onChange={e => setNewTaskCategory(e.target.value)}
                    placeholder="e.g. Liking, Commenting & Viral Loop Sharing"
                    className="rp-input-modern"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.035)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: 13,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Submission Deadline
                  </label>
                  <input
                    type="text"
                    value={newTaskDeadline}
                    onChange={e => setNewTaskDeadline(e.target.value)}
                    placeholder="e.g. Today 11:59 PM WAT"
                    className="rp-input-modern"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.035)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: 13,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Special Bonus / Bounty Incentive Box */}
              <div
                style={{
                  background: 'linear-gradient(145deg, rgba(246, 178, 26, 0.04) 0%, rgba(24, 252, 92, 0.02) 100%)',
                  borderRadius: 16,
                  padding: '18px 20px',
                  border: '1px solid rgba(246, 178, 26, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: 'rgba(246, 178, 26, 0.12)',
                        border: '1px solid rgba(246, 178, 26, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: RF_GOLD_YELLOW
                      }}
                    >
                      <Gift size={15} />
                    </div>
                    <div>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: RF_GOLD_YELLOW, letterSpacing: '-0.01em' }}>
                        Incentivized Bounty Motivation
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginLeft: 8 }}>
                        Airtime, Data, Cash, or XP
                      </span>
                    </div>
                  </div>
                  {newTaskBountyType !== 'NONE' && (
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: RF_GOLD_YELLOW,
                        background: 'rgba(246, 178, 26, 0.15)',
                        border: '1px solid rgba(246, 178, 26, 0.35)',
                        padding: '2px 8px',
                        borderRadius: 100
                      }}
                    >
                      Active Bounty
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      Bounty Reward Type *
                    </label>
                    <select
                      value={newTaskBountyType}
                      onChange={e => setNewTaskBountyType(e.target.value as any)}
                      className="rp-input-modern"
                      style={{
                        width: '100%',
                        padding: '9px 38px 9px 12px',
                        borderRadius: 10,
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(246, 178, 26, 0.25)',
                        color: '#FFFFFF',
                        fontSize: 12.5,
                        outline: 'none'
                      }}
                      required
                    >
                      <option value="AIRTIME">Airtime Giveaway (e.g. ₦1,500 Airtime)</option>
                      <option value="DATA">Data Subscription (e.g. 5GB - 10GB Data)</option>
                      <option value="CASH">Monetary Cash Bounty (Direct Payout)</option>
                      <option value="XP_CREDIT">Sovereign Deliverable XP Credit</option>
                      <option value="NONE">No Special Bounty (Standard Deliverable)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      Bounty Prize Label
                    </label>
                    <input
                      type="text"
                      value={newTaskBountyReward}
                      onChange={e => setNewTaskBountyReward(e.target.value)}
                      placeholder="e.g. ₦1,500 Airtime Voucher or 10GB Data"
                      className="rp-input-modern"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 10,
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(246, 178, 26, 0.25)',
                        color: '#FFFFFF',
                        fontSize: 12.5,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      Max Claims / Winner Cap
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={newTaskMaxClaims}
                      onChange={e => setNewTaskMaxClaims(Number(e.target.value))}
                      className="rp-input-modern"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 10,
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: 12.5,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      Verification Format
                    </label>
                    <input
                      type="text"
                      defaultValue="Screenshot Proof + Live Post Link"
                      placeholder="e.g. Screenshot Proof + Live Post Link"
                      className="rp-input-modern"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 10,
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: 12.5,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    Bounty Claim Instructions
                  </label>
                  <input
                    type="text"
                    value={newTaskBountyInstructions}
                    onChange={e => setNewTaskBountyInstructions(e.target.value)}
                    placeholder="e.g. First 10 verified submissions will receive instant mobile airtime voucher on WhatsApp."
                    className="rp-input-modern"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: 12,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Task Description */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Mission Briefing &amp; Context *
                </label>
                <textarea
                  value={newTaskDescription}
                  onChange={e => setNewTaskDescription(e.target.value)}
                  rows={3}
                  placeholder="Explain the mission purpose, why this matters for Refeir, and the target audience..."
                  className="rp-input-modern rp-sleek-scroll"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.035)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    lineHeight: 1.55,
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              {/* Requirements Checklist (Newline separated) */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Deliverable Requirements (One per line)
                </label>
                <textarea
                  value={newTaskRequirements}
                  onChange={e => setNewTaskRequirements(e.target.value)}
                  rows={3}
                  placeholder="1. Like and leave an insightful comment on the linked post&#10;2. Share to your WhatsApp status or story&#10;3. Take a screenshot showing your engagement&#10;4. Submit proof via Refeir Pioneers submit portal"
                  className="rp-input-modern rp-sleek-scroll"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.035)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* WhatsApp Broadcast Live Preview Card */}
              <div
                style={{
                  background: 'linear-gradient(145deg, rgba(37, 211, 102, 0.05) 0%, rgba(15, 46, 30, 0.2) 100%)',
                  border: '1px solid rgba(37, 211, 102, 0.25)',
                  borderRadius: 16,
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#25D366', fontSize: 12, fontWeight: 700 }}>
                    <MessageSquare size={14} />
                    <span>WhatsApp Broadcast Format (Ready for Community Groups)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `📢 *REFEIR PIONEERS • ${newTaskFrequency.replace('_', ' ')} MISSION*\n🎯 *Squad:* ${SQUAD_INFO[newTaskSquad]?.name || 'All Squads'}\n━━━━━━━━━━━━━━━━━━━━\n⚡ *${newTaskTitle || 'Mission Title'}*\n${newTaskBountyType !== 'NONE' ? `🎁 *Bounty Reward:* ${newTaskBountyReward || 'Special Bounty'}\n` : ''}⏱️ *Deadline:* ${newTaskDeadline}\n━━━━━━━━━━━━━━━━━━━━\n👉 *Full briefing & submit proof:* ${window.location.origin}/tasks`;
                      navigator.clipboard.writeText(msg);
                      alert('Broadcast message copied to clipboard!');
                    }}
                    style={{
                      background: 'rgba(37, 211, 102, 0.12)',
                      border: '1px solid rgba(37, 211, 102, 0.3)',
                      color: '#25D366',
                      padding: '4px 10px',
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Copy size={11} /> Copy Preview
                  </button>
                </div>

                <div
                  className="rp-sleek-scroll"
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    background: '#091A12',
                    border: '1px solid rgba(37, 211, 102, 0.18)',
                    padding: '12px 14px',
                    borderRadius: 10,
                    maxHeight: 180,
                    overflowY: 'auto'
                  }}
                >
{`📢 *REFEIR PIONEERS • ${newTaskFrequency.replace('_', ' ')} MISSION*
🎯 *Squad:* ${SQUAD_INFO[newTaskSquad]?.name || 'All Squads'}
━━━━━━━━━━━━━━━━━━━━
⚡ *${newTaskTitle || 'Mission Title'}*
${newTaskBountyType !== 'NONE' ? `🎁 *Bounty Reward:* ${newTaskBountyReward || 'Special Bounty'}\n` : ''}⏱️ *Deadline:* ${newTaskDeadline}
━━━━━━━━━━━━━━━━━━━━
👉 *Full briefing & submit proof:* ${window.location.origin}/tasks`}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 6,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(255, 255, 255, 0.07)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setNewTaskModalOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    padding: '11px 22px',
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, #15B84B 100%)`,
                    color: '#061A0F',
                    border: 'none',
                    padding: '11px 28px',
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 18px rgba(24, 252, 92, 0.35)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 22px rgba(24, 252, 92, 0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(24, 252, 92, 0.35)';
                  }}
                >
                  <Radio size={14} /> Launch Broadcast Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CERTIFICATE INSPECTION / PRINT MODAL ───────────────────────── */}
      {isCertificateModalOpen && selectedCertificateForModal && (
        <CertificateModal
          certificate={selectedCertificateForModal}
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
        />
      )}

      {/* ─── FLOATING REFRESH SUCCESS TOAST ───────────────────────── */}
      {refreshSuccessToast && (
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? 'calc(24px + env(safe-area-inset-bottom, 16px))' : 32,
            right: isMobile ? 16 : 32,
            left: isMobile ? 16 : 'auto',
            zIndex: 99999,
            background: 'linear-gradient(135deg, #0D2E1C 0%, #07190F 100%)',
            border: `1.5px solid ${RF_MINT_ACCENT}`,
            borderRadius: 14,
            padding: '12px 18px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(24, 252, 92, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(24, 252, 92, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: RF_MINT_ACCENT,
              flexShrink: 0
            }}
          >
            <Check size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
              {refreshSuccessToast}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>
              All stores synchronized in real time
            </div>
          </div>
          <button
            onClick={() => setRefreshSuccessToast('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

