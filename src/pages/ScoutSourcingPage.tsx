import React, { useState } from 'react';
import {
  ShieldCheck,
  Compass,
  Users,
  Check,
  Clock,
  ArrowRight,
  Plus,
  Zap,
  DollarSign,
  CheckCircle2,
  Wallet,
  Star,
  Briefcase,
  Layers,
  Award,
  TrendingUp,
  Search
} from 'lucide-react';
import '../styles/scout-sourcing.css';

interface ScoutSourcingPageProps {
  onNavigate: (path: string) => void;
}

interface CandidateMatch {
  name: string;
  role: string;
  experience: string;
  rate: string;
  avatar: string;
  verifiedTag: string;
}

interface ScoutProfileData {
  id: string;
  name: string;
  country: string;
  flag: string;
  tier: string;
  roleTitle: string;
  rating: number;
  hires: number;
  avatar: string;
  turnaround: string;
  quote: string;
  specialties: string[];
  recentPlacements: { title: string; detail: string }[];
  candidates: CandidateMatch[];
}

const SCOUTS_DATA: ScoutProfileData[] = [
  {
    id: 'scout-amara-okafor',
    name: 'Amara Okafor',
    country: 'Nigeria',
    flag: 'NG',
    tier: 'Top 1% Scout',
    roleTitle: 'Senior Pan-African Tech Scout & Ex-Andela Staff Matchmaker',
    rating: 4.98,
    hires: 340,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    turnaround: '24h dossier turnaround',
    quote: 'I don’t match resumes. I evaluate production Git commits, distributed systems instincts, and how engineers communicate under pressure.',
    specialties: ['Distributed Go / Rust', 'Cloud & Kubernetes', 'React Native', 'Fintech Infrastructure'],
    recentPlacements: [
      { title: 'Principal Go & Rust Architect', detail: 'Deployed to London-based payments startup in 18h ($4,500/mo)' },
      { title: 'Staff Flutter Engineer', detail: 'Placed with Tier-1 Nigerian digital bank ($3,800/mo milestone)' }
    ],
    candidates: [
      {
        name: 'Chidi E.',
        role: 'Principal Backend (Go / K8s)',
        experience: '8 yrs exp · Ex-Paystack',
        rate: '$55/hr',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'GitHub Audit 99%'
      },
      {
        name: 'Fatima B.',
        role: 'Senior Distributed Systems',
        experience: '6 yrs exp · Ex-Flutterwave',
        rate: '$48/hr',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Architecture Certified'
      },
      {
        name: 'Tunde O.',
        role: 'Lead Cloud DevOps (AWS / Terraform)',
        experience: '7 yrs exp · Ex-Andela',
        rate: '$50/hr',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Production Verified'
      }
    ]
  },
  {
    id: 'scout-kofi-boateng',
    name: 'Kofi Boateng',
    country: 'Ghana',
    flag: 'GH',
    tier: 'Elite Scout',
    roleTitle: 'Software Engineering Director & Tech Matchmaker',
    rating: 4.94,
    hires: 280,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    turnaround: '24h dossier turnaround',
    quote: 'Great hiring is about context fit. A senior engineer in a high-growth startup needs different muscle than an enterprise maintainer.',
    specialties: ['Node.js & Python', 'AWS / Cloud Architecture', 'High-Load Systems', 'Agile Leadership'],
    recentPlacements: [
      { title: 'Full-Stack Node / React Squad', detail: 'Cross-border banking team deployed across Ghana and Kenya' },
      { title: 'DevOps & CI/CD Lead', detail: 'Curated for German e-commerce platform in under 24 hours' }
    ],
    candidates: [
      {
        name: 'Kwame A.',
        role: 'Staff Node.js / TypeScript',
        experience: '7 yrs exp · Ex-MPharma',
        rate: '$46/hr',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Clean Architecture'
      },
      {
        name: 'Abena M.',
        role: 'Full-Stack React & Python Lead',
        experience: '5 yrs exp · Ex-Hubtel',
        rate: '$42/hr',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Senior Verified'
      },
      {
        name: 'Emmanuel K.',
        role: 'Database & Redis Optimization',
        experience: '8 yrs exp · Distributed Systems',
        rate: '$52/hr',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Performance Specialist'
      }
    ]
  },
  {
    id: 'scout-wambui-kariuki',
    name: 'Wambui Kariuki',
    country: 'Kenya',
    flag: 'KE',
    tier: 'Elite Scout',
    roleTitle: 'Venture Partner & East Africa Design Talent Curator',
    rating: 4.98,
    hires: 220,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    turnaround: '24h dossier turnaround',
    quote: 'We vet designers not just by pretty mockups, but by how their component systems scale across complex multi-currency user journeys.',
    specialties: ['Design Systems', 'Fintech UI/UX', 'Mobile App Flows', 'Figma Tokens & Design Tokens'],
    recentPlacements: [
      { title: 'Head of Product Design', detail: 'Placed with East African agricultural finance platform ($4,200/mo)' },
      { title: 'Design Systems Architect', detail: 'Shipped design token infrastructure for Pan-African neobank' }
    ],
    candidates: [
      {
        name: 'Nia M.',
        role: 'Principal Product Designer',
        experience: '6 yrs exp · Ex-Twiga Foods',
        rate: '$45/hr',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Figma Systems Lead'
      },
      {
        name: 'Kevin O.',
        role: 'Fintech UX & Design Research',
        experience: '5 yrs exp · Ex-Safaricom M-Pesa team',
        rate: '$40/hr',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Micro-Interactions'
      },
      {
        name: 'Zahra K.',
        role: 'Mobile UI & Motion Lead',
        experience: '6 yrs exp · High-Conversion Flows',
        rate: '$44/hr',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Design Audit 98%'
      }
    ]
  },
  {
    id: 'scout-tariq-benali',
    name: 'Tariq Benali',
    country: 'Morocco & Kenya',
    flag: 'MA',
    tier: 'Top 1% Scout',
    roleTitle: 'Applied AI Researcher & North-East Africa ML Matchmaker',
    rating: 4.97,
    hires: 195,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    turnaround: '24h dossier turnaround',
    quote: 'True AI practitioners know how to take models out of Jupyter notebooks and deploy them reliably at low latency on edge infrastructure.',
    specialties: ['Custom LLM Fine-Tuning', 'Computer Vision Pipelines', 'MLOps & Inference', 'PyTorch / Triton'],
    recentPlacements: [
      { title: 'Staff Computer Vision Engineer', detail: 'Curated for smart logistics company in under 24 hours' },
      { title: 'LLM Fine-Tuning Specialist', detail: 'Shipped domain legal model for African corporate registry' }
    ],
    candidates: [
      {
        name: 'Dr. Youssef B.',
        role: 'PhD Machine Learning Scientist',
        experience: '7 yrs exp · Computer Vision Specialist',
        rate: '$65/hr',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Published Researcher'
      },
      {
        name: 'Salma T.',
        role: 'LLM Inference & MLOps Lead',
        experience: '5 yrs exp · PyTorch & Triton',
        rate: '$55/hr',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Model Latency 99%'
      },
      {
        name: 'Omar E.',
        role: 'Data Pipelines & Vector DB Architect',
        experience: '6 yrs exp · Milvus / LangChain',
        rate: '$50/hr',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Pipeline Certified'
      }
    ]
  },
  {
    id: 'scout-sarah-adeyemi',
    name: 'Sarah Adeyemi',
    country: 'Nigeria',
    flag: 'NG',
    tier: 'Elite Scout',
    roleTitle: 'Tech Ecosystem Connector & Venture Talent Scout',
    rating: 4.96,
    hires: 310,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    turnaround: '24h dossier turnaround',
    quote: 'Our network gives hiring founders direct access to the hidden 80% of top African senior talent who never apply on public job boards.',
    specialties: ['Fintech Payment Rails', 'Regulatory Compliance', 'B2B Growth Engineering', 'Cross-Border Teams'],
    recentPlacements: [
      { title: 'Payment Integration Lead', detail: 'Connected US enterprise with cross-border African banking compliance team' },
      { title: 'Growth Systems Architect', detail: 'Curated retention specialist who scaled neobank across 4 countries' }
    ],
    candidates: [
      {
        name: 'Dami O.',
        role: 'Senior Payment Gateway Engineer',
        experience: '8 yrs exp · NIBSS / Switch Integration',
        rate: '$52/hr',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Compliance Vetted'
      },
      {
        name: 'Ifeoluwa A.',
        role: 'Growth & Retention Engineer',
        experience: '6 yrs exp · Mixpanel / Segment',
        rate: '$45/hr',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Funnel Optimization'
      },
      {
        name: 'Babatunde K.',
        role: 'Fintech Operations & Reconciliation',
        experience: '7 yrs exp · Multi-Currency Ledger',
        rate: '$48/hr',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        verifiedTag: 'Audit Certified'
      }
    ]
  }
];

