import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface RefeirLogoProps {
  variant?: 'full' | 'symbol' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLight?: boolean; // If provided: true = dark background asset (refeirlogo), false = light background asset (refeir_white)
  showTagline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const RefeirLogo: React.FC<RefeirLogoProps> = ({
  variant = 'full',
  size = 'md',
  isLight,
  showTagline = false,
  className = '',
  style = {}
}) => {
  let activeTheme: 'dark' | 'light' = 'dark';
  try {
    const { theme } = useTheme();
    activeTheme = theme;
  } catch {
    activeTheme = 'dark';
  }

  // Dark view / dark areas logo: Refeir-LogoWhite.png
  // Light view logo: RefeirLogo.png
  // Favicon / symbol: Refeir-Favic-Symb.png
  const isDark = isLight !== undefined ? isLight : activeTheme === 'dark';
  const logoSrc = isDark ? '/Refeir-LogoWhite.png' : '/RefeirLogo.png';
  const symbolSrc = '/Refeir-Favic-Symb.png';

  // Height and exact width configurations for pixel-perfect alignment with tagline
  const heightMap = {
    sm: { width: 160, height: 26, symbolSize: 24, tagline: '0.48rem', letterSpacing: '0.025em' },
    md: { width: 215, height: 32, symbolSize: 28, tagline: '0.64rem', letterSpacing: '0.025em' },
    lg: { width: 275, height: 42, symbolSize: 38, tagline: '0.80rem', letterSpacing: '0.035em' },
    xl: { width: 340, height: 54, symbolSize: 48, tagline: '0.98rem', letterSpacing: '0.04em' }
  };

  const dim = heightMap[size];

  return (
    <div
      className={`refeir-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: showTagline ? `${dim.width}px` : 'auto',
        maxWidth: '100%',
        textDecoration: 'none',
        ...style
      }}
    >
      {variant === 'symbol' ? (
        <img
          src={symbolSrc}
          alt="Refeir Symbol"
          style={{
            height: `${dim.symbolSize}px`,
            width: 'auto',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      ) : (
        <img
          src={logoSrc}
          alt="Refeir"
          style={{
            width: showTagline ? '100%' : 'auto',
            height: showTagline ? 'auto' : `${dim.height}px`,
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      )}

      {showTagline && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '4px',
            fontSize: dim.tagline,
            fontWeight: 800,
            letterSpacing: dim.letterSpacing,
            color: isDark ? '#66BB2A' : '#0F2E1E',
            textTransform: 'uppercase',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box'
          }}
        >
          <span style={{ display: 'inline-block', flexShrink: 0 }}>FAIR OPPORTUNITIES.</span>
          <span style={{ display: 'inline-block', flexShrink: 0 }}>STRONGER AFRICA.</span>
        </div>
      )}
    </div>
  );
};
