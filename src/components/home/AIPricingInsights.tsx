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
          {/* Animated Budget Vault Bag with Coins and Fluttering Paper Bills */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px', height: '220px' }}>
            <svg
              viewBox="0 0 360 220"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <radialGradient id="rfBagBodyGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1E5230" />
                  <stop offset="60%" stopColor="#11331D" />
                  <stop offset="100%" stopColor="#08180E" />
                </radialGradient>
                <linearGradient id="rfCoinGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="45%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="rfCoinEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4F933" />
                  <stop offset="50%" stopColor="#A3E635" />
                  <stop offset="100%" stopColor="#15803D" />
                </linearGradient>
                <linearGradient id="rfBillGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#18462B" />
                  <stop offset="50%" stopColor="#1F5D38" />
                  <stop offset="100%" stopColor="#10321F" />
                </linearGradient>
                <linearGradient id="rfBillGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B2E0A" />
                  <stop offset="50%" stopColor="#5E4912" />
                  <stop offset="100%" stopColor="#2A1F06" />
                </linearGradient>
              </defs>

              {/* Concentric Telemetry Background Orbits */}
              <circle
                cx="180"
                cy="145"
                r="88"
                fill="none"
                stroke="rgba(102, 187, 42, 0.16)"
                strokeWidth="1"
                strokeDasharray="6 6"
                className="rf-budget-radar-ring"
              />
              <circle
                cx="180"
                cy="145"
                r="64"
                fill="none"
                stroke="rgba(163, 230, 53, 0.14)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="rf-budget-radar-ring-rev"
              />

              {/* Upper Floating Target Budget Pill */}
              <g transform="translate(180, 24)">
                <rect
                  x="-96"
                  y="-14"
                  width="192"
                  height="28"
                  rx="14"
                  fill="#0D2316"
                  stroke="rgba(163, 230, 53, 0.45)"
                  strokeWidth="1.2"
                />
                <circle cx="-76" cy="0" r="3.5" fill="#A3E635" className="rf-budget-dot-pulse" />
                <text
                  x="-62"
                  y="4.5"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="0.02em"
                >
                  Target Budget: $1,200 – $4,500
                </text>
              </g>

              {/* Animated Fluttering Paper Bill 1 (Green Note) */}
              <g className="rf-bill-flutter-1">
                <rect
                  x="-23"
                  y="-12"
                  width="46"
                  height="24"
                  rx="3.5"
                  fill="url(#rfBillGradGreen)"
                  stroke="#A3E635"
                  strokeWidth="1.2"
                />
                <rect
                  x="-19.5"
                  y="-9.5"
                  width="39"
                  height="19"
                  rx="2"
                  fill="none"
                  stroke="rgba(163, 230, 53, 0.45)"
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                />
                <circle cx="0" cy="0" r="6" fill="rgba(163, 230, 53, 0.2)" stroke="#A3E635" strokeWidth="0.8" />
                <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="800">
                  100
                </text>
              </g>

              {/* Animated Fluttering Paper Bill 2 (Gold Accent Note) */}
              <g className="rf-bill-flutter-2">
                <rect
                  x="-21"
                  y="-11"
                  width="42"
                  height="22"
                  rx="3.5"
                  fill="url(#rfBillGradGold)"
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                />
                <rect
                  x="-18"
                  y="-8.5"
                  width="36"
                  height="17"
                  rx="2"
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.45)"
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                />
                <circle cx="0" cy="0" r="5.5" fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth="0.8" />
                <text x="0" y="3" textAnchor="middle" fill="#FEF08A" fontSize="7.5" fontWeight="800">
                  50
                </text>
              </g>

              {/* Animated Coins Falling into the Bag Mouth */}
              {/* Coin 1: Gold Dollar Coin */}
              <g className="rf-coin-falling-1">
                <circle cx="0" cy="0" r="10.5" fill="url(#rfCoinGoldGrad)" stroke="#FEF08A" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="8" fill="none" stroke="rgba(180, 83, 9, 0.45)" strokeWidth="0.8" />
                <text x="0" y="3.8" textAnchor="middle" fill="#78350F" fontSize="9.5" fontWeight="900">
                  $
                </text>
              </g>

              {/* Coin 2: Emerald Naira Coin */}
              <g className="rf-coin-falling-2">
                <circle cx="0" cy="0" r="9.5" fill="url(#rfCoinEmeraldGrad)" stroke="#D4F933" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="7.2" fill="none" stroke="rgba(20, 83, 45, 0.55)" strokeWidth="0.8" />
                <text x="0" y="3.5" textAnchor="middle" fill="#14532D" fontSize="9" fontWeight="900">
                  ₦
                </text>
              </g>

              {/* Coin 3: Gold Cedi / Franc Coin */}
              <g className="rf-coin-falling-3">
                <circle cx="0" cy="0" r="8.8" fill="url(#rfCoinGoldGrad)" stroke="#FEF08A" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="6.8" fill="none" stroke="rgba(180, 83, 9, 0.45)" strokeWidth="0.8" />
                <text x="0" y="3.2" textAnchor="middle" fill="#78350F" fontSize="8.2" fontWeight="900">
                  ₵
                </text>
              </g>

              {/* Bag Mouth Glowing Entry Ripple */}
              <ellipse
                cx="180"
                cy="116"
                rx="22"
                ry="7"
                fill="none"
                stroke="#D4F933"
                strokeWidth="1.8"
                className="rf-budget-entry-ripple"
              />

              {/* The Money Bag Group with Elastic Bounce / Breathing Pulse */}
              <g className="rf-budget-bag-group">
                {/* Ruffled Fabric Top Opening */}
                <path
                  d="M 158 98 Q 164 91 170 97 Q 175 90 180 97 Q 185 90 190 97 Q 196 91 202 98 L 197 114 Q 180 117 163 114 Z"
                  fill="#1E5230"
                  stroke="rgba(163, 230, 53, 0.85)"
                  strokeWidth="1.4"
                />

                {/* Main Curved Pouch Body */}
                <path
                  d="M 163 114 C 143 118, 122 138, 126 166 C 128 187, 149 198, 180 198 C 211 198, 232 187, 234 166 C 238 138, 217 118, 197 114 Z"
                  fill="url(#rfBagBodyGrad)"
                  stroke="rgba(102, 187, 42, 0.9)"
                  strokeWidth="2"
                />

                {/* Bag Interior Curvature Highlight */}
                <path
                  d="M 142 144 C 137 162, 147 182, 170 190"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Gold/Lime Cinching Cord at Neck */}
                <rect x="160" y="111" width="40" height="5.5" rx="2.75" fill="#D4F933" />

                {/* Tied Cord Knot and Tassels */}
                <path
                  d="M 177 116 Q 173 126 169 133"
                  fill="none"
                  stroke="#D4F933"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 183 116 Q 187 127 191 135"
                  fill="none"
                  stroke="#D4F933"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="169" cy="134" r="2.8" fill="#F59E0B" />
                <circle cx="191" cy="136" r="2.8" fill="#F59E0B" />

                {/* Center Fintech Medallion on Bag */}
                <circle
                  cx="180"
                  cy="158"
                  r="17"
                  fill="#0A1C11"
                  stroke="#D4F933"
                  strokeWidth="1.8"
                />
                <circle
                  cx="180"
                  cy="158"
                  r="13.5"
                  fill="none"
                  stroke="rgba(163, 230, 53, 0.4)"
                  strokeWidth="0.8"
                />
                <text
                  x="180"
                  y="164.5"
                  textAnchor="middle"
                  fill="#D4F933"
                  fontSize="18"
                  fontWeight="900"
                  letterSpacing="-0.02em"
                >
                  $
                </text>
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

