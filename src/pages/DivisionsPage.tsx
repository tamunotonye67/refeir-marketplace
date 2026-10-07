import React, { useState, useEffect } from 'react';
import {
  Code2, Palette, TrendingUp, Briefcase, Users, FlaskConical,
  ArrowRight, CheckCircle2, Award, Clock, Target, Layers
} from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW,
  RF_ORANGE
} from '../constants/brand';

interface DivisionsPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

interface DivisionDetail {
  id: string;
  badge: string;
  name: string;
  color: string;
  accent: string;
  image: string;
  lead: string;
  description: string;
  skills: string[];
  responsibilities: string[];
  deliverables: string[];
  weeklyHours: string;
}

const DIVISIONS_CATALOG: DivisionDetail[] = [
  {
    id: 'TECH_PRODUCT',
    badge: 'DIV-01',
    name: 'Tech & Product Squad',
    color: RF_MINT_ACCENT,
    accent: RF_LEAF_GREEN,
    image: '/images/skills/tech_product.png',
    lead: 'Frontend, Mobile & Protocol Architecture',
    description: 'The builders responsible for engineering Refeir’s client applications, real-time escrow rails, referral attribution engine, and multi-currency payment infrastructure.',
    skills: ['React / TypeScript', 'React Native / Flutter', 'Node.js / Express', 'PostgreSQL / Supabase', 'Smart Contracts / Escrow', 'REST & GraphQL APIs'],
    responsibilities: [
      'Collaborate on client-facing UI engineering and cross-platform mobile apps.',
      'Review and optimize referral tracking algorithms and webhook delivery.',
      'Test multi-currency and stablecoin checkout integrations across Africa.',
      'Participate in weekly sprint planning and technical architecture syncs.'
    ],
    deliverables: [
      'Pioneer Admissions Portal & Referral Dashboard',
      'Mobile Client Prototype for iOS and Android',
      'Real-Time Webhook Engine for Instant Payout Notifications'
    ],
    weeklyHours: '4 – 8 hours / week'
  },
  {
    id: 'CREATIVE',
    badge: 'DIV-02',
    name: 'Creative & Design Squad',
    color: '#FF6B6B',
    accent: '#FA5252',
    image: '/images/skills/creative.png',
    lead: 'Brand Identity, UI/UX & Motion Systems',
    description: 'Visual storytellers establishing Refeir’s design system, high-fidelity application screens, brand aesthetics, motion animations, and educational media assets.',
    skills: ['Figma / Design Systems', 'UI/UX Interaction Design', 'Motion Graphics / Lottie', 'Brand Guidelines', 'Typography & Visual Layout', 'Design Prototyping'],
    responsibilities: [
      'Refine Refeir’s web and mobile component library (design tokens, states, accessibility).',
      'Design conversion-optimized landing flows for freelancers and enterprise clients.',
      'Craft animated hero assets, social visual systems, and brand illustrations.',
      'Conduct design critiques and collaborate closely with product engineers.'
    ],
    deliverables: [
      'Refeir 1.0 Complete Design System (Figma)',
      'Freelancer Onboarding & Profile Verification Flows',
      'Animated Social Launch Toolkit & Visual Teasers'
    ],
    weeklyHours: '3 – 6 hours / week'
  },
  {
    id: 'GROWTH',
    badge: 'DIV-03',
    name: 'Growth & Marketing Squad',
    color: RF_GOLD_YELLOW,
    accent: '#E5A510',
    image: '/images/skills/growth.png',
    lead: 'Acquisition Loops, Viral Distribution & Narrative',
    description: 'The strategists testing referral loops, growth funnels, viral social campaigns, influencer partnerships, and educational content across high-density African tech hubs.',
    skills: ['Growth Marketing & Loops', 'SEO & Content Strategy', 'Social Campaign Execution', 'Viral Referral Mechanics', 'Data Analytics & Cohorts', 'Copywriting & PR'],
    responsibilities: [
      'Design and iterate on Pioneer referral incentives and waitlist viral mechanics.',
      'Create high-engagement educational content on Africa’s freelance economy.',
      'Establish media outreach and distribution partnerships with tech publications.',
      'Analyze funnel drop-offs and suggest conversion rate optimization tests.'
    ],
    deliverables: [
      'Viral Referral Growth Engine Playbook',
      'Pan-African University & Tech Hub Launch Strategy',
      'Bi-Weekly Community Newsletter & Educational Series'
    ],
    weeklyHours: '3 – 6 hours / week'
  },
  {
    id: 'BUSINESS',
    badge: 'DIV-04',
    name: 'Business & Strategy Squad',
    color: '#4DABF7',
    accent: '#339AF0',
    image: '/images/skills/business.png',
    lead: 'Commercial Partnerships, Enterprise Client Pipelines & Economics',
    description: 'The minds structuring commercial partnerships, onboarding enterprise hiring managers, modeling token/platform economics, and ensuring cross-border compliance.',
    skills: ['Business Development', 'Enterprise Client Strategy', 'Market Opportunity Analysis', 'Economic & Fee Modeling', 'Fintech Partnership Structuring', 'Legal & Regulatory'],
    responsibilities: [
      'Identify and contact potential employer organizations seeking vetted African talent.',
      'Model platform take-rates, referral distribution margins, and escrow yield dynamics.',
      'Establish relationships with regional payment gateways and talent agencies.',
      'Draft partnership decks and commercial agreements for early pilot companies.'
    ],
    deliverables: [
      'Enterprise Pilot Customer Onboarding Pipeline',
      'Comparative Fee Structure & Contributor Economics Model',
      'Regional Partnership Strategy for West & East Africa'
    ],
    weeklyHours: '3 – 6 hours / week'
  },
  {
    id: 'COMMUNITY',
    badge: 'DIV-05',
    name: 'Community & Culture Squad',
    color: '#69DB7C',
    accent: '#51CF66',
    image: '/images/skills/community.png',
    lead: 'Ambassador Programs, Member Engagement & Regional Chapters',
    description: 'The heartbeat of Refeir, facilitating daily interactions in our private WhatsApp community, hosting AMA sessions, organizing city meetups, and curating pioneer culture.',
    skills: ['Community Leadership', 'WhatsApp & Discord Management', 'Event Planning & Hosting', 'Member Mentorship', 'Conflict Resolution', 'Bilingual Communication'],
    responsibilities: [
      'Foster daily engagement, knowledge sharing, and peer reviews inside the Pioneer community.',
      'Host bi-weekly virtual town halls, spotlight sessions, and AMA workshops.',
      'Coordinate campus and tech community ambassador programs across key cities.',
      'Collect continuous qualitative feedback from cohort members.'
    ],
    deliverables: [
      'Pioneer Community Onboarding Handbook & Code of Conduct',
      'Bi-Weekly Town Hall Program & Speaker Schedule',
      'City Chapter Blueprint for Lagos, Nairobi, Kigali, Accra'
    ],
    weeklyHours: '4 – 7 hours / week'
  },
  {
    id: 'RESEARCH_TESTING',
    badge: 'DIV-06',
    name: 'Research & Testing Squad',
    color: '#DA77F2',
    accent: '#CC5DE8',
    image: '/images/skills/research_testing.png',
    lead: 'User Research, Usability Testing & Quality Assurance',
    description: 'Rigorous evaluators testing platform features, interviewing freelancers and employers, mapping usability friction points, and verifying functional stability.',
    skills: ['User Interview Methodologies', 'Usability Test Scripting', 'QA & Bug Reporting', 'Competitive Benchmarking', 'Survey Design', 'Synthesis & Insight Reporting'],
    responsibilities: [
      'Conduct moderated usability sessions on Refeir prototype releases.',
      'Test edge cases in onboarding, wallet connection, milestone creation, and disputes.',
      'Synthesize interview findings into prioritized actionable product recommendations.',
      'Maintain the Pioneer QA backlog and verify fixes with the engineering team.'
    ],
    deliverables: [
      'Comprehensive Usability Audit of Application & Status Flow',
      'Freelancer Pricing & Payment Experience Research Paper',
      'Pre-Launch Regression Testing Matrix & Bug Triage Log'
    ],
    weeklyHours: '3 – 6 hours / week'
  }
];

