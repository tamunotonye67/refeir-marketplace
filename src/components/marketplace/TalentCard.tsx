import React from 'react';
import { TalentProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CountryFlag } from '../common/CountryFlag';
import { formatCompactMoney } from '../../data/currencies';
import { Star, CheckCircle2, Sparkles, ArrowRight, Eye, Briefcase, Users } from 'lucide-react';

interface TalentCardProps {
  talent: TalentProfile;
  onSelect: (talent: TalentProfile) => void;
  onRefer: (talent: TalentProfile) => void;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  talent,
  onSelect,
  onRefer
}) => {
  const { currentUser } = useAuth();
  const activeRole = currentUser?.active_role;
  return (
    <div
      className={`rf-card rf-card-interactive ${talent.is_pro || talent.is_featured ? 'rf-card-featured-pro' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Featured Talent Ribbon */}
      {(talent.is_pro || talent.is_featured) && (
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            right: '16px',
            background: 'linear-gradient(135deg, #F4B942, #E5A024)',
            color: '#07160D',
            fontSize: '0.6875rem',
            fontWeight: 800,
            padding: '0.2rem 0.65rem',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: '0 4px 12px rgba(244, 185, 66, 0.3)',
            zIndex: 3,
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}
        >
          <span>PRO FEATURED</span>
        </div>
      )}

      {/* Top Row: Avatar, Name, Verification, Country */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={talent.avatar_url}
            alt={talent.full_name}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: talent.is_pro || talent.is_featured ? '2.5px solid #F4B942' : '2px solid var(--rf-navy-border)',
              display: 'block'
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
            <h3
              onClick={() => onSelect(talent)}
              style={{
                fontSize: '1.0625rem',
                fontWeight: 800,
                color: 'var(--rf-cream)',
                cursor: 'pointer'
              }}
            >
              {talent.full_name}
            </h3>
            {talent.verification_status === 'PROFESSION_VERIFIED' && (
              <span title="Verified Professional" style={{ display: 'inline-flex' }}>
                <CheckCircle2 size={16} color="var(--rf-mint)" />
              </span>
            )}
          </div>
          <div style={{ marginTop: '2px', marginBottom: '4px' }}>
            <CountryFlag countryIsoOrName={talent.country_name} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
            <Star size={14} fill="#FDB022" color="#FDB022" />
            <span style={{ fontWeight: 700, color: 'var(--rf-cream)' }}>{talent.rating}</span>
            <span style={{ color: 'var(--rf-slate-400)' }}>({talent.reviews_count} reviews)</span>
          </div>
        </div>
      </div>

      {/* Headline & Bio */}
      <div style={{ marginBottom: '0.85rem', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
        <h4
          onClick={() => onSelect(talent)}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--rf-cream)',
            lineHeight: 1.4,
            marginBottom: '0.35rem',
            minHeight: '2.5em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          {talent.headline}
        </h4>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--rf-slate-400)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.9em',
            margin: 0
          }}
        >
          {talent.bio}
        </p>
      </div>

      {/* Skills Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem', minHeight: '32px', alignItems: 'center' }}>
        {talent.skills.slice(0, 4).map(skill => (
          <span
            key={skill}
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--rf-radius-sm)',
              background: 'var(--rf-bg-surface-hover)',
              color: 'var(--rf-slate-300)',
              border: '1px solid var(--rf-bg-card-border)',
              whiteSpace: 'nowrap'
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Pricing & Referral Reward Bottom Bar */}
      <div
        style={{
          borderTop: '1px solid var(--rf-navy-border)',
          paddingTop: '1rem',
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--rf-slate-400)', textTransform: 'uppercase' }}>
            Starting at
          </span>
          <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)', whiteSpace: 'nowrap' }}>
            {formatCompactMoney(talent.starting_price)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
          {activeRole === 'CLIENT' ? (
            /* CLIENT MODE: Only Hire button, strictly NO Refer button */
            <>
              <button
                onClick={() => onSelect(talent)}
                className="rf-btn rf-btn-primary rf-btn-sm"
                style={{ fontWeight: 800, padding: '0.4rem 0.85rem', gap: '0.35rem' }}
                title="Hire this talent via Trust Vault"
              >
                <Briefcase size={13} />
                <span>Hire Talent</span>
              </button>
              <button
                onClick={() => onSelect(talent)}
                className="rf-btn rf-btn-secondary rf-btn-sm"
                title="View Profile Details"
                aria-label="View Profile"
                style={{
                  padding: '0.35rem 0.6rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '34px',
                  height: '32px'
                }}
              >
                <Eye size={16} className="rf-eye-animated" />
              </button>
            </>
          ) : activeRole === 'SCOUT' ? (
            /* SCOUT MODE: Only Refer button & View Profile, NO Hire button */
            <>
              <button
                onClick={() => onRefer(talent)}
                className="rf-btn rf-btn-mint rf-btn-sm"
                title="Refer this talent & earn locked commission"
                style={{ fontWeight: 800, gap: '0.3rem' }}
              >
                <Sparkles size={12} />
                <span>Refer ({talent.referral_percentage}%)</span>
              </button>
              <button
                onClick={() => onSelect(talent)}
                className="rf-btn rf-btn-secondary rf-btn-sm"
                title="View Profile Details"
                aria-label="View Profile"
                style={{
                  padding: '0.35rem 0.6rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '34px',
                  height: '32px'
                }}
              >
                <Eye size={16} className="rf-eye-animated" />
              </button>
            </>
          ) : activeRole === 'TALENT' ? (
            /* TALENT MODE: Portfolio & Networking View */
            <button
              onClick={() => onSelect(talent)}
              className="rf-btn rf-btn-secondary rf-btn-sm"
              style={{ fontWeight: 700, padding: '0.4rem 0.85rem', gap: '0.35rem' }}
            >
              <Eye size={14} />
              <span>View Profile</span>
            </button>
          ) : (
            /* GUEST MODE: Both options available */
            <>
              <button
                onClick={() => onSelect(talent)}
                className="rf-btn rf-btn-primary rf-btn-sm"
                style={{ fontWeight: 800 }}
              >
                <span>Hire</span>
              </button>
              <button
                onClick={() => onRefer(talent)}
                className="rf-btn rf-btn-mint rf-btn-sm"
                title="Refer this talent & earn"
              >
                <span>Refer ({talent.referral_percentage}%)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
