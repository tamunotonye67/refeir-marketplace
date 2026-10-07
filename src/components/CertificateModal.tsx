import React, { useState, useEffect } from 'react';
import {
  Download, Copy, Check, X
} from 'lucide-react';
import { PioneerCertificate } from '../lib/certificates';
import {
  RF_DEEP_GREEN,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT
} from '../constants/brand';

interface CertificateModalProps {
  certificate: PioneerCertificate;
  isOpen: boolean;
  onClose: () => void;
}

// Authentic Embossed Golden Rosette Seal with Ribbon Tails
const OfficialSeal: React.FC<{ size?: number }> = ({ size = 68 }) => {
  const height = Math.round(size * 1.15);
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 100 115"
      style={{ display: 'block', margin: '0 auto', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.18))' }}
    >
      <defs>
        {/* Ribbon Gradient */}
        <linearGradient id="sealRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C59A3F" />
          <stop offset="50%" stopColor="#E5C77A" />
          <stop offset="100%" stopColor="#8C6318" />
        </linearGradient>

        {/* Starburst Medallion Radial Gradient */}
        <radialGradient id="sealGoldRadial" cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#FFF4BE" />
          <stop offset="35%" stopColor="#ECC260" />
          <stop offset="70%" stopColor="#B88728" />
          <stop offset="100%" stopColor="#784E0B" />
        </radialGradient>

        {/* Ring Linear Gradient */}
        <linearGradient id="sealRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4BE" />
          <stop offset="50%" stopColor="#8F6317" />
          <stop offset="100%" stopColor="#ECC260" />
        </linearGradient>
      </defs>

      {/* Ribbon Tails hanging down behind */}
      <polygon
        points="37,60 25,108 37,98 49,108 43,60"
        fill="url(#sealRibbonGrad)"
        stroke="#6B4508"
        strokeWidth="0.5"
      />
      <polygon
        points="63,60 51,108 63,98 75,108 69,60"
        fill="url(#sealRibbonGrad)"
        stroke="#6B4508"
        strokeWidth="0.5"
      />

      {/* 32-Point Starburst / Rosette Medallion */}
      <polygon
        points="50,8 57.06,12.5 65.31,11.04 70.11,17.9 78.28,19.72 80.1,27.89 86.96,32.69 85.5,40.94 90,48 85.5,55.06 86.96,63.31 80.1,68.11 78.28,76.28 70.11,78.1 65.31,84.96 57.06,83.5 50,88 42.94,83.5 34.69,84.96 29.89,78.1 21.72,76.28 19.9,68.11 13.04,63.31 14.5,55.06 10,48 14.5,40.94 13.04,32.69 19.9,27.89 21.72,19.72 29.89,17.9 34.69,11.04 42.94,12.5"
        fill="url(#sealGoldRadial)"
        stroke="#6B4508"
        strokeWidth="0.75"
      />

      {/* Outer Concentric Beveled Ring */}
      <circle cx="50" cy="48" r="33.5" fill="none" stroke="#6B4508" strokeWidth="1" />
      <circle cx="50" cy="48" r="31.5" fill="none" stroke="url(#sealRingGrad)" strokeWidth="1.5" />

      {/* Beaded Stamped Ring */}
      <circle
        cx="50"
        cy="48"
        r="28"
        fill="none"
        stroke="#FFF8D6"
        strokeWidth="1.2"
        strokeDasharray="1.2,1.8"
      />

      {/* Deep Emerald Inner Core */}
      <circle cx="50" cy="48" r="22" fill="#0A321B" stroke="#D4AF37" strokeWidth="1.5" />

      {/* Center Refeir Emblem */}
      <image href="/Refeir-Favic-Symb.png" x="35" y="33" width="30" height="30" />
    </svg>
  );
};

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const isMobile = windowWidth <= 768;

  const handleDownload = async () => {
    const el = document.getElementById('refeir-certificate-printable');
    if (!el) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FAF9F5'
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Refeir-Certificate-${certificate.pioneer_id || certificate.id || 'Accreditation'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download certificate image', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/status?lookup=${encodeURIComponent(certificate.pioneer_id || certificate.recipient_email)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(5, 18, 11, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '10px 8px calc(16px + env(safe-area-inset-bottom, 16px))' : '20px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: 960,
          width: '100%',
          maxHeight: isMobile ? 'calc(100dvh - 28px - env(safe-area-inset-bottom, 16px))' : '92vh',
          margin: 'auto',
          background: '#0B2115',
          borderRadius: isMobile ? 14 : 20,
          border: '1px solid rgba(24, 252, 92, 0.25)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(24, 252, 92, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Control Bar (Non-Printable, Minimalist & Modern) */}
        <div
          className="no-print"
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '10px 14px' : '12px 20px',
            background: 'rgba(15, 46, 30, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            gap: 8,
            flexWrap: 'wrap'
          }}
        >
          {/* Status & ID Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.06em',
                background: 'rgba(24, 252, 92, 0.12)',
                color: RF_MINT_ACCENT,
                border: `1px solid ${RF_LEAF_GREEN}55`,
                padding: '3px 8px',
                borderRadius: 100,
                textTransform: 'uppercase'
              }}
            >
              {certificate.status === 'ISSUED' ? 'Official' : 'Revoked'}
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.02em',
                maxWidth: isMobile ? 120 : 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {certificate.id}
            </span>
          </div>

          {/* Minimalist Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {/* Download Certificate Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              style={{
                background: RF_LEAF_GREEN,
                color: RF_DEEP_GREEN,
                border: 'none',
                padding: '6px 14px',
                borderRadius: 100,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: isDownloading ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: `0 2px 10px ${RF_LEAF_GREEN}44`,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = RF_MINT_ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.background = RF_LEAF_GREEN)}
            >
              <Download size={13} />
              <span>{isDownloading ? 'Generating...' : 'Download'}</span>
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: 100,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.2s'
              }}
            >
              {copied ? <Check size={12} color={RF_MINT_ACCENT} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                width: 28,
                height: 28,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Certificate Display Container */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            padding: isMobile ? '12px 10px 24px' : '28px',
            background: '#FAF9F5',
            position: 'relative'
          }}
        >
          <div
            id="refeir-certificate-printable"
            style={{
              width: '100%',
              maxWidth: 920,
              minWidth: isMobile ? 480 : undefined,
              aspectRatio: '1.414 / 1',
              margin: '0 auto',
              boxSizing: 'border-box'
            }}
          >
            {renderCertificateContent(isMobile)}
          </div>
        </div>
      </div>

      {/* Print Stylesheet (Strict A4 Landscape Full Bleed) */}
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #refeir-certificate-printable, #refeir-certificate-printable * {
            visibility: visible;
          }
          #refeir-certificate-printable {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            margin: 0 !important;
            padding: 8mm !important;
            box-sizing: border-box !important;
            transform: none !important;
            background: #FFFFFF !important;
            color: #111827 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );

  // Helper renderer for the Certificate Canvas to ensure 100% design fidelity between views
  function renderCertificateContent(isCompact: boolean) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          border: '2.5px solid #0D3E24',
          borderRadius: 10,
          padding: isCompact ? '4px' : '6px',
          position: 'relative',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          boxSizing: 'border-box'
        }}
      >
        {/* Inset Hairline Gold Frame */}
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #C59A3F',
            borderRadius: 6,
            padding: isCompact ? '12px 18px 10px' : '26px 38px 18px',
            textAlign: 'center',
            position: 'relative',
            background: '#FFFFFF',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Subtle Refeir Logo Watermark */}
          <img
            src="/Refeir-Favic-Symb.png"
            alt=""
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: isCompact ? 140 : 220,
              width: 'auto',
              opacity: 0.03,
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          />

          {/* Section 1: Header */}
          <div style={{ position: 'relative' }}>
            <img
              src="/RefeirLogo.png"
              alt="Refeir Logo"
              style={{
                height: isCompact ? 26 : 34,
                width: 'auto',
                display: 'block',
                margin: '0 auto 4px'
              }}
            />
            <div
              style={{
                fontSize: isCompact ? 8.5 : 10,
                letterSpacing: '0.22em',
                color: '#8C6D23',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: 3
              }}
            >
              Founding Pioneer Accreditation
            </div>
            <h1
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: isCompact ? 17 : 24,
                fontWeight: 700,
                color: '#0A1C12',
                margin: '0 0 5px',
                letterSpacing: '0.01em',
                lineHeight: 1.15
              }}
            >
              Certificate of Level Completion
            </h1>
            <div
              style={{
                width: isCompact ? 46 : 64,
                height: 1.5,
                background: '#C59A3F',
                margin: '0 auto',
                opacity: 0.85
              }}
            />
          </div>

          {/* Section 2: Recipient Citation */}
          <div style={{ position: 'relative', margin: isCompact ? '2px 0' : '6px 0' }}>
            <p
              style={{
                fontSize: isCompact ? 10.5 : 12.5,
                color: '#556B5D',
                margin: '0 0 2px',
                fontStyle: 'italic',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}
            >
              This certifies that
            </p>

            <div
              style={{
                fontSize: isCompact ? 21 : 28,
                fontWeight: 700,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: '#0A1C12',
                letterSpacing: '0.01em',
                margin: '1px 0 3px',
                lineHeight: 1.15
              }}
            >
              {certificate.recipient_name}
            </div>

            <p
              style={{
                fontSize: isCompact ? 10 : 12,
                color: '#374151',
                margin: '0 auto 3px',
                maxWidth: 560,
                lineHeight: 1.35
              }}
            >
              has satisfied all verified proof-of-work criteria and is accredited with the sovereign rank of
            </p>

            <div
              style={{
                fontSize: isCompact ? 15 : 20,
                fontWeight: 800,
                color: '#0D4726',
                letterSpacing: '0.03em',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                textTransform: 'uppercase',
                margin: '2px 0 2px'
              }}
            >
              {certificate.level_title}
            </div>

            <div
              style={{
                fontSize: isCompact ? 9 : 11,
                color: '#4B5563'
              }}
            >
              {certificate.division} Squad • {certificate.verified_jobs_count > 0 ? `${certificate.verified_jobs_count} Verified Deliverables` : 'Orientation Completed'} • Pioneer ID: <strong style={{ color: '#0D4726' }}>{certificate.pioneer_id}</strong>
            </div>
          </div>

          {/* Section 3: Signatures & Seal (3-Column Row) */}
          <div
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'flex-end',
              gap: isCompact ? 10 : 18,
              paddingTop: isCompact ? 6 : 10,
              borderTop: '1px solid #E5E7EB',
              maxWidth: 680,
              margin: '0 auto',
              width: '100%'
            }}
          >
            {/* Left Signature: Founder */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: isCompact ? 15 : 19,
                  fontStyle: 'italic',
                  color: '#0D4726',
                  marginBottom: 2
                }}
              >
                Tonye Taylor
              </div>
              <div
                style={{
                  width: isCompact ? 88 : 120,
                  height: 1,
                  background: '#9CA3AF',
                  margin: '0 auto 4px'
                }}
              />
              <div style={{ fontSize: isCompact ? 9.5 : 11, fontWeight: 700, color: '#111827' }}>Tonye Taylor</div>
              <div style={{ fontSize: isCompact ? 8.5 : 9.5, color: '#6B7280' }}>Platform Architect &amp; Founder</div>
            </div>

            {/* Center: Official Golden Rosette Seal */}
            <div style={{ textAlign: 'center' }}>
              <OfficialSeal size={isCompact ? 50 : 66} />
              <div style={{ fontSize: isCompact ? 8 : 9, color: '#6B7280', marginTop: 2, fontWeight: 600 }}>
                Issued: {formattedDate}
              </div>
            </div>

            {/* Right Signature: Admissions & Protocol Council */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: isCompact ? 14 : 18,
                  fontStyle: 'italic',
                  color: '#0D4726',
                  marginBottom: 3
                }}
              >
                Admissions Council
              </div>
              <div
                style={{
                  width: isCompact ? 88 : 120,
                  height: 1,
                  background: '#9CA3AF',
                  margin: '0 auto 4px'
                }}
              />
              <div style={{ fontSize: isCompact ? 9.5 : 11, fontWeight: 700, color: '#111827' }}>Refeir Pioneer Council</div>
              <div style={{ fontSize: isCompact ? 8.5 : 9.5, color: '#6B7280' }}>Sovereign Accreditation Board</div>
            </div>
          </div>

          {/* Section 4: Discreet Verification Footer */}
          <div
            style={{
              position: 'relative',
              marginTop: 4,
              paddingTop: 6,
              borderTop: '1px solid #F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 6,
              fontSize: isCompact ? 8 : 9,
              color: '#9CA3AF'
            }}
          >
            <div>
              Certificate ID: <strong style={{ color: '#374151' }}>{certificate.id}</strong>
            </div>
            <div style={{ fontFamily: 'monospace' }}>
              Hash: <span style={{ color: '#0D4726' }}>{certificate.verification_hash.slice(0, 8)}...{certificate.verification_hash.slice(-6)}</span>
            </div>
            <div>
              Refeir Sovereign Verified Credential
            </div>
          </div>
        </div>
      </div>
    );
  }
};
