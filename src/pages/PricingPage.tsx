import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ShieldCheck,
  Lock,
  Globe,
  Briefcase,
  Compass,
  Award,
  TrendingUp,
  Headphones,
  ArrowRight,
  type LucideIcon
} from 'lucide-react';
import { RefeirProModal } from '../components/common/RefeirProModal';
import '../styles/pricing.css';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

type Role = 'SCOUT' | 'TALENT' | 'CLIENT';
type Channel = 'SCOUT' | 'DIRECT' | 'PROPOSAL';
type Currency = 'USD' | 'NGN' | 'KES' | 'GHS';

const CURRENCIES: Record<Currency, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  NGN: { symbol: '₦', rate: 1550, label: 'NGN (₦)' },
  KES: { symbol: 'KSh ', rate: 130, label: 'KES (KSh)' },
  GHS: { symbol: 'GH₵ ', rate: 15, label: 'GHS (GH₵)' }
};

const CORE_PLANS = [
  {
    key: 'client',
    name: 'For Clients',
    roleTitle: 'Hire & Protect',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Client leadership reviewing project deliverables',
    tagline: 'Hire scout-vetted talent with every milestone protected in Trust Vault Escrow.',
    price: '5%',
    unit: 'marketplace fee per funded milestone',
    cta: 'Start hiring talent',
    path: '/marketplace',
    featured: false,
    features: [
      'Post projects and receive scout referrals for free',
      '100% escrow-protected milestone payments',
      'Curated shortlists from verified technical scouts',
      'Pay in USD, NGN, KES, or GHS with consolidated receipts'
    ]
  },
  {
    key: 'scout',
    name: 'For Scouts',
    roleTitle: 'Refer & Earn',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Tech scouts collaborating and endorsing senior engineers',
    tagline: 'Endorse great talent from your network and earn automatically on every milestone they ship.',
    price: '0%',
    unit: 'platform fee on standard referral commissions',
    cta: 'Start referring & earning',
    path: '/dashboard/scout',
    featured: true,
    features: [
      'Earn a 10% commission on every milestone delivered',
      '0% platform fee on referral rates up to 10%',
      '2% Airfee on custom rates above 10% (waived with token)',
      'Instant payout release straight from escrow upon approval'
    ]
  },
  {
    key: 'talent',
    name: 'For Talent',
    roleTitle: 'Deliver & Grow',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Senior African software engineer working in a modern studio',
    tagline: 'Win high-trust global work through peer referrals and get paid on time, every time.',
    price: '10%',
    unit: 'scout commission on referred projects',
    cta: 'Create talent profile',
    path: '/dashboard/talent',
    featured: false,
    features: [
      'Free verified profile — no monthly subscription required',
      'Guaranteed payout funded in escrow before work begins',
      'Keep 95% of milestone value on direct proposals',
      'Fast local and cross-border withdrawals in your currency'
    ]
  }
];

const PRO_PLANS: {
  role: Role;
  name: string;
  subtitle: string;
  usd: number;
  ngn: string;
  desc: string;
  featured: boolean;
  features: string[];
}[] = [
  {
    role: 'SCOUT',
    name: 'Scout Pro',
    subtitle: 'High-volume referral network',
    usd: 19,
    ngn: '₦25,000',
    desc: 'For active scouts scaling referral deal flow across borders.',
    featured: false,
    features: [
      '5 Airfee waiver tokens every month',
      'Priority referral verification & matching',
      'Advanced pipeline & earnings telemetry'
    ]
  },
  {
    role: 'TALENT',
    name: 'Talent Pro',
    subtitle: 'Maximum marketplace visibility',
    usd: 29,
    ngn: '₦38,000',
    desc: 'For senior professionals who want top placement and priority briefs.',
    featured: true,
    features: [
      'Featured placement at the top of search results',
      'Verified Pro badge on profile and proposals',
      'Algorithmic ranking boost for enterprise briefs',
      'Priority dispatch from the Refeir Concierge Desk'
    ]
  },
  {
    role: 'CLIENT',
    name: 'Refeir Desk Pro',
    subtitle: 'Managed concierge hiring',
    usd: 49,
    ngn: '₦65,000',
    desc: 'For teams that hire regularly and want white-glove shortlists.',
    featured: false,
    features: [
      'Dedicated concierge matching in under 24 hours',
      'Assigned technical hiring partner',
      'Zero dispute mediation administration fees',
      'Custom NDA & IP assignment workflow support'
    ]
  }
];

