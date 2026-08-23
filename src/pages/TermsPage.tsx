import React from 'react';
import { Scale, CheckCircle2, ShieldAlert, Award, FileCheck, Coins } from 'lucide-react';

interface TermsPageProps {
  onNavigate?: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate = () => {} }) => {
  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--rf-navy-border)', paddingBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-mint)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <Scale size={16} />
          <span>MARKETPLACE AGREEMENT & GOVERNANCE</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
          Effective: January 2026 • Governing peer professional referrals, milestone escrows, and verified contracts.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: 'var(--rf-slate-300)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
        <section className="rf-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--rf-leaf-green)" />
            1. The 10% Scout Referral Guarantee
          </h2>
          <p>
            Refeir operates a patented peer-referral attribution engine. When a verified Scout introduces a client or talent to the platform, the Scout is cryptographically guaranteed a minimum 10% commission on all completed project milestone earnings generated throughout the active attribution window (standard 30 to 180 days).
          </p>
        </section>

        <section className="rf-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coins size={20} color="#F4B942" />
            2. Payment Protection & Escrow Holding
          </h2>
          <p>
            All client funds for fixed-price milestones or hourly retainers must be pre-funded and locked into the Refeir Payment Protection vault prior to work commencement. Funds are only disbursed to talent upon explicit milestone approval or favorable resolution of an arbitration dispute.
          </p>
        </section>

        <section className="rf-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} color="#FF6B6B" />
            3. Non-Circumvention Policy
          </h2>
          <p>
            To protect scout attribution and trust across our African talent network, clients and talent introduced through Refeir agree not to conduct direct commercial transactions outside the platform for a period of 12 months from first introduction without opting for the official Enterprise Direct Buyout.
          </p>
        </section>

        <section className="rf-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck size={20} color="var(--rf-mint)" />
            4. Dispute Resolution & Arbitration
          </h2>
          <p>
            In the event of a disagreement regarding deliverable quality or scope adherence, either party may trigger the Refeir Dispute Resolution Center. Independent Pan-African dispute arbiters review submitted work logs, git commits, and milestone briefs to issue a binding, final resolution within 72 hours.
          </p>
        </section>

        <section className="rf-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coins size={20} color="var(--rf-leaf-green)" />
            5. Referrer Economics, 0% Fee Forever & Airfee Token Policy
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Referrers (Scouts) operate on transparent economic tiers designed to reward network builders across Africa:
          </p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <li><strong>0% Fee Forever (Offer Rates &le; 10%):</strong> Referrers keep 100% of their commission proceeds with 0% platform fee deduction when recommending talent services with reward rates of 10% and below.</li>
            <li><strong>2% Airfee (Offer Rates &gt; 10%):</strong> For talent offering higher commissions (above 10%), referrers pay an "Airfee" of 2% of their proceeds to support platform arbitration and escrow infrastructure.</li>
            <li><strong>Exclusive Local Client Links & Monthly Airfee Tokens:</strong> Only verified Referrers have exclusive onboarding links to introduce local clients and businesses. Referrers who introduce clients receive a free monthly <strong>Airfee Token</strong> (valid for that calendar month) that waives the 2% Airfee to 0% on all high-tier earnings!</li>
            <li><strong>Mandatory In-Platform Delivery:</strong> All work deliverables (code repositories, design links, APKs) must be submitted exclusively via the Refeir Deliverables Console. Communicating or transacting via WhatsApp between talent and client voids escrow dispute eligibility.</li>
          </ul>
        </section>

        <section className="rf-card" style={{ padding: '2rem', borderLeft: '4px solid #EF4444', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(10, 26, 18, 0.9) 100%)' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#F87171', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} color="#EF4444" />
            6. Strict Prohibition on Chatting Outside Refeir, Sharing Contacts & Asset Forfeiture Policy
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            To safeguard scout attribution, maintain multi-currency escrow integrity, and prevent fraudulent disintermediation scams, <strong>chatting outside of Refeir and the sharing of personal or business phone numbers, external website links, social media handles, WhatsApp/Telegram contacts, external video/voice call links (Zoom, Google Meet, Teams), or direct emails between Referrers (Scouts), Clients, and Talents is strictly and unconditionally prohibited.</strong> All communications, scoping conversations, contract negotiations, file reviews, and feedback must occur exclusively inside Refeir's encrypted workspaces.
          </p>
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--rf-radius-md)', padding: '1rem', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#FCA5A5', marginBottom: '0.5rem' }}>
              PENALTIES FOR CHATTING OUTSIDE REFEIR & DISINTERMEDIATION VIOLATIONS:
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--rf-slate-200)' }}>
              <li><strong>Immediate Permanent Account Ban:</strong> Any talent, scout, or client found guilty of chatting outside Refeir, soliciting external communication, or transmitting off-platform contact details will be immediately and permanently banned from the Refeir ecosystem with permanent identity blacklisting.</li>
              <li><strong>Irreversible Total Asset Forfeiture:</strong> Guilty parties immediately forfeit 100% of all accumulated multi-currency wallet holdings, locked escrow deposits, and pending 10% referral commission balances. Forfeited assets are reallocated to the Pan-African Trust and Victim Restitution Reserve without right of appeal.</li>
              <li><strong>Automated DLP & Semantic Enforcement:</strong> All message exchanges and negotiations are continuously policed by automated regex, semantic AI, and Data Loss Prevention (DLP) neural filters that instantly intercept outside chat proposals and alert platform security arbiters.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};