export const DivisionsPage: React.FC<DivisionsPageProps> = ({ onNavigate }) => {
  const [selectedId, setSelectedId] = useState<string>('TECH_PRODUCT');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeDivision = DIVISIONS_CATALOG.find(d => d.id === selectedId) || DIVISIONS_CATALOG[0];

  return (
    <div style={{ minHeight: '100vh', background: RF_DEEP_GREEN, color: '#1E293B' }}>
      {/* Header Banner */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: isMobile ? '80px 16px 36px' : '130px 24px 70px',
        position: 'relative', overflow: 'hidden', color: '#FFFFFF', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 940, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block', fontSize: isMobile ? 10.5 : 11, fontWeight: 700, letterSpacing: '0.14em',
            color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_LEAF_GREEN}33`,
            padding: isMobile ? '5px 14px' : '6px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: isMobile ? 14 : 20
          }}>
            Pioneer Divisions & Squads
          </span>

          <h1 style={{
            fontSize: isMobile ? '28px' : 'clamp(34px, 5vw, 64px)', fontWeight: 600, lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: isMobile ? 14 : 20, fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            Six squads building the<br />
            <span style={{
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(135deg, ${RF_MINT_ACCENT} 0%, ${RF_LEAF_GREEN} 60%, ${RF_GOLD_YELLOW} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              foundations of Refeir.
            </span>
          </h1>

          <p style={{
            fontSize: isMobile ? 14 : 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6, maxWidth: 680, margin: isMobile ? '0 auto 24px' : '0 auto 32px'
          }}>
            Every Refeir Pioneer is assigned to a specialized division based on their superpowers. Discover where your expertise can make the deepest impact.
          </p>

          {/* Quick Division Selector Pills - Smooth horizontal scroll on mobile, flex wrap on desktop */}
          <div style={{
            display: 'flex',
            gap: isMobile ? 8 : 10,
            justifyContent: isMobile ? 'flex-start' : 'center',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            overflowX: isMobile ? 'auto' : 'visible',
            padding: isMobile ? '4px 4px 10px' : '0',
            maxWidth: 840,
            margin: '0 auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {DIVISIONS_CATALOG.map(div => {
              const isSelected = div.id === selectedId;
              return (
                <button
                  key={div.id}
                  onClick={() => setSelectedId(div.id)}
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.04)',
                    color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${isSelected ? div.color : 'rgba(255,255,255,0.14)'}`,
                    borderRadius: 100,
                    padding: isMobile ? '7px 14px' : '9px 18px',
                    fontSize: isMobile ? 12 : 13,
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? `0 0 16px ${div.color}33` : 'none'
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: div.color, flexShrink: 0 }} />
                  {div.name.replace(' Squad', '')}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Selected Division Deep Dive */}
      <section style={{ padding: isMobile ? '24px 12px 40px' : '80px 24px', background: '#F8FAF9' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{
            background: '#FFFFFF', borderRadius: isMobile ? 18 : 24, border: '1px solid #E2E8F0',
            overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.06)'
          }}>
            {/* Division Banner Top */}
            <div style={{
              background: `linear-gradient(135deg, ${RF_DARK_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
              padding: isMobile ? '20px 16px' : '36px 36px', color: '#FFFFFF',
              display: 'flex', flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center',
              gap: isMobile ? 16 : 20
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, color: activeDivision.color, fontFamily: 'monospace',
                    background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 6
                  }}>
                    {activeDivision.badge}
                  </span>
                  <span style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.65)' }}>{activeDivision.lead}</span>
                </div>
                <h2 style={{
                  fontSize: isMobile ? 22 : 'clamp(26px, 3.5vw, 38px)', fontWeight: 600,
                  fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0, lineHeight: 1.2
                }}>
                  {activeDivision.name}
                </h2>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isMobile ? 'space-between' : 'flex-end',
                gap: 10,
                width: isMobile ? '100%' : 'auto',
                paddingTop: isMobile ? 8 : 0,
                borderTop: isMobile ? '1px solid rgba(255,255,255,0.08)' : 'none'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
                  padding: isMobile ? '6px 12px' : '8px 16px', borderRadius: 100, fontSize: isMobile ? 11.5 : 13,
                  color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <Clock size={12} color={RF_MINT_ACCENT} />
                  <span>{activeDivision.weeklyHours}</span>
                </div>

                <button
                  onClick={() => onNavigate('/#apply')}
                  style={{
                    background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                    padding: isMobile ? '8px 18px' : '11px 22px', borderRadius: 100,
                    fontSize: isMobile ? 12.5 : 13.5, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.2s', boxShadow: `0 4px 14px ${RF_LEAF_GREEN}44`,
                    whiteSpace: 'nowrap'
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
                  Join Squad <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Division Body Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: isMobile ? 24 : 36,
              padding: isMobile ? '22px 16px' : '40px 36px',
              alignItems: 'start'
            }}>
              {/* Left Column: Description & Responsibilities */}
              <div>
                <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: RF_DEEP_GREEN, marginBottom: isMobile ? 8 : 12 }}>
                  Squad Mission
                </h3>
                <p style={{ fontSize: isMobile ? 13.5 : 15, color: '#475569', lineHeight: 1.7, marginBottom: isMobile ? 20 : 28 }}>
                  {activeDivision.description}
                </p>

                <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: RF_DEEP_GREEN, marginBottom: isMobile ? 10 : 14 }}>
                  Core Responsibilities
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 12, marginBottom: isMobile ? 22 : 32 }}>
                  {activeDivision.responsibilities.map((resp, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <CheckCircle2 size={15} color={activeDivision.accent} style={{ marginTop: 3, flexShrink: 0 }} />
                      <span style={{ fontSize: isMobile ? 13 : 14, color: '#334155', lineHeight: 1.55 }}>{resp}</span>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: RF_DEEP_GREEN, marginBottom: isMobile ? 10 : 14 }}>
                  Key Skills & Superpowers
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {activeDivision.skills.map((skill, i) => (
                    <span key={i} style={{
                      background: '#F1F5F9', color: '#1E293B',
                      padding: isMobile ? '5px 11px' : '6px 14px',
                      borderRadius: 100, fontSize: isMobile ? 12 : 13, fontWeight: 600
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual Persona & Key Deliverables */}
              <div style={{
                background: '#F8FAF9', borderRadius: isMobile ? 16 : 20,
                padding: isMobile ? '18px 14px' : '30px 26px',
                border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: isMobile ? 18 : 24
              }}>
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={activeDivision.image}
                    alt={activeDivision.name}
                    style={{
                      height: isMobile ? 160 : 220, width: 'auto', objectFit: 'contain', margin: '0 auto',
                      filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.12))'
                    }}
                  />
                </div>

                <div>
                  <h4 style={{
                    fontSize: isMobile ? 14 : 15, fontWeight: 700, color: RF_DEEP_GREEN,
                    marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7
                  }}>
                    <Target size={16} color={RF_LEAF_GREEN} />
                    Current Cohort Deliverables
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {activeDivision.deliverables.map((item, i) => (
                      <div key={i} style={{
                        background: '#FFFFFF', padding: isMobile ? '10px 12px' : '12px 16px',
                        borderRadius: 10, border: '1px solid #E2E8F0',
                        fontSize: isMobile ? 12.5 : 13.5, color: '#334155', fontWeight: 500
                      }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All 6 Divisions Compact Overview */}
      <section style={{ padding: isMobile ? '44px 14px' : '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: RF_LEAF_GREEN, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Full Squad Directory
            </span>
            <h2 style={{
              fontSize: isMobile ? 24 : 'clamp(28px, 3.5vw, 42px)', fontWeight: 600, color: RF_DEEP_GREEN,
              fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: 6
            }}>
              Find where you fit best
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: isMobile ? 14 : 24
          }}>
            {DIVISIONS_CATALOG.map(item => (
              <div
                key={item.id}
                onClick={() => { setSelectedId(item.id); window.scrollTo({ top: isMobile ? 280 : 400, behavior: 'smooth' }); }}
                style={{
                  background: item.id === selectedId ? `${RF_LEAF_GREEN}08` : '#F8FAF9',
                  border: `1.5px solid ${item.id === selectedId ? RF_LEAF_GREEN : '#E2E8F0'}`,
                  borderRadius: isMobile ? 14 : 18,
                  padding: isMobile ? '18px 16px' : '28px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>
                    {item.badge}
                  </span>
                  <span style={{ fontSize: 11.5, color: '#94A3B8' }}>{item.weeklyHours}</span>
                </div>

                <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: RF_DEEP_GREEN, marginBottom: 6 }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: isMobile ? 13 : 13.5, color: '#64748B', lineHeight: 1.55, marginBottom: 14 }}>
                  {item.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                  borderTop: '1px solid #E2E8F0',
                  marginTop: 4
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, color: RF_LEAF_GREEN }}>
                    {item.id === selectedId ? 'Selected Squad' : 'View Details'} <ArrowRight size={12} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('/#apply');
                    }}
                    style={{
                      background: item.id === selectedId ? RF_LEAF_GREEN : 'rgba(24, 252, 92, 0.08)',
                      color: RF_DEEP_GREEN,
                      border: `1px solid ${RF_LEAF_GREEN}44`,
                      borderRadius: 100,
                      padding: '4px 12px',
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pioneer Perks Section */}
      <section style={{
        background: `linear-gradient(135deg, ${RF_DEEP_GREEN} 0%, ${RF_FOREST_DARK} 100%)`,
        padding: isMobile ? '48px 14px' : '80px 24px', color: '#FFFFFF', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? 24 : 'clamp(28px, 4vw, 44px)', fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif',
            marginBottom: 12
          }}>
            What every Pioneer receives
          </h2>
          <p style={{
            fontSize: isMobile ? 13.5 : 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6,
            maxWidth: 640, margin: isMobile ? '0 auto 24px' : '0 auto 40px'
          }}>
            Pioneer membership is an exclusive community for builders who want priority access and economic equity in the Refeir ecosystem.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: isMobile ? 10 : 20,
            textAlign: 'left',
            marginBottom: isMobile ? 28 : 40
          }}>
            {[
              { title: 'Founding 100 ID', desc: 'Permanent on-chain badge signifying your inaugural builder status.' },
              { title: 'Referral Multiplier', desc: 'Guaranteed higher protocol commission tier upon public platform release.' },
              { title: 'Direct Access', desc: 'Weekly closed sessions with the founding executives and architects.' },
              { title: 'Early Equity Pool', desc: 'Priority consideration for future contributor grants and equity distributions.' },
              { title: 'Verified Credentials', desc: 'Official cryptographic certificate of contribution and executive recommendation letters.' },
              { title: 'Priority Alpha Bounties', desc: 'First-look access to paid client pilot contracts, feature bounties, and platform launches.' }
            ].map((perk, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: isMobile ? 12 : 14,
                padding: isMobile ? '16px 14px' : '22px 20px', border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <h4 style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: RF_MINT_ACCENT, marginBottom: 4 }}>{perk.title}</h4>
                <p style={{ fontSize: isMobile ? 12.5 : 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, margin: 0 }}>{perk.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('/#apply')}
            style={{
              background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
              padding: isMobile ? '11px 26px' : '13px 32px', borderRadius: 100,
              fontSize: isMobile ? 13 : 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 4px 18px ${RF_LEAF_GREEN}35`,
              display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center'
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
            Apply Now <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};
