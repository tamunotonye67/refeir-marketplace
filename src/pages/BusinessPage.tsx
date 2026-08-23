import React from 'react';
import { Building2, Shield, Users, Globe2, Sparkles, CheckCircle2, ArrowRight, FileCheck, Layers, Award } from 'lucide-react';

interface BusinessPageProps {
  onNavigate: (path: string) => void;
}

export const BusinessPage: React.FC<BusinessPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '80vh' }}>
      {/* Hero */}
      <section
        style={{
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(246, 178, 26, 0.15), transparent 70%), var(--rf-bg-base)',
          borderBottom: '1px solid var(--rf-bg-card-border)'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(246, 178, 26, 0.12)',
              border: '1px solid rgba(246, 178, 26, 0.35)',
              borderRadius: 'var(--rf-radius-full)',
              padding: '0.375rem 1rem',
              marginBottom: '1.5rem'
            }}
          >
            <Building2 size={16} color="var(--rf-golden-yellow)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-golden-yellow)' }}>
              REFEIR FOR ENTERPRISE & SCALE-UPS
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1.12, marginBottom: '1.25rem' }}>
            Scale Engineering & Creative Teams Across 54 African Nations
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            Access Africa's top 1% vetted talent through localized scout networks. Consolidated billing, cross-border tax compliance, and dedicated talent managers.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/jobs')} className="rf-btn rf-btn-primary rf-btn-lg" style={{ gap: '0.5rem' }}>
              <span>Post Enterprise Project</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-secondary rf-btn-lg">
              Explore Verified Talent
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise Pillars */}
      <section className="rf-section">
        <div className="rf-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
              Why Leading Companies Choose Refeir
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', marginTop: '0.5rem' }}>
              Eliminating friction in cross-border African hiring and project execution.
            </p>
          </div>

          <div className="rf-grid-3">
            <div className="rf-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--rf-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Sparkles size={24} color="var(--rf-leaf-green)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                Dedicated Scout Networks
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Unlike traditional marketplaces where you sift through hundreds of unsolicited proposals, Refeir taps senior African tech leads to refer vetted professionals who match your exact stack.
              </p>
            </div>

            <div className="rf-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(246, 178, 26, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <FileCheck size={24} color="var(--rf-golden-yellow)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                Cross-Border Legal & Compliance
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Receive unified compliant invoices in USD, EUR, GBP, or local currencies. We manage cross-border contractor classification, tax documentation, and IP assignment across 54 jurisdictions.
              </p>
            </div>

            <div className="rf-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244, 124, 32, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Shield size={24} color="var(--rf-vibrant-orange)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                100% Milestone Vault Protection
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Funds are held in secure Trust Vault. Milestones are released only after your internal team reviews code commits, designs, and deliverables with built-in revision cycles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
