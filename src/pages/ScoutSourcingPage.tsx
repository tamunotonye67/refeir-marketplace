import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Compass,
  Check,
  Clock,
  ArrowRight,
  ChevronDown,
  Zap,
  CheckCircle2,
  Wallet,
  Star,
  Briefcase,
  Layers,
  Award,
  Play,
  Pause,
  Volume2,
  VolumeX,
  TrendingUp,
  Globe,
  Lock,
  BadgeCheck
} from 'lucide-react';
import '../styles/scout-sourcing.css';

interface ScoutSourcingPageProps {
  onNavigate: (path: string) => void;
}

interface ScoutItem {
  id: string;
  name: string;
  country: string;
  flag: string;
  tier: string;
  headline: string;
  rating: number;
  hires: number;
  avatar: string;
  turnaround: string;
  dossierSnippet: string;
  specialties: string[];
}

interface TrackConfig {
  id: string;
  label: string;
  short: string;
  icon: React.ComponentType<any>;
  description: string;
  scouts: ScoutItem[];
}

const TRACKS: TrackConfig[] = [
  {
    id: 'engineering',
    label: 'Engineering & Cloud',
    short: 'Engineering',
    icon: Compass,
    description: 'Senior distributed systems leads, cloud architects, and full-stack engineering leaders.',
    scouts: [
      {
        id: 'amara-okafor',
        name: 'Amara Okafor',
        country: 'Nigeria',
        flag: 'NG',
        tier: 'Principal Scout',
        headline: 'Staff Infrastructure Lead & Former Andela Engineering Director',
        rating: 4.99,
        hires: 340,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Vetted 3 senior Go/Kubernetes engineers for a Series-B fintech within 18 hours. Milestone locked in platform escrow.',
        specialties: ['Distributed Go', 'AWS / Terraform', 'High-Throughput APIs', 'Fintech Infrastructure']
      },
      {
        id: 'chidi-eze',
        name: 'Chidi Eze',
        country: 'Nigeria',
        flag: 'NG',
        tier: 'Senior Scout',
        headline: 'DevOps & Cloud Architect · AWS Certified Community Builder',
        rating: 4.96,
        hires: 185,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Recommended 2 senior DevOps leads who reduced deployment latency by 68% for a pan-African logistics carrier.',
        specialties: ['Kubernetes', 'CI/CD Pipelines', 'GCP', 'PostgreSQL Tuning']
      }
    ]
  },
  {
    id: 'ai-data',
    label: 'AI & Data Intelligence',
    short: 'AI & Data',
    icon: Zap,
    description: 'RAG engineers, LLM fine-tuners, and predictive data scientists across Africa.',
    scouts: [
      {
        id: 'tariq-mansoor',
        name: 'Tariq Mansoor',
        country: 'Egypt',
        flag: 'EG',
        tier: 'Lead AI Curator',
        headline: 'Lead Machine Learning Scientist · Cairo AI Research Group',
        rating: 4.97,
        hires: 210,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Hand-picked 3 computer vision and Arabic NLP specialists for a venture-backed health-tech platform.',
        specialties: ['LLM Fine-Tuning', 'PyTorch', 'Vector Databases', 'Multilingual NLP']
      },
      {
        id: 'farida-el-sayed',
        name: 'Farida El-Sayed',
        country: 'Egypt',
        flag: 'EG',
        tier: 'Senior Scout',
        headline: 'VP of Data Analytics · North Africa Talent Lead',
        rating: 4.99,
        hires: 155,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        turnaround: '36h dossier turnaround',
        dossierSnippet: 'Matched enterprise health tech with vetted bioinformatics and predictive data architects.',
        specialties: ['Data Pipelines', 'Predictive ML', 'Snowflake / Big Data', 'MLOps']
      }
    ]
  },
  {
    id: 'design',
    label: 'Product & Brand Design',
    short: 'Product Design',
    icon: Layers,
    description: 'Senior product designers, design system leads, and 3D motion artists who elevate brand value.',
    scouts: [
      {
        id: 'wambui-kariuki',
        name: 'Wambui Kariuki',
        country: 'Kenya',
        flag: 'KE',
        tier: 'Elite Scout',
        headline: 'Venture Partner & East Africa Design Talent Curator',
        rating: 4.98,
        hires: 220,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Curated top design leads who rebuilt UI/UX design systems for 4 Tier-1 African neobanks.',
        specialties: ['Design Systems', 'Figma Tokens', 'Mobile UX', 'Fintech Flows']
      },
      {
        id: 'kofi-darko',
        name: 'Kofi Darko',
        country: 'Ghana',
        flag: 'GH',
        tier: 'Senior Scout',
        headline: 'Design Director & Brand Strategist · Accra Tech Guild',
        rating: 4.95,
        hires: 140,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Sourced 3 senior visual identity designers for a UK-backed clean tech marketplace.',
        specialties: ['Brand Identity', '3D Motion', 'Micro-Interactions', 'Webflow']
      }
    ]
  },
  {
    id: 'fintech-mobile',
    label: 'Fintech & Mobile Systems',
    short: 'Fintech & Mobile',
    icon: Wallet,
    description: 'Specialists in high-throughput ledger banking, payment gateways, Flutter, and native iOS/Android.',
    scouts: [
      {
        id: 'kwame-mensah',
        name: 'Kwame Mensah',
        country: 'Ghana',
        flag: 'GH',
        tier: 'Fintech Scout Lead',
        headline: 'Former Head of Mobile Engineering · Pan-African Payments Pioneer',
        rating: 4.99,
        hires: 290,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Introduced 3 veteran mobile engineers who shipped PCI-DSS compliant cross-border remittance apps in 6 weeks.',
        specialties: ['Payment Rail Integration', 'Flutter & iOS Native', 'ISO 8583 Banking', 'Offline Sync']
      },
      {
        id: 'zainab-bello',
        name: 'Zainab Bello',
        country: 'Nigeria',
        flag: 'NG',
        tier: 'Senior Scout',
        headline: 'Fintech Protocol Architect · Lagos Tech Circle Organizer',
        rating: 4.97,
        hires: 175,
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Curated 2 backend payment architects for a cross-border FX routing engine.',
        specialties: ['Card Schemes', 'Mobile Money APIs', 'USSD Integrations', 'Fraud Prevention']
      }
    ]
  }
];