const FAQS = [
  {
    q: 'How does Scout Sourcing differ from browsing a regular job board?',
    a: 'On regular job boards, employers are flooded with dozens of unvetted applicants and spend weeks screening. With Scout Sourcing, an elite domain practitioner (an experienced engineer or design director) hand-evaluates candidate Git history, technical depth, and communication skills, delivering a curated shortlist of 3 ready-to-work candidates within 24 hours.'
  },
  {
    q: 'Why is there 0% client surcharge fee?',
    a: 'Traditional headhunting agencies slap on a 20% to 30% recruiter fee on top of contract values. Refeir absorbs the 10% scout reward entirely from the platform’s standard marketplace commission. As a hiring client, you pay standard market rates with zero added placement fees.'
  },
  {
    q: 'How does Refeir Trust Vault escrow protect my project budget?',
    a: 'Milestone funds are deposited into secure platform escrow before work kicks off. Money only releases to the freelancer when you inspect deliverables and explicitly click "Approve Deliverable". If any mismatch arises, our mediation team reviews deliverables against agreed scope.'
  },
  {
    q: 'What is the 14-Day Chemistry Guarantee?',
    a: 'If a recommended talent does not meet your team expectations within the first 14 days, your assigned scout will provide a replacement candidate immediately at zero extra charge.'
  },
  {
    q: 'How can I become a Scout and monetize my professional network?',
    a: 'If you are an active technical lead, founder, agency executive, or senior freelancer across Africa, you can apply as a Scout. When you introduce a hiring company or recommend verified talent, you earn a guaranteed 10% cash reward on every milestone released through platform escrow, withdrawable in USD or local African currency (M-Pesa, MTN Mobile Money, NGN, KES, GHS, ZAR).'
  }
];

