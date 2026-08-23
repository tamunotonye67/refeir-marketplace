import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { formatMoney } from '../data/currencies';
import { CountryFlag } from '../components/common/CountryFlag';
import { PayoutModal } from '../components/wallet/PayoutModal';
import { AddPayoutMethodModal } from '../components/wallet/AddPayoutMethodModal';
import { StatementOfAccountModal } from '../components/wallet/StatementOfAccountModal';
import { ReviewModal } from '../components/marketplace/ReviewModal';
import { UserRole, ReviewType } from '../types';
import {
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Share2,
  Wallet,
  Globe2,
  Ticket,
  Percent,
  Gift,
  Building2,
  Award,
  Zap,
  Info,
  Calendar,
  FileText,
  Star,
  ThumbsUp,
  Plus,
  Trash2,
  Building,
  Smartphone,
  Coins,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RefeirProModal } from '../components/common/RefeirProModal';

interface ScoutDashboardProps {
  onNavigate: (path: string) => void;
}

export const ScoutDashboard: React.FC<ScoutDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const {
    referralsList,
    commissionsList,
    talentList,
    reviewsList,
    reviewRequestsList,
    getUserWallet,
    getActiveAirfeeToken,
    issueAirfeeToken,
    generateClientIntroLink,
    clientIntroductionsList,
    submitClientIntroduction,
    setDefaultPayoutMethod,
    deletePayoutMethod
  } = useMarketplace();
  const { showToast } = useNotification();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedClientLink, setCopiedClientLink] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showAddPayoutModal, setShowAddPayoutModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [payoutCurrency, setPayoutCurrency] = useState('NGN');
  const [showClientIntroModal, setShowClientIntroModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTargetData, setReviewTargetData] = useState<{
    id: string;
    name: string;
    role: UserRole;
    projectId?: string;
    projectTitle?: string;
    type: ReviewType;
  } | null>(null);

  const [clientIntroName, setClientIntroName] = useState('');
  const [clientIntroCompany, setClientIntroCompany] = useState('');
  const [clientIntroEmail, setClientIntroEmail] = useState('');
  const [clientIntroPhone, setClientIntroPhone] = useState('');

  const userId = currentUser ? currentUser.id : 'user-sarah';
  const scoutName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Sarah Adeyemi';
  const scoutWallet = getUserWallet(userId);
  const myReferrals = referralsList.filter(r => r.scout_id === userId);
  const myCommissions = commissionsList.filter(c => c.scout_id === userId);
  const myClientIntroductions = clientIntroductionsList.filter(i => i.scout_id === userId);
  const myEndorsementRequests = reviewRequestsList.filter(
    r => (r.target_id === userId || r.target_role === 'SCOUT') && r.status === 'PENDING'
  );

  // Active Airfee Token
  const activeAirfeeToken = getActiveAirfeeToken(userId);
  const clientIntroData = generateClientIntroLink(userId, scoutName);

  // Aggregated KPIs
  const totalReferrals = myReferrals.length;
  const activeReferrals = myReferrals.filter(r => r.status === 'ACTIVE' || r.status === 'HIRED' || r.status === 'FUNDED').length;
  const successfulReferrals = myReferrals.filter(r => r.status === 'PAID' || r.status === 'COMPLETED').length;
  const totalClicks = myReferrals.reduce((acc, r) => acc + r.clicks_count, 0);
  const conversionRate = totalClicks > 0 ? Math.round((successfulReferrals / totalClicks) * 100) : 18;

  // Primary available and pending balances
  const ngnBalance = scoutWallet.balances['NGN'] || { available_minor: 0, pending_minor: 0 };
  const ghsBalance = scoutWallet.balances['GHS'] || { available_minor: 0, pending_minor: 0 };

  const handleCopyLink = (code: string) => {
    const url = `${window.location.origin}/r/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(code);
    showToast('Referral Link Copied!', 'Share link with clients to earn locked commission upon completion.');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCopyClientIntroLink = () => {
    navigator.clipboard.writeText(clientIntroData.link);
    setCopiedClientLink(true);
    showToast(
      'Exclusive Client Introduction Link Copied!',
      'Share this with local businesses and hiring managers to earn monthly Airfee Tokens.'
    );
    setTimeout(() => setCopiedClientLink(false), 3000);
  };

  const handleSubmitClientIntro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIntroName.trim() || !clientIntroCompany.trim()) {
      showToast('Missing Fields', 'Please provide both Hiring Manager / Contact Name and Business Name.', 'WARNING');
      return;
    }

    submitClientIntroduction(
      userId,
      scoutName,
      clientIntroName,
      clientIntroCompany,
      clientIntroEmail,
      clientIntroPhone
    );

    setShowClientIntroModal(false);
    setClientIntroName('');
    setClientIntroCompany('');
    setClientIntroEmail('');
    setClientIntroPhone('');

    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 }
    });

    showToast(
      'Client Introduction Registered!',
      `Your introduction for ${clientIntroName} (${clientIntroCompany}) is queued for verification. You will be rewarded the Airfee Token once the client registers with matching details and completes a project deal on Refeir.`,
      'INFO'
    );
  };

  const handleWhatsAppShare = (ref: any) => {
    const url = `${window.location.origin}/r/${ref.referral_code}`;
    const text = `I recommend ${ref.talent_name} for your upcoming project on Refeir:\n${url}\n\n⚖️ Refeir Transparent Disclosure: I may receive a referral reward upon project completion.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Top Banner Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(36, 87, 255, 0.15) 0%, rgba(54, 224, 160, 0.15) 100%)',
          border: '1px solid rgba(54, 224, 160, 0.3)',
          borderRadius: 'var(--rf-radius-xl)',
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Sparkles size={14} />
            <span>SCOUT COMMAND CENTER</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
            YOUR NETWORK IS WORKING.
          </h1>
          <p style={{ color: 'var(--rf-cream)', fontSize: '0.9375rem', marginTop: '0.25rem', opacity: 0.9 }}>
            0% platform fee forever on 10% talent offers. Introduce local clients to earn monthly Airfee Tokens.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {currentUser?.is_pro && currentUser?.pro_tier === 'SCOUT_PRO' ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(244, 185, 66, 0.2), rgba(102, 187, 42, 0.2))',
                border: '1.5px solid #F4B942',
                borderRadius: 'var(--rf-radius-lg)',
                padding: '0.65rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <Sparkles size={18} color="#F4B942" />
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#F4B942', textTransform: 'uppercase' }}>
                  Scout Pro Active
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--rf-cream)' }}>
                  Auto +5 Airfee Tokens & 0% fee rate benefits
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowProModal(true)}
              className="rf-btn"
              style={{
                background: 'linear-gradient(135deg, #F4B942, #E5A024)',
                color: '#07160D',
                fontWeight: 800,
                border: 'none',
                gap: '0.4rem'
              }}
            >
              <Sparkles size={16} />
              <span>Upgrade to Scout Pro (Get Airfee)</span>
            </button>
          )}

          <button
            onClick={() => {
              setReviewTargetData({
                id: 'user-client-kenya',
                name: 'David Kamau',
                role: 'CLIENT',
                projectTitle: 'East Africa Logistics Engine',
                type: 'SCOUT_TO_CLIENT'
              });
              setShowReviewModal(true);
            }}
            className="rf-btn rf-btn-mint"
            style={{ gap: '0.4rem', fontWeight: 800 }}
            title="Rate client payment punctuality and release speed"
          >
            <ThumbsUp size={15} />
            <span>Rate Client</span>
          </button>

          <button
            onClick={() => {
              setReviewTargetData({
                id: 'talent-amaka-nwosu',
                name: 'Amaka Nwosu',
                role: 'TALENT',
                projectTitle: 'Senior Fintech Architecture',
                type: 'SCOUT_TO_TALENT'
              });
              setShowReviewModal(true);
            }}
            className="rf-btn rf-btn-secondary"
            style={{ gap: '0.4rem', fontWeight: 700 }}
            title="Endorse a talent on technical skills"
          >
            <Star size={15} fill="#F4B942" color="#F4B942" />
            <span>Endorse Talent</span>
          </button>

          <button
            onClick={() => setShowStatementModal(true)}
            className="rf-btn rf-btn-secondary rf-btn-lg"
            style={{ gap: '0.4rem', fontWeight: 700 }}
            title="Download Audited Statement of Account"
          >
            <FileText size={16} />
            <span>Statement</span>
          </button>

          <button
            onClick={() => onNavigate('/marketplace')}
            className="rf-btn rf-btn-mint rf-btn-lg"
          >
            <span>Find Talent to Refer</span>
          </button>
          <button
            onClick={() => onNavigate('/wallet')}
            className="rf-btn rf-btn-secondary rf-btn-lg"
            style={{ gap: '0.5rem' }}
          >
            <Wallet size={18} />
            <span>Wallet</span>
          </button>
        </div>
      </div>

      {/* PENDING ENDORSEMENT REQUESTS FROM TALENTS */}
      {myEndorsementRequests.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(244, 185, 66, 0.15) 0%, rgba(10, 26, 18, 0.9) 100%)',
            border: '1.5px solid #F4B942',
            borderRadius: 'var(--rf-radius-xl)',
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Award size={24} color="#F4B942" />
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                {myEndorsementRequests[0]?.requester_name} requested a Scout Endorsement
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)' }}>
                "{myEndorsementRequests[0]?.custom_message || 'Please endorse my profile on Refeir!'}"
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const req = myEndorsementRequests[0];
              setReviewTargetData({
                id: req.requester_id,
                name: req.requester_name,
                role: 'TALENT',
                projectTitle: req.project_title,
                type: 'SCOUT_TO_TALENT'
              });
              setShowReviewModal(true);
            }}
            className="rf-btn rf-btn-mint rf-btn-sm"
            style={{ fontWeight: 800 }}
          >
            <span>Write Endorsement</span>
          </button>
        </div>
      )}

      {/* Referrer Exclusive: Local Client Introduction & Monthly Airfee Token Hub */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: '1.5rem',
          marginBottom: '2rem',
          alignItems: 'stretch'
        }}
      >
        {/* Card 1: Exclusive Client Introduction Link */}
        <div
          className="rf-card"
          style={{
            padding: '2rem',
            background: 'radial-gradient(ellipse at top left, rgba(36, 87, 255, 0.15), transparent 70%), var(--rf-navy-surface)',
            border: '1px solid rgba(36, 87, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
            overflow: 'hidden'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="rf-badge rf-badge-blue rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Building2 size={12} /> Referrer Exclusive Feature
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', fontWeight: 700 }}>
                +1 Free Airfee Token / Client
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
              Introduce Local Clients to Refeir
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              As a verified Referrer, only you have exclusive access to copy and share local client introduction links. When you bring local recruiters or business owners onto Refeir, you receive a free <strong>Monthly Airfee Token</strong>.
            </p>

            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--rf-navy-border)',
                borderRadius: 'var(--rf-radius-md)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginBottom: '1rem',
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8125rem', color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>
                {clientIntroData.link}
              </div>
              <button
                onClick={handleCopyClientIntroLink}
                className="rf-btn rf-btn-mint rf-btn-sm"
                style={{ flexShrink: 0, width: '105px', minWidth: '105px', justifyContent: 'center', gap: '0.35rem' }}
              >
                {copiedClientLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedClientLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowClientIntroModal(true)}
              className="rf-btn rf-btn-primary rf-btn-sm"
              style={{ flex: 1, gap: '0.375rem' }}
            >
              <Gift size={14} />
              <span>Invite Local Business & Claim Token</span>
            </button>
          </div>
        </div>

        {/* Card 2: 0% Policy & Guaranteed Economics */}
        <div
          className="rf-card"
          style={{
            padding: '2rem',
            background: 'radial-gradient(ellipse at top right, rgba(54, 224, 160, 0.12), transparent 70%), var(--rf-navy-surface)',
            border: '1px solid rgba(54, 224, 160, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
            overflow: 'hidden'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Percent size={12} /> Referrer Fee Policy
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                Guaranteed Economics
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
              0% Fee Forever & Airfee Protection
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--rf-mint)" style={{ flexShrink: 0 }} />
                <span><strong>0% Platform Fee Forever:</strong> For any Talent offer rate of <strong>10% and below</strong>.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--rf-mint)" style={{ flexShrink: 0 }} />
                <span><strong>2% Airfee on &gt; 10%:</strong> Only charged on commission proceeds when talent offers exceed 10%.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket size={16} color="#7DA2FF" style={{ flexShrink: 0 }} />
                <span><strong>Monthly Airfee Token:</strong> Waives the 2% Airfee to <strong>0%</strong> for the entire month!</span>
              </div>
            </div>
          </div>

          {/* Active Token Pill */}
          <div
            style={{
              background: activeAirfeeToken
                ? 'linear-gradient(135deg, rgba(54, 224, 160, 0.15) 0%, rgba(36, 87, 255, 0.15) 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              border: activeAirfeeToken ? '1px solid rgba(54, 224, 160, 0.4)' : '1px solid var(--rf-navy-border)',
              borderRadius: 'var(--rf-radius-md)',
              padding: '0.875rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: 0
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 800, color: activeAirfeeToken ? 'var(--rf-mint)' : 'var(--rf-slate-400)' }}>
                {activeAirfeeToken ? 'Active Monthly Airfee Token' : 'No Token Active This Month'}
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeAirfeeToken ? activeAirfeeToken.code : 'Share link to unlock token'}
              </div>
            </div>

            {activeAirfeeToken && (
              <span className="rf-badge rf-badge-mint rf-text-xs" style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
                2% Airfee Waived
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DIRECT MESSAGES & SCOUT CHATTING CENTER */}
      <div
        className="rf-card"
        style={{
          padding: '1.75rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(7, 22, 13, 0.9) 0%, rgba(18, 43, 26, 0.6) 100%)',
          border: '1.5px solid rgba(102, 187, 42, 0.35)',
          borderRadius: 'var(--rf-radius-xl)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <MessageCircle size={14} />
              <span>DIRECT MESSAGES & CHATTING CENTER</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
              Scout Introductions & Referral Scoping Chats
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '0.2rem' }}>
              Click any introduction thread to open encrypted direct chat with your referred clients and talents.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/messages')}
            className="rf-btn rf-btn-mint rf-btn-sm"
            style={{ fontWeight: 800, gap: '0.4rem' }}
          >
            <MessageCircle size={14} />
            <span>Open Full Chatting Center</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '0.85rem' }}>
          <div
            onClick={() => onNavigate('/messages?thread=t2')}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
              e.currentTarget.style.background = 'rgba(102, 187, 42, 0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Tariq Al-Mansoor"
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F4B942' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.875rem', color: 'var(--rf-cream)' }}>Tariq Al-Mansoor (Cairo Logistics)</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>Yesterday</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Proposed 12% scout referral split for the upcoming Cairo smart contracts.
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('/messages?thread=t1')}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
              e.currentTarget.style.background = 'rgba(102, 187, 42, 0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="David Kamau"
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38BDF8' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.875rem', color: 'var(--rf-cream)' }}>David Kamau (SafariPay Kenya)</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>10:42 AM</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Referred by Kwame. Escrow funded for mobile wallet architecture.
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('/messages?thread=t3')}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--rf-leaf-green)';
              e.currentTarget.style.background = 'rgba(102, 187, 42, 0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
                border: '2px solid #38BDF8',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.875rem', color: 'var(--rf-cream)' }}>Refeir Sovereign Trust Desk</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>2 days ago</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Your 10% scout referral commissions are locked and verified.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AIRFEE TOKEN BALANCE & USAGE LEVELS STATION */}
      <div
        className="rf-card"
        style={{
          padding: '2rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(10, 35, 25, 0.95) 0%, rgba(7, 22, 13, 0.95) 100%)',
          border: '1.5px solid rgba(54, 224, 160, 0.35)',
          borderRadius: 'var(--rf-radius-xl)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Ticket size={13} />
                <span>AIRFEE TOKENS & YIELD STATION</span>
              </span>
              <span className="rf-badge rf-badge-blue rf-text-xs">
                {currentUser?.is_pro ? 'Scout Pro Tier Active' : 'Starter Scout Tier'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              Airfee Token Balance & Yield Protection Levels
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
              Track your token balance, active fee shields, and yield maximization status across all African referrals.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowClientIntroModal(true)}
              className="rf-btn rf-btn-mint rf-btn-sm"
              style={{ fontWeight: 800, gap: '0.35rem' }}
            >
              <Gift size={14} />
              <span>+ Claim Token (Invite Client)</span>
            </button>
            {!currentUser?.is_pro && (
              <button
                onClick={() => setShowProModal(true)}
                className="rf-btn rf-btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #F4B942, #E5A024)',
                  color: '#07160D',
                  fontWeight: 800,
                  border: 'none',
                  gap: '0.35rem'
                }}
              >
                <Sparkles size={14} />
                <span>Get 5 Tokens with Scout Pro</span>
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Box 1: Token Balance */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--rf-navy-border)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.25rem'
            }}
          >
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
              Available Airfee Token Balance
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--rf-mint)', letterSpacing: '-0.02em' }}>
                {currentUser?.is_pro ? '5' : '2'}
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--rf-cream)', fontWeight: 700 }}>
                Tokens in Vault
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={13} color="var(--rf-mint)" />
              <span>1 Active Token this month • {currentUser?.is_pro ? '4' : '1'} in Reserve</span>
            </div>
          </div>

          {/* Box 2: Protection & Usage Level */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--rf-navy-border)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.25rem'
            }}
          >
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
              Current Protection & Usage Level
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7DA2FF' }}>
                Level 3 Shield
              </span>
            </div>
            <div style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #7DA2FF, var(--rf-mint))', height: '100%', width: '100%', borderRadius: '100px' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', marginTop: '0.4rem', fontWeight: 700 }}>
              100% Platform Fee Shielded (0% Fee Active)
            </div>
          </div>

          {/* Box 3: Cumulative Savings */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--rf-navy-border)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.25rem'
            }}
          >
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
              Total Airfee Saved to Date
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                ₦180,000
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                ($220 USD equiv.)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '0.35rem' }}>
              Saved via 0% standard rule & Airfee Token waivers
            </div>
          </div>
        </div>

        {/* Detailed Token Inventory & Scope Breakdown */}
        <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="var(--rf-mint)" />
              <span style={{ color: 'var(--rf-cream)', fontWeight: 700 }}>
                Active Token: <code style={{ color: 'var(--rf-mint)' }}>{activeAirfeeToken ? activeAirfeeToken.code : 'RF-AIRTOKEN-2026-08'}</code>
              </span>
              <span style={{ color: 'var(--rf-slate-400)' }}>| Scope: August 2026 (Valid through Aug 31)</span>
            </div>
            <div style={{ color: 'var(--rf-mint)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} />
              <span>Next token automated grant: September 1, 2026</span>
            </div>
          </div>
        </div>

        {/* Client Introductions Verification Queue */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Your Client Introductions & Token Verification Queue
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '0.2rem 0 0 0' }}>
                Hiring Manager and Company names must match. Tokens are awarded after the client completes their first project deal.
              </p>
            </div>
            <span className="rf-badge rf-badge-blue rf-text-xs">
              {myClientIntroductions.length} Total Logged
            </span>
          </div>

          {myClientIntroductions.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--rf-navy-border)', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Client Contact</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Business Name</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Registration</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Project Deal Status</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Airfee Token Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myClientIntroductions.map(intro => (
                    <tr key={intro.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                        {intro.client_contact_name}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--rf-slate-200)' }}>
                        {intro.company_name}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {intro.has_registered ? (
                          <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Check size={11} /> Registered
                          </span>
                        ) : (
                          <span className="rf-badge rf-badge-warning rf-text-xs">
                            Not Registered Yet
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {intro.has_closed_deal ? (
                          <div style={{ color: 'var(--rf-mint)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <CheckCircle2 size={13} />
                            <span>Deal Closed ({intro.deal_amount_formatted || 'Completed'})</span>
                          </div>
                        ) : intro.has_registered ? (
                          <span style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>
                            Awaiting First Hire
                          </span>
                        ) : (
                          <span style={{ color: 'var(--rf-slate-500)', fontSize: '0.75rem' }}>
                            No Activity (Scout Gets Nothing)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {intro.status === 'VERIFIED_GRANTED' ? (
                          <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Ticket size={11} /> Token Awarded ({intro.granted_token_code})
                          </span>
                        ) : intro.status === 'HIRE_COMPLETED_PENDING_ADMIN' ? (
                          <span className="rf-badge rf-badge-blue rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={11} /> Ready for Admin Review
                          </span>
                        ) : intro.status === 'REJECTED' ? (
                          <span className="rf-badge rf-badge-error rf-text-xs">
                            Claim Rejected
                          </span>
                        ) : (
                          <span className="rf-badge rf-badge-warning rf-text-xs">
                            Pending Client Hire
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--rf-slate-400)', fontSize: '0.8125rem' }}>
              No local client introductions logged yet. Click "+ Claim Token (Invite Client)" to register your first business contact.
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="rf-grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Successful Referrals
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
            {successfulReferrals > 0 ? successfulReferrals : 18}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckCircle2 size={13} /> {activeReferrals} in-progress engagements
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Projects Value Generated
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
            ₦12.4M
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
            Across 4 African countries
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.5rem', borderColor: 'rgba(54, 224, 160, 0.4)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-mint)' }}>
            Available Commissions
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '0.25rem' }}>
            {formatMoney({ amount_minor: ngnBalance.available_minor, currency: 'NGN' })}
          </div>
          <button
            onClick={() => {
              setPayoutCurrency('NGN');
              setShowPayoutModal(true);
            }}
            className="rf-btn rf-btn-mint rf-btn-sm"
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            <span>Request Payout</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Introduction Conversion
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7DA2FF', marginTop: '0.25rem' }}>
            {conversionRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
            {totalClicks > 0 ? totalClicks : 86} referral link views
          </div>
        </div>
      </div>

      {/* Active Referrals Table */}
      <div className="rf-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              Your Active Referral Links & Attribution
            </h3>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem' }}>
              Every link is protected by a 30-day deterministic attribution lock. 0% platform fee on &le; 10% rates.
            </p>
          </div>
        </div>

        {myReferrals.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--rf-navy-border)', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Talent / Service</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Reward %</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Airfee Rate</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Potential Reward</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Clicks</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>1-Click Share</th>
                </tr>
              </thead>
              <tbody>
                {myReferrals.map(ref => {
                  const isAboveTen = ref.locked_referral_percentage > 10;
                  const airfeeLabel = !isAboveTen
                    ? '0% (Forever)'
                    : activeAirfeeToken
                    ? '0% (Token Active)'
                    : '2% Airfee';

                  return (
                    <tr key={ref.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '1rem', fontFamily: 'var(--rf-font-mono)', fontWeight: 700, color: 'var(--rf-mint)' }}>
                        {ref.referral_code}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{ref.talent_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                          {ref.service_title || 'General Introduction'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                        {ref.locked_referral_percentage}%
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`rf-badge rf-text-xs ${!isAboveTen || activeAirfeeToken ? 'rf-badge-mint' : 'rf-badge-warning'}`}>
                          {airfeeLabel}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--rf-mint)' }}>
                        {formatMoney(ref.potential_reward)}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--rf-slate-300)' }}>
                        {ref.clicks_count}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`rf-badge rf-text-xs ${
                          ref.status === 'PAID' ? 'rf-badge-mint' : ref.status === 'FUNDED' || ref.status === 'ACTIVE' ? 'rf-badge-blue' : 'rf-badge-warning'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <button
                            onClick={() => handleWhatsAppShare(ref)}
                            className="rf-btn rf-btn-sm"
                            style={{ backgroundColor: '#25D366', color: '#FFF', padding: '0.375rem 0.625rem' }}
                            title="Share Link on WhatsApp with Client"
                          >
                            <MessageCircle size={14} />
                            <span>Share</span>
                          </button>
                          <button
                            onClick={() => handleCopyLink(ref.referral_code)}
                            className="rf-btn rf-btn-secondary rf-btn-sm"
                            title="Copy Link"
                            style={{ width: '36px', minWidth: '36px', padding: 0, justifyContent: 'center' }}
                          >
                            {copiedId === ref.referral_code ? <Check size={14} color="var(--rf-mint)" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--rf-slate-400)' }}>
            <p style={{ marginBottom: '1rem' }}>You haven't generated any referral links yet.</p>
            <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-primary">
              Browse Talent to Refer
            </button>
          </div>
        )}
      </div>

      {/* Linked Payout Methods (Section 38 & 39) */}
      <div className="rf-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Linked Commission Payout Channels
              </h3>
              <span className="rf-badge rf-badge-mint rf-text-xs">
                {scoutWallet.payout_methods.length} Active
              </span>
            </div>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Direct bank accounts, mobile money, or stablecoin addresses where your referral commission earnings are disbursed.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowAddPayoutModal(true)}
              className="rf-btn rf-btn-mint rf-btn-sm"
              style={{ fontWeight: 800, gap: '0.45rem', padding: '0.55rem 1.15rem' }}
            >
              <Plus size={15} />
              <span>Link Payout Channel</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/wallet')}
              className="rf-btn rf-btn-ghost rf-btn-sm"
              style={{ gap: '0.35rem', color: 'var(--rf-slate-300)' }}
            >
              <span>Full Wallet</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {scoutWallet.payout_methods.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed var(--rf-navy-border)',
              borderRadius: 'var(--rf-radius-lg)'
            }}
          >
            <Building size={32} color="var(--rf-slate-400)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>
              No Payout Channels Configured
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
              Link your local bank account, mobile money wallet (M-Pesa, MTN MoMo), or USDT/USDC address to receive instant referral earnings.
            </p>
            <button
              type="button"
              onClick={() => setShowAddPayoutModal(true)}
              className="rf-btn rf-btn-primary rf-btn-sm"
              style={{ fontWeight: 800 }}
            >
              <Plus size={14} />
              <span>Add Your Preferred Payout Channel</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {scoutWallet.payout_methods.map(pm => (
              <div
                key={pm.id}
                style={{
                  background: 'var(--rf-navy-surface)',
                  border: `1.5px solid ${pm.is_default ? 'rgba(102, 187, 42, 0.5)' : 'var(--rf-navy-border)'}`,
                  borderRadius: 'var(--rf-radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: pm.is_default ? 'rgba(102, 187, 42, 0.18)' : 'rgba(54, 224, 160, 0.12)',
                      border: `1px solid ${pm.is_default ? 'rgba(102, 187, 42, 0.35)' : 'rgba(54, 224, 160, 0.25)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {pm.type === 'MOBILE_MONEY' ? (
                      <Smartphone size={22} color="var(--rf-leaf-green)" />
                    ) : pm.type === 'OTHER' ? (
                      <Coins size={22} color="var(--rf-golden-yellow)" />
                    ) : (
                      <Building size={22} color="var(--rf-leaf-green)" />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--rf-cream)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pm.institution_name}
                      </span>
                      {pm.is_default && (
                        <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Star size={10} fill="currentColor" />
                          <span>Primary Payout</span>
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', fontFamily: 'var(--rf-font-mono)', marginTop: '3px' }}>
                      {pm.masked_identifier}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                      {pm.account_holder_name} • <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 700 }}>{pm.currency} ({pm.country})</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Channel Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem' }}>
                  {!pm.is_default ? (
                    <button
                      type="button"
                      onClick={() => setDefaultPayoutMethod(userId, pm.id)}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--rf-leaf-green)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: 0
                      }}
                    >
                      <Star size={12} />
                      <span>Set as Default</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={12} color="var(--rf-leaf-green)" />
                      <span>Preferred Destination</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => deletePayoutMethod(userId, pm.id)}
                    title="Remove Payout Channel"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--rf-slate-400)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#EF4444';
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--rf-slate-400)';
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <PayoutModal
          userId={userId}
          currency={payoutCurrency}
          availableMinor={scoutWallet.balances[payoutCurrency]?.available_minor || 0}
          payoutMethods={scoutWallet.payout_methods}
          onClose={() => setShowPayoutModal(false)}
          onSuccess={() => setShowPayoutModal(false)}
        />
      )}

      {/* INVITE LOCAL BUSINESS CLIENT & VERIFICATION CLAIM MODAL */}
      {showClientIntroModal && (
        <div className="rf-modal-backdrop" onClick={() => setShowClientIntroModal(false)}>
          <div className="rf-modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(36, 87, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={20} color="#7DA2FF" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Introduce Local Client to Refeir
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
                  Enter hiring manager and business details to register client introduction.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitClientIntro}>
              <div className="rf-form-group">
                <label className="rf-label">Client / Hiring Manager Name *</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={clientIntroName}
                  onChange={e => setClientIntroName(e.target.value)}
                  placeholder="e.g. Tunde Bakare (Must match their registered profile)"
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Business / Company Name *</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={clientIntroCompany}
                  onChange={e => setClientIntroCompany(e.target.value)}
                  placeholder="e.g. Apex Fintech Africa (Must match company name)"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="rf-form-group">
                  <label className="rf-label">Work Email (Optional)</label>
                  <input
                    type="email"
                    className="rf-input"
                    value={clientIntroEmail}
                    onChange={e => setClientIntroEmail(e.target.value)}
                    placeholder="tunde@company.com"
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Phone / WhatsApp (Optional)</label>
                  <input
                    type="tel"
                    className="rf-input"
                    value={clientIntroPhone}
                    onChange={e => setClientIntroPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                  />
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(36, 87, 255, 0.08)',
                  border: '1px solid rgba(36, 87, 255, 0.25)',
                  borderRadius: 'var(--rf-radius-md)',
                  padding: '1rem',
                  fontSize: '0.8125rem',
                  color: '#93C5FD',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={14} color="var(--rf-mint)" />
                  <span>Refeir Verification & Token Policy</span>
                </div>
                Airfee Tokens are not awarded automatically upon submission. The local client must click your link, register with matching Hiring Manager and Business names, and complete a project deal with a talent. Once verified, Refeir Admin will confirm and award your Monthly Airfee Token. If the client does not hire, no token is issued.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowClientIntroModal(false)}
                  className="rf-btn rf-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rf-btn rf-btn-primary"
                  style={{ flex: 1, gap: '0.375rem' }}
                >
                  <Ticket size={15} />
                  <span>Register Client Intro</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFEIR PRO UPGRADE MODAL */}
      <RefeirProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        defaultRole="SCOUT"
      />

      {/* STATEMENT OF ACCOUNT MODAL */}
      {showStatementModal && (
        <StatementOfAccountModal
          user={currentUser}
          onClose={() => setShowStatementModal(false)}
          onOpenTaxSettings={() => {
            setShowStatementModal(false);
            onNavigate('/settings/account');
          }}
        />
      )}

      {/* SCOUT REVIEW MODAL */}
      {reviewTargetData && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setReviewTargetData(null);
          }}
          targetId={reviewTargetData.id}
          targetName={reviewTargetData.name}
          targetRole={reviewTargetData.role}
          projectId={reviewTargetData.projectId}
          projectTitle={reviewTargetData.projectTitle}
          defaultReviewType={reviewTargetData.type}
        />
      )}

      {/* ADD PAYOUT CHANNEL MODAL */}
      <AddPayoutMethodModal
        userId={userId}
        isOpen={showAddPayoutModal}
        onClose={() => setShowAddPayoutModal(false)}
      />
    </div>
  );
};
