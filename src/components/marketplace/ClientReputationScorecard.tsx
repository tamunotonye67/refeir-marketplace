import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useTheme } from '../../context/ThemeContext';
import { ShieldCheck, Star, Clock, DollarSign, Award, ThumbsUp } from 'lucide-react';

interface ClientReputationScorecardProps {
  clientId: string;
  clientName?: string;
  showReviewsList?: boolean;
  onReviewClient?: () => void;
}

export const ClientReputationScorecard: React.FC<ClientReputationScorecardProps> = ({
  clientId,
  clientName,
  showReviewsList = false,
  onReviewClient
}) => {
  const { getClientScorecard, getReviewsForTarget } = useMarketplace();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const scorecard = getClientScorecard(clientId, clientName);
  const clientReviews = getReviewsForTarget(clientId);

  return (
    <div
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(10, 28, 18, 0.95) 0%, rgba(8, 20, 14, 0.98) 100%)'
          : '#F8FAFC',
        border: isDark ? '1.5px solid rgba(102, 187, 42, 0.35)' : '1px solid rgba(18, 43, 26, 0.12)',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.35)' : '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: isDark ? '#66BB2A' : '#16A34A', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <ShieldCheck size={14} />
            <span>VERIFIED CLIENT REPUTATION SCORECARD</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', margin: 0 }}>
            {scorecard.client_name}
          </h3>
        </div>

        {onReviewClient && (
          <button
            onClick={onReviewClient}
            className="rf-btn rf-btn-mint rf-btn-sm"
            style={{ fontSize: '0.8125rem', gap: '0.4rem', fontWeight: 800 }}
          >
            <Star size={13} />
            <span>Rate This Client</span>
          </button>
        )}
      </div>

      {/* 3 Metric Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* On-Time Payer Metric */}
        <div style={{ padding: '0.85rem 1rem', background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF', border: isDark ? '1px solid rgba(102, 187, 42, 0.25)' : '1px solid #BBF7D0', borderRadius: '12px', boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? '#66BB2A' : '#16A34A', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
            <Clock size={13} />
            <span>Pays On Time</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
            {scorecard.pays_on_time_percentage}%
          </div>
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#64748B' }}>
            {scorecard.on_time_release_count} on-time releases
          </div>
        </div>

        {/* Pays Well Metric */}
        <div style={{ padding: '0.85rem 1rem', background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF', border: isDark ? '1px solid rgba(244, 185, 66, 0.25)' : '1px solid #FED7AA', borderRadius: '12px', boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? '#F4B942' : '#D97706', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
            <DollarSign size={13} />
            <span>Pays Well</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
            {scorecard.pays_well_score} / 5.0
          </div>
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#64748B' }}>
            Fair / Above Market Rates
          </div>
        </div>

        {/* Overall Trust Rating */}
        <div style={{ padding: '0.85rem 1rem', background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0', borderRadius: '12px', boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? 'var(--rf-slate-300)' : '#475569', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
            <Star size={13} color="#F4B942" fill="#F4B942" />
            <span>Overall Score</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#122B1A' }}>
            {scorecard.overall_rating} ★
          </div>
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#64748B' }}>
            From {scorecard.total_reviews_count} Talents & Scouts
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: showReviewsList ? '1.5rem' : 0 }}>
        {scorecard.top_badges.map((badge, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: isDark ? 'rgba(102, 187, 42, 0.15)' : '#DCFCE7',
              border: isDark ? '1px solid rgba(102, 187, 42, 0.3)' : '1px solid #86EFAC',
              color: isDark ? '#66BB2A' : '#15803D'
            }}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Itemized Reviews List */}
      {showReviewsList && clientReviews.length > 0 && (
        <div style={{ borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A', marginBottom: '0.85rem' }}>
            Reviews & Payment Feedback from Talents & Scouts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {clientReviews.map(r => (
              <div
                key={r.id}
                style={{
                  padding: '1rem',
                  background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={r.author_avatar}
                      alt={r.author_name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#122B1A' }}>
                        {r.author_name}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: isDark ? '#94A3B8' : '#64748B', marginLeft: '0.4rem' }}>
                        ({r.author_role === 'TALENT' ? 'Hired Talent' : 'Recommending Scout'}) • {r.author_country}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F4B942' }}>
                    {r.rating_overall} ★
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: isDark ? '#CBD5E1' : '#334155', lineHeight: 1.4, margin: '0 0 0.5rem 0' }}>
                  "{r.comment}"
                </p>

                {(r.pays_well_label || r.pays_on_time_label) && (
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.7rem', color: isDark ? '#66BB2A' : '#16A34A', fontWeight: 700 }}>
                    {r.pays_on_time_label && <span>✓ {r.pays_on_time_label}</span>}
                    {r.pays_well_label && <span>• {r.pays_well_label}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
