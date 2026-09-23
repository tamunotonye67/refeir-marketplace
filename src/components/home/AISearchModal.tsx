import React, { useState, useEffect } from 'react';
import { Star, Info, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SEED_TALENT } from '../../data/seedTalent';
import { TalentProfile } from '../../types';

interface AISearchModalProps {
  isOpen: boolean;
  searchQuery: string;
  intent: 'recruit' | 'work' | 'scout';
  onClose: () => void;
  onContinue: (query: string, intent: 'recruit' | 'work' | 'scout') => void;
  onNavigate: (path: string) => void;
}

export const AISearchModal: React.FC<AISearchModalProps> = ({
  isOpen,
  searchQuery,
  intent,
  onClose,
  onContinue,
  onNavigate
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [phase, setPhase] = useState<'loading' | 'results'>('loading');
  const [matchedTalent, setMatchedTalent] = useState<TalentProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPhase('loading');
      const timer = setTimeout(() => {
        setPhase('results');
      }, 1900);

      // Filter 4 matching talents based on the query keywords or fallback to top rated
      const q = searchQuery.toLowerCase().trim();
      const filtered = SEED_TALENT.filter(t => {
        if (!q) return true;
        const inSkills = t.skills?.some(s => s.toLowerCase().includes(q) || q.includes(s.toLowerCase()));
        const inHeadline = t.headline?.toLowerCase().includes(q);
        const inBio = t.bio?.toLowerCase().includes(q);
        return inSkills || inHeadline || inBio;
      });

      // If we don't have 4 exact keyword matches, pad with top-rated seed talents
      const combined = [...filtered];
      for (const t of SEED_TALENT) {
        if (combined.length >= 4) break;
        if (!combined.some(item => item.id === t.id)) {
          combined.push(t);
        }
      }

      setMatchedTalent(combined.slice(0, 4));

      return () => clearTimeout(timer);
    }
  }, [isOpen, searchQuery]);

  if (!isOpen) return null;

  // Format short name: "Amaka N."
  const formatShortName = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1].charAt(0)}.`;
  };

  // Dynamic Headline formatting
  const getHeadline = () => {
    const displayQuery = searchQuery ? searchQuery.toLowerCase() : 'tech & creative';
    if (intent === 'work') {
      return `We found thousands of top client gigs & projects for ${displayQuery}`;
    }
    if (intent === 'scout') {
      return `We found thousands of high-yield referral bounties for ${displayQuery}`;
    }
    return `We found thousands of top-rated ${displayQuery} pros`;
  };

  const getLoadingActionText = () => {
    if (intent === 'work') return 'Searching open opportunities & projects for';
    if (intent === 'scout') return 'Scouting verified talent & referral bounties for';
    return 'Searching talent for';
  };

  return (
    <div
      className={`rf-ai-search-overlay ${isDark ? 'is-dark' : 'is-light'}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Top Left Exit Button */}
      <div className="rf-ai-search-topbar">
        <button
          type="button"
          onClick={onClose}
          className="rf-ai-search-exit-btn"
          aria-label="Exit search"
        >
          Exit
        </button>
      </div>

      {phase === 'loading' ? (
        /* =========================================================================
           PHASE 1: REVOLVING POLYGON AI LOADER
           ========================================================================= */
        <div className="rf-ai-search-loading-container">
          {/* 3D Revolving Multi-Ring Polygon */}
          <div className="rf-polygon-stage">
            <div className="rf-polygon-rotator">
              <svg
                viewBox="0 0 200 200"
                className="rf-polygon-svg"
                aria-hidden="true"
              >
                {/* 12-petaled revolving geometric polygon rosette */}
                {[...Array(12)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx="100"
                    cy="100"
                    rx="68"
                    ry="24"
                    transform={`rotate(${i * 15} 100 100)`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="rf-polygon-petal"
                    style={{
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
                {/* Inner central focal ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="14"
                  fill="none"
                  stroke="#66BB2A"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* AI Search Subtext */}
          <div className="rf-ai-search-loading-text">
            <span className="rf-ai-search-loading-label">{getLoadingActionText()}</span>
            <h3 className="rf-ai-search-loading-query">‘{searchQuery || 'Pan-African Talent'}’</h3>
          </div>
        </div>
      ) : (
        /* =========================================================================
           PHASE 2: MINIMALIST RESULTS PREVIEW SHOWCASE
           ========================================================================= */
        <div className="rf-ai-search-results-container">
          {/* Subtle Constellation Particle Backdrop */}
          <div className="rf-ai-search-particles" aria-hidden="true">
            <div className="rf-particle p1" />
            <div className="rf-particle p2" />
            <div className="rf-particle p3" />
            <div className="rf-particle p4" />
            <div className="rf-particle p5" />
            <div className="rf-particle p6" />
            <div className="rf-particle p7" />
            <div className="rf-particle p8" />
          </div>

          <div className="rf-ai-search-results-card">
            {/* Left Column: Heading, Stars, CTA & Info Links */}
            <div className="rf-ai-search-left-col">
              <h1 className="rf-ai-search-title">{getHeadline()}</h1>

              {/* Star Rating Section */}
              <div className="rf-ai-search-rating-row">
                <div className="rf-ai-search-stars">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={18} fill="#F6B21A" color="#F6B21A" />
                  ))}
                </div>
                <span className="rf-ai-search-score">4.8</span>
              </div>
              <div className="rf-ai-search-rating-desc">Rated 4.8 / 5 on avg.</div>
              <div className="rf-ai-search-rating-sub">From over 4k+ past clients</div>

              {/* Primary Continue Button */}
              <button
                type="button"
                onClick={() => onContinue(searchQuery, intent)}
                className="rf-ai-search-continue-btn"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>

              {/* Quick Context Links */}
              <div className="rf-ai-search-links-row">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('/why-refeir');
                  }}
                  className="rf-ai-search-link"
                >
                  How hiring works
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('/pricing');
                  }}
                  className="rf-ai-search-link"
                >
                  Platform pricing
                </button>
              </div>

              {/* Footer AI Attribution */}
              <div className="rf-ai-search-footer-note">
                <span>We use AI to power this experience.</span>
                <Info size={14} className="rf-ai-info-icon" />
              </div>
            </div>

            {/* Right Column: 2x2 Curated Matching Talent Cards */}
            <div className="rf-ai-search-right-col">
              <div className="rf-ai-talent-grid">
                {matchedTalent.map((talent) => (
                  <div
                    key={talent.id}
                    className="rf-ai-talent-card"
                    onClick={() => {
                      onClose();
                      onNavigate(`/profile/${talent.user_id || talent.id}`);
                    }}
                    title={`View ${talent.full_name}'s verified profile`}
                  >
                    {/* Avatar Container with Online Dot & Star Badge */}
                    <div className="rf-ai-talent-avatar-wrap">
                      <img
                        src={talent.avatar_url}
                        alt={talent.full_name}
                        className="rf-ai-talent-avatar"
                        loading="lazy"
                      />
                      {/* Active Status Dot */}
                      <span className="rf-ai-talent-status-dot" title="Available now" />
                      {/* Verified Star Badge */}
                      <span className="rf-ai-talent-verified-badge">
                        <Star size={11} fill="#FFFFFF" color="#FFFFFF" />
                      </span>
                    </div>

                    <div className="rf-ai-talent-name">{formatShortName(talent.full_name)}</div>
                    <div className="rf-ai-talent-role">{talent.headline}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
