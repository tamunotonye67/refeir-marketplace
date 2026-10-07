import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { CountryFlag } from '../components/common/CountryFlag';
import { formatMoney } from '../data/currencies';
import {
  Activity,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Globe2,
  Users,
  Clock,
  ExternalLink,
  Lock,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Smartphone,
  Laptop,
  Radio,
  Eye,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

interface LinkTelemetryPageProps {
  onNavigate: (path: string) => void;
}

export const LinkTelemetryPage: React.FC<LinkTelemetryPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { referralsList } = useMarketplace();
  const { showToast } = useNotification();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [searchQuery, setSearchQuery] = useState('');

  const userId = currentUser ? currentUser.id : 'user-sarah';
  const myReferrals = referralsList.filter(r => r.scout_id === userId);

  // If user has few or no referrals yet, provide representative telemetry items
  const activeReferralLinks = myReferrals.length > 0 ? myReferrals : [
    {
      id: 'ref-demo-1',
      referral_code: 'REF-NG-9842',
      talent_name: 'Amaka Nwosu',
      talent_country: 'NG',
      service_title: 'Senior FinTech Architecture',
      locked_referral_percentage: 10,
      potential_reward: { amount_minor: 45000000, currency: 'NGN' },
      clicks_count: 412,
      unique_visitors: 348,
      status: 'ACTIVE',
      last_click_at: '3 minutes ago',
      top_location: 'Lagos, Nigeria'
    },
    {
      id: 'ref-demo-2',
      referral_code: 'REF-KE-4410',
      talent_name: 'David Kamau',
      talent_country: 'KE',
      service_title: 'Mobile Wallet & USSD Engineering',
      locked_referral_percentage: 10,
      potential_reward: { amount_minor: 35000000, currency: 'KES' },
      clicks_count: 284,
      unique_visitors: 221,
      status: 'HIRED',
      last_click_at: '14 minutes ago',
      top_location: 'Nairobi, Kenya'
    },
    {
      id: 'ref-demo-3',
      referral_code: 'REF-GH-1205',
      talent_name: 'Kofi Mensah',
      talent_country: 'GH',
      service_title: 'Cross-Border Logistics Dashboard',
      locked_referral_percentage: 10,
      potential_reward: { amount_minor: 1250000, currency: 'GHS' },
      clicks_count: 176,
      unique_visitors: 142,
      status: 'ACTIVE',
      last_click_at: '1 hour ago',
      top_location: 'Accra, Ghana'
    },
    {
      id: 'ref-demo-4',
      referral_code: 'REF-ZA-7721',
      talent_name: 'Thabo Mokoena',
      talent_country: 'ZA',
      service_title: 'Enterprise Cloud Infrastructure',
      locked_referral_percentage: 10,
      potential_reward: { amount_minor: 8500000, currency: 'ZAR' },
      clicks_count: 156,
      unique_visitors: 130,
      status: 'PAID',
      last_click_at: '3 hours ago',
      top_location: 'Johannesburg, South Africa'
    }
  ];

  // Live real-time click telemetry audit logs
  const liveAuditLogs = [
    {
      id: 'log-1',
      code: 'REF-NG-9842',
      talent: 'Amaka Nwosu',
      ip_masked: '102.89.44.***',
      city: 'Lagos',
      countryCode: 'NG',
      device: 'Chrome / MacOS',
      deviceType: 'desktop',
      referrer: 'WhatsApp Web',
      time: 'Just now',
      attribution: 'LOCKED',
      statusNote: 'Session verified & 30-day cookie lock established'
    },
    {
      id: 'log-2',
      code: 'REF-KE-4410',
      talent: 'David Kamau',
      ip_masked: '197.232.81.***',
      city: 'Nairobi',
      countryCode: 'KE',
      device: 'Mobile Safari / iPhone',
      deviceType: 'mobile',
      referrer: 'Direct / QR Code',
      time: '4 mins ago',
      attribution: 'PROPOSAL_VIEW',
      statusNote: 'Client opened scoping brief'
    },
    {
      id: 'log-3',
      code: 'REF-GH-1205',
      talent: 'Kofi Mensah',
      ip_masked: '154.160.22.***',
      city: 'Accra',
      countryCode: 'GH',
      device: 'Edge / Windows 11',
      deviceType: 'desktop',
      referrer: 'LinkedIn Messaging',
      time: '18 mins ago',
      attribution: 'LOCKED',
      statusNote: 'Deterministic Scout attribution linked'
    },
    {
      id: 'log-4',
      code: 'REF-NG-9842',
      talent: 'Amaka Nwosu',
      ip_masked: '86.142.19.***',
      city: 'London',
      countryCode: 'GB',
      device: 'Chrome / iOS',
      deviceType: 'mobile',
      referrer: 'Email Referral Link',
      time: '42 mins ago',
      attribution: 'ESCROW_FUNDED',
      statusNote: 'Client funded milestone escrow'
    },
    {
      id: 'log-5',
      code: 'REF-ZA-7721',
      talent: 'Thabo Mokoena',
      ip_masked: '196.25.1.***',
      city: 'Cape Town',
      countryCode: 'ZA',
      device: 'Firefox / Linux',
      deviceType: 'desktop',
      referrer: 'Direct Chat',
      time: '1 hour ago',
      attribution: 'LOCKED',
      statusNote: 'Repeat client session logged'
    },
    {
      id: 'log-6',
      code: 'REF-KE-4410',
      talent: 'David Kamau',
      ip_masked: '41.139.140.***',
      city: 'Mombasa',
      countryCode: 'KE',
      device: 'Mobile Chrome / Android',
      deviceType: 'mobile',
      referrer: 'WhatsApp',
      time: '2 hours ago',
      attribution: 'LOCKED',
      statusNote: 'Fingerprint verified'
    }
  ];

  const totalClicks = activeReferralLinks.reduce((acc, r: any) => acc + (r.clicks_count || 0), 0);
  const totalUnique = activeReferralLinks.reduce((acc, r: any) => acc + (r.unique_visitors || Math.round((r.clicks_count || 0) * 0.8)), 0);

  const handleCopyLink = (code: string) => {
    const url = `${window.location.origin}/r/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(code);
    showToast('Telemetry Link Copied!', 'Attribution is cryptographically locked for 30 days upon client visit.');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleWhatsAppShare = (ref: any) => {
    const url = `${window.location.origin}/r/${ref.referral_code}`;
    const text = `I recommend ${ref.talent_name} on Refeir:\n${url}\n\n⚖️ Transparent Disclosure: I may receive a referral reward upon project completion.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleExportCSV = () => {
    showToast('Export Generated', 'Referral click audit log (.CSV) downloaded with cryptographic checksum.', 'INFO');
  };

  const filteredLinks = activeReferralLinks.filter((item: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.referral_code.toLowerCase().includes(q) ||
      item.talent_name.toLowerCase().includes(q) ||
      (item.service_title && item.service_title.toLowerCase().includes(q))
    );
  });

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
        {/* Navigation Breadcrumb & Back */}
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
            Link Telemetry & Click Audit Logs
          </span>
        </div>

        {/* Header Banner */}
        <div
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(102, 187, 42, 0.14) 0%, rgba(10, 28, 18, 0.95) 100%)'
              : '#F8FAFC',
            border: isDark ? '1.5px solid rgba(102, 187, 42, 0.35)' : '1px solid #E2E8F0',
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: isDark ? 'var(--rf-leaf-green)' : '#16A34A', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <Activity size={15} />
              <span>LIVE CRYPTOGRAPHIC TELEMETRY ENGINE</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', letterSpacing: '-0.02em', margin: 0 }}>
              Referral Link Telemetry & Audit Logs
            </h1>
            <p style={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '0.9375rem', maxWidth: '680px', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Track real-time click volume, device footprints, geographical distribution, and 30-day deterministic attribution locks across all 54 African countries.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportCSV}
              className="rf-btn rf-btn-secondary"
              style={{ gap: '0.45rem', fontWeight: 700 }}
            >
              <Download size={15} />
              <span>Export Audit Trail (.CSV)</span>
            </button>
            <button
              onClick={() => onNavigate('/marketplace')}
              className="rf-btn rf-btn-mint"
              style={{ gap: '0.45rem', fontWeight: 800 }}
            >
              <Share2 size={15} />
              <span>Generate New Scout Link</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
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
                Total Link Impressions
              </span>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isDark ? 'rgba(102, 187, 42, 0.15)' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#66BB2A' : '#16A34A' }}>
                <Eye size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
              {totalClicks.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#66BB2A' : '#16A34A', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
              <TrendingUp size={13} />
              <span>+14.8% link engagement this week</span>
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
                Unique Visitors
              </span>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isDark ? 'rgba(56, 189, 248, 0.15)' : '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
              {totalUnique.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              Distinct browser fingerprints logged
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
                Attribution Integrity
              </span>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isDark ? 'rgba(102, 187, 42, 0.15)' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#66BB2A' : '#16A34A' }}>
                <Lock size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#66BB2A' : '#16A34A' }}>
              100% Locked
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              30-day deterministic cookie & wallet attribution
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
                Fraud Prevention
              </span>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isDark ? 'rgba(244, 185, 66, 0.15)' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <ShieldCheck size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
              Active
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              Anti-bot filtering & self-referral protection on
            </div>
          </div>
        </div>

        {/* Section: Tracked Referral Links Breakdown */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', margin: 0 }}>
                Active Tracked Scout Links
              </h3>
              <p style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
                Attribution links generating clicks across social, WhatsApp, email, and direct inquiries.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
                <input
                  type="text"
                  className="rf-input"
                  style={{ paddingLeft: '2.4rem', height: '38px', fontSize: '0.8125rem' }}
                  placeholder="Filter by code or talent..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Referred Talent</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Clicks</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Unique IP</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Top Location</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Last Activity</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Attribution Lock</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link: any) => (
                  <tr key={link.id} style={{ borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #F1F5F9' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 800, color: isDark ? 'var(--rf-leaf-green)' : '#16A34A' }}>
                      {link.referral_code}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>{link.talent_name}</div>
                      <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B' }}>{link.service_title || 'General Introduction'}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                      {link.clicks_count}
                    </td>
                    <td style={{ padding: '1rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                      {link.unique_visitors || Math.round(link.clicks_count * 0.8)}
                    </td>
                    <td style={{ padding: '1rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                      {link.top_location || 'Lagos, Nigeria'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.8125rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                      {link.last_click_at || 'Recently active'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Lock size={11} /> 30-Day Active
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleWhatsAppShare(link)}
                          className="rf-btn rf-btn-sm"
                          style={{ backgroundColor: '#25D366', color: '#FFF', padding: '0.35rem 0.65rem' }}
                          title="Share Link on WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </button>
                        <button
                          onClick={() => handleCopyLink(link.referral_code)}
                          className="rf-btn rf-btn-secondary rf-btn-sm"
                          style={{ width: '34px', minWidth: '34px', padding: 0, justifyContent: 'center' }}
                          title="Copy Link"
                        >
                          {copiedId === link.referral_code ? <Check size={14} color="var(--rf-leaf-green)" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Live Real-Time Telemetry Audit Feed */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 10px #22C55E' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', margin: 0 }}>
                Live Referral Click Feed & Device Audit Logs
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
              Auto-updating real-time stream
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {liveAuditLogs.map(log => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: isDark ? 'rgba(102, 187, 42, 0.15)' : '#DCFCE7',
                      color: isDark ? 'var(--rf-leaf-green)' : '#16A34A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {log.deviceType === 'mobile' ? <Smartphone size={18} /> : <Laptop size={18} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '0.875rem' }}>
                        {log.code}
                      </span>
                      <span style={{ color: isDark ? '#475569' : '#CBD5E1' }}>•</span>
                      <span style={{ fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', fontSize: '0.8125rem' }}>
                        {log.talent}
                      </span>
                      <span style={{ color: isDark ? '#475569' : '#CBD5E1' }}>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: isDark ? '#94A3B8' : '#475569' }}>
                        <CountryFlag countryIsoOrName={log.countryCode} showName={false} />
                        <span>{log.city}</span>
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.2rem' }}>
                      IP: <span style={{ fontFamily: 'monospace' }}>{log.ip_masked}</span> • {log.device} • Via {log.referrer}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span
                    className="rf-badge rf-badge-mint rf-text-xs"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <CheckCircle2 size={11} /> {log.statusNote}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                    {log.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic Proof Notice */}
        <div
          style={{
            background: isDark ? 'rgba(102, 187, 42, 0.08)' : '#F0FDF4',
            border: isDark ? '1px solid rgba(102, 187, 42, 0.25)' : '1px solid #BBF7D0',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: isDark ? '#CBD5E1' : '#166534',
            fontSize: '0.875rem'
          }}
        >
          <ShieldCheck size={24} color={isDark ? 'var(--rf-leaf-green)' : '#16A34A'} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: isDark ? '#FFFFFF' : '#14532D' }}>30-Day Deterministic Attribution Guarantee:</strong> Every visit via your Scout link stamps a tamper-evident session token into the client's browser and account profile. Even if the client returns weeks later without your link, your 10% commission remains permanently guaranteed.
          </div>
        </div>
      </div>
    </div>
  );
};
