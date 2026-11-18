import React, { useState, useMemo } from 'react';
import { useAuth, SocialAuthProvider } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Briefcase,
  Users,
  Compass,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  User as UserIcon,
  Globe,
  Phone,
  CheckCircle2,
  Award,
  MapPin,
  Star,
  X,
} from 'lucide-react';
import { GLOBAL_COUNTRIES, getCountryByName } from '../../data/countries';
import { formatMoney } from '../../data/currencies';
import { TalentProfile } from '../../types';
import { RefeirLogo } from './RefeirLogo';
import { SocialAuthButtons } from '../auth/SocialAuthButtons';

interface AuthGateWallProps {
  pageName: string;
  roleRequired?: string;
  initialTab?: 'LOGIN' | 'SIGNUP';
  initialRole?: 'SCOUT' | 'TALENT' | 'CLIENT';
  talentToHire?: TalentProfile | null;
  onNavigate: (path: string) => void;
  onSuccess?: () => void;
  onClose?: () => void;
}

const ROLE_OPTIONS: Array<{
  id: 'CLIENT' | 'TALENT' | 'SCOUT';
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ size?: number | string }>;
}> = [
  {
    id: 'CLIENT',
    title: 'Client / Company',
    subtitle: 'Hire vetted engineers, designers & operators',
    badge: 'Escrow protected',
    icon: Briefcase,
  },
  {
    id: 'TALENT',
    title: 'Talent / Specialist',
    subtitle: 'Work with global teams & get instant payouts',
    badge: 'Multi-currency',
    icon: Award,
  },
  {
    id: 'SCOUT',
    title: 'Talent Scout',
    subtitle: 'Refer top talent & earn 10% lifetime rewards',
    badge: '10% commission',
    icon: Compass,
  },
];

function formatShortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

