import React from 'react';
import { ShieldCheck, Lock, UserCheck, CreditCard, Scale, AlertTriangle, ArrowRight } from 'lucide-react';

interface TrustSafetyPageProps {
  onNavigate?: (path: string) => void;
}

export const TrustSafetyPage: React.FC<TrustSafetyPageProps> = ({ onNavigate = () => {} }) => {
  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '1000px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', background: 'rgba(102, 187, 42, 0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102, 187, 42, 0.2)' }}>
          <ShieldCheck size={16} />
          <span>SECURITY & INTEGRITY ARCHITECTURE</span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Trust, Safety & Security at Refeir
        </h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1.0625rem', maxWidth: '680px', margin: '1rem auto 0', lineHeight: 1.6 }}>
          How we protect over ₦48M+ in African transactions, guarantee genuine peer introductions, and secure cross-border payouts across 54 sovereign nations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="rf-card" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(102, 187, 42, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Lock size={24} color="var(--rf-leaf-green)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
            Payment Protection Vault
          </h3>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Every project milestone is 100% pre-funded before work starts. Talent is never at risk of unpaid invoices, and clients only release funds upon verifying delivered work.
          </p>
        </div>

        <div className="rf-card" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <UserCheck size={24} color="#38BDF8" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
            Multi-Tier Identity & KYC
          </h3>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Every talent and scout undergoes government ID verification, biometric selfie liveness audits, and verified technical portfolio reviews before matching with clients.
          </p>
        </div>

        <div className="rf-card" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Scale size={24} color="#F59E0B" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
            72-Hour Dispute Arbitration
          </h3>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            If deliverables do not match the agreed brief, our neutral arbitration tribunal inspects git commits, logs, and designs to issue a fast, binding resolution.
          </p>
        </div>

        <div className="rf-card" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(10, 26, 18, 0.95) 100%)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <AlertTriangle size={24} color="#EF4444" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F87171', marginBottom: '0.5rem' }}>
            Automated DLP & Anti-Circumvention
          </h3>
          <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Chatting outside of Refeir (via WhatsApp, Telegram, Zoom, Email) and sharing external links or phone numbers between Scouts, Talents, and Clients is strictly prohibited. Violators face immediate permanent ban and total forfeiture of all wallet holdings, escrow balances, and commissions.
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="rf-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(10, 26, 18, 0.95), rgba(7, 23, 14, 0.98))', border: '1px solid rgba(102, 187, 42, 0.3)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
          Ready to experience safe Pan-African collaboration?
        </h2>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', maxWidth: '560px', margin: '0 auto 1.5rem' }}>
          Join thousands of verified African developers, scouts, and global businesses working with 100% money-back protection.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-primary rf-btn-lg">
            <span>Explore Talent Marketplace</span>
            <ArrowRight size={16} />
          </button>
          <button onClick={() => onNavigate('/protection')} className="rf-btn rf-btn-secondary rf-btn-lg">
            <span>Read Pay Protection Notice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
