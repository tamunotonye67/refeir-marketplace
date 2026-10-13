import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Compass,
  Users,
  Check,
  Clock,
  ArrowRight,
  ChevronRight,
  Plus,
  Zap,
  DollarSign,
  CheckCircle2,
  Wallet,
  Star,
  Briefcase,
  Layers,
  Award,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import '../styles/scout-sourcing.css';

interface ScoutSourcingPageProps {
  onNavigate: (path: string) => void;
}

type ChapterId = 'scouts' | 'protocol' | 'compare' | 'protect' | 'start';

interface Chapter {
  id: ChapterId;
  label: string;
}

const CHAPTERS: Chapter[] = [
  { id: 'scouts', label: 'Scouts' },
  { id: 'protocol', label: 'Protocol' },
  { id: 'compare', label: 'Benchmarks' },
  { id: 'protect', label: 'Trust Vault' },
  { id: 'start', label: 'Get Started' }
];

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
    icon: Zap,
    description: 'Principal full-stack, distributed backend, DevOps, and mobile engineers with verified shipping track records.',
    scouts: [
      {
        id: 'amara-okafor',
        name: 'Amara Okafor',
        country: 'Nigeria',
        flag: 'NG',
        tier: 'Top 1% Scout',
        headline: 'Senior Pan-African Tech Scout & Ex-Andela Staff Connector',
        rating: 4.98,
        hires: 340,
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Shortlisted 3 Principal Engineers (Go, Rust & React) with Trust Vault milestone escrow protection.',
        specialties: ['Distributed Systems', 'Go / Rust', 'React Native', 'Fintech Infrastructure']
      },
      {
        id: 'kofi-boateng',
        name: 'Kofi Boateng',
        country: 'Ghana',
        flag: 'GH',
        tier: 'Elite Scout',
        headline: 'Software Engineering Director & West Africa Talent Matchmaker',
        rating: 4.94,
        hires: 280,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Deployed high-performance Node & AWS cloud squads for cross-border African banking platforms.',
        specialties: ['Cloud Architecture', 'AWS / Kubernetes', 'Node.js', 'System Scalability']
      }
    ]
  },
  {
    id: 'ai-data',
    label: 'AI & Data Intelligence',
    short: 'AI & ML',
    icon: Compass,
    description: 'Specialists in custom LLM fine-tuning, computer vision, data pipelines, and production MLOps.',
    scouts: [
      {
        id: 'tariq-benali',
        name: 'Tariq Benali',
        country: 'Morocco & Kenya',
        flag: 'MA',
        tier: 'Top 1% Scout',
        headline: 'Applied AI Researcher & North-East Africa ML Scout',
        rating: 4.97,
        hires: 195,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Curated 2 PhD-level Computer Vision & Speech AI engineers for agricultural IoT startup.',
        specialties: ['PyTorch', 'LLM Fine-tuning', 'Computer Vision', 'Edge Inference']
      },
      {
        id: 'dr-amina-diallo',
        name: 'Dr. Amina Diallo',
        country: 'Senegal & Rwanda',
        flag: 'SN',
        tier: 'Elite Scout',
        headline: 'Data Systems Strategist & Autonomous Intelligence Scout',
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
        id: 'esi-mensah',
        name: 'Esi Mensah',
        country: 'Ghana & UK',
        flag: 'GH',
        tier: 'Top 1% Scout',
        headline: 'Creative Director & Multi-Platform Brand Experience Scout',
        rating: 4.95,
        hires: 145,
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Provided 3 vetted brand identity and motion designers for global consumer launch.',
        specialties: ['Brand Identity', 'Motion Graphics', '3D Interactive', 'Art Direction']
      }
    ]
  },
  {
    id: 'growth',
    label: 'Fintech & Growth Strategy',
    short: 'Growth & Strategy',
    icon: Award,
    description: 'Ecosystem growth architects, regulatory payment specialists, and performance advisors.',
    scouts: [
      {
        id: 'sarah-adeyemi',
        name: 'Sarah Adeyemi',
        country: 'Nigeria',
        flag: 'NG',
        tier: 'Elite Scout',
        headline: 'Tech Ecosystem Connector & Venture Talent Scout',
        rating: 4.96,
        hires: 310,
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Connected US enterprise with cross-border payment integration and African compliance leads.',
        specialties: ['Payment Gateways', 'Regulatory Compliance', 'B2B Growth', 'Ecosystem Partnerships']
      },
      {
        id: 'thabo-nkosi',
        name: 'Thabo Nkosi',
        country: 'South Africa',
        flag: 'ZA',
        tier: 'Verified Scout',
        headline: 'Product Growth Advisor & Mobile Specialist Scout',
        rating: 4.93,
        hires: 185,
        avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=400&q=80',
        turnaround: '24h dossier turnaround',
        dossierSnippet: 'Shortlisted performance and user acquisition specialists who scaled apps across SADC.',
        specialties: ['Funnel Optimization', 'App Retention', 'Attribution Modeling', 'Paid Growth']
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
    q: 'Does hiring through a scout cost the client anything extra?',
    a: 'No. There is zero client surcharge. The 10% scout reward is completely absorbed within Refeir’s standard platform commission. You pay standard market rates for the talent, while benefiting from free peer vetting and curated shortlists.'
  },
  {
    q: 'How does Refeir Trust Vault escrow protect my funds?',
    a: 'Every agreed milestone deposit is locked securely in platform escrow before work begins. Funds only move when you review and explicitly click "Approve Deliverable". If any dispute arises, our impartial mediation team audits the deliverable against agreed milestones.'
  },
  {
    q: 'What happens if a recommended freelancer is not the right fit?',
    a: 'We offer an unconditional 14-day Free Replacement Guarantee. If the talent does not match your expectations within the first 14 days, your scout will immediately curate and deploy a replacement at no extra charge.'
  },
  {
    q: 'How do I become a Scout, and how are my 10% rewards paid?',
    a: 'Anyone with a verified professional network—tech leads, agency founders, community curators, or veteran freelancers—can apply as a Scout. When your referred talent or introduced client completes milestones, your 10% cash reward is automatically credited to your multi-currency wallet for instant withdrawal in USD or local African currency (M-Pesa, MTN Mobile Money, NGN, KES, GHS, ZAR).'
  },
  {
    q: 'Can I both hire talent via scouts and scout for others?',
    a: 'Yes. Refeir supports dual roles. Many founders and engineering leads use scouts to recruit specialist talent for their company, while also monetizing their own professional network by recommending colleagues into enterprise opportunities.'
  }
];

export const ScoutSourcingPage: React.FC<ScoutSourcingPageProps> = ({ onNavigate }) => {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('scouts');
  const [trackId, setTrackId] = useState<string>('engineering');
  const [selectedScoutIndex, setSelectedScoutIndex] = useState<number>(0);
  const [calcTierIndex, setCalcTierIndex] = useState<number>(1);
  const [role, setRole] = useState<'client' | 'scout'>('client');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [barsIn, setBarsIn] = useState(false);

  const compareRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

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

  const currentTrack = TRACKS.find(t => t.id === trackId) || TRACKS[0];
  const currentScout = currentTrack.scouts[selectedScoutIndex] || currentTrack.scouts[0];
  const currentCalc = CALC_TIERS[calcTierIndex];

  // Track active chapter for sticky rail
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id.replace('ss-', '') as ChapterId);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    CHAPTERS.forEach(c => {
      const el = document.getElementById(`ss-${c.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Trigger comparison bars animation when in viewport
  useEffect(() => {
    const el = compareRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setBarsIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: ChapterId) => {
    document.getElementById(`ss-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRegister = () => {
    if (role === 'client') {
      onNavigate(`/register?role=client&scout=${currentScout.id}&track=${currentTrack.id}`);
    } else {
      onNavigate('/register?role=scout');
    }
  };

  const NextButton: React.FC<{ to: ChapterId; label: string }> = ({ to, label }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
      <button
        type="button"
        className="rf-ss-btn rf-ss-btn-ghost"
        onClick={() => scrollTo(to)}
      >
        <span>Next: {label}</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );

  return (
    <div className="rf-ss">
      {/* ============ HERO SECTION ============ */}
      <section className="rf-ss-hero">
        <div className="rf-ss-hero-glow" />
        <div className="rf-ss-wrap">
          <div className="rf-ss-hero-grid">
            {/* Left Content */}
            <div>
              <div className="rf-ss-eyebrow">
                <span className="rf-ss-eyebrow-dot" />
                <span>Scout Sourcing Ecosystem</span>
              </div>

              <h1 className="rf-ss-h1">
                Let scouts find the right freelancer for you
              </h1>

              <div className="rf-ss-hero-bullets">
                <div className="rf-ss-bullet">
                  <div className="rf-ss-bullet-icon">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Work with scouts who reconnoiter our marketplace, source, and recommend talents for you</span>
                </div>

                <div className="rf-ss-bullet">
                  <div className="rf-ss-bullet-icon">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Get a report with clear recommendations</span>
                </div>

                <div className="rf-ss-bullet">
                  <div className="rf-ss-bullet-icon">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>Recruit recommended freelance talent with confidence</span>
                </div>
              </div>

              <div className="rf-ss-hero-actions">
                <button
                  type="button"
                  className="rf-ss-btn rf-ss-btn-primary"
                  onClick={() => scrollTo('scouts')}
                >
                  <span>Explore scout sourcing</span>
                  <ArrowRight size={18} />
                </button>

                <div className="rf-ss-guarantee">
                  <div className="rf-ss-guarantee-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <span>100% money back guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Interactive 3D Card Stack (Featured Dossier) */}
            <div className="rf-ss-hero-visual">
              <div className="rf-ss-visual-ambient" />
              <div className="rf-ss-card-stack">
                <div className="rf-ss-back-card" />
                <div className="rf-ss-front-card">
                  <div className="rf-ss-card-top">
                    <div className="rf-ss-scout-avatar-wrap">
                      <img src={currentScout.avatar} alt={currentScout.name} />
                      <span className="rf-ss-scout-verified-dot">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    </div>
                    <div className="rf-ss-card-meta">
                      <div className="rf-ss-scout-name-row">
                        <h4 className="rf-ss-scout-name">{currentScout.name} {currentScout.flag}</h4>
                        <span className="rf-ss-badge-tier">{currentScout.tier}</span>
                      </div>
                      <p className="rf-ss-scout-sub">{currentScout.headline}</p>
                      <div className="rf-ss-scout-stats-row">
                        <span className="rf-ss-rating-pill">
                          <Star size={13} fill="#d97706" color="#d97706" />
                          <strong>{currentScout.rating}</strong> Rating
                        </span>
                        <span>•</span>
                        <span><strong>{currentScout.hires}+</strong> Hires Recommended</span>
                      </div>
                    </div>
                  </div>

                  {/* Dossier Preview Box */}
                  <div className="rf-ss-dossier-box">
                    <div className="rf-ss-dossier-label-row">
                      <span className="rf-ss-dossier-tag">Active Sourcing Dossier</span>
                      <span className="rf-ss-dossier-eta">{currentScout.turnaround}</span>
                    </div>
                    <p className="rf-ss-dossier-quote">
                      "{currentScout.dossierSnippet}"
                    </p>
                  </div>

                  <div className="rf-ss-card-foot">
                    <div className="rf-ss-card-reward">
                      Reward: <strong>10% Guaranteed</strong>
                    </div>
                    <button
                      type="button"
                      className="rf-ss-hire-btn"
                      onClick={() => {
                        setSelectedScoutIndex(0);
                        scrollTo('start');
                      }}
                    >
                      <span className="rf-ss-hire-dot" />
                      <span>Hire via Scout {currentScout.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EXPLAINER VIDEO SECTION ============ */}
      <section className="rf-ss-video-section">
        <div className="rf-ss-wrap">
          <div className="rf-ss-video-head">
            <div className="rf-ss-eyebrow">
              <span className="rf-ss-eyebrow-dot" />
              <span>90-Second Overview</span>
            </div>
            <h2 className="rf-ss-h2">
              How Scout Sourcing Works
            </h2>
            <p className="rf-ss-lead" style={{ margin: '0 auto' }}>
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

              {/* Vertical Right-Side Video Controls (0 Transparency) */}
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
                    <Pause size={18} fill="currentColor" color="currentColor" strokeWidth={0} />
                  ) : (
                    <Play size={18} fill="currentColor" color="currentColor" strokeWidth={0} style={{ marginLeft: '2px' }} />
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
                  {isMuted ? <VolumeX size={18} strokeWidth={2.2} /> : <Volume2 size={18} strokeWidth={2.2} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STICKY JOURNEY RAIL ============ */}
      <div className="rf-ss-rail-holder" aria-label="Journey progress navigation">
        <nav className="rf-ss-rail">
          {CHAPTERS.map((c, i) => {
            const activeIdx = CHAPTERS.findIndex(x => x.id === activeChapter);
            const isDone = i < activeIdx;
            const isActive = c.id === activeChapter;
            return (
              <button
                key={c.id}
                type="button"
                className={`rf-ss-rail-btn${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
                onClick={() => scrollTo(c.id)}
              >
                <span className="rf-ss-rail-num">{i + 1}</span>
                <span className="rf-ss-rail-text">{c.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ============ 1. MEET THE SCOUTS ============ */}
      <section id="ss-scouts" className="rf-ss-chapter">
        <div className="rf-ss-wrap">
          <div className="rf-ss-chapter-head">
            <div>
              <span className="rf-ss-step-label">Step 1 of 5</span>
              <h2 className="rf-ss-h2">Curated by senior domain practitioners</h2>
              <p className="rf-ss-lead">
                Refeir scouts are active engineers, curators, and agency leaders across 54 African countries who personally evaluate capability before recommending talent.
              </p>
            </div>
          </div>

          {/* Track Tabs */}
          <div className="rf-ss-tracks" role="tablist">
            {TRACKS.map(t => {
              const Icon = t.icon;
              const isActive = t.id === trackId;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`rf-ss-track-btn${isActive ? ' is-active' : ''}`}
                  onClick={() => {
                    setTrackId(t.id);
                    setSelectedScoutIndex(0);
                  }}
                >
                  <span className="rf-ss-track-icon">
                    <Icon size={16} />
                  </span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scouts Grid for Selected Track */}
          <div className="rf-ss-scouts-grid">
            {currentTrack.scouts.map((s, idx) => {
              const isSelected = selectedScoutIndex === idx;
              return (
                <article
                  key={s.id}
                  className={`rf-ss-scout-card${isSelected ? ' is-selected' : ''}`}
                >
                  <div>
                    <div className="rf-ss-scout-header">
                      <div className="rf-ss-scout-pic">
                        <img src={s.avatar} alt={s.name} />
                      </div>
                      <div className="rf-ss-scout-info">
                        <div className="rf-ss-scout-name-title">
                          <h3>{s.name}</h3>
                          <span className="rf-ss-scout-country-pill">{s.country}</span>
                          <span className="rf-ss-badge-tier">{s.tier}</span>
                        </div>
                        <p className="rf-ss-scout-headline">{s.headline}</p>
                        <div className="rf-ss-scout-stat-tags">
                          <span>
                            <Star size={13} fill="#d97706" color="#d97706" style={{ display: 'inline', marginRight: 3, verticalAlign: -1 }} />
                            <strong>{s.rating}</strong> (50+ client reviews)
                          </span>
                          <span>•</span>
                          <span><strong>{s.hires}+</strong> Successful Hires</span>
                        </div>
                      </div>
                    </div>

                    {/* Sample Dossier Excerpt */}
                    <div className="rf-ss-card-dossier-sample">
                      <div className="rf-ss-sample-head">
                        <span>Verified Sourcing Track Record</span>
                        <span style={{ color: 'var(--rf-slate-300)', fontSize: '0.72rem' }}>{s.turnaround}</span>
                      </div>
                      <p className="rf-ss-sample-body">
                        "{s.dossierSnippet}"
                      </p>
                    </div>

                    {/* Skills pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {s.specialties.map(spec => (
                        <span key={spec} className="rf-ss-skill-pill">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rf-ss-scout-action-row">
                    <span className="rf-ss-match-badge">
                      <CheckCircle2 size={16} /> 100% Escrow Backed
                    </span>
                    <button
                      type="button"
                      className="rf-ss-btn rf-ss-btn-primary"
                      style={{ minHeight: '40px', padding: '0 1.25rem', fontSize: '0.86rem' }}
                      onClick={() => {
                        setSelectedScoutIndex(idx);
                        scrollTo('start');
                      }}
                    >
                      <span>Choose Scout & Brief</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <NextButton to="protocol" label="How the sourcing protocol works" />
        </div>
      </section>

      {/* ============ 2. SOURCING PROTOCOL ============ */}
      <section id="ss-protocol" className="rf-ss-chapter" style={{ paddingTop: 0 }}>
        <div className="rf-ss-wrap">
          <div className="rf-ss-chapter-head">
            <div>
              <span className="rf-ss-step-label">Step 2 of 5</span>
              <h2 className="rf-ss-h2">The 3-way high-trust sourcing loop</h2>
              <p className="rf-ss-lead">
                Built to eliminate the uncertainty of cold marketplace hiring while protecting both parties with Refeir Trust Vault escrow.
              </p>
            </div>
          </div>

          <div className="rf-ss-process">
            <div className="rf-ss-process-line" />

            <div className="rf-ss-step">
              <div className="rf-ss-step-num">01</div>
              <div className="rf-ss-step-card">
                <span className="rf-ss-step-time">
                  <Clock size={12} /> Under 5 minutes
                </span>
                <h3>Client Submits Scope</h3>
                <p>Define your project milestones, required stack, and estimated budget. There is zero upfront recruitment fee.</p>
              </div>
            </div>

            <div className="rf-ss-step">
              <div className="rf-ss-step-num">02</div>
              <div className="rf-ss-step-card">
                <span className="rf-ss-step-time">
                  <Clock size={12} /> Within 24 Hours
                </span>
                <h3>Scout Curates 3 Vetted Talents</h3>
                <p>Your scout evaluates portfolio code, GitHub commits, and previous platform client reviews to deliver a verified 3-talent dossier.</p>
              </div>
            </div>

            <div className="rf-ss-step">
              <div className="rf-ss-step-num">03</div>
              <div className="rf-ss-step-card">
                <span className="rf-ss-step-time">
                  <Clock size={12} /> Instant Kickoff
                </span>
                <h3>Deposit into Trust Vault</h3>
                <p>Select your favorite candidate and fund the first milestone. Money is locked securely in escrow before any work begins.</p>
              </div>
            </div>

            <div className="rf-ss-step">
              <div className="rf-ss-step-num">04</div>
              <div className="rf-ss-step-card">
                <span className="rf-ss-step-time">
                  <Clock size={12} /> Deliver & Approve
                </span>
                <h3>Release & Automated 10%</h3>
                <p>When deliverables are approved, funds release to talent. The scout’s 10% reward is paid automatically from platform commission.</p>
              </div>
            </div>
          </div>

          <NextButton to="compare" label="Speed & cost benchmarks" />
        </div>
      </section>

      {/* ============ 3. COMPARISON & BENCHMARKS ============ */}
      <section id="ss-compare" className="rf-ss-chapter" style={{ paddingTop: 0 }}>
        <div className="rf-ss-wrap">
          <div className="rf-ss-chapter-head">
            <div>
              <span className="rf-ss-step-label">Step 3 of 5</span>
              <h2 className="rf-ss-h2">10x faster than agencies, zero extra fee</h2>
              <p className="rf-ss-lead">
                Traditional headhunters charge 20–30% placement markups and take weeks. Refeir scouts deliver peer-vetted dossiers in 24 hours at 0% client surcharge.
              </p>
            </div>
          </div>

          {/* Benchmark comparison visual */}
          <div className="rf-ss-compare" ref={compareRef}>
            <div className="rf-ss-compare-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--rf-cream)' }}>
                Average Turnaround to Vetted Shortlist
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--rf-slate-300)', margin: 0 }}>
                Comparing traditional recruitment agency timelines against Refeir peer scout curation.
              </p>
            </div>

            <div className="rf-ss-compare-row">
              <div className="rf-ss-compare-label">
                Traditional Agency
                <strong>21 Business Days</strong>
              </div>
              <div className="rf-ss-bar-track">
                <div
                  className="rf-ss-bar rf-ss-bar-old"
                  style={{ width: barsIn ? '100%' : '0%' }}
                >
                  3–4 weeks vetting & contract negotiation
                </div>
              </div>
            </div>

            <div className="rf-ss-compare-row">
              <div className="rf-ss-compare-label">
                Refeir Scout Sourcing
                <strong>24 Hours Average</strong>
              </div>
              <div className="rf-ss-bar-track">
                <div
                  className="rf-ss-bar rf-ss-bar-scout"
                  style={{ width: barsIn ? '22%' : '0%' }}
                >
                  Curated 3-talent dossier ready in 24h
                </div>
              </div>
            </div>

            <div className="rf-ss-compare-foot">
              <span>Client Surcharge: <strong>$0 (0% added fee)</strong></span>
              <span>Placement Markup: <strong>Zero</strong> (Absorbed by platform)</span>
              <span>Escrow Security: <strong>100% Guaranteed</strong></span>
            </div>
          </div>

          {/* Milestone Escrow & Scout Reward Calculator */}
          <div className="rf-ss-calc">
            <div className="rf-ss-calc-head">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.35rem', color: 'var(--rf-cream)' }}>
                  Interactive Project Tier Calculator
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--rf-slate-300)', margin: 0 }}>
                  Select a typical project scope to view the escrow protection budget and scout commission breakdown.
                </p>
              </div>
              <span className="rf-ss-badge-tier" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
                100% Escrow Backed
              </span>
            </div>

            <div className="rf-ss-calc-tiers">
              {CALC_TIERS.map((tier, i) => (
                <button
                  key={tier.name}
                  type="button"
                  className={`rf-ss-calc-tier${calcTierIndex === i ? ' is-selected' : ''}`}
                  onClick={() => setCalcTierIndex(i)}
                >
                  <p className="rf-ss-tier-title">{tier.name}</p>
                  <div className="rf-ss-tier-budget">{tier.budget}</div>
                  <div className="rf-ss-tier-reward">
                    Scout Earns: {tier.scoutEarn} (10%)
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--rf-slate-300)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                    {tier.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <NextButton to="protect" label="Trust Vault Escrow protection" />
        </div>
      </section>

      {/* ============ 4. PROTECTION & FAQS ============ */}
      <section id="ss-protect" className="rf-ss-chapter" style={{ paddingTop: 0 }}>
        <div className="rf-ss-wrap">
          <div className="rf-ss-chapter-head">
            <div>
              <span className="rf-ss-step-label">Step 4 of 5</span>
              <h2 className="rf-ss-h2">100% protection for both client and scout</h2>
              <p className="rf-ss-lead">
                Refeir Trust Vault escrow holds all project milestone payments securely. Money only moves when work is verified and approved.
              </p>
            </div>
          </div>

          {/* 3 Protection pillars */}
          <div className="rf-ss-escrow">
            <div className="rf-ss-escrow-step">
              <div className="rf-ss-escrow-icon">
                <Wallet size={24} />
              </div>
              <h3>1. Milestone Lock in Vault</h3>
              <p>Client funds are safeguarded in multi-currency escrow. The freelancer starts work knowing funds are reserved and guaranteed.</p>
            </div>

            <div className="rf-ss-escrow-step">
              <div className="rf-ss-escrow-icon">
                <Compass size={24} />
              </div>
              <h3>2. 14-Day Free Replacement</h3>
              <p>If a recommended freelancer doesn't fit your team chemistry in the first 14 days, your scout curates a priority replacement at no cost.</p>
            </div>

            <div className="rf-ss-escrow-step">
              <div className="rf-ss-escrow-icon">
                <ShieldCheck size={24} />
              </div>
              <h3>3. Impartial Deliverable Audit</h3>
              <p>In case of any deliverable scope disagreement, Refeir Vault Mediation audits the code and deliverables against the brief before release.</p>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="rf-ss-faq">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className={`rf-ss-faq-item${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="rf-ss-faq-q"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{f.q}</span>
                    <Plus size={18} />
                  </button>
                  <div className="rf-ss-faq-a">
                    <div>
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <NextButton to="start" label="Take action & deploy brief" />
        </div>
      </section>

      {/* ============ 5. GET STARTED (ACTION STATION) ============ */}
      <section id="ss-start" className="rf-ss-chapter" style={{ paddingTop: 0 }}>
        <div className="rf-ss-wrap">
          <div className="rf-ss-start">
            <div className="rf-ss-start-blob" />
            <div className="rf-ss-start-grid">
              {/* Left Action Configurator */}
              <div>
                <span className="rf-ss-step-label">Step 5 of 5</span>
                <h2 className="rf-ss-h2">
                  {role === 'client' ? 'Deploy your sourcing brief' : 'Earn from 10% upward'}
                </h2>
                <p className="rf-ss-lead">
                  {role === 'client'
                    ? `Create your free account to connect with ${currentScout.name} and receive your curated talent dossier within 24 hours.`
                    : 'Connect founders with world-class engineers and earn locked 10% milestone rewards on every referral'}
                </p>

                {/* Role Switcher */}
                <div className="rf-ss-roles" role="radiogroup" aria-label="I am joining as">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={role === 'client'}
                    className={`rf-ss-role${role === 'client' ? ' is-selected' : ''}`}
                    onClick={() => setRole('client')}
                  >
                    <div className="rf-ss-role-icon">
                      <Briefcase size={18} />
                    </div>
                    <strong>I want to hire talent</strong>
                    <span>Get curated talent recommendations from verified scouts</span>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={role === 'scout'}
                    className={`rf-ss-role${role === 'scout' ? ' is-selected' : ''}`}
                    onClick={() => setRole('scout')}
                  >
                    <div className="rf-ss-role-icon">
                      <Compass size={18} />
                    </div>
                    <strong>I want to become a scout</strong>
                    <span>Monetize your network with guaranteed 10% escrow rewards</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="rf-ss-btn rf-ss-btn-primary"
                  onClick={handleRegister}
                  style={{ width: '100%', maxWidth: '380px' }}
                >
                  <span>
                    {role === 'client' ? `Deploy brief with Scout ${currentScout.name.split(' ')[0]}` : 'Apply as a Scout (Free)'}
                  </span>
                  <ArrowRight size={18} />
                </button>

                <p className="rf-ss-fineprint">
                  <ShieldCheck size={16} /> Free to join · No card required · 100% Milestone Escrow Guarantee
                </p>
              </div>

              {/* Right Live Brief Summary */}
              <div className="rf-ss-brief">
                <div className="rf-ss-brief-head">
                  <span>{role === 'client' ? 'Active Sourcing Brief' : 'Scout Profile Summary'}</span>
                  <span className="rf-ss-brief-live">Ready to deploy</span>
                </div>

                {role === 'client' ? (
                  <>
                    <div className="rf-ss-brief-row">
                      <span>Track & Budget</span>
                      <strong>{currentTrack.label} · {currentCalc.budget}</strong>
                    </div>
                    <div className="rf-ss-brief-row">
                      <span>Assigned Scout</span>
                      <strong>{currentScout.name} ({currentScout.country})</strong>
                    </div>
                    <div className="rf-ss-brief-row">
                      <span>Target Milestone Scope</span>
                      <strong>{currentCalc.name}</strong>
                    </div>
                    <div className="rf-ss-brief-row">
                      <span>Vetted Shortlist</span>
                      <strong>3 Specialists in &lt;24h</strong>
                    </div>
                    <div className="rf-ss-brief-row">
                      <span>Talent Guarantee</span>
                      <strong>14-Day Free Replacement</strong>
                    </div>
                    <div className="rf-ss-brief-row">
                      <span>Escrow Security</span>
                      <strong style={{ color: 'var(--ss-accent)' }}>100% Guaranteed ($0 Fee)</strong>
                    </div>

                    <div className="rf-ss-brief-team">
                      <div className="rf-ss-avatars">
                        {currentTrack.scouts.map(s => (
                          <img key={s.id} src={s.avatar} alt={s.name} />
                        ))}
                      </div>
                      <span>{currentTrack.scouts.length} verified scouts available in {currentTrack.short}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rf-ss-brief-row">
                      <span>Network Track</span>
                      <strong>{currentTrack.label}</strong>
                    </div>
                    <div className="rf-ss-brief-row">
                      <span>Target Milestone Scope</span>
                      <strong>{currentCalc.name} ({currentCalc.budget})</strong>
                    </div>
                    <div className="rf-ss-brief-row">
                      <span>Guaranteed Commission</span>
                      <strong style={{ color: 'var(--ss-accent)' }}>10% of Milestone Value</strong>
                    </div>
                    <div className="rf-ss-brief-row">
                      <span>Estimated Payout</span>
                      <strong>{currentCalc.scoutEarn} – $3,500+</strong>
                    </div>

                    <div className="rf-ss-brief-row">
                      <span>Payout Rails</span>
                      <strong style={{ color: 'var(--ss-accent)' }}>Instant Multi-Currency Escrow</strong>
                    </div>

                    <div className="rf-ss-brief-team">
                      <div className="rf-ss-avatars">
                        {TRACKS.flatMap(t => t.scouts.slice(0, 1)).map(s => (
                          <img key={s.id} src={s.avatar} alt={s.name} />
                        ))}
                      </div>
                      <span>Join 850+ active African tech matchmakers</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
