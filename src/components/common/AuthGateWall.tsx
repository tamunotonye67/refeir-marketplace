import React, { useState, useMemo } from 'react';
import { useAuth, SocialAuthProvider } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
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
} from 'lucide-react';
import { GLOBAL_COUNTRIES, getCountryByName } from '../../data/countries';
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

export const AuthGateWall: React.FC<AuthGateWallProps> = ({
  pageName,
  initialTab = 'LOGIN',
  initialRole = 'CLIENT',
  talentToHire,
  onNavigate,
  onSuccess,
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

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>(initialTab);
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
    if (isStandaloneAuthPage) {
      if (selectedRole === 'TALENT') onNavigate('/dashboard/talent');
      else if (selectedRole === 'SCOUT') onNavigate('/dashboard/scout');
      else onNavigate('/dashboard/client');
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

  return (
    <section className="rf-auth-shell">
      <div className="rf-auth-grid">
        {/* =================================================================
            LEFT COLUMN — Brand & High-Trust Value Showcase
           ================================================================= */}
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
                {talentToHire
                  ? 'ESCROW-PROTECTED CLIENT ONBOARDING'
                  : isStandaloneAuthPage
                  ? 'PAN-AFRICAN TALENT & FINTECH NETWORK'
                  : `PROTECTED WORKSPACE · ${pageName.toUpperCase()}`}
              </span>
            </div>

            <h1 className="rf-auth-showcase-title">
              {talentToHire
                ? `Hire ${talentToHire.full_name} with milestone escrow protection.`
                : activeTab === 'SIGNUP'
                ? 'Build, hire, and earn across Africa and the world.'
                : 'Welcome back to your Refeir workspace.'}
            </h1>

            <p className="rf-auth-showcase-sub">
              {talentToHire
                ? `Create your client account in seconds to fund milestones, review deliverables, and collaborate directly with ${talentToHire.full_name.split(' ')[0]}.`
                : 'Connect with verified engineers, designers, and operators — backed by multi-currency escrow custody and 10% lifetime scout rewards.'}
            </p>

            {/* Context Card: Selected Talent to Hire */}
            {talentToHire && (
              <div className="rf-auth-context-card">
                <img
                  src={talentToHire.avatar_url}
                  alt={talentToHire.full_name}
                  className="rf-auth-context-avatar"
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="rf-auth-context-eyebrow">Selected Talent</div>
                  <div className="rf-auth-context-name">{talentToHire.full_name}</div>
                  <div className="rf-auth-context-meta">{talentToHire.headline}</div>
                </div>
              </div>
            )}

            {/* Context Card: Saved AI Wizard Brief */}
            {wizardIntent && !talentToHire && (
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
                  <span>Identity-verified talent across 54 African countries & diaspora.</span>
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

        {/* =================================================================
            RIGHT COLUMN — Modern Sign In / Sign Up Card
           ================================================================= */}
        <div className="rf-auth-card">
          {/* Top Header */}
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
                : talentToHire
                ? `Create client account to hire ${talentToHire.full_name.split(' ')[0]}`
                : 'Create your verified Refeir account'}
            </h2>
            <p className="rf-auth-card-sub">
              {activeTab === 'LOGIN'
                ? 'Choose a social account or enter your email credentials below.'
                : 'Get started in under 60 seconds with your preferred social network or email.'}
            </p>
          </div>

          {/* Role Selector (shown on Sign Up so social or email signup picks the right role) */}
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

          {/* Social Auth: Google, GitHub, LinkedIn, Facebook, Pinterest */}
          <SocialAuthButtons
            mode={activeTab}
            onSelectProvider={handleSocialSelect}
            dividerText={
              activeTab === 'LOGIN' ? 'or sign in with email' : 'or register with email'
            }
          />

          {/* Email Form */}
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
                  Phone Number (for Escrow & Payout Alerts)
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

          {/* Footer Switch + Back Link */}
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
