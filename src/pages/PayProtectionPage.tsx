import React from 'react';
import { ShieldCheck, Lock, Coins, ArrowRight, CheckCircle2, Clock, CreditCard, Globe2 } from 'lucide-react';

interface PayProtectionPageProps {
  onNavigate?: (path: string) => void;
}

export const PayProtectionPage: React.FC<PayProtectionPageProps> = ({ onNavigate = () => {} }) => {
  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '960px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', background: 'rgba(102,187,42,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102,187,42,0.2)' }}>
          <ShieldCheck size={16} />
          <span>PAYMENT PROTECTION ARCHITECTURE</span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Pay Protection Notice
        </h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1.0625rem', maxWidth: '700px', margin: '1rem auto 0', lineHeight: 1.6 }}>
          Refeir is a technology platform — not a bank. Every transaction on our platform is processed through licensed, regulated payment gateway infrastructure.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { icon: Lock, color: 'var(--rf-leaf-green)', title: '100% Escrow Protection', desc: 'Client funds are held in a regulated double-entry custody vault before any work begins. Talent is guaranteed payment upon milestone approval.' },
          { icon: Clock, color: '#F4B942', title: '3–7 Day Payout Holding', desc: 'To prevent fraud and chargebacks, all first-time milestone payouts pass through a 3–7 day review holding period before release to talent bank accounts.' },
          { icon: Globe2, color: '#7DA2FF', title: '54-Country Payment Rails', desc: 'We partner with licensed local payment processors (Paystack, Flutterwave, M-Pesa, MTN MoMo) in each sovereign operating jurisdiction.' },
          { icon: CreditCard, color: 'var(--rf-mint)', title: 'Licensed Gateway Partners', desc: 'Financial transactions are processed via PCI-DSS certified payment gateways and licensed money transfer operators registered in each country of operation.' },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className="rf-card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Icon size={24} color={color} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>

      <div className="rf-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>Regulatory Disclosure</h2>
        <p style={{ color: 'var(--rf-slate-300)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
          Refeir Technologies is a technology platform facilitating peer professional introductions and milestone-based project management. Refeir does not represent itself as a bank, financial institution, or licensed money transmitter. Financial transactions, protected project holding funds, and payouts are processed exclusively via licensed payment gateway infrastructure and local banking partners in each respective operating jurisdiction.
        </p>
        <p style={{ color: 'var(--rf-slate-300)', lineHeight: 1.7, fontSize: '0.9375rem', marginTop: '1rem' }}>
          For questions about payment processing, refunds, or escrow custody, contact our financial compliance team at <strong style={{ color: 'var(--rf-leaf-green)' }}>payments@refeir.africa</strong>.
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={() => onNavigate('/trust')} className="rf-btn rf-btn-primary">
          <span>View Full Trust & Safety Policy</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
