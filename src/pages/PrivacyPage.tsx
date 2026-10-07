import React from 'react';
import { Shield, Lock, Eye, FileText, ArrowRight } from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT
} from '../constants/brand';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B', paddingTop: 72 }}>
      {/* Header Banner */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: '80px 24px 60px', color: '#FFFFFF', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_LEAF_GREEN}33`,
            padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 16
          }}>
            Legal & Compliance
          </span>
          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif',
            marginBottom: 12
          }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
            Last updated: March 2026 • Refeir Technologies Ltd.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '70px 24px 100px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', fontSize: 15, lineHeight: 1.8, color: '#334155' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: RF_DEEP_GREEN, marginTop: 32, marginBottom: 12 }}>
            1. Overview & Commitment
          </h2>
          <p>
            Refeir Technologies Ltd. ("Refeir", "we", "us", or "our") respects your privacy and is committed to protecting the personal information you share when applying for the Refeir Pioneer Program or using our web applications. This Privacy Policy explains our practices regarding collection, usage, and disclosure of applicant data.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: RF_DEEP_GREEN, marginTop: 32, marginBottom: 12 }}>
            2. Information We Collect
          </h2>
          <p>When you submit an application to join Refeir Pioneers, we collect:</p>
          <ul style={{ paddingLeft: 24, marginTop: 8, marginBottom: 16 }}>
            <li><strong>Personal Identifiers:</strong> Your full name, email address, WhatsApp telephone number, city, and country of residence.</li>
            <li><strong>Professional Data:</strong> Selected division squads, primary roles, skills, portfolio URLs, GitHub profiles, and descriptions of past work.</li>
            <li><strong>Application Context:</strong> Your stated availability, learning goals, contribution interests, and how you discovered Refeir.</li>
            <li><strong>Admissions Records:</strong> Generated Application IDs (e.g. RP-2026-XXXXXX), review status notes, and assigned squad placements.</li>
          </ul>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: RF_DEEP_GREEN, marginTop: 32, marginBottom: 12 }}>
            3. How We Use Your Information
          </h2>
          <p>We process your personal information strictly for the following purposes:</p>
          <ul style={{ paddingLeft: 24, marginTop: 8, marginBottom: 16 }}>
            <li>To evaluate your qualifications and fit for specific Pioneer divisions and cohorts.</li>
            <li>To communicate application decisions, admissions updates, and community invitations via email or WhatsApp.</li>
            <li>To facilitate admissions status lookups through our Admissions Portal.</li>
            <li>To coordinate sprint deliverables, town hall schedules, and beta access permissions for admitted Pioneers.</li>
          </ul>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: RF_DEEP_GREEN, marginTop: 32, marginBottom: 12 }}>
            4. Data Storage & Security
          </h2>
          <p>
            Your information is stored in secured cloud databases with row-level security (RLS), transport layer encryption (TLS 1.3), and strict role-based access control limited to authorized admissions committee members. We do not sell, rent, or trade your personal data with third-party advertisers.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: RF_DEEP_GREEN, marginTop: 32, marginBottom: 12 }}>
            5. Your Rights & Data Requests
          </h2>
          <p>
            You have the right to request a copy of the personal data we hold about you, request corrections to inaccurate records, or request complete deletion of your application history. To exercise any of these rights, email us at <a href="mailto:privacy@refeir.com" style={{ color: RF_LEAF_GREEN, fontWeight: 600 }}>privacy@refeir.com</a>.
          </p>

          <div style={{
            marginTop: 48, paddingTop: 28, borderTop: '1px solid #E2E8F0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14
          }}>
            <button
              onClick={() => onNavigate('/terms')}
              style={{
                background: 'none', border: 'none', color: RF_LEAF_GREEN, fontSize: 14,
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              View Terms of Service <ArrowRight size={14} />
            </button>

            <button
              onClick={() => onNavigate('/#apply')}
              style={{
                background: RF_DEEP_GREEN, color: '#FFFFFF', border: 'none', padding: '10px 22px',
                borderRadius: 100, fontSize: 13.5, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Return to Pioneer Application
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
