import React, { useState } from 'react';
import { REGIONS } from '../../data/countries';
import { RefeirLogo } from './RefeirLogo';
import { RefeirProModal } from './RefeirProModal';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Sparkles, CheckCircle2, Globe, Heart, Smartphone, X, Zap, BellRing, Lock, CheckCircle, ArrowRight, Download, Loader2, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  let activeTheme: 'dark' | 'light' = 'dark';
  try {
    const { theme } = useTheme();
    activeTheme = theme;
  } catch {
    activeTheme = 'dark';
  }

  const isDark = activeTheme === 'dark';
  const watermarkSrc = isDark ? '/Refeir-LogoWhite.png' : '/RefeirLogo.png';

  const [showProModal, setShowProModal] = useState(false);
  const [selectedAppPlatform, setSelectedAppPlatform] = useState<'ios' | 'android' | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [apkDownloading, setApkDownloading] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);

  // Mobile Footer Collapsible Accordion States
  const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({
    regions: false,
    resources: false,
    discovery: false,
    trust: false
  });

  const toggleMobileSection = (key: string) => {
    setOpenMobileSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistSubmitted(true);
    try {
      confetti({ particleCount: 65, spread: 55, origin: { y: 0.6 } });
    } catch (err) {}
  };

  const handleDownloadApk = () => {
    setApkDownloading(true);
    setTimeout(() => {
      setApkDownloading(false);
      setApkDownloaded(true);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
    }, 1200);
  };

  const handleCloseModal = () => {
    setSelectedAppPlatform(null);
    setWaitlistSubmitted(false);
    setWaitlistEmail('');
    setApkDownloading(false);
    setApkDownloaded(false);
  };

  return (
    <footer style={{ backgroundColor: 'var(--rf-bg-deep)', borderTop: '1px solid var(--rf-bg-card-border)', marginTop: 'auto', overflow: 'hidden', position: 'relative' }}>
      <div className="rf-container" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <div className="rf-footer-grid">
          {/* Col 1: Brand & Ethos */}
          <div className="rf-footer-brand-col">
            <div style={{ marginBottom: '1.25rem' }}>
              <RefeirLogo size="md" showTagline={true} />
            </div>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '380px', marginBottom: '1.25rem' }}>
              Africa's referral-powered professional marketplace. Connecting clients with verified professionals while scouts earn guaranteed rewards from successful connections.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(102, 187, 42, 0.12)', border: '1px solid rgba(102, 187, 42, 0.3)', padding: '0.375rem 0.875rem', borderRadius: 'var(--rf-radius-full)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--rf-leaf-green)' }} className="rf-pulse" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>
                Refer and Earn
              </span>
            </div>
          </div>

          {/* Col 2: Regional Marketplaces & Resources */}
          <div>
            {/* African Regions Accordion */}
            <div className="rf-footer-accordion-item">
              <button
                type="button"
                className="rf-footer-section-header"
                onClick={() => toggleMobileSection('regions')}
                aria-expanded={openMobileSections.regions}
              >
                <h4 className="rf-footer-heading">African Regions</h4>
                <div className={`rf-footer-chevron ${openMobileSections.regions ? 'open' : ''}`}>
                  <ChevronDown size={18} />
                </div>
              </button>
              <div className={`rf-footer-content ${openMobileSections.regions ? 'open' : ''}`}>
                {REGIONS.map(reg => (
                  <button
                    key={reg}
                    onClick={() => onNavigate(`/africa/${reg.toLowerCase().replace(' ', '-')}`)}
                    style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)', transition: 'color 0.15s' }}
                    className="rf-btn-ghost"
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Accordion */}
            <div className="rf-footer-accordion-item rf-footer-res-wrapper" style={{ marginTop: '2.25rem' }}>
              <button
                type="button"
                className="rf-footer-section-header"
                onClick={() => toggleMobileSection('resources')}
                aria-expanded={openMobileSections.resources}
              >
                <h4 className="rf-footer-heading">Resources</h4>
                <div className={`rf-footer-chevron ${openMobileSections.resources ? 'open' : ''}`}>
                  <ChevronDown size={18} />
                </div>
              </button>
              <div className={`rf-footer-content ${openMobileSections.resources ? 'open' : ''}`}>
                <button onClick={() => onNavigate('/help')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Help and Support
                </button>
                <button onClick={() => onNavigate('/community')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Community Hub
                </button>
                <button onClick={() => onNavigate('/success-stories')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Success stories
                </button>
                <button onClick={() => onNavigate('/reviews')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Refeir reviews
                </button>
                <button onClick={() => onNavigate('/tools')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Resources
                </button>
                <button onClick={() => onNavigate('/blog')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Blog
                </button>
                <button onClick={() => onNavigate('/affiliates')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Affiliate programs
                </button>
                <button onClick={() => onNavigate('/dashboard/scout')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Refer a client
                </button>
                <button onClick={() => onNavigate('/tools')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Free Business tools
                </button>
                <button onClick={() => onNavigate('/release-notes')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                  Release notes
                </button>
              </div>
            </div>
          </div>

          {/* Col 3: Discovery Accordion */}
          <div className="rf-footer-accordion-item">
            <button
              type="button"
              className="rf-footer-section-header"
              onClick={() => toggleMobileSection('discovery')}
              aria-expanded={openMobileSections.discovery}
            >
              <h4 className="rf-footer-heading">Discovery</h4>
              <div className={`rf-footer-chevron ${openMobileSections.discovery ? 'open' : ''}`}>
                <ChevronDown size={18} />
              </div>
            </button>
            <div className={`rf-footer-content ${openMobileSections.discovery ? 'open' : ''}`}>
              <button onClick={() => onNavigate('/marketplace')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Talent Marketplace
              </button>
              <button onClick={() => onNavigate('/catalog')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Project Catalog
              </button>
              <button onClick={() => onNavigate('/agencies')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Hire an agency
              </button>
              <button onClick={() => onNavigate('/countries')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Hire continentally
              </button>
              <button onClick={() => onNavigate('/countries/nigeria')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Hire in Nigeria
              </button>
              <button onClick={() => onNavigate('/about')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Leadership
              </button>
              <button onClick={() => onNavigate('/why-refeir')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Our vision
              </button>
              <button onClick={() => onNavigate('/impact')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Our impact
              </button>
              <button onClick={() => onNavigate('/investors')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Investor relations
              </button>
              <button onClick={() => onNavigate('/contact')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Contact us
              </button>
              <button
                onClick={() => setShowProModal(true)}
                style={{
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  color: '#F4B942',
                  fontWeight: 700
                }}
                className="rf-btn-ghost"
              >
                Refeir Pro
              </button>
              <button onClick={() => onNavigate('/enterprise')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Direct contracts
              </button>
              <button onClick={() => onNavigate('/scouts')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Scout Network
              </button>
              <button onClick={() => onNavigate('/scouts#benefits')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Scout benefits
              </button>
              <button onClick={() => onNavigate('/jobs')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Client Job Board
              </button>
              <button onClick={() => onNavigate('/demo-tour')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-mint)', fontWeight: 600 }} className="rf-btn-ghost">
                Cross-Border Demo Tour
              </button>
            </div>
          </div>

          {/* Col 4: Trust & Legal Accordion */}
          <div className="rf-footer-accordion-item">
            <button
              type="button"
              className="rf-footer-section-header"
              onClick={() => toggleMobileSection('trust')}
              aria-expanded={openMobileSections.trust}
            >
              <h4 className="rf-footer-heading">Trust & Legal</h4>
              <div className={`rf-footer-chevron ${openMobileSections.trust ? 'open' : ''}`}>
                <ChevronDown size={18} />
              </div>
            </button>
            <div className={`rf-footer-content ${openMobileSections.trust ? 'open' : ''}`}>
              <button onClick={() => onNavigate('/trust')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Trust & Security
              </button>
              <button onClick={() => onNavigate('/verification')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Identity & KYC Verification
              </button>
              <button onClick={() => onNavigate('/partnerships')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Sponsorship & Partnership
              </button>
              <button onClick={() => onNavigate('/protection')} style={{ textAlign: 'left', fontSize: '0.875rem', color: 'var(--rf-slate-400)' }} className="rf-btn-ghost">
                Pay Protection Notice
              </button>
            </div>
          </div>
        </div>

        {/* Follow us (Left) & Mobile app (Right) Strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Left: Follow us */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--rf-slate-400)' }}>
              Follow us
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Refeir on Facebook"
                className="rf-icon-bare"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Refeir on LinkedIn"
                className="rf-icon-bare"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* X (formerly Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Refeir on X"
                className="rf-icon-bare"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Refeir on YouTube"
                className="rf-icon-bare"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Refeir on Instagram"
                className="rf-icon-bare"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Refeir on Pinterest"
                className="rf-icon-bare"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 12-5.373 12-12 0-6.628-5.393-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Mobile app */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--rf-slate-400)' }}>
              Mobile app
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              {/* Apple iOS */}
              <button
                type="button"
                onClick={() => setSelectedAppPlatform('ios')}
                aria-label="Download Refeir for Apple iOS"
                className="rf-icon-bare"
                title="Apple App Store Beta"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-.99 1.73-.86 2.76 1.01.08 1.98-.51 2.59-1.26z" />
                </svg>
              </button>

              {/* Android */}
              <button
                type="button"
                onClick={() => setSelectedAppPlatform('android')}
                aria-label="Download Refeir for Android"
                className="rf-icon-bare"
                title="Google Play Beta"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.996-3.4572c.1556-.2696.0633-.6137-.2063-.7694-.2691-.1556-.6133-.0633-.7689.2063l-2.0287 3.514C15.228 8.1632 13.6667 7.79 12 7.79c-1.6667 0-3.228.3732-4.8736 1.0251L5.0977 5.3011c-.1556-.2696-.4998-.3619-.7689-.2063-.2696.1557-.3619.4998-.2063.7694l1.996 3.4572C2.6884 11.1613.3432 14.659.0068 18.802h23.9864c-.3364-4.143-2.6816-7.6407-6.1119-9.4806" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Regulatory Disclosure Disclaimer & Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--rf-navy-border)',
            paddingTop: '2rem',
            paddingBottom: '2.5rem',
            fontSize: '0.8125rem',
            color: 'var(--rf-slate-500)',
            lineHeight: 1.6,
            position: 'relative',
            zIndex: 2
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              © 2026 Refeir Technologies. Built for Africa's talent. Powered by Africa's networks.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span>English (Pan-Africa)</span>
              <span>UTC Local Timezones</span>
              <span>54 Sovereign Nations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Classical Brand Watermark (Theme-aware image) */}
      <div
        className="rf-footer-watermark"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          padding: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          position: 'relative',
          marginTop: '1.5rem',
          marginBottom: 0,
          lineHeight: 0
        }}
      >
        <img
          src={watermarkSrc}
          alt="Refeir Watermark"
          style={{
            width: '100%',
            maxWidth: '1350px',
            height: 'auto',
            maxHeight: '340px',
            objectFit: 'contain',
            opacity: 0.15,
            transform: 'translateY(17%)',
            marginBottom: '-1px',
            maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.92) 65%, rgba(0, 0, 0, 0.45) 90%, rgba(0, 0, 0, 0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.92) 65%, rgba(0, 0, 0, 0.45) 90%, rgba(0, 0, 0, 0) 100%)',
            transition: 'opacity 0.3s ease, filter 0.3s ease'
          }}
        />
      </div>

      {/* =========================================================================
          DESIGNED MOBILE APP DOWNLOAD & BETA ACCESS PROMPT MODAL
          ========================================================================= */}
      {selectedAppPlatform && (
        <div
          className="rf-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 10, 6, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={handleCloseModal}
        >
          <div
            className="rf-modal-content"
            style={{
              width: '100%',
              maxWidth: '580px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#07160D',
              border: '1.5px solid rgba(102, 187, 42, 0.45)',
              borderRadius: 'var(--rf-radius-2xl)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(102, 187, 42, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Ambient Leaf Green Header Glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '280px',
                height: '100px',
                background: 'radial-gradient(ellipse, rgba(102, 187, 42, 0.3) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem 1.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative',
                zIndex: 2,
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--rf-radius-md)',
                    background: 'rgba(102, 187, 42, 0.15)',
                    border: '1px solid rgba(102, 187, 42, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--rf-leaf-green)'
                  }}
                >
                  {selectedAppPlatform === 'ios' ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-.99 1.73-.86 2.76 1.01.08 1.98-.51 2.59-1.26z" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.996-3.4572c.1556-.2696.0633-.6137-.2063-.7694-.2691-.1556-.6133-.0633-.7689.2063l-2.0287 3.514C15.228 8.1632 13.6667 7.79 12 7.79c-1.6667 0-3.228.3732-4.8736 1.0251L5.0977 5.3011c-.1556-.2696-.4998-.3619-.7689-.2063-.2696.1557-.3619.4998-.2063.7694l1.996 3.4572C2.6884 11.1613.3432 14.659.0068 18.802h23.9864c-.3364-4.143-2.6816-7.6407-6.1119-9.4806" />
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                      {selectedAppPlatform === 'ios' ? 'Refeir for Apple iOS' : 'Refeir for Android'}
                    </h3>
                    <span className="rf-badge rf-badge-mint rf-text-xs" style={{ padding: '0.15rem 0.5rem' }}>
                      Early Beta
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '2px 0 0 0' }}>
                    {selectedAppPlatform === 'ios' ? 'Apple App Store & TestFlight Beta' : 'Google Play & Direct APK Channel'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--rf-slate-300)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--rf-slate-300)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: '1.5rem 1.75rem 2rem',
                position: 'relative',
                zIndex: 2,
                overflowY: 'auto',
                flex: 1
              }}
            >
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-200)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Manage live escrow milestone deliverables, instant 10% scout referral splits, and biometric authorization natively on your device.
              </p>

              {/* 3 Value Pillars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 'var(--rf-radius-md)' }}>
                  <BellRing size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                    <strong>Instant Push Notifications:</strong> Escrow deposits, client reviews & scout splits.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 'var(--rf-radius-md)' }}>
                  <Lock size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                    <strong>Hardware Biometrics:</strong> {selectedAppPlatform === 'ios' ? 'Face ID / Touch ID' : 'Biometric Fingerprint'} wallet payout clearance.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 'var(--rf-radius-md)' }}>
                  <Zap size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.8125rem', color: 'var(--rf-cream)' }}>
                    <strong>Pan-African Offline Sync:</strong> Chat and contract history cached across mobile data.
                  </div>
                </div>
              </div>

              {/* Interactive VIP Beta Access Form */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 187, 42, 0.12) 0%, rgba(5, 20, 10, 0.6) 100%)',
                  border: '1px solid rgba(102, 187, 42, 0.3)',
                  borderRadius: 'var(--rf-radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1rem'
                }}
              >
                {!waitlistSubmitted ? (
                  <form onSubmit={handleWaitlistSubmit}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                      Get Priority Beta Invitation
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', margin: '0 0 0.85rem 0' }}>
                      Enter your email to receive an early access invite code and test build link.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={waitlistEmail}
                        onChange={e => setWaitlistEmail(e.target.value)}
                        className="rf-input"
                        style={{
                          flex: 1,
                          minWidth: '200px',
                          fontSize: '0.8125rem',
                          padding: '0.55rem 0.85rem',
                          background: 'rgba(0, 0, 0, 0.4)',
                          borderColor: 'rgba(102, 187, 42, 0.3)'
                        }}
                      />
                      <button
                        type="submit"
                        className="rf-btn rf-btn-mint rf-btn-sm"
                        style={{ fontWeight: 800, padding: '0.55rem 1rem', whiteSpace: 'nowrap' }}
                      >
                        <span>Join Whitelist</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.5rem 0' }}>
                    <CheckCircle size={20} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>
                        You are on the VIP Beta Whitelist!
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginTop: '0.2rem' }}>
                        We sent an early confirmation to <strong>{waitlistEmail}</strong>. You will be notified the moment the next {selectedAppPlatform === 'ios' ? 'TestFlight' : 'Google Play'} release batch goes live.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dedicated Android Direct APK Channel Card */}
              {selectedAppPlatform === 'android' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(102, 187, 42, 0.3)',
                    borderRadius: 'var(--rf-radius-lg)',
                    padding: '1.25rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#FFFFFF' }}>
                      Direct APK Channel
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        background: 'rgba(102, 187, 42, 0.18)',
                        color: 'var(--rf-leaf-green)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(102, 187, 42, 0.35)'
                      }}
                    >
                      Android 9.0+
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                    {apkDownloaded ? (
                      <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 700 }}>
                        ✓ refeir-v1.2.0-alpha.apk download started. Check your browser downloads.
                      </span>
                    ) : (
                      <span>
                        Stand-alone build: <strong style={{ color: '#FFFFFF' }}>refeir-v1.2.0-alpha.apk</strong> • 24.8 MB
                      </span>
                    )}
                  </p>

                  <button
                    type="button"
                    disabled={apkDownloading || apkDownloaded}
                    onClick={handleDownloadApk}
                    className="rf-btn rf-btn-mint"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      gap: '0.5rem',
                      padding: '0.7rem 1.25rem',
                      background: apkDownloaded ? 'rgba(102, 187, 42, 0.2)' : undefined,
                      borderColor: apkDownloaded ? 'var(--rf-leaf-green)' : undefined,
                      color: apkDownloaded ? 'var(--rf-leaf-green)' : undefined,
                      cursor: apkDownloading || apkDownloaded ? 'default' : 'pointer'
                    }}
                  >
                    {apkDownloading ? (
                      <>
                        <Loader2 size={16} className="rf-spin" />
                        <span>Downloading APK (24.8 MB)...</span>
                      </>
                    ) : apkDownloaded ? (
                      <>
                        <CheckCircle size={16} color="var(--rf-leaf-green)" />
                        <span>APK File Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Download refeir-v1.2.0-alpha.apk (24.8 MB)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Bottom Dismiss & Info Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '1rem',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                  {selectedAppPlatform === 'ios'
                    ? 'Apple TestFlight builds roll out weekly to whitelist members.'
                    : 'SHA-256 Verified • Direct side-loadable on Android 9.0+ devices.'}
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rf-btn rf-btn-ghost rf-btn-sm"
                  style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginLeft: 'auto' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REFEIR PRO MODAL */}
      <RefeirProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </footer>
  );
};
