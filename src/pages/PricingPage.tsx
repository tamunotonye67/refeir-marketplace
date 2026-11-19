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
  USD: { symbol: '$', rate: 1, label: 'USD' },
  NGN: { symbol: '₦', rate: 1550, label: 'NGN' },
  KES: { symbol: 'KSh ', rate: 130, label: 'KES' },
  GHS: { symbol: 'GH₵ ', rate: 15, label: 'GHS' }
};

const CORE_PLANS = [
  {
    key: 'client',
    name: 'Clients',
    tagline: 'Hire vetted talent with funds protected in escrow.',
    price: '5%',
    unit: 'marketplace fee per milestone',
    cta: 'Start hiring',
    path: '/marketplace',
    popular: false,
    features: [
      'Post projects for free',
      'Escrow-protected milestone payments',
      'Access to scout-vetted talent',
      'Pay in USD, NGN, KES or GHS'
    ]
  },
  {
    key: 'scout',
    name: 'Scouts',
    tagline: 'Refer great talent and earn on every milestone they deliver.',
    price: '0%',
    unit: 'platform fee on referral earnings',
    cta: 'Start referring',
    path: '/dashboard/scout',
    popular: true,
    features: [
      'Earn up to 10% of each milestone',
      'No fee on rates up to 10%',
      '2% Airfee on rates above 10% (waived with a token)',
      'Payouts released straight from escrow'
    ]
  },
  {
    key: 'talent',
    name: 'Talent',
    tagline: 'Find work through trusted referrals and get paid on time.',
    price: '10%',
    unit: 'scout commission on referred work',
    cta: 'Find work',
    path: '/dashboard/talent',
    popular: false,
    features: [
      'Free profile, no subscription required',
      'Guaranteed payment via escrow',
      'Keep 95% on direct proposals',
      'Local and cross-border payouts'
    ]
  }
];

const PRO_PLANS: { role: Role; name: string; usd: number; ngn: string; desc: string; popular: boolean; features: string[] }[] = [
  {
    role: 'SCOUT',
    name: 'Scout Pro',
    usd: 19,
    ngn: '₦25,000',
    desc: 'For active scouts growing a referral network.',
    popular: false,
    features: ['5 Airfee tokens every month', 'Priority referral review', 'Advanced earnings analytics']
  },
  {
    role: 'TALENT',
    name: 'Talent Pro',
    usd: 29,
    ngn: '₦38,000',
    desc: 'For professionals who want to stand out.',
    popular: true,
    features: ['Featured marketplace placement', 'Verified Pro badge', 'Search ranking boost', 'Refeir Desk dispatch priority']
  },
  {
    role: 'CLIENT',
    name: 'Refeir Desk Pro',
    usd: 49,
    ngn: '₦65,000',
    desc: 'For teams that hire regularly.',
    popular: false,
    features: ['Concierge matching in under 24h', 'Dedicated hiring partner', 'Zero dispute fees', 'NDA support']
  }
];

const CHANNELS: { key: Channel; label: string }[] = [
  { key: 'SCOUT', label: 'Scout referral' },
  { key: 'DIRECT', label: 'Direct hire' },
  { key: 'PROPOSAL', label: 'Talent proposal' }
];

const FAQS = [
  {
    q: 'How does a scout referral work?',
    a: 'On a $1,000 milestone the client pays $1,050 (including the 5% marketplace fee). The talent receives $900 and the scout who referred them earns $100, released from escrow when the milestone is approved.'
  },
  {
    q: 'What happens when a client hires talent directly?',
    a: 'On a $1,000 milestone the client pays $1,050. The talent receives $900 and Refeir keeps a 10% direct reach-out fee plus the 5% client fee.'
  },
  {
    q: 'What if talent wins work through their own proposal?',
    a: 'On a $1,000 milestone the client pays $1,050 and the talent keeps $950. Refeir charges 5% to each side.'
  },
  {
    q: 'When are funds released?',
    a: 'Clients fund each milestone up front. Money is held securely in escrow and released to the talent and scout as soon as the client approves the work.'
  },
  {
    q: 'Can I cancel a Pro plan?',
    a: 'Yes. Pro plans are billed monthly and you can cancel at any time from your dashboard. Core marketplace access is always free.'
  }
];

