import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  DollarSign,
  Users,
  Briefcase,
  Zap,
  Ticket,
  Award,
  Headphones,
  Layers,
  Sliders,
  Globe
} from 'lucide-react';
import { RefeirProModal } from '../components/common/RefeirProModal';
import { useTheme } from '../context/ThemeContext';
import '../styles/pricing-architecture.css';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [showProModal, setShowProModal] = useState(false);
  const [proRole, setProRole] = useState<'SCOUT' | 'TALENT' | 'CLIENT'>('SCOUT');
  
  // Interactive Escrow Simulator State
  const [milestoneAmount, setMilestoneAmount] = useState<number>(1000);
  const [channel, setChannel] = useState<'SCOUT' | 'DIRECT' | 'PROPOSAL'>('SCOUT');
  const [currency, setCurrency] = useState<'USD' | 'NGN' | 'KES' | 'GHS'>('USD');

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const openProModalForRole = (role: 'SCOUT' | 'TALENT' | 'CLIENT') => {
    setProRole(role);
    setShowProModal(true);
  };

  // Currency Converter
  const currencyConfig: Record<string, { symbol: string; rate: number; label: string }> = {
    USD: { symbol: '$', rate: 1, label: 'USD ($)' },
    NGN: { symbol: '₦', rate: 1550, label: 'NGN (₦)' },
    KES: { symbol: 'KSh ', rate: 130, label: 'KES (KSh)' },
    GHS: { symbol: 'GH₵ ', rate: 15, label: 'GHS (GH₵)' }
  };

  const formatCur = (valUsd: number) => {
    const cfg = currencyConfig[currency];
    const conv = Math.round(valUsd * cfg.rate);
    return `${cfg.symbol}${conv.toLocaleString()}`;
  };

  // Dynamic calculations based on Refeir transactional architecture
  const clientTotal = Math.round(milestoneAmount * 1.05);
  const vaultAmount = milestoneAmount;
  
  let scoutPercent = 10;
  let scoutAmount = Math.round(milestoneAmount * 0.10);
  let talentPercent = 90;
  let talentAmount = Math.round(milestoneAmount * 0.90);
  let platformTotal = Math.round(milestoneAmount * 0.05);

  if (channel === 'SCOUT') {
    scoutPercent = 10;
    scoutAmount = Math.round(milestoneAmount * 0.10);
    talentPercent = 90;
    talentAmount = Math.round(milestoneAmount * 0.90);
    platformTotal = Math.round(milestoneAmount * 0.05);
  } else if (channel === 'DIRECT') {
    scoutPercent = 0;
    scoutAmount = 0;
    talentPercent = 90;
    talentAmount = Math.round(milestoneAmount * 0.90);
    platformTotal = Math.round(milestoneAmount * 0.15); // 5% client + 10% direct reachout fee
  } else if (channel === 'PROPOSAL') {
    scoutPercent = 0;
    scoutAmount = 0;
    talentPercent = 95;
    talentAmount = Math.round(milestoneAmount * 0.95);
    platformTotal = Math.round(milestoneAmount * 0.10); // 5% client + 5% talent split
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '80vh',
        backgroundColor: isDark ? 'var(--rf-bg-base)' : '#F8FAF8',
        color: isDark ? '#FFFFFF' : '#122B1A'
      }}
    >
      {/* =========================================================================
          ATMOSPHERIC ORGANIC HERO SECTION
          ========================================================================= */}
      <section
        className="rf-pricing-hero-wrap"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(102, 187, 42, 0.18), transparent 75%), linear-gradient(180deg, #06150D 0%, #0A1F13 100%)'
            : 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34, 197, 94, 0.14), transparent 75%), linear-gradient(180deg, #F0FDF4 0%, #FAFCFA 100%)',
          borderBottom: isDark ? '1px solid rgba(102, 187, 42, 0.18)' : '1px solid rgba(18, 43, 26, 0.08)'
        }}
      >
        <div
          className="rf-pricing-ambient-glow"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(102, 187, 42, 0.2) 0%, rgba(16, 185, 129, 0.06) 45%, transparent 70%)'
              : 'radial-gradient(circle, rgba(34, 197, 94, 0.16) 0%, rgba(46, 125, 50, 0.04) 45%, transparent 70%)'
          }}
        />

        <div className="rf-container" style={{ maxWidth: '920px', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <div
            className="rf-pricing-eyebrow"
            style={{
              background: isDark ? 'rgba(102, 187, 42, 0.12)' : 'rgba(22, 163, 74, 0.1)',
              border: isDark ? '1px solid rgba(102, 187, 42, 0.3)' : '1px solid rgba(22, 163, 74, 0.25)',
              color: isDark ? 'var(--rf-leaf-green)' : '#15803D'
            }}
          >
            <span
              className="rf-pricing-pulse-dot"
              style={{ backgroundColor: isDark ? 'var(--rf-leaf-green)' : '#16A34A' }}
            />
            <span>TRANSPARENT PAN-AFRICAN ECONOMICS</span>
          </div>

          <h1 className="rf-pricing-title" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
            Fair Pricing. Zero Surprises.{' '}
            <span className="rf-pricing-title-accent">Guaranteed Payouts.</span>
          </h1>

          <p className="rf-pricing-sub" style={{ color: isDark ? '#CBD5E1' : '#475569' }}>
            No transaction traps. No hidden markups. Transparent platform fees charged only when real milestone work is approved.
          </p>

          {/* Telemetry Pills Bar */}
          <div className="rf-pricing-telemetry-bar">
            <div
              className="rf-pricing-telemetry-pill"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(18, 43, 26, 0.1)',
                boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.03)',
                color: isDark ? '#F1F5F9' : '#1E293B'
              }}
            >
              <ShieldCheck size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} />
              <span>100% Escrow Vault Custody</span>
            </div>
            <div
              className="rf-pricing-telemetry-pill"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(18, 43, 26, 0.1)',
                boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.03)',
                color: isDark ? '#F1F5F9' : '#1E293B'
              }}
            >
              <Zap size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} />
              <span>0% Scout Fee Baseline (≤10% Rates)</span>
            </div>
            <div
              className="rf-pricing-telemetry-pill"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(18, 43, 26, 0.1)',
                boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.03)',
                color: isDark ? '#F1F5F9' : '#1E293B'
              }}
            >
              <Users size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} />
              <span>0% Talent Subscription or Bids</span>
            </div>
            <div
              className="rf-pricing-telemetry-pill"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(18, 43, 26, 0.1)',
                boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.03)',
                color: isDark ? '#F1F5F9' : '#1E293B'
              }}
            >
              <Lock size={15} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} />
              <span>Multi-Currency Local Settlement (MoMo/Bank/USDC)</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TRANSACTIONAL ARCHITECTURE & LIVE ESCROW SIMULATOR
          ========================================================================= */}
      <section className="rf-section" style={{ backgroundColor: isDark ? 'var(--rf-bg-base)' : '#F8FAF8', padding: 'clamp(3rem, 5vw, 5rem) 1.5rem' }}>
        <div className="rf-container" style={{ maxWidth: '1220px' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: isDark ? 'rgba(102, 187, 42, 0.12)' : 'rgba(22, 163, 74, 0.1)',
                border: isDark ? '1px solid rgba(102, 187, 42, 0.28)' : '1px solid rgba(22, 163, 74, 0.2)',
                color: isDark ? 'var(--rf-leaf-green)' : '#15803D',
                padding: '0.3rem 0.85rem',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}
            >
              <Layers size={14} />
              <span>TRANSACTIONAL ARCHITECTURE</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>
              Standard Platform Economics
            </h2>
            <p style={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Our baseline 0%–5% transaction framework accessible to every registered member.
            </p>
          </div>

          {/* ================= LIVE ESCROW ARCHITECTURE SIMULATOR ================= */}
          <div
            className="rf-simulator-wrap"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(13, 35, 22, 0.95) 0%, rgba(6, 21, 13, 0.98) 100%)'
                : '#FFFFFF',
              border: isDark
                ? '1.5px solid rgba(102, 187, 42, 0.35)'
                : '1.5px solid rgba(22, 163, 74, 0.25)',
              boxShadow: isDark
                ? '0 12px 40px rgba(0, 0, 0, 0.45), 0 0 24px rgba(102, 187, 42, 0.12)'
                : '0 10px 35px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            {/* Simulator Header & Controls */}
            <div className="rf-simulator-head" style={{ borderBottomColor: isDark ? 'rgba(102, 187, 42, 0.2)' : 'rgba(18, 43, 26, 0.1)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Sliders size={18} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} />
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                    Interactive Milestone Simulator
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Simulate a funded milestone to see how Refeir's multi-party smart custody engine distributes value in real time.
                </p>
              </div>

              {/* Currency Selector Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={15} color={isDark ? "#94A3B8" : "#64748B"} />
                {Object.keys(currencyConfig).map(cur => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur as any)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: currency === cur ? 'none' : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(18,43,26,0.15)',
                      background: currency === cur ? 'var(--rf-leaf-green)' : isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                      color: currency === cur ? '#06150D' : isDark ? '#CBD5E1' : '#334155',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel Switcher */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: isDark ? '#94A3B8' : '#64748B', marginRight: '0.25rem' }}>
                Engagement Channel:
              </span>
              <button
                onClick={() => setChannel('SCOUT')}
                className={`rf-channel-pill ${channel === 'SCOUT' ? 'active' : ''}`}
                style={{
                  background: channel === 'SCOUT' ? 'var(--rf-leaf-green)' : isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                  color: channel === 'SCOUT' ? '#06150D' : isDark ? '#CBD5E1' : '#334155',
                  border: channel === 'SCOUT' ? '1px solid var(--rf-leaf-green)' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(18,43,26,0.1)'
                }}
              >
                ⚡ 1. Scout-Referred Hire (Standard 10% Attribution)
              </button>
              <button
                onClick={() => setChannel('DIRECT')}
                className={`rf-channel-pill ${channel === 'DIRECT' ? 'active' : ''}`}
                style={{
                  background: channel === 'DIRECT' ? 'var(--rf-leaf-green)' : isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                  color: channel === 'DIRECT' ? '#06150D' : isDark ? '#CBD5E1' : '#334155',
                  border: channel === 'DIRECT' ? '1px solid var(--rf-leaf-green)' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(18,43,26,0.1)'
                }}
              >
                2. Direct Client Hire (No Scout)
              </button>
              <button
                onClick={() => setChannel('PROPOSAL')}
                className={`rf-channel-pill ${channel === 'PROPOSAL' ? 'active' : ''}`}
                style={{
                  background: channel === 'PROPOSAL' ? 'var(--rf-leaf-green)' : isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                  color: channel === 'PROPOSAL' ? '#06150D' : isDark ? '#CBD5E1' : '#334155',
                  border: channel === 'PROPOSAL' ? '1px solid var(--rf-leaf-green)' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(18,43,26,0.1)'
                }}
              >
                3. Open Job Board Proposal Split (5% / 5%)
              </button>
            </div>

            {/* Slider & Presets Controls */}
            <div className="rf-pricing-slider-wrap">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  Base Contract Milestone: <span style={{ color: isDark ? 'var(--rf-leaf-green)' : '#16A34A', fontSize: '1.2rem', fontWeight: 900 }}>{formatCur(milestoneAmount)}</span>
                </span>
                
                <div className="rf-amount-chips">
                  {[500, 1000, 2500, 5000, 10000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setMilestoneAmount(amt)}
                      className="rf-amount-chip"
                      style={{
                        background: milestoneAmount === amt ? (isDark ? 'rgba(102,187,42,0.2)' : 'rgba(22,163,74,0.12)') : isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                        color: milestoneAmount === amt ? (isDark ? 'var(--rf-leaf-green)' : '#15803D') : isDark ? '#CBD5E1' : '#475569',
                        border: milestoneAmount === amt ? '1px solid var(--rf-leaf-green)' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(18,43,26,0.1)'
                      }}
                    >
                      {formatCur(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="range"
                min="200"
                max="10000"
                step="50"
                value={milestoneAmount}
                onChange={e => setMilestoneAmount(Number(e.target.value))}
                className="rf-pricing-range-slider"
              />
            </div>

            {/* Flow Nodes 4-Column Grid */}
            <div className="rf-flow-nodes-grid">
              {/* Node 1: Client Escrow Inflow */}
              <div
                className="rf-flow-node-card"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAF9',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(18, 43, 26, 0.1)'
                }}
              >
                <div>
                  <div
                    className="rf-flow-node-badge"
                    style={{
                      background: isDark ? 'rgba(125, 162, 255, 0.15)' : '#EFF6FF',
                      color: isDark ? '#93C5FD' : '#1D4ED8'
                    }}
                  >
                    <Briefcase size={12} />
                    <span>Client Escrow Inflow</span>
                  </div>
                  <div className="rf-flow-node-val" style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>
                    {formatCur(clientTotal)}
                  </div>
                </div>
                <p className="rf-flow-node-sub" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                  {formatCur(milestoneAmount)} milestone + {formatCur(Math.round(milestoneAmount * 0.05))} (5% Client Custody & Protection Fee)
                </p>
              </div>

              {/* Node 2: Refeir Trust Vault */}
              <div
                className="rf-flow-node-card"
                style={{
                  background: isDark ? 'rgba(102, 187, 42, 0.08)' : '#F0FDF4',
                  border: isDark ? '1.5px solid rgba(102, 187, 42, 0.35)' : '1.5px solid rgba(22, 163, 74, 0.3)'
                }}
              >
                <div>
                  <div
                    className="rf-flow-node-badge"
                    style={{
                      background: isDark ? 'rgba(102, 187, 42, 0.2)' : '#DCFCE7',
                      color: isDark ? 'var(--rf-leaf-green)' : '#15803D'
                    }}
                  >
                    <ShieldCheck size={12} />
                    <span>Trust Vault Custody</span>
                  </div>
                  <div className="rf-flow-node-val" style={{ color: isDark ? 'var(--rf-leaf-green)' : '#15803D' }}>
                    {formatCur(vaultAmount)}
                  </div>
                </div>
                <p className="rf-flow-node-sub" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                  100% Locked in smart custody until deliverables are reviewed and verified
                </p>
              </div>

              {/* Node 3: Scout Referral Commission */}
              <div
                className="rf-flow-node-card"
                style={{
                  background: isDark ? 'rgba(244, 185, 66, 0.08)' : '#FFFBEB',
                  border: isDark ? '1px solid rgba(244, 185, 66, 0.3)' : '1px solid rgba(217, 119, 6, 0.25)'
                }}
              >
                <div>
                  <div
                    className="rf-flow-node-badge"
                    style={{
                      background: isDark ? 'rgba(244, 185, 66, 0.2)' : '#FEF3C7',
                      color: isDark ? '#F4B942' : '#B45309'
                    }}
                  >
                    <Zap size={12} />
                    <span>Scout Referral Reward</span>
                  </div>
                  <div className="rf-flow-node-val" style={{ color: isDark ? '#F4B942' : '#B45309' }}>
                    {formatCur(scoutAmount)}
                  </div>
                </div>
                <p className="rf-flow-node-sub" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                  {channel === 'SCOUT'
                    ? `100% of ${scoutPercent}% attribution ($0 Refeir fee deducted)`
                    : 'N/A (Direct channel without referral scout)'}
                </p>
              </div>

              {/* Node 4: Talent Net Payout */}
              <div
                className="rf-flow-node-card"
                style={{
                  background: isDark ? 'rgba(102, 187, 42, 0.12)' : '#F0FDF4',
                  border: isDark ? '1.5px solid var(--rf-leaf-green)' : '1.5px solid #16A34A'
                }}
              >
                <div>
                  <div
                    className="rf-flow-node-badge"
                    style={{
                      background: isDark ? 'var(--rf-leaf-green)' : '#16A34A',
                      color: '#06150D'
                    }}
                  >
                    <Users size={12} />
                    <span>Talent Net Payout</span>
                  </div>
                  <div className="rf-flow-node-val" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                    {formatCur(talentAmount)}
                  </div>
                </div>
                <p className="rf-flow-node-sub" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                  {talentPercent}% milestone released instantly to local bank, MoMo, or crypto wallet
                </p>
              </div>
            </div>

            {/* Bottom Platform Architecture Audit Row */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(18, 43, 26, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                fontSize: '0.8125rem'
              }}
            >
              <div style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                <strong style={{ color: isDark ? '#F1F5F9' : '#1E293B' }}>Refeir Architecture Retention:</strong>{' '}
                {formatCur(platformTotal)}{' '}
                ({channel === 'SCOUT' ? '5% Client Custody Fee' : channel === 'DIRECT' ? '5% Client + 10% Direct Reachout Fee' : '5% Client + 5% Talent Success Fee'})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isDark ? 'var(--rf-leaf-green)' : '#16A34A', fontWeight: 700 }}>
                <CheckCircle2 size={15} />
                <span>Zero Hidden Conversion Spreads • 100% Verifiable Escrow</span>
              </div>
            </div>
          </div>

          {/* ================= 3-SIDED ARCHITECTURE CARDS ================= */}
          <div className="rf-arch-cards-grid">
            {/* 1. Recruiter / Client Card */}
            <div
              className="rf-arch-card"
              style={{
                backgroundColor: isDark ? '#0D2316' : '#FFFFFF',
                border: isDark ? '1px solid rgba(102, 187, 42, 0.22)' : '1px solid rgba(18, 43, 26, 0.12)',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: isDark ? 'var(--rf-leaf-green)' : '#16A34A', letterSpacing: '0.05em' }}>
                    FOR RECRUITERS & CLIENTS
                  </span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A', marginTop: '0.25rem' }}>
                    Hire & Protect
                  </h3>
                </div>
                <div className="rf-arch-card-icon" style={{ background: isDark ? 'rgba(102, 187, 42, 0.15)' : 'rgba(22, 163, 74, 0.1)', color: isDark ? "var(--rf-leaf-green)" : "#16A34A" }}>
                  <Briefcase size={22} />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(18, 43, 26, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span className="rf-arch-stat-num" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>5%</span>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.9375rem', fontWeight: 600 }}>per funded milestone</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: isDark ? '#CBD5E1' : '#475569', marginTop: '0.75rem', lineHeight: 1.55 }}>
                  Covers 100% Trust Vault custody, dispute mediation, and multi-currency cross-border settlement.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem', flex: 1 }}>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Free</strong> job posting & talent search</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>100% money-back Trust Vault protection</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Cross-border VAT & compliance receipts</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Encrypted in-app workspace collaboration</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/marketplace')}
                className="rf-arch-cta-btn"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                  color: isDark ? '#FFFFFF' : '#122B1A',
                  border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(18, 43, 26, 0.15)'
                }}
              >
                <span>Browse African Talent</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* 2. Scouter / Referrer (Highlight Card) */}
            <div
              className="rf-arch-card rf-arch-card-popular"
              style={{
                backgroundColor: isDark ? '#0D2919' : '#FFFFFF',
                border: isDark ? '2px solid var(--rf-leaf-green)' : '2px solid #16A34A',
                boxShadow: isDark
                  ? '0 0 30px rgba(102, 187, 42, 0.25), 0 12px 30px rgba(0,0,0,0.5)'
                  : '0 10px 35px rgba(22, 163, 74, 0.15), 0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div className="rf-arch-card-badge">
                POPULAR ARCHITECTURE
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: isDark ? 'var(--rf-leaf-green)' : '#16A34A', letterSpacing: '0.05em' }}>
                    FOR SCOUTERS & REFERRERS
                  </span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A', marginTop: '0.25rem' }}>
                    Refer & Earn
                  </h3>
                </div>
                <div className="rf-arch-card-icon" style={{ background: isDark ? 'rgba(102, 187, 42, 0.25)' : 'rgba(22, 163, 74, 0.15)', color: isDark ? "var(--rf-leaf-green)" : "#16A34A" }}>
                  <Zap size={22} />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(18, 43, 26, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span className="rf-arch-stat-num" style={{ color: isDark ? 'var(--rf-leaf-green)' : '#15803D' }}>0%</span>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.9375rem', fontWeight: 600 }}>Fee forever (on &le;10% talent rates)</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: isDark ? '#CBD5E1' : '#475569', marginTop: '0.75rem', lineHeight: 1.55 }}>
                  Keep <strong>100% of your proceeds forever</strong> on talent referral rates of 10% and below.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem', flex: 1 }}>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>0% platform fee forever</strong> on &le;10% referral rates</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>2% Airfee only on &gt;10% rates</strong> (waived with Airfee Token)</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Exclusive Client Onboarding Links:</strong> Earn free Airfee Tokens</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Automatic instant wallet split on milestone approval</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>M-Pesa, MoMo, Local Bank & Stablecoin withdrawal</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/dashboard/scout')}
                className="rf-arch-cta-btn"
                style={{
                  background: 'var(--rf-leaf-green)',
                  color: '#06150D',
                  boxShadow: '0 4px 18px rgba(102, 187, 42, 0.45)'
                }}
              >
                <span>Start Earning as Scout</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* 3. Talent Card */}
            <div
              className="rf-arch-card"
              style={{
                backgroundColor: isDark ? '#0D2316' : '#FFFFFF',
                border: isDark ? '1px solid rgba(102, 187, 42, 0.22)' : '1px solid rgba(18, 43, 26, 0.12)',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: isDark ? 'var(--rf-leaf-green)' : '#16A34A', letterSpacing: '0.05em' }}>
                    FOR FREELANCERS & TALENT
                  </span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A', marginTop: '0.25rem' }}>
                    Deliver & Grow
                  </h3>
                </div>
                <div className="rf-arch-card-icon" style={{ background: isDark ? 'rgba(102, 187, 42, 0.15)' : 'rgba(22, 163, 74, 0.1)', color: isDark ? "var(--rf-leaf-green)" : "#16A34A" }}>
                  <Users size={22} />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(18, 43, 26, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span className="rf-arch-stat-num" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>10%</span>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.9375rem', fontWeight: 600 }}>Scout referral commission</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: isDark ? '#CBD5E1' : '#475569', marginTop: '0.75rem', lineHeight: 1.55 }}>
                  Paid to the scout who brought you the client. Deducted only upon successful project payout.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem', flex: 1 }}>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Zero subscription</strong> or bidding tokens</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Guaranteed payment once deliverables approved</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Multi-currency payout directly to local bank / MoMo</span>
                </div>
                <div className="rf-arch-feature-row" style={{ color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  <CheckCircle2 size={16} color={isDark ? "var(--rf-leaf-green)" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Verified pan-African reputation badge</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/dashboard/talent')}
                className="rf-arch-cta-btn"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                  color: isDark ? '#FFFFFF' : '#122B1A',
                  border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(18, 43, 26, 0.15)'
                }}
              >
                <span>Create Service Package</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          REFEIR PRO SUPERPOWERS SUBSCRIPTION TIERS
          ========================================================================= */}
      <section
        className="rf-section rf-pricing-pro-section"
        style={{
          backgroundColor: isDark ? '#0A170F' : '#FFFFFF',
          backgroundImage: 'none',
          borderTop: isDark ? '1px solid rgba(244, 185, 66, 0.25)' : '1px solid rgba(18, 43, 26, 0.08)',
          borderBottom: isDark ? '1px solid rgba(244, 185, 66, 0.25)' : '1px solid rgba(18, 43, 26, 0.08)'
        }}
      >
        <div className="rf-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: isDark ? 'rgba(244, 185, 66, 0.15)' : '#FEF3C7',
                border: isDark ? '1px solid rgba(244, 185, 66, 0.4)' : '1px solid #F59E0B',
                borderRadius: '100px',
                padding: '0.35rem 1rem',
                marginBottom: '0.75rem'
              }}
            >
              <Award size={16} color={isDark ? "#F4B942" : "#B45309"} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: isDark ? '#F4B942' : '#92400E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                REFEIR PRO SUPERPOWERS
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', letterSpacing: '-0.02em' }}>
              Accelerate Your Pipeline with Refeir Pro
            </h2>
            <p style={{ color: isDark ? '#CBD5E1' : '#334155', fontSize: '1.0625rem', maxWidth: '680px', margin: '0.5rem auto 0', lineHeight: 1.6 }}>
              Unlock monthly Airfee tokens for Scouts, Featured placement for Talents, and Direct Concierge Recommendations from Refeir Desk for Clients.
            </p>
          </div>

          <div className="rf-grid-3" style={{ alignItems: 'stretch' }}>
            {/* 1. Scout Pro */}
            <div
              className="rf-card rf-pricing-pro-card"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                border: isDark ? '1.5px solid rgba(244, 185, 66, 0.4)' : '1.5px solid #F59E0B',
                backgroundColor: isDark ? '#0F2E1E' : '#FFFFFF',
                backgroundImage: 'none',
                borderRadius: 'var(--rf-radius-xl)',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(245, 158, 11, 0.08)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#F4B942' : '#B45309', letterSpacing: '0.05em' }}>
                    FOR SCOUTERS
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', marginTop: '0.25rem' }}>
                    Scout Pro
                  </h3>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isDark ? 'rgba(244, 185, 66, 0.15)' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#F4B942' : '#B45309' }}>
                  <Ticket size={22} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid rgba(18, 43, 26, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', lineHeight: 1 }}>$19</span>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.875rem' }}>/ month (₦25,000)</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: isDark ? '#F4B942' : '#B45309', fontWeight: 700, marginTop: '0.5rem' }}>
                  ⚡ Auto +5 Airfee Tokens granted every month
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#F4B942" : "#D97706"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>5 Monthly Airfee Tokens:</strong> Eliminate all 2% fee deductions on &gt;10% referrals</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#F4B942" : "#D97706"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Unlimited 0% Referral Fee Ceilings:</strong> Keep 100% of large ticket proceeds</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#F4B942" : "#D97706"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Priority Link Boost:</strong> Your links featured in client talent searches</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#F4B942" : "#D97706"} style={{ flexShrink: 0, marginTop: '2px' }} />
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
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(244, 185, 66, 0.35)'
                }}
              >
                <span>Upgrade to Scout Pro →</span>
              </button>
            </div>

            {/* 2. Talent Pro */}
            <div
              className="rf-card rf-pricing-pro-card"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                border: isDark ? '2px solid #F4B942' : '2px solid #D97706',
                backgroundColor: isDark ? '#0F2E1E' : '#FFFFFF',
                backgroundImage: 'none',
                borderRadius: 'var(--rf-radius-xl)',
                boxShadow: isDark
                  ? '0 0 30px rgba(244, 185, 66, 0.2)'
                  : '0 8px 30px rgba(217, 119, 6, 0.12)',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'linear-gradient(135deg, #F4B942, #E5A024)', color: '#07160D', padding: '0.25rem 0.875rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>
                MOST POPULAR
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#F4B942' : '#B45309', letterSpacing: '0.05em' }}>
                    FOR FREELANCERS & CREATORS
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', marginTop: '0.25rem' }}>
                    Talent Pro
                  </h3>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isDark ? 'rgba(244, 185, 66, 0.2)' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#F4B942' : '#B45309' }}>
                  <Award size={22} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid rgba(18, 43, 26, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', lineHeight: 1 }}>$29</span>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.875rem' }}>/ month (₦38,000)</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: isDark ? '#66BB2A' : '#15803D', fontWeight: 700, marginTop: '0.5rem' }}>
                  🌟 4.8x more direct client inquiries & hires
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#66BB2A" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Featured Talent Carousel Placement:</strong> Top placement on Homepage & Marketplace</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#66BB2A" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Golden "Refeir Pro" Badge:</strong> Verified ribbon building instant client trust</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#66BB2A" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>#1 Search Ranking Placement:</strong> Rank above standard profiles in skill stacks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#66BB2A" : "#16A34A"} style={{ flexShrink: 0, marginTop: '2px' }} />
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
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(244, 185, 66, 0.35)'
                }}
              >
                <span>Upgrade to Talent Pro →</span>
              </button>
            </div>

            {/* 3. Client Desk Pro */}
            <div
              className="rf-card rf-pricing-pro-card"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                border: isDark ? '1.5px solid rgba(125, 162, 255, 0.4)' : '1.5px solid #3B82F6',
                backgroundColor: isDark ? '#0F2E1E' : '#FFFFFF',
                backgroundImage: 'none',
                borderRadius: 'var(--rf-radius-xl)',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.08)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#7DA2FF' : '#1D4ED8', letterSpacing: '0.05em' }}>
                    FOR CLIENTS & ENTERPRISES
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', marginTop: '0.25rem' }}>
                    Refeir Desk Pro
                  </h3>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isDark ? 'rgba(125, 162, 255, 0.15)' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#7DA2FF' : '#1D4ED8' }}>
                  <Headphones size={22} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid rgba(18, 43, 26, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', lineHeight: 1 }}>$49</span>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.875rem' }}>/ month (₦65,000)</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: isDark ? '#7DA2FF' : '#1D4ED8', fontWeight: 700, marginTop: '0.5rem' }}>
                  🛎️ Pre-vetted talent shortlisted in &lt;24 hours
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#7DA2FF" : "#2563EB"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Direct Concierge Recommendations:</strong> Refeir Desk sources verified talents</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#7DA2FF" : "#2563EB"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Dedicated Talent Partner:</strong> Sourcing lead manages contract milestone setup</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#F4B942" : "#D97706"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Zero Dispute Mediation Fees:</strong> Dedicated legal & arbitration handling</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  <CheckCircle2 size={16} color={isDark ? "#7DA2FF" : "#2563EB"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Confidential Briefings:</strong> Custom NDA & private requirement sourcing</span>
                </div>
              </div>

              <button
                onClick={() => openProModalForRole('CLIENT')}
                className="rf-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  border: 'none',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
                }}
              >
                <span>Unlock Refeir Desk Concierge →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Example Calculation Table with 3 Scenarios */}
      <section className="rf-section" style={{ backgroundColor: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF' }}>
        <div className="rf-container" style={{ maxWidth: '980px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="rf-badge rf-badge-mint" style={{ marginBottom: '0.5rem' }}>
              TRANSPARENCY IN ACTION
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A' }}>
              How a $1,000 Milestone is Settled Across 3 Job Channels
            </h2>
            <p style={{ color: isDark ? '#CBD5E1' : '#334155', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
              Clear breakdown for Scout Referrals, Direct Talent Reachout, and Open Job Board Proposals.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Scenario 1: Scout Referral */}
            <div
              style={{
                background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(46, 125, 50, 0.25)',
                boxShadow: isDark ? 'none' : '0 4px 16px rgba(0,0,0,0.04)',
                borderRadius: 'var(--rf-radius-xl)',
                padding: '1.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  1. Scout-Referred Engagement (e.g. 10% Scout Referral Rate)
                </span>
                <span className="rf-badge rf-badge-mint rf-text-xs">Standard Scout Model</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Client Funds Escrow</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>$1,050</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#64748B' }}>$1,000 + $50 (5% Client Fee)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(102, 187, 42, 0.1)' : '#DCFCE7' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-leaf-green)' : '#15803D', textTransform: 'uppercase', fontWeight: 800 }}>Talent Payout</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? 'var(--rf-leaf-green)' : '#15803D' }}>$900</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#475569' }}>$1,000 - $100 (10% to Scout)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(246, 178, 26, 0.1)' : '#FEF3C7' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-golden-yellow)' : '#B45309', textTransform: 'uppercase', fontWeight: 800 }}>Scout Reward</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? 'var(--rf-golden-yellow)' : '#B45309' }}>$100</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#475569' }}>100% of locked 10% rate</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Refeir Platform</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>$50</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#64748B' }}>5% Escrow Custody Fee</div>
                </div>
              </div>
            </div>

            {/* Scenario 2: Direct Hire without Scout */}
            <div
              style={{
                background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(125, 162, 255, 0.35)' : '1px solid rgba(37, 99, 235, 0.25)',
                boxShadow: isDark ? 'none' : '0 4px 16px rgba(0,0,0,0.04)',
                borderRadius: 'var(--rf-radius-xl)',
                padding: '1.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  2. Direct Client Reachout to Talent (Without a Scout)
                </span>
                <span className="rf-badge rf-badge-blue rf-text-xs">Direct Platform Hire</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: isDark ? '#CBD5E1' : '#334155', marginBottom: '1rem' }}>
                Rule: If a client reaches out to a talent directly without going through a scout referral, Refeir takes the initial referral rate that the talent had set on their profile (e.g. 10%).
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Client Funds Escrow</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>$1,050</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#64748B' }}>$1,000 + $50 (5% Client Fee)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(102, 187, 42, 0.1)' : '#DCFCE7' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-leaf-green)' : '#15803D', textTransform: 'uppercase', fontWeight: 800 }}>Talent Payout</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? 'var(--rf-leaf-green)' : '#15803D' }}>$900</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#475569' }}>$1,000 - $100 (10% Talent set rate)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(125, 162, 255, 0.1)' : '#DBEAFE' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? '#93C5FD' : '#1D4ED8', textTransform: 'uppercase', fontWeight: 800 }}>Refeir Retained</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#93C5FD' : '#1D4ED8' }}>$150</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#475569' }}>5% Client Fee + 10% Direct Fee</div>
                </div>
              </div>
            </div>

            {/* Scenario 3: Proposal Job from Job Board */}
            <div
              style={{
                background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(244, 185, 66, 0.35)' : '1px solid rgba(217, 119, 6, 0.25)',
                boxShadow: isDark ? 'none' : '0 4px 16px rgba(0,0,0,0.04)',
                borderRadius: 'var(--rf-radius-xl)',
                padding: '1.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  3. Job Board Proposal Hire (5% Client + 5% Talent Split)
                </span>
                <span className="rf-badge rf-badge-warning rf-text-xs">Proposal Split Model</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: isDark ? '#CBD5E1' : '#334155', marginBottom: '1rem' }}>
                Rule: For open client jobs initiated by talent submitting proposals, Refeir takes 5% from the client and 5% from the talent at the final milestone release (10% total Refeir revenue).
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Client Total Escrow</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>$1,050</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#64748B' }}>$1,000 + $50 (5% Client Fee)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(102, 187, 42, 0.1)' : '#DCFCE7' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-leaf-green)' : '#15803D', textTransform: 'uppercase', fontWeight: 800 }}>Talent Net Payout</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? 'var(--rf-leaf-green)' : '#15803D' }}>$950</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#475569' }}>$1,000 - $50 (5% Talent Success Fee)</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: isDark ? 'rgba(244, 185, 66, 0.1)' : '#FEF3C7' }}>
                  <div style={{ fontSize: '0.75rem', color: isDark ? '#F4B942' : '#B45309', textTransform: 'uppercase', fontWeight: 800 }}>Refeir Total Revenue</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#F4B942' : '#B45309' }}>$100</div>
                  <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#475569' }}>5% Client ($50) + 5% Talent ($50)</div>
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
