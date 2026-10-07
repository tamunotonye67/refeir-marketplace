import React from 'react';
import {
  ArrowRight, Shield, Users, TrendingUp, Zap, CheckCircle2,
  Globe2, Award, Layers, Lock
} from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW
} from '../constants/brand';

interface AboutPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ minHeight: '100vh', background: RF_DEEP_GREEN, color: '#1E293B' }}>
      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: '130px 24px 80px', position: 'relative', overflow: 'hidden', color: '#FFFFFF'
      }}>
        {/* Subtle Ambient Glow */}
        <div style={{
          position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle, ${RF_LEAF_GREEN}18 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_LEAF_GREEN}33`,
            padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 20
          }}>
            Our Mission & Architecture
          </span>

          <h1 style={{
            fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 500, lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: 24, fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            Building Africa's first<br />
            <span style={{
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_LEAF_GREEN} 60%, ${RF_GOLD_YELLOW} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              referral-powered freelance economy.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 19px)', color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.7, maxWidth: 760, margin: '0 auto 36px'
          }}>
            Refeir replaces cold algorithmic job boards with high-trust human networks. We empower professionals to connect opportunities, vouch for excellence, and share directly in the economic value they generate.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('/#apply')}
              style={{
                background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                padding: '13px 30px', borderRadius: 100, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: `0 4px 18px ${RF_LEAF_GREEN}35`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.background = RF_MINT_ACCENT;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.background = RF_LEAF_GREEN;
              }}
            >
              Become a Pioneer <ArrowRight size={15} />
            </button>

            <button
              onClick={() => onNavigate('/story')}
              style={{
                background: 'rgba(255,255,255,0.04)', color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)', padding: '13px 26px',
                borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              The Refeir Story & Founder
            </button>

            <button
              onClick={() => onNavigate('/divisions')}
              style={{
                background: 'rgba(255,255,255,0.04)', color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)', padding: '13px 26px',
                borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              Explore Pioneer Divisions
            </button>
          </div>
        </div>
      </section>

      {/* The Core Challenge Section */}
      <section style={{ padding: '90px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: RF_LEAF_GREEN, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Why Traditional Freelance Platforms Fail Africa
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, color: RF_DEEP_GREEN,
              fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: 10, letterSpacing: '-0.02em'
            }}>
              Talent is abundant. Trust is scarce.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {[
              {
                icon: <Lock size={22} color={RF_LEAF_GREEN} />,
                title: 'Cold Bidding Wars',
                desc: 'African talent competes on international platforms that favor legacy profiles, race-to-the-bottom pricing, and predatory 20%+ fee deductions.'
              },
              {
                icon: <Shield size={22} color={RF_LEAF_GREEN} />,
                title: 'The Verification Gap',
                desc: 'Hiring managers hesitate to work with remote talent without verified references. Resumes and portfolios are easily spoofed; personal reputation is not.'
              },
              {
                icon: <TrendingUp size={22} color={RF_LEAF_GREEN} />,
                title: 'Unrewarded Referrals',
                desc: 'Every week, thousands of opportunities are passed along through WhatsApp groups and private messages with zero tracking, escrow protection, or financial upside.'
              }
            ].map((col, idx) => (
              <div key={idx} style={{
                background: '#F8FAF9', borderRadius: 16, padding: '32px 28px',
                border: '1px solid #E2E8F0', transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: `${RF_LEAF_GREEN}14`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18
                }}>
                  {col.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: RF_DEEP_GREEN, marginBottom: 10 }}>
                  {col.title}
                </h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                  {col.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Refeir Architecture Section */}
      <section style={{ padding: '90px 24px', background: '#F4F7F5' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 50, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: RF_LEAF_GREEN, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                The Refeir Protocol
              </span>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 500, color: RF_DEEP_GREEN,
                fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: 10, letterSpacing: '-0.02em', lineHeight: 1.2
              }}>
                A network founded on economic alignment.
              </h2>
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, marginTop: 16 }}>
                Refeir embeds referral economics directly into the freelance contract. When a Pioneer or community member connects an employer with a vetted freelancer:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
                {[
                  {
                    title: 'Transparent Milestone Escrow',
                    desc: 'Clients fund milestones securely in local African currencies or stablecoins before work commences.'
                  },
                  {
                    title: 'Automated Referral Bounty',
                    desc: 'Upon milestone approval, referrers receive an instant, smart protocol percentage without deducting from the freelancer.'
                  },
                  {
                    title: 'Verifiable Reputation Scores',
                    desc: 'Every successful delivery builds on-chain and verified social credit for both the provider and the referee.'
                  }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', background: `${RF_LEAF_GREEN}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2
                    }}>
                      <CheckCircle2 size={15} color={RF_LEAF_GREEN} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: RF_DEEP_GREEN, margin: 0 }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.6, margin: '4px 0 0' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Architecture Graphic */}
            <div style={{
              background: `linear-gradient(135deg, ${RF_DARK_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
              borderRadius: 24, padding: '36px 30px', color: '#FFFFFF',
              boxShadow: '0 20px 50px rgba(0,0,0,0.18)', border: '1px solid rgba(102, 187, 42, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <Layers size={18} color={RF_MINT_ACCENT} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: RF_MINT_ACCENT, textTransform: 'uppercase' }}>
                  Value Flow Simulation
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>1. Project Funded</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>Client deposits $1,500 in Escrow</div>
                </div>

                <div style={{ textAlign: 'center', color: RF_LEAF_GREEN, fontSize: 18 }}>↓</div>

                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>2. Milestone Completed</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>Talent earns $1,350 (90%)</div>
                </div>

                <div style={{ textAlign: 'center', color: RF_MINT_ACCENT, fontSize: 18 }}>↓</div>

                <div style={{ background: `${RF_LEAF_GREEN}14`, borderRadius: 12, padding: '16px 18px', border: `1px solid ${RF_LEAF_GREEN}44` }}>
                  <div style={{ fontSize: 11, color: RF_MINT_ACCENT, fontWeight: 700, textTransform: 'uppercase' }}>3. Referral Protocol Distributed</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 4 }}>Pioneer Referrer receives $100 instant reward</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Roadmap */}
      <section style={{ padding: '90px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: RF_LEAF_GREEN, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Strategic Milestones
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, color: RF_DEEP_GREEN,
              fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: 10, letterSpacing: '-0.02em'
            }}>
              The journey to platform launch
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              {
                phase: 'PHASE 1 (ACTIVE)',
                title: 'Pioneer Recruitment',
                period: 'Q1 - Q2 2026',
                details: 'Selection of the Founding 100 Pioneers across 6 Squads. Internal community building and sprint co-creation.'
              },
              {
                phase: 'PHASE 2',
                title: 'Private Escrow Alpha',
                period: 'Q3 2026',
                details: 'Closed pilot with selected African employers and pioneers testing instant payouts and referral mechanics.'
              },
              {
                phase: 'PHASE 3',
                title: 'Public Beta Release',
                period: 'Q4 2026',
                details: 'Full portal launch across Nigeria, Kenya, Ghana, Rwanda, and South Africa with multi-currency rails.'
              },
              {
                phase: 'PHASE 4',
                title: 'Decentralized Protocol',
                period: '2027 & Beyond',
                details: 'Expansion to global markets, developer API access, and community-directed liquidity governance.'
              }
            ].map((p, idx) => (
              <div key={idx} style={{
                background: '#F8FAF9', borderRadius: 16, padding: '26px 22px', border: '1px solid #E2E8F0',
                position: 'relative'
              }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: RF_LEAF_GREEN, letterSpacing: '0.1em' }}>
                  {p.phase}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: RF_DEEP_GREEN, margin: '8px 0 4px' }}>
                  {p.title}
                </h3>
                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>{p.period}</div>
                <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  {p.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: '80px 24px', textAlign: 'center', color: '#FFFFFF'
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif',
            marginBottom: 16
          }}>
            Ready to shape this future?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 30 }}>
            Join the Founding 100 Pioneers and become an essential architect of Africa's next economic frontier.
          </p>
          <button
            onClick={() => onNavigate('/#apply')}
            style={{
              background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
              padding: '13px 32px', borderRadius: 100, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 4px 18px ${RF_LEAF_GREEN}35`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.background = RF_MINT_ACCENT;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.background = RF_LEAF_GREEN;
            }}
          >
            Apply for Pioneer Cohort <ArrowRight size={14} style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
          </button>
        </div>
      </section>
    </div>
  );
};
