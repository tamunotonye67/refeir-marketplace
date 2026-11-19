import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  ArrowLeft,
  Briefcase,
  Award,
  Compass,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import { useAuth, SocialAuthProvider } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { RefeirLogo } from '../common/RefeirLogo';
import { GLOBAL_COUNTRIES } from '../../data/countries';
import { SOCIAL_AUTH_PROVIDERS } from './SocialAuthButtons';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'LOGIN' | 'SIGNUP';
  onClose: () => void;
  onSuccess: (role?: UserRole) => void;
  onNavigate?: (path: string) => void;
}

type SignupRole = 'CLIENT' | 'TALENT' | 'SCOUT';

const ROLE_OPTIONS: {
  role: SignupRole;
  title: string;
  ctaLabel: string;
  formHeading: string;
  icon: LucideIcon;
}[] = [
  {
    role: 'CLIENT',
    title: "I'm a client, hiring for a project",
    ctaLabel: 'Join as a Client',
    formHeading: 'Sign up to hire talent',
    icon: Briefcase,
  },
  {
    role: 'TALENT',
    title: "I'm talent, looking for work",
    ctaLabel: 'Apply as Talent',
    formHeading: 'Sign up to find work you love',
    icon: Award,
  },
  {
    role: 'SCOUT',
    title: "I'm a scout, referring & earning 10%",
    ctaLabel: 'Join as a Scout',
    formHeading: 'Sign up to earn as a scout',
    icon: Compass,
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
  onNavigate,
}) => {
  const { login, signup, loginWithSocial } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  const [signupStep, setSignupStep] = useState<'ROLE' | 'FORM'>('ROLE');
  const [selectedRole, setSelectedRole] = useState<SignupRole>('CLIENT');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [country, setCountry] = useState('Nigeria');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSocial, setLoadingSocial] = useState<SocialAuthProvider | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSignupStep('ROLE');
      setErrorMsg(null);
      setResetSent(false);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeRoleMeta = ROLE_OPTIONS.find(r => r.role === selectedRole) || ROLE_OPTIONS[0];
  const googleProvider = SOCIAL_AUTH_PROVIDERS.find(p => p.id === 'google')!;
  const secondarySocialProviders = SOCIAL_AUTH_PROVIDERS.filter(p => p.id !== 'google');

  const switchMode = (nextMode: 'LOGIN' | 'SIGNUP') => {
    setMode(nextMode);
    setSignupStep('ROLE');
    setErrorMsg(null);
    setResetSent(false);
  };

  const handleSocialAuth = async (provider: SocialAuthProvider) => {
    if (loadingSocial || isSubmitting) return;
    setErrorMsg(null);
    setLoadingSocial(provider);
    try {
      const targetRole: UserRole = mode === 'SIGNUP' ? selectedRole : 'CLIENT';
      await loginWithSocial(provider, targetRole);
      onClose();
      onSuccess(targetRole);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to continue with social sign in. Please try again.');
    } finally {
      setLoadingSocial(null);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSent(false);

    const email = loginEmail.trim();
    const password = loginPassword.trim();
    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      setLoginEmail('');
      setLoginPassword('');
      onClose();
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim() || !signupEmail.trim()) {
      setErrorMsg('Please fill in your name and email address.');
      return;
    }
    if (signupPassword.trim().length > 0 && signupPassword.trim().length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: signupEmail.trim(),
        password: signupPassword.trim() || undefined,
        roles: [selectedRole],
        active_role: selectedRole,
        country,
      });
      setFirstName('');
      setLastName('');
      setSignupEmail('');
      setSignupPassword('');
      onClose();
      onSuccess(selectedRole);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setErrorMsg(null);
    if (!loginEmail.trim()) {
      setErrorMsg('Enter your email address above first to receive a reset link.');
      return;
    }
    setResetSent(true);
  };

  const renderSocialStack = () => (
    <div className="rf-uw-social-stack">
      <button
        type="button"
        className="rf-uw-social-btn is-google"
        onClick={() => handleSocialAuth('google')}
        disabled={Boolean(loadingSocial) || isSubmitting}
      >
        <span className="rf-uw-social-icon">
          {loadingSocial === 'google' ? (
            <Loader2 size={18} className="rf-spin" />
          ) : (
            googleProvider.icon
          )}
        </span>
        <span>Continue with Google</span>
      </button>

      <div className="rf-uw-social-row">
        {secondarySocialProviders.map(provider => {
          const isBusy = loadingSocial === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              className="rf-uw-social-btn is-icon-only"
              onClick={() => handleSocialAuth(provider.id)}
              disabled={Boolean(loadingSocial) || isSubmitting}
              aria-label={provider.label}
              title={provider.label}
            >
              <span className="rf-uw-social-icon">
                {isBusy ? <Loader2 size={18} className="rf-spin" /> : provider.icon}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className="rf-modal-backdrop rf-uw-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`rf-modal-content rf-uw-modal${
          mode === 'SIGNUP' && signupStep === 'ROLE' ? ' is-wide' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rf-uw-auth-title"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Bar: Logo or Back + Close */}
        <div className="rf-uw-topbar">
          {mode === 'SIGNUP' && signupStep === 'FORM' ? (
            <button
              type="button"
              className="rf-uw-back-btn"
              onClick={() => {
                setSignupStep('ROLE');
                setErrorMsg(null);
              }}
            >
              <ArrowLeft size={15} />
              <span>Change role</span>
            </button>
          ) : (
            <RefeirLogo variant="full" size="sm" />
          )}

          <button
            type="button"
            className="rf-uw-close-btn"
            onClick={onClose}
            aria-label="Close authentication modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inline Error / Reset Notice */}
        {errorMsg && (
          <div className="rf-uw-alert is-error" role="alert">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}
        {resetSent && (
          <div className="rf-uw-alert is-success" role="status">
            <CheckCircle2 size={15} />
            <span>Password reset instructions sent to {loginEmail.trim()}.</span>
          </div>
        )}

        {/* ================================================================
            VIEW 1: LOG IN
           ================================================================ */}
        {mode === 'LOGIN' && (
          <div className="rf-uw-body">
            <h2 id="rf-uw-auth-title" className="rf-uw-title">
              Log in to Refeir
            </h2>

            <form onSubmit={handleLoginSubmit} className="rf-uw-form">
              <div className="rf-uw-field">
                <label className="rf-uw-label" htmlFor="rf-login-email">
                  Email
                </label>
                <input
                  id="rf-login-email"
                  type="email"
                  className="rf-uw-input"
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>

              <div className="rf-uw-field">
                <div className="rf-uw-label-row">
                  <label className="rf-uw-label" htmlFor="rf-login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="rf-uw-link-btn"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="rf-uw-password-wrap">
                  <input
                    id="rf-login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    className="rf-uw-input has-trailing"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="rf-uw-eye-btn"
                    onClick={() => setShowLoginPassword(prev => !prev)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="rf-uw-primary-btn"
                disabled={isSubmitting || Boolean(loadingSocial)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="rf-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Log in</span>
                )}
              </button>
            </form>

            <div className="rf-uw-divider">
              <span>or</span>
            </div>

            {renderSocialStack()}

            <div className="rf-uw-footer">
              <p className="rf-uw-footer-text">Don&apos;t have a Refeir account?</p>
              <button
                type="button"
                className="rf-uw-outline-btn"
                onClick={() => switchMode('SIGNUP')}
              >
                Sign up
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            VIEW 2A: SIGN UP — STEP 1 (ROLE CHOOSER)
           ================================================================ */}
        {mode === 'SIGNUP' && signupStep === 'ROLE' && (
          <div className="rf-uw-body">
            <h2 id="rf-uw-auth-title" className="rf-uw-title">
              Join as a client, talent, or scout
            </h2>

            <div className="rf-uw-role-grid" role="radiogroup" aria-label="Account type">
              {ROLE_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedRole === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`rf-uw-role-card${isSelected ? ' is-selected' : ''}`}
                    onClick={() => setSelectedRole(opt.role)}
                  >
                    <div className="rf-uw-role-card-top">
                      <span className="rf-uw-role-icon">
                        <Icon size={20} />
                      </span>
                      <span className={`rf-uw-radio${isSelected ? ' is-checked' : ''}`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </span>
                    </div>
                    <div className="rf-uw-role-card-title">{opt.title}</div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="rf-uw-primary-btn rf-uw-role-continue"
              onClick={() => {
                setErrorMsg(null);
                setSignupStep('FORM');
              }}
            >
              {activeRoleMeta.ctaLabel}
            </button>

            <div className="rf-uw-footer-inline">
              <span>Already have an account?</span>{' '}
              <button
                type="button"
                className="rf-uw-link-btn"
                onClick={() => switchMode('LOGIN')}
              >
                Log in
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            VIEW 2B: SIGN UP — STEP 2 (ACCOUNT FORM)
           ================================================================ */}
        {mode === 'SIGNUP' && signupStep === 'FORM' && (
          <div className="rf-uw-body">
            <h2 id="rf-uw-auth-title" className="rf-uw-title">
              {activeRoleMeta.formHeading}
            </h2>

            {renderSocialStack()}

            <div className="rf-uw-divider">
              <span>or</span>
            </div>

            <form onSubmit={handleSignupSubmit} className="rf-uw-form">
              <div className="rf-uw-name-row">
                <div className="rf-uw-field">
                  <label className="rf-uw-label" htmlFor="rf-signup-first">
                    First name
                  </label>
                  <input
                    id="rf-signup-first"
                    type="text"
                    className="rf-uw-input"
                    placeholder="Kwame"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="rf-uw-field">
                  <label className="rf-uw-label" htmlFor="rf-signup-last">
                    Last name
                  </label>
                  <input
                    id="rf-signup-last"
                    type="text"
                    className="rf-uw-input"
                    placeholder="Mensah"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="rf-uw-field">
                <label className="rf-uw-label" htmlFor="rf-signup-email">
                  {selectedRole === 'CLIENT' ? 'Work email' : 'Email'}
                </label>
                <input
                  id="rf-signup-email"
                  type="email"
                  className="rf-uw-input"
                  placeholder="name@company.com"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="rf-uw-field">
                <label className="rf-uw-label" htmlFor="rf-signup-password">
                  Password
                </label>
                <div className="rf-uw-password-wrap">
                  <input
                    id="rf-signup-password"
                    type={showSignupPassword ? 'text' : 'password'}
                    className="rf-uw-input has-trailing"
                    placeholder="Password (8 or more characters)"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="rf-uw-eye-btn"
                    onClick={() => setShowSignupPassword(prev => !prev)}
                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="rf-uw-field">
                <label className="rf-uw-label" htmlFor="rf-signup-country">
                  Country
                </label>
                <select
                  id="rf-signup-country"
                  className="rf-uw-input rf-uw-select"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                >
                  <optgroup label="Pan-African Markets">
                    {GLOBAL_COUNTRIES.filter(c => c.region === 'AFRICA').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Global Client Markets">
                    {GLOBAL_COUNTRIES.filter(c => c.region === 'GLOBAL').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <label className="rf-uw-terms">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                />
                <span>
                  Yes, I understand and agree to the{' '}
                  <button
                    type="button"
                    className="rf-uw-terms-link"
                    onClick={() => {
                      onClose();
                      onNavigate?.('/terms');
                    }}
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="rf-uw-terms-link"
                    onClick={() => {
                      onClose();
                      onNavigate?.('/privacy');
                    }}
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="rf-uw-primary-btn"
                disabled={isSubmitting || Boolean(loadingSocial)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="rf-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create my account</span>
                )}
              </button>
            </form>

            <div className="rf-uw-footer-inline">
              <span>Already have an account?</span>{' '}
              <button
                type="button"
                className="rf-uw-link-btn"
                onClick={() => switchMode('LOGIN')}
              >
                Log in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
