import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole, ReviewType } from '../../types';
import {
  Star,
  CheckCircle2,
  X,
  ShieldCheck,
  Send,
  DollarSign,
  Clock,
  Sparkles,
  Award,
  ThumbsUp,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetName: string;
  targetRole: UserRole;
  projectId?: string;
  projectTitle?: string;
  defaultReviewType?: ReviewType;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetName,
  targetRole,
  projectId,
  projectTitle,
  defaultReviewType
}) => {
  const { currentUser } = useAuth();
  const { submitReview } = useMarketplace();
  const { showToast } = useNotification();

  // Determine review type based on who is logged in and who is the target
  const reviewType: ReviewType = defaultReviewType || (
    currentUser?.active_role === 'TALENT' && targetRole === 'CLIENT'
      ? 'TALENT_TO_CLIENT'
      : currentUser?.active_role === 'SCOUT' && targetRole === 'CLIENT'
      ? 'SCOUT_TO_CLIENT'
      : currentUser?.active_role === 'SCOUT' && targetRole === 'TALENT'
      ? 'SCOUT_TO_TALENT'
      : 'CLIENT_TO_TALENT'
  );

  const isReviewingClient = reviewType === 'TALENT_TO_CLIENT' || reviewType === 'SCOUT_TO_CLIENT';

  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingCommunication, setRatingCommunication] = useState(5);
  const [ratingQuality, setRatingQuality] = useState(5);
  const [ratingTimeliness, setRatingTimeliness] = useState(5);

  // Client-specific payment dimensions
  const [ratingPaysWell, setRatingPaysWell] = useState(5);
  const [ratingPaysOnTime, setRatingPaysOnTime] = useState(5);

  const [comment, setComment] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(
    isReviewingClient
      ? ['⚡ Instant Milestone Release', '💎 Generous Market Rate']
      : ['Top 1% Deliverables', 'Ahead of Schedule']
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const clientBadgeOptions = [
    '⚡ Instant Milestone Release',
    '💎 Generous Market Rate',
    '🤝 Clear Requirements',
    '🛡️ Zero Escrow Friction',
    '⭐ Highly Recommended Client',
    '💬 Great Communicator'
  ];

  const talentBadgeOptions = [
    'Top 1% Deliverables',
    'Ahead of Schedule',
    'Flawless Code Quality',
    'Proactive Communicator',
    '⭐ Verified Specialist',
    'High Repeat Potential'
  ];

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const getPaysWellLabel = (score: number) => {
    if (score >= 5) return '💎 Pays Above Market (Generous Compensation)';
    if (score >= 4) return '👍 Pays Fair Industry Standard Rates';
    if (score >= 3) return '⚖️ Strict Market Budget';
    return '⚠️ Underpaying / Budget Constraints';
  };

  const getPaysOnTimeLabel = (score: number) => {
    if (score >= 5) return '⚡ 100% Instant Milestone Release';
    if (score >= 4) return '🕒 Punctual Release (Within 24 Hours)';
    if (score >= 3) return '⏳ Moderate Delay (2-3 Days)';
    return '❌ Delayed / Required Payment Follow-up';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);

    submitReview({
      project_id: projectId,
      project_title: projectTitle,
      author_id: currentUser.id,
      author_name: `${currentUser.first_name} ${currentUser.last_name}`,
      author_avatar: currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      author_country: currentUser.country || 'Nigeria',
      author_role: currentUser.active_role || 'TALENT',
      target_id: targetId,
      target_name: targetName,
      target_role: targetRole,
      review_type: reviewType,
      rating_overall: ratingOverall,
      rating_communication: ratingCommunication,
      rating_quality: !isReviewingClient ? ratingQuality : undefined,
      rating_timeliness: ratingTimeliness,
      rating_pays_well: isReviewingClient ? ratingPaysWell : undefined,
      rating_pays_on_time: isReviewingClient ? ratingPaysOnTime : undefined,
      pays_well_label: isReviewingClient ? getPaysWellLabel(ratingPaysWell) : undefined,
      pays_on_time_label: isReviewingClient ? getPaysOnTimeLabel(ratingPaysOnTime) : undefined,
      comment,
      endorsement_badges: selectedBadges
    });

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    showToast('Review Published!', `Your verified review for ${targetName} is now live on their Refeir scorecard.`);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="rf-modal-backdrop" onClick={onClose}>
      <div
        className="rf-modal-content"
        style={{ maxWidth: '580px', backgroundColor: '#07160D', border: '1.5px solid rgba(102, 187, 42, 0.45)', padding: 0 }}
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
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(102, 187, 42, 0.15)',
                border: '1px solid rgba(102, 187, 42, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--rf-leaf-green)'
              }}
            >
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                {isReviewingClient
                  ? `Review Client: ${targetName}`
                  : reviewType === 'SCOUT_TO_TALENT'
                  ? `Endorse Talent: ${targetName}`
                  : `Review Talent: ${targetName}`}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                {projectTitle ? `For Project: ${projectTitle}` : 'Verified on-platform collaboration scorecard'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          {/* Overall Star Rating */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-slate-300)', marginBottom: '0.5rem' }}>
              Overall Experience Rating
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingOverall(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    color: star <= ratingOverall ? '#F4B942' : 'rgba(255, 255, 255, 0.2)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Star size={28} fill={star <= ratingOverall ? '#F4B942' : 'none'} />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F4B942', marginTop: '0.4rem' }}>
              {ratingOverall === 5 ? '5.0 — Outstanding / Highly Recommended' : `${ratingOverall}.0 Stars`}
            </div>
          </div>

          {/* CLIENT-SPECIFIC PAYMENT REVIEWS (PAYS WELL & PAYS ON TIME) */}
          {isReviewingClient ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(102, 187, 42, 0.1) 0%, rgba(244, 185, 66, 0.08) 100%)',
                border: '1px solid rgba(102, 187, 42, 0.35)',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <ShieldCheck size={18} color="var(--rf-leaf-green)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Client Payment Integrity & Punctuality
                </span>
              </div>

              {/* 1. Pays Well Dimension */}
              <div style={{ marginBottom: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="rf-label" style={{ margin: 0 }}>Does this client pay well?</label>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F4B942' }}>
                    {ratingPaysWell} / 5 Stars
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRatingPaysWell(score)}
                      style={{
                        flex: 1,
                        padding: '0.4rem',
                        borderRadius: '6px',
                        background: score <= ratingPaysWell ? 'rgba(244, 185, 66, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: score <= ratingPaysWell ? '1px solid #F4B942' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: score <= ratingPaysWell ? '#FFFFFF' : 'var(--rf-slate-400)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {score}★
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#66BB2A', fontWeight: 700 }}>
                  {getPaysWellLabel(ratingPaysWell)}
                </div>
              </div>

              {/* 2. Pays On Time Dimension */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="rf-label" style={{ margin: 0 }}>Does this client pay on time?</label>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#66BB2A' }}>
                    {ratingPaysOnTime} / 5 Stars
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRatingPaysOnTime(score)}
                      style={{
                        flex: 1,
                        padding: '0.4rem',
                        borderRadius: '6px',
                        background: score <= ratingPaysOnTime ? 'rgba(102, 187, 42, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: score <= ratingPaysOnTime ? '1px solid #66BB2A' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: score <= ratingPaysOnTime ? '#FFFFFF' : 'var(--rf-slate-400)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {score}★
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#66BB2A', fontWeight: 700 }}>
                  {getPaysOnTimeLabel(ratingPaysOnTime)}
                </div>
              </div>
            </div>
          ) : (
            /* Talent Deliverable Rating Breakdown */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="rf-form-group">
                <label className="rf-label">Deliverable Quality</label>
                <select className="rf-select" value={ratingQuality} onChange={e => setRatingQuality(parseInt(e.target.value))}>
                  <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ (4.0 - Good)</option>
                  <option value={3}>⭐⭐⭐ (3.0 - Satisfactory)</option>
                </select>
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Communication</label>
                <select className="rf-select" value={ratingCommunication} onChange={e => setRatingCommunication(parseInt(e.target.value))}>
                  <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Prompt & Clear)</option>
                  <option value={4}>⭐⭐⭐⭐ (4.0 - Responsive)</option>
                  <option value={3}>⭐⭐⭐ (3.0 - Adequate)</option>
                </select>
              </div>
            </div>
          )}

          {/* Endorsement Badges */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="rf-label">Select Recommendation Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(isReviewingClient ? clientBadgeOptions : talentBadgeOptions).map(badge => (
                <button
                  key={badge}
                  type="button"
                  onClick={() => toggleBadge(badge)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: selectedBadges.includes(badge) ? 'rgba(102, 187, 42, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedBadges.includes(badge) ? '1px solid #66BB2A' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: selectedBadges.includes(badge) ? '#FFFFFF' : 'var(--rf-slate-400)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {selectedBadges.includes(badge) ? '✓ ' : '+ '} {badge}
                </button>
              ))}
            </div>
          </div>

          {/* Written Feedback */}
          <div className="rf-form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="rf-label">Detailed Feedback & Review</label>
            <textarea
              required
              rows={4}
              className="rf-textarea"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={
                isReviewingClient
                  ? 'Share your experience with this client: milestone funding speed, clarity of scope, promptness of payment release...'
                  : 'Share your feedback on the deliverables, expertise, and working collaboration...'
              }
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* Submit Buttons */}
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
              disabled={submitting}
              className="rf-btn rf-btn-primary"
              style={{ flex: 1, gap: '0.5rem', fontWeight: 800 }}
            >
              <Send size={15} />
              <span>Publish Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