const PRESETS = [500, 1000, 2500, 5000, 10000];

const CORE_ICONS: Record<string, LucideIcon> = { client: Briefcase, scout: Compass, talent: Award };
const PRO_ICONS: Record<Role, LucideIcon> = { SCOUT: TrendingUp, TALENT: Award, CLIENT: Headphones };

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [showProModal, setShowProModal] = useState(false);
  const [proRole, setProRole] = useState<Role>('SCOUT');
  const [milestoneAmount, setMilestoneAmount] = useState<number>(1000);
  const [channel, setChannel] = useState<Channel>('SCOUT');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const openProModalForRole = (role: Role) => {
    setProRole(role);
    setShowProModal(true);
  };

  const formatCur = (valUsd: number) => {
    const cfg = CURRENCIES[currency];
    return `${cfg.symbol}${Math.round(valUsd * cfg.rate).toLocaleString()}`;
  };

  // Fee logic (Refeir transactional architecture)
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
    platformNote = '5% client + 10% direct reach-out';
  } else {
    talentPercent = 95;
    talentAmount = Math.round(milestoneAmount * 0.95);
    platformTotal = Math.round(milestoneAmount * 0.1);
    platformNote = '5% client + 5% talent';
  }

  return (
    <div className="rf-pr-page">
      {/* Hero */}
      <section className="rf-pr-hero">
        <div className="rf-pr-hero-bg" aria-hidden="true" />
        <div className="rf-pr-eyebrow">
          <ShieldCheck size={14} /> Pricing
        </div>
        <h1 className="rf-pr-title">
          Simple, <span className="rf-pr-title-accent">transparent</span> pricing
        </h1>
        <div className="rf-pr-subtitle">
          Join for free. Only pay when work gets done, with every milestone protected by escrow.
        </div>
        <div className="rf-pr-stats">
          <div><strong>$0</strong><span>to join</span></div>
          <div><strong>5%</strong><span>client fee</span></div>
          <div><strong>100%</strong><span>escrow protected</span></div>
        </div>
      </section>

      {/* Core plans */}
      <section className="rf-pr-section rf-pr-section-core">
        <div className="rf-pr-grid">
          {CORE_PLANS.map((plan, idx) => {
            const Icon = CORE_ICONS[plan.key];
            return (
              <div
                key={plan.key}
                className={`rf-pr-card rf-pr-rise${plan.popular ? ' is-featured' : ''}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="rf-pr-card-top">
                  <div className="rf-pr-icon"><Icon size={20} /></div>
                  {plan.popular && <div className="rf-pr-badge">Most popular</div>}
                </div>
                <h3 className="rf-pr-card-name">{plan.name}</h3>
                <div className="rf-pr-card-desc">{plan.tagline}</div>
                <div className="rf-pr-price">
                  <span className="rf-pr-price-value">{plan.price}</span>
                </div>
                <div className="rf-pr-price-unit">{plan.unit}</div>
                <button
                  type="button"
                  className={`rf-pr-btn${plan.popular ? ' is-primary' : ''}`}
                  onClick={() => onNavigate(plan.path)}
                >
                  {plan.cta} <ArrowRight size={16} />
                </button>
                <ul className="rf-pr-list">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="rf-pr-check"><Check size={12} strokeWidth={3} /></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="rf-pr-trust">
          <span><ShieldCheck size={16} /> Escrow protection</span>
          <span><Lock size={16} /> Secure payments</span>
          <span><Globe size={16} /> Pan-African payouts</span>
        </div>
      </section>

      {/* Pro plans */}
      <section className="rf-pr-section">
        <div className="rf-pr-section-head">
          <div className="rf-pr-kicker">Refeir Pro</div>
          <h2 className="rf-pr-h2">Upgrade when you're ready</h2>
          <div className="rf-pr-section-sub">Optional monthly plans for extra visibility and support.</div>
        </div>
        <div className="rf-pr-grid">
          {PRO_PLANS.map((plan, idx) => {
            const Icon = PRO_ICONS[plan.role];
            return (
              <div
                key={plan.role}
                className={`rf-pr-card rf-pr-rise${plan.popular ? ' is-popular' : ''}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="rf-pr-card-top">
                  <div className="rf-pr-icon"><Icon size={20} /></div>
                  {plan.popular && <div className="rf-pr-badge">Most popular</div>}
                </div>
                <h3 className="rf-pr-card-name">{plan.name}</h3>
                <div className="rf-pr-card-desc">{plan.desc}</div>
                <div className="rf-pr-price">
                  <span className="rf-pr-price-value">${plan.usd}</span>
                  <span className="rf-pr-price-period">/month</span>
                </div>
                <div className="rf-pr-price-unit">or {plan.ngn}/month</div>
                <button
                  type="button"
                  className={`rf-pr-btn${plan.popular ? ' is-primary' : ''}`}
                  onClick={() => openProModalForRole(plan.role)}
                >
                  Get {plan.name}
                </button>
                <ul className="rf-pr-list">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="rf-pr-check"><Check size={12} strokeWidth={3} /></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fee calculator */}
      <section className="rf-pr-section">
        <div className="rf-pr-section-head">
          <h2 className="rf-pr-h2">See exactly what you pay</h2>
          <div className="rf-pr-section-sub">Choose how the work was sourced and a milestone amount.</div>
        </div>

        <div className="rf-pr-calc">
          <div className="rf-pr-calc-inputs">
            <label className="rf-pr-label">How was the talent found?</label>
            <div className="rf-pr-segment" role="tablist">
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

            <div className="rf-pr-amount-row">
              <label className="rf-pr-label" htmlFor="rf-pr-amount">Milestone amount</label>
              <select
                className="rf-pr-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                aria-label="Currency"
              >
                {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                  <option key={c} value={c}>{CURRENCIES[c].label}</option>
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
              <span><i className="rf-pr-dot is-client" /> Client pays</span>
              <strong>{formatCur(clientTotal)}</strong>
            </div>
            <div className="rf-pr-row">
              <span><i className="rf-pr-dot is-talent" /> Talent receives <em>({talentPercent}%)</em></span>
              <strong className="rf-pr-green">{formatCur(talentAmount)}</strong>
            </div>
            <div className="rf-pr-row">
              <span><i className="rf-pr-dot is-scout" /> Scout earns {channel === 'SCOUT' && <em>(10%)</em>}</span>
              <strong>{scoutAmount > 0 ? formatCur(scoutAmount) : '—'}</strong>
            </div>
            <div className="rf-pr-row">
              <span><i className="rf-pr-dot is-fee" /> Refeir fee <em>({platformNote})</em></span>
              <strong>{formatCur(platformTotal)}</strong>
            </div>
            <div className="rf-pr-note">
              <ShieldCheck size={15} /> {formatCur(milestoneAmount)} held in escrow until approval
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rf-pr-section rf-pr-faq-wrap">
        <div className="rf-pr-section-head">
          <div className="rf-pr-kicker">FAQ</div>
          <h2 className="rf-pr-h2">Frequently asked questions</h2>
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

      {/* Bottom CTA */}
      <section className="rf-pr-section">
        <div className="rf-pr-cta-banner">
          <div>
            <h3>Hiring a full team or enterprise pod?</h3>
            <p>Get a dedicated shortlist of scout-vetted engineers in 48 hours with consolidated billing.</p>
          </div>
          <div className="rf-pr-cta-actions">
            <button type="button" className="rf-pr-cta-primary" onClick={() => onNavigate('/business')}>
              Explore Refeir Business <ArrowRight size={16} />
            </button>
            <button type="button" className="rf-pr-cta-ghost" onClick={() => onNavigate('/marketplace')}>
              Browse marketplace
            </button>
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
