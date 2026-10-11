import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ScoutSourcingPageProps {
  onNavigate: (path: string) => void;
}

export const ScoutSourcingPage: React.FC<ScoutSourcingPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'scouts' | 'clients'>('scouts');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: 'What is a Refeir Scout?',
      a: 'A Scout is an industry insider, engineer, agency lead, or connector who recommends verified African talent to clients or introduces hiring clients to our marketplace. Scouts leverage their professional relationships to make high-trust introductions.'
    },
    {
      q: 'How much do scouts earn?',
      a: 'Scouts earn a guaranteed 10% cash reward on every milestone payment released by the client throughout the project lifecycle. The payout is automated and locked in platform escrow, ensuring you get paid as soon as work is approved.'
    },
    {
      q: 'Do I need to be an engineer or technical to scout?',
      a: 'No. Anyone with a credible network—community leads, founders, technical recruiters, agency owners, or seasoned freelancers—can register as a scout and refer talent or projects.'
    },
    {
      q: 'How do payouts and currency withdrawals work?',
      a: 'Rewards are credited to your multi-currency Refeir Wallet. You can withdraw directly into your local African currency (M-Pesa, MTN Mobile Money, Nigerian Naira, Kenyan Shillings, Ghana Cedis, South African Rand) or in US Dollars.'
    },
    {
      q: 'What are the rules regarding referrals?',
      a: 'Scouts must only endorse candidates whose capabilities or portfolio they have verified. Self-referrals (referring yourself as the client and hired talent on the same contract) and spamming unverified links are strictly prohibited and result in permanent disqualification.'
    },
    {
      q: 'How does Refeir protect clients using scout sourcing?',
      a: 'Every project milestone is held in our Trust Vault escrow. Clients only release funds when satisfied with the deliverable. If a dispute arises, Refeir Vault Mediation evaluates deliverables impartially before releasing any funds.'
    }
  ];

  const EARNING_TIERS = [
    { tier: 'Starter Project', milestone: '$1,500', reward: '$150', desc: 'Single-feature MVP, design sprint, or landing page.' },
    { tier: 'Core Application', milestone: '$5,000', reward: '$500', desc: 'Full-stack web or mobile app development phase.' },
    { tier: 'Quarterly Retainer', milestone: '$12,000', reward: '$1,200', desc: 'Multi-month dedicated engineering or design engagement.' },
    { tier: 'Enterprise Contract', milestone: '$25,000', reward: '$2,500', desc: 'Full cross-border agile squad deployed over 6 months.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '85vh', backgroundColor: 'var(--rf-bg-base)' }}>
      {/* 1. HERO HEADER */}
      <section
        style={{
          padding: 'clamp(4rem, 8vw, 6.5rem) 1.5rem clamp(3.5rem, 6vw, 5rem)',
          textAlign: 'center',
          background: isDark
            ? 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(102, 187, 42, 0.18), transparent 70%), var(--rf-bg-base)'
            : 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(102, 187, 42, 0.12), transparent 70%), var(--rf-bg-base)',
          borderBottom: '1px solid var(--rf-bg-card-border)',
          position: 'relative'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Eyebrow Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(102, 187, 42, 0.12)',
              border: '1px solid rgba(102, 187, 42, 0.3)',
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              marginBottom: '1.5rem'
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#66BB2A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Refeir Scout Sourcing & Referral Network
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--rf-font-display)',
              fontSize: 'clamp(2.3rem, 5.2vw, 3.85rem)',
              fontWeight: 600,
              color: 'var(--rf-cream)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.35rem'
            }}
          >
            Everything you need to know about scouting and referring on Refeir
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: 'var(--rf-slate-300)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 2.5rem'
            }}
          >
            Learn how Refeir connects clients with vetted African talent through trusted scouts, how you earn guaranteed milestone rewards, and the standards that govern our network.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('/register?role=scout')}
              className="rf-btn rf-btn-primary rf-btn-lg"
              style={{
                fontWeight: 700,
                padding: '0.9rem 2.25rem',
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(102, 187, 42, 0.45)'
              }}
            >
              <span>Get Started as a Scout</span>
            </button>

            <button
              onClick={() => onNavigate('/register?role=client')}
              className="rf-btn rf-btn-secondary rf-btn-lg"
              style={{
                fontWeight: 600,
                padding: '0.9rem 2rem',
                fontSize: '1rem'
              }}
            >
              <span>Hire via Scout Sourcing</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. THREE-STEP LIFECYCLE */}
      <section className="rf-section" style={{ borderBottom: '1px solid var(--rf-bg-card-border)' }}>
        <div className="rf-container" style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2
              style={{
                fontFamily: 'var(--rf-font-display)',
                fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
                fontWeight: 600,
                color: 'var(--rf-cream)',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem'
              }}
            >
              How Scout Sourcing Works
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.55 }}>
              A straightforward, transparent process connecting reputable talent with serious hiring teams.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                background: 'var(--rf-bg-card)',
                border: '1px solid var(--rf-bg-card-border)',
                borderRadius: '20px',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(102, 187, 42, 0.15)',
                  border: '1px solid rgba(102, 187, 42, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#66BB2A',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  marginBottom: '1.5rem'
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                Identify & Endorse
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                Discover verified African developers, designers, and specialists. Generate your encrypted scout link or endorse candidate profiles directly to hiring companies.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: 'var(--rf-bg-card)',
                border: '1px solid var(--rf-bg-card-border)',
                borderRadius: '20px',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(102, 187, 42, 0.15)',
                  border: '1px solid rgba(102, 187, 42, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#66BB2A',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  marginBottom: '1.5rem'
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                Client Hires in Escrow
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                The client agrees on project scope and deposits milestones into the Refeir Trust Vault escrow. Work begins under clear, agreed terms with full deposit security.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: 'var(--rf-bg-card)',
                border: '1px solid var(--rf-bg-card-border)',
                borderRadius: '20px',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(102, 187, 42, 0.15)',
                  border: '1px solid rgba(102, 187, 42, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#66BB2A',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  marginBottom: '1.5rem'
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                Automated 10% Payout
              </h3>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                As milestone deliverables are approved and released, your 10% scout reward is automatically transferred into your wallet for instant local currency withdrawal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL BENEFITS (FOR SCOUTS VS FOR CLIENTS) */}
      <section className="rf-section" style={{ backgroundColor: 'var(--rf-bg-surface)' }}>
        <div className="rf-container" style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2
              style={{
                fontFamily: 'var(--rf-font-display)',
                fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
                fontWeight: 600,
                color: 'var(--rf-cream)',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem'
              }}
            >
              Key Benefits
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.55 }}>
              Engineered to reward connectors while giving employers the highest confidence.
            </p>

            {/* Toggle Tabs */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--rf-bg-card)',
                border: '1px solid var(--rf-bg-card-border)',
                borderRadius: '14px',
                padding: '0.35rem',
                marginTop: '1.75rem'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('scouts')}
                style={{
                  background: activeTab === 'scouts' ? '#66BB2A' : 'transparent',
                  color: activeTab === 'scouts' ? '#07160D' : 'var(--rf-slate-300)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem 1.75rem',
                  fontSize: '0.925rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>For Scouts & Referrers</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('clients')}
                style={{
                  background: activeTab === 'clients' ? '#66BB2A' : 'transparent',
                  color: activeTab === 'clients' ? '#07160D' : 'var(--rf-slate-300)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem 1.75rem',
                  fontSize: '0.925rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>For Hiring Clients</span>
              </button>
            </div>
          </div>

          {/* Tab Content: For Scouts */}
          {activeTab === 'scouts' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '1.5rem'
              }}
            >
              <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '18px', padding: '1.85rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                  10% Guaranteed Cash Reward
                </h4>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                  Earn a locked 10% share from every milestone payment your referred talents complete, transparently recorded in platform escrow.
                </p>
              </div>

              <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '18px', padding: '1.85rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                  Multi-Currency African Payouts
                </h4>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                  Withdraw your earnings through M-Pesa, MTN Mobile Money, Nigerian Bank Transfer (NGN), Kenyan Shillings, Ghana Cedis, or USD.
                </p>
              </div>

              <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '18px', padding: '1.85rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                  Zero Invoicing or Follow-Ups
                </h4>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                  No chasing unpaid invoices. The platform manages escrow agreements, contract tracking, and automated disbursement.
                </p>
              </div>

              <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '18px', padding: '1.85rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                  Reputation & Elite Bounties
                </h4>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                  Successful referrals elevate your Scout Tier, unlocking exclusive enterprise recruiting bounties and direct client scouting briefs.
                </p>
              </div>
            </div>
          )}

          {/* Tab Content: For Clients */}
          {activeTab === 'clients' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '1.5rem'
              }}
            >
              <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '18px', padding: '1.85rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                  Vetted by Peers with Domain Expertise
                </h4>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                  Receive candidate recommendations curated by engineers, designers, and community leads who understand the actual craft.
                </p>
              </div>

              <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '18px', padding: '1.85rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                  100% Milestone Escrow Protection
                </h4>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                  Never pay upfront for incomplete work. Funds remain protected in Refeir Trust Vault escrow until you review and approve deliverables.
                </p>
              </div>

              <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '18px', padding: '1.85rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                  No Surcharge Fees to Clients
                </h4>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                  The 10% scout reward is absorbed within the platform standard commission structure. You never pay extra fees for using scout sourcing.
                </p>
              </div>

              <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '18px', padding: '1.85rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                  Rapid 48-Hour Turnaround
                </h4>
                <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                  Scouts tap directly into 54 African country talent communities, delivering tailored candidate matches within 48 business hours.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. RULES & NETWORK INTEGRITY */}
      <section className="rf-section" style={{ borderBottom: '1px solid var(--rf-bg-card-border)' }}>
        <div className="rf-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2
              style={{
                fontFamily: 'var(--rf-font-display)',
                fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
                fontWeight: 600,
                color: 'var(--rf-cream)',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem'
              }}
            >
              The Rules of the Scout Network
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.55 }}>
              To safeguard trust and merit across African markets, every participant adheres to five non-negotiable standards.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Rule 1 */}
            <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '16px', padding: '1.75rem 2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#66BB2A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Rule 01
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Honest Endorsements Only
              </h4>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                Scouts may only endorse candidates whose capabilities, past deliverables, or verified credentials they have personally assessed. Submitting bulk unsolicited referrals or misleading endorsements leads to immediate suspension.
              </p>
            </div>

            {/* Rule 2 */}
            <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '16px', padding: '1.75rem 2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#66BB2A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Rule 02
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Reward Tied to Milestone Release
              </h4>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                Scout commissions are paid only on funds successfully released by the hiring client upon approving deliverables. Cancelled, refunded, or fraudulent milestone attempts do not generate scout payouts.
              </p>
            </div>

            {/* Rule 3 */}
            <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '16px', padding: '1.75rem 2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#66BB2A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Rule 03
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Anti-Collusion & Role Separation
              </h4>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                A scout cannot act as both the client and the hired talent on the same contract to manufacture circular commissions. Refeir automated audit systems detect and freeze matched accounts attempting self-referral loops.
              </p>
            </div>

            {/* Rule 4 */}
            <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '16px', padding: '1.75rem 2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#66BB2A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Rule 04
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Cryptographic Attribution Integrity
              </h4>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                Every referral is cryptographically tied to the referrer link or verified endorsement ID upon account creation or project assignment. Overwriting existing referrers through cookie tampering is strictly blocked.
              </p>
            </div>

            {/* Rule 5 */}
            <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: '16px', padding: '1.75rem 2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#66BB2A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Rule 05
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Fair Dispute Mediation
              </h4>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                If a project enters dispute, the Refeir Trust Vault Mediation team reviews deliverables against project specs. Scout commission follows the net released disbursement determined by the final resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REAL-WORLD EARNING SCENARIOS */}
      <section className="rf-section" style={{ backgroundColor: 'var(--rf-bg-surface)', borderBottom: '1px solid var(--rf-bg-card-border)' }}>
        <div className="rf-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2
              style={{
                fontFamily: 'var(--rf-font-display)',
                fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
                fontWeight: 600,
                color: 'var(--rf-cream)',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem'
              }}
            >
              Estimated Earnings Breakdown
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.55 }}>
              Here is how 10% locked referral rewards translate across typical Refeir engagements:
            </p>
          </div>

          <div
            style={{
              background: 'var(--rf-bg-card)',
              border: '1px solid var(--rf-bg-card-border)',
              borderRadius: '20px',
              overflow: 'hidden'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                    <th style={{ padding: '1.15rem 1.5rem', color: 'var(--rf-slate-300)', fontWeight: 700 }}>Project Scope</th>
                    <th style={{ padding: '1.15rem 1.5rem', color: 'var(--rf-slate-300)', fontWeight: 700 }}>Project Value</th>
                    <th style={{ padding: '1.15rem 1.5rem', color: '#66BB2A', fontWeight: 800 }}>Scout Reward (10%)</th>
                    <th style={{ padding: '1.15rem 1.5rem', color: 'var(--rf-slate-300)', fontWeight: 700 }}>Typical Turnaround</th>
                  </tr>
                </thead>
                <tbody>
                  {EARNING_TIERS.map((tier, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: idx < EARNING_TIERS.length - 1 ? '1px solid var(--rf-bg-card-border)' : 'none'
                      }}
                    >
                      <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-cream)', fontWeight: 600 }}>
                        <div>{tier.tier}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--rf-slate-400)', marginTop: '0.2rem' }}>{tier.desc}</div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-cream)', fontWeight: 600 }}>
                        {tier.milestone}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#66BB2A', fontWeight: 800, fontSize: '1.05rem' }}>
                        {tier.reward}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-300)' }}>
                        Instant Upon Milestone Release
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQS */}
      <section className="rf-section" style={{ borderBottom: '1px solid var(--rf-bg-card-border)' }}>
        <div className="rf-container" style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2
              style={{
                fontFamily: 'var(--rf-font-display)',
                fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
                fontWeight: 600,
                color: 'var(--rf-cream)',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem'
              }}
            >
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.55 }}>
              Clear answers to the most common inquiries regarding scout sourcing and referral tracking.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {FAQS.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  style={{
                    background: 'var(--rf-bg-card)',
                    border: '1px solid var(--rf-bg-card-border)',
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(fIdx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--rf-cream)' }}>
                      {faq.q}
                    </span>
                    <span style={{ fontSize: '1.2rem', color: '#66BB2A', fontWeight: 600, marginLeft: '1rem' }}>
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.35rem 1.5rem' }}>
                      <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section
        style={{
          padding: 'clamp(4rem, 7vw, 5.5rem) 1.5rem',
          textAlign: 'center',
          background: 'var(--rf-bg-surface)'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--rf-font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 600,
              color: 'var(--rf-cream)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}
          >
            Start turning connections into guaranteed rewards
          </h2>

          <p
            style={{
              color: 'var(--rf-slate-300)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              marginBottom: '2.25rem'
            }}
          >
            Join thousands of professionals across Africa referring top talent and building sustainable referral earnings.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('/register?role=scout')}
              className="rf-btn rf-btn-primary rf-btn-lg"
              style={{
                fontWeight: 700,
                padding: '0.9rem 2.25rem',
                fontSize: '1rem'
              }}
            >
              <span>Join as a Scout</span>
            </button>

            <button
              onClick={() => onNavigate('/marketplace')}
              className="rf-btn rf-btn-secondary rf-btn-lg"
              style={{
                fontWeight: 600,
                padding: '0.9rem 2rem',
                fontSize: '1rem'
              }}
            >
              <span>Explore Marketplace</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
