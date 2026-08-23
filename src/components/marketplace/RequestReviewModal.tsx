import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole, Project } from '../../types';
import {
  Star,
  Send,
  X,
  UserCheck,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProjectId?: string;
  preselectedTargetId?: string;
  preselectedTargetRole?: UserRole;
  preselectedTargetName?: string;
}

export const RequestReviewModal: React.FC<RequestReviewModalProps> = ({
  isOpen,
  onClose,
  preselectedProjectId,
  preselectedTargetId,
  preselectedTargetRole = 'CLIENT',
  preselectedTargetName
}) => {
  const { currentUser } = useAuth();
  const { projectsList, scoutsList, requestReview } = useMarketplace();
  const { showToast } = useNotification();

  const [reviewTargetType, setReviewTargetType] = useState<'CLIENT' | 'SCOUT'>(
    preselectedTargetRole === 'SCOUT' ? 'SCOUT' : 'CLIENT'
  );
  const [selectedProjectId, setSelectedProjectId] = useState(preselectedProjectId || '');
  const [selectedScoutId, setSelectedScoutId] = useState(
    preselectedTargetRole === 'SCOUT' && preselectedTargetId ? preselectedTargetId : scoutsList[0]?.id || ''
  );
  const [customMessage, setCustomMessage] = useState(
    reviewTargetType === 'CLIENT'
      ? 'Hi! Thank you for the opportunity to work together on this project. Could you please take a moment to leave an honest review on my Refeir profile regarding the deliverables and communication?'
      : 'Hi! Thank you for scouting and connecting me with this client opportunity. Could you please leave a verified scout endorsement on my Refeir profile?'
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Filter projects completed or active by current talent
  const talentProjects = projectsList.filter(
    p => p.talent_id === (currentUser?.id || 'talent-amaka-nwosu') || p.talent_name.includes(currentUser?.first_name || 'Amaka')
  );

  const activeProject = talentProjects.find(p => p.id === selectedProjectId) || talentProjects[0];
  const activeScout = scoutsList.find(s => s.id === selectedScoutId) || scoutsList[0];

  const handleTargetTypeChange = (type: 'CLIENT' | 'SCOUT') => {
    setReviewTargetType(type);
    if (type === 'CLIENT') {
      setCustomMessage(
        'Hi! Thank you for the opportunity to work together on this project. Could you please take a moment to leave an honest review on my Refeir profile regarding the deliverables and communication?'
      );
    } else {
      setCustomMessage(
        'Hi! Thank you for scouting and connecting me with this client opportunity. Could you please leave a verified scout endorsement on my Refeir profile?'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (reviewTargetType === 'CLIENT') {
      const clientName = preselectedTargetName || activeProject?.client_name || 'David Kamau';
      const clientId = preselectedTargetId || activeProject?.client_id || 'user-client-kenya';

      requestReview({
        requester_id: currentUser.id,
        requester_name: `${currentUser.first_name} ${currentUser.last_name}`,
        requester_role: currentUser.active_role || 'TALENT',
        requester_avatar: currentUser.avatar_url,
        target_id: clientId,
        target_name: clientName,
        target_role: 'CLIENT',
        project_id: activeProject?.id,
        project_title: activeProject?.title || 'Completed Milestone Contract',
        custom_message: customMessage
      });

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}

      setSubmitted(true);
      showToast('Review Request Dispatched!', `Invitation sent to ${clientName}. You'll be notified when they submit their review.`);
    } else {
      const scoutName = preselectedTargetName || activeScout?.full_name || 'Sarah Adeyemi';
      const scoutId = preselectedTargetId || activeScout?.id || 'user-sarah';

      requestReview({
        requester_id: currentUser.id,
        requester_name: `${currentUser.first_name} ${currentUser.last_name}`,
        requester_role: currentUser.active_role || 'TALENT',
        requester_avatar: currentUser.avatar_url,
        target_id: scoutId,
        target_name: scoutName,
        target_role: 'SCOUT',
        project_id: activeProject?.id,
        project_title: activeProject?.title || 'Scouted Engagement',
        custom_message: customMessage
      });

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}

      setSubmitted(true);
      showToast('Endorsement Request Dispatched!', `Invitation sent to Scout ${scoutName}.`);
    }

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="rf-modal-backdrop" onClick={onClose}>
      <div
        className="rf-modal-content"
        style={{ maxWidth: '540px', backgroundColor: '#0B1E13', border: '1.5px solid rgba(102, 187, 42, 0.4)', padding: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(102, 187, 42, 0.15)',
                border: '1px solid rgba(102, 187, 42, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--rf-leaf-green)'
              }}
            >
              <Star size={18} fill="currentColor" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                Request a Review or Endorsement
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                Build your verified reputational proof across pan-African clients and scouts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rf-btn-ghost"
            style={{ color: 'var(--rf-slate-400)', padding: '0.25rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.75rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(102, 187, 42, 0.2)',
                  border: '2px solid var(--rf-leaf-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  color: 'var(--rf-leaf-green)'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Request Sent Successfully!
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', maxWidth: '380px', margin: '0 auto' }}>
                The recipient has received an on-platform review invite and action prompt.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Target Type Selector: From Client vs From Scout */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="rf-label" style={{ marginBottom: '0.6rem' }}>Who would you like a review from?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => handleTargetTypeChange('CLIENT')}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: reviewTargetType === 'CLIENT' ? 'rgba(102, 187, 42, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: reviewTargetType === 'CLIENT' ? '2px solid #66BB2A' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: reviewTargetType === 'CLIENT' ? '#FFFFFF' : 'var(--rf-slate-300)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Briefcase size={18} color={reviewTargetType === 'CLIENT' ? '#66BB2A' : 'var(--rf-slate-400)'} />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>From a Client</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>Project milestone review</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTargetTypeChange('SCOUT')}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: reviewTargetType === 'SCOUT' ? 'rgba(102, 187, 42, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: reviewTargetType === 'SCOUT' ? '2px solid #66BB2A' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: reviewTargetType === 'SCOUT' ? '#FFFFFF' : 'var(--rf-slate-300)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Award size={18} color={reviewTargetType === 'SCOUT' ? '#66BB2A' : 'var(--rf-slate-400)'} />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>From a Scout</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>Scout skill endorsement</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Client / Project Picker */}
              {reviewTargetType === 'CLIENT' ? (
                <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="rf-label">Select Client / Completed Project</label>
                  {talentProjects.length > 0 ? (
                    <select
                      className="rf-select"
                      value={selectedProjectId}
                      onChange={e => setSelectedProjectId(e.target.value)}
                    >
                      {talentProjects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.client_name} — {p.title} ({p.status})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
                      Default Client: <strong>David Kamau (Nairobi FinTech Ltd)</strong>
                    </div>
                  )}
                </div>
              ) : (
                /* Scout Picker */
                <div className="rf-form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="rf-label">Select Scout to Request Endorsement From</label>
                  <select
                    className="rf-select"
                    value={selectedScoutId}
                    onChange={e => setSelectedScoutId(e.target.value)}
                  >
                    {scoutsList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} ({s.tier} • {s.country_name})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Invitation Note */}
              <div className="rf-form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="rf-label">Custom Request Message</label>
                <textarea
                  required
                  rows={4}
                  className="rf-textarea"
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  placeholder="Personalize your request message..."
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="rf-btn rf-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rf-btn rf-btn-primary"
                  style={{ flex: 1, gap: '0.5rem', fontWeight: 800 }}
                >
                  <Send size={15} />
                  <span>Send Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
