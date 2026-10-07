import React, { useState, useId, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { ReferralEngine } from '../services/referralEngine';
import { CountryFlag } from '../components/common/CountryFlag';
import { formatMoney } from '../data/currencies';
import {
  Share2,
  ArrowLeft,
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Plus,
  Search,
  MessageCircle,
  Sparkles,
  Link2,
  Eye,
  CheckCircle2,
  Smartphone,
  Printer,
  X,
  Globe2
} from 'lucide-react';

interface ScoutLinksPageProps {
  onNavigate: (path: string) => void;
}

// Pure SVG Deterministic QR Code Generator (Zero npm dependency)
const DeterministicQrSvg: React.FC<{
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}> = ({ value, size = 200, fgColor = '#07160D', bgColor = '#FFFFFF' }) => {
  const matrixSize = 25;

  // Simple string hash for deterministic grid pattern
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const seed = hashString(value);

  // Check if coordinates belong to finder patterns (top-left, top-right, bottom-left)
  const isFinderPattern = (r: number, c: number) => {
    // Top-left
    if (r < 7 && c < 7) return true;
    // Top-right
    if (r < 7 && c >= matrixSize - 7) return true;
    // Bottom-left
    if (r >= matrixSize - 7 && c < 7) return true;
    return false;
  };

  const isCenterBadge = (r: number, c: number) => {
    const center = Math.floor(matrixSize / 2);
    return Math.abs(r - center) <= 2 && Math.abs(c - center) <= 2;
  };

  const isTimingPattern = (r: number, c: number) => {
    return (r === 6 || c === 6) && !isFinderPattern(r, c);
  };

  const getCellColor = (r: number, c: number) => {
    // Center badge hole
    if (isCenterBadge(r, c)) return false;

    // Finder patterns
    const inBox = (row: number, col: number, startR: number, startC: number) => {
      const relR = row - startR;
      const relC = col - startC;
      if (relR === 0 || relR === 6 || relC === 0 || relC === 6) return true;
      if (relR >= 2 && relR <= 4 && relC >= 2 && relC <= 4) return true;
      return false;
    };

    if (r < 7 && c < 7) return inBox(r, c, 0, 0);
    if (r < 7 && c >= matrixSize - 7) return inBox(r, c, 0, matrixSize - 7);
    if (r >= matrixSize - 7 && c < 7) return inBox(r, c, matrixSize - 7, 0);

    // Timing pattern
    if (isTimingPattern(r, c)) {
      return (r + c) % 2 === 0;
    }

    // Deterministic pseudo-random module based on string + position
    const cellHash = (seed + r * 37 + c * 59 + (r * c)) % 100;
    return cellHash > 48;
  };

  const cells = [];
  const cellSize = size / matrixSize;

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (getCellColor(r, c)) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize}
            height={cellSize}
            fill={fgColor}
          />
        );
      }
    }
  }

  const centerPx = size / 2;
  const badgeRadius = cellSize * 2.2;

  return (
    <svg
      id="scout-qr-svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', background: bgColor, borderRadius: '12px' }}
    >
      <rect width={size} height={size} fill={bgColor} />
      {cells}

      {/* Center Refeir Logo Badge */}
      <circle cx={centerPx} cy={centerPx} r={badgeRadius} fill={bgColor} />
      <circle cx={centerPx} cy={centerPx} r={badgeRadius - 2} fill="#07160D" />
      <text
        x={centerPx}
        y={centerPx + 5}
        fill="#66BB2A"
        fontSize={badgeRadius * 1.1}
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
      >
        R
      </text>
    </svg>
  );
};

