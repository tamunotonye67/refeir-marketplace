import React, { useState } from 'react';
import { useAuth, SocialAuthProvider } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  ChevronLeft,
  Eye,
  EyeOff,
  Mail,
  User as UserIcon,
  Phone,
  CheckCircle2,
  MapPin,
  Star,
  X,
} from 'lucide-react';
import { GLOBAL_COUNTRIES } from '../../data/countries';
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

const LEFT_CHECKLIST = [
  'Milestone escrow protection on every project',
  '10% lifetime rewards for referring vetted talent',
  'Identity-verified specialists across 54 countries',
  'Multi-currency payouts in USD, NGN, KES & GHS',
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

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>(
    talentToHire ? 'SIGNUP' : initialTab
  );
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState('+234');
  const [role, setRole] = useState<'SCOUT' | 'TALENT' | 'CLIENT'>(initialRole);
  const [country, setCountry] = useState('Nigeria');
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
      const fName = firstName.trim() || name.trim().split(' ')[0] || 'User';
      const lName =
        lastName.trim() || name.trim().split(' ').slice(1).join(' ') || 'Member';
      await signup({
        first_name: fName,
        last_name: lName,
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
  // ===========================================================================
  if (talentToHire) {
    const shortName = formatShortName(talentToHire.full_name);
    const firstNameTalent = talentToHire.full_name.trim().split(/\s+/)[0] || shortName;
    const isVerified =
      talentToHire.verification_status === 'IDENTITY_VERIFIED' ||
      talentToHire.verification_status === 'PROFESSION_VERIFIED';

    return (
      <section className="rf-contact-gate">
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
                <span>Contact {firstNameTalent}</span>
              </div>
            </div>

            {!showEmailForm ? (
              <div className="rf-contact-actions">
                <SocialAuthButtons
                  mode={activeTab}
                  onSelectProvider={handleSocialSelect}
                  dividerText="or"
                />

                <button
                  type="button"
                  className="rf-contact-email-btn"
                  onClick={() => setShowEmailForm(true)}
                >
                  <Mail size={16} />
                  <span>Continue with email</span>
                </button>
              </div>
            ) : activeTab === 'SIGNUP' ? (
              <form onSubmit={handleSignupSubmit} className="rf-contact-email-form">
                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-contact-name">
                    Full Name
                  </label>
                  <div className="rf-auth-input-wrap">
                    <UserIcon size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-contact-name"
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
                  <label className="rf-auth-field-label" htmlFor="rf-contact-email">
                    Work or Personal Email
                  </label>
                  <div className="rf-auth-input-wrap">
                    <Mail size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-contact-email"
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
                  <label className="rf-auth-field-label" htmlFor="rf-contact-password">
                    Password
                  </label>
                  <div className="rf-auth-input-wrap">
                    <Lock size={16} className="rf-auth-input-icon" />
                    <input
                      id="rf-contact-password"
                      type={showPassword ? 'text' : 'password'}
                      className="rf-auth-input has-trailing"
                      placeholder="Create a password (min. 8 characters)"
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
                  className="rf-contact-submit-btn"
                >
                  {submitting ? 'Creating account...' : `Continue to contact ${firstNameTalent}`}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="rf-contact-email-form">
                <div className="rf-auth-field">
                  <label className="rf-auth-field-label" htmlFor="rf-contact-login-email">
                    Email Address
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
                  className="rf-contact-submit-btn"
                >
                  {submitting ? 'Signing in...' : `Sign in & contact ${firstNameTalent}`}
                </button>
              </form>
            )}

            <div className="rf-contact-switch-row">
              {activeTab === 'SIGNUP' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('LOGIN');
                      setShowEmailForm(false);
                    }}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New to Refeir?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('SIGNUP');
                      setShowEmailForm(false);
                    }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rf-contact-gate-legal">
            By continuing, you agree to Refeir&apos;s{' '}
            <button type="button" onClick={() => onNavigate('/terms')}>
              Terms of Use
            </button>{' '}
            and{' '}
            <button type="button" onClick={() => onNavigate('/privacy')}>
              Privacy Policy
            </button>
            .
          </div>
        </div>

        <div className="rf-contact-gate-right">
          <button
            type="button"
            className="rf-contact-close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="rf-contact-profile-card">
            <div className="rf-contact-profile-avatar-wrap">
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
  // FULL-SCREEN 50/50 SPLIT SIGN IN & SIGN UP PAGE (Matching Reference Images)
  // ===========================================================================
  return (
    <section className="rf-sp-auth">
      {/* LEFT PANEL — Dark Brand Canvas */}
      <aside className="rf-sp-left">
        <div className="rf-sp-glow" aria-hidden="true" />

        <div className="rf-sp-left-top">
          <div
            onClick={() => onNavigate('/')}
            style={{ cursor: 'pointer', display: 'inline-flex' }}
          >
            <RefeirLogo size="md" isLight={true} showTagline={false} />
          </div>
        </div>

        <div className="rf-sp-left-center">
          <h1 className="rf-sp-hero-title">
            {activeTab === 'SIGNUP' ? (
              <>
                Hire &amp; earn with <span>real confidence</span>
              </>
            ) : (
              <>
                Welcome back to <span>Refeir</span>
              </>
            )}
          </h1>

          <p className="rf-sp-hero-sub">
            {activeTab === 'SIGNUP'
              ? 'Create your free account and join thousands of clients, talents, and scouts across Africa.'
              : 'Pick up right where you left off — your projects, escrow wallet, and referrals are waiting.'}
          </p>

          <ul className="rf-sp-checklist">
            {LEFT_CHECKLIST.map(item => (
              <li key={item}>
                <CheckCircle2 size={17} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rf-sp-left-bottom">
          <div className="rf-sp-stats">
            <div>
              <strong>2,500+</strong>
              <span>Talents</span>
            </div>
            <div>
              <strong>54</strong>
              <span>Countries</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>Rating</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL — Clean White Form Canvas */}
      <div className="rf-sp-right">
        <div className="rf-sp-right-inner">
          <button
            type="button"
            className="rf-sp-back"
            onClick={() => onNavigate('/')}
          >
            Back to home
          </button>

          <div className="rf-sp-card">
            <h2 className="rf-sp-card-title">
              {activeTab === 'SIGNUP' ? 'Create your free account' : 'Log in to your account'}
            </h2>
            <p className="rf-sp-card-switch">
              {activeTab === 'SIGNUP' ? (
                <>
                  Already registered?{' '}
                  <button type="button" onClick={() => setActiveTab('LOGIN')}>
                    Log in
                  </button>
                </>
              ) : (
                <>
                  New here?{' '}
                  <button type="button" onClick={() => setActiveTab('SIGNUP')}>
                    Create an account
                  </button>
                </>
              )}
            </p>

            <SocialAuthButtons
              mode={activeTab}
              onSelectProvider={handleSocialSelect}
              dividerText="OR CONTINUE WITH EMAIL"
            />

            {activeTab === 'LOGIN' ? (
              <form onSubmit={handleLoginSubmit} className="rf-sp-form">
                <div className="rf-sp-field">
                  <label htmlFor="rf-sp-login-email">EMAIL ADDRESS</label>
                  <div className="rf-sp-input-box">
                    <Mail size={16} className="rf-sp-icon" />
                    <input
                      id="rf-sp-login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="rf-sp-field">
                  <label htmlFor="rf-sp-login-password">PASSWORD</label>
                  <div className="rf-sp-input-box">
                    <Lock size={16} className="rf-sp-icon" />
                    <input
                      id="rf-sp-login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="rf-sp-eye"
                      onClick={() => setShowPassword(p => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="rf-sp-row-between">
                  <label className="rf-sp-remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="rf-sp-forgot"
                    onClick={() =>
                      alert('A password reset link has been dispatched to your email address.')
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" disabled={submitting} className="rf-sp-submit">
                  {submitting ? 'Logging in...' : 'Log In'}
                </button>

                <p className="rf-sp-privacy">
                  Protected by our{' '}
                  <button type="button" onClick={() => onNavigate('/privacy')}>
                    Privacy Policy
                  </button>
                  .
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="rf-sp-form">
                <div className="rf-sp-role-bar" role="radiogroup" aria-label="Account role">
                  {(['CLIENT', 'TALENT', 'SCOUT'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      className={role === r ? 'is-active' : ''}
                      onClick={() => setRole(r)}
                      aria-pressed={role === r}
                    >
                      {r === 'CLIENT' ? 'Client' : r === 'TALENT' ? 'Talent' : 'Scout'}
                    </button>
                  ))}
                </div>

                <div className="rf-sp-grid-2">
                  <div className="rf-sp-field">
                    <label htmlFor="rf-sp-first-name">FIRST NAME</label>
                    <div className="rf-sp-input-box">
                      <UserIcon size={16} className="rf-sp-icon" />
                      <input
                        id="rf-sp-first-name"
                        type="text"
                        placeholder="Jane"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        required
                      />
                    </div>
                  </div>

                  <div className="rf-sp-field">
                    <label htmlFor="rf-sp-last-name">LAST NAME</label>
                    <div className="rf-sp-input-box">
                      <UserIcon size={16} className="rf-sp-icon" />
                      <input
                        id="rf-sp-last-name"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        autoComplete="family-name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="rf-sp-field">
                  <label htmlFor="rf-sp-signup-email">EMAIL ADDRESS</label>
                  <div className="rf-sp-input-box">
                    <Mail size={16} className="rf-sp-icon" />
                    <input
                      id="rf-sp-signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="rf-sp-field">
                  <label htmlFor="rf-sp-phone">PHONE NUMBER</label>
                  <div className="rf-sp-phone-grid">
                    <select
                      aria-label="Country dial code"
                      className="rf-sp-dial"
                      value={dialCode}
                      onChange={e => {
                        const code = e.target.value;
                        setDialCode(code);
                        const matched = GLOBAL_COUNTRIES.find(c => c.dialCode === code);
                        if (matched) setCountry(matched.name);
                      }}
                    >
                      {GLOBAL_COUNTRIES.map(c => (
                        <option key={c.code} value={c.dialCode}>
                          {c.code} {c.dialCode}
                        </option>
                      ))}
                    </select>
                    <div className="rf-sp-input-box">
                      <Phone size={16} className="rf-sp-icon" />
                      <input
                        id="rf-sp-phone"
                        type="tel"
                        placeholder="801 234 5678"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </div>

                <div className="rf-sp-field">
                  <label htmlFor="rf-sp-signup-password">PASSWORD</label>
                  <div className="rf-sp-input-box">
                    <Lock size={16} className="rf-sp-icon" />
                    <input
                      id="rf-sp-signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="rf-sp-eye"
                      onClick={() => setShowPassword(p => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="rf-sp-hint">Must be at least 6 characters.</span>
                </div>

                <button type="submit" disabled={submitting} className="rf-sp-submit">
                  {submitting ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="rf-sp-privacy">
                  Protected by our{' '}
                  <button type="button" onClick={() => onNavigate('/privacy')}>
                    Privacy Policy
                  </button>
                  .
                </p>
              </form>
            )}
          </div>

          <div className="rf-sp-copyright">
            Copyright &copy; {new Date().getFullYear()} <strong>Refeir Marketplace</strong>. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
};
