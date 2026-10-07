import React from 'react';
import { FileText, Shield, ArrowRight } from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT
} from '../constants/brand';

interface TermsPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
            Legal Agreement
          </span>
          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif',
            marginBottom: 12
          }}>
            Terms of Service
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
            1. Nature of the Pioneer Program
          </h2>
          <p>
            The Refeir Pioneer Program is an early community collaboration, product feedback, and fellowship initiative designed to co-create Africa’s referral-powered freelance economy. Participation as a Pioneer is voluntary and does not establish an employment, partnership, agency, or joint venture relationship between you and Refeir Technologies Ltd.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: RF_DEEP_GREEN, marginTop: 32, marginBottom: 12 }}>
            2. Code of Conduct & Integrity
          </h2>
          <p>All admitted Pioneers agree to adhere strictly to our Community Guidelines:</p>
          <ul style={{ paddingLeft: 24, marginTop: 8, marginBottom: 16 }}>
            <li>Treat all fellow contributors, squad leads, and community moderators with professional respect.</li>
            <li>Maintain zero tolerance for discrimination, harassment, abusive language, or fraudulent claims.</li>
            <li>Refrain from spamming personal commercial solicitations or unsolicited mass messaging in community channels.</li>
          </ul>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: RF_DEEP_GREEN, marginTop: 32, marginBottom: 12 }}>
            3. Confidentiality of Pre-Release Software
          </h2>
          <p>
            During your tenure as a Pioneer, you may receive confidential access to unreleased software architectures, Figma design files, internal API endpoints, and strategic business roadmaps. You agree not to distribute, screenshot, publicly disclose, or reverse-engineer these materials without explicit written consent from Refeir.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: RF_DEEP_GREEN, marginTop: 32, marginBottom: 12 }}>
            4. Intellectual Property & Contributions
          </h2>
          <p>
            Feedback, suggestions, feature ideas, and sprint contributions submitted directly to Refeir’s core codebase, design system, or documentation may be integrated into the Refeir platform. You grant Refeir a perpetual, royalty-free, worldwide license to use and commercialize such contributions within the Refeir ecosystem.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: RF_DEEP_GREEN, marginTop: 32, marginBottom: 12 }}>
            5. Program Termination & Modifications
          </h2>
          <p>
            Refeir reserves the right to modify the Pioneer program rules, cohort structures, or revoke Pioneer status in the event of code of conduct violations, persistent inactivity, or breach of confidentiality.
          </p>

          <div style={{
            marginTop: 48, paddingTop: 28, borderTop: '1px solid #E2E8F0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14
          }}>
            <button
              onClick={() => onNavigate('/privacy')}
              style={{
                background: 'none', border: 'none', color: RF_LEAF_GREEN, fontSize: 14,
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              View Privacy Policy <ArrowRight size={14} />
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