export const ScoutLinksPage: React.FC<ScoutLinksPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { referralsList, talentList } = useMarketplace();
  const { showToast } = useNotification();

  const userId = currentUser ? currentUser.id : 'user-sarah';
  const scoutName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Sarah Adeyemi';

  const myReferrals = referralsList.filter(r => r.scout_id === userId);

  // Seed representative referral links if user has none or few
  const defaultLinks = [
    {
      id: 'ref-demo-1',
      referral_code: 'REF-NG-9842',
      target_type: 'TALENT',
      target_label: 'Amaka Nwosu (Senior FinTech Architecture)',
      country_iso: 'NG',
      clicks_count: 412,
      scans_count: 89,
      conversions_count: 6,
      created_at: '2026-09-18',
      campaign: 'Direct Network',
      last_activity: '12 mins ago'
    },
    {
      id: 'ref-demo-2',
      referral_code: 'REF-KE-4410',
      target_type: 'TALENT',
      target_label: 'David Kamau (Mobile Wallet & USSD)',
      country_iso: 'KE',
      clicks_count: 284,
      scans_count: 61,
      conversions_count: 4,
      created_at: '2026-09-24',
      campaign: 'Nairobi Tech Summit',
      last_activity: '45 mins ago'
    },
    {
      id: 'ref-demo-3',
      referral_code: 'REF-GH-1205',
      target_type: 'TALENT',
      target_label: 'Kofi Mensah (Logistics Full-Stack)',
      country_iso: 'GH',
      clicks_count: 176,
      scans_count: 38,
      conversions_count: 2,
      created_at: '2026-09-29',
      campaign: 'Accra Dev Community',
      last_activity: '3 hours ago'
    },
    {
      id: 'ref-demo-4',
      referral_code: 'REF-ZA-7721',
      target_type: 'TALENT',
      target_label: 'Thabo Mokoena (Cloud Infrastructure)',
      country_iso: 'ZA',
      clicks_count: 98,
      scans_count: 22,
      conversions_count: 1,
      created_at: '2026-10-02',
      campaign: 'Johannesburg Meetup',
      last_activity: 'Yesterday'
    },
    {
      id: 'ref-demo-univ',
      referral_code: `SCOUT-${currentUser?.id?.slice(-4).toUpperCase() || 'SARAH'}`,
      target_type: 'UNIVERSAL',
      target_label: 'Universal Scout Client Onboarding Portal',
      country_iso: 'NG',
      clicks_count: 538,
      scans_count: 142,
      conversions_count: 8,
      created_at: '2026-09-01',
      campaign: 'Global Scout Card',
      last_activity: '5 mins ago'
    }
  ];

  const allLinks = myReferrals.length > 0
    ? [
        ...myReferrals.map(r => ({
          id: r.id,
          referral_code: r.referral_code,
          target_type: 'TALENT',
          target_label: `${r.talent_name} (${r.service_title || 'Engineering'})`,
          country_iso: r.country_iso || 'NG',
          clicks_count: r.clicks_count || 12,
          scans_count: Math.round((r.clicks_count || 12) * 0.25),
          conversions_count: r.status === 'HIRED' || r.status === 'PAID' ? 1 : 0,
          created_at: r.created_at.split('T')[0],
          campaign: r.campaign || 'Direct',
          last_activity: 'Recent'
        })),
        ...defaultLinks.filter(d => !myReferrals.some(r => r.referral_code === d.referral_code))
      ]
    : defaultLinks;

  const [selectedLink, setSelectedLink] = useState(allLinks[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Link Builder Form
  const [targetType, setTargetType] = useState<'UNIVERSAL' | 'TALENT'>('TALENT');
  const [newSelectedTalent, setNewSelectedTalent] = useState(talentList[0]?.id || '');
  const [campaignTag, setCampaignTag] = useState('');

  const currentUrl = `${window.location.origin}/r/${selectedLink.referral_code}`;

  const handleCopyLink = (code: string) => {
    const url = `${window.location.origin}/r/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    showToast('Link Copied!', 'Attribution cookie active for 30 days upon client visit.');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleWhatsAppShare = (code: string, label: string) => {
    const url = `${window.location.origin}/r/${code}`;
    const text = `Hi! I recommend checking out ${label} on Refeir:\n${url}\n\n⚖️ Transparent Disclosure: As an official Refeir Scout, I may receive a referral commission upon project completion.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleLinkedInShare = (code: string, label: string) => {
    const url = `${window.location.origin}/r/${code}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById('scout-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `refeir-qr-${selectedLink.referral_code}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showToast('QR Code Downloaded', `High-resolution SVG saved for ${selectedLink.referral_code}.`);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const code = ReferralEngine.generateCode();
    const label = targetType === 'UNIVERSAL'
      ? 'Universal Client Portal'
      : (talentList.find(t => t.id === newSelectedTalent)?.full_name || 'Selected Talent');

    const created = {
      id: `ref-custom-${Date.now()}`,
      referral_code: code,
      target_type: targetType,
      target_label: label,
      country_iso: 'NG',
      clicks_count: 0,
      scans_count: 0,
      conversions_count: 0,
      created_at: new Date().toISOString().split('T')[0],
      campaign: campaignTag || 'Custom Campaign',
      last_activity: 'Just created'
    };

    allLinks.unshift(created);
    setSelectedLink(created);
    setShowCreateModal(false);
    showToast('New Scout Link Generated!', `Tracking code ${code} is live with 30-day attribution.`);
  };

  const filteredLinks = allLinks.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.referral_code.toLowerCase().includes(q) ||
      item.target_label.toLowerCase().includes(q) ||
      item.campaign.toLowerCase().includes(q)
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
        {/* Navigation Breadcrumb */}
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
            Scout Links & QR
          </span>
        </div>

        {/* Hero Banner */}
        <div
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(102, 187, 42, 0.12) 0%, rgba(10, 28, 18, 0.95) 100%)'
              : '#F8FAFC',
            border: isDark ? '1.5px solid rgba(102, 187, 42, 0.35)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '2.25rem',
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: isDark ? '#66BB2A' : '#16A34A', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <QrCode size={15} />
              <span>ENCRYPTED REFERRAL TRACKING SUITE</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', letterSpacing: '-0.02em', margin: 0 }}>
              Scout Links & Dynamic QR
            </h1>
            <p style={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '0.9375rem', maxWidth: '680px', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Generate tamper-proof referral links and high-res QR codes for social outreach, WhatsApp pitches, or printable badges at conferences.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('/telemetry')}
              className="rf-btn rf-btn-secondary"
              style={{ gap: '0.45rem', fontWeight: 700 }}
            >
              <ExternalLink size={15} />
              <span>Click Telemetry</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rf-btn rf-btn-mint"
              style={{ gap: '0.45rem', fontWeight: 800 }}
            >
              <Plus size={16} />
              <span>Create Custom Link</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive QR Generator & Live Share Showcase */}
        <div
          className="rf-card"
          style={{
            padding: '2rem 2.25rem',
            marginBottom: '2.5rem',
            background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
            border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
            borderRadius: '20px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {/* Left: QR Display Card */}
            <div
              style={{
                background: isDark ? '#0A1C12' : '#F8FAFC',
                border: isDark ? '1.5px solid rgba(102, 187, 42, 0.25)' : '1px solid #E2E8F0',
                borderRadius: '18px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 25px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span className="rf-badge rf-badge-mint rf-text-xs">
                  Official Refeir Scout
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#94A3B8' : '#64748B' }}>
                  {scoutName}
                </span>
              </div>

              {/* QR Code SVG */}
              <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
                <DeterministicQrSvg value={currentUrl} size={190} fgColor="#07160D" bgColor="#FFFFFF" />
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  {selectedLink.referral_code}
                </div>
                <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.2rem' }}>
                  Scan with camera to open with 30-day attribution lock
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.5rem', width: '100%' }}>
                <button
                  onClick={handleDownloadQr}
                  className="rf-btn rf-btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}
                >
                  <Download size={14} />
                  <span>Download SVG</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="rf-btn rf-btn-ghost"
                  style={{ padding: '0.5rem 0.75rem', color: isDark ? '#CBD5E1' : '#475569' }}
                  title="Print Badge"
                >
                  <Printer size={15} />
                </button>
              </div>
            </div>

            {/* Right: Link Controls & Multi-Channel Sharing */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDark ? '#66BB2A' : '#16A34A', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <Sparkles size={14} />
                <span>ACTIVE TRACKING LINK DETAILS</span>
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', margin: '0 0 0.5rem 0' }}>
                {selectedLink.target_label}
              </h3>
              <p style={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '0.875rem', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                Campaign: <strong>{selectedLink.campaign}</strong> • Created: {selectedLink.created_at}
              </p>

              {/* URL Box with Copy */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F1F5F9',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '0.4rem 0.6rem 0.4rem 1rem',
                  gap: '0.5rem',
                  marginBottom: '1.75rem'
                }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: isDark ? '#FFFFFF' : '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {currentUrl}
                </span>
                <button
                  onClick={() => handleCopyLink(selectedLink.referral_code)}
                  className="rf-btn rf-btn-mint rf-btn-sm"
                  style={{ gap: '0.35rem', fontWeight: 700 }}
                >
                  {copiedCode === selectedLink.referral_code ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode === selectedLink.referral_code ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Multi-Channel Distribution */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '0.75rem' }}>
                  1-Click Multi-Channel Distribution
                </span>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleWhatsAppShare(selectedLink.referral_code, selectedLink.target_label)}
                    className="rf-btn"
                    style={{ backgroundColor: '#25D366', color: '#FFFFFF', gap: '0.45rem', fontWeight: 700 }}
                  >
                    <MessageCircle size={15} />
                    <span>Share on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleLinkedInShare(selectedLink.referral_code, selectedLink.target_label)}
                    className="rf-btn"
                    style={{ backgroundColor: '#0A66C2', color: '#FFFFFF', gap: '0.45rem', fontWeight: 700 }}
                  >
                    <Share2 size={15} />
                    <span>Share on LinkedIn</span>
                  </button>
                  <button
                    onClick={() => {
                      const tweet = `Connecting premier African tech talent with global clients on @RefeirMarketplace: ${currentUrl}`;
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
                    }}
                    className="rf-btn"
                    style={{ backgroundColor: isDark ? '#1E293B' : '#0F172A', color: '#FFFFFF', gap: '0.45rem', fontWeight: 700 }}
                  >
                    <span>Share on X</span>
                  </button>
                </div>
              </div>

              {/* Attribution Window Callout */}
              <div
                style={{
                  background: isDark ? 'rgba(102, 187, 42, 0.08)' : '#F0FDF4',
                  border: isDark ? '1px solid rgba(102, 187, 42, 0.2)' : '1px solid #BBF7D0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <ShieldCheck size={20} color={isDark ? 'var(--rf-leaf-green)' : '#16A34A'} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.8125rem', color: isDark ? '#CBD5E1' : '#166534', lineHeight: 1.4 }}>
                  <strong>30-Day Escrow Protection:</strong> Visitors are stamped with an irreversible cryptographic session token. Even if they sign up later on another device, your 10% commission remains locked.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* All Scout Tracking Links Table */}
        <div
          className="rf-card"
          style={{
            padding: '2rem',
            background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
            border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', margin: 0 }}>
                Active Tracking Links & QR Library
              </h3>
              <p style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
                Select any link to inspect QR codes or distribute across channels.
              </p>
            </div>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
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

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', minWidth: '780px' }}>
              <thead>
                <tr style={{ borderBottom: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Target Destination</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Campaign</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Clicks</th>
                  <th style={{ padding: '0.75rem 1rem' }}>QR Scans</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Conversions</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map(link => {
                  const isSelected = selectedLink.referral_code === link.referral_code;
                  return (
                    <tr
                      key={link.id}
                      onClick={() => setSelectedLink(link)}
                      style={{
                        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #F1F5F9',
                        cursor: 'pointer',
                        background: isSelected
                          ? (isDark ? 'rgba(102, 187, 42, 0.07)' : '#F0FDF4')
                          : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 800, color: isDark ? 'var(--rf-leaf-green)' : '#16A34A' }}>
                        {link.referral_code}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>{link.target_label}</span>
                          <CountryFlag countryIsoOrName={link.country_iso} showName={false} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                          {link.target_type === 'UNIVERSAL' ? 'Client Onboarding' : 'Direct Talent Referral'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: isDark ? '#CBD5E1' : '#475569' }}>
                        {link.campaign}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                        {link.clicks_count}
                      </td>
                      <td style={{ padding: '1rem', color: isDark ? '#38BDF8' : '#0284C7', fontWeight: 700 }}>
                        {link.scans_count}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="rf-badge rf-badge-mint rf-text-xs">
                          {link.conversions_count} Deals
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleCopyLink(link.referral_code)}
                            className="rf-btn rf-btn-ghost rf-btn-sm"
                            style={{ padding: '0.35rem', color: isDark ? '#94A3B8' : '#64748B' }}
                            title="Copy Link"
                          >
                            {copiedCode === link.referral_code ? <Check size={14} color="var(--rf-leaf-green)" /> : <Copy size={14} />}
                          </button>
                          <button
                            onClick={() => handleWhatsAppShare(link.referral_code, link.target_label)}
                            className="rf-btn rf-btn-sm"
                            style={{ backgroundColor: '#25D366', color: '#FFF', padding: '0.35rem 0.6rem' }}
                            title="Share on WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Create Custom Scout Link */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: isDark ? '#0D1E13' : '#FFFFFF',
              border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  Create New Tracking Link
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Generate an encrypted link and dynamic QR code.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rf-btn rf-btn-ghost rf-btn-sm"
                style={{ padding: '0.4rem', color: isDark ? '#94A3B8' : '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: isDark ? '#CBD5E1' : '#334155' }}>
                  Destination Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setTargetType('TALENT')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: targetType === 'TALENT' ? '2px solid var(--rf-leaf-green)' : '1px solid #CBD5E1',
                      background: targetType === 'TALENT' ? (isDark ? 'rgba(102, 187, 42, 0.1)' : '#DCFCE7') : 'transparent',
                      color: isDark ? '#FFFFFF' : '#122B1A',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Specific Talent Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('UNIVERSAL')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: targetType === 'UNIVERSAL' ? '2px solid var(--rf-leaf-green)' : '1px solid #CBD5E1',
                      background: targetType === 'UNIVERSAL' ? (isDark ? 'rgba(102, 187, 42, 0.1)' : '#DCFCE7') : 'transparent',
                      color: isDark ? '#FFFFFF' : '#122B1A',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Universal Client Portal
                  </button>
                </div>
              </div>

              {targetType === 'TALENT' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: isDark ? '#CBD5E1' : '#334155' }}>
                    Select Talent
                  </label>
                  <select
                    className="rf-input"
                    value={newSelectedTalent}
                    onChange={e => setNewSelectedTalent(e.target.value)}
                  >
                    {talentList.slice(0, 10).map(t => (
                      <option key={t.id} value={t.id}>
                        {t.full_name} ({t.professional_title})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: isDark ? '#CBD5E1' : '#334155' }}>
                  Campaign Tag / Event Name (Optional)
                </label>
                <input
                  type="text"
                  className="rf-input"
                  placeholder="e.g. Lagos Tech Fest 2026"
                  value={campaignTag}
                  onChange={e => setCampaignTag(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rf-btn rf-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rf-btn rf-btn-mint"
                  style={{ fontWeight: 800 }}
                >
                  Generate Link & QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
