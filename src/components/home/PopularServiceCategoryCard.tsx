import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight } from 'lucide-react';

export interface ServiceCategoryItem {
  id: string;
  name: string;
  categoryQuery: string;
  description: string;
  tags: string[];
  type: 'design' | 'engineering' | 'ai' | 'mobile';
}

interface PopularServiceCategoryCardProps {
  category: ServiceCategoryItem;
  onSelect: (category: ServiceCategoryItem) => void;
}

export const PopularServiceCategoryCard: React.FC<PopularServiceCategoryCardProps> = ({
  category,
  onSelect
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const strokePrimary = isDark ? '#36E0A0' : '#15803D';
  const strokeSecondary = isDark ? '#66BB2A' : '#16A34A';
  const strokeMuted = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)';
  const fillSubtle = isDark ? 'rgba(54, 224, 160, 0.08)' : 'rgba(22, 163, 74, 0.06)';
  const gridDotColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.05)';

  const renderVectorDiagram = () => {
    switch (category.type) {
      case 'design':
        return (
          <svg viewBox="0 0 280 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-design" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill={gridDotColor} />
              </pattern>
            </defs>
            <rect width="280" height="160" fill="url(#grid-design)" />

            {/* Design Window Frame */}
            <rect x="25" y="20" width="230" height="120" rx="8" stroke={strokeMuted} strokeWidth="1.5" fill={fillSubtle} />
            <line x1="25" y1="38" x2="255" y2="38" stroke={strokeMuted} strokeWidth="1" />
            <circle cx="37" cy="29" r="2.5" fill={strokeSecondary} opacity="0.8" />
            <circle cx="47" cy="29" r="2.5" fill={strokeSecondary} opacity="0.5" />
            <circle cx="57" cy="29" r="2.5" fill={strokeSecondary} opacity="0.3" />

            {/* Sidebar Columns */}
            <rect x="35" y="48" width="45" height="82" rx="4" stroke={strokeMuted} strokeWidth="1" />
            <line x1="42" y1="58" x2="68" y2="58" stroke={strokeSecondary} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="42" y1="68" x2="62" y2="68" stroke={strokeMuted} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="42" y1="78" x2="65" y2="78" stroke={strokeMuted} strokeWidth="1.5" strokeLinecap="round" />

            {/* Canvas Artboard Component */}
            <rect x="90" y="48" width="115" height="82" rx="6" stroke={strokePrimary} strokeWidth="1.5" fill={isDark ? 'rgba(7, 22, 13, 0.7)' : '#FFFFFF'} />
            
            {/* Header & Avatar */}
            <circle cx="106" cy="64" r="6" stroke={strokeSecondary} strokeWidth="1.5" />
            <line x1="118" y1="62" x2="160" y2="62" stroke={strokePrimary} strokeWidth="2" strokeLinecap="round" />
            <line x1="118" y1="68" x2="145" y2="68" stroke={strokeMuted} strokeWidth="1.5" strokeLinecap="round" />

            {/* Hero Card Inside Artboard */}
            <rect x="100" y="78" width="95" height="32" rx="4" stroke={strokeMuted} strokeWidth="1" fill={fillSubtle} />
            <line x1="108" y1="88" x2="148" y2="88" stroke={strokePrimary} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="108" y1="96" x2="175" y2="96" stroke={strokeSecondary} strokeWidth="1.5" strokeLinecap="round" />
            <rect x="160" y="85" width="28" height="18" rx="3" stroke={strokeSecondary} strokeWidth="1" />

            {/* Vector Anchor Nodes & Handles */}
            <path d="M215 55 C235 65 220 100 240 115" stroke={strokeSecondary} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="215" cy="55" r="3" fill={strokePrimary} />
            <circle cx="240" cy="115" r="3" fill={strokePrimary} />
            <rect x="222" y="75" width="22" height="14" rx="2" stroke={strokeMuted} strokeWidth="1" />
          </svg>
        );

      case 'engineering':
        return (
          <svg viewBox="0 0 280 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-eng" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill={gridDotColor} />
              </pattern>
            </defs>
            <rect width="280" height="160" fill="url(#grid-eng)" />

            {/* Cloud API Gateway Node */}
            <rect x="30" y="30" width="60" height="36" rx="6" stroke={strokePrimary} strokeWidth="1.5" fill={fillSubtle} />
            <text x="42" y="52" fill={strokePrimary} fontSize="10" fontFamily="monospace" fontWeight="bold">&lt;/&gt;</text>
            <line x1="62" y1="48" x2="82" y2="48" stroke={strokePrimary} strokeWidth="1.5" strokeLinecap="round" />

            {/* Central Microservices Bus */}
            <rect x="120" y="24" width="75" height="48" rx="6" stroke={strokeSecondary} strokeWidth="1.5" fill={isDark ? 'rgba(7, 22, 13, 0.7)' : '#FFFFFF'} />
            <line x1="130" y1="38" x2="185" y2="38" stroke={strokePrimary} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="130" y1="48" x2="170" y2="48" stroke={strokeSecondary} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="130" y1="58" x2="160" y2="58" stroke={strokeMuted} strokeWidth="1.5" strokeLinecap="round" />

            {/* Connecting Bus Line */}
            <path d="M90 48 L120 48" stroke={strokePrimary} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="105" cy="48" r="2.5" fill={strokePrimary} />

            {/* Database Storage Nodes */}
            <g transform="translate(130, 95)">
              <ellipse cx="25" cy="8" rx="22" ry="6" stroke={strokePrimary} strokeWidth="1.5" fill={fillSubtle} />
              <path d="M3 8 V24 C3 27 13 30 25 30 C37 30 47 27 47 24 V8" stroke={strokePrimary} strokeWidth="1.5" fill={fillSubtle} />
              <path d="M3 16 C3 19 13 22 25 22 C37 22 47 19 47 16" stroke={strokePrimary} strokeWidth="1" />
              <circle cx="25" cy="19" r="1.5" fill={strokeSecondary} />
            </g>

            {/* Downward Service Connector */}
            <path d="M157 72 V95" stroke={strokeSecondary} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="157" cy="83" r="2.5" fill={strokeSecondary} />

            {/* Server Rack Box on Left */}
            <rect x="35" y="90" width="55" height="38" rx="5" stroke={strokeMuted} strokeWidth="1.5" />
            <line x1="42" y1="99" x2="78" y2="99" stroke={strokeSecondary} strokeWidth="1.5" />
            <circle cx="82" cy="99" r="1.5" fill={strokePrimary} />
            <line x1="42" y1="109" x2="78" y2="109" stroke={strokeSecondary} strokeWidth="1.5" />
            <circle cx="82" cy="109" r="1.5" fill={strokePrimary} />
            <line x1="42" y1="119" x2="78" y2="119" stroke={strokeMuted} strokeWidth="1.5" />
            <circle cx="82" cy="119" r="1.5" fill={strokeMuted} />

            <path d="M90 109 H130" stroke={strokeMuted} strokeWidth="1" strokeDasharray="2 2" />

            {/* Security Shield Lock Node */}
            <rect x="220" y="48" width="34" height="42" rx="5" stroke={strokePrimary} strokeWidth="1.5" fill={fillSubtle} />
            <path d="M237 58 V64 M232 64 H242 V78 H232 Z" stroke={strokePrimary} strokeWidth="1.2" />
            <path d="M195 48 H220" stroke={strokeMuted} strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        );

      case 'ai':
        return (
          <svg viewBox="0 0 280 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-ai" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill={gridDotColor} />
              </pattern>
            </defs>
            <rect width="280" height="160" fill="url(#grid-ai)" />

            {/* Central Neural Brain / Matrix Graph */}
            {/* Input Nodes */}
            <circle cx="45" cy="45" r="5" stroke={strokePrimary} strokeWidth="1.5" fill={fillSubtle} />
            <circle cx="45" cy="80" r="5" stroke={strokePrimary} strokeWidth="1.5" fill={fillSubtle} />
            <circle cx="45" cy="115" r="5" stroke={strokePrimary} strokeWidth="1.5" fill={fillSubtle} />

            {/* Hidden Layer 1 */}
            <circle cx="105" cy="35" r="6" stroke={strokeSecondary} strokeWidth="1.5" fill={fillSubtle} />
            <circle cx="105" cy="65" r="6" stroke={strokePrimary} strokeWidth="1.5" fill={fillSubtle} />
            <circle cx="105" cy="95" r="6" stroke={strokeSecondary} strokeWidth="1.5" fill={fillSubtle} />
            <circle cx="105" cy="125" r="6" stroke={strokePrimary} strokeWidth="1.5" fill={fillSubtle} />

            {/* Hidden Layer 2 (Dense Central Node) */}
            <rect x="160" y="55" width="36" height="50" rx="6" stroke={strokePrimary} strokeWidth="1.5" fill={isDark ? 'rgba(7, 22, 13, 0.8)' : '#FFFFFF'} />
            <circle cx="178" cy="72" r="5" fill={strokeSecondary} />
            <line x1="168" y1="88" x2="188" y2="88" stroke={strokePrimary} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="171" y1="95" x2="185" y2="95" stroke={strokeMuted} strokeWidth="1" strokeLinecap="round" />

            {/* Output Decision Node */}
            <circle cx="235" cy="60" r="7" stroke={strokePrimary} strokeWidth="2" fill={fillSubtle} />
            <path d="M232 60 L235 63 L239 57" stroke={strokePrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

            <circle cx="235" cy="100" r="5" stroke={strokeSecondary} strokeWidth="1.5" fill={fillSubtle} />

            {/* Neural Interconnection Synapses */}
            <line x1="50" y1="45" x2="99" y2="35" stroke={strokeMuted} strokeWidth="1" />
            <line x1="50" y1="45" x2="99" y2="65" stroke={strokeSecondary} strokeWidth="1.2" />
            <line x1="50" y1="80" x2="99" y2="65" stroke={strokePrimary} strokeWidth="1.5" />
            <line x1="50" y1="80" x2="99" y2="95" stroke={strokeSecondary} strokeWidth="1.2" />
            <line x1="50" y1="115" x2="99" y2="95" stroke={strokeMuted} strokeWidth="1" />
            <line x1="50" y1="115" x2="99" y2="125" stroke={strokeMuted} strokeWidth="1" />

            <line x1="111" y1="35" x2="160" y2="70" stroke={strokeMuted} strokeWidth="1" />
            <line x1="111" y1="65" x2="160" y2="75" stroke={strokePrimary} strokeWidth="1.5" />
            <line x1="111" y1="95" x2="160" y2="80" stroke={strokeSecondary} strokeWidth="1.2" />
            <line x1="111" y1="125" x2="160" y2="90" stroke={strokeMuted} strokeWidth="1" />

            <line x1="196" y1="75" x2="228" y2="62" stroke={strokePrimary} strokeWidth="1.5" />
            <line x1="196" y1="85" x2="230" y2="98" stroke={strokeSecondary} strokeWidth="1.2" />

            {/* Pipeline Data Telemetry Bars */}
            <rect x="215" y="125" width="5" height="15" rx="1.5" fill={strokeMuted} />
            <rect x="225" y="120" width="5" height="20" rx="1.5" fill={strokeSecondary} />
            <rect x="235" y="112" width="5" height="28" rx="1.5" fill={strokePrimary} />
            <rect x="245" y="118" width="5" height="22" rx="1.5" fill={strokePrimary} />
          </svg>
        );

      case 'mobile':
        return (
          <svg viewBox="0 0 280 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-mob" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill={gridDotColor} />
              </pattern>
            </defs>
            <rect width="280" height="160" fill="url(#grid-mob)" />

            {/* Smartphone 1 (iOS Aspect Frame) */}
            <g transform="translate(60, 18)">
              <rect width="70" height="124" rx="12" stroke={strokePrimary} strokeWidth="1.5" fill={isDark ? 'rgba(7, 22, 13, 0.75)' : '#FFFFFF'} />
              {/* Dynamic Island / Notch */}
              <rect x="25" y="6" width="20" height="4" rx="2" fill={strokeSecondary} />
              
              {/* Screen Content UI */}
              <rect x="10" y="18" width="50" height="22" rx="4" stroke={strokeSecondary} strokeWidth="1" fill={fillSubtle} />
              <line x1="16" y1="26" x2="38" y2="26" stroke={strokePrimary} strokeWidth="1.5" strokeLinecap="round" />
              <line x1="16" y1="32" x2="48" y2="32" stroke={strokeSecondary} strokeWidth="1" strokeLinecap="round" />

              {/* Feed Card */}
              <rect x="10" y="46" width="50" height="34" rx="4" stroke={strokeMuted} strokeWidth="1" />
              <circle cx="20" cy="56" r="4" stroke={strokePrimary} strokeWidth="1" />
              <line x1="28" y1="56" x2="52" y2="56" stroke={strokePrimary} strokeWidth="1.2" strokeLinecap="round" />
              <line x1="16" y1="68" x2="52" y2="68" stroke={strokeMuted} strokeWidth="1" strokeLinecap="round" />
              <line x1="16" y1="73" x2="44" y2="73" stroke={strokeMuted} strokeWidth="1" strokeLinecap="round" />

              {/* Action Button */}
              <rect x="10" y="86" width="50" height="14" rx="3" fill={strokePrimary} opacity="0.85" />
              <line x1="24" y1="93" x2="46" y2="93" stroke={isDark ? '#07160D' : '#FFFFFF'} strokeWidth="1.5" strokeLinecap="round" />

              {/* Bottom Home Indicator */}
              <line x1="24" y1="116" x2="46" y2="116" stroke={strokeMuted} strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Smartphone 2 (Android / Cross-Platform Secondary Frame) */}
            <g transform="translate(150, 32)">
              <rect width="65" height="110" rx="8" stroke={strokeSecondary} strokeWidth="1.5" fill={fillSubtle} />
              <circle cx="32" cy="7" r="1.8" fill={strokePrimary} />

              <rect x="8" y="16" width="49" height="16" rx="3" stroke={strokeMuted} strokeWidth="1" />
              <line x1="14" y1="24" x2="44" y2="24" stroke={strokePrimary} strokeWidth="1.2" strokeLinecap="round" />

              <rect x="8" y="38" width="49" height="42" rx="3" stroke={strokePrimary} strokeWidth="1" />
              <line x1="14" y1="48" x2="38" y2="48" stroke={strokeSecondary} strokeWidth="1.2" />
              <line x1="14" y1="56" x2="48" y2="56" stroke={strokeMuted} strokeWidth="1" />
              <line x1="14" y1="64" x2="42" y2="64" stroke={strokeMuted} strokeWidth="1" />
            </g>

            {/* Cross-Device Sync Connection Wave */}
            <path d="M130 75 C140 70 140 85 150 80" stroke={strokePrimary} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="130" cy="75" r="2" fill={strokePrimary} />
            <circle cx="150" cy="80" r="2" fill={strokePrimary} />

            {/* Modular Component Node floating on side */}
            <rect x="20" y="65" width="28" height="28" rx="5" stroke={strokeMuted} strokeWidth="1" fill={isDark ? 'rgba(7, 22, 13, 0.7)' : '#FFFFFF'} />
            <path d="M28 79 H40 M34 73 V85" stroke={strokeSecondary} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M48 79 H60" stroke={strokeMuted} strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(category)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(category);
        }
      }}
      className="rf-popular-category-card group"
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
      {/* Vector Diagram Header Container */}
      <div
        className="rf-category-diagram-container"
        style={{
          width: '100%',
          height: '160px',
          overflow: 'hidden',
          backgroundColor: isDark ? 'rgba(7, 22, 13, 0.95)' : '#F8FAF9',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(15, 23, 42, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {renderVectorDiagram()}
      </div>

      {/* Content & Details */}
      <div
        style={{
          padding: '1.4rem 1.4rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        {/* Category Title */}
        <h3
          style={{
            fontSize: '1.1875rem',
            fontWeight: 700,
            color: isDark ? 'var(--rf-cream, #FFFFFF)' : '#0F172A',
            letterSpacing: '-0.015em',
            margin: '0 0 0.45rem 0',
            lineHeight: 1.3
          }}
        >
          {category.name}
        </h3>

        {/* Deliverables / Scope Description */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: isDark ? 'var(--rf-slate-300, #CBD5E1)' : '#64748B',
            lineHeight: 1.55,
            margin: '0 0 1.15rem 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {category.description}
        </p>

        {/* Craft / Deliverable Tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.375rem',
            marginBottom: '1.25rem',
            marginTop: 'auto'
          }}
        >
          {category.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.72rem',
                fontWeight: 500,
                color: isDark ? 'var(--rf-slate-200, #E2E8F0)' : '#334155',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px'
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Clean Call to Action */}
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
          <span>Explore Category</span>
          <ArrowRight size={15} className="rf-category-card-arrow" style={{ transition: 'transform 0.25s ease' }} />
        </div>
      </div>
    </div>
  );
};
