import React, { useState, useRef } from 'react';
import {
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Users,
  Briefcase,
  Layers,
  RotateCcw,
  Zap,
  Globe2
} from 'lucide-react';

interface Africa3DMapProps {
  onNavigate: (path: string) => void;
}

interface TechHub {
  id: string;
  name: string;
  country: string;
  flag: string;
  region: string;
  xPercent: number; // Percent on map
  yPercent: number; // Percent on map
  talents: string;
  topSkills: string[];
  avgHourly: string;
  scoutCount: number;
  highlight?: boolean;
}

const AFRICAN_TECH_HUBS: TechHub[] = [
  {
    id: 'lagos',
    name: 'Lagos',
    country: 'Nigeria',
    flag: '🇳🇬',
    region: 'West Africa',
    xPercent: 30.5,
    yPercent: 44.5,
    talents: '2,850+ Vetted',
    topSkills: ['FinTech APIs', 'Fullstack', 'Node.js'],
    avgHourly: '$35 - $75/hr',
    scoutCount: 140,
    highlight: true
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    flag: '🇰🇪',
    region: 'East Africa',
    xPercent: 73.5,
    yPercent: 55.5,
    talents: '2,140+ Vetted',
    topSkills: ['AI & Python', 'Mobile Money', 'Flutter'],
    avgHourly: '$30 - $70/hr',
    scoutCount: 110,
    highlight: true
  },
  {
    id: 'capetown',
    name: 'Cape Town',
    country: 'South Africa',
    flag: '🇿🇦',
    region: 'Southern Africa',
    xPercent: 47.5,
    yPercent: 91.5,
    talents: '1,980+ Vetted',
    topSkills: ['Cloud Arch', 'UI/UX Design', 'DevOps'],
    avgHourly: '$45 - $95/hr',
    scoutCount: 95,
    highlight: true
  },
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    country: 'South Africa',
    flag: '🇿🇦',
    region: 'Southern Africa',
    xPercent: 59.5,
    yPercent: 82.5,
    talents: '1,640+ Vetted',
    topSkills: ['Data Eng', 'Enterprise Java', 'FinTech'],
    avgHourly: '$40 - $85/hr',
    scoutCount: 80
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    flag: '🇪🇬',
    region: 'North Africa',
    xPercent: 74.5,
    yPercent: 12.5,
    talents: '1,720+ Vetted',
    topSkills: ['Backend Systems', 'AI/ML', 'Embedded IoT'],
    avgHourly: '$30 - $65/hr',
    scoutCount: 85,
    highlight: true
  },
  {
    id: 'kigali',
    name: 'Kigali',
    country: 'Rwanda',
    flag: '🇷🇼',
    region: 'East Africa',
    xPercent: 65.5,
    yPercent: 58.0,
    talents: '890+ Vetted',
    topSkills: ['GovTech', 'Cybersecurity', 'React'],
    avgHourly: '$28 - $60/hr',
    scoutCount: 55
  },
  {
    id: 'accra',
    name: 'Accra & Kumasi',
    country: 'Ghana',
    flag: '🇬🇭',
    region: 'West Africa',
    xPercent: 22.5,
    yPercent: 45.5,
    talents: '1,120+ Vetted',
    topSkills: ['Web3/Solidity', 'Frontend', 'Data Science'],
    avgHourly: '$25 - $55/hr',
    scoutCount: 65
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    country: 'Morocco',
    flag: '🇲🇦',
    region: 'North Africa',
    xPercent: 26.5,
    yPercent: 9.0,
    talents: '940+ Vetted',
    topSkills: ['French/Eng Bilingual', 'Java', 'Data Eng'],
    avgHourly: '$35 - $75/hr',
    scoutCount: 45
  },
  {
    id: 'dakar',
    name: 'Dakar',
    country: 'Senegal',
    flag: '🇸🇳',
    region: 'West Africa',
    xPercent: 7.5,
    yPercent: 33.5,
    talents: '710+ Vetted',
    topSkills: ['Mobile Money APIs', 'Vue.js', 'PHP'],
    avgHourly: '$25 - $50/hr',
    scoutCount: 40
  },
  {
    id: 'addis',
    name: 'Addis Ababa',
    country: 'Ethiopia',
    flag: '🇪🇹',
    region: 'East Africa',
    xPercent: 76.5,
    yPercent: 41.5,
    talents: '830+ Vetted',
    topSkills: ['Python Analytics', 'Telecom SDKs', 'Flutter'],
    avgHourly: '$22 - $48/hr',
    scoutCount: 42
  },
  {
    id: 'kampala',
    name: 'Kampala',
    country: 'Uganda',
    flag: '🇺🇬',
    region: 'East Africa',
    xPercent: 67.5,
    yPercent: 54.0,
    talents: '760+ Vetted',
    topSkills: ['AgriTech', 'React Native', 'Django'],
    avgHourly: '$22 - $45/hr',
    scoutCount: 38
  }
];

