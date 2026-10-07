import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { RF_FOREST_DARK, RF_MINT_ACCENT } from '../constants/brand';
import { useTheme } from '../context/ThemeContext';

export interface PioneersFooterProps {
  onNavigate: (path: string) => void;
  onOpenStatus?: () => void;
}

export const PioneersFooter: React.FC<PioneersFooterProps> = ({ onNavigate, onOpenStatus }) => {
  const { theme, toggleTheme } = useTheme();
  const handleCheckStatus = () => {
    if (onOpenStatus) {
      onOpenStatus();
    } else {
      window.dispatchEvent(new CustomEvent('refeir-open-status'));
    }
  };

  // Standard footer links including Check Status
  const footerLinks = [
    { label: 'Our Story', path: '/story' },
    { label: 'Check Status', action: 'status' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Admissions Admin', path: '/admin' },
  ];

  // Harmonized, freestanding minimalist silhouettes for @refeirafrica
  // All 7 share the exact same style & fill with NO enclosing circular or square background overlays
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/refeirafrica',
      icon: (
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/refeirafrica',
      icon: (
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03.17-1.4 1.3-1.4H17.5V2.14c-.6-.08-1.72-.14-2.8-.14-3.1 0-5.2 1.87-5.2 5.3v2.7H6v4h3.5v9h4.5v-9z" />
        </svg>
      )
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@refeirafrica',
      icon: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-4.52z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@refeirafrica',
      icon: (
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/refeirafrica',
      icon: (
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/refeirafrica',
      icon: (
        <svg width={13.5} height={13.5} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'Pinterest',
      url: 'https://www.pinterest.com/refeirafrica',
      icon: (
        <svg width={14.5} height={14.5} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.7 2C6.8 2 3 6.1 3 10.7c0 2.2 1.2 4.1 3.1 4.8.4.1.5-.1.6-.4.1-.3.3-1.1.4-1.5.1-.3 0-.5-.2-.7-.6-.7-1-1.7-1-2.9 0-3.8 2.8-6.5 6.6-6.5 3.5 0 5.9 2.5 5.9 5.9 0 4.1-2.1 6.8-4.8 6.8-1.5 0-2.6-1.2-2.3-2.8l.9-3.7c.3-1.1-.3-2.2-1.4-2.2-1.1 0-2 1.2-2 2.7 0 1 .3 1.7.3 1.7s-1.2 5.1-1.4 6.1c-.4 1.7-.1 4.1 0 4.3 0 .1.2.2.3.1.2-.2 2.2-2.7 2.9-4l.4-1.6c.6 1.1 2.2 2 3.8 2 5.1 0 8.7-4.6 8.7-10.4C21.4 5.9 17.6 2 12.7 2z"/>
        </svg>
      )
    },
  ];

  return (
    <footer style={{
      background: theme === 'light' ? '#EDF5F0' : RF_FOREST_DARK,
      padding: '44px 24px 34px',
      borderTop: theme === 'light' ? '1px solid rgba(15, 46, 30, 0.1)' : '1px solid rgba(102, 187, 42, 0.15)',
      position: 'relative',
      transition: 'background-color 0.25s ease, border-color 0.25s ease'
    }}>
      <div style={{
        maxWidth: 1240,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 28
      }}>
        {/* Main Footer Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24
        }}>
          {/* Brand */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            onClick={() => onNavigate('/')}
          >
            <img
              src={theme === 'light' ? '/RefeirLogo.png' : '/Refeir-LogoWhite.png'}
              alt="Refeir"
              style={{ height: 25, width: 'auto' }}
            />
            <span style={{
              fontSize: 9.5,
              color: theme === 'light' ? '#15803D' : 'rgba(255,255,255,0.4)',
              letterSpacing: '0.14em',
              fontWeight: 600
            }}>
              PIONEERS
            </span>
          </div>

          {/* Explicit Links: Our Story, Check Status, Privacy, Terms, Contact, FAQ, Admissions Admin */}
          <nav aria-label="Footer Navigation" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {footerLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.action === 'status') {
                    handleCheckStatus();
                  } else if (item.path) {
                    onNavigate(item.path);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme === 'light' ? '#1B3526' : 'rgba(255,255,255,0.6)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  padding: 0
                }}
                onMouseEnter={e => (e.currentTarget.style.color = theme === 'light' ? '#15803D' : RF_MINT_ACCENT)}
                onMouseLeave={e => (e.currentTarget.style.color = theme === 'light' ? '#1B3526' : 'rgba(255,255,255,0.6)')}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Social Media Section & Theme Toggle Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
            {socialLinks.map(({ name, url, icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Refeir on ${name} (@refeirafrica)`}
                aria-label={`Refeir on ${name}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: theme === 'light' ? '#1B3526' : 'rgba(255, 255, 255, 0.55)',
                  transition: 'color 0.2s ease, transform 0.2s ease',
                  textDecoration: 'none',
                  lineHeight: 1
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = theme === 'light' ? '#15803D' : RF_MINT_ACCENT;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = theme === 'light' ? '#1B3526' : 'rgba(255, 255, 255, 0.55)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {icon}
              </a>
            ))}

            {/* Footer Theme Toggle Pill */}
            <button
              onClick={toggleTheme}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 100,
                background: theme === 'light' ? 'rgba(15, 46, 30, 0.06)' : 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${theme === 'light' ? 'rgba(15, 46, 30, 0.14)' : 'rgba(255, 255, 255, 0.12)'}`,
                color: theme === 'light' ? '#0A1C12' : '#FFFFFF',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginLeft: 4
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={12} color="#FED072" /> : <Moon size={12} color="#0A1C12" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>

        {/* Bottom divider & Copyright */}
        <div style={{
          borderTop: theme === 'light' ? '1px solid rgba(15, 46, 30, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <p style={{ fontSize: 12, color: theme === 'light' ? '#4A6354' : 'rgba(255,255,255,0.38)', margin: 0 }}>
            © {new Date().getFullYear()} Refeir Technologies Ltd. All rights reserved.
          </p>
          <span style={{ fontSize: 11.5, color: theme === 'light' ? '#5A7264' : 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>
            Connecting African talent to global scale • @refeirafrica
          </span>
        </div>
      </div>
    </footer>
  );
};
