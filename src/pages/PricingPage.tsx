import React, { useState } from 'react';
import { Check, ChevronDown, ArrowRight } from 'lucide-react';
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
    name: 'Clients',
    desc: 'Hire vetted talent with every milestone protected in escrow.',
    price: '5%',
    unit: 'marketplace fee per milestone',
    cta: 'Start hiring',
    path: '/marketplace',
    highlight: false,
    features: [
      'Post projects for free',
      'Escrow-protected milestone payments',
      'Curated referrals from verified scouts',
      'Pay in USD, NGN, KES, or GHS'
    ]
  },
  {
    key: 'scout',
    name: 'Scouts',
    desc: 'Refer skilled talent from your network and earn on every milestone.',
    price: '0%',
    unit: 'platform fee on standard referrals',
    cta: 'Start referring',
    path: '/dashboard/scout',
    highlight: true,
    features: [
      'Earn 10% on every milestone delivered',
      '0% fee on referral rates up to 10%',
      '2% Airfee on custom rates above 10% (waived with token)',
      'Automatic payout from escrow on approval'
    ]
  },
  {
    key: 'talent',
    name: 'Talent',
    desc: 'Win work through trusted referrals and get paid on time.',
    price: '10%',
    unit: 'scout commission on referred work',
    cta: 'Create profile',
    path: '/dashboard/talent',
    highlight: false,
    features: [
      'Free profile — no monthly subscription required',
      'Milestone funds locked in escrow before work starts',
      'Keep 95% on direct project proposals',
      'Fast local and cross-border withdrawals'
    ]
  }
];

const PRO_PLANS: {
  role: Role;
  name: string;
  usd: number;
  ngn: string;
  desc: string;
  highlight: boolean;
  features: string[];
}[] = [
  {
    role: 'SCOUT',
    name: 'Scout Pro',
    usd: 19,
    ngn: '₦25,000',
    desc: 'For active scouts growing a referral network.',
    highlight: false,
    features: [
      '5 Airfee waiver tokens per month',
      'Priority referral review',
      'Earnings & pipeline analytics'
    ]
  },
  {
    role: 'TALENT',
    name: 'Talent Pro',
    usd: 29,
    ngn: '₦38,000',
    desc: 'For professionals who want priority visibility.',
    highlight: true,
    features: [
      'Featured placement in search results',
      'Verified Pro badge on profile',
      'Higher ranking on enterprise briefs',
      'Refeir Desk dispatch priority'
    ]
  },
  {
    role: 'CLIENT',
    name: 'Refeir Desk Pro',
    usd: 49,
    ngn: '₦65,000',
    desc: 'For teams that hire regularly and want concierge matching.',
    highlight: false,
    features: [
      'Shortlist delivered in under 24 hours',
      'Dedicated hiring partner',
      'Zero dispute administration fees',
      'Custom NDA & IP workflow support'
    ]
  }
];

const CHANNELS: { key: Channel; label: string }[] = [
  { key: 'SCOUT', label: 'Scout referral' },
  { key: 'DIRECT', label: 'Direct hire' },
  { key: 'PROPOSAL', label: 'Talent proposal' }
];

const FAQS = [
  {
    q: 'How does a scout referral work on a $1,000 milestone?',
    a: 'The client funds $1,050 into escrow ($1,000 milestone + 5% marketplace fee). When the work is approved, the talent receives $900 and the referring scout earns $100.'
  },
  {
    q: 'What happens when a client hires talent directly?',
    a: 'On a $1,000 milestone, the client pays $1,050. The talent receives $900 on approval, and Refeir retains a 10% direct hire fee plus the 5% client fee.'
  },
  {
    q: 'What if talent wins work through their own proposal?',
    a: 'When talent applies directly to an open project and wins, they keep 95% of the milestone ($950 on a $1,000 milestone) while the client pays the standard 5% fee.'
  },
  {
    q: 'When are funds released from escrow?',
    a: 'Clients fund each milestone upfront. Money is held in escrow while work is in progress and released to the talent and scout as soon as the client approves the deliverable.'
  },
  {
    q: 'Do I need a Pro plan to use Refeir?',
    a: 'No. Joining, posting projects, referring talent, and winning work are free. Pro plans are optional monthly upgrades and can be canceled anytime.'
  }
];

