import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useI18n } from '../../context/I18nContext';
import { RefeirLogo } from './RefeirLogo';
import { GLOBAL_COUNTRIES, getCountryByName } from '../../data/countries';
import {
  ChevronDown,
  ChevronRight,
  Briefcase,
  Users,
  Sparkles,
  Code2,
  Brain,
  Palette,
  TrendingUp,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Lock,
  Wallet,
  Globe2,
  FileText,
  Award,
  ArrowRight,
  UserCheck,
  HelpCircle,
  X,
  LogIn,
  UserPlus,
  CheckCircle2,
  Building2,
  Sun,
  Moon,
  BookOpen,
  Star,
  Wrench,
  Handshake,
  Compass,
  LogOut,
  User,
  Settings,
  Eye,
  EyeOff,
  Bell,
  Mail,
  Zap,
  Clock,
  Trash2,
  MessageSquare,
  ArrowLeftRight,
  Headphones,
  LifeBuoy,
  Send,
  Check,
  LayoutDashboard,
  FolderKanban,
  Layers,
  Share2,
  Repeat,
  BarChart3,
  Activity,
  Search,
  Ticket,
  LineChart,
  Menu,
  Calculator
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

type ActiveDropdown =
  | 'recruit'
  | 'scout'
  | 'talent'
  | 'resources'
  // Talent flyouts
  | 'journey'
  | 'scale'
  | 'analytics'
  // Scout flyouts
  | 'network'
  | 'pipeline'
  | 'telemetry'
  // Client flyouts
  | 'projects'
  | 'talent-pipeline'
  | 'hiring-analytics'
  | null;

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, login, signup, logout, switchRole } = useAuth();
  const { language, setLanguage, languages, currentLangInfo } = useI18n();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    addAppNotification,
    directChats,
    unreadMessagesCount,
    markChatAsRead,
    markAllChatsAsRead
  } = useNotification();

  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationBox, setShowNotificationBox] = useState(false);
  const [showInboxBox, setShowInboxBox] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showSwitchProfile, setShowSwitchProfile] = useState(true);
  const [notificationFilter, setNotificationFilter] = useState<'ALL' | 'ADMIN' | 'VERIFICATION' | 'ESCROW' | 'JOBS' | 'REFERRALS' | 'SYSTEM'>('ALL');

  // Help Center Specific Header States
  const [showHelpLangDropdown, setShowHelpLangDropdown] = useState(false);
  const [showHelpUserMenu, setShowHelpUserMenu] = useState(false);
  const [showSupportRequestsModal, setShowSupportRequestsModal] = useState(false);

  // Form states for modals
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dialCode: '+1',
    role: 'SCOUT' as 'SCOUT' | 'TALENT' | 'CLIENT',
    country: 'United States'
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const inboxRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const helpLangRef = useRef<HTMLDivElement>(null);
  const helpUserMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getRoleDashboardPath = (role?: string) => {
    const r = role || currentUser?.active_role;
    if (r === 'TALENT') return '/dashboard/talent';
    if (r === 'CLIENT') return '/dashboard/client';
    if (r === 'ADMIN') return '/admin';
    return '/dashboard/scout';
  };

  // Close dropdowns and flyouts on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setActiveDropdown(null);
      }
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setShowNotificationBox(false);
      }
      if (inboxRef.current && !inboxRef.current.contains(target)) {
        setShowInboxBox(false);
      }
      if (helpRef.current && !helpRef.current.contains(target)) {
        setShowHelpMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (helpLangRef.current && !helpLangRef.current.contains(target)) {
        setShowHelpLangDropdown(false);
      }
      if (helpUserMenuRef.current && !helpUserMenuRef.current.contains(target)) {
        setShowHelpUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (dropdown: ActiveDropdown) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleDropdownClick = (dropdown: ActiveDropdown) => {
    setActiveDropdown(prev => (prev === dropdown ? null : dropdown));
  };

  const handleLinkClick = (path: string) => {
    setActiveDropdown(null);
    onNavigate(path);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() && loginPassword.trim()) {
      const email = loginEmail.trim();
      await login(email, loginPassword.trim());
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      onNavigate(getRoleDashboardPath());
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.email.trim() && signupForm.name.trim()) {
      const parts = signupForm.name.trim().split(' ');
      const targetRole = signupForm.role;
      await signup({
        first_name: parts[0],
        last_name: parts.slice(1).join(' ') || '',
        email: signupForm.email.trim(),
        password: signupForm.password.trim() || undefined,
        roles: [targetRole],
        active_role: targetRole,
        country: signupForm.country
      });
      setShowSignupModal(false);
      onNavigate(getRoleDashboardPath(targetRole));
    }
  };

  const isDarkTheme = theme === 'dark';
  const navPopoverBg = isDarkTheme ? '#07160D' : '#FFFFFF';
  const navPopoverBorder = '1.5px solid rgba(102, 187, 42, 0.35)';
  const navPopoverShadow = isDarkTheme ? '0 20px 50px rgba(0, 0, 0, 0.8)' : '0 20px 50px rgba(0, 0, 0, 0.12)';
  const isDark = isDarkTheme;
  const borderDivider = isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const navBorderDivider = borderDivider;
  const navTextCream = isDarkTheme ? 'var(--rf-cream)' : '#0F2E1B';
  const navTextMuted = isDarkTheme ? 'var(--rf-slate-400)' : '#527560';
  const userDisplayName = currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email : '';
  const userFirstName = currentUser?.first_name || currentUser?.email?.split('@')[0] || 'User';
  const userInitial = currentUser?.first_name?.charAt(0) || currentUser?.email?.charAt(0) || 'U';

  const renderNavFlyoutItem = (
    icon: React.ReactNode,
    title: string,
    desc: string,
    onClick: () => void,
    badge?: string,
    isGoldBadge?: boolean
  ) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.65rem',
        padding: '0.55rem 0.65rem',
        borderRadius: 'var(--rf-radius-md)',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        width: '100%'
      }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.background = isDarkTheme ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)';
        const titleEl = e.currentTarget.querySelector('.rf-flyout-item-title') as HTMLElement;
        if (titleEl) titleEl.style.color = 'var(--rf-leaf-green)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        const titleEl = e.currentTarget.querySelector('.rf-flyout-item-title') as HTMLElement;
        if (titleEl) titleEl.style.color = navTextCream;
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: isDarkTheme ? 'rgba(102, 187, 42, 0.12)' : 'rgba(102, 187, 42, 0.15)',
          color: 'var(--rf-leaf-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px'
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span
            className="rf-flyout-item-title"
            style={{ fontSize: '0.8125rem', fontWeight: 700, color: navTextCream, transition: 'color 0.15s ease' }}
          >
            {title}
          </span>
          {badge && (
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                padding: '0.1rem 0.4rem',
                borderRadius: '100px',
                background: isGoldBadge ? 'rgba(244, 185, 66, 0.2)' : 'rgba(102, 187, 42, 0.2)',
                color: isGoldBadge ? '#F4B942' : 'var(--rf-leaf-green)',
                border: isGoldBadge ? '1px solid rgba(244, 185, 66, 0.4)' : '1px solid rgba(102, 187, 42, 0.35)'
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.6875rem', color: navTextMuted, marginTop: '1px', lineHeight: 1.3 }}>
          {desc}
        </div>
      </div>
    </div>
  );

  const renderNavFlyoutHeading = (title: string, isGold?: boolean) => (
    <div
      style={{
        padding: '0.5rem 0.65rem 0.25rem',
        marginTop: '0.35rem',
        borderTop: `1px solid ${navBorderDivider}`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem'
      }}
    >
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: isGold ? '#F4B942' : 'var(--rf-leaf-green)'
        }}
      >
        {title}
      </span>
    </div>
  );

  return (
    <>
      <header className="rf-header" ref={headerRef}>
        {currentPath === '/help' || currentPath.startsWith('/help') ? (
          /* =========================================================================
             DEDICATED HELP & SUPPORT NAVBAR
             ========================================================================= */
          <div className="rf-container-wide rf-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {/* LEFT: Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => handleLinkClick('/')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0
                }}
                aria-label="Refeir Home"
              >
                <RefeirLogo size="md" isLight={theme === 'dark'} showTagline={false} />
              </button>
            </div>

            {/* RIGHT: Items aligned starting from 1 to 5 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              {/* 1. Go to Refeir */}
              <button
                onClick={() => handleLinkClick('/')}
                className="rf-btn rf-btn-ghost rf-btn-sm"
                style={{
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--rf-radius-md)'
                }}
              >
                <span>Go to Refeir</span>
              </button>

              {/* 2. Go to Refeir Pro */}
              <button
                onClick={() => handleLinkClick('/business')}
                className="rf-btn rf-btn-ghost rf-btn-sm"
                style={{
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--rf-radius-md)'
                }}
              >
                <span>Go to Refeir Pro</span>
              </button>

              {/* 3. My support requests */}
              <button
                onClick={() => setShowSupportRequestsModal(true)}
                className="rf-btn rf-btn-ghost rf-btn-sm"
                style={{
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--rf-radius-md)'
                }}
              >
                <span>My support requests</span>
              </button>

              {/* 4. Language selector dropdown (Default: English (United States)) */}
              <div style={{ position: 'relative' }} ref={helpLangRef}>
                <button
                  onClick={() => setShowHelpLangDropdown(!showHelpLangDropdown)}
                  className="rf-btn rf-btn-ghost rf-btn-sm"
                  style={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F0F7F2',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: 'var(--rf-radius-full)',
                    padding: '0.4rem 0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>{currentLangInfo.name}</span>
                  <ChevronDown size={13} style={{ transform: showHelpLangDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>

                {showHelpLangDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: '230px',
                      background: navPopoverBg,
                      border: `1px solid ${borderDivider}`,
                      borderRadius: 'var(--rf-radius-lg)',
                      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
                      padding: '0.5rem',
                      zIndex: 1000,
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--rf-leaf-green)', textTransform: 'uppercase', padding: '0.4rem 0.6rem 0.2rem', letterSpacing: '0.04em' }}>
                      Select Language
                    </div>
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowHelpLangDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.55rem 0.75rem',
                          borderRadius: 'var(--rf-radius-md)',
                          background: language === lang.code ? (isDark ? 'rgba(102, 187, 42, 0.15)' : 'rgba(102, 187, 42, 0.12)') : 'none',
                          border: 'none',
                          color: language === lang.code ? 'var(--rf-leaf-green)' : (isDark ? 'var(--rf-cream)' : '#0F2E1B'),
                          fontWeight: language === lang.code ? 800 : 500,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <span>{lang.name}</span>
                        <span style={{ fontSize: '0.72rem', color: isDark ? 'var(--rf-slate-400)' : '#527560' }}>{lang.native_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. User Login / Profile Area */}
              {currentUser ? (
                <div style={{ position: 'relative' }} ref={helpUserMenuRef}>
                  <button
                    onClick={() => setShowHelpUserMenu(!showHelpUserMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                      border: '1.5px solid rgba(102, 187, 42, 0.35)',
                      borderRadius: 'var(--rf-radius-full)',
                      padding: '0.35rem 0.75rem 0.35rem 0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: '0.84rem', color: isDark ? 'var(--rf-cream)' : '#0F2E1B' }}>
                      {userFirstName}
                    </span>
                    <ChevronDown size={13} style={{ transform: showHelpUserMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: 'var(--rf-slate-400)' }} />
                  </button>

                  {showHelpUserMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        minWidth: '220px',
                        background: navPopoverBg,
                        border: `1px solid ${borderDivider}`,
                        borderRadius: 'var(--rf-radius-lg)',
                        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
                        padding: '0.5rem',
                        zIndex: 1000,
                        backdropFilter: 'blur(12px)'
                      }}
                    >
                      {/* Profile info header */}
                      <div style={{ padding: '0.5rem 0.75rem 0.45rem', borderBottom: `1px solid ${borderDivider}`, marginBottom: '0.35rem' }}>
                        <div style={{ fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', fontSize: '0.875rem' }}>{userDisplayName}</div>
                        <div style={{ fontSize: '0.72rem', color: isDark ? 'var(--rf-slate-400)' : '#527560' }}>{currentUser.email}</div>
                      </div>

                      {/* a. Profile */}
                      <button
                        onClick={() => {
                          setShowHelpUserMenu(false);
                          handleLinkClick('/account/profile');
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.55rem 0.75rem',
                          borderRadius: 'var(--rf-radius-md)',
                          background: 'none',
                          border: 'none',
                          color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                          fontWeight: 600,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>Profile</span>
                      </button>

                      {/* b. Contact details */}
                      <button
                        onClick={() => {
                          setShowHelpUserMenu(false);
                          handleLinkClick('/settings');
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.55rem 0.75rem',
                          borderRadius: 'var(--rf-radius-md)',
                          background: 'none',
                          border: 'none',
                          color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                          fontWeight: 600,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>Contact details</span>
                      </button>

                      {/* c. Sign Out */}
                      <div style={{ borderTop: `1px solid ${borderDivider}`, marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                        <button
                          onClick={() => {
                            logout();
                            setShowHelpUserMenu(false);
                            handleLinkClick('/');
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.55rem 0.75rem',
                            borderRadius: 'var(--rf-radius-md)',
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="rf-btn rf-btn-primary rf-btn-sm"
                  style={{
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    padding: '0.4rem 1.15rem',
                    borderRadius: 'var(--rf-radius-md)',
                    boxShadow: '0 2px 8px rgba(102, 187, 42, 0.3)'
                  }}
                >
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================================
             STANDARD MARKETPLACE & APP NAVBAR
             ========================================================================= */
          <div className="rf-container-wide rf-header-inner">
            
            {/* LEFT SIDE: Brand Logo + Navigation Menus */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Logo */}
              <button
                onClick={() => handleLinkClick(currentUser ? getRoleDashboardPath(currentUser.active_role) : '/')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0
                }}
                aria-label="Refeir Home"
              >
                <RefeirLogo size="md" isLight={theme === 'dark'} showTagline={false} />
              </button>

            {/* Navigation Menus */}
            <nav className="rf-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {currentUser ? (
                /* =========================================================================
                   LOGGED-IN ROLE-SPECIFIC NAVIGATION
                   ========================================================================= */
                currentUser.active_role === 'TALENT' ? (
                  /* --- 1. TALENT NAVIGATION --- */
                  <>
                    {/* Direct Dashboard */}
                    <button
                      className={`rf-nav-dropdown-trigger ${currentPath === '/dashboard/talent' ? 'active' : ''}`}
                      onClick={() => handleLinkClick('/dashboard/talent')}
                      style={{ fontWeight: 700 }}
                    >
                      <LayoutDashboard size={14} style={{ marginRight: '0.2rem' }} />
                      <span>Dashboard</span>
                    </button>

                    {/* My Journey (Flyout) */}
                    <div
                      className="rf-nav-dropdown-wrapper"
                      onMouseEnter={() => handleMouseEnter('journey')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`rf-nav-dropdown-trigger ${activeDropdown === 'journey' ? 'active' : ''}`}
                        onClick={() => handleDropdownClick('journey')}
                        aria-expanded={activeDropdown === 'journey'}
                      >
                        <span>My Journey</span>
                        <ChevronDown size={13} className="chevron" />
                      </button>

                      {activeDropdown === 'journey' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            minWidth: '270px',
                            background: navPopoverBg,
                            border: navPopoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: navPopoverShadow,
                            padding: '0.65rem',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(20px)'
                          }}
                          onMouseEnter={() => handleMouseEnter('journey')}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderNavFlyoutItem(<FolderKanban size={15} />, 'Orders', 'Active milestones & deliverables', () => handleLinkClick('/dashboard/talent'))}
                          {renderNavFlyoutItem(<Layers size={15} />, 'Gigs', 'Manage published service packages', () => handleLinkClick('/dashboard/talent'))}
                          {renderNavFlyoutItem(<User size={15} />, 'Profile', 'Public portfolio & skills bio', () => handleLinkClick('/profile'))}
                          {renderNavFlyoutItem(<Wallet size={15} />, 'Earnings', 'Escrow payouts & multi-currency wallet', () => handleLinkClick('/wallet'))}
                        </div>
                      )}
                    </div>

                    {/* Scale Metrics (Flyout) */}
                    <div
                      className="rf-nav-dropdown-wrapper"
                      onMouseEnter={() => handleMouseEnter('scale')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`rf-nav-dropdown-trigger ${activeDropdown === 'scale' ? 'active' : ''}`}
                        onClick={() => handleDropdownClick('scale')}
                        aria-expanded={activeDropdown === 'scale'}
                      >
                        <span>Scale Metrics</span>
                        <ChevronDown size={13} className="chevron" />
                      </button>

                      {activeDropdown === 'scale' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            minWidth: '285px',
                            background: navPopoverBg,
                            border: navPopoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: navPopoverShadow,
                            padding: '0.65rem',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(20px)'
                          }}
                          onMouseEnter={() => handleMouseEnter('scale')}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderNavFlyoutItem(<Award size={15} />, 'Level Overview', 'KYC status & verified badge tier', () => handleLinkClick('/verification'))}
                          {renderNavFlyoutItem(<CheckCircle2 size={15} />, 'Endorsements', 'Reputation & verified reviews', () => handleLinkClick('/dashboard/talent'))}
                          {renderNavFlyoutItem(<MessageSquare size={15} />, 'Contacts', 'Client & scout messaging threads', () => handleLinkClick('/messages'))}
                          {renderNavFlyoutHeading('Talent Plus', true)}
                          {renderNavFlyoutItem(<Sparkles size={15} color="#F4B942" />, 'Program Benefits', 'Featured carousel boost & 0% fee rate', () => handleLinkClick('/pricing'), 'Pro', true)}
                        </div>
                      )}
                    </div>

                    {/* Analytics (Flyout) */}
                    <div
                      className="rf-nav-dropdown-wrapper"
                      onMouseEnter={() => handleMouseEnter('analytics')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`rf-nav-dropdown-trigger ${activeDropdown === 'analytics' ? 'active' : ''}`}
                        onClick={() => handleDropdownClick('analytics')}
                        aria-expanded={activeDropdown === 'analytics'}
                      >
                        <span>Analytics</span>
                        <ChevronDown size={13} className="chevron" />
                      </button>

                      {activeDropdown === 'analytics' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            minWidth: '280px',
                            background: navPopoverBg,
                            border: navPopoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: navPopoverShadow,
                            padding: '0.65rem',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(20px)'
                          }}
                          onMouseEnter={() => handleMouseEnter('analytics')}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderNavFlyoutItem(<BarChart3 size={15} />, 'Overview', 'Profile views, impressions & conversion', () => handleLinkClick('/dashboard/talent'))}
                          {renderNavFlyoutItem(<Repeat size={15} />, 'Repeat Service', 'Returning client retention & loyalty', () => handleLinkClick('/dashboard/talent'))}
                          {renderNavFlyoutHeading('Keyword Research')}
                          {renderNavFlyoutItem(<Search size={15} />, 'Keyword Research', 'High-demand pan-African skills index', () => handleLinkClick('/marketplace'))}
                        </div>
                      )}
                    </div>
                  </>
                ) : currentUser.active_role === 'SCOUT' ? (
                  /* --- 2. SCOUT NAVIGATION --- */
                  <>
                    {/* Direct Dashboard */}
                    <button
                      className={`rf-nav-dropdown-trigger ${currentPath === '/dashboard/scout' ? 'active' : ''}`}
                      onClick={() => handleLinkClick('/dashboard/scout')}
                      style={{ fontWeight: 700 }}
                    >
                      <LayoutDashboard size={14} style={{ marginRight: '0.2rem' }} />
                      <span>Dashboard</span>
                    </button>

                    {/* My Network (Flyout) */}
                    <div
                      className="rf-nav-dropdown-wrapper"
                      onMouseEnter={() => handleMouseEnter('network')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`rf-nav-dropdown-trigger ${activeDropdown === 'network' ? 'active' : ''}`}
                        onClick={() => handleDropdownClick('network')}
                        aria-expanded={activeDropdown === 'network'}
                      >
                        <span>My Network</span>
                        <ChevronDown size={13} className="chevron" />
                      </button>

                      {activeDropdown === 'network' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            minWidth: '270px',
                            background: navPopoverBg,
                            border: navPopoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: navPopoverShadow,
                            padding: '0.65rem',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(20px)'
                          }}
                          onMouseEnter={() => handleMouseEnter('network')}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderNavFlyoutItem(<Users size={15} />, 'Active Introductions', 'Live client-talent connections', () => handleLinkClick('/dashboard/scout'))}
                          {renderNavFlyoutItem(<Share2 size={15} />, 'Scout Links & QR', 'Encrypted referral tracking links', () => handleLinkClick('/dashboard/scout'))}
                          {renderNavFlyoutItem(<User size={15} />, 'Profile', 'Scout credentials & reputation status', () => handleLinkClick('/profile'))}
                          {renderNavFlyoutItem(<Wallet size={15} />, 'Earnings', '10% automatic escrow splits ledger', () => handleLinkClick('/wallet'))}
                        </div>
                      )}
                    </div>

                    {/* Pipeline Metrics (Flyout) */}
                    <div
                      className="rf-nav-dropdown-wrapper"
                      onMouseEnter={() => handleMouseEnter('pipeline')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`rf-nav-dropdown-trigger ${activeDropdown === 'pipeline' ? 'active' : ''}`}
                        onClick={() => handleDropdownClick('pipeline')}
                        aria-expanded={activeDropdown === 'pipeline'}
                      >
                        <span>Pipeline Metrics</span>
                        <ChevronDown size={13} className="chevron" />
                      </button>

                      {activeDropdown === 'pipeline' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            minWidth: '285px',
                            background: navPopoverBg,
                            border: navPopoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: navPopoverShadow,
                            padding: '0.65rem',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(20px)'
                          }}
                          onMouseEnter={() => handleMouseEnter('pipeline')}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderNavFlyoutItem(<Award size={15} />, 'Scout Tier & Levels', 'Elite Scout ranking & badges', () => handleLinkClick('/verification'))}
                          {renderNavFlyoutItem(<Compass size={15} />, 'Talent Roster', 'Browse & endorse African talent', () => handleLinkClick('/marketplace'))}
                          {renderNavFlyoutItem(<MessageSquare size={15} />, 'Contacts', 'Client negotiations & introductions', () => handleLinkClick('/messages'))}
                          {renderNavFlyoutHeading('Scout Plus', true)}
                          {renderNavFlyoutItem(<Ticket size={15} color="#F4B942" />, 'Airfee & Token Yields', 'Monthly token grants & 0% fee rate', () => handleLinkClick('/pricing'), 'Pro', true)}
                        </div>
                      )}
                    </div>

                    {/* Telemetry (Flyout) */}
                    <div
                      className="rf-nav-dropdown-wrapper"
                      onMouseEnter={() => handleMouseEnter('telemetry')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`rf-nav-dropdown-trigger ${activeDropdown === 'telemetry' ? 'active' : ''}`}
                        onClick={() => handleDropdownClick('telemetry')}
                        aria-expanded={activeDropdown === 'telemetry'}
                      >
                        <span>Telemetry</span>
                        <ChevronDown size={13} className="chevron" />
                      </button>

                      {activeDropdown === 'telemetry' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            minWidth: '280px',
                            background: navPopoverBg,
                            border: navPopoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: navPopoverShadow,
                            padding: '0.65rem',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(20px)'
                          }}
                          onMouseEnter={() => handleMouseEnter('telemetry')}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderNavFlyoutItem(<Activity size={15} />, 'Link Telemetry', 'Live referral clicks & audit logs', () => handleLinkClick('/dashboard/scout'))}
                          {renderNavFlyoutItem(<TrendingUp size={15} />, 'Conversion Rates', 'Milestone settlement conversion rate', () => handleLinkClick('/dashboard/scout'))}
                          {renderNavFlyoutHeading('Opportunity Sourcing')}
                          {renderNavFlyoutItem(<Briefcase size={15} />, 'Hot Market Niches', 'High-budget client hiring briefs', () => handleLinkClick('/jobs'))}
                        </div>
                      )}
                    </div>
                  </>
                ) : currentUser.active_role === 'CLIENT' ? (
                  /* --- 3. CLIENT NAVIGATION --- */
                  <>
                    {/* Direct Dashboard */}
                    <button
                      className={`rf-nav-dropdown-trigger ${currentPath === '/dashboard/client' ? 'active' : ''}`}
                      onClick={() => handleLinkClick('/dashboard/client')}
                      style={{ fontWeight: 700 }}
                    >
                      <LayoutDashboard size={14} style={{ marginRight: '0.2rem' }} />
                      <span>Dashboard</span>
                    </button>

                    {/* My Projects (Flyout) */}
                    <div
                      className="rf-nav-dropdown-wrapper"
                      onMouseEnter={() => handleMouseEnter('projects')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`rf-nav-dropdown-trigger ${activeDropdown === 'projects' ? 'active' : ''}`}
                        onClick={() => handleDropdownClick('projects')}
                        aria-expanded={activeDropdown === 'projects'}
                      >
                        <span>My Projects</span>
                        <ChevronDown size={13} className="chevron" />
                      </button>

                      {activeDropdown === 'projects' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            minWidth: '270px',
                            background: navPopoverBg,
                            border: navPopoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: navPopoverShadow,
                            padding: '0.65rem',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(20px)'
                          }}
                          onMouseEnter={() => handleMouseEnter('projects')}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderNavFlyoutItem(<Briefcase size={15} />, 'Active Engagements', 'Live milestone protected contracts', () => handleLinkClick('/dashboard/client'))}
                          {renderNavFlyoutItem(<FileText size={15} />, 'Job Postings', 'Post & manage hiring requirements', () => handleLinkClick('/jobs'))}
                          {renderNavFlyoutItem(<Building2 size={15} />, 'Organization Profile', 'Company verification & billing', () => handleLinkClick('/profile'))}
                          {renderNavFlyoutItem(<Wallet size={15} />, 'Escrow & Invoices', 'Trust Vault & tax-compliant receipts', () => handleLinkClick('/wallet'))}
                        </div>
                      )}
                    </div>

                    {/* Talent Pipeline (Flyout) */}
                    <div
                      className="rf-nav-dropdown-wrapper"
                      onMouseEnter={() => handleMouseEnter('talent-pipeline')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`rf-nav-dropdown-trigger ${activeDropdown === 'talent-pipeline' ? 'active' : ''}`}
                        onClick={() => handleDropdownClick('talent-pipeline')}
                        aria-expanded={activeDropdown === 'talent-pipeline'}
                      >
                        <span>Talent Pipeline</span>
                        <ChevronDown size={13} className="chevron" />
                      </button>

                      {activeDropdown === 'talent-pipeline' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            minWidth: '285px',
                            background: navPopoverBg,
                            border: navPopoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: navPopoverShadow,
                            padding: '0.65rem',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(20px)'
                          }}
                          onMouseEnter={() => handleMouseEnter('talent-pipeline')}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderNavFlyoutItem(<UserCheck size={15} />, 'Hired Talent', 'Active working professionals', () => handleLinkClick('/dashboard/client'))}
                          {renderNavFlyoutItem(<Star size={15} />, 'Saved Shortlists', 'Curated talent bookmarks in 54 nations', () => handleLinkClick('/marketplace'))}
                          {renderNavFlyoutItem(<MessageSquare size={15} />, 'Contacts', 'Real-time scoping & negotiation chat', () => handleLinkClick('/messages'))}
                          {renderNavFlyoutHeading('Client Plus', true)}
                          {renderNavFlyoutItem(<Headphones size={15} color="#F4B942" />, 'Refeir Desk Concierge', 'Direct VIP matching in <24 hours', () => handleLinkClick('/dashboard/client'), 'Pro', true)}
                        </div>
                      )}
                    </div>

                    {/* Hiring Analytics (Flyout) */}
                    <div
                      className="rf-nav-dropdown-wrapper"
                      onMouseEnter={() => handleMouseEnter('hiring-analytics')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`rf-nav-dropdown-trigger ${activeDropdown === 'hiring-analytics' ? 'active' : ''}`}
                        onClick={() => handleDropdownClick('hiring-analytics')}
                        aria-expanded={activeDropdown === 'hiring-analytics'}
                      >
                        <span>Hiring Analytics</span>
                        <ChevronDown size={13} className="chevron" />
                      </button>

                      {activeDropdown === 'hiring-analytics' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            minWidth: '280px',
                            background: navPopoverBg,
                            border: navPopoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: navPopoverShadow,
                            padding: '0.65rem',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(20px)'
                          }}
                          onMouseEnter={() => handleMouseEnter('hiring-analytics')}
                          onMouseLeave={handleMouseLeave}
                        >
                          {renderNavFlyoutItem(<BarChart3 size={15} />, 'Spend & Escrow Overview', 'Budget utilization & escrow balances', () => handleLinkClick('/dashboard/client'))}
                          {renderNavFlyoutItem(<Zap size={15} />, 'Delivery Velocity', 'Contract turnaround & acceptance rate', () => handleLinkClick('/dashboard/client'))}
                          {renderNavFlyoutHeading('Talent Sourcing')}
                          {renderNavFlyoutItem(<TrendingUp size={15} />, 'Market Rate Benchmark', 'Pan-African talent pricing index', () => handleLinkClick('/pricing'))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* --- 4. ADMIN NAVIGATION --- */
                  <>
                    <button
                      className={`rf-nav-dropdown-trigger ${currentPath === '/admin' ? 'active' : ''}`}
                      onClick={() => handleLinkClick('/admin')}
                      style={{ fontWeight: 700 }}
                    >
                      <span>Admin Portal</span>
                    </button>
                    <button
                      className={`rf-nav-dropdown-trigger ${currentPath === '/disputes' ? 'active' : ''}`}
                      onClick={() => handleLinkClick('/disputes')}
                      style={{ fontWeight: 700 }}
                    >
                      <span>Arbitration</span>
                    </button>
                    <button
                      className={`rf-nav-dropdown-trigger ${currentPath === '/marketplace' ? 'active' : ''}`}
                      onClick={() => handleLinkClick('/marketplace')}
                      style={{ fontWeight: 700 }}
                    >
                      <span>Talent Pool</span>
                    </button>
                    <button
                      className={`rf-nav-dropdown-trigger ${currentPath === '/wallet' ? 'active' : ''}`}
                      onClick={() => handleLinkClick('/wallet')}
                      style={{ fontWeight: 700 }}
                    >
                      <span>Escrow Ledger</span>
                    </button>
                  </>
                )
              ) : (
                /* =========================================================================
                   PUBLIC GUEST NAVIGATION (RECRUIT, SCOUT, TALENT, PRICING, BUSINESS, RESOURCES)
                   ========================================================================= */
                <>
                  {/* 1. RECRUIT DROPDOWN */}
                  <div
                    className="rf-nav-dropdown-wrapper"
                    onMouseEnter={() => handleMouseEnter('recruit')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`rf-nav-dropdown-trigger ${activeDropdown === 'recruit' ? 'active' : ''}`}
                      onClick={() => handleDropdownClick('recruit')}
                      aria-expanded={activeDropdown === 'recruit'}
                    >
                      <span>Recruit</span>
                      <ChevronDown size={13} className="chevron" />
                    </button>

                {activeDropdown === 'recruit' && (
                  <div
                    className="rf-mega-menu rf-mega-menu-right"
                    style={{ minWidth: '640px' }}
                    onMouseEnter={() => handleMouseEnter('recruit')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="rf-mega-menu-grid">
                      {/* Left: Specialties */}
                      <div>
                        <div className="rf-mega-menu-col-title">
                          <Briefcase size={14} />
                          <span>Hire Top African Talent</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/marketplace?category=Engineering')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Code2 size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Software & Mobile Engineering</div>
                              <div className="rf-mega-menu-item-desc">Fullstack, Mobile, DevOps, and Backend engineers</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/marketplace?category=AI+%26+Data')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Brain size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">AI & Data Science</div>
                              <div className="rf-mega-menu-item-desc">LLM specialists, Data Analysts, ML engineers</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/marketplace?category=Design+%26+Creative')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Palette size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Design & UI/UX</div>
                              <div className="rf-mega-menu-item-desc">Product designers, Design systems, Brand architects</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/marketplace?category=Growth+%26+Marketing')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <TrendingUp size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Growth & Marketing</div>
                              <div className="rf-mega-menu-item-desc">Pan-African GTM, Performance marketers & SEO</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/marketplace?category=Legal+%26+Operations')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Scale size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Legal & FinTech Operations</div>
                              <div className="rf-mega-menu-item-desc">Regulatory compliance, African FinTech advisory</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Client Action Sidebar */}
                      <div className="rf-mega-menu-sidebar">
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', marginBottom: '0.5rem' }}>
                            CLIENT HIRING
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                            Vetted Talent with Trust Vault
                          </h4>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', lineHeight: 1.5, marginBottom: '1rem' }}>
                            Hire talent recommended by industry scouts. Funds stay protected in milestone Trust Vault until you approve the deliverable.
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleLinkClick('/jobs')}
                            className="rf-btn rf-btn-primary rf-btn-sm"
                            style={{ width: '100%', justifyContent: 'space-between' }}
                          >
                            <span>Post a Job Requirement</span>
                            <ArrowRight size={14} />
                          </button>
                          <button
                            onClick={() => handleLinkClick('/marketplace')}
                            className="rf-btn rf-btn-secondary rf-btn-sm"
                            style={{ width: '100%', justifyContent: 'space-between' }}
                          >
                            <span>Browse All 54 Nations</span>
                            <Globe2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. SCOUT DROPDOWN */}
              <div
                className="rf-nav-dropdown-wrapper"
                onMouseEnter={() => handleMouseEnter('scout')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`rf-nav-dropdown-trigger ${activeDropdown === 'scout' ? 'active' : ''}`}
                  onClick={() => handleDropdownClick('scout')}
                  aria-expanded={activeDropdown === 'scout'}
                >
                  <span>Scout</span>
                  <ChevronDown size={13} className="chevron" />
                </button>

                {activeDropdown === 'scout' && (
                  <div
                    className="rf-mega-menu rf-mega-menu-right"
                    style={{ minWidth: '600px' }}
                    onMouseEnter={() => handleMouseEnter('scout')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="rf-mega-menu-grid">
                      {/* Left: Scouting Links */}
                      <div>
                        <div className="rf-mega-menu-col-title">
                          <Sparkles size={14} />
                          <span>The Referral Economy</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/dashboard/scout')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Sparkles size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Scout Dashboard</div>
                              <div className="rf-mega-menu-item-desc">Track active referrals, conversion rates & locked rewards</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/marketplace')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Users size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Refer a Talent to Clients</div>
                              <div className="rf-mega-menu-item-desc">Generate one-click referral links & endorse peers</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/why-refeir')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <HelpCircle size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">How Scouting Works</div>
                              <div className="rf-mega-menu-item-desc">Learn about the 10% lifetime locked referral architecture</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/wallet')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Wallet size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Trust Vault Payouts & Multi-Currency</div>
                              <div className="rf-mega-menu-item-desc">Withdraw in USD, NGN, KES, GHS, or Mobile Money</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Scout Commission Box */}
                      <div className="rf-mega-menu-sidebar" style={{ background: 'linear-gradient(135deg, rgba(102, 187, 42, 0.08) 0%, rgba(246, 178, 26, 0.08) 100%)' }}>
                        <div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: '9999px', background: 'rgba(102, 187, 42, 0.18)', border: '1px solid rgba(102, 187, 42, 0.35)', marginBottom: '0.75rem' }}>
                            <Lock size={12} color="var(--rf-leaf-green)" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>10% GUARANTEED</span>
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                            Earn from Who You Know
                          </h4>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', lineHeight: 1.5, marginBottom: '1rem' }}>
                            Introduce a developer, designer, or specialist to a client and earn 10% on every milestone they ever complete on Refeir.
                          </p>
                        </div>

                        <button
                          onClick={() => handleLinkClick('/dashboard/scout')}
                          className="rf-btn rf-btn-primary rf-btn-sm"
                          style={{ width: '100%', justifyContent: 'space-between' }}
                        >
                          <span>Go to Scout Hub</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. TALENT DROPDOWN */}
              <div
                className="rf-nav-dropdown-wrapper"
                onMouseEnter={() => handleMouseEnter('talent')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`rf-nav-dropdown-trigger ${activeDropdown === 'talent' ? 'active' : ''}`}
                  onClick={() => handleDropdownClick('talent')}
                  aria-expanded={activeDropdown === 'talent'}
                >
                  <span>Talent</span>
                  <ChevronDown size={13} className="chevron" />
                </button>

                {activeDropdown === 'talent' && (
                  <div
                    className="rf-mega-menu rf-mega-menu-right"
                    style={{ minWidth: '600px' }}
                    onMouseEnter={() => handleMouseEnter('talent')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="rf-mega-menu-grid">
                      {/* Left: For Talent */}
                      <div>
                        <div className="rf-mega-menu-col-title">
                          <Award size={14} />
                          <span>For African Professionals</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/jobs')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <FileText size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Browse Open Jobs</div>
                              <div className="rf-mega-menu-item-desc">Explore cross-border and remote opportunities</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/dashboard/talent')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Briefcase size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Talent Workspace</div>
                              <div className="rf-mega-menu-item-desc">Manage ongoing contracts, deliverables & milestone releases</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/verification')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <UserCheck size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Get Verified</div>
                              <div className="rf-mega-menu-item-desc">Verify your identity and portfolio for 4x hire rate</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/disputes')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <ShieldCheck size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Payment & Milestone Protection</div>
                              <div className="rf-mega-menu-item-desc">Trust Vault security ensures you always get paid for approved work</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Talent CTA Box */}
                      <div className="rf-mega-menu-sidebar">
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', marginBottom: '0.5rem' }}>
                            GET REFERRED
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                            Work Globally. Earn Fairly.
                          </h4>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', lineHeight: 1.5, marginBottom: '1rem' }}>
                            Join thousands of skilled engineers, designers, and creators connecting with verified international clients.
                          </p>
                        </div>

                        <button
                          onClick={() => handleLinkClick('/dashboard/talent')}
                          className="rf-btn rf-btn-primary rf-btn-sm"
                          style={{ width: '100%', justifyContent: 'space-between' }}
                        >
                          <span>Enter Talent Portal</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. PRICING (Direct link) */}
              <button
                className={`rf-nav-dropdown-trigger ${currentPath === '/pricing' ? 'active' : ''}`}
                onClick={() => handleLinkClick('/pricing')}
              >
                <span>Pricing</span>
              </button>

              {/* 5. BUSINESS (Direct link) */}
              <button
                className={`rf-nav-dropdown-trigger ${currentPath === '/business' ? 'active' : ''}`}
                onClick={() => handleLinkClick('/business')}
              >
                <span>Business</span>
              </button>

              {/* 6. RESOURCES & DISCOVER DROPDOWN */}
              <div
                className="rf-nav-dropdown-wrapper"
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`rf-nav-dropdown-trigger ${activeDropdown === 'resources' ? 'active' : ''}`}
                  onClick={() => handleDropdownClick('resources')}
                  aria-expanded={activeDropdown === 'resources'}
                >
                  <span>Resources</span>
                  <ChevronDown size={13} className="chevron" />
                </button>

                {activeDropdown === 'resources' && (
                  <div
                    className="rf-mega-menu rf-mega-menu-center"
                    style={{ minWidth: '840px', maxWidth: 'calc(100vw - 2rem)' }}
                    onMouseEnter={() => handleMouseEnter('resources')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="rf-mega-menu-grid" style={{ gridTemplateColumns: '1.15fr 1.15fr 1fr', gap: '1.5rem' }}>
                      {/* Left: Ecosystem & Knowledge */}
                      <div>
                        <div className="rf-mega-menu-col-title">
                          <Compass size={14} />
                          <span>Ecosystem & Discovery</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/countries')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Globe2 size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">54 African Countries Hub</div>
                              <div className="rf-mega-menu-item-desc">Browse sovereign talent pools & local currencies</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/demo-tour')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Sparkles size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Cross-Border Demo Tour</div>
                              <div className="rf-mega-menu-item-desc">Interactive live walkthrough of a Refeir project lifecycle</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/why-refeir')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Shield size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Why Refeir & Our Vision</div>
                              <div className="rf-mega-menu-item-desc">Pan-African escrow model & 10% referral guarantee</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/success-stories')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Star size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Success Stories</div>
                              <div className="rf-mega-menu-item-desc">Real earnings & case studies from verified Scouts and Talent</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/reviews')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Award size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Refeir Reviews (4.9/5.0)</div>
                              <div className="rf-mega-menu-item-desc">Over 2,400+ verified ratings across the continent</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Tools & Support */}
                      <div>
                        <div className="rf-mega-menu-col-title">
                          <BookOpen size={14} />
                          <span>Tools & Knowledge</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/tools')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Wrench size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Free Business Tools</div>
                              <div className="rf-mega-menu-item-desc">Freelance rate calculator & multi-currency converter</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/blog')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <BookOpen size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Refeir Blog & Guides</div>
                              <div className="rf-mega-menu-item-desc">Scout tips, African tech trends & hiring strategies</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/help')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <HelpCircle size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Help & Support Center</div>
                              <div className="rf-mega-menu-item-desc">Frequently asked questions & 24/7 mediation assistance</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/partnerships')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Handshake size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">Sponsorship & Partnerships</div>
                              <div className="rf-mega-menu-item-desc">Collaborate with Africa's fastest-growing talent network</div>
                            </div>
                          </div>

                          <div
                            className="rf-mega-menu-item"
                            onClick={() => handleLinkClick('/about')}
                          >
                            <div className="rf-mega-menu-item-icon">
                              <Users size={16} />
                            </div>
                            <div>
                              <div className="rf-mega-menu-item-title">About Refeir & Leadership</div>
                              <div className="rf-mega-menu-item-desc">Meet the team building pan-African infrastructure</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Action Sidebar */}
                      <div className="rf-mega-menu-sidebar">
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', marginBottom: '0.5rem' }}>
                            TRUST & GOVERNANCE
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                            100% Escrow Protected
                          </h4>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', lineHeight: 1.5, marginBottom: '1rem' }}>
                            Every contract is safeguarded by licensed payment rails with guaranteed milestone protection.
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleLinkClick('/protection')}
                            className="rf-btn rf-btn-primary rf-btn-sm"
                            style={{ width: '100%', justifyContent: 'space-between' }}
                          >
                            <span>Pay Protection Notice</span>
                            <ArrowRight size={14} />
                          </button>
                          <button
                            onClick={() => handleLinkClick('/admin-login')}
                            className="rf-btn rf-btn-secondary rf-btn-sm"
                            style={{ width: '100%', justifyContent: 'space-between' }}
                          >
                            <span>Admin Portal Access</span>
                            <Shield size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </nav>
      </div>

          {/* RIGHT SIDE: Theme Toggle, Direct Inbox, Notification Box, Help & Resources, User Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {(() => {
              const isDark = theme === 'dark';
              const popoverBg = isDark ? '#07160D' : '#FFFFFF';
              const popoverBorder = isDark ? '1.5px solid rgba(102, 187, 42, 0.35)' : '1.5px solid rgba(102, 187, 42, 0.35)';
              const popoverShadow = isDark ? '0 20px 50px rgba(0, 0, 0, 0.8)' : '0 20px 50px rgba(0, 0, 0, 0.12)';
              const headerBg = isDark
                ? 'linear-gradient(135deg, rgba(102, 187, 42, 0.14) 0%, rgba(10, 23, 15, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(102, 187, 42, 0.12) 0%, #F4FAF6 100%)';
              const textCream = isDark ? 'var(--rf-cream)' : '#0F2E1B';
              const textMuted = isDark ? 'var(--rf-slate-400)' : '#527560';
              const textBody = isDark ? 'var(--rf-slate-300)' : '#2D4A38';
              const borderDivider = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
              const footerBg = isDark ? 'rgba(0, 0, 0, 0.4)' : '#F0F7F2';
              const itemHoverBg = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)';
              const itemUnreadBg = isDark ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)';

              return (
                <>
                  {/* 1. Direct Inbox & Real-Time Negotiations Flyout (All profiles including Admin) */}
                  {currentUser && (
                    <div style={{ position: 'relative' }} ref={inboxRef}>
                      <button
                        onClick={() => {
                          setShowInboxBox(!showInboxBox);
                          setShowNotificationBox(false);
                          setShowHelpMenu(false);
                          setShowUserMenu(false);
                        }}
                        aria-label="Open Direct Messages and Negotiations"
                        title="Direct Messages & Negotiations"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: showInboxBox ? 'rgba(102, 187, 42, 0.2)' : theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(18, 43, 26, 0.06)',
                          border: showInboxBox ? '1.5px solid var(--rf-leaf-green)' : '1px solid var(--rf-bg-card-border)',
                          color: showInboxBox ? 'var(--rf-leaf-green)' : 'var(--rf-cream)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          padding: 0,
                          position: 'relative'
                        }}
                      >
                        <MessageSquare size={17} />
                        {unreadMessagesCount > 0 && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '-2px',
                              right: '-2px',
                              minWidth: '18px',
                              height: '18px',
                              padding: '0 4px',
                              borderRadius: '50%',
                              background: 'var(--rf-leaf-green)',
                              color: 'var(--rf-dark-green)',
                              fontSize: '0.65rem',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 0 10px rgba(102, 187, 42, 0.8)',
                              animation: 'fadeIn 0.2s ease'
                            }}
                          >
                            {unreadMessagesCount}
                          </span>
                        )}
                      </button>

                      {/* Direct Inbox Dropdown Box */}
                      {showInboxBox && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 10px)',
                            right: 0,
                            width: '380px',
                            maxWidth: '92vw',
                            background: popoverBg,
                            border: popoverBorder,
                            borderRadius: 'var(--rf-radius-xl)',
                            boxShadow: popoverShadow,
                            zIndex: 1000,
                            overflow: 'hidden',
                            animation: 'fadeIn 0.2s ease'
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          {/* Header */}
                          <div style={{ padding: '0.9rem 1.15rem', borderBottom: `1px solid ${borderDivider}`, background: headerBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <MessageSquare size={16} color="var(--rf-leaf-green)" />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', minWidth: 0 }}>
                                <span style={{ fontSize: '0.925rem', fontWeight: 800, color: textCream, lineHeight: 1.2, display: 'block', textAlign: 'left', whiteSpace: 'nowrap' }}>
                                  Direct Inbox
                                </span>
                                <span style={{ fontSize: '0.7rem', color: textMuted, fontWeight: 500, lineHeight: 1.2, marginTop: '2px', display: 'block', textAlign: 'left', whiteSpace: 'nowrap' }}>
                                  Real-Time Chats
                                </span>
                              </div>
                            </div>

                            {/* Aligned Right Badges & Mark All Read Button */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                              {unreadMessagesCount > 0 && (
                                <button
                                  onClick={markAllChatsAsRead}
                                  style={{
                                    background: 'rgba(102, 187, 42, 0.12)',
                                    border: '1px solid rgba(102, 187, 42, 0.35)',
                                    color: 'var(--rf-leaf-green)',
                                    fontSize: '0.6875rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    padding: '0.22rem 0.55rem',
                                    borderRadius: '100px',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(102, 187, 42, 0.25)';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(102, 187, 42, 0.12)';
                                  }}
                                  title="Mark all conversations as read"
                                >
                                  Mark all as Read
                                </button>
                              )}
                              <span
                                className="rf-badge rf-badge-mint rf-text-xs"
                                style={{
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0,
                                  padding: '0.22rem 0.55rem',
                                  fontSize: '0.6875rem',
                                  fontWeight: 800
                                }}
                              >
                                {unreadMessagesCount > 0 ? `${unreadMessagesCount} Unread` : 'All Read'}
                              </span>
                            </div>
                          </div>

                          {/* Messages List */}
                          <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '0.5rem' }}>
                            {directChats.map(item => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  markChatAsRead(item.id);
                                  setShowInboxBox(false);
                                  onNavigate('/messages');
                                }}
                                style={{
                                  padding: '0.75rem',
                                  borderRadius: 'var(--rf-radius-md)',
                                  background: item.unread ? itemUnreadBg : 'transparent',
                                  border: item.unread ? '1px solid rgba(102, 187, 42, 0.25)' : '1px solid transparent',
                                  marginBottom: '0.35rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  position: 'relative'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = item.unread ? (isDark ? 'rgba(102, 187, 42, 0.14)' : 'rgba(102, 187, 42, 0.18)') : itemHoverBg;
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = item.unread ? itemUnreadBg : 'transparent';
                                }}
                              >
                                <div style={{ display: 'flex', gap: '0.65rem' }}>
                                  <div style={{ position: 'relative' }}>
                                    <img
                                      src={item.avatar}
                                      alt={item.name}
                                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: item.unread ? '2px solid var(--rf-leaf-green)' : (isDark ? '1.5px solid var(--rf-navy-border)' : '1.5px solid rgba(0,0,0,0.1)') }}
                                    />
                                    {item.unread && (
                                      <span
                                        style={{
                                          position: 'absolute',
                                          bottom: '0',
                                          right: '0',
                                          width: '10px',
                                          height: '10px',
                                          borderRadius: '50%',
                                          background: 'var(--rf-leaf-green)',
                                          border: isDark ? '2px solid #07160D' : '2px solid #FFFFFF'
                                        }}
                                      />
                                    )}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                                      <span style={{ fontSize: '0.8125rem', fontWeight: item.unread ? 800 : 700, color: textCream }}>
                                        {item.name}
                                      </span>
                                      <span style={{ fontSize: '0.6875rem', color: item.unread ? 'var(--rf-leaf-green)' : textMuted, fontWeight: item.unread ? 700 : 400 }}>
                                        {item.time}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--rf-leaf-green)', marginBottom: '0.2rem' }}>
                                      {item.type}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: item.unread ? textCream : textBody, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: item.unread ? 600 : 400 }}>
                                      {item.preview}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Bottom CTA */}
                          <div style={{ padding: '0.75rem 1rem', borderTop: `1px solid ${borderDivider}`, background: footerBg, textAlign: 'center' }}>
                            <button
                              onClick={() => {
                                setShowInboxBox(false);
                                onNavigate('/messages');
                              }}
                              className="rf-btn rf-btn-mint rf-btn-sm"
                              style={{ width: '100%', justifyContent: 'center', fontWeight: 800 }}
                            >
                              <Send size={13} />
                              <span>Open Full Messenger & Negotiation Rails →</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

            {/* 1.5. Direct Messages / Chatting Center Shortcut (Only when Logged In) */}
            {currentUser && (
              <button
                onClick={() => {
                  handleLinkClick('/messages');
                  setShowNotificationBox(false);
                  setShowInboxBox(false);
                  setShowHelpMenu(false);
                  setShowUserMenu(false);
                }}
                aria-label="Open Direct Messages & Chatting Center"
                title="Direct Messages & Chatting Center"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: currentPath === '/messages' ? 'rgba(102, 187, 42, 0.2)' : theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(18, 43, 26, 0.06)',
                  border: currentPath === '/messages' ? '1.5px solid var(--rf-leaf-green)' : '1px solid var(--rf-bg-card-border)',
                  color: currentPath === '/messages' ? 'var(--rf-leaf-green)' : 'var(--rf-cream)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: 0,
                  position: 'relative'
                }}
              >
                <MessageSquare size={17} />
              </button>
            )}

            {/* 2. Universal Notification Bell Icon & Sovereign Inbox (Only when Logged In) */}
            {currentUser && (
              <div style={{ position: 'relative' }} ref={notificationRef}>
              <button
                onClick={() => {
                  setShowNotificationBox(!showNotificationBox);
                  setShowInboxBox(false);
                  setShowHelpMenu(false);
                  setShowUserMenu(false);
                }}
                aria-label="Open Notifications"
                title="Notifications"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: showNotificationBox ? 'rgba(102, 187, 42, 0.2)' : theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(18, 43, 26, 0.06)',
                  border: showNotificationBox ? '1.5px solid var(--rf-leaf-green)' : '1px solid var(--rf-bg-card-border)',
                  color: showNotificationBox ? 'var(--rf-leaf-green)' : 'var(--rf-cream)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: 0,
                  position: 'relative'
                }}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      minWidth: '18px',
                      height: '18px',
                      padding: '0 4px',
                      borderRadius: '50%',
                      background: 'var(--rf-leaf-green)',
                      color: 'var(--rf-dark-green)',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 10px rgba(102, 187, 42, 0.8)'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Universal Notification Dropdown Box */}
              {showNotificationBox && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '380px',
                    maxWidth: '92vw',
                    background: popoverBg,
                    border: popoverBorder,
                    borderRadius: 'var(--rf-radius-xl)',
                    boxShadow: popoverShadow,
                    zIndex: 1000,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.2s ease'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Top Bar Header */}
                  <div style={{ padding: '0.9rem 1.15rem', borderBottom: `1px solid ${borderDivider}`, background: headerBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bell size={16} color="var(--rf-leaf-green)" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', minWidth: 0 }}>
                        <span style={{ fontSize: '0.925rem', fontWeight: 800, color: textCream, lineHeight: 1.2, display: 'block', textAlign: 'left', whiteSpace: 'nowrap' }}>
                          Notifications
                        </span>
                        <span style={{ fontSize: '0.7rem', color: textMuted, fontWeight: 500, lineHeight: 1.2, marginTop: '2px', display: 'block', textAlign: 'left', whiteSpace: 'nowrap' }}>
                          Updates & Alerts
                        </span>
                      </div>
                    </div>

                    {/* Aligned Right Badges & Mark All Read Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{
                            background: 'rgba(102, 187, 42, 0.12)',
                            border: '1px solid rgba(102, 187, 42, 0.35)',
                            color: 'var(--rf-leaf-green)',
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            padding: '0.22rem 0.55rem',
                            borderRadius: '100px',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(102, 187, 42, 0.25)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(102, 187, 42, 0.12)';
                          }}
                          title="Mark all notifications as read"
                        >
                          Mark all as Read
                        </button>
                      )}
                      <span
                        className="rf-badge rf-badge-mint rf-text-xs"
                        style={{
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          padding: '0.22rem 0.55rem',
                          fontSize: '0.6875rem',
                          fontWeight: 800
                        }}
                      >
                        {unreadCount > 0 ? `${unreadCount} Unread` : 'All Read'}
                      </span>
                      <button
                        onClick={clearAllNotifications}
                        title="Clear all notifications"
                        style={{
                          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
                          color: textMuted,
                          cursor: 'pointer',
                          padding: '0.3rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#EF4444';
                          e.currentTarget.style.borderColor = '#EF4444';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = textMuted;
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Filter Categories */}
                  <div style={{ display: 'flex', gap: '0.25rem', padding: '0.6rem 0.75rem', background: isDark ? 'rgba(0, 0, 0, 0.3)' : '#F0F7F2', borderBottom: `1px solid ${borderDivider}`, overflowX: 'auto' }}>
                    {(currentUser?.roles.includes('ADMIN')
                      ? (['ALL', 'ADMIN', 'ESCROW', 'VERIFICATION', 'JOBS', 'REFERRALS'] as const)
                      : (['ALL', 'VERIFICATION', 'ESCROW', 'JOBS', 'REFERRALS'] as const)
                    ).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNotificationFilter(cat)}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '9999px',
                          border: notificationFilter === cat ? '1px solid var(--rf-leaf-green)' : '1px solid transparent',
                          background: notificationFilter === cat ? 'rgba(102, 187, 42, 0.2)' : 'transparent',
                          color: notificationFilter === cat ? 'var(--rf-leaf-green)' : textMuted,
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Notification List Scrollable */}
                  <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.65rem' }}>
                    {notifications
                      .filter(n => {
                        if (!currentUser?.roles.includes('ADMIN') && (n.category === 'ADMIN' || n.role_target === 'ADMIN')) {
                          return false;
                        }
                        return notificationFilter === 'ALL' || n.category === notificationFilter;
                      }).length > 0 ? (
                      notifications
                        .filter(n => {
                          if (!currentUser?.roles.includes('ADMIN') && (n.category === 'ADMIN' || n.role_target === 'ADMIN')) {
                            return false;
                          }
                          return notificationFilter === 'ALL' || n.category === notificationFilter;
                        })
                        .map(n => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            style={{
                              padding: '0.875rem',
                              borderRadius: 'var(--rf-radius-md)',
                              marginBottom: '0.5rem',
                              background: n.read ? (isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAF8') : (isDark ? 'rgba(102, 187, 42, 0.07)' : 'rgba(102, 187, 42, 0.12)'),
                              border: n.read ? (isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(0, 0, 0, 0.06)') : (isDark ? '1px solid rgba(102, 187, 42, 0.25)' : '1px solid rgba(102, 187, 42, 0.35)'),
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span
                                  style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: n.type === 'SUCCESS' ? 'var(--rf-leaf-green)' : n.type === 'WARNING' ? '#F4B942' : n.type === 'ERROR' ? '#EF4444' : '#7DA2FF',
                                    display: 'inline-block'
                                  }}
                                />
                                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: textCream }}>
                                  {n.title}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.65rem', color: textMuted, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Clock size={10} /> {n.timestamp}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.78rem', color: textBody, lineHeight: 1.45, margin: '0 0 0.5rem 0' }}>
                              {n.message}
                            </p>

                            {/* Email Dispatched Note */}
                            {n.email_dispatched && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.6875rem', color: 'var(--rf-leaf-green)', marginBottom: '0.5rem', background: 'rgba(102, 187, 42, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>
                                <Mail size={11} />
                                <span>Dispatched to email: {n.email_recipient || currentUser?.email || 'user@refeir.africa'}</span>
                              </div>
                            )}

                            {n.link && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleLinkClick(n.link!);
                                  setShowNotificationBox(false);
                                }}
                                className="rf-btn rf-btn-mint rf-btn-sm"
                                style={{ width: '100%', padding: '0.35rem 0.65rem', fontSize: '0.72rem', fontWeight: 800, justifyContent: 'center' }}
                              >
                                <span>{n.action_label || 'View Details'}</span>
                                <ArrowRight size={11} />
                              </button>
                            )}
                          </div>
                        ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: textMuted, fontSize: '0.8125rem' }}>
                        <Mail size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                        <div>You are all caught up!</div>
                        <div style={{ fontSize: '0.72rem', marginTop: '0.25rem' }}>All biometric verification notices, job matches, and escrow updates will appear here.</div>
                      </div>
                    )}
                  </div>

                  {/* Footer Bar */}
                  <div style={{ padding: '0.6rem 1rem', background: footerBg, borderTop: `1px solid ${borderDivider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: textMuted }}>
                    <span>Universal Inbox: Active</span>
                    <button
                      onClick={() => {
                        addAppNotification({
                          title: 'Verification Multi-Factor Check Passed',
                          message: 'Your NIN details, Date of Birth, and 3D Biometric Video match were approved with 99.6% confidence.',
                          type: 'SUCCESS',
                          category: 'VERIFICATION',
                          link: '/verification',
                          action_label: 'View Verified Badge',
                          email_dispatched: true,
                          email_recipient: currentUser?.email || 'user@refeir.africa'
                        });
                      }}
                      style={{
                        background: 'rgba(102, 187, 42, 0.15)',
                        border: '1px solid rgba(102, 187, 42, 0.35)',
                        color: 'var(--rf-leaf-green)',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Zap size={10} /> Test Live Notification
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

            {/* 3. Help and Resources (Question Mark Encircled) - Only when Logged In */}
            {currentUser && (
              <div style={{ position: 'relative' }} ref={helpRef}>
                <button
                  onClick={() => {
                    setShowHelpMenu(!showHelpMenu);
                    setShowNotificationBox(false);
                    setShowInboxBox(false);
                    setShowUserMenu(false);
                  }}
                  aria-label="Help and Resources"
                  title="Help and Resources"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: showHelpMenu ? 'rgba(102, 187, 42, 0.2)' : theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(18, 43, 26, 0.06)',
                    border: showHelpMenu ? '1.5px solid var(--rf-leaf-green)' : '1px solid var(--rf-bg-card-border)',
                    color: showHelpMenu ? 'var(--rf-leaf-green)' : 'var(--rf-cream)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    padding: 0,
                    position: 'relative'
                  }}
                >
                  <HelpCircle size={18} />
                </button>

                {/* Help and Resources Dropdown Box with 3 specific options */}
                {showHelpMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      right: 'auto',
                      width: '290px',
                      background: popoverBg,
                      border: popoverBorder,
                      borderRadius: 'var(--rf-radius-xl)',
                      boxShadow: popoverShadow,
                      padding: '0.75rem',
                      zIndex: 1000,
                      animation: 'fadeIn 0.2s ease'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ padding: '0.4rem 0.5rem 0.6rem', borderBottom: `1px solid ${borderDivider}`, marginBottom: '0.4rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: textCream, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <HelpCircle size={15} color="var(--rf-leaf-green)" />
                        <span>Help and Resources</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {/* Option 1: Community Hub */}
                      <button
                        onClick={() => {
                          setShowHelpMenu(false);
                          onNavigate('/community');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--rf-radius-md)',
                          background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAF8',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
                          color: textCream,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
                          e.currentTarget.style.background = isDark ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
                          e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAF8';
                        }}
                      >
                        <Users size={16} color="var(--rf-leaf-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: textCream }}>
                            Community Hub
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: textMuted, marginTop: '0.1rem' }}>
                            Scout & talent network forum & discussions
                          </div>
                        </div>
                      </button>

                      {/* Option 2: Refeir Forum */}
                      <button
                        onClick={() => {
                          setShowHelpMenu(false);
                          onNavigate('/community?tab=forum');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--rf-radius-md)',
                          background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAF8',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
                          color: textCream,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
                          e.currentTarget.style.background = isDark ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
                          e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAF8';
                        }}
                      >
                        <MessageSquare size={16} color="var(--rf-leaf-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: textCream }}>
                            Refeir Forum
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: textMuted, marginTop: '0.1rem' }}>
                            Pan-African technical discussions & peer boards
                          </div>
                        </div>
                      </button>

                      {/* Option 3: Support */}
                      <button
                        onClick={() => {
                          setShowHelpMenu(false);
                          onNavigate('/help');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--rf-radius-md)',
                          background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAF8',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
                          color: textCream,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
                          e.currentTarget.style.background = isDark ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
                          e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAF8';
                        }}
                      >
                        <LifeBuoy size={16} color="var(--rf-leaf-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: textCream }}>
                            Support
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: textMuted, marginTop: '0.1rem' }}>
                            Knowledge base, Escrow FAQ & mediation guides
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle Button (Light / Dark Mode) */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(18, 43, 26, 0.06)',
                border: '1px solid var(--rf-bg-card-border)',
                color: theme === 'dark' ? '#F6B21A' : '#122B1A',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: 0,
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--rf-bg-card-border)';
              }}
            >
              {theme === 'dark' ? (
                <Sun size={17} color="#F6B21A" />
              ) : (
                <Moon size={17} color="#122B1A" />
              )}
            </button>

            {currentUser ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotificationBox(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.3rem 0.65rem 0.3rem 0.35rem',
                    borderRadius: '100px',
                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(18, 43, 26, 0.06)',
                    border: '1px solid var(--rf-bg-card-border)',
                    cursor: 'pointer',
                    color: textCream,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--rf-bg-card-border)';
                  }}
                >
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser.first_name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.1 }}>
                      {currentUser.first_name}
                    </span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--rf-leaf-green)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {currentUser.active_role}
                    </span>
                  </div>
                  <ChevronDown size={14} color={textMuted} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '280px',
                      background: popoverBg,
                      border: popoverBorder,
                      borderRadius: 'var(--rf-radius-lg)',
                      boxShadow: popoverShadow,
                      padding: '0.75rem',
                      zIndex: 1000
                    }}
                  >
                    {/* User Info Header */}
                    <div style={{ padding: '0.5rem 0.5rem 0.75rem', borderBottom: `1px solid ${borderDivider}` }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: textCream }}>
                        {currentUser.first_name} {currentUser.last_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: textMuted, fontFamily: 'var(--rf-font-mono)' }}>
                        {currentUser.email}
                      </div>
                    </div>

                    {/* Workspace & Profile Links */}
                    <div style={{ padding: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {/* 1. My Profile */}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('/profile');
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--rf-radius-sm)', background: 'none', border: 'none', color: textCream, cursor: 'pointer', textAlign: 'left', fontSize: '0.8125rem' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = isDark ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)';
                          e.currentTarget.style.color = 'var(--rf-leaf-green)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'none';
                          e.currentTarget.style.color = textCream;
                        }}
                      >
                        <User size={14} color="var(--rf-leaf-green)" />
                        <span>My Profile</span>
                      </button>

                      {/* 2. Account Settings */}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('/settings');
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--rf-radius-sm)', background: isDark ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)', border: '1px solid rgba(102, 187, 42, 0.25)', color: 'var(--rf-leaf-green)', cursor: 'pointer', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 700 }}
                      >
                        <Settings size={14} color="var(--rf-leaf-green)" />
                        <span>Account Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('/verification');
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--rf-radius-sm)', background: 'none', border: 'none', color: textCream, cursor: 'pointer', textAlign: 'left', fontSize: '0.8125rem' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = isDark ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)';
                          e.currentTarget.style.color = 'var(--rf-leaf-green)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'none';
                          e.currentTarget.style.color = textCream;
                        }}
                      >
                        <ShieldCheck size={14} color="var(--rf-leaf-green)" />
                        <span>Biometric & ID Verification</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('/wallet');
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--rf-radius-sm)', background: 'none', border: 'none', color: textCream, cursor: 'pointer', textAlign: 'left', fontSize: '0.8125rem' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = isDark ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)';
                          e.currentTarget.style.color = 'var(--rf-leaf-green)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'none';
                          e.currentTarget.style.color = textCream;
                        }}
                      >
                        <Wallet size={14} color="var(--rf-leaf-green)" />
                        <span>Multi-Currency Wallet</span>
                      </button>

                      {/* --- SWITCH PROFILE (Parent with Left-Arc Animated Children) --- */}
                      <div style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: `1px solid ${borderDivider}`, position: 'relative' }}>
                        <button
                          type="button"
                          onClick={() => setShowSwitchProfile(!showSwitchProfile)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem',
                            borderRadius: 'var(--rf-radius-sm)',
                            background: showSwitchProfile ? (isDark ? 'rgba(102, 187, 42, 0.12)' : 'rgba(102, 187, 42, 0.15)') : (isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAF8'),
                            border: showSwitchProfile ? '1px solid var(--rf-leaf-green)' : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)'),
                            color: showSwitchProfile ? 'var(--rf-leaf-green)' : textCream,
                            cursor: 'pointer',
                            fontSize: '0.8125rem',
                            fontWeight: 800,
                            transition: 'all 0.18s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowLeftRight size={14} color="var(--rf-leaf-green)" />
                            <span>Switch Profile</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            {showSwitchProfile && (
                              <span style={{ fontSize: '0.625rem', color: 'var(--rf-leaf-green)', fontWeight: 800, textTransform: 'uppercase' }}>Arc Open</span>
                            )}
                            <ChevronDown
                              size={14}
                              color={textMuted}
                              style={{
                                transform: showSwitchProfile ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                              }}
                            />
                          </div>
                        </button>

                        {/* Arc Opening to the Left Tray */}
                        {showSwitchProfile && (
                          <div
                            style={{
                              position: 'absolute',
                              right: 'calc(100% + 14px)',
                              bottom: '-10px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.55rem',
                              width: '245px',
                              zIndex: 1100,
                              pointerEvents: 'auto'
                            }}
                          >
                            {/* Decorative curved SVG connecting arc line */}
                            <svg
                              width="40"
                              height="140"
                              viewBox="0 0 40 140"
                              style={{
                                position: 'absolute',
                                right: '-24px',
                                top: '0px',
                                pointerEvents: 'none',
                                zIndex: -1
                              }}
                            >
                              <path
                                d="M 0,20 Q 30,70 38,125"
                                fill="none"
                                stroke="rgba(102, 187, 42, 0.45)"
                                strokeWidth="2"
                                strokeDasharray="4 3"
                              />
                            </svg>

                            {/* Child 1: Scout Network Hub (Top of Arc) */}
                            <div className="rf-arc-child-1">
                              <button
                                onClick={() => {
                                  switchRole('SCOUT');
                                  setShowUserMenu(false);
                                  onNavigate('/dashboard/scout');
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.65rem 0.85rem',
                                  borderRadius: 'var(--rf-radius-lg)',
                                  background: currentUser.active_role === 'SCOUT' ? (isDark ? '#0D2716' : '#EAF7EE') : (isDark ? '#07160D' : '#FFFFFF'),
                                  border: currentUser.active_role === 'SCOUT' ? '1.5px solid var(--rf-leaf-green)' : (isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(102, 187, 42, 0.3)'),
                                  boxShadow: isDark ? '-8px 12px 28px rgba(0, 0, 0, 0.8)' : '-8px 12px 28px rgba(0, 0, 0, 0.12)',
                                  color: currentUser.active_role === 'SCOUT' ? 'var(--rf-leaf-green)' : textCream,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: 'all 0.18s ease'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
                                  e.currentTarget.style.transform = 'translateX(-3px)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.borderColor = currentUser.active_role === 'SCOUT' ? 'var(--rf-leaf-green)' : (isDark ? 'rgba(102, 187, 42, 0.35)' : 'rgba(102, 187, 42, 0.3)');
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={14} color="var(--rf-leaf-green)" />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: textCream }}>Scout Network Hub</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--rf-leaf-green)', fontWeight: 600 }}>Refer & Earn 10%</div>
                                  </div>
                                </div>
                                {currentUser.active_role === 'SCOUT' ? (
                                  <span style={{ fontSize: '0.6rem', background: 'var(--rf-leaf-green)', color: 'var(--rf-dark-green)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 900 }}>ACTIVE</span>
                                ) : (
                                  <ChevronRight size={13} color={textMuted} />
                                )}
                              </button>
                            </div>

                            {/* Child 2: Talent Workspace (Apex of Arc - Extending furthest to left) */}
                            <div className="rf-arc-child-2">
                              <button
                                onClick={() => {
                                  switchRole('TALENT');
                                  setShowUserMenu(false);
                                  onNavigate('/dashboard/talent');
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.65rem 0.85rem',
                                  borderRadius: 'var(--rf-radius-lg)',
                                  background: currentUser.active_role === 'TALENT' ? (isDark ? '#0D2716' : '#EAF7EE') : (isDark ? '#07160D' : '#FFFFFF'),
                                  border: currentUser.active_role === 'TALENT' ? '1.5px solid var(--rf-leaf-green)' : (isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(102, 187, 42, 0.3)'),
                                  boxShadow: isDark ? '-8px 12px 28px rgba(0, 0, 0, 0.8)' : '-8px 12px 28px rgba(0, 0, 0, 0.12)',
                                  color: currentUser.active_role === 'TALENT' ? 'var(--rf-leaf-green)' : textCream,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: 'all 0.18s ease'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
                                  e.currentTarget.style.transform = 'translateX(-3px)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.borderColor = currentUser.active_role === 'TALENT' ? 'var(--rf-leaf-green)' : (isDark ? 'rgba(102, 187, 42, 0.35)' : 'rgba(102, 187, 42, 0.3)');
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={14} color="var(--rf-leaf-green)" />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: textCream }}>Talent Workspace</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--rf-leaf-green)', fontWeight: 600 }}>Deliver Work & Payouts</div>
                                  </div>
                                </div>
                                {currentUser.active_role === 'TALENT' ? (
                                  <span style={{ fontSize: '0.6rem', background: 'var(--rf-leaf-green)', color: 'var(--rf-dark-green)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 900 }}>ACTIVE</span>
                                ) : (
                                  <ChevronRight size={13} color={textMuted} />
                                )}
                              </button>
                            </div>

                            {/* Child 3: Client Projects & Escrow (Bottom of Arc) */}
                            <div className="rf-arc-child-3">
                              <button
                                onClick={() => {
                                  switchRole('CLIENT');
                                  setShowUserMenu(false);
                                  onNavigate('/dashboard/client');
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.65rem 0.85rem',
                                  borderRadius: 'var(--rf-radius-lg)',
                                  background: currentUser.active_role === 'CLIENT' ? (isDark ? '#0D2716' : '#EAF7EE') : (isDark ? '#07160D' : '#FFFFFF'),
                                  border: currentUser.active_role === 'CLIENT' ? '1.5px solid var(--rf-leaf-green)' : (isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(102, 187, 42, 0.3)'),
                                  boxShadow: isDark ? '-8px 12px 28px rgba(0, 0, 0, 0.8)' : '-8px 12px 28px rgba(0, 0, 0, 0.12)',
                                  color: currentUser.active_role === 'CLIENT' ? 'var(--rf-leaf-green)' : textCream,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: 'all 0.18s ease'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
                                  e.currentTarget.style.transform = 'translateX(-3px)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.borderColor = currentUser.active_role === 'CLIENT' ? 'var(--rf-leaf-green)' : (isDark ? 'rgba(102, 187, 42, 0.35)' : 'rgba(102, 187, 42, 0.3)');
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Briefcase size={14} color="var(--rf-leaf-green)" />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: textCream }}>Client Projects & Escrow</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--rf-leaf-green)', fontWeight: 600 }}>Hire & Protect Funds</div>
                                  </div>
                                </div>
                                {currentUser.active_role === 'CLIENT' ? (
                                  <span style={{ fontSize: '0.6rem', background: 'var(--rf-leaf-green)', color: 'var(--rf-dark-green)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 900 }}>ACTIVE</span>
                                ) : (
                                  <ChevronRight size={13} color={textMuted} />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {currentUser.roles.includes('ADMIN') && (
                        <button
                          onClick={() => {
                            switchRole('ADMIN');
                            setShowUserMenu(false);
                            onNavigate('/admin-portal');
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--rf-radius-sm)', background: isDark ? 'rgba(102, 187, 42, 0.1)' : 'rgba(102, 187, 42, 0.15)', border: '1px solid rgba(102, 187, 42, 0.3)', color: 'var(--rf-leaf-green)', cursor: 'pointer', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 700 }}
                        >
                          <Wrench size={14} color="var(--rf-leaf-green)" />
                          <span>Admin Console</span>
                        </button>
                      )}
                    </div>

                    {/* Logout Button */}
                    <div style={{ borderTop: `1px solid ${borderDivider}`, paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          onNavigate('/');
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem',
                          borderRadius: 'var(--rf-radius-sm)',
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.8125rem',
                          fontWeight: 600
                        }}
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="rf-btn rf-btn-ghost rf-btn-sm"
                  style={{
                    fontWeight: 500,
                    fontSize: '0.84rem',
                    color: isDark ? 'var(--rf-cream)' : '#122B1A',
                    opacity: 0.85,
                    border: '1px solid var(--rf-bg-card-border)',
                    padding: '0.38rem 0.9rem',
                    borderRadius: 'var(--rf-radius-md)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  <LogIn size={13} />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => setShowSignupModal(true)}
                  className="rf-btn rf-btn-primary rf-btn-sm"
                  style={{
                    fontWeight: 500,
                    fontSize: '0.84rem',
                    padding: '0.38rem 1rem',
                    borderRadius: 'var(--rf-radius-md)',
                    letterSpacing: '-0.01em',
                    boxShadow: '0 2px 6px rgba(102, 187, 42, 0.25)'
                  }}
                >
                  <UserPlus size={13} />
                  <span>Sign Up</span>
                </button>
              </>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setShowMobileDrawer(!showMobileDrawer)}
              className="rf-mobile-menu-btn"
              aria-label={showMobileDrawer ? 'Close navigation menu' : 'Open navigation menu'}
              title="Navigation Menu"
            >
              {showMobileDrawer ? <X size={20} /> : <Menu size={20} />}
            </button>
                </>
              );
            })()}
          </div>

        </div>
        )}
      </header>

      {/* =========================================================================
          MOBILE SLIDE-OUT NAVIGATION DRAWER
          ========================================================================= */}
      {showMobileDrawer && (
        <>
          <div
            className="rf-mobile-drawer-backdrop"
            style={{ display: 'block' }}
            onClick={() => setShowMobileDrawer(false)}
          />
          <aside
            className="rf-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Header with Logo and Close button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: `1px solid ${navBorderDivider}` }}>
              <div onClick={() => { setShowMobileDrawer(false); onNavigate('/'); }} style={{ cursor: 'pointer' }}>
                <RefeirLogo size="sm" isLight={isDarkTheme} showTagline={false} />
              </div>
              <button
                onClick={() => setShowMobileDrawer(false)}
                className="rf-mobile-menu-btn"
                style={{ width: '36px', height: '36px' }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Profile Card or Auth CTA */}
            {currentUser ? (
              <div style={{ padding: '0.875rem', borderRadius: 'var(--rf-radius-lg)', background: isDarkTheme ? 'rgba(102, 187, 42, 0.08)' : 'rgba(102, 187, 42, 0.12)', border: '1px solid rgba(102, 187, 42, 0.25)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser.first_name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: navTextCream, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser.first_name} {currentUser.last_name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--rf-leaf-green)', fontWeight: 800 }}>
                      ACTIVE ROLE: {currentUser.active_role}
                    </div>
                  </div>
                </div>

                {/* Role Switch Buttons */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {(['SCOUT', 'TALENT', 'CLIENT'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        onNavigate(getRoleDashboardPath(role));
                        setShowMobileDrawer(false);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.35rem 0.25rem',
                        borderRadius: '6px',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        border: currentUser.active_role === role ? '1.5px solid var(--rf-leaf-green)' : '1px solid var(--rf-bg-card-border)',
                        background: currentUser.active_role === role ? 'var(--rf-leaf-green)' : 'var(--rf-bg-surface)',
                        color: currentUser.active_role === role ? 'var(--rf-dark-green)' : navTextCream,
                        cursor: 'pointer'
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button
                  onClick={() => {
                    setShowMobileDrawer(false);
                    setShowLoginModal(true);
                  }}
                  className="rf-btn rf-btn-secondary rf-btn-sm"
                  style={{ width: '100%', padding: '0.55rem' }}
                >
                  <LogIn size={14} /> Log In
                </button>
                <button
                  onClick={() => {
                    setShowMobileDrawer(false);
                    setShowSignupModal(true);
                  }}
                  className="rf-btn rf-btn-primary rf-btn-sm"
                  style={{ width: '100%', padding: '0.55rem' }}
                >
                  <UserPlus size={14} /> Sign Up
                </button>
              </div>
            )}

            {/* Navigation Category Groups */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--rf-leaf-green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                  Marketplace & Discovery
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <button onClick={() => { setShowMobileDrawer(false); onNavigate('/talents'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                    <Users size={15} color="var(--rf-leaf-green)" /> <span>Browse Proven Talents</span>
                  </button>
                  <button onClick={() => { setShowMobileDrawer(false); onNavigate('/services'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                    <Sparkles size={15} color="var(--rf-leaf-green)" /> <span>Fixed Service Packages</span>
                  </button>
                  <button onClick={() => { setShowMobileDrawer(false); onNavigate('/jobs'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                    <Briefcase size={15} color="var(--rf-leaf-green)" /> <span>Browse Jobs & Projects</span>
                  </button>
                  <button onClick={() => { setShowMobileDrawer(false); onNavigate('/map'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                    <Globe2 size={15} color="var(--rf-leaf-green)" /> <span>Africa 3D Explorer</span>
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--rf-leaf-green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                  Scout Program & Escrow
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <button onClick={() => { setShowMobileDrawer(false); onNavigate('/become-scout'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                    <Award size={15} color="var(--rf-leaf-green)" /> <span>Become a Scout (10% Earn)</span>
                  </button>
                  <button onClick={() => { setShowMobileDrawer(false); onNavigate('/scouts'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                    <Users size={15} color="var(--rf-leaf-green)" /> <span>Verified Scouts Directory</span>
                  </button>
                  <button onClick={() => { setShowMobileDrawer(false); onNavigate('/scout-calculator'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                    <Calculator size={15} color="var(--rf-leaf-green)" /> <span>Earnings Calculator</span>
                  </button>
                  <button onClick={() => { setShowMobileDrawer(false); onNavigate('/trust-vault'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                    <Lock size={15} color="var(--rf-leaf-green)" /> <span>Trust Vault Escrow</span>
                  </button>
                  <button onClick={() => { setShowMobileDrawer(false); onNavigate('/how-it-works'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                    <CheckCircle2 size={15} color="var(--rf-leaf-green)" /> <span>How Refeir Works</span>
                  </button>
                </div>
              </div>

              {currentUser && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--rf-leaf-green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                    Workspace & Settings
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <button onClick={() => { setShowMobileDrawer(false); onNavigate(getRoleDashboardPath()); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                      <LayoutDashboard size={15} color="var(--rf-leaf-green)" /> <span>My Active Dashboard</span>
                    </button>
                    <button onClick={() => { setShowMobileDrawer(false); onNavigate('/wallet'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                      <Wallet size={15} color="var(--rf-leaf-green)" /> <span>Multi-Currency Wallet</span>
                    </button>
                    <button onClick={() => { setShowMobileDrawer(false); onNavigate('/verification'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                      <ShieldCheck size={15} color="var(--rf-leaf-green)" /> <span>Biometric Verification</span>
                    </button>
                    <button onClick={() => { setShowMobileDrawer(false); onNavigate('/settings'); }} className="rf-sidebar-link" style={{ background: 'none', padding: '0.5rem 0.65rem' }}>
                      <Settings size={15} color="var(--rf-leaf-green)" /> <span>Account Settings</span>
                    </button>
                    <button
                      onClick={async () => {
                        setShowMobileDrawer(false);
                        await logout();
                        onNavigate('/');
                      }}
                      className="rf-sidebar-link"
                      style={{ background: 'none', color: '#EF4444', padding: '0.5rem 0.65rem' }}
                    >
                      <LogOut size={15} /> <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Controls */}
            <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: `1px solid ${navBorderDivider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={toggleTheme}
                className="rf-btn rf-btn-secondary rf-btn-sm"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem' }}
              >
                {theme === 'dark' ? <Sun size={14} color="#F6B21A" /> : <Moon size={14} color="#122B1A" />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              <span style={{ fontSize: '0.6875rem', color: navTextMuted }}>
                Refeir Pan-Africa
              </span>
            </div>
          </aside>
        </>
      )}

      {/* =========================================================================
          MY SUPPORT REQUESTS MODAL (For Help Center Navigation)
          ========================================================================= */}
      {showSupportRequestsModal && (
        <div className="rf-modal-backdrop" onClick={() => setShowSupportRequestsModal(false)}>
          <div
            className="rf-modal-content"
            style={{ maxWidth: '580px', padding: '2rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(102, 187, 42, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rf-leaf-green)' }}>
                  <LifeBuoy size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>My Support Requests</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>Active dispute inquiries, tickets &amp; milestone reviews</span>
                </div>
              </div>
              <button
                onClick={() => setShowSupportRequestsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rf-slate-400)', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {/* Ticket 1 */}
              <div style={{ padding: '1rem', borderRadius: 'var(--rf-radius-lg)', background: isDark ? 'rgba(255,255,255,0.03)' : '#F6FAF7', border: '1px solid var(--rf-bg-card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>TICKET #REF-8921</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(246,178,26,0.18)', color: '#F6B21A', padding: '0.15rem 0.5rem', borderRadius: '100px' }}>IN REVIEW</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', marginBottom: '0.25rem' }}>
                  Milestone Escrow Inspection &amp; Sign-off Inquiry
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-400)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Project: FinTech Mobile Gateway UI</span>
                  <span>Updated 2h ago</span>
                </div>
              </div>

              {/* Ticket 2 */}
              <div style={{ padding: '1rem', borderRadius: 'var(--rf-radius-lg)', background: isDark ? 'rgba(255,255,255,0.03)' : '#F6FAF7', border: '1px solid var(--rf-bg-card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>TICKET #REF-8452</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(102,187,42,0.18)', color: 'var(--rf-leaf-green)', padding: '0.15rem 0.5rem', borderRadius: '100px' }}>RESOLVED</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', marginBottom: '0.25rem' }}>
                  Commercial Bank Payout Settlement Confirmation
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-400)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Wallet: USD to NGN Direct Wire</span>
                  <span>Resolved Yesterday</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setShowSupportRequestsModal(false);
                  onNavigate('/disputes');
                }}
                className="rf-btn rf-btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <ShieldCheck size={16} />
                <span>Open Resolution Center</span>
              </button>

              <button
                onClick={() => {
                  setShowSupportRequestsModal(false);
                  onNavigate('/contact');
                }}
                className="rf-btn rf-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Send size={16} />
                <span>Submit New Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE LOGIN MODAL
          ========================================================================= */}
      {showLoginModal && (
        <div className="rf-modal-backdrop" onClick={() => setShowLoginModal(false)}>
          <div
            className="rf-modal-content"
            style={{ maxWidth: '440px', padding: '2rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--rf-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rf-leaf-green)' }}>
                  <LogIn size={18} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>Welcome to Refeir</h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rf-slate-400)', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-400)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Access your pan-African referral workspace, projects, and multi-currency payouts.
            </p>

            {/* Email and Password form */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Email Address</label>
                <input
                  type="email"
                  className="rf-input"
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="rf-label" style={{ margin: 0 }}>Password</label>
                  <a
                    href="#forgot"
                    onClick={e => {
                      e.preventDefault();
                      alert('A password reset link has been dispatched to your email address.');
                    }}
                    style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    className="rf-input"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--rf-slate-400)',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="rf-btn rf-btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem', fontWeight: 800 }}
              >
                Log In & Continue
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                style={{ color: 'var(--rf-leaf-green)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Sign up free
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE SIGN UP MODAL
          ========================================================================= */}
      {showSignupModal && (
        <div className="rf-modal-backdrop" onClick={() => setShowSignupModal(false)}>
          <div
            className="rf-modal-content"
            style={{ maxWidth: '460px', padding: '2rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--rf-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rf-leaf-green)' }}>
                  <UserPlus size={18} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>Join Refeir Africa</h3>
              </div>
              <button
                onClick={() => setShowSignupModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rf-slate-400)', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSignupSubmit}>
              <div className="rf-form-group">
                <label className="rf-label">Full Name</label>
                <input
                  type="text"
                  className="rf-input"
                  placeholder="e.g. Kwame Mensah"
                  value={signupForm.name}
                  onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Email Address</label>
                <input
                  type="email"
                  className="rf-input"
                  placeholder="kwame@example.com"
                  value={signupForm.email}
                  onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">I want to primarily join as:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {[
                    { role: 'SCOUT', label: 'Scout', desc: 'Refer & Earn 10%' },
                    { role: 'TALENT', label: 'Talent', desc: 'Find Work' },
                    { role: 'CLIENT', label: 'Recruiter', desc: 'Hire Talent' }
                  ].map(r => (
                    <button
                      type="button"
                      key={r.role}
                      onClick={() => setSignupForm({ ...signupForm, role: r.role as any })}
                      style={{
                        padding: '0.625rem 0.5rem',
                        borderRadius: 'var(--rf-radius-md)',
                        border: `1.5px solid ${signupForm.role === r.role ? 'var(--rf-leaf-green)' : 'var(--rf-bg-card-border)'}`,
                        background: signupForm.role === r.role ? 'var(--rf-mint-light)' : 'var(--rf-bg-surface)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: signupForm.role === r.role ? 'var(--rf-leaf-green)' : 'var(--rf-cream)' }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '0.125rem' }}>
                        {r.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Global Location Selection */}
              <div className="rf-form-group">
                <label className="rf-label">Global Location / Country</label>
                <select
                  className="rf-select"
                  value={signupForm.country}
                  onChange={e => {
                    const selectedName = e.target.value;
                    const matchedCountry = getCountryByName(selectedName);
                    setSignupForm({
                      ...signupForm,
                      country: selectedName,
                      dialCode: matchedCountry ? matchedCountry.dialCode : signupForm.dialCode
                    });
                  }}
                  style={{ width: '100%' }}
                >
                  <optgroup label="Global Enterprise & Client Markets">
                    {GLOBAL_COUNTRIES.filter(c => c.region === 'GLOBAL').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Pan-African Sovereign Nations">
                    {GLOBAL_COUNTRIES.filter(c => c.region === 'AFRICA').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Phone Number & Country Calling Code Menu */}
              <div className="rf-form-group">
                <label className="rf-label">Phone Number & Country Code</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    className="rf-select"
                    style={{ width: '135px', flexShrink: 0, padding: '0.65rem 0.5rem', fontSize: '0.8125rem' }}
                    value={signupForm.dialCode}
                    onChange={e => setSignupForm({ ...signupForm, dialCode: e.target.value })}
                  >
                    <optgroup label="Global Calling Codes">
                      {GLOBAL_COUNTRIES.filter(c => c.region === 'GLOBAL').map(c => (
                        <option key={c.code} value={c.dialCode}>
                          {c.flag} {c.code} ({c.dialCode})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Pan-African Calling Codes">
                      {GLOBAL_COUNTRIES.filter(c => c.region === 'AFRICA').map(c => (
                        <option key={c.code} value={c.dialCode}>
                          {c.flag} {c.code} ({c.dialCode})
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  <input
                    type="tel"
                    className="rf-input"
                    placeholder="e.g. 801 234 5678"
                    value={signupForm.phone}
                    onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
                    style={{ flex: 1 }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rf-btn rf-btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem', fontWeight: 800, marginTop: '0.5rem' }}
              >
                Create Free Account
              </button>
            </form>

            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
              Already registered?{' '}
              <button
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
                style={{ color: 'var(--rf-leaf-green)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
