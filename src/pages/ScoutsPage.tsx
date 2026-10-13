import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Wallet,
  Zap,
  Lock,
  Globe,
  Award,
  Clock,
  ChevronDown,
  Layers,
  Star,
  Check
} from 'lucide-react';
import '../styles/scouts-program.css';

interface ScoutsPageProps {
  onNavigate?: (path: string) => void;
}

const BENCHMARKS = [
  {
    tier: 'Starter Sprint',
    name: 'Micro MVP & Security Audit',
    budget: '$1,500',
    reward: '$150',
    desc: 'Single-feature build, landing sprint, or smart contract verification.'
  },
  {
    tier: 'Core Milestone',
    name: 'Full-Stack Web or Mobile App',
    budget: '$5,000',
    reward: '$500',
    desc: 'Production-ready mobile MVP, cloud backend, or fintech API rollout.'
  },
  {
    tier: 'Quarterly Squad',
    name: 'Dedicated Engineering Squad',
    budget: '$12,000',
    reward: '$1,200',
    desc: 'Multi-month dedicated pod of 2 senior engineers and a designer.'
  },
  {
    tier: 'Enterprise Build',
    name: 'Pan-African Scale Architecture',
    budget: '$25,000',
    reward: '$2,500',
    desc: 'High-throughput payment rails, ISO compliance, and multi-region infra.'
  }
];

const SCOUT_TIERS = [
  {
    tier: 'Starter Scout',
    rate: '10%',
    req: '1 – 3 successful milestones',
    perks: [
      '30-day cookie attribution window',
      'Instant wallet crediting upon milestone signoff',
      'Standard multi-currency cashout rails'
    ]
  },
  {
    tier: 'Pro Scout',
    rate: '12%',
    req: '4 – 10 successful milestones',
    perks: [
      '90-day cookie attribution window',
      'Verified Scout badge on public profile',
      'Access to exclusive founder briefs'
    ]
  },
  {
    tier: 'Elite Scout',
    rate: '15%',
    req: '11 – 25 successful milestones',
    perks: [
      '180-day cookie attribution window',
      'Early access to enterprise client RFPs',
      'Direct WhatsApp pipeline with talent leads'
    ]
  },
  {
    tier: 'Principal Scout',
    rate: '18%',
    req: '25+ successful milestones',
    perks: [
      'Lifetime attribution on referred clients',
      'VIP zero-fee cross-border payouts',
      'Quarterly executive profit-share bonuses'
    ]
  }
];

const FAQS = [
  {
    q: 'Do I need to be a software engineer to become a Scout?',
    a: 'Not at all. While many scouts are tech leads, CTOs, and developers, successful scouts also include agency owners, community managers, venture associates, startup mentors, and ecosystem connectors who simply know great talent or have founder friends looking to hire.'
  },
  {
    q: 'How does Refeir ensure I actually get paid for my referrals?',
    a: 'Unlike informal referral arrangements, Refeir locks project milestones upfront in the Refeir Trust Vault escrow before work begins. When the client approves the completed deliverable, the platform smart escrow automatically and programmatically splits your 10% commission into your wallet.'
  },
  {
    q: 'Can I refer both freelancers and hiring clients?',
    a: 'Yes! You earn whenever a connection you facilitate reaches a funded milestone. Whether you introduce a founder with open headcount or recommend a brilliant freelancer into our marketplace, your scout attribution is tracked and rewarded.'
  },
  {
    q: 'How fast can I withdraw my earnings?',
    a: 'Immediately upon milestone approval. There is zero holding period. You can withdraw your earnings in USD or local African currencies (NGN, KES, GHS, ZAR, EGP) directly to bank accounts or local mobile money wallets (M-Pesa, MTN MoMo, etc.).'
  },
  {
    q: 'What does it cost to join as a Scout?',
    a: 'It is 100% free. There are no registration fees, monthly memberships, or hidden charges. The 10% scout reward is absorbed entirely within Refeir’s marketplace commission.'
  }
];

