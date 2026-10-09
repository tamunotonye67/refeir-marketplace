import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import {
  TrendingUp,
  ArrowLeft,
  Filter,
  Download,
  CheckCircle2,
  Users,
  Zap,
  Target,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  DollarSign,
  BarChart3,
  Calendar,
  Layers,
  BookOpen,
  ChevronRight
} from 'lucide-react';

interface ConversionRatesPageProps {
  onNavigate: (path: string) => void;
}

export const ConversionRatesPage: React.FC<ConversionRatesPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { referralsList } = useMarketplace();
  const { showToast } = useNotification();

  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'ytd' | 'all'>('30d');

  const userId = currentUser ? currentUser.id : 'user-sarah';
  const myReferrals = referralsList.filter(r => r.scout_id === userId);

  // Conversion Funnel Data
  const funnelStages = [
    {
      step: 1,
      name: 'Link Impressions & Clicks',
      count: '1,428',
      percentage: '100%',
      dropoff: '—',
      color: '#38BDF8',
      desc: 'Raw unique visitors arriving through encrypted scout referral links.'
    },
    {
      step: 2,
      name: 'Profile & Service Views',
      count: '684',
      percentage: '47.9%',
      dropoff: '-52.1%',
      color: '#818CF8',
      desc: 'Clients who browsed the recommended talent portfolio & verified reviews.'
    },
    {
      step: 3,
      name: 'Scoping Chats Initiated',
      count: '248',
      percentage: '17.4%',
      dropoff: '-30.5%',
      color: '#F4B942',
      desc: 'Direct discussions opened between client and talent inside Refeir chat.'
    },
    {
      step: 4,
      name: 'Trust Vault Escrow Funded',
      count: '96',
      percentage: '6.7%',
      dropoff: '-10.7%',
      color: '#66BB2A',
      desc: 'Contracts accepted and milestone capital locked into multi-currency escrow.'
    },
    {
      step: 5,
      name: 'Settled Milestones & 10% Paid',
      count: '88',
      percentage: '6.2%',
      dropoff: '-0.5%',
      color: '#10B981',
      desc: 'Projects successfully completed with automated 10% scout commission disbursed.'
    }
  ];

  // Category performance
  const categoryConversions = [
    {
      category: 'Software & Mobile Engineering',
      referralCount: 42,
      conversionRate: 24.5,
      avgProjectValue: '₦3,850,000',
      totalEarned: '₦1,617,000',
      avgVelocityDays: '6 days'
    },
    {
      category: 'AI, LLMs & Data Science',
      referralCount: 28,
      conversionRate: 21.0,
      avgProjectValue: '₦4,400,000',
      totalEarned: '₦1,232,000',
      avgVelocityDays: '5 days'
    },
    {
      category: 'UI/UX & Product Design',
      referralCount: 36,
      conversionRate: 18.2,
      avgProjectValue: '₦2,100,000',
      totalEarned: '₦756,000',
      avgVelocityDays: '4 days'
    },
    {
      category: 'African GTM & Growth Marketing',
      referralCount: 19,
      conversionRate: 14.6,
      avgProjectValue: '₦2,600,000',
      totalEarned: '₦494,000',
      avgVelocityDays: '8 days'
    }
  ];

  const handleExport = () => {
    showToast('Conversion Report Exported', 'Detailed milestone conversion statistics (.CSV) generated.', 'INFO');
  };

  return (
    <div
      style={{
        backgroundColor: isDark ? 'var(--rf-bg-base)' : '#FFFFFF',
        minHeight: '85vh',
        width: '100%',
        color: isDark ? '#FFFFFF' : '#122B1A'
      }}
    >
      <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => onNavigate('/dashboard/scout')}
            className="rf-btn rf-btn-ghost rf-btn-sm"
            style={{
              padding: '0.35rem 0.75rem',
              color: isDark ? '#94A3B8' : '#475569',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Scout Command Center</span>
          </button>
          <span style={{ color: isDark ? '#475569' : '#CBD5E1' }}>/</span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: isDark ? '#66BB2A' : '#16A34A' }}>
            Conversion Rates & Milestone Settlement Velocity
          </span>
        </div>

        {/* Header Banner */}
        <div
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(10, 28, 18, 0.95) 100%)'
              : '#F8FAFC',
            border: isDark ? '1.5px solid rgba(56, 189, 248, 0.35)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '2rem 2.25rem',
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: isDark ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#38BDF8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <TrendingUp size={15} />
              <span>SCOUT REFERRAL FUNNEL ANALYTICS</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', letterSpacing: '-0.02em', margin: 0 }}>
              Conversion Rates & Settlement Velocity
            </h1>
            <p style={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '0.9375rem', maxWidth: '680px', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Analyze how your client introductions advance from raw link clicks to funded escrow contracts, completion approvals, and automated 10% commission disbursements.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#EDF2F7', borderRadius: '10px', padding: '3px' }}>
              {(['30d', '90d', 'ytd', 'all'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setTimeRange(p)}
                  style={{
                    background: timeRange === p ? (isDark ? 'var(--rf-leaf-green)' : '#FFFFFF') : 'transparent',
                    color: timeRange === p ? (isDark ? '#07160D' : '#122B1A') : (isDark ? '#94A3B8' : '#64748B'),
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: timeRange === p && !isDark ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="rf-btn rf-btn-secondary"
              style={{ gap: '0.45rem', fontWeight: 700 }}
            >
              <Download size={15} />
              <span>Export Funnel (.CSV)</span>
            </button>
          </div>
        </div>

        {/* 4 Core KPI Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div
            className="rf-card"
            style={{
              padding: '1.5rem',
              background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
              border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#64748B' }}>
                End-to-End Conversion
              </span>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isDark ? 'rgba(102, 187, 42, 0.15)' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#66BB2A' : '#16A34A' }}>
                <Target size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#66BB2A' : '#16A34A' }}>
              18.4%
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              Top 10% benchmark across African Scouts
            </div>
          </div>

          <div
            className="rf-card"
            style={{
              padding: '1.5rem',
              background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
              border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#64748B' }}>
                Chat Initiation Rate
              </span>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isDark ? 'rgba(56, 189, 248, 0.15)' : '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
              36.2%
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              Of visitors open direct talent scoping chat
            </div>
          </div>

          <div
            className="rf-card"
            style={{
              padding: '1.5rem',
              background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
              border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#64748B' }}>
                Escrow Funding Rate
              </span>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isDark ? 'rgba(244, 185, 66, 0.15)' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <Zap size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
              91.6%
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              Of accepted proposals get funded into Escrow
            </div>
          </div>

          <div
            className="rf-card"
            style={{
              padding: '1.5rem',
              background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
              border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#64748B' }}>
                Average Settlement Velocity
              </span>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isDark ? 'rgba(16, 185, 129, 0.15)' : '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <Clock size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
              5.4 Days
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              From initial click to first milestone payout
            </div>
          </div>
        </div>

        {/* Multi-Stage Visual Funnel Section */}
        <div
          className="rf-card"
          style={{
            padding: '2rem',
            marginBottom: '2.5rem',
            background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
            border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
            borderRadius: '20px'
          }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', margin: 0 }}>
              Multi-Stage Referral Conversion Pipeline
            </h3>
            <p style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
              Step-by-step conversion throughput from first visitor interaction to final milestone release.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {funnelStages.map((stage, idx) => (
              <div
                key={stage.step}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 340px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: stage.color,
                      color: '#07160D',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9375rem',
                      flexShrink: 0
                    }}
                  >
                    {stage.step}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                      {stage.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                      {stage.desc}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                      {stage.count}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                      Logged events
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '70px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: stage.color }}>
                      {stage.percentage}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                      Throughput
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '70px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: stage.dropoff === '—' ? (isDark ? '#94A3B8' : '#64748B') : '#EF4444' }}>
                      {stage.dropoff}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                      Drop-off
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Category & Skill Conversion Breakdown */}
        <div
          className="rf-card"
          style={{
            padding: '2rem',
            marginBottom: '2.5rem',
            background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
            border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
            borderRadius: '20px'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', margin: 0 }}>
              Conversion Velocity by Talent Specialty
            </h3>
            <p style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
              Identify which African technical disciplines generate the highest client closing rate and commission yields.
            </p>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', minWidth: '650px' }}>
              <thead>
                <tr style={{ borderBottom: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Referrals Sent</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Closing Rate</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Avg Contract Value</th>
                  <th style={{ padding: '0.75rem 1rem' }}>10% Commission Earned</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Avg Velocity</th>
                </tr>
              </thead>
              <tbody>
                {categoryConversions.map((cat, idx) => (
                  <tr key={idx} style={{ borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #F1F5F9' }}>
                    <td style={{ padding: '1rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                      {cat.category}
                    </td>
                    <td style={{ padding: '1rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                      {cat.referralCount}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="rf-badge rf-badge-mint rf-text-xs" style={{ fontWeight: 800 }}>
                        {cat.conversionRate}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                      {cat.avgProjectValue}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 800, color: isDark ? 'var(--rf-leaf-green)' : '#16A34A' }}>
                      {cat.totalEarned}
                    </td>
                    <td style={{ padding: '1rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                      {cat.avgVelocityDays}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scout Optimization Strategies Banner */}
        <div
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(244, 185, 66, 0.1) 0%, rgba(102, 187, 42, 0.1) 100%)'
              : '#FEFCE8',
            border: isDark ? '1.5px solid rgba(244, 185, 66, 0.35)' : '1px solid #FEF08A',
            borderRadius: '20px',
            padding: '1.75rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#D97706', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <BookOpen size={14} />
              <span>SCOUT CONVERSION PLAYBOOK</span>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#713F12', margin: 0 }}>
              How to Double Your Milestone Settlement Rate
            </h4>
            <p style={{ color: isDark ? '#CBD5E1' : '#854D0E', fontSize: '0.875rem', maxWidth: '640px', marginTop: '0.25rem', lineHeight: 1.5 }}>
              Referrals sent with a personalized WhatsApp context brief convert <strong>3.4× higher</strong> than raw shared links. Always highlight Refeir's Trust Vault milestone refund protection to clients.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/marketplace')}
            className="rf-btn rf-btn-mint"
            style={{ gap: '0.45rem', fontWeight: 800 }}
          >
            <span>Browse High-Yield Talent</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