export const AuthGateWall: React.FC<AuthGateWallProps> = ({
  pageName,
  initialTab = 'LOGIN',
  initialRole = 'CLIENT',
  talentToHire,
  onNavigate,
  onSuccess,
  onClose,
}) => {
  const { login, signup, loginWithSocial } = useAuth();

  const wizardIntent = useMemo(() => {
    try {
      const saved = sessionStorage.getItem('rf_ai_wizard_intent');
      if (saved) return JSON.parse(saved);
    } catch {
      return null;
    }
    return null;
  }, []);

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>(
    talentToHire ? 'SIGNUP' : initialTab
  );
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState('+1');
  const [role, setRole] = useState<'SCOUT' | 'TALENT' | 'CLIENT'>(initialRole);
  const [country, setCountry] = useState('United States');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isStandaloneAuthPage =
    pageName === 'Refeir Account' || pageName === 'Client Registration';

  const completeNavigation = (selectedRole: 'SCOUT' | 'TALENT' | 'CLIENT' = role) => {
    if (onSuccess) {
      onSuccess();
      return;
    }
    if (talentToHire) {
      onNavigate(`/talent/${talentToHire.id}`);
      return;
    }
    if (isStandaloneAuthPage) {
      if (selectedRole === 'TALENT') onNavigate('/dashboard/talent');
      else if (selectedRole === 'SCOUT') onNavigate('/dashboard/scout');
      else onNavigate('/dashboard/client');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
    } else {
      onNavigate('/');
    }
  };

  const handleSocialSelect = async (provider: SocialAuthProvider) => {
    await loginWithSocial(provider, role);
    completeNavigation(role);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await login(email, password || undefined);
      completeNavigation(role);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const parts = name.trim().split(' ');
      await signup({
        first_name: parts[0] || 'User',
        last_name: parts.slice(1).join(' ') || 'Member',
        email,
        password: password || undefined,
        phone: phone ? `${dialCode} ${phone}` : undefined,
        roles: [role],
        active_role: role,
        country,
      });
      completeNavigation(role);
    } finally {
      setSubmitting(false);
    }
  };

  // ===========================================================================
  // DEDICATED SPLIT-SCREEN "SIGN UP TO CONTACT [TALENT]" GATE
  // Triggered when a guest clicks "See profile" or "Hire" on a talent card
  // ===========================================================================
  if (talentToHire) {
    const shortName = formatShortName(talentToHire.full_name);
    const firstName = talentToHire.full_name.trim().split(/\s+/)[0] || shortName;
    const isVerified =
      talentToHire.verification_status === 'IDENTITY_VERIFIED' ||
      talentToHire.verification_status === 'PROFESSION_VERIFIED';

    return (
      <section className="rf-contact-gate">
        {/* LEFT COLUMN — Clean White / Surface Onboarding Flow */}
        <div className="rf-contact-gate-left">
          <div className="rf-contact-gate-logo">
            <div
              onClick={() => onNavigate('/')}
              style={{ cursor: 'pointer', display: 'inline-flex' }}
            >
              <RefeirLogo size="md" showTagline={false} />
            </div>
          </div>

          <div className="rf-contact-gate-body">
            {/* Back arrow + "Sign up to contact [Avatar Name]" */}
            <div className="rf-contact-gate-title-row">
              <button
                type="button"
                className="rf-contact-gate-back"
                onClick={() => {
                  if (showEmailForm) {
                    setShowEmailForm(false);
                  } else {
                    handleClose();
                  }
                }}
                aria-label="Go back"
              >
                <ChevronLeft size={20} />
              </button>

              <h1 className="rf-contact-gate-heading">
                <span>{activeTab === 'LOGIN' ? 'Sign in to contact' : 'Sign up to contact'}</span>
                <span className="rf-contact-talent-chip">
                  <img src={talentToHire.avatar_url} alt={talentToHire.full_name} />
                  <span>{shortName}</span>
                </span>
              </h1>
            </div>

            {/* 3-Step Progress Stepper */}
            <div className="rf-contact-stepper" aria-label="Onboarding steps">
              <div className="rf-contact-step is-active">
                <span className="rf-contact-step-badge is-done">
                  <CheckCircle2 size={14} />
                </span>
                <span>{activeTab === 'LOGIN' ? 'Sign in' : 'Sign up'}</span>
              </div>
              <span className="rf-contact-step-line" />
              <div className="rf-contact-step">
                <span className="rf-contact-step-badge">2</span>
                <span>Set up your profile</span>
              </div>
              <span className="rf-contact-step-line" />
              <div className="rf-contact-step">
                <span className="rf-contact-step-badge">3</span>
                <span>Contact {firstName}</span>
              </div>
            </div>

            {/* Social Sign-In + "Continue with email" */}
            {!showEmailForm ? (
              <div className="rf-contact-actions">
                <SocialAuthButtons
                  mode={activeTab}
                  onSelectProvider={handleSocialSelect}
                  dividerText="OR"
                />

                <button
                  type="button"
                  className="rf-contact-email-cta"
                  onClick={() => setShowEmailForm(true)}
                >
                  Continue with email
                </button>
              </div>
            ) : activeTab === 'LOGIN' ? (
              <form onSubmit={handleLoginSubmit} className="rf-auth-form rf-contact-email-form">
                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-contact-login-email">
                    Work or Personal Email
                  </label>
                  <div className="rf-auth-input-wrap">
                    <Mail size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-contact-login-email"
                      type="email"
                      className="rf-auth-input"
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-contact-login-password">
                    Password
                  </label>
                  <div className="rf-auth-input-wrap">
                    <Lock size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-contact-login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="rf-auth-input has-trailing"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="rf-auth-eye-btn"
                      onClick={() => setShowPassword(p => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rf-contact-email-cta"
                >
                  {submitting ? 'Signing in...' : `Sign in & view ${firstName}'s profile`}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="rf-auth-form rf-contact-email-form">
                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-contact-signup-name">
                    Full Name
                  </label>
                  <div className="rf-auth-input-wrap">
                    <UserIcon size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-contact-signup-name"
                      type="text"
                      className="rf-auth-input"
                      placeholder="Amara Okafor"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      autoComplete="name"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-contact-signup-email">
                    Work or Personal Email
                  </label>
                  <div className="rf-auth-input-wrap">
                    <Mail size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-contact-signup-email"
                      type="email"
                      className="rf-auth-input"
                      placeholder="amara@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-contact-signup-password">
                    Password
                  </label>
                  <div className="rf-auth-input-wrap">
                    <Lock size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-contact-signup-password"
                      type={showPassword ? 'text' : 'password'}
                      className="rf-auth-input has-trailing"
                      placeholder="Create a password (min. 8 chars)"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="rf-auth-eye-btn"
                      onClick={() => setShowPassword(p => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rf-contact-email-cta"
                >
                  {submitting ? 'Creating account...' : `Continue to ${firstName}'s profile`}
                </button>
              </form>
            )}

            {/* Bottom links: Already have an account? Log in / Looking for work? */}
            <div className="rf-contact-gate-links">
              <div>
                {activeTab === 'SIGNUP' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('LOGIN');
                      }}
                    >
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('SIGNUP');
                      }}
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
              <div>
                Looking for work?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setRole('TALENT');
                    onNavigate('/signup?role=TALENT');
                  }}
                >
                  Apply as a talent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Soft Refeir Green Canvas + Floating Talent Showcase Card */}
        <div className="rf-contact-gate-right">
          <button
            type="button"
            className="rf-contact-gate-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Decorative organic Refeir green ribbons */}
          <div className="rf-contact-ribbon rf-contact-ribbon-top" aria-hidden="true" />
          <div className="rf-contact-ribbon rf-contact-ribbon-bottom" aria-hidden="true" />

          {/* Centered Floating White Talent Card */}
          <div className="rf-contact-profile-card">
            <div className="rf-contact-profile-avatar-ring">
              <img
                src={talentToHire.avatar_url}
                alt={talentToHire.full_name}
                className="rf-contact-profile-avatar"
              />
            </div>

            <div className="rf-contact-profile-name">
              <span>{shortName}</span>
              {isVerified && (
                <ShieldCheck
                  size={17}
                  className="rf-contact-profile-verified"
                  aria-label="Verified Talent"
                />
              )}
            </div>

            <p className="rf-contact-profile-headline">{talentToHire.headline}</p>

            <div className="rf-contact-profile-location">
              <MapPin size={13} />
              <span>
                {talentToHire.city}, {talentToHire.country_name}
              </span>
            </div>

            <div className="rf-contact-profile-metrics">
              <div>
                <strong>{formatMoney(talentToHire.starting_price)}</strong>
                <span>Starting Rate</span>
              </div>
              <div>
                <strong>{talentToHire.completed_projects}</strong>
                <span>Jobs done</span>
              </div>
            </div>

            <div
              className="rf-contact-profile-stars"
              aria-label={`Rated ${talentToHire.rating.toFixed(1)} out of 5`}
            >
              {[0, 1, 2, 3, 4].map(i => (
                <Star key={i} size={20} className="rf-contact-star-icon" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ===========================================================================
  // STANDARD SPLIT AUTH SHOWCASE (for /login, /signup, and protected routes)
  // ===========================================================================
  return (
    <section className="rf-auth-shell">
      <div className="rf-auth-grid">
        {/* LEFT COLUMN — Brand & High-Trust Value Showcase */}
        <aside className="rf-auth-showcase">
          <div className="rf-auth-showcase-top">
            <div
              onClick={() => onNavigate('/')}
              style={{ cursor: 'pointer', display: 'inline-flex' }}
            >
              <RefeirLogo size="md" isLight={true} showTagline={false} />
            </div>

            <div className="rf-auth-pill">
              <ShieldCheck size={14} />
              <span>
                {isStandaloneAuthPage
                  ? 'PAN-AFRICAN TALENT & FINTECH NETWORK'
                  : `PROTECTED WORKSPACE · ${pageName.toUpperCase()}`}
              </span>
            </div>

            <h1 className="rf-auth-showcase-title">
              {activeTab === 'SIGNUP'
                ? 'Build, hire, and earn across Africa and the world.'
                : 'Welcome back to your Refeir workspace.'}
            </h1>

            <p className="rf-auth-showcase-sub">
              Connect with verified engineers, designers, and operators — backed by
              multi-currency escrow custody and 10% lifetime scout rewards.
            </p>

            {/* Context Card: Saved AI Wizard Brief */}
            {wizardIntent && (
              <div className="rf-auth-context-card">
                <div className="rf-auth-context-check">
                  <CheckCircle2 size={20} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="rf-auth-context-eyebrow">Project Brief Ready</div>
                  <div className="rf-auth-context-name">
                    {wizardIntent.discipline} · {wizardIntent.package}
                  </div>
                  <div className="rf-auth-context-meta">
                    Est. {wizardIntent.budget} · {wizardIntent.timeline} · Milestone Escrow
                  </div>
                </div>
              </div>
            )}

            {/* Key Trust Pillars */}
            <ul className="rf-auth-pillars">
              <li>
                <span className="rf-auth-pillar-icon">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <strong>Milestone Escrow Custody</strong>
                  <span>Funds are released only when you approve completed work.</span>
                </div>
              </li>
              <li>
                <span className="rf-auth-pillar-icon">
                  <Users size={16} />
                </span>
                <div>
                  <strong>Top 2% Vetted Specialists</strong>
                  <span>Identity-verified talent across 54 African countries &amp; diaspora.</span>
                </div>
              </li>
              <li>
                <span className="rf-auth-pillar-icon">
                  <Compass size={16} />
                </span>
                <div>
                  <strong>One Account, Three Roles</strong>
                  <span>Switch seamlessly between Client, Talent, and Scout anytime.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="rf-auth-showcase-footer">
            <div className="rf-auth-trust-metrics">
              <div>
                <strong>$14.8M+</strong>
                <span>Escrow volume</span>
              </div>
              <div>
                <strong>54</strong>
                <span>Countries covered</span>
              </div>
              <div>
                <strong>99.4%</strong>
                <span>Payout reliability</span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN — Modern Sign In / Sign Up Card */}
        <div className="rf-auth-card">
          <div className="rf-auth-card-head">
            <div className="rf-auth-tabs" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'LOGIN'}
                className={`rf-auth-tab${activeTab === 'LOGIN' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('LOGIN')}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'SIGNUP'}
                className={`rf-auth-tab${activeTab === 'SIGNUP' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('SIGNUP')}
              >
                <UserPlus size={15} />
                <span>Create Account</span>
              </button>
            </div>

            <h2 className="rf-auth-card-title">
              {activeTab === 'LOGIN'
                ? isStandaloneAuthPage
                  ? 'Sign in to your account'
                  : `Sign in to access ${pageName}`
                : 'Create your verified Refeir account'}
            </h2>
            <p className="rf-auth-card-sub">
              {activeTab === 'LOGIN'
                ? 'Choose a social account or enter your email credentials below.'
                : 'Get started in under 60 seconds with your preferred social network or email.'}
            </p>
          </div>

          {activeTab === 'SIGNUP' && (
            <div className="rf-auth-role-section">
              <label className="rf-auth-field-label">I am joining primarily as</label>
              <div className="rf-auth-role-grid">
                {ROLE_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = role === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRole(opt.id)}
                      className={`rf-auth-role-card${isSelected ? ' is-selected' : ''}`}
                      aria-pressed={isSelected}
                    >
                      <div className="rf-auth-role-top">
                        <span className="rf-auth-role-icon">
                          <Icon size={15} />
                        </span>
                        <span className="rf-auth-role-badge">{opt.badge}</span>
                      </div>
                      <div className="rf-auth-role-title">{opt.title}</div>
                      <div className="rf-auth-role-desc">{opt.subtitle}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <SocialAuthButtons
            mode={activeTab}
            onSelectProvider={handleSocialSelect}
            dividerText={
              activeTab === 'LOGIN' ? 'or sign in with email' : 'or register with email'
            }
          />

          {activeTab === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} className="rf-auth-form">
              <div className="rf-auth-field">
                <label className="rf-auth-field-label" htmlFor="rf-auth-login-email">
                  Work or Personal Email
                </label>
                <div className="rf-auth-input-wrap">
                  <Mail size={16} className="rf-auth-input-icon" />
                  <input
                    id="rf-auth-login-email"
                    type="email"
                    className="rf-auth-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="rf-auth-field">
                <div className="rf-auth-label-row">
                  <label className="rf-auth-field-label" htmlFor="rf-auth-login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="rf-auth-inline-link"
                    onClick={() =>
                      alert('A password reset link has been dispatched to your email address.')
                    }
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="rf-auth-input-wrap">
                  <Lock size={16} className="rf-auth-input-icon" />
                  <input
                    id="rf-auth-login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="rf-auth-input has-trailing"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="rf-auth-eye-btn"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="rf-auth-meta-row">
                <label className="rf-auth-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me signed in for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="rf-auth-submit-btn"
              >
                <span>{submitting ? 'Signing in...' : 'Sign In to Workspace'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="rf-auth-form">
              <div className="rf-auth-field-row">
                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-auth-signup-name">
                    Full Name
                  </label>
                  <div className="rf-auth-input-wrap">
                    <UserIcon size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-auth-signup-name"
                      type="text"
                      className="rf-auth-input"
                      placeholder="Amara Okafor"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-auth-signup-email">
                    Email Address
                  </label>
                  <div className="rf-auth-input-wrap">
                    <Mail size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-auth-signup-email"
                      type="email"
                      className="rf-auth-input"
                      placeholder="amara@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="rf-auth-field-row">
                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-auth-signup-country">
                    Country / Market
                  </label>
                  <div className="rf-auth-input-wrap">
                    <Globe size={16} className="rf-auth-input-icon" />
                    <select
                      id="rf-auth-signup-country"
                      className="rf-auth-input rf-auth-select"
                      value={country}
                      onChange={e => {
                        const selectedName = e.target.value;
                        const matchedCountry = getCountryByName(selectedName);
                        setCountry(selectedName);
                        if (matchedCountry) {
                          setDialCode(matchedCountry.dialCode);
                        }
                      }}
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
                </div>

                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-auth-signup-password">
                    Password
                  </label>
                  <div className="rf-auth-input-wrap">
                    <Lock size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-auth-signup-password"
                      type={showPassword ? 'text' : 'password'}
                      className="rf-auth-input has-trailing"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="rf-auth-eye-btn"
                      onClick={() => setShowPassword(p => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rf-auth-field">
                <label className="rf-auth-field-label" htmlFor="rf-auth-signup-phone">
                  Phone Number (for Escrow &amp; Payout Alerts)
                </label>
                <div className="rf-auth-phone-row">
                  <select
                    aria-label="Country calling code"
                    className="rf-auth-input rf-auth-dial-select"
                    value={dialCode}
                    onChange={e => setDialCode(e.target.value)}
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

                  <div className="rf-auth-input-wrap" style={{ flex: 1 }}>
                    <Phone size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-auth-signup-phone"
                      type="tel"
                      className="rf-auth-input"
                      placeholder="801 234 5678"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="rf-auth-submit-btn"
              >
                <span>{submitting ? 'Creating account...' : 'Create Verified Account'}</span>
                <ArrowRight size={16} />
              </button>

              <p className="rf-auth-legal">
                By creating an account, you agree to Refeir&apos;s{' '}
                <button type="button" onClick={() => onNavigate('/terms')}>
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" onClick={() => onNavigate('/privacy')}>
                  Escrow &amp; Privacy Policy
                </button>
                .
              </p>
            </form>
          )}

          <div className="rf-auth-card-footer">
            <div>
              {activeTab === 'LOGIN' ? (
                <>
                  New to Refeir?{' '}
                  <button
                    type="button"
                    className="rf-auth-inline-link"
                    onClick={() => setActiveTab('SIGNUP')}
                  >
                    Create a free account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="rf-auth-inline-link"
                    onClick={() => setActiveTab('LOGIN')}
                  >
                    Sign in instead
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/marketplace')}
              className="rf-auth-back-btn"
            >
              <ArrowLeft size={14} />
              <span>Explore Marketplace</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
