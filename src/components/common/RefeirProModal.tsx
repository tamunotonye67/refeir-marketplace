import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  ShieldCheck,
  Award,
  Briefcase,
  Ticket,
  ArrowRight,
  Headphones,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RefeirProModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'SCOUT' | 'TALENT' | 'CLIENT';
}

export const RefeirProModal: React.FC<RefeirProModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'SCOUT'
}) => {
  const { currentUser, upgradeToPro } = useAuth();
  const { showToast } = useNotification();
  let activeTheme: 'dark' | 'light' = 'dark';
  try {
    const { theme } = useTheme();
    activeTheme = theme;
  } catch {}

  const [activeTab, setActiveTab] = useState<'SCOUT' | 'TALENT' | 'CLIENT'>(() => {
    if (defaultRole === 'TALENT') return 'TALENT';
    if (defaultRole === 'CLIENT') return 'CLIENT';
    if (currentUser?.active_role === 'TALENT') return 'TALENT';
    if (currentUser?.active_role === 'CLIENT') return 'CLIENT';
    return 'SCOUT';
  });

  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isDark = activeTheme === 'dark';

  const handleUpgrade = (roleTier: 'SCOUT' | 'TALENT' | 'CLIENT') => {
    setIsProcessing(true);
    const tierName = roleTier === 'SCOUT' ? 'SCOUT_PRO' : roleTier === 'TALENT' ? 'TALENT_PRO' : 'CLIENT_PRO';

    setTimeout(() => {
      upgradeToPro(tierName);
      setIsProcessing(false);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.55 } });
      } catch (err) {}

      if (roleTier === 'SCOUT') {
        showToast(
          'Scout Pro Activated!',
          'You are now a Refeir Pro Scout. 5 Airfee tokens have been deposited to your wallet for 0% fee rate benefits.'
        );
      } else if (roleTier === 'TALENT') {
        showToast(
          'Talent Pro Activated!',
          'Your profile is now Featured on the homepage and marketplace with the Refeir Pro Golden Badge.'
        );
      } else {
        showToast(
          'Refeir Desk Concierge Unlocked!',
          'Direct curated talent recommendations are now enabled for your client account.'
        );
      }
      onClose();
    }, 600);
  };

  const isAlreadyPro = (tier: 'SCOUT' | 'TALENT' | 'CLIENT') => {
    if (!currentUser?.is_pro) return false;
    if (tier === 'SCOUT' && currentUser.pro_tier === 'SCOUT_PRO') return true;
    if (tier === 'TALENT' && currentUser.pro_tier === 'TALENT_PRO') return true;
    if (tier === 'CLIENT' && currentUser.pro_tier === 'CLIENT_PRO') return true;
    return false;
  };

  return (
    <div
      className="rf-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 10, 6, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="rf-modal-content"
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: isDark ? '#07160D' : '#FFFFFF',
          border: '1.5px solid rgba(244, 185, 66, 0.5)',
          borderRadius: 'var(--rf-radius-2xl)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(244, 185, 66, 0.15)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '380px',
            height: '120px',
            background: 'radial-gradient(ellipse, rgba(244, 185, 66, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            position: 'relative',
            zIndex: 2
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--rf-radius-md)',
                background: 'linear-gradient(135deg, rgba(244, 185, 66, 0.25), rgba(102, 187, 42, 0.25))',
                border: '1.5px solid #F4B942',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F4B942'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', margin: 0 }}>
                  Refeir Pro Membership
                </h3>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #F4B942, #E5A024)',
                    color: '#07160D',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '100px',
                    textTransform: 'uppercase'
                  }}
                >
                  Pro Tier
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-slate-400)' : '#527560', margin: '2px 0 0 0' }}>
                Airfee Token Grants • Featured Talent Exposure • Refeir Desk Recommendations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDark ? 'var(--rf-slate-300)' : '#2D4A38',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Role Tab Switcher */}
        <div style={{ padding: '1rem 1.75rem 0.5rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('SCOUT')}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--rf-radius-lg)',
              border: activeTab === 'SCOUT' ? '1.5px solid #F4B942' : isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              background: activeTab === 'SCOUT' ? (isDark ? 'rgba(244, 185, 66, 0.12)' : 'rgba(244, 185, 66, 0.15)') : 'transparent',
              color: activeTab === 'SCOUT' ? '#F4B942' : isDark ? 'var(--rf-slate-400)' : '#527560',
              fontWeight: 800,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Ticket size={15} />
            <span>Scout Pro (Airfee)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TALENT')}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--rf-radius-lg)',
              border: activeTab === 'TALENT' ? '1.5px solid #F4B942' : isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              background: activeTab === 'TALENT' ? (isDark ? 'rgba(244, 185, 66, 0.12)' : 'rgba(244, 185, 66, 0.15)') : 'transparent',
              color: activeTab === 'TALENT' ? '#F4B942' : isDark ? 'var(--rf-slate-400)' : '#527560',
              fontWeight: 800,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Award size={15} />
            <span>Talent Pro (Featured)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CLIENT')}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--rf-radius-lg)',
              border: activeTab === 'CLIENT' ? '1.5px solid #F4B942' : isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              background: activeTab === 'CLIENT' ? (isDark ? 'rgba(244, 185, 66, 0.12)' : 'rgba(244, 185, 66, 0.15)') : 'transparent',
              color: activeTab === 'CLIENT' ? '#F4B942' : isDark ? 'var(--rf-slate-400)' : '#527560',
              fontWeight: 800,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Headphones size={15} />
            <span>Client Desk (Concierge)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.75rem 1.75rem' }}>
          {/* TAB 1: SCOUT PRO */}
          {activeTab === 'SCOUT' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F0F7F2',
                  borderRadius: 'var(--rf-radius-lg)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-leaf-green)', textTransform: 'uppercase' }}>
                    SCOUT PRO MEMBERSHIP
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B' }}>
                    $19 <span style={{ fontSize: '0.875rem', color: isDark ? 'var(--rf-slate-400)' : '#527560', fontWeight: 500 }}>/ month (₦25,000)</span>
                  </div>
                </div>
                <div className="rf-badge rf-badge-mint rf-text-xs">
                  Auto 5 Airfee Tokens/mo
                </div>
              </div>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { title: '5 Monthly Airfee Tokens Auto-Granted', desc: 'Eliminates the 2% fee deduction on referrals with rates above 10%.' },
                  { title: 'Zero Rate Cap on Referral Splits', desc: 'Refer high-ticket contracts above 10% and keep 100% of your earnings using Airfee passes.' },
                  { title: 'Priority Link Placement', desc: 'Your scout links appear highlighted on local client search queries.' },
                  { title: 'Real-Time Click Telemetry & Analytics', desc: 'Track exactly when prospective clients view your referred talent.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rf-leaf-green)', flexShrink: 0, marginTop: '2px' }}>
                      <Check size={13} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isDark ? 'var(--rf-cream)' : '#0F2E1B' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-slate-400)' : '#527560' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled={isProcessing || isAlreadyPro('SCOUT')}
                onClick={() => handleUpgrade('SCOUT')}
                className="rf-btn rf-btn-primary"
                style={{
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '0.9375rem',
                  padding: '0.85rem',
                  justifyContent: 'center',
                  background: isAlreadyPro('SCOUT') ? 'var(--rf-mint)' : 'linear-gradient(135deg, #F4B942, #E5A024)',
                  color: '#07160D',
                  border: 'none'
                }}
              >
                {isAlreadyPro('SCOUT') ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Scout Pro is Active on Your Account</span>
                  </>
                ) : isProcessing ? (
                  <span>Activating Scout Pro...</span>
                ) : (
                  <>
                    <span>Upgrade to Scout Pro (Claim 5 Airfee Tokens)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: TALENT PRO */}
          {activeTab === 'TALENT' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F0F7F2',
                  borderRadius: 'var(--rf-radius-lg)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F4B942', textTransform: 'uppercase' }}>
                    TALENT PRO FEATURED
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B' }}>
                    $29 <span style={{ fontSize: '0.875rem', color: isDark ? 'var(--rf-slate-400)' : '#527560', fontWeight: 500 }}>/ month (₦38,000)</span>
                  </div>
                </div>
                <div className="rf-badge rf-badge-orange rf-text-xs">
                  4.8x Profile Views
                </div>
              </div>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { title: 'Featured on Homepage & Marketplace Header', desc: 'Prominent carousel banner showcasing your profile to top African & global hiring clients.' },
                  { title: 'Golden "Refeir Pro" Verified Badge', desc: 'Distinguished verification ribbon indicating elite status and proven track record.' },
                  { title: 'Top Search Ranking Placement', desc: 'Rank #1 in search results for your primary categories and skill stacks.' },
                  { title: 'Priority Dispatch to Refeir Desk Clients', desc: 'Recommended first whenever clients request custom concierge hiring shortlists.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(244, 185, 66, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F4B942', flexShrink: 0, marginTop: '2px' }}>
                      <Check size={13} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isDark ? 'var(--rf-cream)' : '#0F2E1B' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-slate-400)' : '#527560' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled={isProcessing || isAlreadyPro('TALENT')}
                onClick={() => handleUpgrade('TALENT')}
                className="rf-btn rf-btn-primary"
                style={{
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '0.9375rem',
                  padding: '0.85rem',
                  justifyContent: 'center',
                  background: isAlreadyPro('TALENT') ? 'var(--rf-mint)' : 'linear-gradient(135deg, #F4B942, #E5A024)',
                  color: '#07160D',
                  border: 'none'
                }}
              >
                {isAlreadyPro('TALENT') ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Talent Pro is Active (Featured in Marketplace)</span>
                  </>
                ) : isProcessing ? (
                  <span>Activating Talent Pro...</span>
                ) : (
                  <>
                    <span>Upgrade to Talent Pro (Get Featured Now)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: CLIENT PRO (REFEIR DESK) */}
          {activeTab === 'CLIENT' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F0F7F2',
                  borderRadius: 'var(--rf-radius-lg)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-blue)', textTransform: 'uppercase' }}>
                    CLIENT DESK CONCIERGE
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B' }}>
                    $49 <span style={{ fontSize: '0.875rem', color: isDark ? 'var(--rf-slate-400)' : '#527560', fontWeight: 500 }}>/ month (₦65,000)</span>
                  </div>
                </div>
                <div className="rf-badge rf-badge-blue rf-text-xs">
                  &lt; 24h Curated Shortlist
                </div>
              </div>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { title: 'Direct Recommendations from Refeir Desk', desc: 'Submit any project scope and receive pre-screened talent recommendations tailored to your exact budget.' },
                  { title: 'Dedicated Talent Agent & Sourcing Lead', desc: 'White-glove matching assistance to negotiate milestone contracts and fast-track delivery.' },
                  { title: 'Zero Escrow Mediation Fees', desc: 'Priority arbitrations and dedicated account support for high-value enterprise milestones.' },
                  { title: 'Custom NDA & Confidential Briefings', desc: 'Source sensitive talent without publishing public job requirements.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(125, 162, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7DA2FF', flexShrink: 0, marginTop: '2px' }}>
                      <Check size={13} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isDark ? 'var(--rf-cream)' : '#0F2E1B' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-slate-400)' : '#527560' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled={isProcessing || isAlreadyPro('CLIENT')}
                onClick={() => handleUpgrade('CLIENT')}
                className="rf-btn rf-btn-primary"
                style={{
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '0.9375rem',
                  padding: '0.85rem',
                  justifyContent: 'center',
                  background: isAlreadyPro('CLIENT') ? 'var(--rf-mint)' : 'linear-gradient(135deg, #7DA2FF, #4F7BF0)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                {isAlreadyPro('CLIENT') ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Refeir Desk Concierge is Active on Your Account</span>
                  </>
                ) : isProcessing ? (
                  <span>Unlocking Refeir Desk...</span>
                ) : (
                  <>
                    <span>Unlock Refeir Desk (Get Direct Recommendations)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
