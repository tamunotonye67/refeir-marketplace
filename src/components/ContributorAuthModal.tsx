import React, { useState, useEffect } from 'react';
import {
  X, Lock, Mail, User, Shield, ArrowRight, CheckCircle2,
  AlertCircle, LogIn, UserPlus, Key, Check, HelpCircle
} from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW
} from '../constants/brand';
import { signInContributor, signUpContributor, signInWithGoogle, ContributorProfile } from '../lib/contributorAuth';
import { validateAcceptanceCredentials, PioneerApplicationRecord } from '../lib/pioneerApplications';
import { useTheme } from '../context/ThemeContext';

interface ContributorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (profile: ContributorProfile) => void;
  initialTab?: 'signin' | 'signup';
  prefilledAppNumber?: string;
  prefilledPioneerId?: string;
  prefilledAcceptanceCode?: string;
  onOpenStatus?: () => void;
}

export const ContributorAuthModal: React.FC<ContributorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'signin',
  prefilledAppNumber = '',
  prefilledPioneerId = '',
  prefilledAcceptanceCode = '',
  onOpenStatus
}) => {
  const { theme } = useTheme();
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

  // Update fields when prefilled props change
  useEffect(() => {
    if (prefilledAppNumber) setAppNumber(prefilledAppNumber);
    if (prefilledPioneerId) setPioneerId(prefilledPioneerId);
    if (prefilledAcceptanceCode) setAcceptanceCode(prefilledAcceptanceCode);
    if (initialTab) setTab(initialTab);
  }, [prefilledAppNumber, prefilledPioneerId, prefilledAcceptanceCode, initialTab]);

  // Live verification when Application ID and Acceptance Code are typed
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

  // Lock body and html scroll when auth modal is open to prevent website from scrolling out of sight
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
        onSuccess?.(user);
        onClose();
      } catch (err: any) {
        setErrorMsg(err?.message || 'Authentication failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    } else {
      // Sign Up requires verified Application ID and Acceptance Code
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
        const user = await signUpContributor({
          application_number: appNumber,
          acceptance_code: acceptanceCode,
          email,
          password
        });
        onSuccess?.(user);
        onClose();
        if (!user.is_profile_completed) {
          window.location.href = '/complete-profile';
        }
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
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        background: theme === 'light' ? 'rgba(10, 28, 18, 0.65)' : 'rgba(4, 15, 9, 0.94)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px',
        overflowY: 'auto', overscrollBehavior: 'contain'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme === 'light' ? '#FFFFFF' : `linear-gradient(145deg, ${RF_DARK_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
          border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(102, 187, 42, 0.35)',
          borderRadius: 24, maxWidth: 500, width: '100%',
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex', flexDirection: 'column',
          boxShadow: theme === 'light' ? '0 25px 60px rgba(0,0,0,0.18), 0 0 35px rgba(102, 187, 42, 0.08)' : '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(24, 252, 92, 0.1)',
          position: 'relative', overflow: 'hidden', margin: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 18, right: 18, zIndex: 10,
            width: 32, height: 32, borderRadius: '50%',
            background: theme === 'light' ? '#F1F5F9' : 'rgba(255,255,255,0.06)', border: 'none',
            color: theme === 'light' ? '#475569' : 'rgba(255,255,255,0.6)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '26px 28px 14px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: theme === 'light' ? 'rgba(102, 187, 42, 0.12)' : `${RF_LEAF_GREEN}20`,
            border: theme === 'light' ? '1px solid rgba(102, 187, 42, 0.3)' : `1px solid ${RF_LEAF_GREEN}44`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 12px',
            color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT
          }}>
            <Shield size={22} />
          </div>

          <h3 style={{ fontSize: 21, fontWeight: 800, color: theme === 'light' ? '#0A1C12' : '#FFFFFF', margin: '0 0 6px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {tab === 'signin' ? 'Sign In to Refeir Pioneers' : 'Activate Contributor Profile'}
          </h3>
          <p style={{ fontSize: 12.5, color: theme === 'light' ? '#4A6B56' : 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>
            {tab === 'signin'
              ? 'Access your contributor dashboard, submit task deliverables, and track ladder advancement.'
              : 'Members can only sign up after being accepted by admissions and issued an official Acceptance Code.'}
          </p>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            background: theme === 'light' ? '#F1F5F9' : 'rgba(0,0,0,0.35)',
            borderRadius: 100,
            padding: 4, marginTop: 14,
            border: theme === 'light' ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,0.08)'
          }}>
            <button
              type="button"
              onClick={() => { setTab('signin'); setErrorMsg(''); }}
              style={{
                flex: 1, padding: '7px 14px', borderRadius: 100, border: 'none',
                background: tab === 'signin' ? RF_LEAF_GREEN : 'transparent',
                color: tab === 'signin' ? '#061A0F' : (theme === 'light' ? '#64748B' : 'rgba(255,255,255,0.7)'),
                fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s'
              }}
            >
              <LogIn size={13} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setErrorMsg(''); }}
              style={{
                flex: 1, padding: '7px 14px', borderRadius: 100, border: 'none',
                background: tab === 'signup' ? RF_LEAF_GREEN : 'transparent',
                color: tab === 'signup' ? '#061A0F' : (theme === 'light' ? '#64748B' : 'rgba(255,255,255,0.7)'),
                fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s'
              }}
            >
              <Key size={13} /> Activate (Sign Up)
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '0 28px 24px',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            flex: 1
          }}
        >
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444',
              borderRadius: 10, padding: '10px 14px', color: '#FCA5A5',
              fontSize: 12.5, display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16,
              lineHeight: 1.5
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <span>{errorMsg}</span>
                {tab === 'signup' && onOpenStatus && (
                  <div style={{ marginTop: 6 }}>
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenStatus(); }}
                      style={{
                        background: 'none', border: 'none', padding: 0, color: RF_MINT_ACCENT,
                        fontSize: 12, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer'
                      }}
                    >
                      Look up your Acceptance Code via Check Status →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'signup' ? (
            <>
              {/* Step 1: Acceptance Credentials Notice */}
              <div style={{
                background: theme === 'light' ? 'rgba(102, 187, 42, 0.08)' : 'rgba(24, 252, 92, 0.04)',
                border: theme === 'light' ? '1px solid rgba(102, 187, 42, 0.3)' : '1px solid rgba(102, 187, 42, 0.2)',
                borderRadius: 12, padding: '10px 14px', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <Key size={16} color={theme === 'light' ? '#15803d' : RF_MINT_ACCENT} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: theme === 'light' ? '#1E3A2B' : 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
                  Registration requires your verified <strong style={{ color: theme === 'light' ? '#0A1C12' : '#FFFFFF' }}>Application ID</strong> and official <strong style={{ color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT }}>Acceptance Code</strong>. Your official Pioneer ID will be minted upon completing your profile.
                </div>
              </div>

              {/* Application ID Input */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                  Application ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. RP-2026-849201"
                  value={appNumber}
                  onChange={e => setAppNumber(e.target.value.toUpperCase())}
                  style={{
                    width: '100%', padding: '11px 12px', borderRadius: 10,
                    background: theme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                    border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(102, 187, 42, 0.3)',
                    color: theme === 'light' ? '#0A1C12' : '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'monospace', textTransform: 'uppercase'
                  }}
                />
              </div>

              {/* Acceptance Code */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.85)' }}>
                    Admissions Acceptance Code *
                  </label>
                  {onOpenStatus && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenStatus(); }}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT,
                        fontSize: 11, cursor: 'pointer', textDecoration: 'underline'
                      }}
                    >
                      Forgot / Check Code?
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. ACC-8492-9041"
                  value={acceptanceCode}
                  onChange={e => setAcceptanceCode(e.target.value.toUpperCase())}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    background: theme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                    border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(102, 187, 42, 0.3)',
                    color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT,
                    fontSize: 13.5, outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: 600
                  }}
                />
              </div>

              {/* Verified Application Preview Card */}
              {verifiedApp && (
                <div style={{
                  background: theme === 'light' ? 'rgba(102, 187, 42, 0.1)' : 'rgba(24, 252, 92, 0.08)',
                  border: theme === 'light' ? '1px solid rgba(102, 187, 42, 0.4)' : `1px solid ${RF_LEAF_GREEN}55`,
                  borderRadius: 10, padding: '10px 14px', marginBottom: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16} color={theme === 'light' ? '#15803d' : RF_MINT_ACCENT} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: theme === 'light' ? '#0A1C12' : '#FFFFFF' }}>
                        {verifiedApp.full_name}
                      </div>
                      <div style={{ fontSize: 11, color: theme === 'light' ? '#4A6B56' : 'rgba(255,255,255,0.65)' }}>
                        Squad: {verifiedApp.primary_division || 'General Pioneer'} • {verifiedApp.contributor_level || 'Level 1'}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT,
                    background: theme === 'light' ? 'rgba(102, 187, 42, 0.2)' : 'rgba(24, 252, 92, 0.15)',
                    padding: '2px 8px', borderRadius: 100,
                    textTransform: 'uppercase'
                  }}>
                    Accepted
                  </span>
                </div>
              )}

              {/* Email Address */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px 11px 36px', borderRadius: 10,
                      background: theme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.05)',
                      border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.15)',
                      color: theme === 'light' ? '#0A1C12' : '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <Mail size={15} style={{ position: 'absolute', left: 12, top: 13, color: theme === 'light' ? '#94A3B8' : 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                  Create Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px 11px 36px', borderRadius: 10,
                      background: theme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.05)',
                      border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.15)',
                      color: theme === 'light' ? '#0A1C12' : '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <Lock size={15} style={{ position: 'absolute', left: 12, top: 13, color: theme === 'light' ? '#94A3B8' : 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Sign In Tab */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px 11px 36px', borderRadius: 10,
                      background: theme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.05)',
                      border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.15)',
                      color: theme === 'light' ? '#0A1C12' : '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <Mail size={15} style={{ position: 'absolute', left: 12, top: 13, color: theme === 'light' ? '#94A3B8' : 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px 11px 36px', borderRadius: 10,
                      background: theme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.05)',
                      border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.15)',
                      color: theme === 'light' ? '#0A1C12' : '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <Lock size={15} style={{ position: 'absolute', left: 12, top: 13, color: theme === 'light' ? '#94A3B8' : 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>
            </>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: RF_LEAF_GREEN, color: '#061A0F',
              border: 'none', padding: '13px', borderRadius: 100, fontSize: 14,
              fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s', boxShadow: `0 4px 16px ${RF_LEAF_GREEN}44`
            }}
          >
            {loading ? 'Verifying & Activating...' : tab === 'signin' ? 'Sign In to Account' : 'Verify & Activate Profile'}
            <ArrowRight size={15} />
          </button>

          {/* Google Sign-In Divider & Button */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 10px', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: theme === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: 11, color: theme === 'light' ? '#94A3B8' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
            <div style={{ flex: 1, height: 1, background: theme === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.1)' }} />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setErrorMsg('');
              setLoading(true);
              try {
                const googleUser = await signInWithGoogle(email || undefined);
                onSuccess?.(googleUser);
                onClose();
              } catch (err: any) {
                setErrorMsg(err?.message || 'Google sign-in failed.');
              } finally {
                setLoading(false);
              }
            }}
            style={{
              width: '100%',
              background: theme === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.06)',
              border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: 100,
              padding: '11px 16px',
              color: theme === 'light' ? '#0F172A' : '#FFFFFF',
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
              transition: 'all 0.15s ease'
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick Demo Pre-fill Shortcuts */}
          <div style={{
            marginTop: 20, paddingTop: 14,
            borderTop: theme === 'light' ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: 11, color: theme === 'light' ? '#64748B' : 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>
              {tab === 'signin' ? 'Test Existing Contributor Account:' : 'Test Accepted Applicants (Ready to Activate):'}
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {tab === 'signin' ? (
                <button
                  type="button"
                  onClick={() => handleTestFill('kwame_signin')}
                  style={{
                    background: theme === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.05)',
                    border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.12)',
                    color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT,
                    padding: '4px 10px', borderRadius: 100, fontSize: 11, cursor: 'pointer'
                  }}
                >
                  Kwame (Growth Lead)
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleTestFill('chidubem_signup')}
                    style={{
                      background: theme === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.05)',
                      border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.12)',
                      color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT,
                      padding: '4px 10px', borderRadius: 100, fontSize: 11, cursor: 'pointer'
                    }}
                  >
                    Chidubem (RP-012 • ACC-8492)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestFill('amina_signup')}
                    style={{
                      background: theme === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.05)',
                      border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.12)',
                      color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT,
                      padding: '4px 10px', borderRadius: 100, fontSize: 11, cursor: 'pointer'
                    }}
                  >
                    Amina (RP-028 • ACC-6129)
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