const CHANNELS: { key: Channel; label: string; summary: string }[] = [
  {
    key: 'SCOUT',
    label: 'Scout Referral',
    summary: 'Talent is introduced by a verified Refeir Scout who earns 10% from the milestone.'
  },
  {
    key: 'DIRECT',
    label: 'Direct Hire',
    summary: 'Client books talent directly from the marketplace without a scout referral.'
  },
  {
    key: 'PROPOSAL',
    label: 'Talent Proposal',
    summary: 'Talent applies directly to an open client project brief and keeps 95%.'
  }
];

const FAQS = [
  {
    q: 'How does a scout referral payout work on a $1,000 milestone?',
    a: 'The client funds $1,050 into Trust Vault Escrow ($1,000 milestone + 5% marketplace fee). When the client approves the delivered work, $900 is released to the talent, $100 is released to the referring scout, and Refeir retains the $50 client fee.'
  },
  {
    q: 'What happens when a client hires talent directly without a scout?',
    a: 'On a $1,000 milestone, the client funds $1,050. The talent receives $900 upon approval, and Refeir retains a 10% direct reach-out fee from the milestone plus the 5% client marketplace fee.'
  },
  {
    q: 'What if talent wins a contract through their own proposal?',
    a: 'When talent submits a proposal to an open project brief and wins the contract, they keep 95% of the milestone ($950 on a $1,000 milestone). The client pays the standard 5% fee ($1,050 total).'
  },
  {
    q: 'When are funds released from Trust Vault Escrow?',
    a: 'Clients fund each milestone before work starts. The money stays locked in Trust Vault Escrow while work is in progress and is disbursed to the talent and scout as soon as the client approves the deliverable.'
  },
  {
    q: 'Are Pro plans required to use Refeir?',
    a: 'No. Creating an account, hiring talent, referring candidates, and winning projects are free. Pro memberships are optional monthly upgrades that can be canceled anytime from your dashboard.'
  }
];

const PRESETS = [500, 1000, 2500, 5000, 10000];

const CORE_ICONS: Record<string, LucideIcon> = {
  client: Briefcase,
  scout: Compass,
  talent: Award
};

