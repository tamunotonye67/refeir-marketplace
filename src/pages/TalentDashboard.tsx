import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { formatMoney, createMoney } from '../data/currencies';
import { CountryFlag } from '../components/common/CountryFlag';
import { RefeirProModal } from '../components/common/RefeirProModal';
import { StatementOfAccountModal } from '../components/wallet/StatementOfAccountModal';
import { AddPayoutMethodModal } from '../components/wallet/AddPayoutMethodModal';
import { RequestReviewModal } from '../components/marketplace/RequestReviewModal';
import { ReviewModal } from '../components/marketplace/ReviewModal';
import { ClientReputationScorecard } from '../components/marketplace/ClientReputationScorecard';
import { Project, Milestone } from '../types';
import {
  TrendingUp,
  Briefcase,
  Users,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Award,
  Upload,
  FileText,
  GitPullRequest,
  Layout,
  Globe,
  Package,
  X,
  Send,
  Check,
  Layers,
  Download,
  AlertCircle,
  Trash2,
  FileCode,
  Star,
  MessageSquare,
  DollarSign,
  ThumbsUp,
  Building,
  Smartphone,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TalentDashboardProps {
  onNavigate: (path: string) => void;
  onOpenProject: (projectId: string) => void;
}

export const TalentDashboard: React.FC<TalentDashboardProps> = ({
  onNavigate,
  onOpenProject
}) => {
  const { currentUser } = useAuth();
  const {
    projectsList,
    servicesList,
    jobsList,
    reviewsList,
    reviewRequestsList,
    createService,
    submitProjectDeliverable,
    getReviewsForTarget,
    getUserWallet,
    setDefaultPayoutMethod,
    deletePayoutMethod
  } = useMarketplace();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'SERVICES' | 'REVIEWS' | 'OPEN_JOBS'>('PROJECTS');
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showAddPayoutModal, setShowAddPayoutModal] = useState(false);
  const [showRequestReviewModal, setShowRequestReviewModal] = useState(false);
  const [showReviewClientModal, setShowReviewClientModal] = useState(false);
  const [selectedClientForReview, setSelectedClientForReview] = useState<{ id: string; name: string; projectId?: string; projectTitle?: string } | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Development & Tech');
  const [newPrice, setNewPrice] = useState('450000');
  const [newCurrency, setNewCurrency] = useState('NGN');
  const [newReferralPct, setNewReferralPct] = useState('10');
  const [newDeliveryDays, setNewDeliveryDays] = useState('10');

  // Deliverable upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadGithubUrl, setUploadGithubUrl] = useState('');
  const [uploadFigmaUrl, setUploadFigmaUrl] = useState('');
  const [uploadStagingUrl, setUploadStagingUrl] = useState('');
  const [uploadApkUrl, setUploadApkUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; size: string; rawFile?: File }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const userId = currentUser ? currentUser.id : 'user-amaka';
  const myProjects = projectsList.filter(p => p.talent_id === 'talent-amaka-nwosu' || p.talent_id === userId);
  const myServices = servicesList.filter(s => s.talent_id === 'talent-amaka-nwosu' || s.talent_id === userId);
  const myReviews = getReviewsForTarget(userId).concat(getReviewsForTarget('talent-amaka-nwosu'));
  const myReviewRequests = reviewRequestsList.filter(r => r.requester_id === userId || r.target_id === userId);

  // Collect pending milestones awaiting talent delivery
  const pendingMilestones = myProjects.flatMap(proj => {
    return proj.milestones
      .filter(m => m.status !== 'APPROVED' && m.status !== 'RELEASED')
      .map(m => ({
        milestone: m,
        project: proj
      }));
  });

  const isTalentPro = currentUser?.is_pro && (currentUser?.pro_tier === 'TALENT_PRO' || currentUser?.is_featured_talent);

  const handleOpenUploadModal = (projId?: string, mId?: string) => {
    const targetProj = projId ? myProjects.find(p => p.id === projId) || myProjects[0] : myProjects[0];
    if (!targetProj) {
      showToast('No Active Projects', 'You currently do not have an active project requiring deliverables.', 'INFO');
      return;
    }

    const defaultMilestone = mId 
      ? targetProj.milestones.find(m => m.id === mId) || targetProj.milestones[0]
      : targetProj.milestones.find(m => m.status !== 'APPROVED') || targetProj.milestones[0];

    setSelectedProjectId(targetProj.id);
    setSelectedMilestoneId(defaultMilestone ? defaultMilestone.id : '');
    setUploadTitle(defaultMilestone ? `${defaultMilestone.title} — Deliverables Package` : 'Project Deliverables Package');
    setUploadMessage('');
    setUploadGithubUrl('');
    setUploadFigmaUrl('');
    setUploadStagingUrl('');
    setUploadApkUrl('');
    setSelectedFiles([
      { name: `${targetProj.title.replace(/[^a-zA-Z0-9]/g, '_')}_v1.0.zip`, size: '14.2 MB' }
    ]);
    setShowUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        rawFile: f
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
      showToast('File Attached', `${newFiles.length} file(s) added to deliverable package.`, 'SUCCESS');
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        rawFile: f
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
      showToast('File Attached', `${newFiles.length} file(s) dropped into deliverable package.`, 'SUCCESS');
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitDeliverableForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedMilestoneId || !uploadTitle.trim()) {
      showToast('Missing Fields', 'Please select a milestone and provide a package title.', 'WARNING');
      return;
    }

    const primaryFileName = selectedFiles.length > 0 ? selectedFiles[0].name : 'Refeir_Deliverables_Package.zip';

    submitProjectDeliverable(
      selectedProjectId,
      selectedMilestoneId,
      uploadTitle.trim(),
      uploadMessage.trim() || 'Work completed per milestone specifications. Source code, prototype links, and build artifacts attached.',
      {
        github_pr_url: uploadGithubUrl.trim() || undefined,
        figma_url: uploadFigmaUrl.trim() || undefined,
        staging_url: uploadStagingUrl.trim() || undefined,
        apk_download_url: uploadApkUrl.trim() || undefined,
        fileName: primaryFileName
      }
    );

    setShowUploadModal(false);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    showToast(
      'Deliverables Dispatched to Client!',
      'Your client has been notified to inspect your submitted files and release milestone escrow.',
      'SUCCESS'
    );
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    createService({
      talent_id: userId,
      talent_name: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Amaka Nwosu',
      title: newTitle,
      category: newCategory,
      price: createMoney(parseFloat(newPrice) || 300000, newCurrency),
      referral_percentage: parseInt(newReferralPct) || 10,
      delivery_days: parseInt(newDeliveryDays) || 7
    });

    setShowNewServiceModal(false);
    showToast('Service Created!', 'Your service is now discoverable across Africa with locked scout rewards.');
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-blue)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Briefcase size={14} />
            <span>TALENT COMMAND CENTER</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
            Deliver Work. Grow Your Pan-African Pipeline.
          </h1>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            All projects are 100% protected. Scouts champion your services across the continent.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {isTalentPro ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(244, 185, 66, 0.2), rgba(229, 160, 36, 0.15))',
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
                  Featured Talent Pro
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--rf-cream)' }}>
                  Top Carousel & Homepage Boost Active
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
              <Award size={16} />
              <span>Upgrade to Featured Talent Pro</span>
            </button>
          )}

          <button
            onClick={() => setShowRequestReviewModal(true)}
            className="rf-btn rf-btn-mint"
            style={{ gap: '0.4rem', fontWeight: 800 }}
            title="Request client review or scout endorsement"
          >
            <Star size={16} fill="currentColor" />
            <span>Request Review</span>
          </button>

          <button
            onClick={() => {
              setSelectedClientForReview({ id: 'user-client-kenya', name: 'David Kamau', projectTitle: 'FinTech Wallet Architecture' });
              setShowReviewClientModal(true);
            }}
            className="rf-btn rf-btn-secondary"
            style={{ gap: '0.4rem', fontWeight: 700 }}
            title="Rate client on payment punctuality and fairness"
          >
            <ThumbsUp size={16} />
            <span>Rate Client</span>
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
            onClick={() => setShowNewServiceModal(true)}
            className="rf-btn rf-btn-primary rf-btn-lg"
            style={{ gap: '0.5rem' }}
          >
            <Plus size={18} />
            <span>Create New Service</span>
          </button>
        </div>
      </div>

      {/* Featured Talent Pro Booster Callout if not Pro */}
      {!isTalentPro && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(244, 185, 66, 0.12) 0%, rgba(10, 26, 18, 0.9) 100%)',
            border: '1px solid rgba(244, 185, 66, 0.35)',
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
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: '0 0 0.25rem 0' }}>
                Want to appear on the Featured Talent Carousel?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
                Upgrade to <strong>Talent Pro</strong> to showcase your portfolio on the Refeir homepage and marketplace header with 4.8x more direct client inquiries.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProModal(true)}
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
            <span>Get Featured Pro →</span>
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="rf-grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Active Projects
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
            {myProjects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'FUNDED' || p.status === 'SUBMITTED').length || 2}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', marginTop: '0.25rem' }}>
            100% Payment Protected
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Total Net Revenue
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '0.25rem' }}>
            ₦2.45M
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
            Paid out into local bank
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Referred Client Leads
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7DA2FF', marginTop: '0.25rem' }}>
            14 Leads
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
            Brought by Scouts in 3 countries
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Scout Rewards Shared
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
            ₦245,000
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', marginTop: '0.25rem' }}>
            Only paid on completed work!
          </div>
        </div>
      </div>

      {/* ACTIVE MILESTONE DELIVERIES CONSOLE (TALENT WORK DISPATCH HUB) */}
      <div className="rf-card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1.5px solid var(--rf-navy-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Upload size={13} />
                <span>ACTIVE MILESTONE TASKS</span>
              </span>
              <span className="rf-badge rf-badge-blue rf-text-xs">
                {pendingMilestones.length} Pending Delivery
              </span>
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              Milestones Awaiting Your Deliverables
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
              Upload code packages, design prototypes, and APK builds to trigger client escrow release.
            </p>
          </div>

          <button
            onClick={() => handleOpenUploadModal()}
            className="rf-btn rf-btn-mint"
            style={{ fontWeight: 800, gap: '0.4rem' }}
          >
            <Upload size={16} />
            <span>Upload Deliverable Package</span>
          </button>
        </div>

        {pendingMilestones.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {pendingMilestones.map(({ milestone, project }) => (
              <div
                key={milestone.id}
                style={{
                  background: 'var(--rf-navy-surface)',
                  border: '1px solid var(--rf-navy-border)',
                  borderRadius: 'var(--rf-radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="rf-badge rf-badge-blue rf-text-xs">
                      {milestone.status === 'SUBMITTED' ? 'IN REVIEW WITH CLIENT' : 'WORK IN PROGRESS'}
                    </span>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-mint)' }}>
                      {formatMoney(milestone.amount)}
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.35rem' }}>
                    {milestone.title}
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {milestone.description}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <Clock size={13} />
                    <span>Target Due Date: <strong>{milestone.due_date}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    onClick={() => handleOpenUploadModal(project.id, milestone.id)}
                    className="rf-btn rf-btn-primary rf-btn-sm"
                    style={{ flex: 1, gap: '0.35rem', justifyContent: 'center' }}
                  >
                    <Upload size={14} />
                    <span>Upload Deliverables</span>
                  </button>

                  <button
                    onClick={() => onOpenProject(project.id)}
                    className="rf-btn rf-btn-secondary rf-btn-sm"
                    style={{ gap: '0.25rem' }}
                  >
                    <span>Workspace</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--rf-slate-400)' }}>
            <CheckCircle2 size={32} color="var(--rf-mint)" style={{ margin: '0 auto 0.75rem auto' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>All milestones are currently delivered or up to date.</p>
          </div>
        )}
      </div>

      {/* Active Projects Table */}
      <div className="rf-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
              Active & Completed Engagements
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
              Direct hires take initial referral fee • Proposal jobs split 5%+5% fee
            </p>
          </div>

          <button
            onClick={() => setShowRequestReviewModal(true)}
            className="rf-btn rf-btn-mint rf-btn-sm"
            style={{ gap: '0.35rem', fontWeight: 800 }}
          >
            <Star size={13} fill="currentColor" />
            <span>Request Client/Scout Review</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rf-navy-border)', color: 'var(--rf-slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
                <th style={{ padding: '0.75rem 1rem' }}>Project Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Client</th>
                <th style={{ padding: '0.75rem 1rem' }}>Origin / Fee Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Net Earnings</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {myProjects.map(proj => (
                <tr key={proj.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                    {proj.title}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: 'var(--rf-cream)' }}>{proj.client_name}</div>
                    <CountryFlag countryIsoOrName={proj.client_country} />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {proj.is_proposal_hire ? (
                      <span className="rf-badge rf-badge-blue rf-text-xs">
                        💼 Proposal Job (5%+5%)
                      </span>
                    ) : proj.scout_name ? (
                      <span className="rf-badge rf-badge-mint rf-text-xs">
                        Scout: {proj.scout_name} ({proj.referral_percentage}%)
                      </span>
                    ) : (
                      <span className="rf-badge rf-badge-neutral rf-text-xs">
                        Direct Hire ({proj.direct_facilitation_rate_percent || 10}% Refeir Fee)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--rf-mint)' }}>
                    {formatMoney(proj.talent_net_amount)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`rf-badge rf-text-xs ${
                      proj.status === 'SETTLED' || proj.status === 'COMPLETED' ? 'rf-badge-mint' : 'rf-badge-blue'
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {proj.status === 'SETTLED' || proj.status === 'COMPLETED' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedClientForReview({ id: proj.client_id, name: proj.client_name, projectId: proj.id, projectTitle: proj.title });
                              setShowReviewClientModal(true);
                            }}
                            className="rf-btn rf-btn-mint rf-btn-sm"
                            style={{ gap: '0.25rem', fontSize: '0.75rem', fontWeight: 800 }}
                            title="Rate whether client pays well and pays on time"
                          >
                            <Star size={12} />
                            <span>Rate Client</span>
                          </button>
                          <button
                            onClick={() => setShowRequestReviewModal(true)}
                            className="rf-btn rf-btn-secondary rf-btn-sm"
                            style={{ gap: '0.25rem', fontSize: '0.75rem' }}
                          >
                            <span>Ask Review</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenUploadModal(proj.id)}
                          className="rf-btn rf-btn-primary rf-btn-sm"
                          style={{ gap: '0.3rem' }}
                        >
                          <Upload size={13} />
                          <span>Upload Deliverable</span>
                        </button>
                      )}
                      <button
                        onClick={() => onOpenProject(proj.id)}
                        className="rf-btn rf-btn-secondary rf-btn-sm"
                        style={{ gap: '0.25rem' }}
                      >
                        <span>Workspace</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Services Manager */}
      <div className="rf-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
          Your Active Marketplace Services
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {myServices.map(srv => (
            <div
              key={srv.id}
              style={{
                background: 'var(--rf-navy-surface)',
                border: '1px solid var(--rf-navy-border)',
                borderRadius: 'var(--rf-radius-lg)',
                padding: '1.25rem'
              }}
            >
              <span className="rf-badge rf-badge-blue rf-text-xs" style={{ marginBottom: '0.5rem' }}>
                {srv.category}
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                {srv.title}
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--rf-navy-border)' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  {formatMoney(srv.price)}
                </div>
                <span className="rf-badge rf-badge-mint rf-text-xs">
                  {srv.referral_percentage}% Scout Reward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VERIFIED REVIEWS & SCOUT ENDORSEMENTS SECTION */}
      <div className="rf-card" style={{ padding: '2rem', marginBottom: '2.5rem', marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F4B942', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Star size={14} fill="#F4B942" />
              <span>REPUTATIONAL PROOF & TRUST SCORE</span>
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
              Verified Client Reviews & Scout Endorsements
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '0.25rem' }}>
              All reviews are verified against on-chain/escrow milestone settlements across Africa.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowRequestReviewModal(true)}
              className="rf-btn rf-btn-mint"
              style={{ fontWeight: 800, gap: '0.4rem' }}
            >
              <Star size={15} fill="currentColor" />
              <span>Ask for Review / Endorsement</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        {myReviews.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {myReviews.map(rev => (
              <div
                key={rev.id}
                style={{
                  background: 'var(--rf-navy-surface)',
                  border: '1px solid var(--rf-navy-border)',
                  borderRadius: 'var(--rf-radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img
                        src={rev.author_avatar}
                        alt={rev.author_name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                          {rev.author_name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>
                          {rev.review_type === 'SCOUT_TO_TALENT' ? '🏅 Recommending Scout' : '💼 Verified Client'} • {rev.author_country}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F4B942', fontWeight: 800, fontSize: '0.875rem' }}>
                      <Star size={14} fill="#F4B942" />
                      <span>{rev.rating_overall}.0</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    "{rev.comment}"
                  </p>

                  {/* Badges */}
                  {rev.endorsement_badges && rev.endorsement_badges.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      {rev.endorsement_badges.map((b, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.6875rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            background: 'rgba(102, 187, 42, 0.15)',
                            color: '#66BB2A',
                            fontWeight: 700
                          }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-500)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  Project: {rev.project_title || 'Direct Engagement'} • {new Date(rev.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
            <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.875rem', margin: 0 }}>
              No reviews yet. After completing a project deliverable, ask your client or scout for a verified review!
            </p>
          </div>
        )}
      </div>

      {/* DIRECT MESSAGES & CLIENT CHATTING CENTER */}
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
              Active Client Conversations & Scout Referrals
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '0.2rem' }}>
              Click any conversation to open encrypted messaging and milestone scoping with your clients.
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
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="David Kamau"
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38BDF8' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.875rem', color: 'var(--rf-cream)' }}>David Kamau (SafariPay Client)</strong>
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
              alt="Tariq Al-Mansoor"
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F4B942' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.875rem', color: 'var(--rf-cream)' }}>Tariq Al-Mansoor (Top Scout)</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>Yesterday</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Proposed 12% scout referral split for the upcoming Cairo contract.
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
                <strong style={{ fontSize: '0.875rem', color: 'var(--rf-cream)' }}>Refeir Trust & Safety</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>2 days ago</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Your Tier-2 KYC & ID verification is complete.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PAYOUT & BANKING CHANNELS SECTION */}
      {(() => {
        const talentWallet = getUserWallet(userId);
        const payoutMethods = talentWallet.payout_methods;

        return (
          <div
            className="rf-card"
            style={{
              padding: '2rem',
              marginBottom: '2.5rem',
              border: '1.5px solid var(--rf-navy-border)',
              background: 'linear-gradient(135deg, rgba(7, 22, 13, 0.95) 0%, rgba(15, 46, 30, 0.6) 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <Building size={14} />
                  <span>EARNINGS SETTLEMENT & BANKING</span>
                </div>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Preferred Payout Channels & Bank Details
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '0.25rem' }}>
                  Choose where client milestone releases automatically disburse across African banks, mobile money, and crypto.
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
                  <span>Add Payout Channel</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/wallet')}
                  className="rf-btn rf-btn-ghost rf-btn-sm"
                  style={{ gap: '0.35rem', color: 'var(--rf-slate-300)' }}
                >
                  <span>Open Full Wallet</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {payoutMethods.length === 0 ? (
              <div
                style={{
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed var(--rf-navy-border)',
                  borderRadius: 'var(--rf-radius-lg)'
                }}
              >
                <Building size={32} color="var(--rf-slate-400)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>
                  No Bank or Payout Channel Linked
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                  Add your Nigerian NUBAN, Kenyan M-Pesa, Ghanaian MoMo, South African EFT, or USDT address to receive instant milestone payouts.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddPayoutModal(true)}
                  className="rf-btn rf-btn-primary rf-btn-sm"
                  style={{ fontWeight: 800 }}
                >
                  <Plus size={14} />
                  <span>Link Bank / Mobile Money</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {payoutMethods.map(pm => (
                  <div
                    key={pm.id}
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: `1.5px solid ${pm.is_default ? 'rgba(102, 187, 42, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: 'var(--rf-radius-lg)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: pm.is_default ? 'rgba(102, 187, 42, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                          border: `1px solid ${pm.is_default ? 'rgba(102, 187, 42, 0.35)' : 'rgba(255, 255, 255, 0.1)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {pm.type === 'MOBILE_MONEY' ? (
                          <Smartphone size={20} color="var(--rf-leaf-green)" />
                        ) : pm.type === 'OTHER' ? (
                          <Coins size={20} color="var(--rf-golden-yellow)" />
                        ) : (
                          <Building size={20} color="var(--rf-leaf-green)" />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                            {pm.institution_name}
                          </span>
                          {pm.is_default && (
                            <span className="rf-badge rf-badge-mint rf-text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.1rem 0.4rem' }}>
                              <Star size={9} fill="currentColor" />
                              <span>Default Payout</span>
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-400)', fontFamily: 'var(--rf-font-mono)', marginTop: '2px' }}>
                          {pm.masked_identifier}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
                          {pm.account_holder_name} • <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 700 }}>{pm.currency} ({pm.country})</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.65rem' }}>
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
                            gap: '0.25rem',
                            padding: 0
                          }}
                        >
                          <Star size={11} />
                          <span>Set as Primary</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle2 size={11} color="var(--rf-leaf-green)" />
                          <span>Active Release Destination</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => deletePayoutMethod(userId, pm.id)}
                        title="Remove Channel"
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--rf-slate-400)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--rf-slate-400)')}
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* OPEN CLIENT JOBS & PROPOSAL OPPORTUNITIES */}
      <div className="rf-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#66BB2A', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Briefcase size={14} />
              <span>PAN-AFRICAN OPEN CONTRACTS</span>
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
              Browse Open Jobs & Submit Proposals
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginTop: '0.25rem' }}>
              💼 Proposal Job Rule: 5% client fee + 5% talent fee deducted at final milestone. 🔒 Strict Rule: All chatting must be done within Refeir.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/jobs')}
            className="rf-btn rf-btn-primary"
            style={{ fontWeight: 800, gap: '0.4rem' }}
          >
            <span>View All Jobs</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {jobsList.slice(0, 3).map(job => (
            <div
              key={job.id}
              style={{
                background: 'var(--rf-navy-surface)',
                border: '1px solid var(--rf-navy-border)',
                borderRadius: 'var(--rf-radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="rf-badge rf-badge-blue rf-text-xs">{job.category}</span>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-mint)' }}>
                    {formatMoney(job.budget)}
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.35rem' }}>
                  {job.title}
                </h4>

                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span>Client: <strong>{job.client_name}</strong></span>
                  <span>•</span>
                  <span>{job.client_country}</span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.4, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {job.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#66BB2A', fontWeight: 700 }}>
                  ⚡ 5%+5% Split Fee
                </span>
                <button
                  onClick={() => onNavigate('/jobs')}
                  className="rf-btn rf-btn-mint rf-btn-sm"
                  style={{ gap: '0.3rem', fontWeight: 800 }}
                >
                  <span>Submit Proposal</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Service Modal */}
      {showNewServiceModal && (
        <div className="rf-modal-backdrop" onClick={() => setShowNewServiceModal(false)}>
          <div className="rf-modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>
              Create New Marketplace Service
            </h3>

            <form onSubmit={handleCreateService}>
              <div className="rf-form-group">
                <label className="rf-label">Service Title</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Go & React Architecture"
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Category</label>
                <select className="rf-select" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  <option value="Development & Tech">Development & Tech</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="rf-form-group">
                  <label className="rf-label">Price (Major Units)</label>
                  <input
                    type="number"
                    required
                    className="rf-input"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Currency</label>
                  <select className="rf-select" value={newCurrency} onChange={e => setNewCurrency(e.target.value)}>
                    <option value="NGN">NGN (₦)</option>
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="ZAR">ZAR (R)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="rf-form-group">
                  <label className="rf-label">Scout Referral Reward (%)</label>
                  <select className="rf-select" value={newReferralPct} onChange={e => setNewReferralPct(e.target.value)}>
                    <option value="5">5%</option>
                    <option value="10">10% (Recommended)</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                  </select>
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Delivery Timeline (Days)</label>
                  <input
                    type="number"
                    className="rf-input"
                    value={newDeliveryDays}
                    onChange={e => setNewDeliveryDays(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowNewServiceModal(false)} className="rf-btn rf-btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="rf-btn rf-btn-primary" style={{ flex: 1 }}>
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD DELIVERABLES MODAL */}
      {showUploadModal && (
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
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="rf-modal-content"
            style={{
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#07160D',
              border: '1.5px solid var(--rf-mint)',
              borderRadius: 'var(--rf-radius-2xl)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
              padding: '2rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(54, 224, 160, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rf-mint)' }}>
                  <Upload size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                    Upload Milestone Deliverables
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                    Attach code archives, prototypes, APKs, and release notes for client sign-off.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rf-btn rf-btn-ghost rf-btn-sm"
                style={{ padding: '0.25rem', color: 'var(--rf-slate-400)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverableForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Project & Milestone Pickers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="rf-form-group" style={{ marginBottom: 0 }}>
                  <label className="rf-label">Target Project *</label>
                  <select
                    className="rf-select"
                    value={selectedProjectId}
                    onChange={e => {
                      setSelectedProjectId(e.target.value);
                      const proj = myProjects.find(p => p.id === e.target.value);
                      if (proj && proj.milestones.length > 0) {
                        setSelectedMilestoneId(proj.milestones[0].id);
                      }
                    }}
                  >
                    {myProjects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rf-form-group" style={{ marginBottom: 0 }}>
                  <label className="rf-label">Milestone *</label>
                  <select
                    className="rf-select"
                    value={selectedMilestoneId}
                    onChange={e => setSelectedMilestoneId(e.target.value)}
                  >
                    {myProjects
                      .find(p => p.id === selectedProjectId)
                      ?.milestones.map((m, idx) => (
                        <option key={m.id} value={m.id}>
                          Milestone {idx + 1}: {m.title} ({formatMoney(m.amount)})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Package Title */}
              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Deliverable Package Title *</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Fintech Mobile UI Component Library & Token Specs"
                />
              </div>

              {/* Description / Release Notes */}
              <div className="rf-form-group" style={{ marginBottom: 0 }}>
                <label className="rf-label">Release Notes & Review Guidance *</label>
                <textarea
                  rows={3}
                  required
                  className="rf-input"
                  placeholder="Detail the completed specifications, test instructions, or notes for the client..."
                  value={uploadMessage}
                  onChange={e => setUploadMessage(e.target.value)}
                />
              </div>

              {/* REAL FILE UPLOAD DROPZONE */}
              <div>
                <label className="rf-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Deliverable Files & Code Packages (.zip, .pdf, .fig, .apk, etc.)
                </label>

                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  style={{
                    border: isDragOver ? '2px dashed var(--rf-mint)' : '2px dashed var(--rf-navy-border)',
                    backgroundColor: isDragOver ? 'rgba(54, 224, 160, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--rf-radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <Upload size={28} color={isDragOver ? 'var(--rf-mint)' : 'var(--rf-slate-400)'} style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                    Drop files here or click to browse
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                    Supports ZIP, PDF, FIG, APK, TAR, PNG up to 100 MB each
                  </div>
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--rf-navy-surface)',
                          border: '1px solid var(--rf-navy-border)',
                          borderRadius: 'var(--rf-radius-md)',
                          padding: '0.5rem 0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText size={16} color="var(--rf-mint)" />
                          <span style={{ fontSize: '0.8125rem', color: 'var(--rf-cream)', fontWeight: 600 }}>{file.name}</span>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)' }}>({file.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="rf-btn rf-btn-ghost rf-btn-sm"
                          style={{ padding: '0.2rem', color: 'var(--rf-error)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resource URLs Grid */}
              <div>
                <label className="rf-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Interactive Resource & Prototype Links (Optional)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="rf-form-group" style={{ marginBottom: 0 }}>
                    <label className="rf-label" style={{ fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <GitPullRequest size={12} /> GitHub PR / Repository
                    </label>
                    <input
                      type="url"
                      className="rf-input"
                      placeholder="https://github.com/org/repo/pull/1"
                      value={uploadGithubUrl}
                      onChange={e => setUploadGithubUrl(e.target.value)}
                    />
                  </div>

                  <div className="rf-form-group" style={{ marginBottom: 0 }}>
                    <label className="rf-label" style={{ fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Layout size={12} /> Figma Prototype Link
                    </label>
                    <input
                      type="url"
                      className="rf-input"
                      placeholder="https://figma.com/file/..."
                      value={uploadFigmaUrl}
                      onChange={e => setUploadFigmaUrl(e.target.value)}
                    />
                  </div>

                  <div className="rf-form-group" style={{ marginBottom: 0 }}>
                    <label className="rf-label" style={{ fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Globe size={12} /> Live Staging Demo
                    </label>
                    <input
                      type="url"
                      className="rf-input"
                      placeholder="https://staging.app.domain"
                      value={uploadStagingUrl}
                      onChange={e => setUploadStagingUrl(e.target.value)}
                    />
                  </div>

                  <div className="rf-form-group" style={{ marginBottom: 0 }}>
                    <label className="rf-label" style={{ fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Package size={12} /> Mobile APK Build Link
                    </label>
                    <input
                      type="url"
                      className="rf-input"
                      placeholder="https://downloads.refeir.africa/app.apk"
                      value={uploadApkUrl}
                      onChange={e => setUploadApkUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
                  <span>Submit Deliverables to Client</span>
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
        defaultRole="TALENT"
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

      {/* REQUEST REVIEW MODAL */}
      <RequestReviewModal
        isOpen={showRequestReviewModal}
        onClose={() => setShowRequestReviewModal(false)}
        preselectedTargetRole="CLIENT"
      />

      {/* REVIEW CLIENT MODAL */}
      {selectedClientForReview && (
        <ReviewModal
          isOpen={showReviewClientModal}
          onClose={() => {
            setShowReviewClientModal(false);
            setSelectedClientForReview(null);
          }}
          targetId={selectedClientForReview.id}
          targetName={selectedClientForReview.name}
          targetRole="CLIENT"
          projectId={selectedClientForReview.projectId}
          projectTitle={selectedClientForReview.projectTitle}
          defaultReviewType="TALENT_TO_CLIENT"
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
