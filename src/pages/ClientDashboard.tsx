import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { formatMoney, createMoney } from '../data/currencies';
import { CountryFlag } from '../components/common/CountryFlag';
import { RefeirProModal } from '../components/common/RefeirProModal';
import { StatementOfAccountModal } from '../components/wallet/StatementOfAccountModal';
import { ClientReputationScorecard } from '../components/marketplace/ClientReputationScorecard';
import { ReviewModal } from '../components/marketplace/ReviewModal';
import { Deliverable } from '../types';
import {
  ShieldCheck,
  Briefcase,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  Headphones,
  Star,
  Send,
  X,
  MessageSquare,
  Zap,
  Check,
  GitPullRequest,
  Layout,
  ExternalLink,
  Download,
  RefreshCw,
  FileCode,
  Package,
  Eye,
  AlertCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClientDashboardProps {
  onNavigate: (path: string) => void;
  onOpenProject: (projectId: string) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  onNavigate,
  onOpenProject
}) => {
  const { currentUser } = useAuth();
  const {
    projectsList,
    jobsList,
    talentList,
    reviewsList,
    reviewRequestsList,
    approveMilestone,
    requestMilestoneRevision,
    getClientScorecard,
    getReviewsForTarget
  } = useMarketplace();
  const { showToast } = useNotification();

  const [showProModal, setShowProModal] = useState(false);
  const [showDeskRequestModal, setShowDeskRequestModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTalentForReview, setSelectedTalentForReview] = useState<{ id: string; name: string; projectId?: string; projectTitle?: string } | null>(null);

  const [deskProjectTitle, setDeskProjectTitle] = useState('');
  const [deskSkills, setDeskSkills] = useState('');
  const [deskBudget, setDeskBudget] = useState('800000');
  const [deskCurrency, setDeskCurrency] = useState('NGN');
  const [deskUrgency, setDeskUrgency] = useState('Immediate (<24h)');
  const [deskNotes, setDeskNotes] = useState('');

  // Deliverable revision modal state
  const [selectedDeliverableForRevision, setSelectedDeliverableForRevision] = useState<{
    deliverable: Deliverable;
    projectId: string;
    milestoneId: string;
  } | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  const userId = currentUser ? currentUser.id : 'user-client-kenya';
  const myProjects = projectsList.filter(p => p.client_id === 'user-client-kenya' || p.client_id === userId);
  const myJobs = jobsList.filter(j => j.client_id === 'user-client-kenya' || j.client_id === userId);
  const myPendingReviewRequests = reviewRequestsList.filter(
    r => (r.target_id === userId || r.target_id === 'user-client-kenya') && r.status === 'PENDING'
  );

  // Collect all deliverables submitted by talent across client projects
  const clientDeliverables = myProjects.flatMap(proj => {
    return (proj.deliverables || []).map(del => {
      const ms = proj.milestones.find(m => m.id === del.milestone_id);
      return {
        ...del,
        project_id: proj.id,
        project_title: proj.title,
        talent_name: proj.talent_name,
        talent_avatar: proj.talent_avatar,
        talent_country: proj.talent_country,
        milestone: ms
      };
    });
  });

  const isClientPro = currentUser?.is_pro && (currentUser?.pro_tier === 'CLIENT_PRO' || currentUser?.refeir_desk_enabled);

  // Refeir Desk exclusively recommends talents who enrolled in Featured Talent Pro
  const proTalentsForDesk = talentList.filter(t => t.is_pro || t.is_featured);

  const deskRecommendations = proTalentsForDesk.map((t, idx) => ({
    id: `desk-rec-${t.id}`,
    talent_id: t.id,
    talent_name: t.full_name,
    talent_avatar: t.avatar_url,
    headline: t.headline,
    country_name: t.country_name,
    match_score: 99 - (idx * 3),
    hourly_or_fixed: `${formatMoney(t.starting_price)} / milestone`,
    scout_name: idx === 0 ? 'Sarah Adeyemi (Elite Scout)' : idx === 1 ? 'Kofi Boateng (Tech Connector)' : 'Refeir Desk Lead',
    endorsement_note: `Enrolled in Featured Talent Pro. Top vetted rating (${t.rating}/5.0) across ${t.completed_projects} completed milestones.`,
    availability: t.availability
  }));

  const handleApproveDeliverableMilestone = (projectId: string, milestoneId: string, deliverableTitle: string) => {
    approveMilestone(projectId, milestoneId);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}
    showToast(
      'Milestone Deliverable Approved!',
      `You signed off on "${deliverableTitle}". Escrow funds have been successfully released to the talent.`,
      'SUCCESS'
    );
  };

  const handleRequestRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverableForRevision || !revisionNotes.trim()) return;

    requestMilestoneRevision(
      selectedDeliverableForRevision.projectId,
      selectedDeliverableForRevision.milestoneId,
      selectedDeliverableForRevision.deliverable.id,
      revisionNotes.trim()
    );

    setSelectedDeliverableForRevision(null);
    setRevisionNotes('');
    showToast(
      'Revision Brief Dispatched',
      'The talent has been notified to make adjustments and re-submit the updated deliverables.',
      'INFO'
    );
  };

  const handleDownloadAsset = (fileName: string) => {
    showToast('Secure Download Initiated', `Downloading ${fileName || 'deliverables_package.zip'} from Refeir Trust Vault...`, 'SUCCESS');
  };

  const handleDeskRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskProjectTitle.trim()) return;

    setShowDeskRequestModal(false);
    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}

    showToast(
      'Refeir Desk Brief Dispatched!',
      'Our dedicated talent sourcing leads are curating pre-vetted recommendations for your project. Expect your delivery in under 24h.'
    );

    setDeskProjectTitle('');
    setDeskSkills('');
    setDeskNotes('');
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-blue)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <ShieldCheck size={14} />
            <span>CLIENT HUB</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
            Hire Across Africa with Payment Protection.
          </h1>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Your payments are securely held in milestone custody until you approve delivered work.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {isClientPro ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(125, 162, 255, 0.2), rgba(79, 123, 240, 0.15))',
                border: '1.5px solid #7DA2FF',
                borderRadius: 'var(--rf-radius-lg)',
                padding: '0.65rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <Headphones size={18} color="#7DA2FF" />
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#7DA2FF', textTransform: 'uppercase' }}>
                  Refeir Desk VIP Active
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--rf-cream)' }}>
                  Direct Concierge Recommendations Enabled
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowProModal(true)}
              className="rf-btn"
              style={{
                background: 'linear-gradient(135deg, #7DA2FF, #4F7BF0)',
                color: '#FFFFFF',
                fontWeight: 800,
                border: 'none',
                gap: '0.4rem'
              }}
            >
              <Headphones size={16} />
              <span>Unlock Refeir Desk Recommendations</span>
            </button>
          )}

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
            className="rf-btn rf-btn-primary rf-btn-lg"
            style={{ gap: '0.5rem' }}
          >
            <span>Find Talent</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onNavigate('/jobs')}
            className="rf-btn rf-btn-secondary rf-btn-lg"
          >
            <span>Post a Job</span>
          </button>
        </div>
      </div>

      {/* CLIENT REPUTATION SCORECARD & TRUST METRICS */}
      <div style={{ marginBottom: '2.5rem' }}>
        <ClientReputationScorecard
          clientId={userId}
          clientName={currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'David Kamau (East Africa Freight)'}
          showReviewsList={true}
        />
      </div>

      {/* PENDING REVIEW REQUESTS FROM TALENTS BANNER */}
      {myPendingReviewRequests.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(244, 185, 66, 0.15) 0%, rgba(10, 26, 18, 0.9) 100%)',
            border: '1.5px solid #F4B942',
            borderRadius: 'var(--rf-radius-xl)',
            padding: '1.5rem 2rem',
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(244, 185, 66, 0.2)',
                border: '1.5px solid #F4B942',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F4B942',
                flexShrink: 0
              }}
            >
              <Star size={22} fill="#F4B942" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: '0 0 0.25rem 0' }}>
                {myPendingReviewRequests.length} Talent Review Request(s) Awaiting Your Feedback
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
                {myPendingReviewRequests[0]?.requester_name} has requested a performance review for <em>{myPendingReviewRequests[0]?.project_title}</em>.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const req = myPendingReviewRequests[0];
              setSelectedTalentForReview({
                id: req.requester_id,
                name: req.requester_name,
                projectId: req.project_id,
                projectTitle: req.project_title
              });
              setShowReviewModal(true);
            }}
            className="rf-btn"
            style={{
              background: 'linear-gradient(135deg, #F4B942, #E5A024)',
              color: '#07160D',
              fontWeight: 800,
              padding: '0.65rem 1.25rem',
              border: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Write Talent Review →</span>
          </button>
        </div>
      )}

      {/* REFEIR DESK DIRECT RECOMMENDATIONS SECTION */}
      <div
        className="rf-card"
        style={{
          padding: '2rem',
          marginBottom: '2.5rem',
          border: isClientPro ? '1.5px solid rgba(125, 162, 255, 0.4)' : '1px solid var(--rf-navy-border)',
          background: 'linear-gradient(180deg, rgba(15, 35, 60, 0.4) 0%, var(--rf-navy-surface) 100%)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="rf-badge rf-badge-blue rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Headphones size={13} />
                <span>REFEIR DESK DIRECT RECOMMENDATIONS</span>
              </span>
              <span className="rf-badge rf-badge-mint rf-text-xs">
                Hand-Picked by Elite Scouts
              </span>
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              Curated Talent Matching from Refeir Desk
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
              Pre-vetted professionals endorsed by top African scouts for your project scope.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isClientPro ? (
              <button
                onClick={() => setShowDeskRequestModal(true)}
                className="rf-btn rf-btn-mint rf-btn-sm"
                style={{ fontWeight: 800, gap: '0.4rem' }}
              >
                <Plus size={15} />
                <span>Request Custom Recommendation</span>
              </button>
            ) : (
              <button
                onClick={() => setShowProModal(true)}
                className="rf-btn rf-btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #7DA2FF, #4F7BF0)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  border: 'none',
                  gap: '0.4rem'
                }}
              >
                <Sparkles size={14} />
                <span>Upgrade to Refeir Desk Pro</span>
              </button>
            )}
          </div>
        </div>

        {/* If not Pro, show VIP Pro Gate Banner */}
        {!isClientPro && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(125, 162, 255, 0.12) 0%, rgba(15, 35, 60, 0.8) 100%)',
              border: '1.5px solid rgba(125, 162, 255, 0.4)',
              borderRadius: 'var(--rf-radius-lg)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Headphones size={18} color="#7DA2FF" />
                <span>Refeir Desk VIP Recommendations (Pro Feature)</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', margin: '0.35rem 0 0 0' }}>
                Only talents enrolled in <strong>Featured Talent Pro</strong> are recommended here. Upgrade to Refeir Desk Pro ($49/mo) to unlock direct scout-endorsed introductions and dedicated matching in &lt;24 hours.
              </p>
            </div>
            <button
              onClick={() => setShowProModal(true)}
              className="rf-btn"
              style={{
                background: 'linear-gradient(135deg, #7DA2FF, #4F7BF0)',
                color: '#FFFFFF',
                fontWeight: 800,
                border: 'none',
                gap: '0.4rem'
              }}
            >
              <Sparkles size={14} />
              <span>Unlock Refeir Desk</span>
            </button>
          </div>
        )}

        {/* Recommendations Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {deskRecommendations.map(rec => (
            <div
              key={rec.id}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(125, 162, 255, 0.25)',
                borderRadius: 'var(--rf-radius-xl)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {/* Match Score Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(102, 187, 42, 0.18)',
                  border: '1px solid rgba(102, 187, 42, 0.4)',
                  color: 'var(--rf-mint)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Sparkles size={12} />
                <span>{rec.match_score}% Refeir Match</span>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1rem' }}>
                  <img
                    src={rec.talent_avatar}
                    alt={rec.talent_name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7DA2FF' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                      {rec.talent_name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                      <CountryFlag countryIsoOrName={rec.country_name} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>{rec.country_name}</span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                  {rec.headline}
                </div>

                <div
                  style={{
                    background: 'rgba(125, 162, 255, 0.08)',
                    borderLeft: '3px solid #7DA2FF',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0 var(--rf-radius-sm) var(--rf-radius-sm) 0',
                    fontSize: '0.75rem',
                    color: 'var(--rf-slate-300)',
                    lineHeight: 1.5,
                    marginBottom: '1rem'
                  }}
                >
                  <strong style={{ color: '#7DA2FF' }}>Refeir Desk Note:</strong> {rec.endorsement_note}
                  <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                    Endorsed by: <strong>{rec.scout_name}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)' }}>Estimated Rate</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{rec.hourly_or_fixed}</div>
                </div>

                <button
                  onClick={() => {
                    showToast('Invitation Dispatched!', `Refeir Desk connected your project brief with ${rec.talent_name}. Milestone workspace initiated.`);
                  }}
                  className="rf-btn rf-btn-primary rf-btn-sm"
                  style={{ fontWeight: 700 }}
                >
                  <span>Hire Trusted Talent</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="rf-grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Active Protected Projects
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
            {myProjects.length || 1}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldCheck size={13} /> 100% Trust Vault Protected
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Total Value Completed
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
            ₦1.05M
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
            Delivered without dispute
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Active Job Postings
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7DA2FF', marginTop: '0.25rem' }}>
            {myJobs.length || 1} Jobs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
            7 proposals received
          </div>
        </div>
      </div>

      {/* DIRECT MESSAGES & PROJECT CHATTING CENTER */}
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
              <MessageSquare size={14} />
              <span>DIRECT MESSAGES & CHATTING CENTER</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
              Live Project Scoping & Talent Negotiations
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '0.2rem' }}>
              Click any conversation to open encrypted direct messaging with your talents and scout connectors.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/messages')}
            className="rf-btn rf-btn-mint rf-btn-sm"
            style={{ fontWeight: 800, gap: '0.4rem' }}
          >
            <MessageSquare size={14} />
            <span>Open Full Chatting Center</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '0.85rem' }}>
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
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              alt="Amaka Nwosu"
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--rf-leaf-green)' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.875rem', color: 'var(--rf-cream)' }}>Amaka Nwosu (Lead Talent)</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>10:42 AM</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                The escrow milestone of $3,400 has been funded. Wireframes look fantastic!
              </p>
            </div>
          </div>

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
              alt="Sarah Adeyemi"
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38BDF8' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.875rem', color: 'var(--rf-cream)' }}>Sarah Adeyemi (Scout Matcher)</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>Yesterday</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Connecting you with verified senior engineers across West Africa...
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
                <strong style={{ fontSize: '0.875rem', color: 'var(--rf-cream)' }}>Refeir Trust Desk</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>2 days ago</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Your enterprise payment escrow custody is active & audited.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DELIVERABLES & MILESTONE SUBMISSIONS CONSOLE (CLIENT REVIEW HUB) */}
      <div className="rf-card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1.5px solid var(--rf-navy-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Package size={13} />
                <span>ACTIVE CLIENT DELIVERABLES</span>
              </span>
              <span className="rf-badge rf-badge-blue rf-text-xs">
                {clientDeliverables.length} Submissions
              </span>
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              Milestone Deliverables & Work Inspection
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
              Review design files, test repositories, download APK builds, and sign off milestones to release escrow.
            </p>
          </div>
        </div>

        {clientDeliverables.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {clientDeliverables.map(del => {
              const isApproved = del.status === 'APPROVED' || del.milestone?.status === 'APPROVED' || del.milestone?.status === 'RELEASED';
              return (
                <div
                  key={del.id}
                  style={{
                    background: 'var(--rf-navy-surface)',
                    border: isApproved ? '1px solid rgba(102, 187, 42, 0.3)' : '1px solid rgba(125, 162, 255, 0.3)',
                    borderRadius: 'var(--rf-radius-xl)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img
                        src={del.talent_avatar}
                        alt={del.talent_name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                            {del.title}
                          </h4>
                          <span
                            className={`rf-badge rf-text-xs ${
                              isApproved
                                ? 'rf-badge-mint'
                                : del.status === 'REVISION_REQUESTED'
                                ? 'rf-badge-warning'
                                : 'rf-badge-blue'
                            }`}
                          >
                            {isApproved ? 'APPROVED & RELEASED' : del.status === 'REVISION_REQUESTED' ? 'REVISION REQUESTED' : 'PENDING CLIENT SIGN-OFF'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>Talent: <strong>{del.talent_name}</strong></span>
                          <span>•</span>
                          <span>Project: <em>{del.project_title}</em></span>
                          {del.milestone && (
                            <>
                              <span>•</span>
                              <span style={{ color: 'var(--rf-mint)', fontWeight: 700 }}>
                                Escrow: {formatMoney(del.milestone.amount)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons on deliverable */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {!isApproved && del.milestone && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedDeliverableForRevision({
                                deliverable: del,
                                projectId: del.project_id,
                                milestoneId: del.milestone?.id || del.milestone_id || ''
                              });
                              setRevisionNotes('');
                            }}
                            className="rf-btn rf-btn-secondary rf-btn-sm"
                            style={{ gap: '0.35rem' }}
                          >
                            <RefreshCw size={13} />
                            <span>Request Revision</span>
                          </button>

                          <button
                            onClick={() => handleApproveDeliverableMilestone(del.project_id, del.milestone?.id || del.milestone_id || '', del.title)}
                            className="rf-btn rf-btn-mint rf-btn-sm"
                            style={{ fontWeight: 800, gap: '0.35rem' }}
                          >
                            <Check size={14} />
                            <span>Sign-Off & Release Escrow</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onOpenProject(del.project_id)}
                        className="rf-btn rf-btn-ghost rf-btn-sm"
                        style={{ gap: '0.35rem', color: 'var(--rf-slate-300)' }}
                      >
                        <span>Workspace</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>
                    {del.message}
                  </p>

                  {/* Revision notes display if active */}
                  {del.revision_notes && (
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: 'var(--rf-radius-md)',
                        padding: '0.75rem 1rem',
                        fontSize: '0.8125rem',
                        color: '#FDE68A'
                      }}
                    >
                      <strong>Your Revision Request:</strong> {del.revision_notes}
                    </div>
                  )}

                  {/* Interactive Resource Link Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {del.github_pr_url && (
                      <a
                        href={del.github_pr_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rf-btn rf-btn-secondary rf-btn-sm"
                        style={{ gap: '0.375rem', fontSize: '0.75rem' }}
                      >
                        <GitPullRequest size={13} />
                        <span>Inspect GitHub PR</span>
                        <ExternalLink size={11} />
                      </a>
                    )}

                    {del.figma_url && (
                      <a
                        href={del.figma_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rf-btn rf-btn-secondary rf-btn-sm"
                        style={{ gap: '0.375rem', fontSize: '0.75rem' }}
                      >
                        <Layout size={13} />
                        <span>Open Figma Prototype</span>
                        <ExternalLink size={11} />
                      </a>
                    )}

                    {del.staging_url && (
                      <a
                        href={del.staging_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rf-btn rf-btn-secondary rf-btn-sm"
                        style={{ gap: '0.375rem', fontSize: '0.75rem' }}
                      >
                        <ExternalLink size={13} />
                        <span>Launch Staging Preview</span>
                      </a>
                    )}

                    {del.apk_download_url && (
                      <a
                        href={del.apk_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownloadAsset('Android_APK_v1.0.apk');
                        }}
                        className="rf-btn rf-btn-secondary rf-btn-sm"
                        style={{ gap: '0.375rem', fontSize: '0.75rem' }}
                      >
                        <Download size={13} />
                        <span>Download Android APK</span>
                      </a>
                    )}

                    {del.file_name && (
                      <button
                        onClick={() => handleDownloadAsset(del.file_name || 'delivery_file.zip')}
                        className="rf-btn rf-btn-secondary rf-btn-sm"
                        style={{ gap: '0.375rem', fontSize: '0.75rem' }}
                      >
                        <Download size={13} />
                        <span>{del.file_name}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--rf-slate-400)' }}>
            <Package size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>No pending milestone deliverables currently waiting for sign-off.</p>
          </div>
        )}
      </div>

      {/* Projects List */}
      <div className="rf-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
          Your Hired African Engagements
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myProjects.map(proj => (
            <div
              key={proj.id}
              style={{
                background: 'var(--rf-navy-surface)',
                border: '1px solid var(--rf-navy-border)',
                borderRadius: 'var(--rf-radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
                <img
                  src={proj.talent_avatar}
                  alt={proj.talent_name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                    {proj.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '0.25rem' }}>
                    <span>Talent: {proj.talent_name}</span>
                    <CountryFlag countryIsoOrName={proj.talent_country} />
                    {proj.scout_name && (
                      <span style={{ color: 'var(--rf-mint)' }}>• Recommended by {proj.scout_name}</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                    Total Protected Payment
                  </span>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                    {formatMoney(proj.client_total_amount)}
                  </div>
                </div>

                <span className={`rf-badge ${proj.status === 'SETTLED' ? 'rf-badge-mint' : 'rf-badge-blue'}`}>
                  {proj.status}
                </span>

                <button
                  onClick={() => onOpenProject(proj.id)}
                  className="rf-btn rf-btn-primary rf-btn-sm"
                  style={{ gap: '0.375rem' }}
                >
                  <span>Open Workspace</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REQUEST REFEIR DESK RECOMMENDATION MODAL */}
      {showDeskRequestModal && (
        <div
          className="rf-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 10, 6, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setShowDeskRequestModal(false)}
        >
          <div
            className="rf-modal-content"
            style={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: '#07160D',
              border: '1.5px solid #7DA2FF',
              borderRadius: 'var(--rf-radius-2xl)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
              padding: '2rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(125, 162, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7DA2FF' }}>
                  <Headphones size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                    Request Refeir Desk Recommendation
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: 0 }}>
                    Pre-screened talent shortlist delivered in &lt;24 hours.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeskRequestModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDeskRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Project Title / Role Needed</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Flutter Developer for Pan-African Fintech App"
                  className="rf-input"
                  value={deskProjectTitle}
                  onChange={e => setDeskProjectTitle(e.target.value)}
                />
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Required Skills & Stacks</label>
                <input
                  type="text"
                  placeholder="e.g. Flutter, Dart, Supabase, Firebase, Stripe API"
                  className="rf-input"
                  value={deskSkills}
                  onChange={e => setDeskSkills(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div className="rf-form-group" style={{ marginBottom: 0 }}>
                  <label className="rf-label">Budget Range</label>
                  <input
                    type="number"
                    className="rf-input"
                    value={deskBudget}
                    onChange={e => setDeskBudget(e.target.value)}
                  />
                </div>
                <div className="rf-form-group" style={{ marginBottom: 0 }}>
                  <label className="rf-label">Timeline Urgency</label>
                  <select
                    className="rf-select"
                    value={deskUrgency}
                    onChange={e => setDeskUrgency(e.target.value)}
                  >
                    <option value="Immediate (<24h)">Immediate (&lt;24h)</option>
                    <option value="Within 3 Days">Within 3 Days</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </div>
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Special Notes / Requirements</label>
                <textarea
                  rows={3}
                  className="rf-input"
                  placeholder="Describe your ideal candidate qualifications, timezone preferences, or project deliverables..."
                  value={deskNotes}
                  onChange={e => setDeskNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowDeskRequestModal(false)}
                  className="rf-btn rf-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rf-btn rf-btn-primary"
                  style={{ flex: 1, gap: '0.4rem', justifyContent: 'center' }}
                >
                  <Send size={15} />
                  <span>Dispatch Sourcing Brief</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST REVISION MODAL */}
      {selectedDeliverableForRevision && (
        <div
          className="rf-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 10, 6, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setSelectedDeliverableForRevision(null)}
        >
          <div
            className="rf-modal-content"
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#07160D',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              borderRadius: 'var(--rf-radius-2xl)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
              padding: '2rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                  <RefreshCw size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                    Request Milestone Revision
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                    {selectedDeliverableForRevision.deliverable.title}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeliverableForRevision(null)}
                className="rf-btn rf-btn-ghost rf-btn-sm"
                style={{ padding: '0.25rem', color: 'var(--rf-slate-400)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestRevisionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: 'var(--rf-radius-md)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8125rem',
                  color: '#FDE68A',
                  lineHeight: 1.5
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <AlertCircle size={14} />
                  <span>Escrow Remains Safe</span>
                </div>
                Your milestone payment will stay securely locked in the Refeir Trust Vault while the talent performs your requested adjustments.
              </div>

              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Revision Details & Adjustment Instructions</label>
                <textarea
                  rows={4}
                  required
                  className="rf-input"
                  placeholder="Specify what needs to be changed, refined, or updated in the delivered prototype, code, or assets..."
                  value={revisionNotes}
                  onChange={e => setRevisionNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedDeliverableForRevision(null)}
                  className="rf-btn rf-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rf-btn rf-btn-primary"
                  style={{ flex: 1, gap: '0.4rem', justifyContent: 'center', background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none' }}
                >
                  <Send size={15} />
                  <span>Send Revision Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFEIR PRO MODAL */}
      <RefeirProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        defaultRole="CLIENT"
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

      {/* REVIEW TALENT MODAL */}
      {selectedTalentForReview && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedTalentForReview(null);
          }}
          targetId={selectedTalentForReview.id}
          targetName={selectedTalentForReview.name}
          targetRole="TALENT"
          projectId={selectedTalentForReview.projectId}
          projectTitle={selectedTalentForReview.projectTitle}
          defaultReviewType="CLIENT_TO_TALENT"
        />
      )}
    </div>
  );
};