export const Africa3DMap: React.FC<Africa3DMapProps> = ({ onNavigate }) => {
  const [activeHub, setActiveHub] = useState<TechHub>(AFRICAN_TECH_HUBS[0]);
  const [isHoveredHub, setIsHoveredHub] = useState<string | null>(null);

  // 3D Tilt Coordinates
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 12, rotateY: -10 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D perspective tilt (-15deg to +15deg)
    const rotateY = ((x - centerX) / centerX) * 16;
    const rotateX = -((y - centerY) / centerY) * 16;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 10, rotateY: -8 });
  };

  const resetTilt = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      className="rf-africa-3d-map-grid"
      style={{
        background: 'linear-gradient(135deg, #0A170F 0%, #0D2316 50%, #08140D 100%)',
        border: '1px solid rgba(102, 187, 42, 0.25)',
        borderRadius: '28px',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.75rem, 4vw, 3.5rem)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '3.5rem',
        alignItems: 'center'
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 187, 42, 0.16) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-25%',
          right: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(246, 178, 26, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* =========================================================================
          LEFT / CENTER: 3D ANIMATED ACTUAL AFRICA MAP WITH REAL COASTLINES
          ========================================================================= */}
      <div
        ref={mapContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          perspective: '1200px',
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          userSelect: 'none'
        }}
      >
        {/* 3D Map Canvas with Tilt Transformation */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '430px',
            aspectRatio: '0.86 / 1',
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.12s ease-out',
            filter: 'drop-shadow(0 30px 45px rgba(0, 0, 0, 0.6))'
          }}
        >
          {/* Topographic 3D Ground Shadow Ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-10%',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(102, 187, 42, 0.25) 0%, rgba(15, 46, 30, 0.4) 45%, transparent 70%)',
              transform: 'translateZ(-40px)',
              filter: 'blur(25px)'
            }}
          />

          {/* ===================================================================
              AUTHENTIC GEOGRAPHICAL SVG MAP OF AFRICA
              =================================================================== */}
          <svg
            viewBox="0 0 800 960"
            style={{
              width: '100%',
              height: '100%',
              overflow: 'visible',
              transform: 'translateZ(10px)'
            }}
          >
            <defs>
              {/* Rich Emerald Terrain Gradient */}
              <linearGradient id="actualAfricaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1B4D2E" />
                <stop offset="35%" stopColor="#123B22" />
                <stop offset="70%" stopColor="#0B2616" />
                <stop offset="100%" stopColor="#071D10" />
              </linearGradient>

              {/* Glowing Outline Gradient */}
              <linearGradient id="actualAfricaBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#66BB2A" />
                <stop offset="45%" stopColor="#4CAF50" />
                <stop offset="85%" stopColor="#F6B21A" />
                <stop offset="100%" stopColor="#66BB2A" />
              </linearGradient>

              {/* 3D Depth Shadow Filter */}
              <filter id="africaGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#66BB2A" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* 3D Extrusion Shadow Layer */}
            <path
              d="M 230 50 C 270 42 320 54 370 58 C 410 40 435 65 420 100 C 455 115 505 145 540 125 C 610 105 650 110 670 95 C 685 88 695 112 680 138 C 665 190 645 250 660 305 C 680 355 705 390 730 385 C 780 382 800 395 802 410 C 790 440 765 480 710 545 C 685 580 665 620 655 660 C 645 710 648 755 618 810 C 578 855 558 880 535 915 C 490 940 430 955 405 950 C 375 930 370 900 365 840 C 355 760 345 690 340 625 C 330 560 315 520 300 475 C 305 440 285 425 255 435 C 230 440 200 440 170 445 C 150 448 120 450 90 460 C 60 475 45 450 35 415 C 28 380 20 340 22 310 C 40 240 60 185 95 140 C 145 95 200 65 230 50 Z"
              fill="#051008"
              transform="translate(16, 22)"
              opacity="0.9"
            />

            {/* REAL AFRICA CONTINENTAL MAINLAND PATH */}
            <path
              d="M 230 50 C 270 42 320 54 370 58 C 410 40 435 65 420 100 C 455 115 505 145 540 125 C 610 105 650 110 670 95 C 685 88 695 112 680 138 C 665 190 645 250 660 305 C 680 355 705 390 730 385 C 780 382 800 395 802 410 C 790 440 765 480 710 545 C 685 580 665 620 655 660 C 645 710 648 755 618 810 C 578 855 558 880 535 915 C 490 940 430 955 405 950 C 375 930 370 900 365 840 C 355 760 345 690 340 625 C 330 560 315 520 300 475 C 305 440 285 425 255 435 C 230 440 200 440 170 445 C 150 448 120 450 90 460 C 60 475 45 450 35 415 C 28 380 20 340 22 310 C 40 240 60 185 95 140 C 145 95 200 65 230 50 Z"
              fill="url(#actualAfricaGradient)"
              stroke="url(#actualAfricaBorder)"
              strokeWidth="4"
              strokeLinejoin="round"
              filter="url(#africaGlow)"
            />

            {/* REAL MADAGASCAR ISLAND PATH */}
            <path
              d="M 685 680 C 720 660 745 710 740 780 C 735 830 705 870 675 875 C 655 860 650 800 665 740 Z"
              fill="url(#actualAfricaGradient)"
              stroke="#66BB2A"
              strokeWidth="2.5"
            />

            {/* Internal Regional Geography & Contours */}
            {/* North Africa / Sahara divider */}
            <path d="M 95 140 Q 350 200 665 190" stroke="rgba(102, 187, 42, 0.2)" strokeWidth="2" strokeDasharray="6 6" fill="none" />
            {/* Sahel / West Africa divider */}
            <path d="M 22 310 Q 250 360 660 305" stroke="rgba(102, 187, 42, 0.18)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            {/* Central / Congo Basin */}
            <path d="M 255 435 Q 450 480 710 545" stroke="rgba(102, 187, 42, 0.16)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            {/* Southern Africa divider */}
            <path d="M 345 690 Q 480 730 648 755" stroke="rgba(102, 187, 42, 0.2)" strokeWidth="2" strokeDasharray="6 6" fill="none" />

            {/* Great Rift Valley & Major Tech Flight Corridors */}
            <path
              d="M 670 95 Q 630 380 630 550 Q 560 720 500 830"
              stroke="#F6B21A"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.5"
              fill="none"
            />

            {/* Lagos to Nairobi Tech Corridor */}
            <line x1="245" y1="428" x2="588" y2="533" stroke="#66BB2A" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.75" />
            {/* Nairobi to Cape Town Corridor */}
            <line x1="588" y1="533" x2="380" y2="878" stroke="#66BB2A" strokeWidth="2" strokeDasharray="5 5" opacity="0.65" />
            {/* Lagos to Cairo Corridor */}
            <line x1="245" y1="428" x2="596" y2="120" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          </svg>

          {/* ===================================================================
              ANIMATED 3D LOCATION PINS & BEACONS (GLOWING & BEEPING)
              =================================================================== */}
          {AFRICAN_TECH_HUBS.map((hub, idx) => {
            const isSelected = activeHub.id === hub.id;
            const isHovered = isHoveredHub === hub.id;
            const delaySec = (idx * 0.18).toFixed(2);
            const secondaryDelaySec = (idx * 0.18 + 1.1).toFixed(2);

            return (
              <div
                key={hub.id}
                onClick={() => setActiveHub(hub)}
                onMouseEnter={() => setIsHoveredHub(hub.id)}
                onMouseLeave={() => setIsHoveredHub(null)}
                style={{
                  position: 'absolute',
                  left: `${hub.xPercent}%`,
                  top: `${hub.yPercent}%`,
                  transform: `translate(-50%, -50%) translateZ(${isSelected ? '50px' : isHovered ? '40px' : '22px'})`,
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer',
                  zIndex: isSelected ? 30 : isHovered ? 25 : 10,
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* 1st Beeping Radar Pulse Wave */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: isSelected ? '48px' : '36px',
                    height: isSelected ? '48px' : '36px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#66BB2A' : '#36E0A0'}`,
                    background: isSelected ? 'rgba(102, 187, 42, 0.35)' : 'rgba(54, 224, 160, 0.25)',
                    transform: 'translate(-50%, -50%)',
                    animation: `rfMapPinPing 2.2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                    animationDelay: `${delaySec}s`,
                    pointerEvents: 'none'
                  }}
                />

                {/* 2nd Staggered Beeping Radar Pulse Wave */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: isSelected ? '48px' : '36px',
                    height: isSelected ? '48px' : '36px',
                    borderRadius: '50%',
                    border: `1.5px solid ${isSelected ? '#66BB2A' : '#36E0A0'}`,
                    background: 'transparent',
                    transform: 'translate(-50%, -50%)',
                    animation: `rfMapPinPing 2.2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                    animationDelay: `${secondaryDelaySec}s`,
                    pointerEvents: 'none'
                  }}
                />

                {/* Glowing & Beeping Location Pin Head */}
                <div
                  style={{
                    width: isSelected ? '34px' : '26px',
                    height: isSelected ? '34px' : '26px',
                    borderRadius: '50%',
                    background: isSelected
                      ? 'linear-gradient(135deg, #66BB2A 0%, #36E0A0 100%)'
                      : 'linear-gradient(135deg, #0F2E1E 0%, #1A4D2E 100%)',
                    border: `2px solid ${isSelected ? '#FFFFFF' : '#66BB2A'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: `rfMapPinCoreBeep 1.8s ease-in-out infinite`,
                    animationDelay: `${delaySec}s`,
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MapPin size={isSelected ? 18 : 14} color={isSelected ? '#0F2E1E' : '#66BB2A'} />

                  {/* Pulsing Beacon Center Light */}
                  <div
                    style={{
                      position: 'absolute',
                      width: isSelected ? '7px' : '5px',
                      height: isSelected ? '7px' : '5px',
                      borderRadius: '50%',
                      background: isSelected ? '#FFFFFF' : '#36E0A0',
                      top: isSelected ? '6px' : '5px',
                      animation: `rfMapBeaconBlink 1.2s ease-in-out infinite`,
                      animationDelay: `${delaySec}s`,
                      pointerEvents: 'none'
                    }}
                  />
                </div>

                {/* City Tag Label */}
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: isSelected ? '#0F2E1E' : 'rgba(10, 23, 15, 0.88)',
                    color: isSelected ? '#66BB2A' : '#FFFFFF',
                    border: `1px solid ${isSelected ? '#66BB2A' : 'rgba(102, 187, 42, 0.4)'}`,
                    borderRadius: '9999px',
                    padding: '0.15rem 0.55rem',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <span>{hub.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Map Helper Controls */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(10, 23, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            padding: '0.3rem 0.75rem',
            fontSize: '0.72rem',
            color: 'rgba(255, 255, 255, 0.75)',
            zIndex: 40
          }}
        >
          <Compass size={13} color="#66BB2A" />
          <span>Move mouse to tilt 3D perspective</span>
          <button
            onClick={resetTilt}
            aria-label="Reset 3D Map View"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#66BB2A',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              marginLeft: '0.25rem'
            }}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          RIGHT COLUMN: "Find Hidden Talents in Africa," SHOWCASE & ACTIVE HUB CARD
          ========================================================================= */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Category Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(102, 187, 42, 0.15)', border: '1px solid rgba(102, 187, 42, 0.35)', padding: '0.3rem 0.85rem', borderRadius: '9999px', marginBottom: '1rem' }}>
          <Globe2 size={14} color="#66BB2A" />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#66BB2A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            54 Pan-African Sovereign Nations
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--rf-font-display)',
            fontSize: 'clamp(2.1rem, 4.5vw, 3rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            maxWidth: '540px'
          }}
        >
          Find Proven Talents<br />in and Across <span style={{ color: '#66BB2A' }}>Africa</span>
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1.02rem',
            color: 'rgba(235, 245, 238, 0.9)',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '520px'
          }}
        >
          Unearth exceptional engineering, AI research, design, and regulatory leaders thriving across 54 tech epicenters and fast-rising secondary talent hubs.
        </p>

        {/* Active Selected Hub Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(102, 187, 42, 0.35)',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
            transition: 'all 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {activeHub.name}, {activeHub.country}
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#66BB2A', fontWeight: 700 }}>
                {activeHub.region} Talent Epicenter
              </span>
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F2E1E', background: '#66BB2A', padding: '0.25rem 0.75rem', borderRadius: '9999px', boxShadow: '0 2px 8px rgba(102,187,42,0.4)' }}>
              {activeHub.talents}
            </span>
          </div>

          {/* Hub Highlights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>Typical Rates</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>{activeHub.avgHourly}</span>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>Active Scouts</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#66BB2A' }}>{activeHub.scoutCount}+ On-Ground</span>
            </div>
          </div>

          {/* Top In-Demand Skills in this Hub */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
              Top Hub Specializations:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {activeHub.topSkills.map((skill, idx) => (
                <span
                  key={idx}
                  onClick={() => onNavigate(`/marketplace?q=${encodeURIComponent(skill)}`)}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(102, 187, 42, 0.25)';
                    e.currentTarget.style.borderColor = '#66BB2A';
                    e.currentTarget.style.color = '#66BB2A';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={() => onNavigate('/marketplace')}
            className="rf-btn rf-btn-primary rf-btn-lg"
            style={{
              gap: '0.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 20px rgba(102, 187, 42, 0.45)'
            }}
          >
            <span>Explore</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => onNavigate('/dashboard/scout')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.5rem',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#FFFFFF',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = '#66BB2A';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <span>Scout in {activeHub.country} (Earn 10%)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
