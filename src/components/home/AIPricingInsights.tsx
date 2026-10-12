import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight, TrendingUp, Compass, BarChart2, ShieldCheck } from 'lucide-react';

interface AIPricingInsightsProps {
  onNavigate: (path: string) => void;
  onOpenAISearch?: (query: string) => void;
}

export const AIPricingInsights: React.FC<AIPricingInsightsProps> = ({ onNavigate, onOpenAISearch }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [prompt, setPrompt] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [animStage, setAnimStage] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimStage(prev => (prev + 1) % 3);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = prompt.trim() || 'Software Engineer';
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      if (onOpenAISearch) {
        onOpenAISearch(cleanQuery);
      } else {
        onNavigate(`/marketplace?q=${encodeURIComponent(cleanQuery)}`);
      }
    }, 180);
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

        {/* Input Container — Expanded Tall Card with Next button at bottom right */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '580px', width: '100%' }}>
          <div className="rf-ai-pricing-search-box">
            <div style={{ flex: 1, width: '100%' }}>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="To start, describe what you need done."
                rows={2}
                className="rf-ai-pricing-input"
                style={{
                  fontSize: 'clamp(0.92rem, 1.1vw, 1.02rem)',
                  width: '100%',
                  border: '0 none',
                  outline: 'none',
                  boxShadow: 'none',
                  background: 'transparent',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  resize: 'none',
                  lineHeight: 1.55,
                  color: '#0F172A',
                  fontWeight: 400
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '0.85rem' }}>
              <button
                type="submit"
                disabled={isCalculating}
                style={{
                  background: '#111A14',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.85rem 2.2rem',
                  minHeight: '48px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
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
          </div>
        </form>
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
                onClick={() => textareaRef.current?.focus()}
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
              {/* Perfectly Proportional Vector Comparative Graph */}
              <svg viewBox="0 0 340 135" width="100%" height="135" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="rfCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A3E635" stopOpacity="0.36" />
                    <stop offset="100%" stopColor="#66BB2A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Coordinate Grid Lines */}
                <line x1="20" y1="28" x2="320" y2="28" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
                <line x1="20" y1="62" x2="320" y2="62" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
                <line x1="20" y1="96" x2="320" y2="96" stroke="rgba(255, 255, 255, 0.14)" />
                <line x1="170" y1="28" x2="170" y2="96" stroke="rgba(163, 230, 53, 0.14)" strokeDasharray="2 3" />

                {/* Traditional Global Agencies Benchmark (Dashed Muted Line) */}
                <path
                  d="M 25 36 C 95 34, 170 30, 245 27 C 280 25, 305 24, 315 23"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
                <text x="315" y="16" textAnchor="end" fill="rgba(255, 255, 255, 0.55)" fontSize="9.5" fontWeight="600">
                  Global Agencies $75/hr+
                </text>

                {/* Refeir Area Gradient Fill Under Curve */}
                <path
                  d="M 25 96 L 25 78 C 95 76, 135 64, 170 60 C 205 56, 255 46, 315 42 L 315 96 Z"
                  fill="url(#rfCurveGrad)"
                />

                {/* Refeir Verified Network Curve (Glowing Green Curve) */}
                <path
                  d="M 25 78 C 95 76, 135 64, 170 60 C 205 56, 255 46, 315 42"
                  fill="none"
                  stroke="#A3E635"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="55" cy="75" r="3.5" fill="#66BB2A" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="170" cy="60" r="5" fill="#D4F933" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="285" cy="44" r="4" fill="#66BB2A" stroke="#FFFFFF" strokeWidth="1.5" />

                {/* Featured Refeir Badge Centered Over Senior Tier */}
                <rect x="122" y="32" width="96" height="20" rx="10" fill="rgba(12, 28, 17, 0.88)" stroke="#A3E635" strokeWidth="1.2" />
                <text x="170" y="46" textAnchor="middle" fill="#D4F933" fontSize="10.5" fontWeight="800">
                  Refeir $32/hr
                </text>

                {/* Mathematically Aligned Tier Labels */}
                <text x="55" y="118" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="10" fontWeight="500">
                  Junior Talent
                </text>
                <text x="170" y="118" textAnchor="middle" fill="#A3E635" fontSize="10.5" fontWeight="700">
                  Senior & Lead Tier
                </text>
                <text x="285" y="118" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="10" fontWeight="500">
                  Principal Specialist
                </text>
              </svg>
            </div>
          )}

          {/* STAGE 2: Animated Escrow Milestone Padlock */}
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
              {/* Prominent Large Animated Vector Padlock Graphic */}
              <div style={{ position: 'relative', width: '260px', height: '150px' }}>
                <svg viewBox="0 0 260 150" width="100%" height="100%" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="rfPadlockBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#18462B" />
                      <stop offset="100%" stopColor="#0B1F13" />
                    </linearGradient>
                    <linearGradient id="rfPadlockShackleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#D4F933" />
                      <stop offset="60%" stopColor="#A3E635" />
                      <stop offset="100%" stopColor="#66BB2A" />
                    </linearGradient>
                  </defs>

                  {/* Concentric Rotating Telemetry Rings */}
                  <circle
                    cx="130"
                    cy="80"
                    r="68"
                    fill="none"
                    stroke="rgba(102, 187, 42, 0.22)"
                    strokeWidth="1.2"
                    strokeDasharray="6 6"
                    className="rf-ai-padlock-radar"
                  />
                  <circle
                    cx="130"
                    cy="80"
                    r="50"
                    fill="none"
                    stroke="rgba(163, 230, 53, 0.18)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="rf-ai-padlock-radar-reverse"
                  />

                  {/* Security Grid Lines */}
                  <line x1="25" y1="80" x2="235" y2="80" stroke="rgba(102, 187, 42, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="130" y1="12" x2="130" y2="148" stroke="rgba(102, 187, 42, 0.15)" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Shackle (Snaps shut with keyframe animation) */}
                  <g className="rf-ai-padlock-shackle">
                    <path
                      d="M 102 68 V 38 A 28 28 0 0 1 158 38 V 68"
                      fill="none"
                      stroke="url(#rfPadlockShackleGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Padlock Body with Fintech Emerald Gradient */}
                  <rect
                    x="86"
                    y="64"
                    width="88"
                    height="66"
                    rx="12"
                    ry="12"
                    fill="url(#rfPadlockBodyGrad)"
                    stroke="rgba(102, 187, 42, 0.85)"
                    strokeWidth="2"
                    className="rf-ai-padlock-body"
                  />

                  {/* Padlock Core Keyhole with Illuminated Glow Beam */}
                  <g className="rf-ai-padlock-keyhole">
                    <circle cx="130" cy="90" r="6" fill="#D4F933" />
                    <path d="M 126.8 92.5 L 133.2 92.5 L 135 107 L 125 107 Z" fill="#D4F933" />
                  </g>

                  {/* Corner Rivet Details */}
                  <circle cx="98" cy="76" r="2.2" fill="#66BB2A" />
                  <circle cx="162" cy="76" r="2.2" fill="#66BB2A" />
                  <circle cx="98" cy="118" r="2.2" fill="#66BB2A" opacity="0.6" />
                  <circle cx="162" cy="118" r="2.2" fill="#66BB2A" opacity="0.6" />
                </svg>
              </div>

              <span
                style={{
                  marginTop: '0.65rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'rgba(235, 245, 238, 0.95)',
                  letterSpacing: '0.02em'
                }}
              >
                100% Escrow Milestone Protection
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

