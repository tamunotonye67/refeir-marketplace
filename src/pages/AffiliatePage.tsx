import React from 'react';
import { Coins, ArrowRight, CheckCircle2, Users, Share2, TrendingUp } from 'lucide-react';

interface AffiliatePageProps {
  onNavigate?: (path: string) => void;
}

export const AffiliatePage: React.FC<AffiliatePageProps> = ({ onNavigate = () => {} }) => {
  const [email, setEmail] = React.useState('');
  const [joined, setJoined] = React.useState(false);

  const tiers = [
    { name: 'Starter Scout', min: 0, max: 5, commission: '10%', color: 'var(--rf-slate-400)', badge: '🥉' },
    { name: 'Pro Scout', min: 6, max: 15, commission: '12%', color: '#7DA2FF', badge: '🥈' },
    { name: 'Elite Scout', min: 16, max: 30, commission: '15%', color: '#F4B942', badge: '🥇' },
    { name: 'Legend Scout', min: 31, max: null, commission: '18%', color: 'var(--rf-leaf-green)', badge: '👑' },
  ];

  return (
    <div className="rf-container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#F4B942', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', background: 'rgba(244,185,66,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(244,185,66,0.2)' }}>
          <Coins size={16} />
          <span>EARN WITH REFEIR</span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem' }}>
          Affiliate & Refer-a-Client Programs
        </h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          Two ways to earn on Refeir — refer talent as a Scout or bring in new business clients as an Affiliate. Both programs pay guaranteed commissions.
        </p>
      </div>

      {/* Scout Tiers */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>Scout Commission Tiers</h2>
        <p style={{ color: 'var(--rf-slate-400)', marginBottom: '2rem' }}>Your commission rate grows automatically as you make more successful referrals.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {tiers.map(tier => (
            <div key={tier.name} className="rf-card" style={{ padding: '2rem', textAlign: 'center', border: `1px solid ${tier.color}30` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{tier.badge}</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>{tier.name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', marginBottom: '1rem' }}>
                {tier.max ? `${tier.min}–${tier.max} referrals` : `${tier.min}+ referrals`}
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: tier.color }}>{tier.commission}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-500)', marginTop: '0.25rem' }}>guaranteed commission</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { icon: Share2, step: '01', title: 'Get Your Referral Link', desc: 'Every registered Scout gets a unique, trackable referral link from their dashboard.' },
          { icon: Users, step: '02', title: 'Share with Your Network', desc: 'Share on LinkedIn, WhatsApp, Twitter, or any channel. Each click is attributed to you.' },
          { icon: CheckCircle2, step: '03', title: 'Referral Signs Up & Works', desc: 'When your referral joins, gets verified, and earns from a project — you automatically earn your commission.' },
          { icon: Coins, step: '04', title: 'Receive Your Payout', desc: 'Earnings are deposited to your Refeir wallet instantly upon milestone completion. Withdraw anytime.' },
        ].map(({ icon: Icon, step, title, desc }) => (
          <div key={step} className="rf-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--rf-leaf-green)', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>STEP {step}</div>
            <Icon size={24} color="var(--rf-leaf-green)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.55 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Airfee Token Client Introduction Standard */}
      <div
        className="rf-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(36, 87, 255, 0.08) 0%, rgba(54, 224, 160, 0.06) 100%)',
          border: '1px solid rgba(54, 224, 160, 0.25)',
          marginBottom: '4rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(54, 224, 160, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={18} color="var(--rf-mint)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
              Airfee Token: Introduce a Paying Client & Unlock 0% Fee Rate
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
              Waive the 2% platform fee on all high-tier referral rewards (&gt;10%) down to 0% for the entire month.
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--rf-slate-300)' }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--rf-radius-md)' }}>
            <strong style={{ color: 'var(--rf-cream)', display: 'block', marginBottom: '0.25rem' }}>1. Submit Exact Client Details</strong>
            Ensure the Hiring Manager Name and Company Name entered in your Scout Command Center match the client's registered account.
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--rf-radius-md)' }}>
            <strong style={{ color: 'var(--rf-cream)', display: 'block', marginBottom: '0.25rem' }}>2. Deal Completion Required</strong>
            The client must register and complete a paid talent hire or service contract on Refeir. If the client does not hire, no token is granted.
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--rf-radius-md)' }}>
            <strong style={{ color: 'var(--rf-cream)', display: 'block', marginBottom: '0.25rem' }}>3. Admin Confirmation & Grant</strong>
            Refeir Admin reviews the deal settlement, confirms matching credentials, and manually awards your Monthly Airfee Token.
          </div>
        </div>
      </div>

      {/* Join CTA */}
      <div className="rf-card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid rgba(244,185,66,0.3)' }}>
        <Coins size={40} color="#F4B942" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>Start Earning Today</h2>
        {joined ? (
          <div>
            <p style={{ color: 'var(--rf-leaf-green)', fontWeight: 700, fontSize: '1.125rem' }}>✅ You're on the list! Check your email for your Scout referral link.</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--rf-slate-300)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>Enter your email to get your Scout referral link and start earning from Day 1.</p>
            <form onSubmit={e => { e.preventDefault(); setJoined(true); }} style={{ display: 'flex', gap: '0.75rem', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap' }}>
              <input className="rf-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ flex: 1 }} />
              <button type="submit" className="rf-btn rf-btn-primary" style={{ gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <span>Get My Scout Link</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