const PRESETS = [500, 1000, 2500, 5000, 10000];

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

  const formatCur = (valUsd: number) => {
    const cfg = CURRENCIES[currency];
    return `${cfg.symbol}${Math.round(valUsd * cfg.rate).toLocaleString()}`;
  };

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
    platformNote = '5% client + 10% direct';
  } else {
    talentPercent = 95;
    talentAmount = Math.round(milestoneAmount * 0.95);
    platformTotal = Math.round(milestoneAmount * 0.1);
    platformNote = '5% client + 5% talent';
  }

  return (
    <div className="rf-pr-page">
      {/* Clean Split Hero */}
      <section className="rf-pr-hero">
        <div className="rf-pr-hero-text">
          <h1 className="rf-pr-title">Simple, transparent pricing</h1>
          <p className="rf-pr-subtitle">
            Free to join. No monthly retainers required. You only pay a small fee when milestones are funded and delivered through escrow.
          </p>
          <div className="rf-pr-hero-actions">
            <button
              type="button"
              className="rf-pr-btn is-primary"
              onClick={() => onNavigate('/marketplace')}
            >
              Get started
            </button>
            <button
              type="button"
              className="rf-pr-btn"
              onClick={() => {
                const el = document.getElementById('rf-pr-calculator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Estimate fees
            </button>
          </div>
        </div>

        <div className="rf-pr-hero-photo">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
            alt="Professionals collaborating in a workspace"
          />
        </div>
      </section>

      {/* Core Marketplace Plans */}
      <section className="rf-pr-section">
        <div className="rf-pr-head">
          <h2 className="rf-pr-h2">Core marketplace fees</h2>
          <p className="rf-pr-sub">Pay per milestone. Every project is protected by escrow.</p>
        </div>

        <div className="rf-pr-grid">
          {CORE_PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`rf-pr-card${plan.highlight ? ' is-highlight' : ''}`}
            >
              <div className="rf-pr-card-top">
                <h3 className="rf-pr-card-title">{plan.name}</h3>
                {plan.highlight && <span className="rf-pr-tag">Most popular</span>}
              </div>
              <p className="rf-pr-card-desc">{plan.desc}</p>

              <div className="rf-pr-price">
                <span className="rf-pr-price-num">{plan.price}</span>
                <span className="rf-pr-price-unit">{plan.unit}</span>
              </div>

              <button
                type="button"
                className={`rf-pr-btn is-full${plan.highlight ? ' is-primary' : ''}`}
                onClick={() => onNavigate(plan.path)}
              >
                {plan.cta}
              </button>

              <ul className="rf-pr-list">
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check size={16} strokeWidth={2.25} className="rf-pr-check" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Fee Calculator */}
      <section id="rf-pr-calculator" className="rf-pr-section">
        <div className="rf-pr-head">
          <h2 className="rf-pr-h2">Fee calculator</h2>
          <p className="rf-pr-sub">See the exact payout breakdown for any milestone.</p>
        </div>

        <div className="rf-pr-calc">
          <div className="rf-pr-calc-left">
            <label className="rf-pr-label">Hiring type</label>
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

            <div className="rf-pr-amount-head">
              <label className="rf-pr-label" htmlFor="rf-pr-range">
                Milestone amount
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

            <div className="rf-pr-amount-val">{formatCur(milestoneAmount)}</div>

            <input
              id="rf-pr-range"
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

          <div className="rf-pr-calc-right">
            <div className="rf-pr-row">
              <span>Client pays <em>(milestone + 5%)</em></span>
              <strong>{formatCur(clientTotal)}</strong>
            </div>
            <div className="rf-pr-row">
              <span>Talent receives <em>({talentPercent}%)</em></span>
              <strong className="is-green">{formatCur(talentAmount)}</strong>
            </div>
            <div className="rf-pr-row">
              <span>Scout earns {channel === 'SCOUT' && <em>(10%)</em>}</span>
              <strong>{scoutAmount > 0 ? formatCur(scoutAmount) : '—'}</strong>
            </div>
            <div className="rf-pr-row">
              <span>Refeir fee <em>({platformNote})</em></span>
              <strong>{formatCur(platformTotal)}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Optional Pro Plans */}
      <section className="rf-pr-section">
        <div className="rf-pr-head">
          <h2 className="rf-pr-h2">Optional Pro plans</h2>
          <p className="rf-pr-sub">Monthly upgrades for extra visibility and dedicated support. Cancel anytime.</p>
        </div>

        <div className="rf-pr-grid">
          {PRO_PLANS.map((plan) => (
            <div
              key={plan.role}
              className={`rf-pr-card${plan.highlight ? ' is-highlight' : ''}`}
            >
              <div className="rf-pr-card-top">
                <h3 className="rf-pr-card-title">{plan.name}</h3>
                {plan.highlight && <span className="rf-pr-tag">Recommended</span>}
              </div>
              <p className="rf-pr-card-desc">{plan.desc}</p>

              <div className="rf-pr-price">
                <div className="rf-pr-price-row">
                  <span className="rf-pr-price-num">${plan.usd}</span>
                  <span className="rf-pr-price-per">/month</span>
                </div>
                <span className="rf-pr-price-unit">or {plan.ngn}/month</span>
              </div>

              <button
                type="button"
                className={`rf-pr-btn is-full${plan.highlight ? ' is-primary' : ''}`}
                onClick={() => openProModalForRole(plan.role)}
              >
                Upgrade to {plan.name}
              </button>

              <ul className="rf-pr-list">
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check size={16} strokeWidth={2.25} className="rf-pr-check" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Split Card with Photo */}
      <section className="rf-pr-section">
        <div className="rf-pr-enterprise">
          <div className="rf-pr-enterprise-text">
            <h2 className="rf-pr-h2">Hiring a full team?</h2>
            <p className="rf-pr-sub">
              Refeir Business gives you scout-vetted shortlists in 48 hours, consolidated invoicing, and dedicated account management.
            </p>
            <div>
              <button
                type="button"
                className="rf-pr-btn is-primary"
                onClick={() => onNavigate('/business')}
              >
                Explore Refeir Business <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="rf-pr-enterprise-photo">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
              alt="Engineering team working together"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rf-pr-section">
        <div className="rf-pr-head">
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

      <RefeirProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        defaultRole={proRole}
      />
    </div>
  );
};

export default PricingPage;
