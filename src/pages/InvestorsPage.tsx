import React from 'react';
import { TrendingUp, ArrowRight, DollarSign, Globe2, Users, BarChart3, Award, Mail } from 'lucide-react';

interface InvestorsPageProps {
  onNavigate?: (path: string) => void;
}

export const InvestorsPage: React.FC<InvestorsPageProps> = ({ onNavigate = () => {} }) => {
  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Hero */}
      <div style={{ borderBottom: '1px solid var(--rf-navy-border)', padding: '5rem 0 4rem', textAlign: 'center' }}>
        <div className="rf-container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', background: 'rgba(102,187,42,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102,187,42,0.2)' }}>
            <TrendingUp size={16} />
            <span>INVESTOR RELATIONS</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Investing in Africa's<br />Professional Future
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--rf-slate-300)', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 2rem' }}>
            Refeir is building the infrastructure layer for how African talent gets discovered, verified, hired, and paid — across 54 nations, multiple currencies, and global clients.
          </p>
          <button onClick={() => onNavigate('/contact')} className="rf-btn rf-btn-primary rf-btn-lg">
            <Mail size={16} />
            <span>Contact Investor Relations</span>
          </button>
        </div>
      </div>

      <div className="rf-container" style={{ maxWidth: '1100px' }}>
        {/* Traction Metrics */}
        <div style={{ margin: '4rem 0' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', textAlign: 'center', marginBottom: '2rem' }}>Platform Traction</h2>
          <div className="rf-grid-4">
            {[
              { label: 'Total GMV Processed', value: '₦48.6M+', sub: 'Across 6 active markets', color: 'var(--rf-cream)' },
              { label: 'Verified Talent Profiles', value: '12,400+', sub: 'KYC & portfolio verified', color: 'var(--rf-leaf-green)' },
              { label: 'Active Scout Network', value: '3,200+', sub: 'Earning referral commissions', color: '#7DA2FF' },
              { label: 'Countries with Payment Rails', value: '12 / 54', sub: 'Expanding quarterly', color: '#F4B942' },
            ].map(m => (
              <div key={m.label} className="rf-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)', marginTop: '0.5rem' }}>{m.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Invest */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1.5rem' }}>Why Refeir?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Globe2, color: 'var(--rf-leaf-green)', title: 'Largest Untapped Market', desc: 'Africa has 1.4B people, 60% under 25, and the world\'s fastest-growing developer population. Yet no platform natively serves cross-border professional services at scale.' },
              { icon: DollarSign, color: '#F4B942', title: 'Multiple Revenue Streams', desc: '5% client protection fee, Scout subscription tiers, Enterprise direct contract buyouts, and Business+ SaaS subscriptions create diversified, recurring revenue.' },
              { icon: Users, color: '#7DA2FF', title: 'Network Effects Moat', desc: 'Each new scout brings multiple talent. Each talent attracts multiple clients. Our viral referral loop creates compounding growth with low CAC.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="rf-card" style={{ padding: '2rem' }}>
                <Icon size={28} color={color} style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="rf-card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid rgba(102,187,42,0.3)' }}>
          <Award size={40} color="var(--rf-leaf-green)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>Request Investor Deck</h2>
          <p style={{ color: 'var(--rf-slate-300)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Qualified investors can request access to our full data room, financial projections, and cap table.
          </p>
          <button onClick={() => onNavigate('/contact')} className="rf-btn rf-btn-primary rf-btn-lg">
            <Mail size={16} />
            <span>Request Access — investors@refeir.africa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
