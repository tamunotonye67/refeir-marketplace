import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight, TrendingUp, Compass, BarChart2 } from 'lucide-react';

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
  const [animStage, setAnimStage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimStage(prev => (prev + 1) % 3);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

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
            fontWeight: 300,
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            margin: '0 0 0.85rem 0'
          }}
        >
          Pay incredibly less for more with Refeir
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

        {/* Input Container — Clean Taller White Card */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '580px', width: '100%' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '28px',
              padding: '0.95rem 1.15rem 0.95rem 1.85rem',
              minHeight: '76px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 18px 48px rgba(0, 0, 0, 0.42)',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
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
                fontSize: 'clamp(1.05rem, 1.35vw, 1.18rem)',
                fontFamily: 'inherit',
                fontWeight: 500,
                minWidth: 0,
                padding: '0.45rem 0'
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
                padding: '1rem 2.4rem',
                minHeight: '54px',
                fontSize: '1.02rem',
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

      {/* RIGHT COLUMN: Animated Geometric Shapes, Interactive Button & Dynamic Graph Transition */}
      <div
        className="rf-ai-pricing-right-col"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '320px',
          width: '100%',
          paddingLeft: 'clamp(1.5rem, 3vw, 2.75rem)'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* STAGE 0: Integrated "Describe what you want" Button + Harmonic Resonance Rings & Waves */}
          {animStage === 0 && (
            <div
              key="stage-0"
              className="rf-ai-scene-enter"
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '230px'
              }}
            >
              {/* Geometric Vector Harmonic Resonance SVG Background */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                <svg
                  viewBox="0 0 360 220"
                  width="100%"
                  height="100%"
                  style={{ overflow: 'visible', opacity: 0.9 }}
                >
                  <defs>
                    <radialGradient id="aiRadarGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#A3E635" stopOpacity="0.35" />
                      <stop offset="60%" stopColor="#66BB2A" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Concentric Radar Vector Rings */}
                  <g className="rf-ai-orbit-spin">
                    <circle cx="180" cy="110" r="95" fill="none" stroke="rgba(163, 230, 53, 0.18)" strokeWidth="1" strokeDasharray="6 8" />
                    <circle cx="180" cy="110" r="70" fill="url(#aiRadarGrad)" stroke="rgba(102, 187, 42, 0.35)" strokeWidth="1.2" />
                    <circle cx="180" cy="110" r="45" fill="none" stroke="rgba(212, 249, 51, 0.55)" strokeWidth="1.5" strokeDasharray="4 4" />
                  </g>

                  {/* Harmonic Wave Lines */}
                  <path
                    d="M 10 110 Q 55 70, 100 110 T 190 110 T 280 110 T 350 110"
                    fill="none"
                    stroke="#A3E635"
                    strokeWidth="1.8"
                    opacity="0.85"
                    className="rf-ai-wave-flowing"
                  />
                  <path
                    d="M 20 110 Q 65 145, 110 110 T 200 110 T 290 110 T 340 110"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.38)"
                    strokeWidth="1.2"
                    className="rf-ai-wave-flowing"
                    style={{ animationDirection: 'reverse', animationDuration: '4.5s' }}
                  />
                  <path
                    d="M 40 110 Q 110 60, 180 110 T 320 110"
                    fill="none"
                    stroke="#66BB2A"
                    strokeWidth="1.4"
                    strokeDasharray="6 4"
                    opacity="0.65"
                    className="rf-ai-wave-flowing"
                    style={{ animationDuration: '5.5s' }}
                  />

                  {/* Geometric Intersection Nodes */}
                  <circle cx="100" cy="110" r="3.5" fill="#A3E635" />
                  <circle cx="190" cy="110" r="3" fill="#D4F933" />
                  <circle cx="280" cy="110" r="3.5" fill="#66BB2A" />
                </svg>
              </div>

              {/* The "Describe what you want" Button integrated into the geometric animation */}
              <button
                type="button"
                onClick={() => inputRef.current?.focus()}
                className="rf-ai-geometric-pulse"
                style={{
                  position: 'relative',
                  zIndex: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.85rem 1.8rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(163, 230, 53, 0.55)',
                  color: '#FFFFFF',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(102, 187, 42, 0.35)',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(102, 187, 42, 0.24)';
                  e.currentTarget.style.borderColor = '#A3E635';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 12px 38px rgba(102, 187, 42, 0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(163, 230, 53, 0.55)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(102, 187, 42, 0.35)';
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#A3E635',
                    display: 'inline-block',
                    boxShadow: '0 0 8px #A3E635'
                  }}
                />
                <span>Describe what you want</span>
                <ArrowRight size={15} color="#A3E635" />
              </button>

              <span
                style={{
                  marginTop: '1.15rem',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.55)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                Instant Pricing AI Benchmark
              </span>
            </div>
          )}

          {/* STAGE 1: Live Market Rate Curve & Cost Benchmark Graph */}
          {animStage === 1 && (
            <div
              key="stage-1"
              className="rf-ai-scene-enter"
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '230px'
              }}
            >
              {/* Badge Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(163, 230, 53, 0.35)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  marginBottom: '0.75rem'
                }}
              >
                <TrendingUp size={13} color="#A3E635" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                  Live Market Rate Curve
                </span>
                <span style={{ fontSize: '0.7rem', color: '#A3E635', fontWeight: 800 }}>-60%</span>
              </div>

              {/* Vector Comparative Graph */}
              <svg viewBox="0 0 340 130" width="100%" height="130" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="curveFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A3E635" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#66BB2A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Coordinate Grid Lines */}
                <line x1="20" y1="20" x2="320" y2="20" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
                <line x1="20" y1="60" x2="320" y2="60" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
                <line x1="20" y1="100" x2="320" y2="100" stroke="rgba(255, 255, 255, 0.12)" />

                {/* Traditional Agency Curve (Higher, Dashed Muted Line) */}
                <path
                  d="M 25 35 C 90 28, 170 42, 250 30 C 280 25, 305 32, 315 28"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.38)"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
                <text x="215" y="24" fill="rgba(255, 255, 255, 0.55)" fontSize="9" fontWeight="600">
                  Global Agencies $75/hr
                </text>

                {/* Refeir Area Fill Under Curve */}
                <path
                  d="M 25 100 L 25 82 C 95 86, 170 65, 245 68 C 285 70, 305 62, 315 58 L 315 100 Z"
                  fill="url(#curveFillGrad)"
                />

                {/* Refeir Verified Network Curve (Glowing Green Curve) */}
                <path
                  d="M 25 82 C 95 86, 170 65, 245 68 C 285 70, 305 62, 315 58"
                  fill="none"
                  stroke="#A3E635"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="170" cy="65" r="4" fill="#A3E635" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="245" cy="68" r="4" fill="#66BB2A" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="315" cy="58" r="4.5" fill="#D4F933" stroke="#FFFFFF" strokeWidth="1.5" />

                <text x="140" y="54" fill="#A3E635" fontSize="10.5" fontWeight="800">
                  Refeir $32/hr
                </text>
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '92%', marginTop: '0.4rem', fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                <span>Junior Talent</span>
                <span style={{ color: '#A3E635', fontWeight: 700 }}>Senior & Lead Tier</span>
                <span>Principal Specialist</span>
              </div>
            </div>
          )}

          {/* STAGE 2: Geometric Constellation Matrix & Vetted Pan-African Hub */}
          {animStage === 2 && (
            <div
              key="stage-2"
              className="rf-ai-scene-enter"
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '230px'
              }}
            >
              {/* Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(102, 187, 42, 0.35)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  marginBottom: '0.65rem'
                }}
              >
                <Compass size={13} color="#66BB2A" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                  Pan-African Talent Matrix
                </span>
                <span style={{ fontSize: '0.7rem', color: '#66BB2A', fontWeight: 800 }}>54 Nations</span>
              </div>

              {/* Geometric Polyhedral Constellation SVG */}
              <div style={{ position: 'relative', width: '220px', height: '120px' }}>
                <svg viewBox="0 0 220 120" width="100%" height="100%">
                  {/* Faceted Geometric Coordinate Lines */}
                  <polygon
                    points="110,12 185,42 160,105 60,105 35,42"
                    fill="none"
                    stroke="rgba(163, 230, 53, 0.35)"
                    strokeWidth="1.2"
                  />
                  <line x1="110" y1="12" x2="160" y2="105" stroke="rgba(102, 187, 42, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="110" y1="12" x2="60" y2="105" stroke="rgba(102, 187, 42, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="35" y1="42" x2="185" y2="42" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
                  <line x1="35" y1="42" x2="160" y2="105" stroke="rgba(212, 249, 51, 0.3)" strokeWidth="1" />
                  <line x1="185" y1="42" x2="60" y2="105" stroke="rgba(212, 249, 51, 0.3)" strokeWidth="1" />

                  {/* Hub Nodes */}
                  <circle cx="110" cy="12" r="4.5" fill="#A3E635" />
                  <circle cx="185" cy="42" r="4" fill="#66BB2A" />
                  <circle cx="160" cy="105" r="4" fill="#D4F933" />
                  <circle cx="60" cy="105" r="4" fill="#66BB2A" />
                  <circle cx="35" cy="42" r="4" fill="#A3E635" />
                  <circle cx="110" cy="62" r="5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="2" />
                </svg>
              </div>

              <span
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'rgba(235, 245, 238, 0.75)',
                  letterSpacing: '0.02em'
                }}
              >
                100% Escrow Milestone Protection
              </span>
            </div>
          )}

          {/* Bottom Interactive Stage Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.25rem',
              zIndex: 10
            }}
          >
            {[
              { idx: 0, label: 'Describe' },
              { idx: 1, label: 'Rate Curve' },
              { idx: 2, label: 'Talent Matrix' }
            ].map(stage => {
              const isActive = animStage === stage.idx;
              return (
                <button
                  key={stage.idx}
                  type="button"
                  onClick={() => setAnimStage(stage.idx)}
                  style={{
                    background: isActive ? 'rgba(163, 230, 53, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                    border: isActive ? '1px solid #A3E635' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.65rem',
                    color: isActive ? '#A3E635' : 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#A3E635' : 'rgba(255, 255, 255, 0.4)'
                    }}
                  />
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

