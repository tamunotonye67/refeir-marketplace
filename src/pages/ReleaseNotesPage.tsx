import React from 'react';
import { FileText, ArrowRight, Sparkles, Zap, Globe2, Shield, Coins, Users } from 'lucide-react';

interface ReleaseNotesPageProps {
  onNavigate?: (path: string) => void;
}

const RELEASES = [
  {
    version: 'v2.4.0',
    date: 'August 2026',
    type: 'MAJOR',
    color: 'var(--rf-leaf-green)',
    highlights: [
      'Admin Dashboard — Connected Dashboards hub linking all operational workspaces',
      'Pay Protection Notice promoted to full footer navigation link',
      'Scout Benefits dedicated page with tier breakdown and referral analytics',
      'Sponsorship & Partnership portal with multi-type application forms',
      'Footer navigation expanded: Resources, Trust & Legal, Discovery all updated',
      'Follow us & Mobile app strips with clean bare icon design',
    ],
  },
  {
    version: 'v2.3.0',
    date: 'July 2026',
    type: 'FEATURE',
    color: '#7DA2FF',
    highlights: [
      'Animated glowing Shield for 100% Money Back Guarantee section',
      'Classical logo watermark in footer base using SVG gradient rendering',
      'Social media handles: Facebook, LinkedIn, X, YouTube, Instagram, Pinterest',
      'Mobile App download buttons (Apple App Store & Google Play) in footer strip',
      '3D polygon cross-border mesh animation on Refeir for Business section',
    ],
  },
  {
    version: 'v2.2.0',
    date: 'June 2026',
    type: 'FEATURE',
    color: '#F4B942',
    highlights: [
      'Africa 3D Interactive Map with clickable country nodes',
      'Cross-Border Demo Tour — full walkthrough of a complete project lifecycle',
      'Multi-currency Wallet with NGN, KES, GHS, ZAR, USD support',
      'Real-time Scout referral attribution tracking dashboard',
      'Fraud Engine: self-referral detection and risk signal monitoring',
    ],
  },
  {
    version: 'v2.1.0',
    date: 'May 2026',
    type: 'IMPROVEMENT',
    color: 'var(--rf-mint)',
    highlights: [
      'KYC Verification pipeline: Email → Identity → Profession tiers',
      'Immutable audit log system for all platform financial actions',
      'Country Administration Engine: toggle 54 nations without code deploy',
      'Platform Economics panel: configurable fee % and payout hold windows',
      'Dispute Resolution Center with 72-hour binding arbitration',
    ],
  },
];

export const ReleaseNotesPage: React.FC<ReleaseNotesPageProps> = ({ onNavigate = () => {} }) => {
  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <FileText size={16} />
          <span>PRODUCT CHANGELOG</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>Release Notes</h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '560px', marginTop: '0.5rem' }}>
          Every product update, new feature, and improvement shipped to the Refeir platform.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {RELEASES.map(release => (
          <div key={release.version} className="rf-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', fontFamily: 'var(--rf-font-mono)' }}>{release.version}</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: release.color, background: `${release.color}15`, padding: '0.25rem 0.75rem', borderRadius: '100px', border: `1px solid ${release.color}40` }}>
                {release.type}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginLeft: 'auto' }}>{release.date}</span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', paddingLeft: 0, listStyle: 'none' }}>
              {release.highlights.map(h => (
                <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9375rem', color: 'var(--rf-slate-200)', lineHeight: 1.5 }}>
                  <span style={{ color: release.color, fontWeight: 700, flexShrink: 0 }}>+</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
