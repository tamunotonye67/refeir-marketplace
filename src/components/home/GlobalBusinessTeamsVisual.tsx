import React from 'react';
import { Globe, Building2, ShieldCheck, CheckCircle2, Users, Briefcase } from 'lucide-react';

interface TeamHub {
  city: string;
  country: string;
  role: string;
  x: number;
  y: number;
  badge: string;
  isHq?: boolean;
}

const HUBS: TeamHub[] = [
  { city: 'London', country: 'UK', role: 'Enterprise Client HQ', x: 210, y: 55, badge: 'Client Partner', isHq: true },
  { city: 'Lagos', country: 'Nigeria', role: 'Staff Frontend Architect', x: 130, y: 195, badge: 'Top 1% Talent' },
  { city: 'Nairobi', country: 'Kenya', role: 'Lead AI & Data Engineer', x: 300, y: 220, badge: 'Top 1% Talent' },
  { city: 'Kigali', country: 'Rwanda', role: 'FinTech Backend Lead', x: 220, y: 275, badge: 'Escrow Verified' },
  { city: 'Cape Town', country: 'South Africa', role: 'Cloud DevOps Specialist', x: 185, y: 355, badge: 'Compliance Ready' },
  { city: 'Cairo', country: 'Egypt', role: 'Security Systems Engineer', x: 260, y: 125, badge: 'Vetted Scouted' }
];

export const GlobalBusinessTeamsVisual: React.FC = () => {
  return (
    <div
      className="rf-global-business-visual"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        padding: '1.25rem',
        borderRadius: '20px',
        background: 'linear-gradient(145deg, rgba(14, 38, 25, 0.72) 0%, rgba(8, 22, 15, 0.90) 100%)',
        border: '1px solid rgba(102, 187, 42, 0.22)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        overflow: 'hidden'
      }}
    >
      {/* Background Soft Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(102, 187, 42, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(46, 125, 50, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Header Bar: Global Teams Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.875rem',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(102, 187, 42, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#66BB2A',
              border: '1px solid rgba(102, 187, 42, 0.3)'
            }}
          >
            <Globe size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              Distributed Enterprise Pod
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(235, 245, 238, 0.65)' }}>
              Cross-Border Talent Network
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: '9999px',
            background: 'rgba(102, 187, 42, 0.12)',
            border: '1px solid rgba(102, 187, 42, 0.3)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#86EFAC'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#66BB2A' }} />
          <span>Active Escrow SLA</span>
        </div>
      </div>

      {/* Center Interactive Map / Hub Graph */}
      <div style={{ position: 'relative', width: '100%', height: '240px', margin: '0 auto' }}>
        <svg
          viewBox="0 0 420 380"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          aria-hidden="true"
        >
          <defs>
            {/* Subtle Gradient for Connection Paths */}
            <linearGradient id="rfHubLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#66BB2A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.65" />
            </linearGradient>

            <filter id="rfGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Concentric Latitude / Longitude Rings */}
          <ellipse cx="210" cy="210" rx="180" ry="140" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
          <ellipse cx="210" cy="210" rx="125" ry="95" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4 4" />
          <line x1="210" y1="30" x2="210" y2="370" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="2 2" />
          <line x1="40" y1="210" x2="380" y2="210" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="2 2" />

          {/* Dynamic Arcs Connecting Client HQ with African Hubs */}
          {/* London -> Lagos */}
          <path d="M 210 55 Q 150 115 130 195" fill="none" stroke="url(#rfHubLineGrad)" strokeWidth="2" strokeDasharray="4 2" />
          {/* London -> Nairobi */}
          <path d="M 210 55 Q 270 120 300 220" fill="none" stroke="url(#rfHubLineGrad)" strokeWidth="2" strokeDasharray="4 2" />
          {/* London -> Cairo */}
          <path d="M 210 55 Q 240 85 260 125" fill="none" stroke="url(#rfHubLineGrad)" strokeWidth="1.75" />
          {/* Lagos -> Nairobi */}
          <path d="M 130 195 Q 215 190 300 220" fill="none" stroke="rgba(102, 187, 42, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Lagos -> Kigali */}
          <path d="M 130 195 Q 165 245 220 275" fill="none" stroke="rgba(102, 187, 42, 0.5)" strokeWidth="1.5" />
          {/* Nairobi -> Kigali */}
          <path d="M 300 220 Q 260 255 220 275" fill="none" stroke="rgba(102, 187, 42, 0.5)" strokeWidth="1.5" />
          {/* Kigali -> Cape Town */}
          <path d="M 220 275 Q 195 320 185 355" fill="none" stroke="url(#rfHubLineGrad)" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Hub Circles and Labels */}
          {HUBS.map((hub, idx) => (
            <g key={idx}>
              {/* Pulsing Outer Ring */}
              <circle
                cx={hub.x}
                cy={hub.y}
                r={hub.isHq ? 14 : 10}
                fill={hub.isHq ? 'rgba(56, 189, 248, 0.15)' : 'rgba(102, 187, 42, 0.18)'}
                stroke={hub.isHq ? 'rgba(56, 189, 248, 0.4)' : 'rgba(102, 187, 42, 0.4)'}
                strokeWidth="1"
              />
              {/* Center Dot */}
              <circle
                cx={hub.x}
                cy={hub.y}
                r={hub.isHq ? 6 : 4.5}
                fill={hub.isHq ? '#38BDF8' : '#66BB2A'}
                filter="url(#rfGlowFilter)"
              />
              {/* City Label */}
              <text
                x={hub.x + (hub.x > 250 ? -12 : 12)}
                y={hub.y + 4}
                textAnchor={hub.x > 250 ? 'end' : 'start'}
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="700"
                fontFamily="var(--rf-font-display, sans-serif)"
              >
                {hub.city}
              </text>
              {/* Role Subtitle */}
              <text
                x={hub.x + (hub.x > 250 ? -12 : 12)}
                y={hub.y + 16}
                textAnchor={hub.x > 250 ? 'end' : 'start'}
                fill="rgba(235, 245, 238, 0.6)"
                fontSize="8.5"
                fontWeight="500"
              >
                {hub.country}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Bottom Summary Bar: Compliance, Jurisdictions & Multi-Currency */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginTop: '1rem',
          paddingTop: '0.875rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            padding: '0.625rem 0.75rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.07)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#66BB2A', marginBottom: '0.2rem' }}>
            <ShieldCheck size={14} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FFFFFF' }}>54 Jurisdictions</span>
          </div>
          <div style={{ fontSize: '0.675rem', color: 'rgba(235, 245, 238, 0.7)', lineHeight: 1.35 }}>
            Cross-border contractor tax & compliance handled automatically
          </div>
        </div>

        <div
          style={{
            padding: '0.625rem 0.75rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.07)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', marginBottom: '0.2rem' }}>
            <Building2 size={14} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FFFFFF' }}>Consolidated Billing</span>
          </div>
          <div style={{ fontSize: '0.675rem', color: 'rgba(235, 245, 238, 0.7)', lineHeight: 1.35 }}>
            Single invoice in USD, GBP, or EUR with automated escrow protection
          </div>
        </div>
      </div>
    </div>
  );
};
