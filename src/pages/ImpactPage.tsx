import React from 'react';
import { Globe2, TrendingUp, Users, Shield, ArrowRight, Award, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface ImpactPageProps {
  onNavigate?: (path: string) => void;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({ onNavigate = () => {} }) => {
  const metrics = [
    { label: 'Total Escrow Protected', value: '₦48.6M+', sub: 'Zero payment defaults across 12 countries', color: 'var(--rf-leaf-green)' },
    { label: 'Verified African Talent', value: '12,400+', sub: 'Engineers, designers & specialists empowered', color: '#7DA2FF' },
    { label: 'Scout Referral Earnings', value: '₦4.86M+', sub: 'Direct community wealth distribution', color: '#F4B942' },
    { label: 'Sovereign Markets Live', value: '12 / 54', sub: 'Expanding to all AU nations by 2027', color: 'var(--rf-mint)' },
  ];

  const pillars = [
    {
      icon: Shield,
      title: 'Dignified, Guaranteed Pay',
      desc: 'Ending the epidemic of unpaid freelance work in Africa. Every project is pre-funded into a double-entry Trust Vault before talent writes a single line of code.',
      color: 'var(--rf-leaf-green)'
    },
    {
      icon: Users,
      title: 'Community-Driven Wealth (10% Guarantee)',
      desc: 'Our Scout network turns local peer connections into sustainable income. Mentors, community leaders, and alumni earn lifelong rewards for backing talent.',
      color: '#7DA2FF'
    },
    {
      icon: Globe2,
      title: 'Cross-Border Economic Mobility',
      desc: 'Enabling a developer in Nairobi to deliver work for a fintech in Lagos or a client in London, getting paid in their native currency without exorbitant FX friction.',
      color: '#F4B942'
    },
    {
      icon: Award,
      title: 'Verified Professional Reputations',
      desc: 'Providing immutable, cryptographic verification of identity and skills, elevating African talent on the global stage as world-class builders.',
      color: 'var(--rf-mint)'
    }
  ];

  const sdgs = [
    { num: 'SDG 8', name: 'Decent Work & Economic Growth', detail: 'Guaranteed wages, safe cross-border contracts, and formalizing freelance labor.' },
    { num: 'SDG 9', name: 'Industry, Innovation & Infrastructure', detail: 'Building pan-African payment rails and collaborative software networks.' },
    { num: 'SDG 10', name: 'Reduced Inequalities', detail: 'Equal access to global project opportunities regardless of passport or geography.' },
    { num: 'SDG 17', name: 'Partnerships for the Goals', detail: 'Collaborating with regional tech hubs, universities, and regulatory bodies.' }
  ];

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, rgba(10, 36, 20, 0.7) 0%, transparent 100%)', borderBottom: '1px solid var(--rf-navy-border)', padding: '5rem 0 4rem', textAlign: 'center' }}>
        <div className="rf-container" style={{ maxWidth: '840px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', background: 'rgba(102,187,42,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102,187,42,0.2)' }}>
            <Heart size={16} />
            <span>OUR IMPACT & SOCIAL MISSION</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Empowering Africa's Talent.<br />Securing Every Paycheck.
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--rf-slate-300)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 2rem' }}>
            Refeir was founded to dismantle the barriers African professionals face in cross-border commerce: non-payment, currency friction, and lack of institutional trust.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-primary rf-btn-lg">
              <span>Explore Verified Talent</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => onNavigate('/why-refeir')} className="rf-btn rf-btn-secondary rf-btn-lg">
              <span>Read Our Manifesto</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rf-container" style={{ maxWidth: '1100px' }}>
        {/* Metric Cards */}
        <div style={{ margin: '4rem 0' }}>
          <div className="rf-grid-4">
            {metrics.map(m => (
              <div key={m.label} className="rf-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--rf-cream)', marginTop: '0.5rem' }}>{m.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Impact Pillars */}
        <div style={{ marginBottom: '4.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)' }}>The 4 Pillars of Refeir Impact</h2>
            <p style={{ color: 'var(--rf-slate-400)', marginTop: '0.5rem', fontSize: '0.9375rem' }}>How our economic architecture creates enduring value across Africa.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {pillars.map(p => {
              const IconComp = p.icon;
              return (
                <div key={p.title} className="rf-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <IconComp size={24} color={p.color} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>{p.title}</h3>
                  <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1 }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* UN SDG Alignment */}
        <div className="rf-card" style={{ padding: '3rem', marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', letterSpacing: '0.05em' }}>
              GLOBAL STANDARDS
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>
              United Nations Sustainable Development Goals
            </h2>
            <p style={{ color: 'var(--rf-slate-400)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Refeir directly supports four key UN SDGs across sub-Saharan Africa.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {sdgs.map(s => (
              <div key={s.num} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--rf-navy-border)', borderRadius: 'var(--rf-radius-md)', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-leaf-green)' }}>{s.num}</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--rf-cream)', marginTop: '0.25rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginTop: '0.5rem', lineHeight: 1.5 }}>{s.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rf-card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid rgba(102,187,42,0.35)' }}>
          <Sparkles size={36} color="var(--rf-leaf-green)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
            Be Part of Africa's Economic Transformation
          </h2>
          <p style={{ color: 'var(--rf-slate-300)', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
            Join as a Scout to earn from your network, hire verified African professionals as a Client, or build your career as Talent.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/dashboard/scout')} className="rf-btn rf-btn-primary rf-btn-lg">
              <span>Become a Scout</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => onNavigate('/partnerships')} className="rf-btn rf-btn-secondary rf-btn-lg">
              <span>Partner With Us</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
