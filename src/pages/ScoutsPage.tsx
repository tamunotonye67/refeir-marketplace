import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Coins, ArrowRight, CheckCircle2, Star, Shield, Zap, MessageSquare, Sparkles, Lock, ArrowLeft } from 'lucide-react';

interface ScoutsPageProps {
  onNavigate?: (path: string) => void;
}

export const ScoutsPage: React.FC<ScoutsPageProps> = ({ onNavigate = () => {} }) => {
  const { currentUser, switchRole } = useAuth();
  const activeRole = currentUser?.active_role;

  // STRICT RULE: In Talent mode, the Talent should not be able to browse Scouts unless reached out to by Scouts
  if (activeRole === 'TALENT') {
    return (
      <div className="rf-container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '800px' }}>
        <div
          className="rf-card rf-card-glow"
          style={{
            padding: '3rem 2.5rem',
            textAlign: 'center',
            border: '1.5px solid rgba(102, 187, 42, 0.35)',
            background: 'linear-gradient(180deg, rgba(102, 187, 42, 0.06) 0%, var(--rf-navy-surface) 100%)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(102, 187, 42, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: 'var(--rf-leaf-green)'
            }}
          >
            <Shield size={32} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', background: 'rgba(102,187,42,0.1)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102,187,42,0.25)' }}>
            <Lock size={13} />
            <span>Talent Inbound Discovery Protocol</span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Scouts Reach Out Directly To You
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--rf-slate-300)', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 2rem' }}>
            You are currently in <strong style={{ color: 'var(--rf-mint)' }}>Talent Mode</strong>. Refeir Scouts discover your verified profile, skills, and portfolio automatically to recommend you to high-paying client contracts. Scouts initiate contact directly through your inbox when a matching opportunity arises.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '440px', margin: '0 auto 2rem' }}>
            <button
              onClick={() => onNavigate('/messages')}
              className="rf-btn rf-btn-primary rf-btn-lg rf-w-full"
              style={{ fontWeight: 800, gap: '0.5rem', justifyContent: 'center' }}
            >
              <MessageSquare size={16} />
              <span>View Scout Inquiries in Messages</span>
            </button>

            <button
              onClick={() => switchRole('SCOUT')}
              className="rf-btn rf-btn-secondary rf-btn-lg rf-w-full"
              style={{ fontWeight: 700, gap: '0.5rem', justifyContent: 'center' }}
            >
              <Users size={16} />
              <span>Switch to Scout Mode to Refer Peers</span>
            </button>

            <button
              onClick={() => onNavigate('/dashboard/talent')}
              className="rf-btn rf-btn-ghost rf-btn-md rf-w-full"
              style={{ color: 'var(--rf-slate-400)', justifyContent: 'center' }}
            >
              <ArrowLeft size={15} />
              <span>Back to Talent Workspace</span>
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--rf-navy-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.8125rem', color: 'var(--rf-slate-400)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="var(--rf-mint)" />
              100% Inbound Privacy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="var(--rf-mint)" />
              Protected Rate Integrity
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, rgba(10,40,20,0.7) 0%, transparent 100%)', borderBottom: '1px solid var(--rf-navy-border)', padding: '5rem 0 4rem', textAlign: 'center' }}>
        <div className="rf-container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', background: 'rgba(102,187,42,0.08)', padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(102,187,42,0.2)' }}>
            <Users size={16} />
            <span>SCOUT NETWORK</span>
          </div>
          <h1 style={{ fontSize: '3.25rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Turn Your Network<br />Into Income
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--rf-slate-300)', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 2.5rem' }}>
            Refeir Scouts earn a guaranteed <strong style={{ color: 'var(--rf-leaf-green)' }}>10–18% commission</strong> every time someone they referred completes a paid project. No limit. No cap.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/dashboard/scout')} className="rf-btn rf-btn-primary rf-btn-lg">
              <Zap size={16} />
              <span>Open Scout Dashboard</span>
            </button>
            <button onClick={() => onNavigate('/affiliates')} className="rf-btn rf-btn-secondary rf-btn-lg">
              <span>View Commission Tiers</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rf-container" style={{ maxWidth: '1100px' }}>
        {/* What makes a Scout */}
        <div style={{ margin: '4rem 0' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)', textAlign: 'center', marginBottom: '0.5rem' }}>What is a Refeir Scout?</h2>
          <p style={{ color: 'var(--rf-slate-400)', textAlign: 'center', marginBottom: '2.5rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            A Scout is any professional who uses their network to introduce talent, clients, or both to Refeir — and earns a guaranteed commission on every resulting project.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Users, color: 'var(--rf-leaf-green)', title: 'HR Professionals', desc: 'Refer candidates from your talent pool and earn when they complete paid projects.' },
              { icon: Star, color: '#7DA2FF', title: 'Developers & Designers', desc: 'Know great freelancers? Refer them and earn from their success without doing the work yourself.' },
              { icon: Shield, color: '#F4B942', title: 'Community Leaders', desc: 'Run a tech WhatsApp group, Discord, or LinkedIn community? Your audience = your earning potential.' },
              { icon: Coins, color: 'var(--rf-mint)', title: 'Agency Owners', desc: 'Grow your roster and earn referral commissions on overflow work placed outside your agency.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="rf-card" style={{ padding: '1.75rem' }}>
                <Icon size={26} color={color} style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div id="benefits" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '2rem' }}>Scout Benefits</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              '10–18% guaranteed commission on every completed milestone',
              'Real-time wallet tracking and instant payout withdrawal',
              'Unique tracked referral link with 30–180 day attribution window',
              'Tiered Scout badge (Starter → Pro → Elite → Legend)',
              'Access to Scout-only talent matching tools and pipelines',
              'Priority support and dedicated Scout success manager',
              'Monthly Scout leaderboard with bonus rewards for top earners',
              'Scout Dashboard with full referral analytics and earnings history',
            ].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--rf-radius-md)', border: '1px solid var(--rf-navy-border)' }}>
                <CheckCircle2 size={16} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--rf-slate-200)', lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rf-card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid rgba(102,187,42,0.35)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>Ready to start earning?</h2>
          <p style={{ color: 'var(--rf-slate-300)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Open your Scout dashboard to get your unique referral link, track attributions, and withdraw commissions.
          </p>
          <button onClick={() => onNavigate('/dashboard/scout')} className="rf-btn rf-btn-primary rf-btn-lg">
            <Users size={16} />
            <span>Go to Scout Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