const PRO_ICONS: Record<Role, LucideIcon> = {
  SCOUT: TrendingUp,
  TALENT: Award,
  CLIENT: Headphones
};

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [showProModal, setShowProModal] = useState(false);
  const [proRole, setProRole] = useState<Role>('TALENT');
  const [milestoneAmount, setMilestoneAmount] = useState<number>(1000);
  const [channel, setChannel] = useState<Channel>('SCOUT');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const openProModalForRole = (role: Role) => {
    setProRole(role);
    setShowProModal(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const formatCur = (valUsd: number) => {
    const cfg = CURRENCIES[currency];
    return `${cfg.symbol}${Math.round(valUsd * cfg.rate).toLocaleString()}`;
  };

  // Transactional fee math
  const clientTotal = Math.round(milestoneAmount * 1.05);
  let scoutAmount = 0;
  let talentAmount = Math.round(milestoneAmount * 0.9);
  let talentPercent = 90;
  let platformTotal = Math.round(milestoneAmount * 0.05);
  let platformNote = '5% client fee';

  if (channel === 'SCOUT') {
    scoutAmount = Math.round(milestoneAmount * 0.1);
  } else if (channel === 'DIRECT') {
    platformTotal = Math.round(milestoneAmount * 0.15);
    platformNote = '5% client + 10% direct hire';
  } else {
    talentPercent = 95;
    talentAmount = Math.round(milestoneAmount * 0.95);
    platformTotal = Math.round(milestoneAmount * 0.1);
    platformNote = '5% client + 5% talent';
  }

  const activeChannelMeta = CHANNELS.find((c) => c.key === channel)!;

  return (
    <div className="rf-pr-page">
      {/* Split Editorial Hero with Photography */}
      <section className="rf-pr-hero-wrap">
        <div className="rf-pr-hero">
          <div className="rf-pr-hero-copy">
            <div className="rf-pr-overline">Pricing &amp; Escrow Architecture</div>
            <h1 className="rf-pr-title">
              Transparent pricing built for <span className="rf-pr-title-accent">high-trust</span> work
            </h1>
            <p className="rf-pr-subtitle">
              No sign-up fees or mandatory retainers. You only pay when milestones are funded and delivered through Trust Vault Escrow.
            </p>

            <div className="rf-pr-hero-actions">
              <button
                type="button"
                className="rf-pr-btn-primary"
                onClick={() => onNavigate('/marketplace')}
              >
                Explore marketplace <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="rf-pr-btn-secondary"
                onClick={() => scrollToSection('rf-pr-estimator')}
              >
                Estimate milestone fees
              </button>
            </div>

            <div className="rf-pr-metrics">
              <div className="rf-pr-metric">
                <strong>$0</strong>
                <span>To join &amp; post projects</span>
              </div>
              <div className="rf-pr-metric">
                <strong>5%</strong>
                <span>Client milestone fee</span>
              </div>
              <div className="rf-pr-metric">
                <strong>10%</strong>
                <span>Automatic scout reward</span>
              </div>
              <div className="rf-pr-metric">
                <strong>100%</strong>
                <span>Escrow-protected payouts</span>
              </div>
            </div>
          </div>

          <div className="rf-pr-hero-media">
            <div className="rf-pr-hero-frame">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Pan-African product team collaborating on a milestone release"
                className="rf-pr-hero-img"
              />
              <div className="rf-pr-hero-overlay-card">
                <div className="rf-pr-overlay-head">
                  <ShieldCheck size={16} />
                  <span>Sample $1,000 Scout-Referred Milestone</span>
                </div>
                <div className="rf-pr-overlay-grid">
                  <div>
                    <small>Client funds</small>
                    <strong>$1,050</strong>
                  </div>
                  <div>
                    <small>Talent receives</small>
                    <strong className="is-accent">$900</strong>
                  </div>
                  <div>
                    <small>Scout earns</small>
                    <strong>$100</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Marketplace Pricing — Photo Cards */}
      <section className="rf-pr-section">
        <div className="rf-pr-section-head">
          <div className="rf-pr-overline">Core Marketplace</div>
          <h2 className="rf-pr-h2">How fees work for every role</h2>
          <p className="rf-pr-section-sub">
            Every transaction is protected by Trust Vault Escrow from the moment a milestone is funded until final approval.
          </p>
        </div>

        <div className="rf-pr-grid">
          {CORE_PLANS.map((plan) => {
            const Icon = CORE_ICONS[plan.key];
            return (
              <article
                key={plan.key}
                className={`rf-pr-card${plan.featured ? ' is-featured' : ''}`}
              >
                <div className="rf-pr-card-media">
                  <img src={plan.image} alt={plan.imageAlt} loading="lazy" />
                  <div className="rf-pr-card-media-bar">
                    <span className="rf-pr-card-role">{plan.name}</span>
                    {plan.featured && <span className="rf-pr-card-flag">Most active</span>}
                  </div>
                </div>

                <div className="rf-pr-card-body">
                  <div className="rf-pr-card-head">
                    <div className="rf-pr-icon">
                      <Icon size={18} />
                    </div>
                    <h3 className="rf-pr-card-name">{plan.roleTitle}</h3>
                  </div>

                  <p className="rf-pr-card-desc">{plan.tagline}</p>

                  <div className="rf-pr-price-block">
                    <div className="rf-pr-price-value">{plan.price}</div>
                    <div className="rf-pr-price-unit">{plan.unit}</div>
                  </div>

                  <button
                    type="button"
                    className={plan.featured ? 'rf-pr-btn-primary rf-pr-btn-full' : 'rf-pr-btn-secondary rf-pr-btn-full'}
                    onClick={() => onNavigate(plan.path)}
                  >
                    {plan.cta} <ArrowRight size={15} />
                  </button>

                  <ul className="rf-pr-list">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Check size={16} strokeWidth={2.5} className="rf-pr-check" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <div className="rf-pr-trust-bar">
          <div>
            <ShieldCheck size={18} />
            <span><strong>Trust Vault Escrow</strong> locks funds until work is approved</span>
          </div>
          <div>
            <Lock size={18} />
            <span><strong>Guaranteed Scout Split</strong> automated on every release</span>
          </div>
          <div>
            <Globe size={18} />
            <span><strong>Multi-Currency Rails</strong> across USD, NGN, KES &amp; GHS</span>
          </div>
        </div>
      </section>

      {/* Interactive Fee & Escrow Estimator */}
      <section id="rf-pr-estimator" className="rf-pr-section">
        <div className="rf-pr-section-head">
          <div className="rf-pr-overline">Interactive Estimator</div>
          <h2 className="rf-pr-h2">Calculate your exact milestone breakdown</h2>
          <p className="rf-pr-section-sub">
            Switch between sourcing channels and currencies to see how every dollar is distributed.
          </p>
        </div>

        <div className="rf-pr-calc">
          <div className="rf-pr-calc-inputs">
            <div className="rf-pr-field-head">
              <label className="rf-pr-label">1. Select sourcing channel</label>
            </div>
            <div className="rf-pr-tabs" role="tablist">
              {CHANNELS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={channel === c.key}
                  className={channel === c.key ? 'is-active' : ''}
                  onClick={() => setChannel(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p className="rf-pr-channel-desc">{activeChannelMeta.summary}</p>

            <div className="rf-pr-amount-row">
              <label className="rf-pr-label" htmlFor="rf-pr-amount">
                2. Milestone value
              </label>
              <select
                className="rf-pr-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                aria-label="Currency"
              >
                {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                  <option key={c} value={c}>
                    {CURRENCIES[c].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rf-pr-amount">{formatCur(milestoneAmount)}</div>

            <input
              id="rf-pr-amount"
              type="range"
              min={200}
              max={10000}
              step={50}
              value={milestoneAmount}
              onChange={(e) => setMilestoneAmount(Number(e.target.value))}
              className="rf-pr-range"
            />

            <div className="rf-pr-presets">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={milestoneAmount === p ? 'is-active' : ''}
                  onClick={() => setMilestoneAmount(p)}
                >
                  {formatCur(p)}
                </button>
              ))}
            </div>
          </div>

          <div className="rf-pr-calc-result">
            <div className="rf-pr-result-head">
              <span>Escrow Ledger Breakdown</span>
              <strong>{activeChannelMeta.label}</strong>
            </div>

            <div className="rf-pr-bar" aria-hidden="true">
              <div
                className="rf-pr-bar-talent"
                style={{ width: `${(talentAmount / clientTotal) * 100}%` }}
              />
              {scoutAmount > 0 && (
                <div
                  className="rf-pr-bar-scout"
                  style={{ width: `${(scoutAmount / clientTotal) * 100}%` }}
                />
              )}
              <div
                className="rf-pr-bar-fee"
                style={{ width: `${(platformTotal / clientTotal) * 100}%` }}
              />
            </div>

            <div className="rf-pr-row">
              <span>
                <i className="rf-pr-dot is-client" /> Client funds into escrow <em>(+5% fee)</em>
              </span>
              <strong>{formatCur(clientTotal)}</strong>
            </div>
            <div className="rf-pr-row">
              <span>
                <i className="rf-pr-dot is-talent" /> Talent payout <em>({talentPercent}% of milestone)</em>
              </span>
              <strong className="rf-pr-green">{formatCur(talentAmount)}</strong>
            </div>
            <div className="rf-pr-row">
              <span>
                <i className="rf-pr-dot is-scout" /> Referring scout reward {channel === 'SCOUT' && <em>(10%)</em>}
              </span>
              <strong>{scoutAmount > 0 ? formatCur(scoutAmount) : '—'}</strong>
            </div>
            <div className="rf-pr-row">
              <span>
                <i className="rf-pr-dot is-fee" /> Refeir platform fee <em>({platformNote})</em>
              </span>
              <strong>{formatCur(platformTotal)}</strong>
            </div>

            <div className="rf-pr-note">
              <ShieldCheck size={16} />
              <span>
                <strong>{formatCur(milestoneAmount)}</strong> stays locked in Trust Vault Escrow until deliverable approval.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Refeir Pro — Optional Subscriptions */}
      <section className="rf-pr-section">
        <div className="rf-pr-pro-header">
          <div className="rf-pr-pro-copy">
            <div className="rf-pr-overline">Optional Membership Upgrades</div>
            <h2 className="rf-pr-h2 rf-pr-h2-left">Accelerate with Refeir Pro</h2>
            <p className="rf-pr-pro-sub">
              Core marketplace access is always free. Upgrade to a monthly Pro plan whenever you want priority placement, Airfee waiver tokens, or dedicated concierge sourcing.
            </p>
          </div>
          <div className="rf-pr-pro-spotlight">
            <img
              src="/african_woman_headset.jpg"
              alt="Refeir Concierge Desk Specialist"
              className="rf-pr-pro-avatar"
              loading="lazy"
            />
            <div>
              <strong>Refeir Concierge Desk</strong>
              <span>Included with Desk Pro &amp; priority talent dispatch</span>
            </div>
          </div>
        </div>

        <div className="rf-pr-grid">
          {PRO_PLANS.map((plan) => {
            const Icon = PRO_ICONS[plan.role];
            return (
              <article
                key={plan.role}
                className={`rf-pr-card rf-pr-pro-card${plan.featured ? ' is-featured' : ''}`}
              >
                <div className="rf-pr-card-body">
                  <div className="rf-pr-pro-top">
                    <div className="rf-pr-icon">
                      <Icon size={18} />
                    </div>
                    {plan.featured && <span className="rf-pr-pro-tag">Recommended</span>}
                  </div>

                  <h3 className="rf-pr-card-name">{plan.name}</h3>
                  <div className="rf-pr-pro-subtitle">{plan.subtitle}</div>
                  <p className="rf-pr-card-desc">{plan.desc}</p>

                  <div className="rf-pr-price-block">
                    <div className="rf-pr-price-line">
                      <span className="rf-pr-price-value">${plan.usd}</span>
                      <span className="rf-pr-price-period">/ month</span>
                    </div>
                    <div className="rf-pr-price-unit">or {plan.ngn} / month billed locally</div>
                  </div>

                  <button
                    type="button"
                    className={plan.featured ? 'rf-pr-btn-primary rf-pr-btn-full' : 'rf-pr-btn-secondary rf-pr-btn-full'}
                    onClick={() => openProModalForRole(plan.role)}
                  >
                    Upgrade to {plan.name} <ArrowRight size={15} />
                  </button>

                  <ul className="rf-pr-list">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Check size={16} strokeWidth={2.5} className="rf-pr-check" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="rf-pr-section">
        <div className="rf-pr-section-head">
          <div className="rf-pr-overline">Frequently Asked Questions</div>
          <h2 className="rf-pr-h2">Clear answers on fees and escrow</h2>
        </div>

        <div className="rf-pr-faq">
          {FAQS.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q} className={`rf-pr-faq-item${open ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="rf-pr-faq-q"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : i)}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className="rf-pr-faq-icon" />
                </button>
                {open && <div className="rf-pr-faq-a">{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Enterprise Visual CTA Banner */}
      <section className="rf-pr-section">
        <div className="rf-pr-cta-banner">
          <div className="rf-pr-cta-copy">
            <div className="rf-pr-overline is-light">Refeir for Business</div>
            <h3>Hiring a full engineering pod or enterprise team?</h3>
            <p>
              Get a scout-vetted shortlist in 48 hours, consolidated multi-currency invoicing, and enforceable IP assignment across 54 African countries.
            </p>
            <div className="rf-pr-cta-actions">
              <button
                type="button"
                className="rf-pr-cta-primary"
                onClick={() => onNavigate('/business')}
              >
                Explore Refeir Business <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="rf-pr-cta-ghost"
                onClick={() => onNavigate('/marketplace')}
              >
                Browse talent directory
              </button>
            </div>
          </div>
          <div className="rf-pr-cta-media">
            <img
              src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=900&q=80"
              alt="Enterprise engineering lead reviewing project roadmap"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <RefeirProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        defaultRole={proRole}
      />
    </div>
  );
};

export default PricingPage;
