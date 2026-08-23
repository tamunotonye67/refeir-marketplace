import React, { useState } from 'react';
import { Project, Milestone, Deliverable } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { CountryFlag } from '../components/common/CountryFlag';
import { formatMoney } from '../data/currencies';
import { PaymentProtectionModal } from '../components/project/PaymentProtectionModal';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Upload,
  FileText,
  MessageSquare,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Send,
  Check,
  RefreshCw,
  ExternalLink,
  GitPullRequest,
  Layout,
  Globe,
  Package,
  ShieldAlert,
  HelpCircle,
  Eye,
  FileCode,
  Layers,
  Download,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectWorkspaceProps {
  projectId: string;
  onBack: () => void;
  onNavigate: (path: string) => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  projectId,
  onBack,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const {
    projectsList,
    submitProjectDeliverable,
    approveMilestone,
    requestMilestoneRevision,
    completeAndSettleProject,
    raiseDispute
  } = useMarketplace();
  const { showToast } = useNotification();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMilestoneForSubmit, setSelectedMilestoneForSubmit] = useState<string | null>(null);
  
  // Deliverable form fields
  const [delivTitle, setDelivTitle] = useState('');
  const [delivMessage, setDelivMessage] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [stagingUrl, setStagingUrl] = useState('');
  const [apkUrl, setApkUrl] = useState('');
  const [workspaceFiles, setWorkspaceFiles] = useState<{ name: string; size: string; rawFile?: File }[]>([
    { name: 'deliverables_package_v1.zip', size: '12.4 MB' }
  ]);
  const [isWorkspaceDragOver, setIsWorkspaceDragOver] = useState(false);

  // Revision modal state
  const [selectedDeliverableForRevision, setSelectedDeliverableForRevision] = useState<Deliverable | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  // Dispute modal state
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Quality issue');
  const [disputeDesc, setDisputeDesc] = useState('');

  // Quick in-app project chat state
  const [chatMessages, setChatMessages] = useState<{ sender: string; role: string; text: string; time: string }[]>([
    { sender: 'David Kamau', role: 'CLIENT', text: 'Hello Amaka! Milestone 1 requirements are live. Looking forward to reviewing the first draft on Refeir.', time: '10:15 AM' },
    { sender: 'Amaka Nwosu', role: 'TALENT', text: 'Thank you David! I am submitting the Figma design system and GitHub repo link directly through the Deliverables console below.', time: '10:20 AM' }
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  const project = projectsList.find(p => p.id === projectId) || projectsList[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    const name = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'You';
    const role = currentUser?.active_role || 'TALENT';
    setChatMessages(prev => [
      ...prev,
      { sender: name, role, text: newMessageText.trim(), time: 'Just now' }
    ]);
    setNewMessageText('');
  };

  const handleOpenSubmitModal = (milestoneId: string) => {
    setSelectedMilestoneForSubmit(milestoneId);
    const ms = project.milestones.find(m => m.id === milestoneId);
    setDelivTitle(ms ? `${ms.title} — Deliverable Package` : 'Milestone Deliverable');
    setDelivMessage('');
    setGithubUrl('');
    setFigmaUrl('');
    setStagingUrl('');
    setApkUrl('');
    setWorkspaceFiles([
      { name: `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_milestone_v1.0.zip`, size: '14.2 MB' }
    ]);
  };

  const handleWorkspaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        rawFile: f
      }));
      setWorkspaceFiles(prev => [...prev, ...newFiles]);
      showToast('File Attached', `${newFiles.length} file(s) attached to milestone delivery.`, 'SUCCESS');
    }
  };

  const handleWorkspaceFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsWorkspaceDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        rawFile: f
      }));
      setWorkspaceFiles(prev => [...prev, ...newFiles]);
      showToast('File Attached', `${newFiles.length} file(s) dropped into milestone delivery.`, 'SUCCESS');
    }
  };

  const handleWorkspaceRemoveFile = (index: number) => {
    setWorkspaceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestoneForSubmit || !delivTitle.trim()) return;

    const primaryFileName = workspaceFiles.length > 0 ? workspaceFiles[0].name : 'Refeir_Deliverables_Package.zip';

    submitProjectDeliverable(
      project.id,
      selectedMilestoneForSubmit,
      delivTitle.trim(),
      delivMessage.trim() || 'Work completed per milestone specifications. Ready for client review.',
      {
        github_pr_url: githubUrl.trim() || undefined,
        figma_url: figmaUrl.trim() || undefined,
        staging_url: stagingUrl.trim() || undefined,
        apk_download_url: apkUrl.trim() || undefined,
        fileName: primaryFileName
      }
    );

    setSelectedMilestoneForSubmit(null);
    setDelivTitle('');
    setDelivMessage('');
    setGithubUrl('');
    setFigmaUrl('');
    setStagingUrl('');
    setApkUrl('');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    showToast(
      'Deliverables Sent to Client!',
      'Milestone marked for client review. Escrow funds will be released upon sign-off.',
      'SUCCESS'
    );
  };

  const handleApproveMilestone = (milestoneId: string) => {
    approveMilestone(project.id, milestoneId);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast('Milestone Approved!', 'Milestone deliverable verified and signed off.', 'SUCCESS');
  };

  const handleRequestRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverableForRevision || !revisionNotes.trim()) return;

    requestMilestoneRevision(
      project.id,
      selectedDeliverableForRevision.milestone_id || '',
      selectedDeliverableForRevision.id,
      revisionNotes.trim()
    );

    setSelectedDeliverableForRevision(null);
    setRevisionNotes('');
    showToast('Revision Requested', 'Talent has been notified to make adjustments and re-submit.', 'INFO');
  };

  const handleCompleteAndSettle = () => {
    completeAndSettleProject(project.id);
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.5 }
    });
    showToast(
      'Project Settled & Completed!',
      `Net earnings released to Talent and ${formatMoney(project.scout_reward_amount)} commission credited to Scout.`,
      'REWARD'
    );
  };

  const handleRaiseDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    raiseDispute(
      project.id,
      {
        id: currentUser ? currentUser.id : 'user-client-kenya',
        name: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'David Kamau',
        role: currentUser ? currentUser.active_role : 'CLIENT'
      },
      disputeReason,
      disputeDesc
    );
    setShowDisputeModal(false);
    showToast('Dispute Opened', 'Our pan-African mediation team will review submitted evidence.', 'WARNING');
  };

  const isTalent = currentUser?.active_role === 'TALENT' || !currentUser;
  const isClient = currentUser?.active_role === 'CLIENT';

  return (
    <div className="rf-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="rf-btn rf-btn-ghost rf-btn-sm"
        style={{ gap: '0.375rem', marginBottom: '1.5rem', color: 'var(--rf-slate-400)' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      {/* Platform Security Banner (No External Chat Policy) */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(36, 87, 255, 0.12) 0%, rgba(54, 224, 160, 0.08) 100%)',
          border: '1px solid rgba(36, 87, 255, 0.25)',
          borderRadius: 'var(--rf-radius-lg)',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(36, 87, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={20} color="#7DA2FF" />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              100% Protected In-Platform Workspace & Deliverables Rail
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '2px' }}>
              All communications, GitHub/Figma deliveries, and milestone approvals must be executed on Refeir. External WhatsApp chat is prohibited to guarantee full escrow protection.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="rf-badge rf-badge-mint rf-text-xs">
            <Lock size={12} /> Trust Vault Escrow Active
          </span>
        </div>
      </div>

      {/* Top Workspace Header */}
      <div
        className="rf-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'var(--rf-navy-surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span
              className={`rf-badge ${
                project.status === 'SETTLED'
                  ? 'rf-badge-mint'
                  : project.status === 'FUNDED' || project.status === 'IN_PROGRESS' || project.status === 'SUBMITTED'
                  ? 'rf-badge-blue'
                  : 'rf-badge-warning'
              }`}
            >
              {project.status === 'SUBMITTED' ? 'DELIVERABLES IN REVIEW' : project.status}
            </span>
            {project.referral_id && (
              <span className="rf-badge rf-badge-reward rf-text-xs">
                Refeir Referral: {project.referral_id}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
            {project.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--rf-slate-300)' }}>
            <div>Client: <strong style={{ color: 'var(--rf-cream)' }}>{project.client_name}</strong></div>
            <div>Talent: <strong style={{ color: 'var(--rf-cream)' }}>{project.talent_name}</strong></div>
            {project.scout_name && (
              <div style={{ color: 'var(--rf-mint)' }}>
                Scout: <strong>{project.scout_name} ({project.referral_percentage}%)</strong>
              </div>
            )}
          </div>
        </div>

        {/* Financial Protection Breakdown Card */}
        <div
          style={{
            background: 'var(--rf-navy-card)',
            border: '1px solid var(--rf-navy-border)',
            borderRadius: 'var(--rf-radius-lg)',
            padding: '1.25rem',
            minWidth: '280px'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
            Protected Project Escrow
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-mint)', marginTop: '2px' }}>
            {formatMoney(project.client_total_amount)}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
            Base: {formatMoney(project.project_amount)} • Talent Net: {formatMoney(project.talent_net_amount)}
          </div>

          {project.status === 'AWAITING_PAYMENT' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="rf-btn rf-btn-mint rf-btn-sm rf-w-full"
              style={{ marginTop: '0.75rem' }}
            >
              Fund Protected Payment
            </button>
          )}

          {project.status !== 'AWAITING_PAYMENT' && project.status !== 'SETTLED' && (
            isClient ? (
              <button
                onClick={handleCompleteAndSettle}
                className="rf-btn rf-btn-mint rf-btn-sm rf-w-full"
                style={{ marginTop: '0.75rem', gap: '0.375rem' }}
              >
                <CheckCircle2 size={14} />
                <span>Complete & Settle Project</span>
              </button>
            ) : (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(54, 224, 160, 0.08)',
                  border: '1px solid rgba(54, 224, 160, 0.25)',
                  borderRadius: 'var(--rf-radius-md)',
                  fontSize: '0.75rem',
                  color: 'var(--rf-mint)',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <ShieldCheck size={14} />
                <span>Protected Escrow • Auto-releases on Client approval</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Main Grid: Milestones & Deliverables vs Project Chat & Files */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        {/* Left Column: Milestones & Deliverable Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Milestones Card */}
          <div className="rf-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Project Milestones ({project.milestones.length})
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                  Deliver work per milestone to trigger escrow release.
                </p>
              </div>
              <button
                onClick={() => setShowDisputeModal(true)}
                className="rf-btn-ghost"
                style={{ fontSize: '0.8125rem', color: 'var(--rf-error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <AlertTriangle size={14} />
                <span>Raise Dispute</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {project.milestones.map((ms, index) => (
                <div
                  key={ms.id}
                  style={{
                    background: 'var(--rf-navy-surface)',
                    border: '1px solid var(--rf-navy-border)',
                    borderRadius: 'var(--rf-radius-lg)',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>
                        Milestone {index + 1}
                      </span>
                      <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                        {ms.title}
                      </h4>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                        {formatMoney(ms.amount)}
                      </div>
                      <span
                        className={`rf-badge rf-text-xs ${
                          ms.status === 'APPROVED' || ms.status === 'RELEASED'
                            ? 'rf-badge-mint'
                            : ms.status === 'SUBMITTED'
                            ? 'rf-badge-blue'
                            : 'rf-badge-neutral'
                        }`}
                      >
                        {ms.status === 'SUBMITTED' ? 'IN REVIEW' : ms.status}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {ms.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Clock size={13} />
                      <span>Target: {ms.due_date}</span>
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {ms.status !== 'APPROVED' && ms.status !== 'RELEASED' && (
                        <>
                          {(!currentUser || isTalent) && (
                            <button
                              onClick={() => handleOpenSubmitModal(ms.id)}
                              className="rf-btn rf-btn-primary rf-btn-sm"
                              style={{ gap: '0.375rem' }}
                            >
                              <Upload size={14} />
                              <span>Send Deliverables</span>
                            </button>
                          )}

                          {(!currentUser || isClient) && (
                            <button
                              onClick={() => handleApproveMilestone(ms.id)}
                              className="rf-btn rf-btn-mint rf-btn-sm"
                              style={{ gap: '0.375rem' }}
                            >
                              <Check size={14} />
                              <span>Approve & Release</span>
                            </button>
                          )}
                        </>
                      )}
                      {(ms.status === 'APPROVED' || ms.status === 'RELEASED') && (
                        <span style={{ color: 'var(--rf-mint)', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <CheckCircle2 size={16} /> Milestone Approved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Deliverables Console */}
          <div className="rf-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Deliverables & Code Submissions ({project.deliverables?.length || 0})
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                  Interactive repository links, design prototypes, and build artifacts sent by Talent.
                </p>
              </div>

              {project.milestones.some(m => m.status !== 'APPROVED' && m.status !== 'RELEASED') && (
                <button
                  onClick={() => handleOpenSubmitModal(project.milestones[0].id)}
                  className="rf-btn rf-btn-secondary rf-btn-sm"
                  style={{ gap: '0.375rem' }}
                >
                  <Upload size={14} />
                  <span>+ New Submission</span>
                </button>
              )}
            </div>

            {project.deliverables && project.deliverables.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {project.deliverables.map(del => (
                  <div
                    key={del.id}
                    style={{
                      background: 'var(--rf-navy-surface)',
                      border: '1px solid var(--rf-navy-border)',
                      borderRadius: 'var(--rf-radius-lg)',
                      padding: '1.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                            {del.title}
                          </h4>
                          <span
                            className={`rf-badge rf-text-xs ${
                              del.status === 'APPROVED'
                                ? 'rf-badge-mint'
                                : del.status === 'REVISION_REQUESTED'
                                ? 'rf-badge-warning'
                                : 'rf-badge-blue'
                            }`}
                          >
                            {del.status === 'REVISION_REQUESTED'
                              ? 'REVISION REQUESTED'
                              : del.status || 'PENDING REVIEW'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
                          {del.milestone_title || 'Milestone Delivery'} • Submitted on {new Date(del.submitted_at).toLocaleDateString()} at {new Date(del.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* Revision action buttons for client */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {del.status !== 'APPROVED' && (
                          <button
                            onClick={() => {
                              setSelectedDeliverableForRevision(del);
                              setRevisionNotes('');
                            }}
                            className="rf-btn rf-btn-secondary rf-btn-sm"
                            style={{ gap: '0.25rem' }}
                          >
                            <RefreshCw size={13} />
                            <span>Request Revision</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>
                      {del.message}
                    </p>

                    {/* Revision notes if any */}
                    {del.revision_notes && (
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: 'var(--rf-radius-md)',
                          padding: '0.75rem 1rem',
                          marginBottom: '1rem',
                          fontSize: '0.8125rem',
                          color: '#FDE68A'
                        }}
                      >
                        <strong>Client Revision Feedback:</strong> {del.revision_notes}
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
                          <GitPullRequest size={14} />
                          <span>Inspect GitHub PR</span>
                          <ExternalLink size={12} />
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
                          <Layout size={14} />
                          <span>Open Figma Workspace</span>
                          <ExternalLink size={12} />
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
                          <Globe size={14} />
                          <span>Live Staging Demo</span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      {del.apk_download_url && (
                        <button
                          onClick={() => {
                            showToast('Downloading Mobile APK', 'Fetching verified Android build artifact (24.8 MB)...', 'SUCCESS');
                          }}
                          className="rf-btn rf-btn-secondary rf-btn-sm"
                          style={{ gap: '0.375rem', fontSize: '0.75rem' }}
                        >
                          <Package size={14} />
                          <span>Download APK Build</span>
                          <Download size={12} />
                        </button>
                      )}

                      {del.file_name && (
                        <button
                          onClick={() => {
                            showToast('Secure Download Initiated', `Downloading ${del.file_name} from Refeir Trust Vault...`, 'SUCCESS');
                          }}
                          className="rf-btn rf-btn-secondary rf-btn-sm"
                          style={{ gap: '0.375rem', fontSize: '0.75rem' }}
                        >
                          <FileText size={14} color="var(--rf-blue)" />
                          <span>{del.file_name}</span>
                          <Download size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  border: '1px dashed var(--rf-navy-border)',
                  borderRadius: 'var(--rf-radius-lg)'
                }}
              >
                <FileCode size={32} color="var(--rf-slate-400)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>
                  No Deliverables Submitted Yet
                </h4>
                <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.8125rem', maxWidth: '380px', margin: '0 auto 1rem' }}>
                  Talent can attach GitHub PRs, Figma links, and code packages directly to milestones.
                </p>
                {project.milestones.length > 0 && (
                  <button
                    onClick={() => handleOpenSubmitModal(project.milestones[0].id)}
                    className="rf-btn rf-btn-primary rf-btn-sm"
                    style={{ gap: '0.375rem' }}
                  >
                    <Upload size={14} />
                    <span>Submit Milestone 1 Deliverables</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Encrypted Real-Time Project Chat */}
        <div className="rf-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '680px' }}>
          <div style={{ borderBottom: '1px solid var(--rf-navy-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} color="var(--rf-mint)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                Encrypted Project Chat
              </h3>
            </div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>
              🔒 Protected channel • Telemetry logged for arbitration
            </p>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--rf-navy-surface)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--rf-radius-md)',
                  border: '1px solid var(--rf-navy-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <strong style={{ color: msg.role === 'CLIENT' ? '#7DA2FF' : 'var(--rf-mint)' }}>
                      {msg.sender}
                    </strong>
                    <span className="rf-badge rf-badge-neutral rf-text-xs" style={{ padding: '0 4px', fontSize: '0.625rem' }}>
                      {msg.role}
                    </span>
                  </div>
                  <span>{msg.time}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-cream)', lineHeight: 1.4 }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="rf-input"
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              placeholder="Send message inside secure workspace..."
              style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}
            />
            <button type="submit" className="rf-btn rf-btn-primary rf-btn-sm" aria-label="Send message">
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Payment Protection Modal */}
      {showPaymentModal && (
        <PaymentProtectionModal
          project={project}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => setShowPaymentModal(false)}
        />
      )}

      {/* Rich Deliverables Submission Modal */}
      {selectedMilestoneForSubmit && (
        <div className="rf-modal-backdrop" onClick={() => setSelectedMilestoneForSubmit(null)}>
          <div
            className="rf-modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(54, 224, 160, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Upload size={20} color="var(--rf-mint)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Send Milestone Deliverables
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
                  Attach source code, live links, design files, and documentation for client approval.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitDeliverable}>
              <div className="rf-form-group">
                <label className="rf-label">Target Milestone</label>
                <select
                  className="rf-select"
                  value={selectedMilestoneForSubmit}
                  onChange={e => setSelectedMilestoneForSubmit(e.target.value)}
                >
                  {project.milestones.map((m, idx) => (
                    <option key={m.id} value={m.id}>
                      Milestone {idx + 1}: {m.title} ({formatMoney(m.amount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Deliverable Package Title *</label>
                <input
                  type="text"
                  required
                  className="rf-input"
                  value={delivTitle}
                  onChange={e => setDelivTitle(e.target.value)}
                  placeholder="e.g. Fintech Mobile UI Component Library & Token Specs"
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Release Notes & Review Guidance *</label>
                <textarea
                  required
                  className="rf-textarea"
                  rows={3}
                  value={delivMessage}
                  onChange={e => setDelivMessage(e.target.value)}
                  placeholder="Explain what has been completed, test instructions, credentials if needed, and next steps..."
                />
              </div>

              {/* Resource URLs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="rf-form-group" style={{ margin: 0 }}>
                  <label className="rf-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <GitPullRequest size={14} /> GitHub Repository / PR Link
                  </label>
                  <input
                    type="url"
                    className="rf-input"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/org/repo/pull/1"
                  />
                </div>

                <div className="rf-form-group" style={{ margin: 0 }}>
                  <label className="rf-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Layout size={14} /> Figma Design Workspace
                  </label>
                  <input
                    type="url"
                    className="rf-input"
                    value={figmaUrl}
                    onChange={e => setFigmaUrl(e.target.value)}
                    placeholder="https://figma.com/file/..."
                  />
                </div>

                <div className="rf-form-group" style={{ margin: 0 }}>
                  <label className="rf-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Globe size={14} /> Live Staging / Demo URL
                  </label>
                  <input
                    type="url"
                    className="rf-input"
                    value={stagingUrl}
                    onChange={e => setStagingUrl(e.target.value)}
                    placeholder="https://staging.app.domain"
                  />
                </div>

                <div className="rf-form-group" style={{ margin: 0 }}>
                  <label className="rf-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Package size={14} /> APK / Release Build Link
                  </label>
                  <input
                    type="url"
                    className="rf-input"
                    value={apkUrl}
                    onChange={e => setApkUrl(e.target.value)}
                    placeholder="https://storage.refeir.africa/builds/app.apk"
                  />
                </div>
              </div>

              {/* Interactive File Dropzone */}
              <div>
                <label className="rf-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Deliverable Files & Code Packages (.zip, .pdf, .fig, .apk, etc.)
                </label>

                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setIsWorkspaceDragOver(true);
                  }}
                  onDragLeave={() => setIsWorkspaceDragOver(false)}
                  onDrop={handleWorkspaceFileDrop}
                  style={{
                    border: isWorkspaceDragOver ? '2px dashed var(--rf-mint)' : '2px dashed var(--rf-navy-border)',
                    backgroundColor: isWorkspaceDragOver ? 'rgba(54, 224, 160, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--rf-radius-lg)',
                    padding: '1.25rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleWorkspaceFileChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <Upload size={24} color={isWorkspaceDragOver ? 'var(--rf-mint)' : 'var(--rf-slate-400)'} style={{ margin: '0 auto 0.35rem' }} />
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                    Drop files here or click to browse
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)', marginTop: '0.2rem' }}>
                    Supports ZIP, PDF, FIG, APK, TAR up to 100 MB each
                  </div>
                </div>

                {/* Selected Files List */}
                {workspaceFiles.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
                    {workspaceFiles.map((file, idx) => (
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
                          onClick={() => handleWorkspaceRemoveFile(idx)}
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

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedMilestoneForSubmit(null)}
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
                  <Send size={15} />
                  <span>Send Deliverables to Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {selectedDeliverableForRevision && (
        <div className="rf-modal-backdrop" onClick={() => setSelectedDeliverableForRevision(null)}>
          <div
            className="rf-modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '540px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <RefreshCw size={20} color="#F59E0B" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Request Milestone Revision
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
                  Specify the adjustments needed for "{selectedDeliverableForRevision.title}".
                </p>
              </div>
            </div>

            <form onSubmit={handleRequestRevisionSubmit}>
              <div className="rf-form-group">
                <label className="rf-label">Actionable Revision Feedback *</label>
                <textarea
                  required
                  rows={4}
                  className="rf-textarea"
                  value={revisionNotes}
                  onChange={e => setRevisionNotes(e.target.value)}
                  placeholder="Detail the specific corrections, code styling issues, or UI polish required before milestone approval..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
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
                  style={{ flex: 1 }}
                >
                  Submit Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="rf-modal-backdrop" onClick={() => setShowDisputeModal(false)}>
          <div className="rf-modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-error)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} />
              <span>Raise Project Dispute</span>
            </h3>

            <form onSubmit={handleRaiseDisputeSubmit}>
              <div className="rf-form-group">
                <label className="rf-label">Reason for Dispute</label>
                <select className="rf-select" value={disputeReason} onChange={e => setDisputeReason(e.target.value)}>
                  <option value="Work not delivered">Work not delivered</option>
                  <option value="Incomplete work">Incomplete work</option>
                  <option value="Quality issue">Quality issue</option>
                  <option value="Requirements not met">Requirements not met</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Detailed Description & Evidence Notes</label>
                <textarea
                  required
                  className="rf-textarea"
                  value={disputeDesc}
                  onChange={e => setDisputeDesc(e.target.value)}
                  placeholder="Detail the issue with references to agreed milestones..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowDisputeModal(false)} className="rf-btn rf-btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="rf-btn rf-btn-danger" style={{ flex: 1 }}>
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
