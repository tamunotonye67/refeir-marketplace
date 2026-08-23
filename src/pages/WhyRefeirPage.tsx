import React from 'react';
import { ShieldCheck, Lock, Globe2, Sparkles, ArrowRight, Zap, CheckCircle2, Award, Users, Scale, Heart } from 'lucide-react';

interface WhyRefeirPageProps {
  onNavigate: (path: string) => void;
}

export const WhyRefeirPage: React.FC<WhyRefeirPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '80vh' }}>
      {/* Hero */}
      <section
        style={{
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(102, 187, 42, 0.22), transparent 70%), var(--rf-bg-base)',
          borderBottom: '1px solid var(--rf-bg-card-border)'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(102, 187, 42, 0.12)',
              border: '1px solid rgba(102, 187, 42, 0.35)',
              borderRadius: 'var(--rf-radius-full)',
              padding: '0.375rem 1rem',
              marginBottom: '1.5rem'
            }}
          >
            <ShieldCheck size={16} color="var(--rf-leaf-green)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>
              THE REFEIR DIFFERENCE
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 800, color: 'var(--rf-cream)', lineHeight: 1.12, marginBottom: '1.25rem' }}>
            Transforming Word-of-Mouth Into Africa's Economic Engine
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 2.5rem' }}>
            Traditional platforms treat hiring as cold, transactional matching with heavy markups. Refeir powers connections through trusted professional networks — locking in legally binding scout rewards, safeguarding project Trust Vault, and bridging 54 sovereign African markets.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/demo-tour')} className="rf-btn rf-btn-mint rf-btn-lg">
              <span>Interactive Cross-Border Demo</span>
            </button>
            <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-secondary rf-btn-lg">
              Browse African Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="rf-section">
        <div className="rf-container">
          <div className="rf-grid-2" style={{ gap: '2rem' }}>
            <div className="rf-card" style={{ padding: '2.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--rf-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Lock size={24} color="var(--rf-leaf-green)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                1. Locked Referral Attribution
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Every referral link (`RF-XXXXXX`) creates an immutable snapshot of agreed project pricing and scout commission percentage. With a 30-day protected attribution window, scouts earn guaranteed rewards without having to follow up manually.
              </p>
            </div>

            <div className="rf-card" style={{ padding: '2.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(246, 178, 26, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} color="var(--rf-golden-yellow)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                2. 100% Trust Vault Milestone Protection
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Clients deposit funds into the Refeir Trust Vault prior to work commencement. Talent works with peace of mind knowing funds are secured, and clients only release payment when milestone deliverables meet specifications.
              </p>
            </div>

            <div className="rf-card" style={{ padding: '2.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244, 124, 32, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Globe2 size={24} color="var(--rf-vibrant-orange)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                3. Native Pan-African Infrastructure
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Built natively for 54 African countries with localized payment rails: M-Pesa (Kenya, Tanzania), MTN / Vodafone MoMo (Ghana, Rwanda, Uganda), Nigerian Bank Transfer (NGN), and international cross-border rails.
              </p>
            </div>

            <div className="rf-card" style={{ padding: '2.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--rf-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Scale size={24} color="var(--rf-leaf-green)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                4. Verified Peer-to-Peer Reputation
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Talent profiles feature verified GitHub commits, live Figma portfolios, and verified cross-border client reviews. Scouts build verifiable reputation tiers that unlock priority matching and higher referral opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
