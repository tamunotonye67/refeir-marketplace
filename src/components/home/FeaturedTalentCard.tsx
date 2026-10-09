import React from 'react';
import { TalentProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight } from 'lucide-react';

interface FeaturedTalentCardProps {
  talent: TalentProfile;
  onSelect: (talent: TalentProfile) => void;
}

export const FeaturedTalentCard: React.FC<FeaturedTalentCardProps> = ({
  talent,
  onSelect
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      onClick={() => onSelect(talent)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(talent);
        }
      }}
      className="rf-talent-profile-card group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: isDark ? 'var(--rf-navy-surface, #0B1E13)' : '#FFFFFF',
        border: isDark ? '1px solid var(--rf-navy-border, rgba(255, 255, 255, 0.08))' : '1px solid rgba(15, 23, 42, 0.08)',
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isDark
          ? '0 10px 24px -10px rgba(0, 0, 0, 0.45)'
          : '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',
        position: 'relative'
      }}
    >
      {/* Portrait Photo Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '270px',
          overflow: 'hidden',
          backgroundColor: isDark ? '#07160D' : '#F1F5F9'
        }}
      >
        <img
          src={talent.avatar_url}
          alt={talent.full_name}
          className="rf-talent-card-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            display: 'block',
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />

        {/* Subtle Dark Gradient Overlay for seamless blend */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? 'linear-gradient(to top, rgba(11, 30, 19, 0.95) 0%, rgba(11, 30, 19, 0.2) 40%, transparent 100%)'
              : 'linear-gradient(to top, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Minimal Country Tag */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            backgroundColor: 'rgba(8, 24, 15, 0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            padding: '0.25rem 0.65rem',
            borderRadius: '100px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          {talent.country_name}
        </div>
      </div>

      {/* Profile Details & Talents */}
      <div
        style={{
          padding: '1.35rem 1.4rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        {/* Full Name */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: isDark ? 'var(--rf-cream, #FFFFFF)' : '#0F172A',
            letterSpacing: '-0.015em',
            margin: '0 0 0.35rem 0',
            lineHeight: 1.25
          }}
        >
          {talent.full_name}
        </h3>

        {/* Talent Role / Craft */}
        <p
          style={{
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: isDark ? 'var(--rf-mint, #36E0A0)' : '#15803D',
            margin: '0 0 0.65rem 0',
            lineHeight: 1.4
          }}
        >
          {talent.headline}
        </p>

        {/* Bio Snippet */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: isDark ? 'var(--rf-slate-300, #CBD5E1)' : '#64748B',
            lineHeight: 1.55,
            margin: '0 0 1rem 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {talent.bio}
        </p>

        {/* Talent Skill Tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.375rem',
            marginBottom: '1.25rem',
            marginTop: 'auto'
          }}
        >
          {talent.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: isDark ? 'var(--rf-slate-200, #E2E8F0)' : '#334155',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px'
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Modern Clean Call to Action */}
        <div
          style={{
            paddingTop: '0.85rem',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: isDark ? 'var(--rf-leaf-green, #66BB2A)' : '#16A34A',
            fontSize: '0.875rem',
            fontWeight: 600
          }}
        >
          <span>View Profile</span>
          <ArrowRight size={15} className="rf-talent-card-arrow" style={{ transition: 'transform 0.25s ease' }} />
        </div>
      </div>
    </div>
  );
};
