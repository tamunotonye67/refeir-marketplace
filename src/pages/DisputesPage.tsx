import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { formatMoney, createMoney } from '../data/currencies';
import { Dispute, DisputeStatus } from '../types';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  FileText,
  Scale,
  Search,
  Filter,
  ExternalLink,
  MessageSquare,
  Send,
  PlusCircle,
  Sliders,
  User,
  Briefcase,
  Code,
  Award,
  DollarSign,
  Check,
  Eye,
  Sparkles,
  Lock,
  X,
  Layers,
  ChevronRight,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DisputesPageProps {
  onNavigate: (path: string) => void;
}

interface MediationMessage {
  id: string;
  sender: string;
  role: 'CLIENT' | 'TALENT' | 'ARBITER';
  text: string;
  timestamp: string;
}

export const DisputesPage: React.FC<DisputesPageProps> = ({ onNavigate }) => {
  const { disputesList, resolveDispute, raiseDispute, projectsList } = useMarketplace();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Selected Dispute Modal
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  // Split Settlement slider state
  const [talentSplitPercentage, setTalentSplitPercentage] = useState<number>(50);
  const [arbiterVerdictNotes, setArbiterVerdictNotes] = useState<string>('');

  // Mediation chat state
  const [mediationMessages, setMediationMessages] = useState<Record<string, MediationMessage[]>>({
    'DISP-94821': [
      {
        id: 'msg-1',
        sender: 'David Kamau (Client)',
        role: 'CLIENT',
        text: 'Milestone 2 was submitted without the responsive iPad/tablet layouts specified in our brand roadmap.',
        timestamp: 'Aug 14, 11:45 AM'
      },
      {
        id: 'msg-2',
        sender: 'Sharon Chebet (Talent)',
        role: 'TALENT',
        text: 'Our initial proposal clearly stated Mobile iOS and Android Figma frames only. Tablet adaptation was slated as Phase 2.',
        timestamp: 'Aug 14, 12:20 PM'
      },
      {
        id: 'msg-3',
        sender: 'Refeir Mediation Arbiter',
        role: 'ARBITER',
        text: 'Arbiter desk reviewing the original contract specification document and Figma token exports.',
        timestamp: 'Aug 15, 09:15 AM'
      }
    ],
    'DISP-88204': [
      {
        id: 'msg-4',
        sender: 'Alpha Global (Client)',
        role: 'CLIENT',
        text: 'Our internal load testing shows 420ms p99 response times on Swahili sentence tokenization.',
        timestamp: 'Aug 13, 03:00 PM'
      },
      {
        id: 'msg-5',
        sender: 'Kwame Mensah (Talent)',
        role: 'TALENT',
        text: 'The Docker image requires GPU acceleration or ONNX Runtime flags as documented in README.md.',
        timestamp: 'Aug 14, 09:30 AM'
      }
    ]
  });
  const [newChatMessage, setNewChatMessage] = useState('');

  // File New Dispute Modal State
  const [showFileDisputeModal, setShowFileDisputeModal] = useState(false);
  const [filingProjectId, setFilingProjectId] = useState(projectsList[0]?.id || '');
  const [filingReason, setFilingReason] = useState('Scope Alignment & Spec Discrepancy');
  const [filingDescription, setFilingDescription] = useState('');
  const [filingEvidenceUrl, setFilingEvidenceUrl] = useState('');

  // Metrics
  const activeDisputes = disputesList.filter(d => !d.status.includes('RESOLVED') && d.status !== 'CLOSED');
  const resolvedTalentCount = disputesList.filter(d => d.status === 'RESOLVED_TALENT').length;
  const resolvedClientCount = disputesList.filter(d => d.status === 'RESOLVED_CLIENT').length;
  const splitSettlementsCount = disputesList.filter(d => d.status === 'PARTIAL_SETTLEMENT').length;

  const filteredDisputes = disputesList.filter(d => {
    const matchStatus =
      selectedStatusFilter === 'ALL'
        ? true
        : selectedStatusFilter === 'ACTIVE'
        ? !d.status.includes('RESOLVED') && d.status !== 'CLOSED'
        : d.status === selectedStatusFilter;

    const matchSearch =
      d.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.initiated_by_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const handleSendMessage = (disputeId: string) => {
    if (!newChatMessage.trim()) return;
    const userName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : 'Refeir Arbiter';
    const userRole = currentUser?.active_role || 'ARBITER';
    const newMsg: MediationMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser ? `${userName} (${userRole})` : 'Refeir Arbiter',
      role: (userRole as any) || 'ARBITER',
      text: newChatMessage.trim(),
      timestamp: 'Just now'
    };

    setMediationMessages(prev => ({
      ...prev,
      [disputeId]: [...(prev[disputeId] || []), newMsg]
    }));
    setNewChatMessage('');
    showToast('Mediation Note Recorded', 'Message added to dispute audit log.', 'INFO');
  };

  const handleExecuteTribunalResolution = (
    resolution: 'RESOLVED_TALENT' | 'RESOLVED_CLIENT' | 'PARTIAL_SETTLEMENT'
  ) => {
    if (!selectedDispute) return;

    let defaultNote = arbiterVerdictNotes.trim();
    if (!defaultNote) {
      if (resolution === 'RESOLVED_TALENT') {
        defaultNote = 'Tribunal verified milestone deliverables and git repositories. 100% escrow funds released to Talent.';
      } else if (resolution === 'RESOLVED_CLIENT') {
        defaultNote = 'Tribunal established milestone non-fulfillment. 100% escrow funds refunded to Client Trust Vault.';
      } else {
        defaultNote = `Mediated Fair Split: ${talentSplitPercentage}% released to Talent for partial delivery, and ${100 - talentSplitPercentage}% refunded to Client.`;
      }
    }

    resolveDispute(selectedDispute.id, resolution, defaultNote);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

    showToast(
      'Tribunal Verdict Executed',
      `Case ${selectedDispute.id} has been formally closed with status ${resolution}.`,
      'SUCCESS'
    );

    // Update local selectedDispute state
    setSelectedDispute({
      ...selectedDispute,
      status: resolution,
      resolution_notes: defaultNote,
      updated_at: new Date().toISOString()
    });
  };

  const handleFileDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projectsList.find(p => p.id === filingProjectId) || projectsList[0];
    if (!proj) {
      showToast('Error', 'Please select an active project to file arbitration.', 'ERROR');
      return;
    }

    raiseDispute(
      proj.id,
      {
        id: currentUser?.id || 'user-active',
        name: currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : 'David Kamau',
        role: currentUser?.active_role || 'CLIENT'
      },
      filingReason,
      filingDescription || 'Formal arbitration requested for milestone review.'
    );

    showToast(
      'Dispute Claim Filed & Escrow Locked',
      `Tribunal opened for "${proj.title}". Refeir mediation team assigned.`,
      'WARNING'
    );

    setShowFileDisputeModal(false);
    setFilingDescription('');
    setFilingEvidenceUrl('');
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#F4B942', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Scale size={15} />
            <span>PAN-AFRICAN ARBITRATION TRIBUNAL</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            Dispute Mediation Console
          </h1>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', maxWidth: '720px' }}>
            Neutral tri-party escrow tribunal protecting African clients, engineers, and scouts with 100% Trust Vault double-entry custody.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowFileDisputeModal(true)}
            className="rf-btn rf-btn-primary"
            style={{ fontWeight: 800, gap: '0.5rem' }}
          >
            <PlusCircle size={16} />
            <span>File New Dispute Claim</span>
          </button>
        </div>
      </div>

      {/* Top Analytics Grid */}
      <div className="rf-grid-4" style={{ marginBottom: '2rem' }}>
        <div className="rf-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
              Active In Mediation
            </span>
            <AlertTriangle size={18} color="#FF6B6B" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
            {activeDisputes.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FF6B6B', fontWeight: 700, marginTop: '0.2rem' }}>
            Funds Locked in Trust Vault
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
              Resolved in Favor of Talent
            </span>
            <CheckCircle2 size={18} color="var(--rf-leaf-green)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
            {resolvedTalentCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 700, marginTop: '0.2rem' }}>
            Milestones Verified & Released
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
              Client Refunds Issued
            </span>
            <ShieldCheck size={18} color="#7DA2FF" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
            {resolvedClientCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7DA2FF', fontWeight: 700, marginTop: '0.2rem' }}>
            100% Escrow Reversals
          </div>
        </div>

        <div className="rf-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
              Avg. Resolution Speed
            </span>
            <Clock size={18} color="#F6B21A" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
            18.4 hrs
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F6B21A', fontWeight: 700, marginTop: '0.2rem' }}>
            99.2% Tribunal Satisfaction
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rf-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Cases' },
            { id: 'ACTIVE', label: `Open Mediation (${activeDisputes.length})` },
            { id: 'UNDER_REVIEW', label: 'Under Review' },
            { id: 'RESOLVED_TALENT', label: 'Resolved Talent' },
            { id: 'RESOLVED_CLIENT', label: 'Client Refunded' },
            { id: 'PARTIAL_SETTLEMENT', label: 'Split Settlements' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusFilter(tab.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedStatusFilter === tab.id ? '1px solid var(--rf-leaf-green)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: selectedStatusFilter === tab.id ? 'rgba(102, 187, 42, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedStatusFilter === tab.id ? 'var(--rf-leaf-green)' : 'var(--rf-slate-300)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} color="var(--rf-slate-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search cases, projects, parties..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem 0.45rem 2rem',
              borderRadius: 'var(--rf-radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--rf-navy-border)',
              color: 'var(--rf-cream)',
              fontSize: '0.8125rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Disputes Cases Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredDisputes.length > 0 ? (
          filteredDisputes.map(disp => {
            const isResolved = disp.status.includes('RESOLVED') || disp.status === 'PARTIAL_SETTLEMENT';
            return (
              <div
                key={disp.id}
                className="rf-card"
                style={{
                  padding: '1.75rem',
                  background: 'var(--rf-navy-surface)',
                  border: isResolved ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(255, 107, 107, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Top Row: Status, Title, Escrow sum */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span
                        className={`rf-badge rf-text-xs ${
                          disp.status === 'RESOLVED_TALENT'
                            ? 'rf-badge-mint'
                            : disp.status === 'RESOLVED_CLIENT'
                            ? 'rf-badge-blue'
                            : disp.status === 'PARTIAL_SETTLEMENT'
                            ? 'rf-badge-gold'
                            : 'rf-badge-danger'
                        }`}
                        style={{ fontWeight: 800 }}
                      >
                        {disp.status.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', fontFamily: 'var(--rf-font-mono)' }}>
                        Case #{disp.id}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: '0.2rem 0' }}>
                      {disp.project_title}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                      Filed by <strong>{disp.initiated_by_name}</strong> ({disp.initiated_by_role}) • Disputed on {new Date(disp.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                      Disputed Trust Vault Sum
                    </span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
                      {formatMoney(disp.disputed_amount)}
                    </div>
                  </div>
                </div>

                {/* Grievance Claim Box */}
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--rf-radius-md)', marginBottom: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#F4B942', marginBottom: '0.35rem' }}>
                    Grievance: {disp.reason}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.55, margin: 0 }}>
                    {disp.description}
                  </p>
                </div>

                {/* Evidence URLs if any */}
                {disp.evidence_urls && disp.evidence_urls.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rf-slate-400)' }}>
                      Attached Deliverables & Evidence:
                    </span>
                    {disp.evidence_urls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          color: 'var(--rf-mint)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <ExternalLink size={12} />
                        <span>Evidence #{idx + 1}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Resolution Verdict Notes */}
                {disp.resolution_notes && (
                  <div style={{ background: 'rgba(102, 187, 42, 0.08)', border: '1px solid rgba(102, 187, 42, 0.25)', padding: '1rem', borderRadius: 'var(--rf-radius-md)', fontSize: '0.8125rem', color: 'var(--rf-cream)', marginBottom: '1.25rem' }}>
                    <strong style={{ color: 'var(--rf-leaf-green)', display: 'block', marginBottom: '0.25rem' }}>
                      ⚖️ Binding Tribunal Resolution:
                    </strong>
                    {disp.resolution_notes}
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Lock size={12} color="var(--rf-leaf-green)" />
                    <span>Protected by Refeir 100% Double-Entry Escrow</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setSelectedDispute(disp)}
                      className="rf-btn rf-btn-secondary rf-btn-sm"
                      style={{ gap: '0.4rem', fontWeight: 700 }}
                    >
                      <Eye size={14} />
                      <span>Inspect Case & Tribunal Console</span>
                    </button>

                    {!isResolved && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedDispute(disp);
                            handleExecuteTribunalResolution('RESOLVED_TALENT');
                          }}
                          className="rf-btn rf-btn-mint rf-btn-sm"
                          style={{ fontWeight: 800 }}
                        >
                          Release to Talent
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDispute(disp);
                            handleExecuteTribunalResolution('RESOLVED_CLIENT');
                          }}
                          className="rf-btn rf-btn-danger rf-btn-sm"
                          style={{ fontWeight: 800 }}
                        >
                          Refund Client
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rf-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <ShieldCheck size={48} color="var(--rf-leaf-green)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              No Active Disputes Match Filters
            </h3>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', maxWidth: '460px', margin: '0.5rem auto 1.5rem' }}>
              All project milestones and escrow deliveries across Africa are executing in accordance with specifications.
            </p>
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className="rf-btn rf-btn-secondary rf-btn-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: FULL DISPUTE TRIBUNAL & CASE REVIEW MODAL */}
      {selectedDispute && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 10, 6, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
          onClick={() => setSelectedDispute(null)}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #07170E 0%, #030F08 100%)',
              border: '1px solid rgba(102, 187, 42, 0.4)',
              borderRadius: 'var(--rf-radius-xl)',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#F4B942', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Scale size={14} />
                  <span>ARBITRATION TRIBUNAL INQUIRY</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', margin: '0.2rem 0' }}>
                  {selectedDispute.project_title}
                </h2>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', fontFamily: 'var(--rf-font-mono)' }}>
                  Case ID: {selectedDispute.id} • Status: {selectedDispute.status}
                </div>
              </div>

              <button
                onClick={() => setSelectedDispute(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--rf-slate-300)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Tri-Party Case Details Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Initiating Party
                </span>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.2rem' }}>
                  {selectedDispute.initiated_by_name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#F4B942', marginTop: '2px', fontWeight: 700 }}>
                  Role: {selectedDispute.initiated_by_role}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Disputed Escrow Sum
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--rf-cream)', marginTop: '0.2rem' }}>
                  {formatMoney(selectedDispute.disputed_amount)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', marginTop: '2px', fontWeight: 700 }}>
                  Locked in Trust Vault Custody
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>
                  Scout Commission Protection
                </span>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.2rem' }}>
                  10% Locked Attribution
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-mint)', marginTop: '2px', fontWeight: 700 }}>
                  Protected by Tribunal Rules
                </div>
              </div>
            </div>

            {/* Grievance Statement */}
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1.25rem', borderRadius: 'var(--rf-radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F4B942', margin: '0 0 0.4rem 0' }}>
                Claim Reason: {selectedDispute.reason}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, margin: 0 }}>
                {selectedDispute.description}
              </p>
            </div>

            {/* Tri-Party Live Mediation Chat & Notes */}
            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: 'var(--rf-radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={15} color="var(--rf-leaf-green)" />
                  <span>Tri-Party Mediation Stream & Arbiter Log</span>
                </h4>
                <span style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)' }}>
                  Immutably logged to telemetry
                </span>
              </div>

              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
                {(mediationMessages[selectedDispute.id] || []).map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--rf-radius-sm)',
                      background: msg.role === 'ARBITER' ? 'rgba(102, 187, 42, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: msg.role === 'ARBITER' ? '1px solid rgba(102, 187, 42, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: msg.role === 'ARBITER' ? 'var(--rf-leaf-green)' : 'var(--rf-cream)' }}>
                        {msg.sender}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)' }}>{msg.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', margin: 0, lineHeight: 1.45 }}>
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Type mediation instructions or tribunal query..."
                  value={newChatMessage}
                  onChange={e => setNewChatMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendMessage(selectedDispute.id);
                  }}
                  className="rf-input"
                  style={{ fontSize: '0.8125rem' }}
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage(selectedDispute.id)}
                  className="rf-btn rf-btn-primary"
                  style={{ padding: '0.45rem 1rem' }}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Tribunal Decision & Resolution Execution Panel */}
            <div style={{ background: 'linear-gradient(135deg, rgba(10, 26, 18, 0.9), rgba(6, 20, 13, 0.95))', border: '1px solid rgba(102, 187, 42, 0.4)', padding: '1.5rem', borderRadius: 'var(--rf-radius-lg)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Scale size={18} color="var(--rf-leaf-green)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Execute Binding Tribunal Verdict
                </h4>
              </div>

              {/* Split percentage selector */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                    Split Allocation: {talentSplitPercentage}% Talent / {100 - talentSplitPercentage}% Client
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 800 }}>
                    Talent receives {formatMoney(createMoney(Math.round((selectedDispute.disputed_amount.amount_minor * talentSplitPercentage) / 100), selectedDispute.disputed_amount.currency))}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={talentSplitPercentage}
                  onChange={e => setTalentSplitPercentage(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--rf-leaf-green)' }}
                />
              </div>

              {/* Arbiter Note input */}
              <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  Tribunal Verdict Rationale & Statement (Published to Case Ledger)
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter official rationale for the decision..."
                  value={arbiterVerdictNotes}
                  onChange={e => setArbiterVerdictNotes(e.target.value)}
                  className="rf-input"
                  style={{ fontSize: '0.8125rem', resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleExecuteTribunalResolution('RESOLVED_TALENT')}
                  className="rf-btn rf-btn-mint"
                  style={{ fontWeight: 800, gap: '0.4rem' }}
                >
                  <CheckCircle2 size={15} />
                  <span>Release 100% to Talent</span>
                </button>

                <button
                  onClick={() => handleExecuteTribunalResolution('RESOLVED_CLIENT')}
                  className="rf-btn rf-btn-danger"
                  style={{ fontWeight: 800, gap: '0.4rem' }}
                >
                  <XCircle size={15} />
                  <span>Refund 100% to Client</span>
                </button>

                <button
                  onClick={() => handleExecuteTribunalResolution('PARTIAL_SETTLEMENT')}
                  className="rf-btn rf-btn-primary"
                  style={{ fontWeight: 800, gap: '0.4rem', background: '#F6B21A', color: '#07160D' }}
                >
                  <Scale size={15} />
                  <span>Execute {talentSplitPercentage}/{100 - talentSplitPercentage} Split</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FILE NEW DISPUTE CLAIM MODAL */}
      {showFileDisputeModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 10, 6, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
          onClick={() => setShowFileDisputeModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #07170E 0%, #030F08 100%)',
              border: '1px solid rgba(244, 185, 66, 0.4)',
              borderRadius: 'var(--rf-radius-xl)',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#F4B942', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <AlertTriangle size={14} />
                  <span>ESCROW PROTECTION DESK</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--rf-cream)', margin: '0.2rem 0' }}>
                  File Formal Dispute Claim
                </h3>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Submit milestone disagreement to Refeir Arbitration Tribunal. Escrow funds will remain locked until mediated.
                </p>
              </div>

              <button
                onClick={() => setShowFileDisputeModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--rf-slate-300)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFileDisputeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="rf-form-group">
                <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  Target Project *
                </label>
                <select
                  className="rf-select"
                  value={filingProjectId}
                  onChange={e => setFilingProjectId(e.target.value)}
                  style={{ fontSize: '0.875rem' }}
                >
                  {projectsList.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({formatMoney(p.project_amount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="rf-form-group">
                <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  Grievance Category *
                </label>
                <select
                  className="rf-select"
                  value={filingReason}
                  onChange={e => setFilingReason(e.target.value)}
                  style={{ fontSize: '0.875rem' }}
                >
                  <option value="Scope Alignment & Spec Discrepancy">Scope Alignment & Spec Discrepancy</option>
                  <option value="Missed Milestone Delivery Deadline">Missed Milestone Delivery Deadline</option>
                  <option value="Code Quality & SLA Benchmark Failure">Code Quality & SLA Benchmark Failure</option>
                  <option value="Deliverable Approval Refusal Without Justification">Deliverable Approval Refusal Without Justification</option>
                  <option value="Unresponsive Counterparty">Unresponsive Counterparty</option>
                  <option value="Intellectual Property & Asset Transfer Failure">Intellectual Property & Asset Transfer Failure</option>
                </select>
              </div>

              <div className="rf-form-group">
                <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  Detailed Grievance Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the exact deliverables in dispute, dates, and communications..."
                  className="rf-input"
                  value={filingDescription}
                  onChange={e => setFilingDescription(e.target.value)}
                  style={{ fontSize: '0.875rem', resize: 'vertical' }}
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                  Evidence / Deliverables URL (GitHub PR, Figma link, Demo preview)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/... or https://figma.com/..."
                  className="rf-input"
                  value={filingEvidenceUrl}
                  onChange={e => setFilingEvidenceUrl(e.target.value)}
                  style={{ fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowFileDisputeModal(false)}
                  className="rf-btn rf-btn-secondary"
                  style={{ fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rf-btn rf-btn-primary"
                  style={{ fontWeight: 800, gap: '0.45rem', background: '#FF6B6B', borderColor: '#FF6B6B' }}
                >
                  <AlertTriangle size={16} />
                  <span>Lock Escrow & Submit for Mediation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
