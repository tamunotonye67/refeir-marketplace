import React from 'react';
import {
  ArrowRight, Shield, Award, Users, Globe, Flame,
  Milestone, Target, Layers, Quote,
  Compass, Briefcase, Zap
} from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW
} from '../constants/brand';

interface StoryPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus?: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ onNavigate }) => {
  const [activeChapter, setActiveChapter] = React.useState<string>('all');

  const chapters = [
    { id: 'all', label: 'All Chapters', anchor: '#top', icon: Compass },
    { id: 'genesis', label: '1. The Catalyst', anchor: '#genesis', icon: Flame },
    { id: 'founder', label: '2. The Architect', anchor: '#founder', icon: Shield },
    { id: 'why-refeir', label: '3. Why Refeir', anchor: '#why-refeir', icon: Zap },
    { id: 'history', label: '4. Milestones', anchor: '#history', icon: Milestone },
    { id: 'future', label: '5. The Horizon', anchor: '#future', icon: Globe },
    { id: 'manifesto', label: '6. Manifesto', anchor: '#manifesto', icon: Quote }
  ];

  const handlePillClick = (ch: typeof chapters[0]) => {
    setActiveChapter(ch.id);
    if (ch.id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(ch.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div id="top" style={{ minHeight: '100vh', background: '#05120B', color: '#F8FAFC', paddingTop: 72 }}>
      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(145deg, ${RF_DEEP_GREEN} 0%, #07180F 40%, ${RF_FOREST_DARK} 100%)`,
        padding: '110px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(102, 187, 42, 0.15)'
      }}>
        {/* Ambient Radial Glows */}
        <div style={{
          position: 'absolute', top: -140, right: -120, width: 550, height: 550, borderRadius: '50%',
          background: `radial-gradient(circle, ${RF_LEAF_GREEN}20 0%, transparent 70%)`,
          filter: 'blur(70px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: -80, width: 450, height: 450, borderRadius: '50%',
          background: `radial-gradient(circle, ${RF_MINT_ACCENT}15 0%, transparent 70%)`,
          filter: 'blur(80px)', pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1040, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.08)',
            border: `1px solid ${RF_LEAF_GREEN}44`,
            padding: '7px 18px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 24
          }}>
            <Compass size={13} color={RF_MINT_ACCENT} />
            The Refeir Chronicles • Genesis & Vision
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 500, lineHeight: 1.12,
            letterSpacing: '-0.025em', marginBottom: 24, fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            How Refeir was born,<br />
            <span style={{
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_LEAF_GREEN} 60%, ${RF_GOLD_YELLOW} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              and the future we are building.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 1.9vw, 20px)', color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.7, maxWidth: 820, margin: '0 auto 36px', fontWeight: 300
          }}>
            From grassroots university chatrooms and broken freelance bidding boards to an unstoppable economic engine. Discover why Founder <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Tonye Taylor</strong> built Refeir, the untold history of our first cohorts, and the sovereign roadmap ahead.
          </p>

          {/* Chapter Category Filter Pills (Horizontal swipeable on mobile, single line on desktop) */}
          <div className="rp-story-anchors-wrapper">
            <div className="rp-story-anchors">
              {chapters.map(item => {
                const IconComp = item.icon;
                const isSelected = activeChapter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePillClick(item)}
                    className="rp-story-pill"
                    style={{
                      fontSize: 12.5,
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? RF_DEEP_GREEN : 'rgba(255,255,255,0.8)',
                      background: isSelected
                        ? RF_LEAF_GREEN
                        : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isSelected ? RF_LEAF_GREEN : 'rgba(255,255,255,0.12)'}`,
                      padding: '8px 16px',
                      borderRadius: 100,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: isSelected ? `0 4px 14px ${RF_LEAF_GREEN}40` : 'none',
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.color = RF_MINT_ACCENT;
                        e.currentTarget.style.borderColor = `${RF_MINT_ACCENT}55`;
                        e.currentTarget.style.background = 'rgba(24, 252, 92, 0.08)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                  >
                    <IconComp size={13} color={isSelected ? RF_DEEP_GREEN : RF_MINT_ACCENT} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 1: The Genesis - How Refeir Was Born */}
      <section id="genesis" style={{ padding: '90px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="rp-story-genesis-grid">
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: RF_GOLD_YELLOW, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: 12
            }}>
              <Flame size={14} />
              Chapter I • The Catalyst
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, lineHeight: 1.2,
              letterSpacing: '-0.02em', marginBottom: 20, fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              The African freelance paradox & the broken trust gap.
            </h2>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 16 }}>
              Across African universities and tech ecosystems, a profound contradiction exists. Every year, hundreds of thousands of brilliant software engineers, creative directors, growth strategists, and researchers graduate into an artificial economic wall.
            </p>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 16 }}>
              When talented youth turn to global freelance platforms like Upwork or Fiverr, they are greeted by hostile barriers: <span style={{ color: '#FFFFFF', fontWeight: 600 }}>20% platform taxes</span>, geographic bias, arbitrary account terminations with trapped funds, and demoralizing "race-to-the-bottom" bidding wars that devalue African craftsmanship.
            </p>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>
              Yet, beneath the surface of these broken platforms, real commerce was already thriving. In university WhatsApp groups, campus tech circles, and Telegram developer channels, clients were getting hired through direct peer recommendations. But the people vouching for talent and bringing high-ticket deals to the table received zero equity, zero commission, and zero lasting attribution. Refeir was born to institutionalize what Africans do naturally: <strong style={{ color: RF_MINT_ACCENT }}>grow together through trusted referrals</strong>.
            </p>
          </div>

          {/* Key Contrast Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              background: 'rgba(255, 60, 60, 0.05)', border: '1px solid rgba(255, 75, 75, 0.2)',
              borderRadius: 16, padding: '24px 24px'
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#FF7B7B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                The Legacy Gig Trap
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[
                  'Cold, anonymous bidding wars where cheap rates beat real talent.',
                  'Middlemen pocket 20% to 30% without contributing any work.',
                  'Zero rewards for the connector or mentor who matched the client.',
                  'Vulnerable to foreign payment lockouts and sudden account bans.'
                ].map((text, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
                    <span style={{ color: '#FF7B7B', fontSize: 16, lineHeight: 1.2, flexShrink: 0 }}>•</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${RF_DEEP_GREEN}88 0%, rgba(15, 46, 30, 0.4) 100%)`,
              border: `1px solid ${RF_LEAF_GREEN}44`,
              borderRadius: 16, padding: '24px 24px'
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: RF_MINT_ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                The Refeir Breakthrough
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[
                  { title: 'Referral-Powered Work', desc: 'Earn transparent commissions for every talent or client you introduce.' },
                  { title: 'Strict Contributor Ladder', desc: 'Advancement earned through verifiable delivered jobs, not lip service.' },
                  { title: 'Peer-Vouched Verification', desc: 'Reputable Pioneers confirm deliverables before promotions occur.' },
                  { title: 'Sovereign Escrow Rails', desc: 'Protected payments that guarantee immediate disbursements upon milestone clearance.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                    <span style={{ color: RF_MINT_ACCENT, fontSize: 16, lineHeight: 1.2, flexShrink: 0 }}>•</span>
                    <span><strong style={{ color: '#FFFFFF' }}>{item.title}:</strong> {item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: The Founder - Tonye Taylor */}
      <section id="founder" style={{
        background: `linear-gradient(180deg, #07180F 0%, ${RF_DEEP_GREEN}44 50%, #05120B 100%)`,
        padding: '100px 24px',
        borderTop: '1px solid rgba(102, 187, 42, 0.15)',
        borderBottom: '1px solid rgba(102, 187, 42, 0.15)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: 12
            }}>
              <Shield size={14} />
              Chapter II • The Architect
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 500, lineHeight: 1.15,
              letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Meet the Founder: Tonye Taylor
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 680, margin: '14px auto 0', lineHeight: 1.6 }}>
              The journey, the obsession, and the philosophy behind building a sovereign economic bridge for Africa's most ambitious builders.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 40, alignItems: 'stretch'
          }}>
            {/* Founder Portrait & Meta Card */}
            <div style={{
              background: `linear-gradient(145deg, ${RF_DEEP_GREEN}99 0%, #05120B 100%)`,
              border: `1px solid ${RF_LEAF_GREEN}44`,
              borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/11', overflow: 'hidden', background: '#020704' }}>
                <img
                  src="/images/founder-welcome-poster.jpg"
                  alt="Tonye Taylor - Founder of Refeir"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%',
                    filter: 'contrast(1.05) brightness(0.95)'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Vignette border */}
                <div style={{
                  position: 'absolute', inset: 0,
                  boxShadow: 'inset 0 0 45px rgba(5, 18, 11, 0.9)',
                  pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute', bottom: 14, left: 16,
                  background: 'rgba(5, 18, 11, 0.85)', backdropFilter: 'blur(8px)',
                  border: `1px solid ${RF_LEAF_GREEN}55`,
                  padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                  color: RF_MINT_ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase'
                }}>
                  Founder & Chief Architect
                </div>
              </div>

              <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
                    Tonye Taylor
                  </h3>
                  <p style={{ fontSize: 13, color: RF_LEAF_GREEN, fontWeight: 500, marginBottom: 16 }}>
                    Founder & Protocol Architect • Refeir
                  </p>

                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: 20 }}>
                    Systems thinker, product engineer, and community organizer. Tonye's work centers on unlocking high-trust human networks, removing institutional friction, and empowering African youth to earn sovereign incomes through verifiable proof-of-work.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.45)' }}>Focus Area</span>
                      <span style={{ color: '#FFFFFF', fontWeight: 500 }}>Referral Protocols, Sovereign Work & Escrow</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.45)' }}>Origin</span>
                      <span style={{ color: '#FFFFFF', fontWeight: 500 }}>Nigeria • West Africa</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.45)' }}>Core Belief</span>
                      <span style={{ color: RF_MINT_ACCENT, fontWeight: 500 }}>"Merit must always be verifiable."</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How & Why Tonye Founded Refeir */}
            <div id="why-refeir" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18, padding: '26px 24px'
              }}>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Target size={18} color={RF_MINT_ACCENT} />
                  Why Tonye Founded Refeir
                </h4>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>
                  Witnessing firsthand how talented friends and colleagues struggled with unpaid client invoices, exploitative freelance fees, and the exhaustion of having to prove their credibility from scratch on every single project. Tonye realized that the core asset Africans possessed—<strong style={{ color: '#FFFFFF' }}>deep communal trust and mutual recommendation</strong>—was completely ignored by existing tech products. He founded Refeir to convert organic human recommendations into transparent, rewarding economic rails.
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18, padding: '26px 24px'
              }}>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Zap size={18} color={RF_GOLD_YELLOW} />
                  How Tonye Built Refeir
                </h4>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>
                  Tonye began by bootstrapping from first principles, rejecting venture terms that would have forced high take-rates on student freelancers. Instead, he conducted months of on-the-ground escrow trials across universities and co-working hubs, testing how referral payouts could be mathematically guaranteed. With that real-world feedback, he built the Refeir Pioneers architecture: multi-tiered divisions, proof-of-work submission consoles, and peer-verified progression.
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18, padding: '26px 24px'
              }}>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Award size={18} color={RF_LEAF_GREEN} />
                  The Philosophy of Merit
                </h4>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>
                  Tonye established the non-negotiable rule: <strong style={{ color: '#FFFFFF' }}>No automatic promotions.</strong> Every single title on Refeir—from Refeir Pioneer to Lead to Core Team—requires actual completed, verified missions. By eliminating superficial hype and rewarding delivered value, Refeir produces builders whose credentials are undisputed across the global market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Milestones & Chronological History */}
      <section id="history" style={{ padding: '100px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: RF_GOLD_YELLOW, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: 12
          }}>
            <Milestone size={14} />
            Chapter III • The Journey
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 500, lineHeight: 1.15,
            letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            The History & Key Milestones
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 640, margin: '14px auto 0', lineHeight: 1.6 }}>
            Every breakthrough begins with an unyielding conviction. Here is how Refeir evolved from an idea into a continent-wide movement.
          </p>
        </div>

        {/* Timeline Component */}
        <div style={{ position: 'relative', paddingLeft: 28, borderLeft: `2px solid ${RF_LEAF_GREEN}44` }}>
          {[
            {
              year: '2024 • Genesis & Problem Discovery',
              title: 'The Underground WhatsApp Discovery',
              badge: 'Origins',
              desc: 'Tonye Taylor discovers that over 80% of lucrative freelance deals across Nigerian tech clusters originated through direct personal referrals, yet referees never shared in the revenue. Field interviews with 200+ students and freelancers confirm widespread payment delays and client ghosting.'
            },
            {
              year: '2025 • Architecture & Alpha Escrow',
              title: 'Developing the Dual-Sided Referral Protocol',
              badge: 'System Design',
              desc: 'First proof-of-concept tests: Tonye and an early core squad manually escrow transactions and distribute peer referral commissions. Over $35,000 in student work cleared with zero non-payment incidents, proving that community accountability out-performs algorithmic scoring.'
            },
            {
              year: '2026 • The Pioneers Cohort & Operational Engine',
              title: 'Recruiting the Founding 100 Pioneers',
              badge: 'Current Era',
              desc: 'Formal launch of the Refeir Pioneers recruitment initiative. Six specialized divisions deployed: Engineering, Brand Strategy, Community Growth, Market Intelligence, Content, and Operations. Launch of the rigorous 5-level Contributor Ladder with automated proof-of-work tracking and Super Admin gatekeeping.'
            },
            {
              year: '2027 & Beyond • Sovereign Scale & Mainnet Expansion',
              title: 'Decentralized Work Reputation & Borderless Escrow',
              badge: 'The Frontier',
              desc: 'Refeir scales across Ghana, Kenya, Rwanda, South Africa, and Egypt. Launch of portable on-chain work reputation badges, decentralized dispute mediation, and zero-fee local currency & stablecoin off-ramps directly to mobile money.'
            }
          ].map((step, idx) => (
            <div key={idx} style={{ position: 'relative', marginBottom: 48 }}>
              {/* Timeline marker */}
              <div style={{
                position: 'absolute', left: -36, top: 4, width: 14, height: 14,
                borderRadius: '50%', background: idx === 2 ? RF_MINT_ACCENT : RF_LEAF_GREEN,
                boxShadow: idx === 2 ? `0 0 12px ${RF_MINT_ACCENT}` : `0 0 8px ${RF_LEAF_GREEN}`,
                border: '2px solid #05120B'
              }} />

              <div style={{
                background: idx === 2 ? `linear-gradient(135deg, ${RF_DEEP_GREEN}88 0%, #07180F 100%)` : 'rgba(255,255,255,0.025)',
                border: idx === 2 ? `1px solid ${RF_LEAF_GREEN}66` : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '24px 26px', transition: 'all 0.2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: idx === 2 ? RF_MINT_ACCENT : RF_GOLD_YELLOW, letterSpacing: '0.08em' }}>
                    {step.year}
                  </span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
                    background: idx === 2 ? 'rgba(24, 252, 92, 0.15)' : 'rgba(255,255,255,0.06)',
                    color: idx === 2 ? RF_MINT_ACCENT : 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase'
                  }}>
                    {step.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#FFFFFF', marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 4: The Future of Refeir */}
      <section id="future" style={{
        background: `linear-gradient(180deg, #05120B 0%, ${RF_DEEP_GREEN}55 50%, #07180F 100%)`,
        padding: '100px 24px',
        borderTop: '1px solid rgba(102, 187, 42, 0.15)',
        borderBottom: '1px solid rgba(102, 187, 42, 0.15)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: 12
            }}>
              <Globe size={14} />
              Chapter IV • The Horizon
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 500, lineHeight: 1.2,
              letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Where Refeir is Going:<br />
              The Sovereign Future
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 680, margin: '14px auto 0', lineHeight: 1.6 }}>
              We are not building another transactional marketplace. We are constructing the definitive economic protocol for African digital labor.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24
          }}>
            {[
              {
                icon: Shield,
                title: 'Immutable Work Reputation',
                desc: 'A permanent, un-cancellable proof-of-work profile. No corporate admin can confiscate your verified ratings, mission completions, or contributor milestones.'
              },
              {
                icon: Zap,
                title: 'Instant Local Settlement',
                desc: 'Frictionless payouts directly into bank accounts and mobile wallets across Nigeria (NGN), Kenya (M-Pesa), Ghana (MoMo), and pan-African stablecoins.'
              },
              {
                icon: Users,
                title: 'Autonomous Pioneer Guilds',
                desc: 'Pioneers advancing to Level 4 (Lead) and Level 5 (Core Team) gain direct governance rights over cohort grants, dispute resolutions, and regional admissions.'
              },
              {
                icon: Layers,
                title: 'Zero-Middleman Escrow',
                desc: 'Smart-contract milestone holding that keeps client funds secure and releases payment automatically upon milestone approvals.'
              },
              {
                icon: Briefcase,
                title: 'Global Client Inflow',
                desc: 'Positioning African Pioneers as the premier, verified workforce for international tech startups, agencies, and decentralized protocols.'
              },
              {
                icon: Award,
                title: 'Lifelong Referral Royalties',
                desc: 'When you bring talent into the Refeir ecosystem, you earn continuous percentages on their verified client milestones—turning networking into generational income.'
              }
            ].map((card, i) => {
              const IconComp = card.icon;
              return (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 18, padding: '26px 24px', transition: 'all 0.25s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${RF_LEAF_GREEN}66`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(102, 187, 42, 0.12)', border: `1px solid ${RF_LEAF_GREEN}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                  }}>
                    <IconComp size={20} color={RF_MINT_ACCENT} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 10 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chapter 5: Founder's Letter & Manifesto */}
      <section id="manifesto" style={{ padding: '100px 24px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{
          background: `linear-gradient(145deg, ${RF_DEEP_GREEN}99 0%, #07180F 100%)`,
          border: `1px solid ${RF_LEAF_GREEN}44`,
          borderRadius: 24, padding: 'clamp(28px, 5vw, 56px)', position: 'relative'
        }}>
          <Quote size={48} color={RF_MINT_ACCENT} style={{ opacity: 0.25, position: 'absolute', top: 32, right: 36 }} />

          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
            color: RF_GOLD_YELLOW, textTransform: 'uppercase', marginBottom: 20
          }}>
            A Personal Note From The Founder
          </div>

          <h3 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 500, lineHeight: 1.25,
            letterSpacing: '-0.02em', marginBottom: 24, fontFamily: 'Plus Jakarta Sans, sans-serif',
            color: '#FFFFFF'
          }}>
            "We refuse to let another generation of African talent beg for validation."
          </h3>

          <div style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ margin: 0 }}>
              Growing up and building within the African tech ecosystem, I have watched the most brilliant minds I know spend years applying for distant jobs, competing against 5,000 other candidates on predatory bidding sites, or doing uncredited freelance work for clients who vanish when the invoice arrives.
            </p>
            <p style={{ margin: 0 }}>
              The global internet promised a flat world, but the systems built on top of it erected walls. They penalized you because of your passport, demanded 20% fees on your sweat, and gave you zero rewards for recommending your peers.
            </p>
            <p style={{ margin: 0 }}>
              Refeir is our answer. We are building this for the developer who writes clean code in a power outage, for the designer who crafts world-class brand identities on a hand-me-down laptop, for the student organizer who can mobilize 500 people with a single message, and for the trusted friend whose word is gold.
            </p>
            <p style={{ margin: 0 }}>
              To every Pioneer joining our ranks: Refeir is not just another gig platform. It is an economic sanctuary where your work is seen, your network is valued, and your progress is earned through unassailable merit.
            </p>
          </div>

          <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Tonye Taylor
              </div>
              <div style={{ fontSize: 12.5, color: RF_LEAF_GREEN, fontWeight: 500 }}>
                Founder & Protocol Architect • Refeir
              </div>
            </div>

            <button
              onClick={() => onNavigate('/#apply')}
              style={{
                background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                padding: '12px 24px', borderRadius: 100, fontSize: 13.5, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s', boxShadow: `0 4px 16px ${RF_LEAF_GREEN}44`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = RF_MINT_ACCENT;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = RF_LEAF_GREEN;
                e.currentTarget.style.transform = '';
              }}
            >
              Join the Founding 100 Pioneers <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Final Action CTA Banner */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DARK_GREEN} 0%, #030a06 100%)`,
        padding: '70px 24px', borderTop: '1px solid rgba(102, 187, 42, 0.15)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h3 style={{
            fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 500, color: '#FFFFFF',
            marginBottom: 16, fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            Write the next chapter with us.
          </h3>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 28 }}>
            Whether you are an engineer, community builder, writer, or strategist—there is a squad waiting for your skills in the Founding 100 Pioneers.
          </p>
          <div className="rp-responsive-btn-group" style={{ maxWidth: 640, margin: '0 auto' }}>
            <button
              onClick={() => onNavigate('/#apply')}
              style={{
                background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                padding: '13px 28px', borderRadius: 100, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8
              }}
              onMouseEnter={e => (e.currentTarget.style.background = RF_MINT_ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.background = RF_LEAF_GREEN)}
            >
              Apply as a Pioneer <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('/rewards')}
              style={{
                background: 'rgba(255,255,255,0.05)', color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)', padding: '13px 24px',
                borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
            >
              View Contributor Ladder
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
