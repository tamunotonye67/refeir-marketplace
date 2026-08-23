import React from 'react';
import { Globe2, Users, Sparkles, TrendingUp, ArrowRight, Shield, Briefcase } from 'lucide-react';

interface AboutPageProps {
  onNavigate?: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate = () => {} }) => {
  const leadership = [
    { name: 'Tonye Taylor', role: 'Founder & CEO', country: 'Nigeria 🇳🇬', bio: 'Serial entrepreneur building Africa\'s cross-border professional infrastructure. Previously led product at multiple Pan-African fintech ventures.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Amara Diallo', role: 'CTO & Co-founder', country: 'Senegal 🇸🇳', bio: 'Distributed systems architect with 12 years building payments infrastructure across West and East Africa.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Kofi Mensah', role: 'VP Growth & Scout Network', country: 'Ghana 🇬🇭', bio: 'Former Google Africa lead. Built talent ecosystems across 14 African countries reaching 200K+ professionals.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { name: 'Wanjiku Kamau', role: 'Head of Compliance & Legal', country: 'Kenya 🇰🇪', bio: 'Pan-African financial regulatory specialist covering NDPR, POPIA, Data Protection Act Kenya, and AU Cyber Laws.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, rgba(10,26,18,0.6) 0%, transparent 100%)', borderBottom: '1px solid var(--rf-navy-border)', padding: '5rem 0 4rem', textAlign: 'center' }}>
        <div className="rf-container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', background: 'rgba(102,187,42,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102,187,42,0.2)' }}>
            <Globe2 size={16} />
            <span>OUR STORY</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Built for Africa's Talent.<br />Powered by Africa's Networks.
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--rf-slate-300)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' }}>
            Refeir was founded with one belief: the most talented engineers, designers, and strategists in the world deserve a platform that reflects their quality — and guarantees they get paid.
          </p>
        </div>
      </div>

      <div className="rf-container" style={{ maxWidth: '1100px' }}>
        {/* Mission */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', margin: '4rem 0' }}>
          {[
            { icon: Shield, color: 'var(--rf-leaf-green)', title: 'Our Mission', desc: 'To build a pan-African talent marketplace where every professional introduction is rewarded, every project is protected, and every payment is guaranteed.' },
            { icon: TrendingUp, color: '#F4B942', title: 'Our Vision', desc: 'A future where African talent competes for and wins global contracts as equals — backed by world-class tooling, verified reputations, and guaranteed contracts.' },
            { icon: Users, color: '#7DA2FF', title: 'Our Impact', desc: 'Matching thousands of verified African professionals with local and international clients, with ₦48M+ in protected project escrow across 6 nations.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="rf-card" style={{ padding: '2rem' }}>
              <Icon size={28} color={color} style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>{title}</h3>
              <p style={{ color: 'var(--rf-slate-300)', lineHeight: 1.6, fontSize: '0.9375rem' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Leadership */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>Leadership</h2>
          <p style={{ color: 'var(--rf-slate-400)', marginBottom: '2rem' }}>The team building Africa's cross-border professional layer.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {leadership.map(person => (
              <div key={person.name} className="rf-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <img src={person.avatar} alt={person.name} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', display: 'block', border: '3px solid rgba(102,187,42,0.3)' }} />
                <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{person.name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-leaf-green)', fontWeight: 700, marginTop: '2px' }}>{person.role}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '2px' }}>{person.country}</div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, marginTop: '0.75rem' }}>{person.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rf-card" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(10,26,18,0.9), rgba(7,23,14,0.95))', border: '1px solid rgba(102,187,42,0.3)' }}>
          <Briefcase size={36} color="var(--rf-leaf-green)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>Join the Movement</h2>
          <p style={{ color: 'var(--rf-slate-300)', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Whether you're a scout, talent, or business — Refeir is building the infrastructure for Africa's next generation of global professionals.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-primary rf-btn-lg">
              <span>Explore Talent</span><ArrowRight size={16} />
            </button>
            <button onClick={() => onNavigate('/contact')} className="rf-btn rf-btn-secondary rf-btn-lg">
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