const CALC_TIERS = [
  { name: 'Starter MVP Sprint', budget: '$1,500', num: 1500, time: '24h', scoutEarn: '$150', desc: 'Single-feature build, landing sprint, or security review' },
  { name: 'Core Application Phase', budget: '$5,000', num: 5000, time: '24h', scoutEarn: '$500', desc: 'Full-stack feature milestone or mobile app release' },
  { name: 'Quarterly Dedicated Squad', budget: '$12,000', num: 12000, time: '36h', scoutEarn: '$1,200', desc: 'Multi-month dedicated engineering or design retainer' },
  { name: 'Enterprise Team Build', budget: '$25,000', num: 25000, time: '48h', scoutEarn: '$2,500', desc: 'Cross-border specialized team deployed across 6 months' }
];

const FAQS = [
  {
    q: 'What is a Refeir Scout, and how do they source talent?',
    a: 'A Scout is an experienced industry practitioner, engineering lead, or ecosystem connector who understands actual craft. Rather than relying on algorithmic keyword matching, scouts actively reconnoiter talent networks, evaluate GitHub commits, portfolios, and communication skills, and deliver a hand-curated dossier of 3 verified matches.'
  },
  {
    q: 'How and when do Scouts receive their 10% milestone reward?',
    a: 'Every time a client deposits project milestone funds, Refeir locks the agreed sum in the Trust Vault. The instant the client marks the milestone approved, your 10% cash reward is automatically deposited into your Refeir multi-currency wallet with zero deductions.'
  },
  {
    q: 'Does hiring through a scout cost the client anything extra?',
    a: 'No. There is zero client surcharge. The 10% scout reward is completely platform-absorbed within Refeir’s standard marketplace commission. Clients pay fair market rates while enjoying expert curation and guaranteed escrow safety.'
  },
  {
    q: 'What payout methods and currencies are supported for Scouts?',
    a: 'Scouts can withdraw funds directly into USD bank accounts, local African bank accounts (NGN, KES, GHS, ZAR, EGP), or regional mobile money wallets (M-Pesa, MTN MoMo, Airtel Money, Orange Money) with zero cross-border friction.'
  },
  {
    q: 'What happens if a recommended freelancer is not the right fit?',
    a: 'Refeir provides an unconditional 14-day Free Replacement Guarantee. If the talent does not match your milestones within the first 14 days, your assigned scout will immediately curate and deploy a vetted replacement at no extra charge.'
  },
  {
    q: 'Can I both earn as a Scout and hire talent as a Founder?',
    a: 'Yes! Refeir supports dual roles. Many tech leads use scouts to recruit specialist talent for their company, while also monetizing their own professional network by recommending colleagues into enterprise opportunities.'
  }
];

