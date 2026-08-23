import React from 'react';
import { Star, ArrowRight, Quote, MapPin, Briefcase } from 'lucide-react';

interface SuccessStoriesPageProps {
  onNavigate?: (path: string) => void;
}

const STORIES = [
  {
    name: 'Amaka Nwosu',
    role: 'Senior Product Designer',
    country: 'Lagos, Nigeria 🇳🇬',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    quote: 'I was earning ₦250,000/month on local platforms. Within 3 months on Refeir, I landed a UK client paying $3,200/month with guaranteed milestone escrow. I\'ve never not been paid.',
    earned: '$38,400 earned',
    projects: '12 completed projects',
    tag: 'TALENT STORY',
    color: 'var(--rf-leaf-green)',
  },
  {
    name: 'Kofi Boateng',
    role: 'Elite Scout, Tech Connector',
    country: 'Accra, Ghana 🇬🇭',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    quote: 'I refer about 3 engineers per week from my WhatsApp network. Last month I earned GH₵14,200 purely from referral commissions — without doing any client work myself.',
    earned: 'GH₵180,000 in commissions',
    projects: '47 successful referrals',
    tag: 'SCOUT STORY',
    color: '#7DA2FF',
  },
  {
    name: 'David Kamau',
    role: 'CTO, Twiga Logistics Kenya',
    country: 'Nairobi, Kenya 🇰🇪',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    quote: 'We needed 4 senior backend engineers in 10 days for a new product sprint. Refeir delivered 6 verified candidates. We hired 4. All work was protected and delivered on time.',
    earned: 'KSh 4.2M in projects managed',
    projects: '8 cross-border hires',
    tag: 'CLIENT STORY',
    color: '#F4B942',
  },
  {
    name: 'Fatima Al-Rashid',
    role: 'Full-Stack Engineer',
    country: 'Cairo, Egypt 🇪🇬',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    quote: 'Being in Egypt, I always struggled to find platforms that supported my currency and paid reliably. Refeir gave me USD contracts with local EGP payouts. Game changer.',
    earned: '$22,000 earned',
    projects: '6 international projects',
    tag: 'TALENT STORY',
    color: 'var(--rf-mint)',
  },
];

export const SuccessStoriesPage: React.FC<SuccessStoriesPageProps> = ({ onNavigate = () => {} }) => {
  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', background: 'rgba(102,187,42,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102,187,42,0.2)' }}>
          <Star size={16} />
          <span>SUCCESS STORIES</span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem' }}>
          Real People. Real Earnings.
        </h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1.0625rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
          From Lagos to Nairobi, Cairo to Accra — Refeir is changing how African professionals earn, refer, and grow.
        </p>
      </div>

      {/* Stories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        {STORIES.map(story => (
          <div key={story.name} className="rf-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <img src={story.avatar} alt={story.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${story.color}40`, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: story.color, background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '100px', display: 'inline-block', marginBottom: '0.35rem' }}>{story.tag}</span>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{story.name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>{story.role}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-500)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={11} /> {story.country}
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--rf-radius-md)', borderLeft: `3px solid ${story.color}`, marginBottom: '1.5rem' }}>
              <Quote size={18} color={story.color} style={{ marginBottom: '0.5rem', opacity: 0.6 }} />
              <p style={{ color: 'var(--rf-slate-200)', lineHeight: 1.65, fontSize: '0.9375rem', fontStyle: 'italic' }}>"{story.quote}"</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--rf-radius-md)', padding: '0.75rem 1rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: story.color }}>{story.earned}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>Total earnings</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--rf-radius-md)', padding: '0.75rem 1rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{story.projects}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>On Refeir</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rf-card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid rgba(102,187,42,0.3)' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>Write Your Own Story</h2>
        <p style={{ color: 'var(--rf-slate-300)', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>Join thousands of scouts, talent, and clients already building their careers and businesses on Refeir.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-primary rf-btn-lg">
            <span>Explore Talent</span><ArrowRight size={16} />
          </button>
          <button onClick={() => onNavigate('/dashboard/scout')} className="rf-btn rf-btn-secondary rf-btn-lg">
            <span>Become a Scout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
