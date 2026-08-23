import React from 'react';
import { Star, ThumbsUp, ArrowRight, Globe2, Award } from 'lucide-react';

interface ReviewsPageProps {
  onNavigate?: (path: string) => void;
}

const REVIEWS = [
  { name: 'Taiwo Adeyemi', role: 'Client · Lagos, Nigeria 🇳🇬', rating: 5, text: 'Hired a senior React developer in 48 hours. The escrow protection meant I could kick off the project immediately knowing funds were safe. The talent was KYC-verified and delivered exactly as agreed.', date: 'Aug 2026', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { name: 'Blessing Okafor', role: 'Talent · Abuja, Nigeria 🇳🇬', rating: 5, text: 'First time in 6 years of freelancing that I\'ve been paid instantly on milestone approval. Refeir\'s platform feels like it was designed by someone who actually freelanced in Africa before.', date: 'Aug 2026', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  { name: 'George Mensah', role: 'Scout · Accra, Ghana 🇬🇭', rating: 5, text: 'I referred 12 developers from my LinkedIn last month. Refeir\'s attribution system tracked every single one and I earned GH₵9,400 in referral commissions without doing any additional work.', date: 'Jul 2026', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { name: 'Amina Hassan', role: 'Talent · Nairobi, Kenya 🇰🇪', rating: 5, text: 'The KYC verification gave me credibility I never had on other platforms. Clients on Refeir know I am who I say I am. Got my first USD contract within 2 weeks of joining.', date: 'Jul 2026', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80' },
  { name: 'Sipho Dlamini', role: 'Client · Johannesburg, SA 🇿🇦', rating: 5, text: 'Our startup hired 3 full-stack engineers and a UI/UX designer simultaneously across two African countries. The project workspaces, milestone tracking and dispute-free experience were exceptional.', date: 'Jun 2026', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
  { name: 'Nadia Moussa', role: 'Scout · Cairo, Egypt 🇪🇬', rating: 5, text: 'I was skeptical at first — I\'d tried referral programs that never paid out. Refeir is different. The commissions hit my wallet automatically and I can withdraw to my Egyptian bank account same day.', date: 'Jun 2026', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
];

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate = () => {} }) => {
  const avgRating = 4.9;

  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#F4B942', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', background: 'rgba(244,185,66,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(244,185,66,0.2)' }}>
          <Star size={16} fill="#F4B942" />
          <span>REFEIR REVIEWS</span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem' }}>
          Trusted by Thousands<br />Across Africa
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {[1,2,3,4,5].map(i => <Star key={i} size={28} fill="#F4B942" color="#F4B942" />)}
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{avgRating} / 5.0</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>Based on 2,400+ verified platform reviews</div>
      </div>

      {/* Reviews grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        {REVIEWS.map(r => (
          <div key={r.name} className="rf-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={r.avatar} alt={r.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(244,185,66,0.3)' }} />
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>{r.role}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-500)' }}>{r.date}</span>
            </div>
            <div style={{ display: 'flex', gap: '2px' }}>
              {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} fill="#F4B942" color="#F4B942" />)}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--rf-slate-200)', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.text}"</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rf-card" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(244,185,66,0.25)' }}>
        <Award size={36} color="#F4B942" style={{ marginBottom: '0.75rem' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>Join thousands of satisfied users</h2>
        <p style={{ color: 'var(--rf-slate-300)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>Start as a Scout, Talent, or Client. All roles are free to join.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-primary">
            <span>Explore Marketplace</span><ArrowRight size={15} />
          </button>
          <button onClick={() => onNavigate('/scouts')} className="rf-btn rf-btn-secondary">
            <span>Become a Scout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