export const ScoutSourcingPage: React.FC<ScoutSourcingPageProps> = ({ onNavigate }) => {
  const [role, setRole] = useState<'scout' | 'client'>('scout');
  const [trackId, setTrackId] = useState<string>('engineering');
  const [selectedScoutIndex, setSelectedScoutIndex] = useState<number>(0);
  const [calcTierIndex, setCalcTierIndex] = useState<number>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live calculator state for interactive earnings simulator
  const [simHiresPerMonth, setSimHiresPerMonth] = useState<number>(3);
  const [simAvgProjectValue, setSimAvgProjectValue] = useState<number>(3500);

  // Video state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Quick Registration Form State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regCountry, setRegCountry] = useState<string>('Nigeria');

  const currentTrack = TRACKS.find(t => t.id === trackId) || TRACKS[0];
  const currentScout = currentTrack.scouts[selectedScoutIndex] || currentTrack.scouts[0];
  const currentCalc = CALC_TIERS[calcTierIndex];

  // Estimated scout monthly income from simulator
  const estimatedMonthlyIncome = Math.round(simHiresPerMonth * simAvgProjectValue * 0.1);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(err => {
        console.warn('Video playback interrupted', err);
      });
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'client') {
      onNavigate(`/signup?role=CLIENT&track=${currentTrack.id}`);
    } else {
      onNavigate('/signup?role=SCOUT');
    }
  };

  return (
    <div className="rf-ss-page">
      {/* ============ ORGANIC AMBIENT GLOW ============ */}
      <div className="rf-ss-ambient-mesh" aria-hidden="true" />

      {/* ============ HERO SECTION ============ */}
      <section className="rf-ss-hero-section">
        <div className="rf-ss-container">
          {/* Top Persona Toggle */}
          <div className="rf-ss-persona-pill-wrap">
            <div className="rf-ss-persona-pill" role="tablist" aria-label="Select your objective">
              <button
                type="button"
                role="tab"
                aria-selected={role === 'scout'}
                className={`rf-ss-persona-tab ${role === 'scout' ? 'is-active' : ''}`}
                onClick={() => setRole('scout')}
              >
                <Compass size={15} />
                <span>Earn as a Scout (10% Locked)</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={role === 'client'}
                className={`rf-ss-persona-tab ${role === 'client' ? 'is-active' : ''}`}
                onClick={() => setRole('client')}
              >
                <Briefcase size={15} />
                <span>Hire Talent via Scouts ($0 Fee)</span>
              </button>
            </div>
          </div>

          <div className="rf-ss-hero-grid">
            {/* Left Hero Content */}
            <div className="rf-ss-hero-left">
              <div className="rf-ss-badge-pill">
                <span className="rf-ss-badge-dot" />
                <span>
                  {role === 'scout'
                    ? 'Africa’s Premier Talent Matchmaking Network'
                    : 'Curated by Senior Tech Leads & Curators'}
                </span>
              </div>

              <h1 className="rf-ss-hero-title">
                {role === 'scout' ? (
                  <>
                    Turn your network into <span className="rf-ss-accent-gradient">locked 10%</span> milestone revenue.
                  </>
                ) : (
                  <>
                    Let scouts match you with <span className="rf-ss-accent-gradient">vetted African</span> talent.
                  </>
                )}
              </h1>

              <p className="rf-ss-hero-sub">
                {role === 'scout'
                  ? 'Connect global founders with Africa’s top engineers, designers, and AI specialists. Every time a milestone completes in platform escrow, 10% is locked and paid straight to your wallet.'
                  : 'Skip algorithm spam and recruitment agencies. Senior engineering leads scout our verified talent pool, evaluate code quality, and deliver 3 bespoke candidate dossiers in under 24 hours.'}
              </p>

              {/* High-Impact Proof Metrics */}
              <div className="rf-ss-proof-bar">
                <div className="rf-ss-proof-stat">
                  <div className="rf-ss-proof-value">$1.4M+</div>
                  <div className="rf-ss-proof-label">Escrow Rewards Paid</div>
                </div>
                <div className="rf-ss-proof-divider" />
                <div className="rf-ss-proof-stat">
                  <div className="rf-ss-proof-value">850+</div>
                  <div className="rf-ss-proof-label">Active Senior Scouts</div>
                </div>
                <div className="rf-ss-proof-divider" />
                <div className="rf-ss-proof-stat">
                  <div className="rf-ss-proof-value">54</div>
                  <div className="rf-ss-proof-label">African Nations Vetted</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="rf-ss-hero-cta-group">
                <button
                  type="button"
                  className="rf-ss-cta-btn rf-ss-cta-primary"
                  onClick={() => scrollToId('registration-station')}
                >
                  <span>{role === 'scout' ? 'Apply as a Scout (Free)' : 'Deploy Sourcing Brief'}</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  className="rf-ss-cta-btn rf-ss-cta-secondary"
                  onClick={() => scrollToId('explainer-video')}
                >
                  <Play size={15} fill="currentColor" />
                  <span>Watch How It Works</span>
                </button>
              </div>

              <div className="rf-ss-hero-guarantee">
                <ShieldCheck size={16} color="var(--ss-accent)" />
                <span>100% Platform Escrow Protection · Zero Client Surcharge · Free Instant Wallet</span>
              </div>
            </div>

            {/* Right Hero Visual: Organic Interactive Card */}
            <div className="rf-ss-hero-right">
              {role === 'scout' ? (
                /* Scout Earnings Forecast Card */
                <div className="rf-ss-forecast-card">
                  <div className="rf-ss-forecast-head">
                    <div>
                      <span className="rf-ss-forecast-tag">LIVE SCOUT SIMULATOR</span>
                      <h3 className="rf-ss-forecast-title">Your Monthly Reward Potential</h3>
                    </div>
                    <div className="rf-ss-forecast-badge">
                      <TrendingUp size={16} />
                      <span>10% Fixed Cut</span>
                    </div>
                  </div>

                  <div className="rf-ss-forecast-num-wrap">
                    <div className="rf-ss-forecast-big">${estimatedMonthlyIncome.toLocaleString()}</div>
                    <span className="rf-ss-forecast-period">USD / month estimated</span>
                  </div>

                  {/* Interactive Sliders inside card */}
                  <div className="rf-ss-sim-controls">
                    <div className="rf-ss-sim-group">
                      <div className="rf-ss-sim-header">
                        <span>Successful Hires / Month</span>
                        <strong>{simHiresPerMonth} {simHiresPerMonth === 1 ? 'Talent' : 'Talents'}</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={simHiresPerMonth}
                        onChange={e => setSimHiresPerMonth(Number(e.target.value))}
                        className="rf-ss-slider"
                      />
                    </div>

                    <div className="rf-ss-sim-group">
                      <div className="rf-ss-sim-header">
                        <span>Average Project Milestone Value</span>
                        <strong>${simAvgProjectValue.toLocaleString()} USD</strong>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="10000"
                        step="500"
                        value={simAvgProjectValue}
                        onChange={e => setSimAvgProjectValue(Number(e.target.value))}
                        className="rf-ss-slider"
                      />
                    </div>
                  </div>

                  <div className="rf-ss-forecast-payout-row">
                    <div className="rf-ss-payout-pill">
                      <Globe size={13} />
                      <span>Instant Multi-Currency Payout</span>
                    </div>
                    <span className="rf-ss-payout-methods">USD · NGN · KES · GHS · ZAR · M-Pesa</span>
                  </div>

                  <button
                    type="button"
                    className="rf-ss-card-action-btn"
                    onClick={() => scrollToId('registration-station')}
                  >
                    <span>Claim Your Scout Link & Wallet</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                /* Client Vetted Dossier Showcase Card */
                <div className="rf-ss-dossier-card">
                  <div className="rf-ss-dossier-head">
                    <div className="rf-ss-scout-mini-avatar">
                      <img src={currentScout.avatar} alt={currentScout.name} />
                      <span className="rf-ss-scout-verified-mark">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    </div>
                    <div>
                      <div className="rf-ss-scout-name">{currentScout.name}</div>
                      <div className="rf-ss-scout-title">{currentScout.headline}</div>
                    </div>
                    <div className="rf-ss-scout-rating">
                      <Star size={13} fill="var(--ss-accent)" color="var(--ss-accent)" />
                      <span>{currentScout.rating}</span>
                    </div>
                  </div>

                  <div className="rf-ss-dossier-body">
                    <div className="rf-ss-dossier-label">SAMPLE DOSSIER SNIPPET</div>
                    <p className="rf-ss-dossier-snippet">"{currentScout.dossierSnippet}"</p>

                    <div className="rf-ss-specialties-wrap">
                      {currentScout.specialties.map(tag => (
                        <span key={tag} className="rf-ss-spec-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="rf-ss-dossier-footer">
                    <div className="rf-ss-guarantee-stat">
                      <Clock size={14} color="var(--ss-accent)" />
                      <span>Under 24h Turnaround</span>
                    </div>
                    <div className="rf-ss-guarantee-stat">
                      <ShieldCheck size={14} color="var(--ss-accent)" />
                      <span>14-Day Free Replacement</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rf-ss-card-action-btn"
                    onClick={() => scrollToId('registration-station')}
                  >
                    <span>Connect with Scout {currentScout.name.split(' ')[0]}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ EXPLAINER VIDEO SECTION ============ */}
      <section id="explainer-video" className="rf-ss-video-section">
        <div className="rf-ss-container">
          <div className="rf-ss-section-header">
            <div className="rf-ss-section-eyebrow">
              <span className="rf-ss-badge-dot" />
              <span>90-Second Walkthrough</span>
            </div>
            <h2 className="rf-ss-section-title">How Scout Sourcing Works</h2>
            <p className="rf-ss-section-sub">
              See how scouts match you with vetted African talent
            </p>
          </div>

          <div className="rf-ss-video-wrapper">
            <div className="rf-ss-video-player" onClick={toggleVideoPlay}>
              <video
                ref={videoRef}
                src="/launching_demo.mp4"
                poster="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
                playsInline
                preload="metadata"
                className="rf-ss-video-elem"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onEnded={() => setIsVideoPlaying(false)}
              >
                <source src="/launching_demo.mp4" type="video/mp4" />
                <source src="/hero-video.mp4" type="video/mp4" />
              </video>

              {/* Glassy Bottom-Right Video Controls */}
              <div className="rf-ss-video-side-ctrls" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="rf-ss-side-ctrl-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideoPlay();
                  }}
                  aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                  title={isVideoPlaying ? 'Pause video' : 'Play video'}
                >
                  {isVideoPlaying ? (
                    <Pause size={14} fill="currentColor" color="currentColor" strokeWidth={0} />
                  ) : (
                    <Play size={14} fill="currentColor" color="currentColor" strokeWidth={0} style={{ marginLeft: '1.5px' }} />
                  )}
                </button>

                <button
                  type="button"
                  className="rf-ss-side-ctrl-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
                  title={isMuted ? 'Unmute sound' : 'Mute sound'}
                >
                  {isMuted ? <VolumeX size={14} strokeWidth={2.2} /> : <Volume2 size={14} strokeWidth={2.2} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE ORGANIC 3-STEP SCOUTING ENGINE ============ */}
      <section className="rf-ss-engine-section">
        <div className="rf-ss-container">
          <div className="rf-ss-section-header">
            <div className="rf-ss-section-eyebrow">
              <span className="rf-ss-badge-dot" />
              <span>Transparent Protocol</span>
            </div>
            <h2 className="rf-ss-section-title">The Three Pillars of Peer Sourcing</h2>
            <p className="rf-ss-section-sub">
              Designed from the ground up to protect both scouts and founders with programmatic escrow certainty.
            </p>
          </div>

          <div className="rf-ss-engine-grid">
            {/* Step 1 */}
            <div className="rf-ss-engine-card">
              <div className="rf-ss-engine-number">01</div>
              <div className="rf-ss-engine-icon-wrap">
                <Compass size={24} color="var(--ss-accent)" />
              </div>
              <h3 className="rf-ss-engine-card-title">Curate or Share Link</h3>
              <p className="rf-ss-engine-card-desc">
                Share your personalized Refeir Scout link with colleagues and clients, or submit candidate dossiers directly to active marketplace milestone briefs.
              </p>
              <ul className="rf-ss-engine-list">
                <li><Check size={14} color="var(--ss-accent)" /> 30 to 180-day cookie attribution window</li>
                <li><Check size={14} color="var(--ss-accent)" /> Direct client-talent private introductions</li>
                <li><Check size={14} color="var(--ss-accent)" /> Live referral analytics & click telemetry</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="rf-ss-engine-card">
              <div className="rf-ss-engine-number">02</div>
              <div className="rf-ss-engine-icon-wrap">
                <Lock size={24} color="var(--ss-accent)" />
              </div>
              <h3 className="rf-ss-engine-card-title">Refeir Trust Vault Escrow</h3>
              <p className="rf-ss-engine-card-desc">
                When work begins, 100% of the project milestone budget is locked in Refeir's smart escrow vault. Scouts never need to invoice or chase clients for payment.
              </p>
              <ul className="rf-ss-engine-list">
                <li><Check size={14} color="var(--ss-accent)" /> Upfront milestone deposit protection</li>
                <li><Check size={14} color="var(--ss-accent)" /> Programmatic lock prevents non-payment</li>
                <li><Check size={14} color="var(--ss-accent)" /> Zero fee deduction from talent payouts</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="rf-ss-engine-card">
              <div className="rf-ss-engine-number">03</div>
              <div className="rf-ss-engine-icon-wrap">
                <Wallet size={24} color="var(--ss-accent)" />
              </div>
              <h3 className="rf-ss-engine-card-title">Instant 10% Cash Disbursement</h3>
              <p className="rf-ss-engine-card-desc">
                The exact moment a client approves a completed deliverable, your 10% cash reward is released automatically into your multi-currency wallet for immediate cashout.
              </p>
              <ul className="rf-ss-engine-list">
                <li><Check size={14} color="var(--ss-accent)" /> Instant withdrawal in USD or Local Currencies</li>
                <li><Check size={14} color="var(--ss-accent)" /> Direct integration with M-Pesa & Mobile Money</li>
                <li><Check size={14} color="var(--ss-accent)" /> Full tax receipts & transparent audit logs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LIVE MILESTONE & EARNINGS BENCHMARKS ============ */}
      <section className="rf-ss-matrix-section">
        <div className="rf-ss-container">
          <div className="rf-ss-section-header">
            <div className="rf-ss-section-eyebrow">
              <span className="rf-ss-badge-dot" />
              <span>Milestone Economics</span>
            </div>
            <h2 className="rf-ss-section-title">Transparent Project Rewards</h2>
            <p className="rf-ss-section-sub">
              Explore how project tiers translate into locked 10% cash rewards for scouts and guaranteed deliverables for clients.
            </p>
          </div>

          {/* Interactive Tier Switcher Tabs */}
          <div className="rf-ss-matrix-tabs">
            {CALC_TIERS.map((tier, idx) => (
              <button
                key={tier.name}
                type="button"
                className={`rf-ss-matrix-tab ${calcTierIndex === idx ? 'is-active' : ''}`}
                onClick={() => setCalcTierIndex(idx)}
              >
                <span>{tier.name}</span>
                <strong>{tier.budget}</strong>
              </button>
            ))}
          </div>

          {/* Tier Detail Showcase Box */}
          <div className="rf-ss-matrix-box">
            <div className="rf-ss-matrix-grid">
              <div className="rf-ss-matrix-left">
                <span className="rf-ss-matrix-kicker">SELECTED MILESTONE TIER</span>
                <h3 className="rf-ss-matrix-h3">{currentCalc.name}</h3>
                <p className="rf-ss-matrix-desc">{currentCalc.desc}</p>

                <div className="rf-ss-matrix-specs">
                  <div className="rf-ss-spec-item">
                    <Clock size={16} color="var(--ss-accent)" />
                    <span>Turnaround: <strong>{currentCalc.time} to Vetted Dossier</strong></span>
                  </div>
                  <div className="rf-ss-spec-item">
                    <ShieldCheck size={16} color="var(--ss-accent)" />
                    <span>Escrow Status: <strong>100% Platform Protected</strong></span>
                  </div>
                  <div className="rf-ss-spec-item">
                    <Award size={16} color="var(--ss-accent)" />
                    <span>Curated Candidates: <strong>3 Peer-Vetted Leads</strong></span>
                  </div>
                </div>
              </div>

              <div className="rf-ss-matrix-right">
                <div className="rf-ss-reward-breakdown-card">
                  <div className="rf-ss-rb-row">
                    <span>Total Client Project Budget</span>
                    <strong>{currentCalc.budget} USD</strong>
                  </div>
                  <div className="rf-ss-rb-row">
                    <span>Talent Milestone Net Payout</span>
                    <strong>${(currentCalc.num * 0.9).toLocaleString()} USD</strong>
                  </div>
                  <div className="rf-ss-rb-divider" />
                  <div className="rf-ss-rb-highlight">
                    <div>
                      <span className="rf-ss-rb-tag">SCOUT LOCKED COMMISSION</span>
                      <div className="rf-ss-rb-val">{currentCalc.scoutEarn} USD</div>
                    </div>
                    <div className="rf-ss-rb-rate">10% Cash</div>
                  </div>
                  <p className="rf-ss-rb-note">
                    Paid directly to the scout upon deliverable acceptance. $0 client surcharge fee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MEET AFRICA'S TOP SCOUTS ============ */}
      <section className="rf-ss-scouts-section">
        <div className="rf-ss-container">
          <div className="rf-ss-section-header">
            <div className="rf-ss-section-eyebrow">
              <span className="rf-ss-badge-dot" />
              <span>Elite Talent Curators</span>
            </div>
            <h2 className="rf-ss-section-title">Curated by Senior Domain Practitioners</h2>
            <p className="rf-ss-section-sub">
              Refeir scouts are active engineers, curators, and agency leaders across 54 African countries who personally evaluate capability before recommending talent.
            </p>
          </div>

          {/* Track Switcher */}
          <div className="rf-ss-track-pills">
            {TRACKS.map(t => {
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`rf-ss-track-btn ${trackId === t.id ? 'is-active' : ''}`}
                  onClick={() => {
                    setTrackId(t.id);
                    setSelectedScoutIndex(0);
                  }}
                >
                  <IconComp size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scouts Grid */}
          <div className="rf-ss-scouts-grid">
            {currentTrack.scouts.map((scout, idx) => (
              <div
                key={scout.id}
                className={`rf-ss-scout-card ${selectedScoutIndex === idx ? 'is-selected' : ''}`}
                onClick={() => setSelectedScoutIndex(idx)}
              >
                <div className="rf-ss-scout-card-head">
                  <div className="rf-ss-scout-avatar-wrap">
                    <img src={scout.avatar} alt={scout.name} className="rf-ss-scout-avatar-img" />
                    <span className="rf-ss-scout-flag">{scout.flag}</span>
                  </div>
                  <div className="rf-ss-scout-meta">
                    <div className="rf-ss-scout-card-name">{scout.name}</div>
                    <div className="rf-ss-scout-tier-badge">{scout.tier}</div>
                    <div className="rf-ss-scout-country">{scout.country}</div>
                  </div>
                  <div className="rf-ss-scout-rating-badge">
                    <Star size={12} fill="var(--ss-accent)" color="var(--ss-accent)" />
                    <span>{scout.rating}</span>
                  </div>
                </div>

                <p className="rf-ss-scout-headline">{scout.headline}</p>

                <div className="rf-ss-scout-stats-row">
                  <div>
                    <strong>{scout.hires}+</strong>
                    <span>Vetted Matches</span>
                  </div>
                  <div className="rf-ss-stat-sep" />
                  <div>
                    <strong>{scout.turnaround}</strong>
                    <span>Dossier Speed</span>
                  </div>
                </div>

                <div className="rf-ss-scout-snippet-box">
                  <p>"{scout.dossierSnippet}"</p>
                </div>

                <div className="rf-ss-scout-tags">
                  {scout.specialties.map(spec => (
                    <span key={spec} className="rf-ss-scout-tag">{spec}</span>
                  ))}
                </div>

                <button
                  type="button"
                  className="rf-ss-scout-select-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedScoutIndex(idx);
                    scrollToId('registration-station');
                  }}
                >
                  <span>Select Scout {scout.name.split(' ')[0]} for Brief</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST VAULT ESCROW INTEGRITY ============ */}
      <section className="rf-ss-vault-section">
        <div className="rf-ss-container">
          <div className="rf-ss-vault-banner">
            <div className="rf-ss-vault-grid">
              <div>
                <div className="rf-ss-vault-badge">
                  <Lock size={15} color="var(--ss-accent)" />
                  <span>Refeir Trust Vault Guarantee</span>
                </div>
                <h2 className="rf-ss-vault-h2">
                  Dual Protection for Scouts and Founders
                </h2>
                <p className="rf-ss-vault-lead">
                  We eliminated the friction of freelance outsourcing. Funds remain locked in sovereign escrow until work is delivered and verified, with full protection for both parties.
                </p>

                <div className="rf-ss-vault-pillars">
                  <div className="rf-ss-vp-item">
                    <CheckCircle2 size={18} color="var(--ss-accent)" />
                    <div>
                      <strong>100% Upfront Milestone Lock</strong>
                      <p>Clients deposit funds before kickoff. Scouts and talent know payments are guaranteed.</p>
                    </div>
                  </div>

                  <div className="rf-ss-vp-item">
                    <CheckCircle2 size={18} color="var(--ss-accent)" />
                    <div>
                      <strong>$0 Fee Platform Surcharge</strong>
                      <p>The 10% scout reward is absorbed within Refeir's platform fee. Zero surcharge for clients.</p>
                    </div>
                  </div>

                  <div className="rf-ss-vp-item">
                    <CheckCircle2 size={18} color="var(--ss-accent)" />
                    <div>
                      <strong>14-Day Free Replacement Guarantee</strong>
                      <p>If talent doesn't align with expectations within 14 days, your scout deploys an immediate replacement.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rf-ss-vault-card-side">
                <div className="rf-ss-vault-shield-box">
                  <ShieldCheck size={56} color="var(--ss-accent)" />
                  <div className="rf-ss-vs-title">100% Guaranteed Escrow</div>
                  <p className="rf-ss-vs-desc">
                    Every milestone is programmatically locked and automatically audited against agreed deliverables.
                  </p>
                  <div className="rf-ss-vs-pill">
                    <BadgeCheck size={14} />
                    <span>Verified Multi-Currency Escrow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQS ============ */}
      <section className="rf-ss-faq-section">
        <div className="rf-ss-container rf-ss-faq-container">
          <div className="rf-ss-section-header">
            <div className="rf-ss-section-eyebrow">
              <span className="rf-ss-badge-dot" />
              <span>Questions Answered</span>
            </div>
            <h2 className="rf-ss-section-title">Frequently Asked Questions</h2>
            <p className="rf-ss-section-sub">
              Everything you need to know about scouting, earning rewards, and hiring vetted African engineers.
            </p>
          </div>

          <div className="rf-ss-faq-list">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`rf-ss-faq-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="rf-ss-faq-trigger"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className="rf-ss-faq-arrow"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease'
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div className="rf-ss-faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ ACTION STATION / EMBEDDED REGISTRATION STATION ============ */}
      <section id="registration-station" className="rf-ss-register-section">
        <div className="rf-ss-container">
          <div className="rf-ss-register-box">
            <div className="rf-ss-register-grid">
              {/* Left: Registration Form Terminal */}
              <div className="rf-ss-reg-left">
                <div className="rf-ss-reg-badge">
                  <span className="rf-ss-badge-dot" />
                  <span>Fast 60-Second Onboarding</span>
                </div>

                <h2 className="rf-ss-reg-title">
                  {role === 'scout'
                    ? 'Start Earning 10% on Every Referral'
                    : 'Deploy Your Vetted Milestone Brief'}
                </h2>

                <p className="rf-ss-reg-sub">
                  {role === 'scout'
                    ? 'Connect founders with world-class engineers and earn locked 10% milestone rewards on every referral.'
                    : `Create your free account to connect with ${currentScout.name} and receive your curated talent dossier within 24 hours.`}
                </p>

                {/* Role Switcher inside registration */}
                <div className="rf-ss-reg-roles">
                  <button
                    type="button"
                    className={`rf-ss-reg-role-btn ${role === 'scout' ? 'is-active' : ''}`}
                    onClick={() => setRole('scout')}
                  >
                    <Compass size={16} />
                    <span>I want to be a Scout</span>
                  </button>

                  <button
                    type="button"
                    className={`rf-ss-reg-role-btn ${role === 'client' ? 'is-active' : ''}`}
                    onClick={() => setRole('client')}
                  >
                    <Briefcase size={16} />
                    <span>I want to hire talent</span>
                  </button>
                </div>

                <form onSubmit={handleRegisterSubmit} className="rf-ss-reg-form">
                  <div className="rf-ss-input-group">
                    <label className="rf-ss-input-label">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Adeleke"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      className="rf-ss-text-input"
                    />
                  </div>

                  <div className="rf-ss-input-group">
                    <label className="rf-ss-input-label">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="david@company.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="rf-ss-text-input"
                    />
                  </div>

                  <div className="rf-ss-input-group">
                    <label className="rf-ss-input-label">Primary Country</label>
                    <select
                      value={regCountry}
                      onChange={e => setRegCountry(e.target.value)}
                      className="rf-ss-select-input"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Egypt">Egypt</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Uganda">Uganda</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Other">Other International</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="rf-ss-submit-btn"
                  >
                    <span>
                      {role === 'scout'
                        ? 'Complete Free Scout Registration'
                        : `Deploy Brief with Scout ${currentScout.name.split(' ')[0]}`}
                    </span>
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="rf-ss-reg-guarantee-row">
                  <ShieldCheck size={16} color="var(--ss-accent)" />
                  <span>Free to join · No card required · Instant multi-currency wallet creation</span>
                </div>
              </div>

              {/* Right: Live Summary Brief Card */}
              <div className="rf-ss-reg-right">
                <div className="rf-ss-summary-card">
                  <div className="rf-ss-summary-head">
                    <span>{role === 'scout' ? 'Scout Profile Summary' : 'Active Sourcing Brief'}</span>
                    <span className="rf-ss-summary-status">Ready to deploy</span>
                  </div>

                  {role === 'scout' ? (
                    <>
                      <div className="rf-ss-summary-row">
                        <span>Network Track</span>
                        <strong>{currentTrack.label}</strong>
                      </div>
                      <div className="rf-ss-summary-row">
                        <span>Target Milestone Scope</span>
                        <strong>{currentCalc.name} ({currentCalc.budget})</strong>
                      </div>
                      <div className="rf-ss-summary-row">
                        <span>Guaranteed Commission</span>
                        <strong style={{ color: 'var(--ss-accent)' }}>10% of Milestone Value</strong>
                      </div>
                      <div className="rf-ss-summary-row">
                        <span>Estimated Payout</span>
                        <strong>{currentCalc.scoutEarn} – $3,500+</strong>
                      </div>
                      <div className="rf-ss-summary-row">
                        <span>Payout Rails</span>
                        <strong style={{ color: 'var(--ss-accent)' }}>Instant Multi-Currency Escrow</strong>
                      </div>

                      <div className="rf-ss-summary-team">
                        <div className="rf-ss-summary-avatars">
                          {TRACKS.flatMap(t => t.scouts.slice(0, 1)).map(s => (
                            <img key={s.id} src={s.avatar} alt={s.name} />
                          ))}
                        </div>
                        <span>Join 850+ active African tech matchmakers</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rf-ss-summary-row">
                        <span>Track & Budget</span>
                        <strong>{currentTrack.label} · {currentCalc.budget}</strong>
                      </div>
                      <div className="rf-ss-summary-row">
                        <span>Assigned Scout</span>
                        <strong>{currentScout.name} ({currentScout.country})</strong>
                      </div>
                      <div className="rf-ss-summary-row">
                        <span>Target Milestone Scope</span>
                        <strong>{currentCalc.name}</strong>
                      </div>
                      <div className="rf-ss-summary-row">
                        <span>Vetted Shortlist</span>
                        <strong>3 Specialists in &lt;24h</strong>
                      </div>
                      <div className="rf-ss-summary-row">
                        <span>Talent Guarantee</span>
                        <strong>14-Day Free Replacement</strong>
                      </div>
                      <div className="rf-ss-summary-row">
                        <span>Escrow Security</span>
                        <strong style={{ color: 'var(--ss-accent)' }}>100% Guaranteed ($0 Fee)</strong>
                      </div>

                      <div className="rf-ss-summary-team">
                        <div className="rf-ss-summary-avatars">
                          {currentTrack.scouts.map(s => (
                            <img key={s.id} src={s.avatar} alt={s.name} />
                          ))}
                        </div>
                        <span>{currentTrack.scouts.length} verified scouts available in {currentTrack.short}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