export const ScoutsPage: React.FC<ScoutsPageProps> = ({ onNavigate = () => {} }) => {
  const { currentUser, switchRole } = useAuth();
  const activeRole = currentUser?.active_role;

  // Live Simulator State
  const [hiresCount, setHiresCount] = useState<number>(3);
  const [avgBudget, setAvgBudget] = useState<number>(3500);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Quick Registration Form State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regCountry, setRegCountry] = useState<string>('Nigeria');
  const [regFocus, setRegFocus] = useState<string>('Engineering & Cloud');

  const estimatedMonthly = Math.round(hiresCount * avgBudget * 0.1);
  const estimatedAnnual = estimatedMonthly * 12;

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('/signup?role=SCOUT');
  };

  return (
    <div className="rf-scout-page">
      {/* Organic Ambient Glow */}
      <div className="rf-scout-ambient" aria-hidden="true" />

      {/* Talent Role Switch Notice (If authenticated as Talent) */}
      {activeRole === 'TALENT' && (
        <div style={{ background: 'rgba(102, 187, 42, 0.1)', borderBottom: '1px solid rgba(102, 187, 42, 0.25)', padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.86rem', color: 'var(--rf-cream)' }}>
          <span>You are currently in <strong>Talent Mode</strong>. Want to earn milestone rewards by referring your peers? </span>
          <button
            onClick={() => switchRole('SCOUT')}
            style={{ background: 'var(--scout-green)', color: 'var(--scout-ink)', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: 800, marginLeft: '0.5rem', cursor: 'pointer' }}
          >
            Switch to Scout Mode
          </button>
        </div>
      )}

      {/* ============ HERO SECTION ============ */}
      <section className="rf-scout-hero">
        <div className="rf-scout-container">
          <div className="rf-scout-hero-grid">
            {/* Left Content */}
            <div>
              <div className="rf-scout-eyebrow">
                <span className="rf-scout-dot" />
                <span>Refeir Scout Partner Network</span>
              </div>

              <h1 className="rf-scout-hero-h1">
                Monetize your network. Earn <span className="rf-scout-accent">locked 10%</span> milestone rewards.
              </h1>

              <p className="rf-scout-hero-p">
                Connect world-class African engineers, designers, and AI specialists with global founders. Every time a milestone completes in platform escrow, 10% is locked and paid straight into your multi-currency wallet.
              </p>

              {/* High-Impact Proof Metrics */}
              <div className="rf-scout-proof-bar">
                <div className="rf-scout-proof-col">
                  <div className="rf-scout-proof-val">$1.4M+</div>
                  <div className="rf-scout-proof-lbl">Rewards Paid to Date</div>
                </div>
                <div className="rf-scout-proof-div" />
                <div className="rf-scout-proof-col">
                  <div className="rf-scout-proof-val">10% – 18%</div>
                  <div className="rf-scout-proof-lbl">Milestone Cut</div>
                </div>
                <div className="rf-scout-proof-div" />
                <div className="rf-scout-proof-col">
                  <div className="rf-scout-proof-val">850+</div>
                  <div className="rf-scout-proof-lbl">Active Matchmakers</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="rf-scout-btn-group">
                <button
                  type="button"
                  className="rf-scout-btn rf-scout-btn-primary"
                  onClick={() => scrollToId('enroll-now')}
                >
                  <span>Enroll as a Scout (Free)</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  className="rf-scout-btn rf-scout-btn-secondary"
                  onClick={() => scrollToId('earnings-calc')}
                >
                  <TrendingUp size={16} />
                  <span>Calculate Earnings</span>
                </button>
              </div>

              <div className="rf-scout-hero-trust">
                <ShieldCheck size={16} color="var(--scout-green)" />
                <span>100% Escrow Guaranteed · Zero Capital Required · Instant Wallet Setup</span>
              </div>
            </div>

            {/* Right: Live Interactive Scout Revenue Console */}
            <div>
              <div className="rf-scout-wallet-card">
                <div className="rf-scout-card-head">
                  <div>
                    <span className="rf-scout-card-tag">SCOUT EARNINGS SIMULATOR</span>
                    <h3 className="rf-scout-card-title">Your Monthly Reward Potential</h3>
                  </div>
                  <div className="rf-scout-badge-fixed">
                    <TrendingUp size={14} />
                    <span>10% Fixed Cut</span>
                  </div>
                </div>

                <div className="rf-scout-big-display">
                  <div className="rf-scout-big-amount">${estimatedMonthly.toLocaleString()}</div>
                  <span className="rf-scout-big-sub">
                    ~${estimatedAnnual.toLocaleString()} USD/year projected at current pace
                  </span>
                </div>

                {/* Interactive Sliders */}
                <div className="rf-scout-sliders-group">
                  <div>
                    <div className="rf-scout-slider-head">
                      <span>Monthly Successful Placements</span>
                      <strong>{hiresCount} {hiresCount === 1 ? 'Talent' : 'Talents'}</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={hiresCount}
                      onChange={e => setHiresCount(Number(e.target.value))}
                      className="rf-scout-range"
                    />
                  </div>

                  <div>
                    <div className="rf-scout-slider-head">
                      <span>Average Project Milestone Value</span>
                      <strong>${avgBudget.toLocaleString()} USD</strong>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="10000"
                      step="500"
                      value={avgBudget}
                      onChange={e => setAvgBudget(Number(e.target.value))}
                      className="rf-scout-range"
                    />
                  </div>
                </div>

                <div className="rf-scout-payout-box">
                  <div className="rf-scout-payout-label">
                    <Globe size={13} />
                    <span>Multi-Currency Cashout</span>
                  </div>
                  <span className="rf-scout-payout-channels">USD · NGN · KES · GHS · ZAR · M-Pesa</span>
                </div>

                <button
                  type="button"
                  className="rf-scout-card-cta"
                  onClick={() => scrollToId('enroll-now')}
                >
                  <span>Start Referring & Earn →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE 3-STEP SCOUTING ENGINE ============ */}
      <section className="rf-scout-steps-sec">
        <div className="rf-scout-container">
          <div className="rf-scout-sec-head">
            <div className="rf-scout-eyebrow">
              <span className="rf-scout-dot" />
              <span>How It Works</span>
            </div>
            <h2 className="rf-scout-title">Three Steps from Network to Income</h2>
            <p className="rf-scout-sub">
              No invoicing, no contract drafting, and no chasing clients. Refeir handles compliance, escrow custody, and automated milestone splits.
            </p>
          </div>

          <div className="rf-scout-steps-grid">
            <div className="rf-scout-step-card">
              <div className="rf-scout-step-num">01</div>
              <div className="rf-scout-step-icon">
                <Compass size={24} color="var(--scout-green)" />
              </div>
              <h3 className="rf-scout-step-h3">Share or Introduce</h3>
              <p className="rf-scout-step-desc">
                Generate your personal Scout link or introduce verified peers directly to active marketplace milestone briefs.
              </p>
              <ul className="rf-scout-step-list">
                <li><Check size={14} color="var(--scout-green)" /> 30 to 180-day attribution window</li>
                <li><Check size={14} color="var(--scout-green)" /> Unique link telemetry & click analytics</li>
                <li><Check size={14} color="var(--scout-green)" /> Works on LinkedIn, WhatsApp, and Discord</li>
              </ul>
            </div>

            <div className="rf-scout-step-card">
              <div className="rf-scout-step-num">02</div>
              <div className="rf-scout-step-icon">
                <Lock size={24} color="var(--scout-green)" />
              </div>
              <h3 className="rf-scout-step-h3">Escrow Locks 10%</h3>
              <p className="rf-scout-step-desc">
                Clients deposit funds in the Refeir Trust Vault before work begins. Your 10% reward is programmatically locked upfront.
              </p>
              <ul className="rf-scout-step-list">
                <li><Check size={14} color="var(--scout-green)" /> 100% upfront milestone deposit</li>
                <li><Check size={14} color="var(--scout-green)" /> Zero risk of non-payment by client</li>
                <li><Check size={14} color="var(--scout-green)" /> Platform-absorbed; talent gets 100% net</li>
              </ul>
            </div>

            <div className="rf-scout-step-card">
              <div className="rf-scout-step-num">03</div>
              <div className="rf-scout-step-icon">
                <Wallet size={24} color="var(--scout-green)" />
              </div>
              <h3 className="rf-scout-step-h3">Instant Wallet Cashout</h3>
              <p className="rf-scout-step-desc">
                The instant the client approves the completed deliverable, your 10% reward is automatically deposited into your wallet.
              </p>
              <ul className="rf-scout-step-list">
                <li><Check size={14} color="var(--scout-green)" /> Instant disbursement with zero holding period</li>
                <li><Check size={14} color="var(--scout-green)" /> Cash out to African banks or Mobile Money</li>
                <li><Check size={14} color="var(--scout-green)" /> Full transaction history & tax receipts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHO EXCELS AS A SCOUT? ============ */}
      <section className="rf-scout-who-sec">
        <div className="rf-scout-container">
          <div className="rf-scout-sec-head">
            <div className="rf-scout-eyebrow">
              <span className="rf-scout-dot" />
              <span>Who Excels as a Scout?</span>
            </div>
            <h2 className="rf-scout-title">Built for Tech Leaders & Connectors</h2>
            <p className="rf-scout-sub">
              If people already ask you for freelance recommendations or job intros, Refeir turns that natural social capital into reliable income.
            </p>
          </div>

          <div className="rf-scout-who-grid">
            <div className="rf-scout-who-card">
              <div className="rf-scout-who-icon">
                <Users size={22} />
              </div>
              <h3 className="rf-scout-who-title">Tech Leads & CTOs</h3>
              <p className="rf-scout-who-desc">
                Monetize overflow client inquiries or recommend colleagues from previous squads into high-paying global remote roles.
              </p>
            </div>

            <div className="rf-scout-who-card">
              <div className="rf-scout-who-icon">
                <Globe size={22} />
              </div>
              <h3 className="rf-scout-who-title">Community & DevRel Leads</h3>
              <p className="rf-scout-who-desc">
                Run a developer WhatsApp group, Discord, or meetups? Your network and audience become a sustainable monthly revenue stream.
              </p>
            </div>

            <div className="rf-scout-who-card">
              <div className="rf-scout-who-icon">
                <Layers size={22} />
              </div>
              <h3 className="rf-scout-who-title">Agency Founders</h3>
              <p className="rf-scout-who-desc">
                Monetize prospective client leads that don’t fit your agency’s minimum retainer or core technology stack.
              </p>
            </div>

            <div className="rf-scout-who-card">
              <div className="rf-scout-who-icon">
                <Award size={22} />
              </div>
              <h3 className="rf-scout-who-title">Startup Mentors</h3>
              <p className="rf-scout-who-desc">
                Help your portfolio companies and founder friends source vetted African talent while generating passive milestone upside.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MILESTONE BENCHMARKS ============ */}
      <section id="earnings-calc" className="rf-scout-bench-sec">
        <div className="rf-scout-container">
          <div className="rf-scout-sec-head">
            <div className="rf-scout-eyebrow">
              <span className="rf-scout-dot" />
              <span>Real Milestone Examples</span>
            </div>
            <h2 className="rf-scout-title">What 10% Looks Like in Practice</h2>
            <p className="rf-scout-sub">
              Here are typical project milestones on Refeir and the exact cash rewards deposited into scout wallets upon completion.
            </p>
          </div>

          <div className="rf-scout-bench-grid">
            {BENCHMARKS.map(b => (
              <div key={b.name} className="rf-scout-bench-card">
                <span className="rf-scout-bench-tag">{b.tier}</span>
                <h3 className="rf-scout-bench-name">{b.name}</h3>
                <div className="rf-scout-bench-budget">{b.budget}</div>

                <div className="rf-scout-bench-reward-badge">
                  <span>Your 10% Reward:</span>
                  <strong>{b.reward} USD</strong>
                </div>

                <p className="rf-scout-bench-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROGRESSIVE SCOUT TIERS LADDER ============ */}
      <section className="rf-scout-ladder-sec">
        <div className="rf-scout-container">
          <div className="rf-scout-sec-head">
            <div className="rf-scout-eyebrow">
              <span className="rf-scout-dot" />
              <span>Career Progression</span>
            </div>
            <h2 className="rf-scout-title">The Refeir Scout Tier Ladder</h2>
            <p className="rf-scout-sub">
              As you facilitate more verified connections, your reward rate scales from 10% up to 18% with extended attribution windows.
            </p>
          </div>

          <div className="rf-scout-ladder-grid">
            {SCOUT_TIERS.map(t => (
              <div key={t.tier} className="rf-scout-ladder-card">
                <span className="rf-scout-ladder-tier">{t.tier}</span>
                <div className="rf-scout-ladder-cut">{t.rate}</div>
                <div className="rf-scout-ladder-sub">{t.req}</div>

                <ul className="rf-scout-ladder-perks">
                  {t.perks.map(p => (
                    <li key={p}>
                      <CheckCircle2 size={14} color="var(--scout-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST VAULT ESCROW INTEGRITY ============ */}
      <section className="rf-scout-vault-sec">
        <div className="rf-scout-container">
          <div className="rf-scout-vault-card">
            <div className="rf-scout-vault-grid">
              <div>
                <h2 className="rf-scout-vault-h2">
                  Never Chase An Invoice Again
                </h2>
                <p className="rf-scout-vault-lead">
                  Traditional offline referral commissions usually fail because clients forget, delay, or dispute. Refeir enforces your reward via programmatic escrow smart contracts.
                </p>

                <div className="rf-scout-vp-list">
                  <div className="rf-scout-vp-item">
                    <CheckCircle2 size={18} color="var(--scout-green)" />
                    <div>
                      <strong>100% Upfront Milestone Escrow</strong>
                      <p>Clients fund each milestone before work begins. Your 10% cut is locked in platform custody.</p>
                    </div>
                  </div>

                  <div className="rf-scout-vp-item">
                    <CheckCircle2 size={18} color="var(--scout-green)" />
                    <div>
                      <strong>Zero Platform Deduction</strong>
                      <p>Your 10% milestone reward is 100% yours. Refeir absorbs platform operational costs.</p>
                    </div>
                  </div>

                  <div className="rf-scout-vp-item">
                    <CheckCircle2 size={18} color="var(--scout-green)" />
                    <div>
                      <strong>Instant Multi-Currency Payouts</strong>
                      <p>Direct integration with African banking networks and mobile money (M-Pesa, MTN, Airtel).</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="rf-scout-shield-box">
                  <ShieldCheck size={56} color="var(--scout-green)" />
                  <div className="rf-scout-sb-title">100% Escrow Guarantee</div>
                  <p className="rf-scout-sb-desc">
                    Programmatic escrow ensures that once a deliverable is accepted, your cut moves directly into your wallet.
                  </p>
                  <div className="rf-scout-sb-pill">
                    <Check size={14} />
                    <span>Audited Escrow Rails</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQS ============ */}
      <section className="rf-scout-faq-sec">
        <div className="rf-scout-container rf-scout-faq-container">
          <div className="rf-scout-sec-head">
            <div className="rf-scout-eyebrow">
              <span className="rf-scout-dot" />
              <span>Common Questions</span>
            </div>
            <h2 className="rf-scout-title">Frequently Asked Questions</h2>
            <p className="rf-scout-sub">
              Everything you need to know about becoming a Scout, tracking referrals, and withdrawing commissions.
            </p>
          </div>

          <div className="rf-scout-faq-list">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.q} className={`rf-scout-faq-card ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="rf-scout-faq-btn"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className="rf-scout-faq-arrow"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div className="rf-scout-faq-ans">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ ACTION STATION / REGISTRATION TERMINAL ============ */}
      <section id="enroll-now" className="rf-scout-enroll-sec">
        <div className="rf-scout-container">
          <div className="rf-scout-enroll-box">
            <div className="rf-scout-enroll-grid">
              {/* Form */}
              <div>
                <div className="rf-scout-eyebrow">
                  <span className="rf-scout-dot" />
                  <span>Start Earning in 60 Seconds</span>
                </div>

                <h2 className="rf-scout-enroll-h2">
                  Enroll as a Refeir Scout
                </h2>

                <p className="rf-scout-enroll-lead">
                  Create your free account, generate your unique tracked link, and start earning locked 10% milestone rewards directly into your wallet.
                </p>

                <form onSubmit={handleEnrollSubmit} className="rf-scout-enroll-form">
                  <div className="rf-scout-input-grp">
                    <label className="rf-scout-input-lbl">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tunde Adebayo"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      className="rf-scout-input-fld"
                    />
                  </div>

                  <div className="rf-scout-input-grp">
                    <label className="rf-scout-input-lbl">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="tunde@company.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="rf-scout-input-fld"
                    />
                  </div>

                  <div className="rf-scout-input-grp">
                    <label className="rf-scout-input-lbl">Primary Country</label>
                    <select
                      value={regCountry}
                      onChange={e => setRegCountry(e.target.value)}
                      className="rf-scout-select-fld"
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

                  <div className="rf-scout-input-grp">
                    <label className="rf-scout-input-lbl">Primary Network Domain</label>
                    <select
                      value={regFocus}
                      onChange={e => setRegFocus(e.target.value)}
                      className="rf-scout-select-fld"
                    >
                      <option value="Engineering & Cloud">Engineering & Cloud Architecture</option>
                      <option value="Product & Brand Design">Product & UI/UX Design</option>
                      <option value="AI, Data & MLOps">AI, Machine Learning & Data</option>
                      <option value="Fintech & Mobile">Fintech & Mobile Systems</option>
                      <option value="General Tech Ecosystem">General Tech Ecosystem</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="rf-scout-submit-cta"
                  >
                    <span>Complete Free Scout Registration →</span>
                  </button>
                </form>

                <div className="rf-scout-enroll-trust">
                  <ShieldCheck size={16} color="var(--scout-green)" />
                  <span>100% Free to join · No card required · Instant multi-currency wallet setup</span>
                </div>
              </div>

              {/* Live Preview Summary Card */}
              <div>
                <div className="rf-scout-summary-box">
                  <div className="rf-scout-summary-top">
                    <span>Scout Partner Summary</span>
                    <span className="rf-scout-status-chip">Ready to Enroll</span>
                  </div>

                  <div className="rf-scout-summary-line">
                    <span>Program Tier</span>
                    <strong>Starter Scout (10% Base Cut)</strong>
                  </div>
                  <div className="rf-scout-summary-line">
                    <span>Target Network</span>
                    <strong>{regFocus}</strong>
                  </div>
                  <div className="rf-scout-summary-line">
                    <span>Attribution Window</span>
                    <strong>30 to 180 Days</strong>
                  </div>
                  <div className="rf-scout-summary-line">
                    <span>Escrow Protection</span>
                    <strong style={{ color: 'var(--scout-green)' }}>Refeir Trust Vault (100% Locked)</strong>
                  </div>
                  <div className="rf-scout-summary-line">
                    <span>Withdrawal Channels</span>
                    <strong>USD, NGN, KES, GHS, ZAR & Mobile Money</strong>
                  </div>
                  <div className="rf-scout-summary-line">
                    <span>Cost to Enroll</span>
                    <strong style={{ color: 'var(--scout-green)' }}>$0 Free Forever</strong>
                  </div>

                  <div className="rf-scout-community-proof">
                    <div className="rf-scout-avatars-row">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Scout" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Scout" />
                      <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80" alt="Scout" />
                      <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80" alt="Scout" />
                    </div>
                    <span>Join 850+ active African tech matchmakers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
