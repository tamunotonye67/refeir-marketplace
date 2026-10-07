import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { CountryFlag } from '../components/common/CountryFlag';
import { formatMoney } from '../data/currencies';
import {
  Users,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Briefcase,
  Copy,
  Check,
  Send,
  X,
  AlertCircle,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface ActiveIntroductionsPageProps {
  onNavigate: (path: string) => void;
}

export const ActiveIntroductionsPage: React.FC<ActiveIntroductionsPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {
    talentList,
    clientIntroductionsList,
    submitClientIntroduction
  } = useMarketplace();
  const { showToast } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCOPING' | 'FUNDED' | 'COMPLETED' | 'PENDING'>('ALL');
  const [showNewIntroModal, setShowNewIntroModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State for New Introduction
  const [newClientName, setNewClientName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [selectedTalentId, setSelectedTalentId] = useState(talentList[0]?.id || '');
  const [estimatedBudget, setEstimatedBudget] = useState('₦3,500,000');
  const [introNotes, setIntroNotes] = useState('');

  const userId = currentUser ? currentUser.id : 'user-sarah';
  const scoutName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Sarah Adeyemi';

  // Seed / representative introductions if user has none
  const fallbackIntroductions = [
    {
      id: 'intro-demo-1',
      client_contact_name: 'Babajide Adeleke',
      company_name: 'ApexPay Technologies',
      country_iso: 'NG',
      client_email: 'adeleke@apexpay.ng',
      talent_id: 'talent-1',
      talent_name: 'Amaka Nwosu',
      talent_role: 'Senior FinTech Architect',
      talent_country: 'NG',
      stage: 'FUNDED',
      stage_label: 'Escrow Milestone Funded',
      deal_amount_formatted: '₦4,500,000',
      scout_cut_formatted: '₦450,000',
      last_activity: 'Milestone 1 funded into Trust Vault • 2 hours ago',
      created_at: '2026-09-28',
      chat_thread_id: 't1'
    },
    {
      id: 'intro-demo-2',
      client_contact_name: 'Dr. Michael Chen',
      company_name: 'Equator Ventures London',
      country_iso: 'GB',
      client_email: 'mchen@equatorvc.com',
      talent_id: 'talent-2',
      talent_name: 'David Kamau',
      talent_role: 'Mobile Wallet Engineer',
      talent_country: 'KE',
      stage: 'SCOPING',
      stage_label: 'Scoping & Chat Negotiations',
      deal_amount_formatted: '₦3,800,000',
      scout_cut_formatted: '₦380,000',
      last_activity: 'Technical proposal under review • 5 hours ago',
      created_at: '2026-10-01',
      chat_thread_id: 't2'
    },
    {
      id: 'intro-demo-3',
      client_contact_name: 'Fatima Al-Hassan',
      company_name: 'Zambezi Logistics Group',
      country_iso: 'ZA',
      client_email: 'f.alhassan@zambezilogistics.co.za',
      talent_id: 'talent-4',
      talent_name: 'Thabo Mokoena',
      talent_role: 'Cloud Infrastructure Lead',
      talent_country: 'ZA',
      stage: 'COMPLETED',
      stage_label: 'Completed & 10% Paid',
      deal_amount_formatted: '₦2,400,000',
      scout_cut_formatted: '₦240,000',
      last_activity: 'Milestone settled • Disbursed to Scout Wallet',
      created_at: '2026-09-14',
      chat_thread_id: 't3'
    },
    {
      id: 'intro-demo-4',
      client_contact_name: 'Kojo Asante',
      company_name: 'Accra HealthTech Inc.',
      country_iso: 'GH',
      client_email: 'kojo@accrahealth.io',
      talent_id: 'talent-3',
      talent_name: 'Kofi Mensah',
      talent_role: 'Full-Stack Logistics Developer',
      talent_country: 'GH',
      stage: 'SCOPING',
      stage_label: 'Scoping & Chat Negotiations',
      deal_amount_formatted: '₦1,750,000',
      scout_cut_formatted: '₦175,000',
      last_activity: 'Requirements scoping session active • Yesterday',
      created_at: '2026-10-04',
      chat_thread_id: 't4'
    },
    {
      id: 'intro-demo-5',
      client_contact_name: 'Tariq Al-Mansoor',
      company_name: 'Nile Port Solutions',
      country_iso: 'EG',
      client_email: 'tariq@nileports.eg',
      talent_id: 'talent-5',
      talent_name: 'Amina Bello',
      talent_role: 'UI/UX & Product Design Lead',
      talent_country: 'NG',
      stage: 'PENDING',
      stage_label: 'Pending Client Registration',
      deal_amount_formatted: '₦2,200,000',
      scout_cut_formatted: '₦220,000',
      last_activity: 'Invite link dispatched via WhatsApp • 2 days ago',
      created_at: '2026-10-05',
      chat_thread_id: null
    }
  ];

  // User introductions from context
  const myIntroductions = clientIntroductionsList
    .filter(i => i.scout_id === userId)
    .map(i => {
      const stage = i.has_closed_deal
        ? 'COMPLETED'
        : i.deal_project_id
        ? 'FUNDED'
        : i.has_registered
        ? 'SCOPING'
        : 'PENDING';

      const stage_label = i.has_closed_deal
        ? 'Completed & 10% Paid'
        : i.deal_project_id
        ? 'Escrow Milestone Funded'
        : i.has_registered
        ? 'Scoping & Chat Negotiations'
        : 'Pending Client Registration';

      return {
        id: i.id,
        client_contact_name: i.client_contact_name,
        company_name: i.company_name,
        country_iso: 'NG',
        client_email: i.client_email,
        talent_id: 'talent-1',
        talent_name: 'Recommended Talent',
        talent_role: 'Verified African Specialist',
        talent_country: 'NG',
        stage,
        stage_label,
        deal_amount_formatted: i.deal_amount_formatted || '₦3,000,000',
        scout_cut_formatted: '₦300,000',
        last_activity: `Logged by Scout • Code ${i.referral_link_code}`,
        created_at: i.created_at.split('T')[0],
        chat_thread_id: 't1'
      };
    });

  const allIntroductions = myIntroductions.length > 0
    ? [...myIntroductions, ...fallbackIntroductions.slice(myIntroductions.length)]
    : fallbackIntroductions;

  // Filtered introductions
  const filteredIntroductions = allIntroductions.filter(item => {
    if (statusFilter !== 'ALL' && item.stage !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.client_contact_name.toLowerCase().includes(q) ||
      item.company_name.toLowerCase().includes(q) ||
      item.talent_name.toLowerCase().includes(q) ||
      item.talent_role.toLowerCase().includes(q)
    );
  });

  const handleCopyLink = (id: string, code: string) => {
    const url = `${window.location.origin}/r/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Introduction Link Copied!', 'Share this link directly with the hiring manager or client.');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCreateIntroduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newCompanyName.trim()) {
      showToast('Missing Fields', 'Please specify both client contact name and business name.', 'WARNING');
      return;
    }

    submitClientIntroduction(
      userId,
      scoutName,
      newClientName.trim(),
      newCompanyName.trim(),
      newClientEmail.trim() || undefined,
      newClientPhone.trim() || undefined
    );

    showToast(
      'Client Introduction Registered!',
      `Tracking link generated for ${newCompanyName}. 10% commission is locked for all milestone contracts.`
    );

    setNewClientName('');
    setNewCompanyName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setIntroNotes('');
    setShowNewIntroModal(false);
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
            Active Introductions
          </span>
        </div>

        {/* Page Hero Header */}
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
              <Users size={15} />
              <span>LIVE CLIENT-TALENT INTRODUCTIONS</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', letterSpacing: '-0.02em', margin: 0 }}>
              Active Introductions
            </h1>
            <p style={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '0.9375rem', maxWidth: '680px', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Track live negotiations, contracts in escrow, and completed milestone deliveries between hiring clients and African specialists you connected.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('/messages')}
              className="rf-btn rf-btn-secondary"
              style={{ gap: '0.45rem', fontWeight: 700 }}
            >
              <MessageCircle size={15} />
              <span>Scout Chat Hub</span>
            </button>
            <button
              onClick={() => setShowNewIntroModal(true)}
              className="rf-btn rf-btn-mint"
              style={{ gap: '0.45rem', fontWeight: 800 }}
            >
              <Plus size={16} />
              <span>Log New Introduction</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
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
                Total Active Intros
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(102, 187, 42, 0.15)' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#66BB2A' : '#16A34A' }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
              {allIntroductions.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              Client-talent introductions logged
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
                Contracts In Escrow
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(56, 189, 248, 0.15)' : '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                <ShieldCheck size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#38BDF8' : '#0284C7' }}>
              ₦8,300,000
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              Locked in multi-currency Trust Vault
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
                Locked 10% Cut
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(244, 185, 66, 0.15)' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <DollarSign size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#66BB2A' : '#16A34A' }}>
              ₦830,000
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              Scout commission releasing upon milestone sign-off
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
                Closing Velocity
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(168, 85, 247, 0.15)' : '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333EA' }}>
                <TrendingUp size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
              5.4 Days
            </div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
              Average introduction-to-funded duration
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          className="rf-card"
          style={{
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
            background: isDark ? 'var(--rf-bg-card)' : '#FFFFFF',
            border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0',
            borderRadius: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'All Introductions' },
                { id: 'SCOPING', label: 'In Scoping' },
                { id: 'FUNDED', label: 'Escrow Funded' },
                { id: 'COMPLETED', label: 'Settled & Paid' },
                { id: 'PENDING', label: 'Pending Registration' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.2s ease',
                    background: statusFilter === tab.id
                      ? (isDark ? 'var(--rf-leaf-green)' : '#122B1A')
                      : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9'),
                    color: statusFilter === tab.id
                      ? (isDark ? '#07160D' : '#FFFFFF')
                      : (isDark ? '#94A3B8' : '#475569')
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
              <input
                type="text"
                className="rf-input"
                style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.8125rem' }}
                placeholder="Search client, business or talent..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Introductions Pipeline Table */}
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
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', minWidth: '850px' }}>
              <thead>
                <tr style={{ borderBottom: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid #E2E8F0', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Hiring Client & Business</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Referred Talent</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Stage Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Contract Value</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Scout Reward (10%)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Latest Activity</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIntroductions.map(intro => (
                  <tr key={intro.id} style={{ borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #F1F5F9' }}>
                    <td style={{ padding: '1.15rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: isDark ? 'var(--rf-leaf-green)' : '#16A34A'
                          }}
                        >
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>{intro.client_contact_name}</span>
                            <CountryFlag countryIsoOrName={intro.country_iso} showName={false} />
                          </div>
                          <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                            {intro.company_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1.15rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                        {intro.talent_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                        {intro.talent_role}
                      </div>
                    </td>

                    <td style={{ padding: '1.15rem 1rem' }}>
                      {intro.stage === 'FUNDED' ? (
                        <span className="rf-badge rf-badge-blue rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ShieldCheck size={12} /> Escrow Funded
                        </span>
                      ) : intro.stage === 'COMPLETED' ? (
                        <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle2 size={12} /> Settled & Paid
                        </span>
                      ) : intro.stage === 'SCOPING' ? (
                        <span className="rf-badge rf-badge-warning rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> Active Scoping
                        </span>
                      ) : (
                        <span className="rf-badge rf-badge-neutral rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> Awaiting Sign-up
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1.15rem 1rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                      {intro.deal_amount_formatted}
                    </td>

                    <td style={{ padding: '1.15rem 1rem', fontWeight: 800, color: isDark ? 'var(--rf-leaf-green)' : '#16A34A' }}>
                      {intro.scout_cut_formatted}
                    </td>

                    <td style={{ padding: '1.15rem 1rem', fontSize: '0.75rem', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '200px' }}>
                      {intro.last_activity}
                    </td>

                    <td style={{ padding: '1.15rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {intro.chat_thread_id && (
                          <button
                            onClick={() => onNavigate(`/messages?thread=${intro.chat_thread_id}`)}
                            className="rf-btn rf-btn-secondary rf-btn-sm"
                            style={{ gap: '0.35rem', padding: '0.35rem 0.65rem' }}
                            title="Open direct chat with parties"
                          >
                            <MessageCircle size={13} />
                            <span>Chat</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleCopyLink(intro.id, `INT-${intro.id}`)}
                          className="rf-btn rf-btn-ghost rf-btn-sm"
                          style={{ padding: '0.35rem', color: isDark ? '#94A3B8' : '#64748B' }}
                          title="Copy tracking link"
                        >
                          {copiedId === intro.id ? <Check size={14} color="var(--rf-leaf-green)" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 30-Day Escrow Split Guarantee Banner */}
        <div
          style={{
            background: isDark ? 'rgba(102, 187, 42, 0.08)' : '#F0FDF4',
            border: isDark ? '1px solid rgba(102, 187, 42, 0.25)' : '1px solid #BBF7D0',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            color: isDark ? '#CBD5E1' : '#166534',
            fontSize: '0.875rem'
          }}
        >
          <ShieldCheck size={28} color={isDark ? 'var(--rf-leaf-green)' : '#16A34A'} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: isDark ? '#FFFFFF' : '#14532D', fontSize: '0.9375rem' }}>Deterministic Escrow Commission Guarantee:</strong>
            <p style={{ margin: '0.25rem 0 0 0', lineHeight: 1.5 }}>
              Once you log an introduction or share your encrypted link, the client's organization is bound to your Scout profile for 30 days. When the contract is funded, Refeir automatically locks 10% of every milestone payment to your sovereign wallet, disbursed the moment work is approved.
            </p>
          </div>
        </div>
      </div>

      {/* Log New Introduction Modal */}
      {showNewIntroModal && (
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
              maxWidth: '560px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                  Log Client Introduction
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Lock your 10% commission prior to contract signing.
                </p>
              </div>
              <button
                onClick={() => setShowNewIntroModal(false)}
                className="rf-btn rf-btn-ghost rf-btn-sm"
                style={{ padding: '0.4rem', color: isDark ? '#94A3B8' : '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateIntroduction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: isDark ? '#CBD5E1' : '#334155' }}>
                  Hiring Manager / Contact Name *
                </label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  placeholder="e.g. Tunde Oladipo"
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: isDark ? '#CBD5E1' : '#334155' }}>
                  Company / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  placeholder="e.g. FlutterPay Technologies"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: isDark ? '#CBD5E1' : '#334155' }}>
                    Client Email (Optional)
                  </label>
                  <input
                    type="email"
                    className="rf-input"
                    placeholder="client@company.com"
                    value={newClientEmail}
                    onChange={e => setNewClientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: isDark ? '#CBD5E1' : '#334155' }}>
                    WhatsApp / Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    className="rf-input"
                    placeholder="+234 801 234 5678"
                    value={newClientPhone}
                    onChange={e => setNewClientPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: isDark ? '#CBD5E1' : '#334155' }}>
                  Referred Talent
                </label>
                <select
                  className="rf-input"
                  value={selectedTalentId}
                  onChange={e => setSelectedTalentId(e.target.value)}
                >
                  {talentList.slice(0, 10).map(t => (
                    <option key={t.id} value={t.id}>
                      {t.full_name} ({t.professional_title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', color: isDark ? '#CBD5E1' : '#334155' }}>
                  Estimated Contract Budget
                </label>
                <input
                  type="text"
                  className="rf-input"
                  placeholder="₦3,500,000"
                  value={estimatedBudget}
                  onChange={e => setEstimatedBudget(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewIntroModal(false)}
                  className="rf-btn rf-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rf-btn rf-btn-mint"
                  style={{ fontWeight: 800 }}
                >
                  Confirm & Generate Tracking Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
