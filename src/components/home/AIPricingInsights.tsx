import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface AIPricingInsightsProps {
  onNavigate: (path: string) => void;
}

interface PriceEstimate {
  query: string;
  role: string;
  hourlyRange: string;
  fixedRange: string;
  typicalTurnaround: string;
  availableTalents: number;
}

const SAMPLE_ESTIMATES: Record<string, PriceEstimate> = {
  mobile: {
    query: 'Mobile App Development',
    role: 'Senior Flutter / React Native Engineer',
    hourlyRange: '$35 - $65/hr',
    fixedRange: '$2,400 - $5,500',
    typicalTurnaround: '3 - 6 Weeks',
    availableTalents: 140
  },
  design: {
    query: 'Product & UI/UX Design',
    role: 'Lead Product & Design System Designer',
    hourlyRange: '$30 - $55/hr',
    fixedRange: '$1,500 - $3,800',
    typicalTurnaround: '2 - 4 Weeks',
    availableTalents: 185
  },
  ai: {
    query: 'AI & Machine Learning Integration',
    role: 'AI Engineer / LLM Specialist',
    hourlyRange: '$45 - $85/hr',
    fixedRange: '$3,000 - $7,500',
    typicalTurnaround: '2 - 5 Weeks',
    availableTalents: 95
  },
  web: {
    query: 'Fullstack Web Application',
    role: 'Senior React & Node.js Developer',
    hourlyRange: '$32 - $60/hr',
    fixedRange: '$2,000 - $4,800',
    typicalTurnaround: '3 - 5 Weeks',
    availableTalents: 220
  }
};