export const ScoutSourcingPage: React.FC<ScoutSourcingPageProps> = ({ onNavigate }) => {
  const [selectedScoutIndex, setSelectedScoutIndex] = useState<number>(0);
  const [calculatorRole, setCalculatorRole] = useState<'client' | 'scout'>('client');
  const [budgetSlider, setBudgetSlider] = useState<number>(5000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentScout = SCOUTS_DATA[selectedScoutIndex] || SCOUTS_DATA[0];

  const handleHireClick = (scoutId: string) => {
    onNavigate(`/register?role=client&scout=${scoutId}`);
  };

  const handleApplyScout = () => {
    onNavigate('/register?role=scout');
  };

  const scrollToRadar = () => {
    document.getElementById('scout-radar')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Calculator computations
  const scoutReward = Math.round(budgetSlider * 0.1);
  const agencySavings = Math.round(budgetSlider * 0.25);

  return (
    <div className="rf-scout-page">
      {/* ============ 1. HERO: LIVING DOSSIER CONSOLE ============ */}
      <section className="rf-sc-hero">
        <div className="rf-sc-hero-aura" />
        <div className="rf-sc-wrap">
          {/* Top Live Ticker Header */}
          <div className="rf-sc-hero-top">
            <div className="rf-sc-live-pill">
              <span className="rf-sc-pulse-dot" />
              <span>Pan-African Sourcing Network</span>
            </div>
            <div className="rf-sc-ticker">
              <strong>54 African Tech Hubs</strong> · 850+ Vetted Scouts · <strong>&lt;24h Average Dossier Turnaround</strong>
            </div>
          </div>

          <div className="rf-sc-hero-main">
            {/* Left Content */}
            <div>
              <h1 className="rf-sc-h1">
                Let scouts find the right freelancer for you
              </h1>
              <p className="rf-sc-lead">
                Skip sifting through hundreds of cold profiles. Get curated, peer-vetted talent dossiers matched by senior tech practitioners in under 24 hours.
              </p>

              <div className="rf-sc-bullet-list">
                <div className="rf-sc-bullet-item">
                  <div className="rf-sc-bullet-check">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Work with scouts who reconnoiter our marketplace, source, and recommend talents for you</span>
                </div>

                <div className="rf-sc-bullet-item">
                  <div className="rf-sc-bullet-check">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Get a report with clear recommendations</span>
                </div>

                <div className="rf-sc-bullet-item">
                  <div className="rf-sc-bullet-check">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Recruit recommended freelance talent with confidence</span>
                </div>
              </div>

              <div className="rf-sc-hero-btns">
                <button
                  type="button"
                  className="rf-sc-btn rf-sc-btn-primary"
                  onClick={scrollToRadar}
                >
                  <span>Explore scout sourcing</span>
                  <ArrowRight size={18} />
                </button>

                <div className="rf-sc-guarantee-pill">
                  <div className="rf-sc-guarantee-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <span>100% money back guarantee</span>
                </div>
              </div>
            </div>

            {/* Right: The Interactive Living Dossier Console */}
            <div>
              <div className="rf-sc-console">
                <div className="rf-sc-console-head">
                  <span className="rf-sc-console-badge">
                    <CheckCircle2 size={13} /> Active Sourcing Dossier
                  </span>
                  <span className="rf-sc-console-eta">{currentScout.turnaround}</span>
                </div>

                {/* Lead Scout Bar */}
                <div className="rf-sc-scout-bar">
                  <div className="rf-sc-avatar-frame">
                    <img src={currentScout.avatar} alt={currentScout.name} />
                    <span className="rf-sc-verified-check">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  </div>
                  <div className="rf-sc-scout-text">
                    <div className="rf-sc-name-row">
                      <h4 className="rf-sc-scout-title">{currentScout.name} {currentScout.flag}</h4>
                      <span className="rf-sc-tag-pill">{currentScout.tier}</span>
                    </div>
                    <p className="rf-sc-scout-bio">{currentScout.roleTitle}</p>
                    <div className="rf-sc-scout-metrics">
                      <span className="rf-sc-stars">
                        <Star size={13} fill="#d97706" color="#d97706" />
                        <strong>{currentScout.rating}</strong>
                      </span>
                      <span>•</span>
                      <span><strong>{currentScout.hires}+</strong> Hires Recommended</span>
                    </div>
                  </div>
                </div>

                {/* Curated Candidates Shortlist Preview */}
                <div className="rf-sc-candidates-label">
                  <span>Curated Shortlist (3 Matches)</span>
                  <span style={{ color: '#1e7e22', fontWeight: 800 }}>100% Escrow Backed</span>
                </div>

                <div className="rf-sc-candidates-list">
                  {currentScout.candidates.map(cand => (
                    <div key={cand.name} className="rf-sc-candidate-item">
                      <div className="rf-sc-cand-left">
                        <img src={cand.avatar} alt={cand.name} className="rf-sc-cand-avatar" />
                        <div className="rf-sc-cand-info">
                          <h5>{cand.name}</h5>
                          <p>{cand.role} · {cand.experience}</p>
                        </div>
                      </div>
                      <div className="rf-sc-cand-right">
                        <div className="rf-sc-cand-rate">{cand.rate}</div>
                        <div className="rf-sc-cand-badge">{cand.verifiedTag}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Console Footer */}
                <div className="rf-sc-console-foot">
                  <div className="rf-sc-reward-note">
                    Scout Reward: <strong>10% Guaranteed</strong> (0% Client Surcharge)
                  </div>
                  <button
                    type="button"
                    className="rf-sc-hire-now-btn"
                    onClick={() => handleHireClick(currentScout.id)}
                  >
                    <span>Hire via Scout {currentScout.name.split(' ')[0]}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. THE SCOUTING ADVANTAGE: BENTO MATRIX ============ */}
      <section className="rf-sc-section" style={{ background: 'rgba(7, 22, 13, 0.4)' }}>
        <div className="rf-sc-wrap">
          <div className="rf-sc-head-center">
            <h2 className="rf-sc-h2">Why high-growth teams hire through peer scouts</h2>
            <p className="rf-sc-sub">
              Combining human domain expertise with automated milestone escrow protection.
            </p>
          </div>

          <div className="rf-sc-bento">
            {/* Card 1: Featured Vetting Card */}
            <div className="rf-sc-bento-card rf-sc-bento-featured">
              <div>
                <div className="rf-sc-bento-icon">
                  <Compass size={24} />
                </div>
                <h3>Peer Reconnaissance &gt; Keyword Matching</h3>
                <p>
                  Algorithms scan resume buzzwords; scouts evaluate actual craftsmanship. Senior practitioners review GitHub code commits, system design decisions, and real production history before recommending any candidate to your company.
                </p>
              </div>

              <div className="rf-sc-bento-metrics">
                <div className="rf-sc-bento-stat">
                  <strong>&lt; 24h</strong>
                  <span>Average Shortlist Delivery</span>
                </div>
                <div className="rf-sc-bento-stat">
                  <strong>98.4%</strong>
                  <span>First-Match Client Approval</span>
                </div>
                <div className="rf-sc-bento-stat">
                  <strong>$0</strong>
                  <span>Recruiter Markup to Client</span>
                </div>
              </div>
            </div>

            {/* Card 2: Zero Markup */}
            <div className="rf-sc-bento-card">
              <div>
                <div className="rf-sc-bento-icon">
                  <DollarSign size={24} />
                </div>
                <h3>Zero Recruiter Surcharge</h3>
                <p>
                  Traditional recruiters slap a 25–30% placement fee on top of contract budgets. Refeir absorbs the 10% scout reward directly from standard platform fees. You pay normal market rates.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--sc-green)', fontWeight: 700 }}>
                ✓ Save $2,500+ per milestone hire
              </div>
            </div>

            {/* Card 3: 14-Day Free Replacement */}
            <div className="rf-sc-bento-card">
              <div>
                <div className="rf-sc-bento-icon">
                  <Award size={24} />
                </div>
                <h3>14-Day Chemistry Guarantee</h3>
                <p>
                  If a recommended freelancer doesn't fit your team rhythm in the first 14 days, your assigned scout deploys a verified replacement immediately at no extra charge.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--sc-green)', fontWeight: 700 }}>
                ✓ Zero risk on trial period
              </div>
            </div>

            {/* Card 4: Trust Vault Escrow */}
            <div className="rf-sc-bento-card rf-sc-bento-featured">
              <div>
                <div className="rf-sc-bento-icon">
                  <Wallet size={24} />
                </div>
                <h3>100% Milestone Escrow Lock</h3>
                <p>
                  Funds are protected in Refeir Trust Vault escrow before work begins. Money only moves when you inspect and approve milestones. Scouts and talents are paid automatically upon your explicit sign-off.
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--rf-slate-300)' }}>
                <span>🔒 Milestone Escrow Protection</span>
                <span>⚡ Multi-Currency African Wallet</span>
                <span>⚖️ Impartial Deliverable Mediation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. PAN-AFRICAN SCOUT RADAR & DIRECTORY ============ */}
      <section id="scout-radar" className="rf-sc-section">
        <div className="rf-sc-wrap">
          <div className="rf-sc-head-center">
            <h2 className="rf-sc-h2">The Scout Network Radar</h2>
            <p className="rf-sc-sub">
              Meet top matchmakers across Africa's leading technology ecosystems. Select a scout to inspect their vetting philosophy and recent placements.
            </p>
          </div>

          <div className="rf-sc-radar-container">
            {/* Left Scout List Selector */}
            <div className="rf-sc-scout-nav">
              <span className="rf-scout-nav-title">Featured Scouts ({SCOUTS_DATA.length})</span>
              {SCOUTS_DATA.map((scout, index) => {
                const isActive = selectedScoutIndex === index;
                return (
                  <button
                    key={scout.id}
                    type="button"
                    className={`rf-sc-scout-nav-btn${isActive ? ' is-active' : ''}`}
                    onClick={() => setSelectedScoutIndex(index)}
                  >
                    <img src={scout.avatar} alt={scout.name} className="rf-sc-nav-avatar" />
                    <div className="rf-sc-nav-details">
                      <strong>{scout.name} {scout.flag}</strong>
                      <span>{scout.country} · {scout.rating}★ ({scout.hires} hires)</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Scout Spotlight Panel */}
            <div className="rf-sc-spotlight">
              <div>
                <div className="rf-sc-spotlight-top">
                  <div className="rf-sc-spotlight-profile">
                    <img src={currentScout.avatar} alt={currentScout.name} className="rf-sc-spotlight-photo" />
                    <div className="rf-sc-spotlight-meta">
                      <h3>{currentScout.name} ({currentScout.country})</h3>
                      <p>{currentScout.roleTitle}</p>
                      <div className="rf-sc-spotlight-tags">
                        <span className="rf-sc-spot-tag" style={{ background: 'var(--sc-green-soft)', color: 'var(--sc-green)' }}>
                          {currentScout.tier}
                        </span>
                        <span className="rf-sc-spot-tag">
                          ⭐ {currentScout.rating} Rating
                        </span>
                        <span className="rf-sc-spot-tag">
                          {currentScout.hires}+ Recommended Hires
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rf-sc-btn rf-sc-btn-primary"
                    onClick={() => handleHireClick(currentScout.id)}
                    style={{ minHeight: '46px', padding: '0 1.4rem', fontSize: '0.9rem' }}
                  >
                    <span>Request Dossier from {currentScout.name.split(' ')[0]}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Scout Vetting Philosophy Quote */}
                <div className="rf-sc-quote-block">
                  <p>"{currentScout.quote}"</p>
                </div>

                {/* Specialties Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
                  {currentScout.specialties.map(spec => (
                    <span
                      key={spec}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '0.82rem',
                        color: 'var(--rf-cream)'
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Recent Placements Showcase */}
                <div className="rf-sc-placements-grid">
                  {currentScout.recentPlacements.map((plc, idx) => (
                    <div key={idx} className="rf-sc-placement-card">
                      <h4>⚡ {plc.title}</h4>
                      <p>{plc.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--sc-green-border)' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--rf-slate-300)' }}>
                  Average response: <strong>Under 2 hours</strong> · Turnaround: <strong>24 Hours</strong>
                </span>
                <span style={{ fontSize: '0.84rem', color: 'var(--sc-green)', fontWeight: 700 }}>
                  ✓ 100% Refeir Trust Vault Escrow Protected
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. TRIANGULAR TRUST PROTOCOL ============ */}
      <section className="rf-sc-section" style={{ background: 'rgba(7, 22, 13, 0.4)' }}>
        <div className="rf-sc-wrap">
          <div className="rf-sc-head-center">
            <h2 className="rf-sc-h2">The Triangular Trust Protocol</h2>
            <p className="rf-sc-sub">
              Unlike 2-sided marketplaces where clients take all the risk, Scout Sourcing aligns incentives across all three parties.
            </p>
          </div>

          <div className="rf-sc-protocol-canvas">
            <div className="rf-sc-triad">
              {/* Node 1: Client */}
              <div className="rf-sc-triad-node">
                <div>
                  <span className="rf-sc-node-badge">Party 1 · The Hiring Client</span>
                  <h4>You: Hiring with Confidence</h4>
                  <p>
                    Submit your scope without upfront fees. You receive a curated 3-talent dossier verified by a practitioner who knows the craft. You only release payment upon approving milestone deliverables.
                  </p>
                </div>
                <div className="rf-sc-node-perk">
                  <CheckCircle2 size={16} /> 0% Added Markup + 14-Day Guarantee
                </div>
              </div>

              {/* Node 2: The Scout */}
              <div className="rf-sc-triad-node" style={{ border: '2px solid var(--sc-green)' }}>
                <div>
                  <span className="rf-sc-node-badge" style={{ color: '#ffffff' }}>Party 2 · The Domain Scout</span>
                  <h4>The Scout: Curating the Best</h4>
                  <p>
                    Evaluates code repositories, screens problem-solving capability, and acts as your domain advisory layer. The scout earns a guaranteed 10% reward from escrow as work is approved.
                  </p>
                </div>
                <div className="rf-sc-node-perk">
                  <CheckCircle2 size={16} /> Automated 10% Platform Escrow Reward
                </div>
              </div>

              {/* Node 3: The Talent */}
              <div className="rf-sc-triad-node">
                <div>
                  <span className="rf-sc-node-badge">Party 3 · Verified Freelancer</span>
                  <h4>The Specialist: Doing Great Work</h4>
                  <p>
                    Skips the noise of competitive bidding. Begins project execution knowing full milestone deposits are already secured and reserved in Refeir Trust Vault escrow.
                  </p>
                </div>
                <div className="rf-sc-node-perk">
                  <CheckCircle2 size={16} /> Guaranteed Escrow Deposit Before Kickoff
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. INTERACTIVE SOURCING & REWARD DIAL ============ */}
      <section className="rf-sc-section">
        <div className="rf-sc-wrap">
          <div className="rf-sc-head-center">
            <h2 className="rf-sc-h2">Sourcing & Savings Calculator</h2>
            <p className="rf-sc-sub">
              Slide to see how much you save hiring via scouts vs traditional recruitment agencies, or calculate your rewards as an active scout.
            </p>
          </div>

          <div className="rf-sc-calc-panel">
            {/* Calculator Tab Switcher */}
            <div style={{ textAlign: 'center' }}>
              <div className="rf-sc-calc-tabs">
                <button
                  type="button"
                  className={`rf-sc-calc-tab-btn${calculatorRole === 'client' ? ' is-active' : ''}`}
                  onClick={() => setCalculatorRole('client')}
                >
                  I'm a Hiring Team
                </button>
                <button
                  type="button"
                  className={`rf-sc-calc-tab-btn${calculatorRole === 'scout' ? ' is-active' : ''}`}
                  onClick={() => setCalculatorRole('scout')}
                >
                  I'm a Scout / Connector
                </button>
              </div>
            </div>

            <div className="rf-sc-calc-content">
              {/* Left Slider Control */}
              <div className="rf-sc-slider-box">
                <label>
                  {calculatorRole === 'client' ? 'Estimated Project Milestone Budget (USD)' : 'Monthly Sourced Project Volume (USD)'}
                </label>
                <div className="rf-sc-slider-val">
                  ${budgetSlider.toLocaleString()}
                </div>
                <input
                  type="range"
                  min="1000"
                  max="35000"
                  step="500"
                  value={budgetSlider}
                  onChange={e => setBudgetSlider(Number(e.target.value))}
                  className="rf-sc-range"
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--rf-slate-300)' }}>
                  <span>$1,000 (Sprint)</span>
                  <span>$15,000 (Retainer)</span>
                  <span>$35,000 (Squad)</span>
                </div>
              </div>

              {/* Right Output Card */}
              <div className="rf-sc-calc-results">
                {calculatorRole === 'client' ? (
                  <>
                    <div className="rf-sc-result-row">
                      <span>Refeir Client Surcharge</span>
                      <strong>$0.00 (Zero Added Fee)</strong>
                    </div>
                    <div className="rf-sc-result-row is-highlight">
                      <span>Saved vs Traditional Agency</span>
                      <strong>+${agencySavings.toLocaleString()}</strong>
                    </div>
                    <div className="rf-sc-result-row">
                      <span>Turnaround to Vetted Dossier</span>
                      <strong>&lt; 24 Hours</strong>
                    </div>
                    <div className="rf-sc-result-row">
                      <span>Replacement Guarantee</span>
                      <strong>14 Days Free</strong>
                    </div>
                    <div style={{ marginTop: '1.25rem' }}>
                      <button
                        type="button"
                        className="rf-sc-btn rf-sc-btn-primary"
                        onClick={() => handleHireClick(currentScout.id)}
                        style={{ width: '100%' }}
                      >
                        <span>Start Sourcing at this Budget</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rf-sc-result-row is-highlight">
                      <span>Your Guaranteed Reward (10%)</span>
                      <strong>+${scoutReward.toLocaleString()}</strong>
                    </div>
                    <div className="rf-sc-result-row">
                      <span>Annualized Referral Earnings</span>
                      <strong>+${(scoutReward * 12).toLocaleString()} / yr</strong>
                    </div>
                    <div className="rf-sc-result-row">
                      <span>Withdrawal Methods</span>
                      <strong>USD, NGN, KES, GHS, ZAR, M-Pesa</strong>
                    </div>
                    <div className="rf-sc-result-row">
                      <span>Invoicing Effort</span>
                      <strong>0 hrs (Automated Escrow)</strong>
                    </div>
                    <div style={{ marginTop: '1.25rem' }}>
                      <button
                        type="button"
                        className="rf-sc-btn rf-sc-btn-primary"
                        onClick={handleApplyScout}
                        style={{ width: '100%' }}
                      >
                        <span>Apply to Earn as a Scout</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. MODERN DUAL ACTION LAUNCHPAD ============ */}
      <section className="rf-sc-section" style={{ background: 'rgba(7, 22, 13, 0.4)' }}>
        <div className="rf-sc-wrap">
          <div className="rf-sc-head-center">
            <h2 className="rf-sc-h2">Ready to take action?</h2>
            <p className="rf-sc-sub">
              Whether you need to hire senior talent in 24 hours or want to monetize your network, Refeir makes it seamless.
            </p>
          </div>

          <div className="rf-sc-launchpad">
            {/* Action 1: For Hiring Companies */}
            <div className="rf-sc-action-card rf-sc-action-card-hire">
              <div>
                <div className="rf-sc-action-head">
                  <div className="rf-sc-bento-icon">
                    <Briefcase size={22} />
                  </div>
                  <h3>Deploy a Sourcing Brief</h3>
                  <p>
                    Connect with {currentScout.name} or our network of 850+ senior scouts to receive your curated 3-talent shortlist within 24 hours.
                  </p>
                </div>

                <div className="rf-sc-action-features">
                  <div className="rf-sc-action-feature">
                    <CheckCircle2 size={16} /> 0% client surcharge fee (standard market rate)
                  </div>
                  <div className="rf-sc-action-feature">
                    <CheckCircle2 size={16} /> 100% Refeir Trust Vault escrow protection
                  </div>
                  <div className="rf-sc-action-feature">
                    <CheckCircle2 size={16} /> 14-day free candidate replacement guarantee
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="rf-sc-btn rf-sc-btn-primary"
                onClick={() => handleHireClick(currentScout.id)}
              >
                <span>Create Free Account & Hire via Scout</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Action 2: For Scouts */}
            <div className="rf-sc-action-card">
              <div>
                <div className="rf-sc-action-head">
                  <div className="rf-sc-bento-icon">
                    <TrendingUp size={22} />
                  </div>
                  <h3>Join as an Elite Scout</h3>
                  <p>
                    Are you a senior engineer, founder, or community leader? Recommend vetted African specialists and earn locked 10% milestone payouts.
                  </p>
                </div>

                <div className="rf-sc-action-features">
                  <div className="rf-sc-action-feature">
                    <CheckCircle2 size={16} /> Guaranteed 10% cash reward on every milestone
                  </div>
                  <div className="rf-sc-action-feature">
                    <CheckCircle2 size={16} /> Instant local currency withdrawal (M-Pesa, NGN, KES, USD)
                  </div>
                  <div className="rf-sc-action-feature">
                    <CheckCircle2 size={16} /> Zero invoicing or payment follow-ups
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="rf-sc-btn rf-sc-btn-outline"
                onClick={handleApplyScout}
              >
                <span>Apply to Become a Scout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 7. ACCORDION FAQS ============ */}
      <section className="rf-sc-section">
        <div className="rf-sc-wrap">
          <div className="rf-sc-head-center">
            <h2 className="rf-sc-h2">Frequently Asked Questions</h2>
            <p className="rf-sc-sub">
              Everything you need to know about scout sourcing, client protection, and rewards.
            </p>
          </div>

          <div className="rf-sc-faq-grid">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={faq.q} className={`rf-sc-faq-card${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="rf-sc-faq-btn"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <Plus size={18} />
                  </button>
                  <div className="rf-sc-faq-drawer">
                    <div>
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
