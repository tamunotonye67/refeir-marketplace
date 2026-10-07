import React, { useState, useEffect } from 'react';
import {
  Lock, Mail, Shield, ArrowRight, CheckCircle2,
  AlertCircle, LogIn, Key, Check, HelpCircle, UserCheck
} from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW
} from '../constants/brand';
import { signInContributor, signUpContributor, signInWithGoogle, getCurrentContributor } from '../lib/contributorAuth';
import { validateAcceptanceCredentials, PioneerApplicationRecord } from '../lib/pioneerApplications';

interface AuthPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
  initialTab?: 'signin' | 'signup';
  prefilledAppNumber?: string;
  prefilledPioneerId?: string;
  prefilledAcceptanceCode?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onNavigate,
  onOpenStatus,
  initialTab = 'signin',
  prefilledAppNumber = '',
  prefilledPioneerId = '',
  prefilledAcceptanceCode = ''
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [appNumber, setAppNumber] = useState(prefilledAppNumber);
  const [pioneerId, setPioneerId] = useState(prefilledPioneerId);
  const [acceptanceCode, setAcceptanceCode] = useState(prefilledAcceptanceCode);
  const [verifiedApp, setVerifiedApp] = useState<PioneerApplicationRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationMsg, setValidationMsg] = useState('');

  useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (prefilledAppNumber) setAppNumber(prefilledAppNumber);
    if (prefilledPioneerId) setPioneerId(prefilledPioneerId);
    if (prefilledAcceptanceCode) setAcceptanceCode(prefilledAcceptanceCode);
  }, [prefilledAppNumber, prefilledPioneerId, prefilledAcceptanceCode]);

  // Live verification when Application ID and Acceptance Code are entered
  useEffect(() => {
    if (tab === 'signup' && appNumber.trim().length >= 8 && acceptanceCode.trim().length >= 6) {
      const check = validateAcceptanceCredentials(appNumber, acceptanceCode);
      if (check.valid && check.application) {
        setVerifiedApp(check.application);
        setEmail(check.application.email);
        setErrorMsg('');
        setValidationMsg(`Verified: ${check.application.full_name} • Application ${check.application.application_number} (${check.application.primary_division || 'Pioneer Squad'})`);
      } else {
        setVerifiedApp(null);
        setValidationMsg('');
        if (check.error) {
          setErrorMsg(check.error);
        }
      }
    } else {
      setVerifiedApp(null);
      setValidationMsg('');
    }
  }, [appNumber, acceptanceCode, tab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (tab === 'signin') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (!password.trim()) {
        setErrorMsg('Please enter your password.');
        return;
      }

      setLoading(true);
      try {
        const user = await signInContributor(email, password);
        if (!user.is_profile_completed) {
          onNavigate('/complete-profile');
        } else {
          onNavigate('/submit-task');
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Authentication failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!appNumber.trim()) {
        setErrorMsg('Please enter your official Application ID (e.g. RP-2026-849201).');
        return;
      }
      if (!acceptanceCode.trim()) {
        setErrorMsg('Please enter your official Acceptance Code (e.g. ACC-8492-9041) issued upon admission.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (!password.trim() || password.length < 6) {
        setErrorMsg('Please create a secure password (at least 6 characters).');
        return;
      }

      setLoading(true);
      try {
        await signUpContributor({
          application_number: appNumber,
          acceptance_code: acceptanceCode,
          email,
          password
        });
        onNavigate('/complete-profile');
      } catch (err: any) {
        setErrorMsg(err?.message || 'Verification failed. Only accepted applicants can register.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTestFill = (type: 'kwame_signin' | 'chidubem_signup' | 'amina_signup') => {
    setErrorMsg('');
    if (type === 'kwame_signin') {
      setTab('signin');
      setEmail('kwame.mensah@example.com');
      setPassword('password123');
    } else if (type === 'chidubem_signup') {
      setTab('signup');
      setAppNumber('RP-2026-849201');
      setAcceptanceCode('ACC-8492-9041');
      setEmail('chidubem.nwosu@example.com');
      setPassword('password123');
    } else if (type === 'amina_signup') {
      setTab('signup');
      setAppNumber('RP-2026-612948');
      setAcceptanceCode('ACC-6129-3319');
      setEmail('amina.k@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="rp-auth-wrapper">
      <div className="rp-auth-container">
        
        {/* Page Header */}
        <div className="rp-auth-header">
          <div className="rp-auth-badge">
            <Shield size={12} /> Authentication
          </div>

          <h1 className="rp-auth-title">
            {tab === 'signin' ? 'Sign In to Pioneers' : 'Activate Profile'}
          </h1>
          <p className="rp-auth-subtitle">
            {tab === 'signin'
              ? 'Access your portal, submit verified tasks, and track your rank.'
              : 'Enter your Application ID and Acceptance Code to activate your access.'}
          </p>
        </div>

        {/* Card Container */}
        <div className="rp-auth-card">

          {/* Tab Switcher (Minimalist & Concise) */}
          <div className="rp-auth-tabs">
            <button
              type="button"
              className="rp-auth-tab-btn"
              onClick={() => { setTab('signin'); setErrorMsg(''); }}
              style={{
                background: tab === 'signin' ? RF_LEAF_GREEN : 'transparent',
                color: tab === 'signin' ? RF_DEEP_GREEN : 'rgba(255,255,255,0.7)',
                boxShadow: tab === 'signin' ? `0 2px 8px ${RF_LEAF_GREEN}44` : 'none'
              }}
            >
              <LogIn size={14} /> Sign In
            </button>
            <button
              type="button"
              className="rp-auth-tab-btn"
              onClick={() => { setTab('signup'); setErrorMsg(''); }}
              style={{
                background: tab === 'signup' ? RF_LEAF_GREEN : 'transparent',
                color: tab === 'signup' ? RF_DEEP_GREEN : 'rgba(255,255,255,0.7)',
                boxShadow: tab === 'signup' ? `0 2px 8px ${RF_LEAF_GREEN}44` : 'none'
              }}
            >
              <Key size={14} /> Activate
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444',
              borderRadius: 12, padding: '11px 14px', color: '#FCA5A5',
              fontSize: 12.5, display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16,
              lineHeight: 1.5
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <span>{errorMsg}</span>
                {tab === 'signup' && onOpenStatus && (
                  <div style={{ marginTop: 6 }}>
                    <button
                      type="button"
                      onClick={onOpenStatus}
                      style={{
                        background: 'none', border: 'none', padding: 0, color: RF_MINT_ACCENT,
                        fontSize: 12, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer'
                      }}
                    >
                      Look up code via Check Status →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation Success Banner */}
          {tab === 'signup' && validationMsg && (
            <div style={{
              background: 'rgba(24, 252, 92, 0.12)', border: `1px solid ${RF_MINT_ACCENT}`,
              borderRadius: 12, padding: '11px 14px', color: '#FFFFFF',
              fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16
            }}>
              <CheckCircle2 size={16} color={RF_MINT_ACCENT} style={{ flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>{validationMsg}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <>
                {/* Notice Box on Activation Prerequisites */}
                <div style={{
                  background: 'rgba(255, 184, 0, 0.08)', border: '1px solid rgba(255, 184, 0, 0.25)',
                  borderRadius: 10, padding: '10px 12px', marginBottom: 14,
                  fontSize: 12, color: '#FDE68A', display: 'flex', alignItems: 'flex-start', gap: 8,
                  lineHeight: 1.45
                }}>
                  <HelpCircle size={15} color={RF_GOLD_YELLOW} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Admission Verification:</strong> Enter your <strong>Application ID</strong> and <strong>Acceptance Code</strong> to activate access.
                  </div>
                </div>

                {/* Application Number */}
                <div className="rp-auth-input-group">
                  <label className="rp-auth-label">
                    Application ID <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="rp-auth-input"
                      placeholder="e.g. RP-2026-849201"
                      value={appNumber}
                      onChange={e => setAppNumber(e.target.value.toUpperCase())}
                      style={{ paddingLeft: 12 }}
                    />
                  </div>
                </div>

                {/* Acceptance Code */}
                <div className="rp-auth-input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label className="rp-auth-label" style={{ marginBottom: 0 }}>
                      Acceptance Code <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    {onOpenStatus && (
                      <button
                        type="button"
                        onClick={onOpenStatus}
                        style={{
                          background: 'none', border: 'none', color: RF_MINT_ACCENT,
                          fontSize: 11, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0
                        }}
                      >
                        Check Status
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="rp-auth-input"
                      placeholder="e.g. ACC-8492-9041"
                      value={acceptanceCode}
                      onChange={e => setAcceptanceCode(e.target.value.toUpperCase())}
                      style={{ paddingLeft: 12, letterSpacing: '0.03em' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="rp-auth-input-group">
              <label className="rp-auth-label">
                Email Address <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="rp-auth-input"
                  placeholder="e.g. yourname@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="rp-auth-input-group" style={{ marginBottom: 16 }}>
              <label className="rp-auth-label">
                {tab === 'signin' ? 'Password' : 'Create Password'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="rp-auth-input"
                  placeholder={tab === 'signin' ? 'Enter password' : 'Min 6 characters'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button (Concise & Minimalist) */}
            <button
              type="submit"
              disabled={loading}
              className="rp-auth-submit-btn"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                'Processing...'
              ) : tab === 'signin' ? (
                <>
                  <LogIn size={15} /> Sign In with Credentials
                </>
              ) : (
                <>
                  <UserCheck size={15} /> Activate Profile
                </>
              )}
            </button>

            {/* Google Sign-In Divider & Button */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0 12px', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setErrorMsg('');
                setLoading(true);
                try {
                  const googleUser = await signInWithGoogle(email || undefined);
                  if (!googleUser.is_profile_completed) {
                    onNavigate('/complete-profile');
                  } else {
                    onNavigate('/submit-task');
                  }
                } catch (err: any) {
                  setErrorMsg(err?.message || 'Google sign-in failed.');
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                padding: '11px 16px',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 9,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Quick Demo Test Profiles */}
          <div className="rp-auth-demo-box">
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginBottom: 7, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Demo Fill
            </div>
            <div className="rp-auth-demo-grid">
              <button
                type="button"
                className="rp-auth-demo-btn"
                onClick={() => handleTestFill('kwame_signin')}
                title="Fill Kwame (Level 3)"
              >
                Kwame (Lvl 3)
              </button>
              <button
                type="button"
                className="rp-auth-demo-btn"
                onClick={() => handleTestFill('chidubem_signup')}
                title="Fill Chidubem (Accepted Recruit)"
              >
                Chidubem (Recruit)
              </button>
              <button
                type="button"
                className="rp-auth-demo-btn"
                onClick={() => handleTestFill('amina_signup')}
                title="Fill Amina (Accepted Recruit)"
              >
                Amina (Recruit)
              </button>
            </div>
          </div>

          {/* Footer Assistance */}
          <div style={{ marginTop: 18, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
            Not yet applied?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/#apply')}
              style={{
                background: 'none', border: 'none', color: RF_MINT_ACCENT,
                fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0
              }}
            >
              Submit Application →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
