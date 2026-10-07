import React from 'react';
import {
  ArrowRight, CheckCircle2, Users, Award, Shield,
  Layers, Clock, AlertCircle, HelpCircle
} from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW
} from '../constants/brand';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate, onOpenStatus }) => {
  const steps = [
    {
      number: '01',
      title: 'Submit Pioneer Application',
      timeline: '5 – 8 minutes',
      desc: 'Complete the 4-step admissions questionnaire. Tell us about your primary skills, links to your work or portfolio, your chosen squad, and your availability.',
      requirements: ['Valid contact information (email & WhatsApp)', 'Primary division selection', 'Portfolio, GitHub, or case study links']
    },
    {
      number: '02',
      title: 'Admissions Committee Review',
      timeline: '48 – 72 hours',
      desc: 'The Refeir admissions team reviews submissions on a rolling weekly basis. Candidates are evaluated on genuine domain capability, enthusiasm, and collaborative alignment.',
      requirements: ['Quality of past work or clear enthusiasm', 'Thoughtful answers regarding Refeir’s vision', 'Alignment with current squad vacancies']
    },
    {
      number: '03',
      title: 'Cohort Acceptance & Onboarding',
      timeline: 'Immediate upon approval',
      desc: 'Approved applicants receive their unique Pioneer ID (e.g., RP-042) and private invitation link to join the Refeir Pioneers WhatsApp Community and Discord server.',
      requirements: ['Signing community code of conduct', 'Joining the official WhatsApp & Discord channels', 'Introductions within your division squad']
    },
    {
      number: '04',
      title: 'Squad Sprints & Daily Bounty Missions',
      timeline: 'Daily & weekly sprints',
      desc: 'Work directly alongside Refeir founders and architects. Tackle live squad missions, claim Airtime, Data, or Cash bounties, submit verified proof of work, and level up your Founding Pioneer Certificate.',
      requirements: ['Executing daily squad deliverables', 'Reporting proof of work via the submission desk', 'Active collaboration in squad channels']
    },
    {
      number: '05',
      title: 'Mainnet Launch & Lifelong Benefits',
      timeline: 'Public Platform Release',
      desc: 'As Refeir opens to millions of freelancers across Africa, Founding Pioneers receive elevated referral commission tiers, verified builder badges, and early platform awards.',
      requirements: ['Maintained active standing in the cohort', 'Contribution badge verification', 'Priority access to first client work packages']
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: RF_DEEP_GREEN, color: '#1E293B' }}>
      {/* Header Banner */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: '130px 24px 70px', position: 'relative', overflow: 'hidden', color: '#FFFFFF', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_LEAF_GREEN}33`,
            padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 20
          }}>
            Admissions & Lifecycle
          </span>

          <h1 style={{
            fontSize: 'clamp(34px, 5vw, 64px)', fontWeight: 500, lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: 20, fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            How the Pioneer Program<br />
            <span style={{
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_LEAF_GREEN} 60%, ${RF_GOLD_YELLOW} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              works from start to launch.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.7, maxWidth: 700, margin: '0 auto 32px'
          }}>
            From application to mainnet privileges, here is everything you need to know about joining the Founding 100 and co-building Africa’s referral freelance protocol.
          </p>

          <div className="rp-responsive-btn-group" style={{ maxWidth: 640, margin: '0 auto' }}>
            <button
              onClick={() => onNavigate('/#apply')}
              style={{
                background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                padding: '13px 30px', borderRadius: 100, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s', boxShadow: `0 4px 18px ${RF_LEAF_GREEN}35`
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
              Start Application <ArrowRight size={15} />
            </button>

            <button
              onClick={onOpenStatus}
              style={{
                background: 'rgba(255,255,255,0.04)', color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)', padding: '13px 26px',
                borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 7
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
              Check Existing Status
            </button>
          </div>
        </div>
      </section>

      {/* Step-by-Step Flow */}
      <section style={{ padding: '90px 24px', background: '#F8FAF9' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{
                background: '#FFFFFF', borderRadius: 20, padding: '36px 32px',
                border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 28, alignItems: 'start'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 22, fontWeight: 900, color: RF_LEAF_GREEN, fontFamily: 'monospace'
                    }}>
                      {step.number}
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: '#64748B', background: '#F1F5F9',
                      padding: '4px 10px', borderRadius: 100
                    }}>
                      {step.timeline}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: 22, fontWeight: 500, color: RF_DEEP_GREEN,
                    fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12
                  }}>
                    {step.title}
                  </h3>

                  <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>

                <div style={{
                  background: '#F8FAF9', borderRadius: 14, padding: '20px 22px', border: '1px solid #E2E8F0'
                }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: RF_DEEP_GREEN, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    Key Checkpoints
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {step.requirements.map((req, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <CheckCircle2 size={15} color={RF_LEAF_GREEN} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions Evaluation Rubric */}
      <section style={{ padding: '90px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: RF_LEAF_GREEN, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Selection Standards
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500, color: RF_DEEP_GREEN,
              fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: 8
            }}>
              What our committee looks for
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                title: 'Authentic Domain Passion',
                desc: 'You genuinely care about advancing African tech, creative output, or freelance independence. You do not view this as just another passive email list.'
              },
              {
                title: 'Evidence of Execution',
                desc: 'Whether a polished GitHub repository, a Figma portfolio, an active community track record, or a clear write-up, you have shown the ability to finish things.'
              },
              {
                title: 'High-Integrity Collaboration',
                desc: 'Pioneers interact constructively, respect confidentiality regarding unreleased features, and champion peers across divisions.'
              }
            ].map((rubric, idx) => (
              <div key={idx} style={{
                background: '#F8FAF9', borderRadius: 16, padding: '30px 26px', border: '1px solid #E2E8F0'
              }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: RF_DEEP_GREEN, marginBottom: 10 }}>
                  {rubric.title}
                </h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                  {rubric.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: '80px 24px', color: '#FFFFFF', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 3.6vw, 42px)', fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif',
            marginBottom: 16, whiteSpace: 'nowrap'
          }}>
            Applications are currently open
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 30 }}>
            Seats in the Founding 100 are filled as exceptional applications arrive.<br />
            Do not wait for public launch to claim your builder seat.
          </p>
          <button
            className="rp-btn-responsive"
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
            Apply to Become a Pioneer <ArrowRight size={14} style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
          </button>
        </div>
      </section>
    </div>
  );
};
