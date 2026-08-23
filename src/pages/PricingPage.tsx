import React, { useState } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Lock, ArrowRight, DollarSign, HelpCircle, Users, Briefcase, Zap, Ticket, Award, Headphones, Star, Check } from 'lucide-react';
import { RefeirProModal } from '../components/common/RefeirProModal';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [showProModal, setShowProModal] = useState(false);
  const [proRole, setProRole] = useState<'SCOUT' | 'TALENT' | 'CLIENT'>('SCOUT');

  const openProModalForRole = (role: 'SCOUT' | 'TALENT' | 'CLIENT') => {
    setProRole(role);
    setShowProModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '80vh' }}>
      {/* Header */}
      <section
        style={{
          padding: '4.5rem 1.5rem 3.5rem',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(102, 187, 42, 0.2), transparent 70%), var(--rf-bg-base)',
          borderBottom: '1px solid var(--rf-bg-card-border)'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '840px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(102, 187, 42, 0.12)',
              border: '1px solid rgba(102, 187, 42, 0.3)',
              borderRadius: 'var(--rf-radius-full)',
              padding: '0.375rem 1rem',
              marginBottom: '1.25rem'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--rf-leaf-green)' }} className="rf-pulse" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>
              TRANSPARENT PAN-AFRICAN ECONOMICS
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1.15, marginBottom: '1rem' }}>
            Fair Pricing. Zero Surprises. Guaranteed Payouts.
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            No transaction traps. No hidden markups. Transparent platform fees charged only when real milestone work is approved.
          </p>
        </div>
      </section>

      {/* 3-Sided Base Fee Architecture Cards */}
      <section className="rf-section">
        <div className="rf-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="rf-badge rf-badge-mint" style={{ marginBottom: '0.5rem' }}>
              TRANSACTIONAL ARCHITECTURE
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              Standard Platform Economics
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Our baseline 0%–5% transaction framework accessible to every registered member.
            </p>
          </div>

          <div className="rf-grid-3" style={{ alignItems: 'stretch' }}>
            {/* 1. Recruiter / Client */}
            <div className="rf-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', letterSpacing: '0.05em' }}>
                    FOR RECRUITERS & CLIENTS
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                    Hire & Protect
                  </h3>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--rf-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={20} color="var(--rf-leaf-green)" />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1 }}>5%</span>
                  <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.9375rem' }}>per funded milestone</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', marginTop: '0.75rem' }}>
                  Covers 100% Trust Vault custody, dispute mediation, and multi-currency cross-border settlement.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Free</strong> job posting & talent search</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>100% money-back Trust Vault protection</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Cross-border VAT & compliance receipts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Encrypted in-app messaging & workspace collaboration</span>
                </div>
              </div>

              <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-primary" style={{ width: '100%' }}>
                Browse African Talent →
              </button>
            </div>

            {/* 2. Scouter / Referrer (Highlighted) */}
            <div className="rf-card rf-card-mint-border" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'linear-gradient(135deg, var(--rf-vibrant-orange), var(--rf-golden-yellow))', color: '#FFFFFF', padding: '0.25rem 0.875rem', borderRadius: 'var(--rf-radius-full)', fontSize: '0.75rem', fontWeight: 800 }}>
                POPULAR
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', letterSpacing: '0.05em' }}>
                    FOR SCOUTERS & REFERRERS
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                    Refer & Earn
                  </h3>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(102, 187, 42, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} color="var(--rf-leaf-green)" />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1 }}>0%</span>
                  <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.9375rem' }}>Fee forever (on &le;10% talent rates)</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', marginTop: '0.75rem' }}>
                  Keep <strong>100% of your proceeds forever</strong> on talent offer rates of 10% and below.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>0% platform fee forever</strong> on &le;10% referral rates</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>2% Airfee only on &gt;10% rates</strong> (waived with Airfee Token)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Exclusive Client Onboarding Links:</strong> Earn free monthly Airfee Tokens</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Automatic instant wallet split on milestone approval</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>M-Pesa, MoMo, Bank & Stablecoin withdrawal</span>
                </div>
              </div>

              <button onClick={() => onNavigate('/dashboard/scout')} className="rf-btn rf-btn-mint" style={{ width: '100%' }}>
                Start Earning as Scout →
              </button>
            </div>

            {/* 3. Talent */}
            <div className="rf-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', letterSpacing: '0.05em' }}>
                    FOR FREELANCERS & TALENT
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                    Deliver & Grow
                  </h3>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--rf-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} color="var(--rf-leaf-green)" />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1 }}>10%</span>
                  <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.9375rem' }}>Scout referral commission</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', marginTop: '0.75rem' }}>
                  Paid to the scout who brought you the client. Deducted only upon successful project payout.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Zero subscription</strong> or bidding tokens</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Guaranteed payment once deliverables approved</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Multi-currency payout directly to local bank / MoMo</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Verified pan-African reputation badge</span>
                </div>
              </div>

              <button onClick={() => onNavigate('/dashboard/talent')} className="rf-btn rf-btn-secondary" style={{ width: '100%' }}>
                Create Service Package →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          REFEIR PRO SUPERPOWERS SUBSCRIPTION TIERS
          ========================================================================= */}
      <section className="rf-section" style={{ backgroundColor: 'rgba(5, 20, 12, 0.6)', borderTop: '1px solid rgba(244, 185, 66, 0.25)', borderBottom: '1px solid rgba(244, 185, 66, 0.25)' }}>
        <div className="rf-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 185, 66, 0.15)', border: '1px solid rgba(244, 185, 66, 0.4)', borderRadius: '100px', padding: '0.35rem 1rem', marginBottom: '0.75rem' }}>
              <Sparkles size={16} color="#F4B942" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#F4B942', textTransform: 'uppercase' }}>
                REFEIR PRO SUPERPOWERS
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
              Accelerate Your Pipeline with Refeir Pro
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '1.0625rem', maxWidth: '680px', margin: '0.5rem auto 0', lineHeight: 1.6 }}>
              Unlock monthly Airfee tokens for Scouts, Featured placement for Talents, and Direct Concierge Recommendations from Refeir Desk for Clients.
            </p>
          </div>

          <div className="rf-grid-3" style={{ alignItems: 'stretch' }}>
            {/* 1. Scout Pro */}
            <div
              className="rf-card"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                border: '1.5px solid rgba(244, 185, 66, 0.4)',
                background: 'linear-gradient(180deg, rgba(244, 185, 66, 0.06) 0%, var(--rf-bg-surface) 100%)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#F4B942', letterSpacing: '0.05em' }}>
                    FOR SCOUTERS
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                    Scout Pro
                  </h3>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244, 185, 66, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F4B942' }}>
                  <Ticket size={22} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1 }}>$19</span>
                  <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.875rem' }}>/ month (₦25,000)</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#F4B942', fontWeight: 700, marginTop: '0.5rem' }}>
                  ⚡ Auto +5 Airfee Tokens granted every month
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="#F4B942" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>5 Monthly Airfee Tokens:</strong> Eliminate all 2% fee deductions on &gt;10% referrals</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="#F4B942" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Unlimited 0% Referral Fee Ceilings:</strong> Keep 100% of large ticket proceeds</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="#F4B942" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Priority Link Boost:</strong> Your links featured in client talent searches</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="#F4B942" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Real-Time Pipeline Telemetry:</strong> Track link clicks and deal conversions</span>
                </div>
              </div>

              <button
                onClick={() => openProModalForRole('SCOUT')}
                className="rf-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #F4B942, #E5A024)',
                  color: '#07160D',
                  fontWeight: 800,
                  border: 'none',
                  justifyContent: 'center'
                }}
              >
                <span>Upgrade to Scout Pro →</span>
              </button>
            </div>

            {/* 2. Talent Pro */}
            <div
              className="rf-card"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid #F4B942',
                background: 'linear-gradient(180deg, rgba(244, 185, 66, 0.12) 0%, var(--rf-bg-surface) 100%)',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'linear-gradient(135deg, #F4B942, #E5A024)', color: '#07160D', padding: '0.25rem 0.875rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>
                MOST POPULAR
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#F4B942', letterSpacing: '0.05em' }}>
                    FOR FREELANCERS & CREATORS
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                    Talent Pro
                  </h3>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244, 185, 66, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F4B942' }}>
                  <Award size={22} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1 }}>$29</span>
                  <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.875rem' }}>/ month (₦38,000)</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-mint)', fontWeight: 700, marginTop: '0.5rem' }}>
                  🌟 4.8x more direct client inquiries & hires
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-mint)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Featured Talent Carousel Placement:</strong> Top placement on Homepage & Marketplace</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-mint)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Golden "Refeir Pro" Badge:</strong> Verified ribbon building instant client trust</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-mint)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>#1 Search Ranking Placement:</strong> Rank above standard profiles in skill stacks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="var(--rf-mint)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Refeir Desk Priority Dispatch:</strong> Included first in client concierge shortlists</span>
                </div>
              </div>

              <button
                onClick={() => openProModalForRole('TALENT')}
                className="rf-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #F4B942, #E5A024)',
                  color: '#07160D',
                  fontWeight: 800,
                  border: 'none',
                  justifyContent: 'center'
                }}
              >
                <span>Upgrade to Talent Pro →</span>
              </button>
            </div>

            {/* 3. Client Desk Pro */}
            <div
              className="rf-card"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                border: '1.5px solid rgba(125, 162, 255, 0.4)',
                background: 'linear-gradient(180deg, rgba(125, 162, 255, 0.06) 0%, var(--rf-bg-surface) 100%)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#7DA2FF', letterSpacing: '0.05em' }}>
                    FOR CLIENTS & ENTERPRISES
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
                    Refeir Desk Pro
                  </h3>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(125, 162, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7DA2FF' }}>
                  <Headphones size={22} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1 }}>$49</span>
                  <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.875rem' }}>/ month (₦65,000)</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#7DA2FF', fontWeight: 700, marginTop: '0.5rem' }}>
                  🛎️ Pre-vetted talent shortlisted in &lt;24 hours
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="#7DA2FF" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Direct Concierge Recommendations:</strong> Refeir Desk sources verified talents</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="#7DA2FF" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Dedicated Talent Partner:</strong> Sourcing lead manages contract milestone setup</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="#F4B942" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Zero Dispute Mediation Fees:</strong> Dedicated legal & arbitration handling</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  <CheckCircle2 size={16} color="#7DA2FF" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Confidential Briefings:</strong> Custom NDA & private requirement sourcing</span>
                </div>
              </div>

              <button
                onClick={() => openProModalForRole('CLIENT')}
                className="rf-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #7DA2FF, #4F7BF0)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  border: 'none',
                  justifyContent: 'center'
                }}
              >
                <span>Unlock Refeir Desk Concierge →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Example Calculation Table with 3 Scenarios */}
      <section className="rf-section" style={{ backgroundColor: 'var(--rf-bg-surface)' }}>
        <div className="rf-container" style={{ maxWidth: '980px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="rf-badge rf-badge-mint" style={{ marginBottom: '0.5rem' }}>
              TRANSPARENCY IN ACTION
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              How a $1,000 Milestone is Settled Across 3 Job Channels
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
              Clear breakdown for Scout Referrals, Direct Talent Reachout, and Open Job Board Proposals.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Scenario 1: Scout Referral */}
            <div style={{ background: 'var(--rf-bg-card)', border: '1px solid rgba(102, 187, 42, 0.35)', borderRadius: 'var(--rf-radius-xl)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  1. Scout-Referred Engagement (e.g. 10% Scout Referral Rate)
                </span>
                <span className="rf-badge rf-badge-mint rf-text-xs">Standard Scout Model</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Client Funds Escrow</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)' }}>$1,050</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>$1,000 + $50 (5% Client Fee)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(102, 187, 42, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', textTransform: 'uppercase', fontWeight: 800 }}>Talent Payout</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>$900</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>$1,000 - $100 (10% to Scout)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(246, 178, 26, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-golden-yellow)', textTransform: 'uppercase', fontWeight: 800 }}>Scout Reward</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-golden-yellow)' }}>$100</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>100% of locked 10% rate</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Refeir Platform</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)' }}>$50</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>5% Escrow Custody Fee</div>
                </div>
              </div>
            </div>

            {/* Scenario 2: Direct Hire without Scout */}
            <div style={{ background: 'var(--rf-bg-card)', border: '1px solid rgba(125, 162, 255, 0.35)', borderRadius: 'var(--rf-radius-xl)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  2. Direct Client Reachout to Talent (Without a Scout)
                </span>
                <span className="rf-badge rf-badge-blue rf-text-xs">Direct Platform Hire</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '1rem' }}>
                Rule: If a client reaches out to a talent directly without going through a scout referral, Refeir takes the initial referral rate that the talent had set on their profile (e.g. 10%).
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Client Funds Escrow</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)' }}>$1,050</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>$1,000 + $50 (5% Client Fee)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(102, 187, 42, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', textTransform: 'uppercase', fontWeight: 800 }}>Talent Payout</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>$900</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>$1,000 - $100 (10% Talent set rate)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(125, 162, 255, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#93C5FD', textTransform: 'uppercase', fontWeight: 800 }}>Refeir Retained</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#93C5FD' }}>$150</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>5% Client Fee + 10% Direct Fee</div>
                </div>
              </div>
            </div>

            {/* Scenario 3: Proposal Job from Job Board */}
            <div style={{ background: 'var(--rf-bg-card)', border: '1px solid rgba(244, 185, 66, 0.35)', borderRadius: 'var(--rf-radius-xl)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  3. Job Board Proposal Hire (5% Client + 5% Talent Split)
                </span>
                <span className="rf-badge rf-badge-warning rf-text-xs">Proposal Split Model</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '1rem' }}>
                Rule: For open client jobs initiated by talent submitting proposals, Refeir takes 5% from the client and 5% from the talent at the final milestone release (10% total Refeir revenue).
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>Client Total Escrow</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)' }}>$1,050</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>$1,000 + $50 (5% Client Fee)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(102, 187, 42, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', textTransform: 'uppercase', fontWeight: 800 }}>Talent Net Payout</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>$950</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>$1,000 - $50 (5% Talent Success Fee)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(244, 185, 66, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#F4B942', textTransform: 'uppercase', fontWeight: 800 }}>Refeir Total Revenue</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F4B942' }}>$100</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>5% Client ($50) + 5% Talent ($50)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REFEIR PRO MODAL */}
      <RefeirProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        defaultRole={proRole}
      />
    </div>
  );
};