export const AIPricingInsights: React.FC<AIPricingInsightsProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [prompt, setPrompt] = useState('');
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const calculateEstimate = (text: string) => {
    if (!text.trim()) return;
    setIsCalculating(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let matched: PriceEstimate;

      if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('figma')) {
        matched = { ...SAMPLE_ESTIMATES.design, query: text };
      } else if (lower.includes('ai') || lower.includes('ml') || lower.includes('bot') || lower.includes('data')) {
        matched = { ...SAMPLE_ESTIMATES.ai, query: text };
      } else if (lower.includes('mobile') || lower.includes('app') || lower.includes('flutter') || lower.includes('ios') || lower.includes('android')) {
        matched = { ...SAMPLE_ESTIMATES.mobile, query: text };
      } else {
        matched = { ...SAMPLE_ESTIMATES.web, query: text };
      }

      setEstimate(matched);
      setIsCalculating(false);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      calculateEstimate(prompt);
    }
  };

  return (
    <div
      className="rf-ai-pricing-insights-card"
      style={{
        borderRadius: '28px',
        background: isDark
          ? 'linear-gradient(135deg, #0D1611 0%, #08100C 60%, #050A08 100%)'
          : 'linear-gradient(135deg, #101B14 0%, #0C1510 60%, #080E0B 100%)',
        border: '1px solid rgba(102, 187, 42, 0.22)',
        boxShadow: '0 24px 70px -15px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '0',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.75rem, 4vw, 3.5rem)'
      }}
    >
      {/* Background Diagonal Texture Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.045,
          backgroundImage:
            'repeating-linear-gradient(45deg, #FFFFFF, #FFFFFF 1.5px, transparent 1.5px, transparent 10px)',
          pointerEvents: 'none'
        }}
      />

      {/* Ambient Green Aura on the Right Panel */}
      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(163, 230, 53, 0.22) 0%, rgba(102, 187, 42, 0.08) 45%, transparent 70%)',
          filter: 'blur(32px)',
          pointerEvents: 'none'
        }}
      />

      {/* LEFT COLUMN: Clean Copy & Input */}
      <div
        className="rf-ai-pricing-left-col"
        style={{
          position: 'relative',
          zIndex: 2,
          paddingRight: 'clamp(1.5rem, 3vw, 2.75rem)',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--rf-font-display)',
            fontSize: 'clamp(2.1rem, 4.2vw, 3.1rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            margin: '0 0 0.85rem 0'
          }}
        >
          Pay less for more with Refeir
        </h2>

        <p
          className="rf-ai-pricing-postheader"
          style={{
            fontSize: 'clamp(0.78rem, 1.1vw, 0.875rem)',
            color: 'rgba(235, 245, 238, 0.85)',
            lineHeight: 1.5,
            marginBottom: '2rem'
          }}
        >
          Let us help you estimate the average cost for freelancers with what you're looking for.
        </p>

        {/* Input Container — Clean White Card */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '560px' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '0.55rem 0.65rem 0.55rem 1.35rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="To start, describe what you need done."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: '#0F172A',
                fontSize: 'clamp(0.9rem, 1.3vw, 1rem)',
                fontFamily: 'inherit',
                fontWeight: 500,
                minWidth: 0
              }}
            />

            <button
              type="submit"
              disabled={isCalculating}
              style={{
                background: '#111A14',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.7rem 1.6rem',
                fontSize: '0.925rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1E3325';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#111A14';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{isCalculating ? 'Calculating...' : 'Next'}</span>
            </button>
          </div>
        </form>

        {/* Dynamic Estimated Pricing Output Card when user calculates */}
        {estimate && (
          <div
            style={{
              marginTop: '1.5rem',
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(102, 187, 42, 0.35)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#66BB2A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                  Refeir Market Average
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {estimate.role}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#E2E8F0', background: 'rgba(255, 255, 255, 0.1)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontWeight: 600 }}>
                {estimate.availableTalents}+ Vetted in Africa
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.65rem 0.85rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>Hourly Benchmark</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#A3E635' }}>{estimate.hourlyRange}</span>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.65rem 0.85rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>Fixed Milestone</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>{estimate.fixedRange}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(235, 245, 238, 0.75)' }}>
                Typical Turnaround: <strong style={{ color: '#FFFFFF' }}>{estimate.typicalTurnaround}</strong>
              </span>

              <button
                type="button"
                onClick={() => onNavigate(`/marketplace?q=${encodeURIComponent(estimate.query)}`)}
                style={{
                  background: '#66BB2A',
                  color: '#07160D',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.5rem 1.15rem',
                  fontSize: '0.825rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Browse Matching Talents</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Animated AI GIF + Spirograph Graphic + Describe what you want Button */}
      <div
        className="rf-ai-pricing-right-col"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '280px',
          width: '100%',
          paddingLeft: 'clamp(1.5rem, 3vw, 2.75rem)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.35rem',
            width: '100%'
          }}
        >
          {/* Visual Container: Animated Waveform GIF + Spirograph Halo */}
          <div
            style={{
              position: 'relative',
              width: '260px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Spirograph Torus SVG (existing graphic rotating in background) */}
            <div
              className="rf-ai-spirograph-wrap"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.6,
                transform: 'scale(0.85)'
              }}
            >
              <svg
                viewBox="0 0 260 260"
                width="220"
                height="220"
                className="rf-ai-spirograph-svg"
                style={{
                  filter: 'drop-shadow(0 0 16px rgba(163, 230, 53, 0.45)) drop-shadow(0 0 28px rgba(102, 187, 42, 0.3))'
                }}
              >
                <g transform="translate(130, 130)">
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                    <ellipse
                      key={deg}
                      cx="0"
                      cy="0"
                      rx="65"
                      ry="32"
                      transform={`rotate(${deg})`}
                      fill="none"
                      stroke="#D4F933"
                      strokeWidth="2.2"
                      opacity="0.9"
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* Neural Animated GIF Playing */}
            <img
              src="/ai_waveform.gif"
              alt="Neural AI Waveform Animation"
              style={{
                position: 'relative',
                zIndex: 3,
                maxWidth: '240px',
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 16px rgba(102, 187, 42, 0.4))'
              }}
            />
          </div>

          {/* Button: "Describe what you want" */}
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="rf-describe-what-you-want-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.7rem 1.6rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(102, 187, 42, 0.4)',
              color: '#FFFFFF',
              fontSize: '0.925rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(102, 187, 42, 0.2)';
              e.currentTarget.style.borderColor = '#66BB2A';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(102, 187, 42, 0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(102, 187, 42, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.35)';
            }}
          >
            <span>Describe what you want</span>
          </button>
        </div>
      </div>
    </div>
  );
};
