import React, { useState } from 'react';
import {
  Search, X, CheckCircle2, Clock, AlertCircle, ExternalLink,
  Copy, Check, Key, ArrowRight, Shield
} from 'lucide-react';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, query as fsQuery, where, getDocs, limit } from 'firebase/firestore';
import { findApplicationByLookup, PioneerApplicationRecord } from '../lib/pioneerApplications';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW
} from '../constants/brand';
import { useTheme } from '../context/ThemeContext';

export type PioneerReviewStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';

export interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateAccount?: (appNumber: string, acceptanceCode: string, pioneerId?: string) => void;
}

export const StatusLookupModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  onActivateAccount
}) => {
  const { theme } = useTheme();
  const [appNumber, setAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [copiedApp, setCopiedApp] = useState(false);
  const [copiedPioneer, setCopiedPioneer] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [result, setResult] = useState<{
    status: PioneerReviewStatus;
    fullName: string;
    applicationNumber: string;
    acceptanceCode?: string;
    division?: string;
    isFounding?: boolean;
    pioneerId?: string;
  } | null>(null);

  // Lock body scroll while status modal is open to prevent underlying website from scrolling
  React.useEffect(() => {
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

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = appNumber.trim() || email.trim();
    if (!query) return;
    setLookupState('loading');

    try {
      // First check local stored applications
      const localApp = findApplicationByLookup(query);
      if (localApp) {
        setResult({
          status: localApp.status,
          fullName: localApp.full_name,
          applicationNumber: localApp.application_number,
          acceptanceCode: localApp.acceptance_code || undefined,
          division: localApp.primary_division || 'Pioneer Squad',
          isFounding: localApp.is_founding_100,
          pioneerId: localApp.pioneer_id || undefined
        });
        setLookupState('found');
        return;
      }

      if (isFirebaseConfigured) {
        let q;
        if (appNumber.trim()) {
          q = fsQuery(
            collection(db, 'pioneer_applications'),
            where('application_number', '==', appNumber.trim().toUpperCase()),
            limit(1)
          );
        } else if (email.trim()) {
          q = fsQuery(
            collection(db, 'pioneer_applications'),
            where('email', '==', email.trim().toLowerCase()),
            limit(1)
          );
        }

        if (q) {
          const snap = await getDocs(q);
          if (!snap.empty) {
            const app = snap.docs[0].data() as any;
            setResult({
              status: (app.review_status || app.status || 'PENDING') as PioneerReviewStatus,
              fullName: app.full_name || 'Applicant',
              applicationNumber: app.application_number || query.toUpperCase(),
              acceptanceCode: app.acceptance_code || undefined,
              division: app.primary_division,
              isFounding: app.is_founding_100,
              pioneerId: app.pioneer_id
            });
            setLookupState('found');
            return;
          }
        }
      }

      setLookupState('not_found');
    } catch {
      setLookupState('not_found');
    }
  };

  const copyToClipboard = (text: string, type: 'app' | 'pioneer' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'app') {
      setCopiedApp(true);
      setTimeout(() => setCopiedApp(false), 2000);
    } else if (type === 'pioneer') {
      setCopiedPioneer(true);
      setTimeout(() => setCopiedPioneer(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      background: theme === 'light' ? 'rgba(15, 46, 30, 0.45)' : 'rgba(4, 15, 9, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px',
      overflowY: 'auto', overscrollBehavior: 'contain'
    }} onClick={onClose}>
      <div style={{
        background: theme === 'light' ? '#FFFFFF' : `linear-gradient(135deg, ${RF_DARK_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        border: theme === 'light' ? '1px solid rgba(15, 46, 30, 0.14)' : `1px solid rgba(102, 187, 42, 0.35)`,
        borderRadius: 20, maxWidth: 520, width: '100%', padding: '32px 28px',
        maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', overscrollBehavior: 'contain',
        boxShadow: theme === 'light' ? '0 25px 60px rgba(15, 46, 30, 0.16)' : '0 25px 60px rgba(0,0,0,0.9)',
        position: 'relative', margin: 'auto'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20,
          color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.6)',
          background: theme === 'light' ? 'rgba(15, 46, 30, 0.05)' : 'rgba(255,255,255,0.06)',
          borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none'
        }}>
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Shield size={16} color={RF_LEAF_GREEN} />
          <span style={{ fontSize: 11, fontWeight: 700, color: RF_LEAF_GREEN, letterSpacing: '0.16em' }}>
            ADMISSIONS PORTAL
          </span>
        </div>
        <h3 style={{
          fontSize: 22, fontWeight: 700,
          color: theme === 'light' ? '#0A1C12' : '#FFFFFF',
          marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          Check Application &amp; Acceptance Status
        </h3>
        <p style={{
          fontSize: 13,
          color: theme === 'light' ? '#273E31' : 'rgba(255,255,255,0.7)',
          marginBottom: 24, lineHeight: 1.6
        }}>
          Enter your Application ID (e.g. <span style={{ color: theme === 'light' ? '#15803D' : RF_MINT_ACCENT, fontFamily: 'monospace', fontWeight: 600 }}>RP-2026-849201</span>) or email address to review your status and retrieve your credentials. Use your Application ID and Acceptance Code to activate your account.
        </p>

        {lookupState !== 'found' ? (
          <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.85)',
                marginBottom: 6
              }}>
                Application Number
              </label>
              <input
                type="text"
                placeholder="RP-2026-XXXXXX"
                value={appNumber}
                onChange={e => setAppNumber(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  background: theme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                  border: theme === 'light' ? '1px solid #CBD5E1' : `1px solid rgba(102, 187, 42, 0.3)`,
                  color: theme === 'light' ? '#0A1C12' : '#FFFFFF',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'monospace', textTransform: 'uppercase'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '2px 0' }}>
              <div style={{ flex: 1, height: 1, background: theme === 'light' ? 'rgba(15, 46, 30, 0.1)' : 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 11, color: theme === 'light' ? '#526E5E' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: theme === 'light' ? 'rgba(15, 46, 30, 0.1)' : 'rgba(255,255,255,0.1)' }} />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.85)',
                marginBottom: 6
              }}>
                Registered Email
              </label>
              <input
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  background: theme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                  border: theme === 'light' ? '1px solid #CBD5E1' : `1px solid rgba(102, 187, 42, 0.3)`,
                  color: theme === 'light' ? '#0A1C12' : '#FFFFFF',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            {lookupState === 'not_found' && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
                color: '#EF4444', fontSize: 12.5
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>No application found. Please verify your Application ID or registered email address.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={lookupState === 'loading'}
              style={{
                background: RF_LEAF_GREEN, color: '#061A0F', border: 'none',
                padding: '13px', borderRadius: 100, fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: lookupState === 'loading' ? 'not-allowed' : 'pointer',
                letterSpacing: '0.01em', transition: 'all 0.2s'
              }}
            >
              {lookupState === 'loading' ? 'Checking...' : 'Check Status'}
            </button>
          </form>
        ) : (
          <div>
            {result?.status === 'ACCEPTED' ? (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                <h4 style={{ fontSize: 20, fontWeight: 700, color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT, marginBottom: 6 }}>
                  You're Officially a Refeir Pioneer!
                </h4>
                <p style={{ fontSize: 13.5, color: theme === 'light' ? '#243C2E' : 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: 18 }}>
                  Welcome aboard, <strong style={{ color: theme === 'light' ? '#0A1C12' : '#fff' }}>{result.fullName}</strong>! Your application has been approved into the Pioneer program.
                </p>

                {/* Acceptance Credentials Card */}
                <div style={{
                  background: theme === 'light' ? 'rgba(102, 187, 42, 0.08)' : 'rgba(24, 252, 92, 0.05)',
                  borderRadius: 14, padding: '18px 20px',
                  marginBottom: 18,
                  border: theme === 'light' ? '1px solid rgba(102, 187, 42, 0.4)' : '1px solid rgba(102, 187, 42, 0.35)',
                  textAlign: 'left'
                }}>
                  {/* Application ID */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingBottom: 10, marginBottom: 10,
                    borderBottom: theme === 'light' ? '1px solid rgba(15, 46, 30, 0.1)' : '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div>
                      <span style={{ fontSize: 11, color: theme === 'light' ? '#526E5E' : 'rgba(255,255,255,0.5)', display: 'block' }}>Official Application ID</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: theme === 'light' ? '#0A1C12' : '#FFFFFF', fontFamily: 'monospace' }}>
                        {result.applicationNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.applicationNumber, 'app')}
                      style={{
                        background: theme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                        border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.12)',
                        color: copiedApp ? (theme === 'light' ? '#166534' : RF_MINT_ACCENT) : (theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.8)'),
                        padding: '5px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 5
                      }}
                    >
                      {copiedApp ? <Check size={12} /> : <Copy size={12} />}
                      {copiedApp ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Pioneer ID */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingBottom: 10, marginBottom: 10,
                    borderBottom: theme === 'light' ? '1px solid rgba(15, 46, 30, 0.1)' : '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div>
                      <span style={{ fontSize: 11, color: theme === 'light' ? '#B45309' : RF_GOLD_YELLOW, fontWeight: 700, display: 'block' }}>Official Pioneer ID</span>
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: result.pioneerId ? (theme === 'light' ? '#B45309' : RF_GOLD_YELLOW) : (theme === 'light' ? '#64748B' : 'rgba(255,255,255,0.6)'), fontFamily: 'monospace' }}>
                        {result.pioneerId || 'Minted upon completing profile after sign in'}
                      </span>
                    </div>
                    {result.pioneerId && (
                      <button
                        onClick={() => copyToClipboard(result.pioneerId!, 'pioneer')}
                        style={{
                          background: theme === 'light' ? 'rgba(246, 178, 26, 0.18)' : 'rgba(246, 178, 26, 0.12)',
                          border: theme === 'light' ? '1px solid rgba(217, 119, 6, 0.4)' : '1px solid rgba(246, 178, 26, 0.4)',
                          color: theme === 'light' ? '#92400E' : RF_GOLD_YELLOW,
                          padding: '5px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600
                        }}
                      >
                        {copiedPioneer ? <Check size={12} /> : <Copy size={12} />}
                        {copiedPioneer ? 'Copied' : 'Copy ID'}
                      </button>
                    )}
                  </div>

                  {/* Acceptance Code */}
                  {result.acceptanceCode ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingBottom: 10, marginBottom: 10,
                      borderBottom: theme === 'light' ? '1px solid rgba(15, 46, 30, 0.1)' : '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <div>
                        <span style={{ fontSize: 11, color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Key size={12} /> Official Acceptance Code
                        </span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT, fontFamily: 'monospace' }}>
                          {result.acceptanceCode}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.acceptanceCode!, 'code')}
                        style={{
                          background: theme === 'light' ? 'rgba(102, 187, 42, 0.18)' : 'rgba(24, 252, 92, 0.15)',
                          border: theme === 'light' ? `1px solid rgba(102, 187, 42, 0.5)` : `1px solid ${RF_LEAF_GREEN}66`,
                          color: theme === 'light' ? '#166534' : RF_MINT_ACCENT,
                          padding: '5px 12px', borderRadius: 8, fontSize: 11.5,
                          fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5
                        }}
                      >
                        {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                        {copiedCode ? 'Copied' : 'Copy Code'}
                      </button>
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12.5 }}>
                    <span style={{ color: theme === 'light' ? '#526E5E' : 'rgba(255,255,255,0.6)' }}>Assigned Squad</span>
                    <span style={{ fontWeight: 700, color: theme === 'light' ? '#15803d' : RF_MINT_ACCENT }}>{result.division || 'Founding Pioneer'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                    <span style={{ color: theme === 'light' ? '#526E5E' : 'rgba(255,255,255,0.6)' }}>Contributor Tier</span>
                    <span style={{ fontWeight: 700, color: theme === 'light' ? '#0284C7' : '#38BDF8' }}>Level 1: Refeir Member</span>
                  </div>
                </div>

                {/* Direct Activate Button */}
                {result.acceptanceCode && onActivateAccount && (
                  <button
                    onClick={() => {
                      onClose();
                      onActivateAccount(result.applicationNumber, result.acceptanceCode!, result.pioneerId);
                    }}
                    style={{
                      width: '100%', background: RF_LEAF_GREEN, color: '#061A0F',
                      border: 'none', padding: '13px 20px', borderRadius: 100,
                      fontWeight: 800, fontSize: 14, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      marginBottom: 12, boxShadow: `0 4px 16px ${RF_LEAF_GREEN}44`,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Key size={15} /> Activate Account & Sign Up Now <ArrowRight size={15} />
                  </button>
                )}

                <a
                  href="https://chat.whatsapp.com/sample-refeir-pioneers"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#25D366', color: '#FFFFFF', padding: '11px 20px',
                    borderRadius: 100, textDecoration: 'none', fontWeight: 600, fontSize: 13,
                    transition: 'opacity 0.2s'
                  }}
                >
                  Join Pioneer WhatsApp Group <ExternalLink size={14} />
                </a>
              </div>
            ) : result?.status === 'REVIEWING' ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <Clock size={44} color={theme === 'light' ? '#D97706' : RF_GOLD_YELLOW} style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: 20, fontWeight: 700, color: theme === 'light' ? '#0A1C12' : '#FFFFFF', marginBottom: 6 }}>
                  Application Under Active Review
                </h4>
                <p style={{ fontSize: 14, color: theme === 'light' ? '#334D3F' : 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                  Hi {result.fullName}, our admissions team is currently evaluating your application for the <strong>{result.division || 'Pioneer'}</strong> cohort. You will receive an update and your Acceptance Code once approved.
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <CheckCircle2 size={44} color={RF_LEAF_GREEN} style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: 20, fontWeight: 700, color: theme === 'light' ? '#0A1C12' : '#FFFFFF', marginBottom: 6 }}>
                  Application Received
                </h4>
                <p style={{ fontSize: 14, color: theme === 'light' ? '#334D3F' : 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                  Thank you, {result?.fullName}! Your application is queued in our review backlog. Once accepted, an Acceptance Code will be issued here to allow you to activate your account.
                </p>
              </div>
            )}

            <button
              onClick={() => { setLookupState('idle'); setAppNumber(''); setEmail(''); }}
              style={{
                background: theme === 'light' ? '#F1F5F9' : 'rgba(255,255,255,0.06)',
                color: theme === 'light' ? '#0A1C12' : 'rgba(255,255,255,0.85)',
                border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.18)',
                padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s', marginTop: 18, width: '100%'
              }}
            >
              Check another application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
