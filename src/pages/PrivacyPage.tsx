import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, Globe2 } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate?: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate = () => {} }) => {
  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--rf-navy-border)', paddingBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <Shield size={16} />
          <span>DATA PROTECTION & REGULATORY COMPLIANCE</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
          Last updated: January 2026 • Compliant with NDPR (Nigeria), POPIA (South Africa), Data Protection Act (Kenya), GDPR & African Union Cyber Laws.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: 'var(--rf-slate-300)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
        <section className="rf-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="var(--rf-leaf-green)" />
            1. Overview & Scope
          </h2>
          <p>
            Refeir Technologies ("Refeir", "we", "us", or "our") is dedicated to protecting the privacy, identity, and financial security of all peer scouts, freelancers, agencies, and enterprise clients across Africa and the global diaspora. This Privacy Policy details how we collect, process, store, and safeguard your personal and transactional information when using our platform.
          </p>
        </section>

        <section className="rf-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={20} color="var(--rf-mint)" />
            2. Information We Collect
          </h2>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>Identity & KYC Data:</strong> Full legal name, date of birth, government-issued identification (NIN, BVN verification, Passport, or National ID), biometric facial liveness data.</li>
            <li><strong>Professional Data:</strong> Portfolio links, verified code repositories, skill badges, employment history, and work artifacts.</li>
            <li><strong>Financial & Payout Data:</strong> Bank account numbers, Mobile Money numbers (M-Pesa, MTN MoMo, Airtel Money), tax identifiers, and transaction history.</li>
            <li><strong>Referral & Attribution Records:</strong> Unique scout referral links, introduction timestamps, client-talent matching data, and reward attribution tokens.</li>
          </ul>
        </section>

        <section className="rf-card" style={{ padding: '2rem', borderLeft: '4px solid var(--rf-leaf-green)' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} color="var(--rf-leaf-green)" />
            3. Biometric Video & Face Capture (Camera Permissions)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p>
              To maintain absolute trust, eliminate deepfakes, prevent fraudulent impersonation, and safeguard milestone escrows across 54 African countries, Refeir provides an optional <strong>Tier 2 Sovereign Biometric Video & Face Verification</strong>.
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Explicit User Consent:</strong> Your camera is never activated without your command. Refeir strictly requires a physical user gesture and explicit checkbox consent before initiating live video or snapshot hardware feeds.</li>
              <li><strong>3D Biometric Video Motion Analysis:</strong> Short 4-second video recordings evaluate natural head rotation (left/right yaw and pitch) and optical flow depth to guarantee physical human presence and actively defeat deepfake injection attacks.</li>
              <li><strong>Ephemeral Processing & Vector Encryption:</strong> Raw video clips are processed into mathematical spatial vectors encrypted under AES-256 and TLS 1.3 standards. Video recordings are never sold, rented, or distributed to third-party ad networks.</li>
              <li><strong>Right to Erasure & Revocation:</strong> You hold the unequivocal right to revoke biometric permissions and permanently purge stored facial vectors or video verification clips at any time by contacting <strong style={{ color: 'var(--rf-leaf-green)' }}>privacy@refeir.africa</strong>.</li>
            </ul>
          </div>
        </section>

        <section className="rf-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe2 size={20} color="#7DA2FF" />
            4. Cross-Border Data Transfers
          </h2>
          <p>
            Because Refeir operates across 54 sovereign African nations, your data may be processed in cloud data centers located in secure regions (including South Africa, Frankfurt, and Dublin) governed by stringent international encryption standards (AES-256 at rest, TLS 1.3 in transit).
          </p>
        </section>

        <section className="rf-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--rf-cream)" />
            5. User Rights & Data Deletion
          </h2>
          <p>
            Under African and international privacy regulations, you retain the full right to access, rectify, port, or request permanent deletion of your profile data. To exercise your rights or contact our Pan-African Data Protection Officer, email <strong style={{ color: 'var(--rf-leaf-green)' }}>privacy@refeir.africa</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
