import React, { useState, useMemo } from 'react';
import { useAuth, SocialAuthProvider } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  ChevronLeft,
  Eye,
  EyeOff,
  Mail,
  User as UserIcon,
  CheckCircle2,
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
  // CLEAN, SIMPLE WORKSPACE AUTH CARD (for /login, /signup, and protected routes)
  // ===========================================================================
  return (
    <section className="rf-auth-shell is-simple">
      <div className="rf-auth-simple-card">
        <div className="rf-auth-simple-top">
          <div
            onClick={() => onNavigate('/')}
            style={{ cursor: 'pointer', display: 'inline-flex' }}
          >
            <RefeirLogo size="md" showTagline={false} />
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/marketplace')}
            className="rf-auth-back-btn"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>

        <h1 className="rf-auth-card-title">
          {activeTab === 'LOGIN'
            ? isStandaloneAuthPage
              ? 'Log in to Refeir'
              : `Sign in to ${pageName}`
            : 'Create your Refeir account'}
        </h1>
        <p className="rf-auth-card-sub">
          {activeTab === 'LOGIN'
            ? 'Continue with a social account or your email.'
            : 'Select your primary role and get started in seconds.'}
        </p>

        {wizardIntent && (
          <div className="rf-auth-simple-brief">
            <CheckCircle2 size={16} />
            <span>
              Brief saved: <strong>{wizardIntent.discipline}</strong> ({wizardIntent.budget})
            </span>
          </div>
        )}

        {activeTab === 'SIGNUP' && (
          <div className="rf-auth-simple-roles" role="radiogroup" aria-label="Account role">
            {(['CLIENT', 'TALENT', 'SCOUT'] as const).map(r => (
              <button
                key={r}
                type="button"
                className={`rf-auth-simple-role-btn${role === r ? ' is-selected' : ''}`}
                onClick={() => setRole(r)}
                aria-pressed={role === r}
              >
                {r === 'CLIENT' ? 'Client' : r === 'TALENT' ? 'Talent' : 'Scout'}
              </button>
            ))}
          </div>
        )}

        <SocialAuthButtons
          mode={activeTab}
          onSelectProvider={handleSocialSelect}
          dividerText="or with email"
        />

        {activeTab === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="rf-auth-form">
            <div className="rf-auth-field">
              <label className="rf-auth-field-label" htmlFor="rf-auth-login-email">
                Email
              </label>
              <input
                id="rf-auth-login-email"
                type="email"
                className="rf-auth-simple-input"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
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
                <input
                  id="rf-auth-login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="rf-auth-simple-input has-trailing"
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
                <span>Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rf-auth-submit-btn"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="rf-auth-form">
            <div className="rf-auth-field">
              <label className="rf-auth-field-label" htmlFor="rf-auth-signup-name">
                Full name
              </label>
              <input
                id="rf-auth-signup-name"
                type="text"
                className="rf-auth-simple-input"
                placeholder="Amara Okafor"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="rf-auth-field">
              <label className="rf-auth-field-label" htmlFor="rf-auth-signup-email">
                Email
              </label>
              <input
                id="rf-auth-signup-email"
                type="email"
                className="rf-auth-simple-input"
                placeholder="amara@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="rf-auth-field-row">
              <div className="rf-auth-field">
                <label className="rf-auth-field-label" htmlFor="rf-auth-signup-country">
                  Country
                </label>
                <select
                  id="rf-auth-signup-country"
                  className="rf-auth-simple-input"
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
                  <optgroup label="Global Markets">
                    {GLOBAL_COUNTRIES.filter(c => c.region === 'GLOBAL').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="African Markets">
                    {GLOBAL_COUNTRIES.filter(c => c.region === 'AFRICA').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="rf-auth-field">
                <label className="rf-auth-field-label" htmlFor="rf-auth-signup-password">
                  Password
                </label>
                <div className="rf-auth-input-wrap">
                  <input
                    id="rf-auth-signup-password"
                    type={showPassword ? 'text' : 'password'}
                    className="rf-auth-simple-input has-trailing"
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

            <button
              type="submit"
              disabled={submitting}
              className="rf-auth-submit-btn"
            >
              <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
            </button>

            <p className="rf-auth-legal">
              By continuing, you agree to Refeir&apos;s{' '}
              <button type="button" onClick={() => onNavigate('/terms')}>
                Terms
              </button>{' '}
              and{' '}
              <button type="button" onClick={() => onNavigate('/privacy')}>
                Privacy Policy
              </button>
              .
            </p>
          </form>
        )}

        <div className="rf-auth-simple-switch">
          {activeTab === 'LOGIN' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="rf-auth-inline-link"
                onClick={() => setActiveTab('SIGNUP')}
              >
                Sign up
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
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
