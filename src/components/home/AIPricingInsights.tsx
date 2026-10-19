import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { PricingMatchFlow } from './PricingMatchFlow';

interface AIPricingInsightsProps {
  onNavigate: (path: string) => void;
  /** Kept for backwards compatibility; the pricing section now uses its own budget-match flow. */
  onOpenAISearch?: (query: string) => void;
}

export const AIPricingInsights: React.FC<AIPricingInsightsProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [prompt, setPrompt] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showMatchFlow, setShowMatchFlow] = useState(false);
  const [stageState, setStageState] = useState<{ current: number; prev: number | null }>({
    current: 0,
    prev: null
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setStageState(state => ({
        current: (state.current + 1) % 4,
        prev: state.current
      }));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stageState.prev !== null) {
      const exitTimer = setTimeout(() => {
        setStageState(s => ({ ...s, prev: null }));
      }, 340);
      return () => clearTimeout(exitTimer);
    }
  }, [stageState.prev, stageState.current]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setShowMatchFlow(true);
    }, 150);
  };

  const renderStageContent = (stage: number) => {
    if (stage === 0) {
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '260px'
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
            className="rf-ai-mirror-btn"
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '0.95rem 2.2rem',
              borderRadius: '9999px',
              color: '#FFFFFF',
              fontSize: '0.98rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#A3E635',
                display: 'inline-block',
                boxShadow: '0 0 10px #A3E635'
              }}
            />
            <span style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.45)' }}>Describe what you want</span>
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
      );
    }

    if (stage === 1) {
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '260px'
          }}
        >
          {/* Symmetrical Animated Fintech Budget Bag with Green Coins & Notes */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px', height: '220px' }}>
            <svg
              viewBox="0 0 320 200"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="rfBudgetBagBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#18462B" />
                  <stop offset="100%" stopColor="#0B1F13" />
                </linearGradient>
                <linearGradient id="rfBudgetBagShackleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D4F933" />
                  <stop offset="60%" stopColor="#A3E635" />
                  <stop offset="100%" stopColor="#66BB2A" />
                </linearGradient>
                <linearGradient id="rfCoinEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4F933" />
                  <stop offset="60%" stopColor="#A3E635" />
                  <stop offset="100%" stopColor="#16A34A" />
                </linearGradient>
                <linearGradient id="rfCoinMintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ECFCCB" />
                  <stop offset="50%" stopColor="#A3E635" />
                  <stop offset="100%" stopColor="#15803D" />
                </linearGradient>
                <linearGradient id="rfBillGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B4D2E" />
                  <stop offset="100%" stopColor="#0B1F13" />
                </linearGradient>
                <linearGradient id="rfBillGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#143A23" />
                  <stop offset="100%" stopColor="#08180E" />
                </linearGradient>
              </defs>

              {/* Concentric Rotating Telemetry Rings (Matching Padlock Style) */}
              <circle
                cx="160"
                cy="115"
                r="70"
                fill="none"
                stroke="rgba(102, 187, 42, 0.18)"
                strokeWidth="1.2"
                strokeDasharray="6 6"
                className="rf-budget-radar-ring"
              />
              <circle
                cx="160"
                cy="115"
                r="50"
                fill="none"
                stroke="rgba(163, 230, 53, 0.15)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="rf-budget-radar-ring-rev"
              />

              {/* Security Grid Reference Lines */}
              <line x1="20" y1="115" x2="300" y2="115" stroke="rgba(102, 187, 42, 0.14)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="160" y1="20" x2="160" y2="185" stroke="rgba(102, 187, 42, 0.14)" strokeWidth="1" strokeDasharray="3 3" />

              {/* Top Target Budget Pill */}
              <g transform="translate(160, 24)">
                <rect
                  x="-122"
                  y="-15"
                  width="244"
                  height="30"
                  rx="15"
                  fill="#0D2316"
                  stroke="rgba(102, 187, 42, 0.45)"
                  strokeWidth="1.2"
                />
                <circle cx="-96" cy="0" r="3.5" fill="#A3E635" className="rf-budget-dot-pulse" />
                <text
                  x="-82"
                  y="0.5"
                  dominantBaseline="central"
                  fill="#FFFFFF"
                  fontSize="10.5"
                  fontWeight="700"
                  letterSpacing="0.01em"
                >
                  Target Budget: $1,200 – $4,500
                </text>
              </g>

              {/* Animated Fluttering Paper Bill 1 (Left - Emerald) */}
              <g className="rf-bill-flutter-1">
                <rect
                  x="-21"
                  y="-11"
                  width="42"
                  height="22"
                  rx="3"
                  fill="url(#rfBillGrad1)"
                  stroke="#A3E635"
                  strokeWidth="1.2"
                />
                <rect
                  x="-18"
                  y="-8.5"
                  width="36"
                  height="17"
                  rx="1.5"
                  fill="none"
                  stroke="rgba(163, 230, 53, 0.4)"
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                />
                <circle cx="0" cy="0" r="5.5" fill="rgba(163, 230, 53, 0.15)" stroke="#A3E635" strokeWidth="0.8" />
                <text x="0" y="2.8" textAnchor="middle" fill="#D4F933" fontSize="7.5" fontWeight="800">
                  100
                </text>
              </g>

              {/* Animated Fluttering Paper Bill 2 (Right - Mint) */}
              <g className="rf-bill-flutter-2">
                <rect
                  x="-21"
                  y="-11"
                  width="42"
                  height="22"
                  rx="3"
                  fill="url(#rfBillGrad2)"
                  stroke="#66BB2A"
                  strokeWidth="1.2"
                />
                <rect
                  x="-18"
                  y="-8.5"
                  width="36"
                  height="17"
                  rx="1.5"
                  fill="none"
                  stroke="rgba(102, 187, 42, 0.4)"
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                />
                <circle cx="0" cy="0" r="5.5" fill="rgba(102, 187, 42, 0.15)" stroke="#66BB2A" strokeWidth="0.8" />
                <text x="0" y="2.8" textAnchor="middle" fill="#A3E635" fontSize="7.5" fontWeight="800">
                  50
                </text>
              </g>

              {/* Animated Coins Falling into the Bag Mouth */}
              {/* Coin 1: Left Arc Dollar Coin */}
              <g className="rf-coin-falling-1">
                <circle cx="0" cy="0" r="10" fill="url(#rfCoinEmeraldGrad)" stroke="#D4F933" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="7.5" fill="#0D2316" stroke="rgba(212, 249, 51, 0.4)" strokeWidth="0.8" />
                <text x="0" y="3.5" textAnchor="middle" fill="#D4F933" fontSize="9" fontWeight="900">
                  $
                </text>
              </g>

              {/* Coin 2: Right Arc Naira Coin */}
              <g className="rf-coin-falling-2">
                <circle cx="0" cy="0" r="10" fill="url(#rfCoinMintGrad)" stroke="#A3E635" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="7.5" fill="#0D2316" stroke="rgba(163, 230, 53, 0.4)" strokeWidth="0.8" />
                <text x="0" y="3.5" textAnchor="middle" fill="#A3E635" fontSize="9" fontWeight="900">
                  ₦
                </text>
              </g>

              {/* Coin 3: Center Drop Cedi Coin */}
              <g className="rf-coin-falling-3">
                <circle cx="0" cy="0" r="9" fill="url(#rfCoinEmeraldGrad)" stroke="#D4F933" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="6.8" fill="#0D2316" stroke="rgba(212, 249, 51, 0.4)" strokeWidth="0.8" />
                <text x="0" y="3.2" textAnchor="middle" fill="#D4F933" fontSize="8.5" fontWeight="900">
                  ₵
                </text>
              </g>

              {/* Bag Mouth Glowing Entry Ripple */}
              <ellipse
                cx="160"
                cy="76"
                rx="20"
                ry="6"
                fill="none"
                stroke="#D4F933"
                strokeWidth="1.8"
                className="rf-budget-entry-ripple"
              />

              {/* Symmetrical Clean Fintech Bag Group (Matching Padlock Simplicity) */}
              <g className="rf-budget-bag-group">
                {/* Symmetrical Flared Top Collar Ruffle */}
                <path
                  d="M 144 75 C 138 68, 136 60, 144 60 C 151 60, 154 68, 160 68 C 166 68, 169 60, 176 60 C 184 60, 182 68, 176 75 Z"
                  fill="#1B4D2E"
                  stroke="rgba(163, 230, 53, 0.85)"
                  strokeWidth="1.5"
                />

                {/* Symmetrical Clean Bag Body */}
                <path
                  d="M 143 82 C 132 88, 110 108, 110 132 C 110 152, 128 162, 160 162 C 192 162, 210 152, 210 132 C 210 108, 188 88, 177 82 Z"
                  fill="url(#rfBudgetBagBodyGrad)"
                  stroke="rgba(102, 187, 42, 0.85)"
                  strokeWidth="2"
                />

                {/* Interior Curvature Accent Line */}
                <path
                  d="M 125 132 C 125 146, 138 155, 160 155 C 182 155, 195 146, 195 132"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />

                {/* Symmetrical Cinched Collar Band */}
                <rect
                  x="140"
                  y="75"
                  width="40"
                  height="7"
                  rx="3.5"
                  fill="#18462B"
                  stroke="url(#rfBudgetBagShackleGrad)"
                  strokeWidth="1.5"
                />

                {/* Symmetrical Tassels */}
                <path
                  d="M 155 82 Q 150 92 146 100"
                  fill="none"
                  stroke="#D4F933"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 165 82 Q 170 92 174 100"
                  fill="none"
                  stroke="#D4F933"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="146" cy="101" r="2.6" fill="#A3E635" />
                <circle cx="174" cy="101" r="2.6" fill="#A3E635" />

                {/* Center Core Currency Medallion */}
                <circle
                  cx="160"
                  cy="124"
                  r="16"
                  fill="#0A1C11"
                  stroke="#A3E635"
                  strokeWidth="1.8"
                />
                <circle
                  cx="160"
                  cy="124"
                  r="13"
                  fill="none"
                  stroke="rgba(163, 230, 53, 0.4)"
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                />
                <text
                  x="160"
                  y="130.5"
                  textAnchor="middle"
                  fill="#D4F933"
                  fontSize="17"
                  fontWeight="900"
                  letterSpacing="-0.02em"
                >
                  $
                </text>

                {/* Symmetrical Rivet Accents (Matching Padlock Rivets) */}
                <circle cx="132" cy="114" r="2" fill="#66BB2A" opacity="0.75" />
                <circle cx="188" cy="114" r="2" fill="#66BB2A" opacity="0.75" />
                <circle cx="138" cy="144" r="2" fill="#66BB2A" opacity="0.6" />
                <circle cx="182" cy="144" r="2" fill="#66BB2A" opacity="0.6" />
              </g>
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
            Dynamic Budget Sizing & Milestone Allocation
          </span>
        </div>
      );
    }

    if (stage === 2) {
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '260px'
          }}
        >
          {/* Animated Live Moving Market Curve Graphic */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '440px', height: '240px' }}>
            <svg viewBox="-5 0 435 230" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'hidden' }}>
              <defs>
                <linearGradient id="rfCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#A3E635" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#66BB2A" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#66BB2A" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="rfScanBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D4F933" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#A3E635" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#66BB2A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Level Grid Reference Lines */}
              <line x1="20" y1="38" x2="400" y2="38" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
              <line x1="20" y1="84" x2="400" y2="84" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
              <line x1="20" y1="130" x2="400" y2="130" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
              <line x1="20" y1="176" x2="400" y2="176" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" />

              {/* Vertical Column Alignment Guidelines */}
              <line x1="80" y1="38" x2="80" y2="176" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="2 3" />
              <line x1="210" y1="38" x2="210" y2="176" stroke="rgba(163, 230, 53, 0.2)" strokeDasharray="2 3" />
              <line x1="340" y1="38" x2="340" y2="176" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="2 3" />

              {/* Level Global Agency Ceiling Benchmark (Animated Dashed Reference Line) */}
              <line
                x1="20"
                y1="38"
                x2="400"
                y2="38"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="1.5"
                className="rf-agency-dash"
              />
              <text x="400" y="26" textAnchor="end" fill="rgba(255, 255, 255, 0.65)" fontSize="10.5" fontWeight="600">
                Global Agencies: $75/hr+
              </text>

              {/* Animated Area Gradient Fill Under Curve */}
              <path
                d="M 30 176 L 30 154 C 100 150, 155 116, 210 104 C 265 92, 315 78, 390 66 L 390 176 Z"
                fill="url(#rfCurveGrad)"
                className="rf-graph-area-glow"
              />

              {/* Base Smooth Green Curve */}
              <path
                d="M 30 154 C 100 150, 155 116, 210 104 C 265 92, 315 78, 390 66"
                fill="none"
                stroke="rgba(163, 230, 53, 0.45)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Animated Flowing Laser Pulse Curve Line */}
              <path
                d="M 30 154 C 100 150, 155 116, 210 104 C 265 92, 315 78, 390 66"
                fill="none"
                stroke="#D4F933"
                strokeWidth="3"
                strokeLinecap="round"
                className="rf-graph-flowing-curve"
              />

              {/* Sweeping Scanner Vertical Beam */}
              <g className="rf-graph-scanner-beam">
                <line x1="0" y1="26" x2="0" y2="176" stroke="url(#rfScanBeamGrad)" strokeWidth="2.5" />
              </g>

              {/* Data Points (Junior, Senior, Principal) */}
              <circle cx="80" cy="146" r="4.5" fill="#66BB2A" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="340" cy="72" r="4.5" fill="#66BB2A" stroke="#FFFFFF" strokeWidth="2" />

              {/* Active Center Node Radar Ping Rings */}
              <circle cx="210" cy="104" r="6" fill="none" stroke="#D4F933" className="rf-node-ping-ring" />
              <circle cx="210" cy="104" r="6" fill="none" stroke="#A3E635" className="rf-node-ping-ring-delayed" />
              <circle cx="210" cy="104" r="6.5" fill="#D4F933" stroke="#FFFFFF" strokeWidth="2.5" />

              {/* Prominent Live Rate Badge Above Center Node */}
              <rect
                x="150"
                y="58"
                width="120"
                height="28"
                rx="14"
                fill="#0E2316"
                stroke="#66BB2A"
                strokeWidth="1.5"
              />
              <circle cx="165" cy="72" r="3" fill="#A3E635" />
              <text x="215" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" letterSpacing="0.02em">
                Refeir $32/hr
              </text>

              {/* Symmetrically Centered Tier Labels */}
              <text x="80" y="206" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="11" fontWeight="500">
                Junior Talent
              </text>
              <text x="210" y="206" textAnchor="middle" fill="#A3E635" fontSize="12" fontWeight="700">
                Senior & Lead Tier
              </text>
              <text x="340" y="206" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="11" fontWeight="500">
                Principal Specialist
              </text>
            </svg>
          </div>
        </div>
      );
    }

    if (stage === 3) {
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '260px'
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
      );
    }

    return null;
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
          className="rf-ai-pricing-title"
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
            fontSize: 'clamp(0.82rem, 1.1vw, 0.92rem)',
            color: 'rgba(235, 245, 238, 0.85)',
            lineHeight: 1.5,
            marginBottom: '1.75rem',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          Let us help you estimate the average cost for freelancers with what you're looking for.
        </p>

        {/* Input Container — Expanded Tall Card with Next button at bottom right */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '580px', width: '100%' }}>
          <div className="rf-ai-pricing-search-box">
            <div className="rf-ai-pricing-input-wrap" style={{ flex: 1, width: '100%', border: 'none', outline: 'none' }}>
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

            <div className="rf-ai-pricing-btn-wrap" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '0.85rem' }}>
              <button
                type="submit"
                disabled={isCalculating}
                className="rf-ai-pricing-submit-btn"
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
          minHeight: '330px',
          width: '100%',
          paddingLeft: 'clamp(1.5rem, 3vw, 2.75rem)'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '440px',
            minHeight: '270px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Outgoing Scene Layer (Motion graphics slide & blur exit) */}
          {stageState.prev !== null && (
            <div
              key={`exit-stage-${stageState.prev}`}
              className="rf-ai-scene-exit"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}
            >
              {renderStageContent(stageState.prev)}
            </div>
          )}

          {/* Incoming / Active Scene Layer (Motion graphics slide & blur enter) */}
          <div
            key={`active-stage-${stageState.current}`}
            className="rf-ai-scene-enter"
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {renderStageContent(stageState.current)}
          </div>
        </div>
      </div>

      <PricingMatchFlow
        isOpen={showMatchFlow}
        initialBrief={prompt}
        onClose={() => setShowMatchFlow(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};

