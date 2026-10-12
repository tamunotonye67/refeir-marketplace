import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  Star,
  MapPin,
  BadgeCheck,
  Wallet,
  TrendingDown
} from 'lucide-react';
import { SEED_TALENT } from '../../data/seedTalent';
import { SUPPORTED_CURRENCIES } from '../../data/currencies';
import { TalentProfile } from '../../types';

/* ==========================================================================
   Types & static configuration
   ========================================================================== */

type CategoryId = 'engineering' | 'design' | 'ai' | 'marketing' | 'writing' | 'product';
type Level = 'entry' | 'mid' | 'senior';
type PricingModel = 'fixed' | 'hourly' | 'monthly';
type Timeline = 'week' | 'month' | 'quarter' | 'ongoing';
type Step = 1 | 2 | 3 | 4;

interface CategoryConfig {
  id: CategoryId;
  label: string;
  hourlyUsd: number; // typical mid-level hourly rate for verified African talent
  keywords: string[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'engineering',
    label: 'Software Engineering',
    hourlyUsd: 30,
    keywords: ['develop', 'developer', 'engineer', 'engineering', 'app', 'website', 'web', 'backend', 'frontend', 'api', 'react', 'node', 'node.js', 'mobile', 'software', 'code', 'full stack', 'fullstack', 'cloud', 'devops', 'go', 'postgresql', 'flutter']
  },
  {
    id: 'design',
    label: 'Design & Creative',
    hourlyUsd: 25,
    keywords: ['design', 'designer', 'ui', 'ux', 'ui/ux', 'logo', 'brand', 'branding', 'figma', 'illustration', 'graphic', 'video', 'animation', 'motion', 'product design']
  },
  {
    id: 'ai',
    label: 'AI & Data',
    hourlyUsd: 38,
    keywords: ['ai', 'machine learning', 'ml', 'data', 'analytics', 'llm', 'llms', 'chatbot', 'python', 'automation', 'data science', 'nlp']
  },
  {
    id: 'marketing',
    label: 'Marketing & Growth',
    hourlyUsd: 22,
    keywords: ['marketing', 'seo', 'social media', 'ads', 'growth', 'campaign', 'email', 'performance marketing']
  },
  {
    id: 'writing',
    label: 'Writing & Content',
    hourlyUsd: 18,
    keywords: ['write', 'writer', 'writing', 'copy', 'copywriting', 'article', 'blog', 'content', 'translation', 'editing']
  },
  {
    id: 'product',
    label: 'Product & Operations',
    hourlyUsd: 28,
    keywords: ['product manager', 'product management', 'operations', 'project manager', 'strategy', 'business', 'consulting', 'finance', 'accounting', 'agile', 'scrum']
  }
];

const LEVELS: { id: Level; label: string; hint: string; factor: number }[] = [
  { id: 'entry', label: 'Entry', hint: '0–2 years', factor: 0.55 },
  { id: 'mid', label: 'Intermediate', hint: '3–5 years', factor: 1 },
  { id: 'senior', label: 'Senior', hint: '6+ years', factor: 1.6 }
];

const MODELS: { id: PricingModel; label: string; suffix: string }[] = [
  { id: 'fixed', label: 'Fixed price', suffix: 'total' },
  { id: 'hourly', label: 'Hourly', suffix: '/ hr' },
  { id: 'monthly', label: 'Monthly', suffix: '/ month' }
];

const TIMELINES: { id: Timeline; label: string; hours: number }[] = [
  { id: 'week', label: 'Under 1 week', hours: 30 },
  { id: 'month', label: '2–4 weeks', hours: 100 },
  { id: 'quarter', label: '1–3 months', hours: 300 },
  { id: 'ongoing', label: 'Ongoing', hours: 160 }
];

const CURRENCY_OPTIONS = ['USD', 'NGN', 'GHS', 'KES', 'ZAR', 'GBP', 'EUR'];

const SERVICE_FEE_RATE = 0.05;
const AGENCY_MULTIPLIER = 2.5;
const MONTHLY_HOURS = 150;

/* ==========================================================================
   Helpers
   ========================================================================== */

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const scoreCategories = (text: string): Record<CategoryId, number> => {
  const scores = {} as Record<CategoryId, number>;
  const lower = text.toLowerCase();
  CATEGORIES.forEach(cat => {
    scores[cat.id] = cat.keywords.reduce((acc, kw) => {
      const re = new RegExp(`(^|[^a-z])${escapeRegex(kw)}([^a-z]|$)`, 'i');
      return acc + (re.test(lower) ? 1 : 0);
    }, 0);
  });
  return scores;
};

const detectCategory = (text: string): CategoryId => {
  const scores = scoreCategories(text);
  let best: CategoryId = 'engineering';
  let bestScore = 0;
  (Object.keys(scores) as CategoryId[]).forEach(id => {
    if (scores[id] > bestScore) {
      best = id;
      bestScore = scores[id];
    }
  });
  return best;
};

const usdRate = (currency: string) => SUPPORTED_CURRENCIES[currency]?.exchange_rate_to_usd || 1;

const formatAmount = (usd: number, currency: string): string => {
  const cfg = SUPPORTED_CURRENCIES[currency];
  const major = usd / usdRate(currency);
  const rounded = major >= 1000 ? Math.round(major / 10) * 10 : Math.round(major);
  const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(rounded);
  if (!cfg) return `${currency} ${num}`;
  return cfg.symbol_position === 'prefix' ? `${cfg.symbol}${num}` : `${num} ${cfg.symbol}`;
};

const unitsForModel = (model: PricingModel, timeline: Timeline): number => {
  if (model === 'hourly') return 1;
  if (model === 'monthly') return MONTHLY_HOURS;
  return TIMELINES.find(t => t.id === timeline)?.hours || 100;
};

const talentHourlyUsd = (t: TalentProfile, categoryId: CategoryId): number => {
  const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const expFactor = 0.5 + Math.min(t.experience_years, 12) * 0.1;
  const ratingFactor = 0.9 + Math.max(0, t.rating - 4.5) * 0.4;
  return cat.hourlyUsd * expFactor * ratingFactor;
};

interface MatchedTalent {
  talent: TalentProfile;
  priceUsd: number;
  withinBudget: boolean;
  overByPct: number;
  score: number;
  categoryMatch: boolean;
}

/* ==========================================================================
   Component
   ========================================================================== */

interface PricingMatchFlowProps {
  isOpen: boolean;
  initialBrief: string;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const PricingMatchFlow: React.FC<PricingMatchFlowProps> = ({ isOpen, initialBrief, onClose, onNavigate }) => {
  const [step, setStep] = useState<Step>(1);
  const [brief, setBrief] = useState(initialBrief);
  const [category, setCategory] = useState<CategoryId>(() => detectCategory(initialBrief));
  const [level, setLevel] = useState<Level>('mid');
  const [model, setModel] = useState<PricingModel>('fixed');
  const [timeline, setTimeline] = useState<Timeline>('month');
  const [currency, setCurrency] = useState('USD');
  const [budgetInput, setBudgetInput] = useState('');
  const [analysisPhase, setAnalysisPhase] = useState(0);

  // Reset when reopened with a new brief
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBrief(initialBrief);
      setCategory(detectCategory(initialBrief));
      setAnalysisPhase(0);
    }
  }, [isOpen, initialBrief]);

  // Lock page scroll while open, close on Escape
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // Analysis sequence
  useEffect(() => {
    if (step !== 3) return;
    setAnalysisPhase(0);
    const timers = [
      setTimeout(() => setAnalysisPhase(1), 550),
      setTimeout(() => setAnalysisPhase(2), 1100),
      setTimeout(() => setAnalysisPhase(3), 1650),
      setTimeout(() => setStep(4), 2050)
    ];
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const categoryCfg = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const levelCfg = LEVELS.find(l => l.id === level) || LEVELS[1];
  const modelCfg = MODELS.find(m => m.id === model) || MODELS[0];
  const units = unitsForModel(model, timeline);

  // Market benchmark (USD)
  const benchmark = useMemo(() => {
    const typical = categoryCfg.hourlyUsd * levelCfg.factor * units;
    return {
      low: typical * 0.65,
      typical,
      high: typical * 1.6,
      agency: typical * AGENCY_MULTIPLIER
    };
  }, [categoryCfg, levelCfg, units]);

  const budgetMajor = parseFloat(budgetInput.replace(/,/g, '')) || 0;
  const budgetUsd = budgetMajor * usdRate(currency);

  const verdict = useMemo(() => {
    if (budgetUsd < benchmark.low) {
      return {
        tone: 'low' as const,
        title: 'Below the market range',
        text: `Verified ${levelCfg.label.toLowerCase()} talent for this scope typically starts around ${formatAmount(benchmark.low, currency)}. Consider raising your budget, reducing the scope, or choosing an earlier experience level.`
      };
    }
    if (budgetUsd < benchmark.typical * 0.9) {
      return {
        tone: 'ok' as const,
        title: 'Competitive budget',
        text: 'Your budget sits in the lower half of the market range. You will receive solid matches, with the strongest fit among rising talent.'
      };
    }
    if (budgetUsd <= benchmark.high) {
      return {
        tone: 'good' as const,
        title: 'Well positioned',
        text: 'Your budget aligns with what verified talent charges for this scope. Expect strong interest and fast responses.'
      };
    }
    return {
      tone: 'good' as const,
      title: 'Premium budget',
      text: 'Your budget gives you access to top-rated senior specialists. You may be able to achieve the same outcome for less.'
    };
  }, [budgetUsd, benchmark, levelCfg, currency]);

  // Budget position on the range bar
  const rangeMin = benchmark.low * 0.6;
  const rangeMax = benchmark.high * 1.25;
  const pos = (v: number) => Math.min(100, Math.max(0, ((v - rangeMin) / (rangeMax - rangeMin)) * 100));

  // AI talent matching against the fixed budget
  const matches: MatchedTalent[] = useMemo(() => {
    if (step < 4) return [];
    const scored = SEED_TALENT.map(t => {
      const talentText = `${t.headline} ${t.skills.join(' ')}`;
      const talentCat = detectCategory(talentText);
      const categoryMatch = talentCat === category || scoreCategories(talentText)[category] > 0;
      const priceUsd = talentHourlyUsd(t, category) * units;
      const withinBudget = priceUsd <= budgetUsd * 1.02;
      const overByPct = withinBudget ? 0 : Math.round(((priceUsd - budgetUsd) / Math.max(budgetUsd, 1)) * 100);
      const fit = withinBudget ? 1 - Math.abs(budgetUsd - priceUsd) / Math.max(budgetUsd, 1) * 0.5 : Math.max(0, 1 - overByPct / 100);
      const score = Math.min(
        98,
        Math.round(58 + (categoryMatch ? 22 : 0) + fit * 12 + (t.rating - 4.5) * 12 + (t.verification_status === 'PROFESSION_VERIFIED' ? 3 : 0))
      );
      return { talent: t, priceUsd, withinBudget, overByPct, score, categoryMatch };
    });

    const pool = scored.filter(m => m.categoryMatch);
    const source = pool.length >= 3 ? pool : scored;
    return source
      .sort((a, b) => {
        if (a.withinBudget !== b.withinBudget) return a.withinBudget ? -1 : 1;
        if (!a.withinBudget) return a.overByPct - b.overByPct;
        return b.score - a.score;
      })
      .slice(0, 3);
  }, [step, category, units, budgetUsd]);

  const withinCount = matches.filter(m => m.withinBudget).length;
  const fee = budgetUsd * SERVICE_FEE_RATE;
  const savingsPct = Math.max(0, Math.round((1 - budgetUsd / benchmark.agency) * 100));

  const canContinueStep1 = brief.trim().length >= 8;
  const canContinueStep2 = budgetMajor > 0;

  const goToResults = () => {
    try {
      sessionStorage.setItem(
        'refeir_pricing_brief',
        JSON.stringify({ brief, category, level, model, timeline, currency, budget: budgetMajor })
      );
    } catch {
      /* storage unavailable */
    }
    setStep(3);
  };

  const navigateAndClose = (path: string) => {
    onClose();
    onNavigate(path);
  };

  if (!isOpen) return null;

  const stepIndex = step === 4 ? 3 : step === 3 ? 2 : step;
  const stepLabels = ['Scope', 'Budget', 'Matches'];

  return createPortal(
    <div className="rf-pm-overlay" role="dialog" aria-modal="true" aria-label="Refeir budget match" onClick={onClose}>
      <div className="rf-pm-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="rf-pm-header">
          <div className="rf-pm-header-top">
            <div>
              <span className="rf-pm-eyebrow">Refeir Budget Match</span>
              <h3 className="rf-pm-title">
                {step === 1 && 'What do you need done?'}
                {step === 2 && 'What is your budget?'}
                {step === 3 && 'Matching talent to your budget'}
                {step === 4 && 'Your budget, matched'}
              </h3>
            </div>
            <button type="button" className="rf-pm-icon-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="rf-pm-steps">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const state = n < stepIndex || step === 4 ? 'done' : n === stepIndex ? 'active' : '';
              return (
                <div key={label} className={`rf-pm-step ${state}`}>
                  <span className="rf-pm-step-bar" />
                  <span className="rf-pm-step-label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="rf-pm-body">
          {/* STEP 1 — Scope */}
          {step === 1 && (
            <div className="rf-pm-section">
              <label className="rf-pm-label" htmlFor="rf-pm-brief">Project brief</label>
              <textarea
                id="rf-pm-brief"
                className="rf-pm-textarea"
                rows={3}
                value={brief}
                onChange={e => {
                  setBrief(e.target.value);
                  setCategory(detectCategory(e.target.value));
                }}
                placeholder="e.g. Build a mobile app for customers to book and pay for cleaning services"
              />

              <div className="rf-pm-field">
                <span className="rf-pm-label">Category</span>
                <div className="rf-pm-chips">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`rf-pm-chip ${category === c.id ? 'is-active' : ''}`}
                      onClick={() => setCategory(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <span className="rf-pm-hint">Detected automatically from your brief. Change it if needed.</span>
              </div>

              <div className="rf-pm-field">
                <span className="rf-pm-label">Experience level</span>
                <div className="rf-pm-segment rf-pm-segment-3">
                  {LEVELS.map(l => (
                    <button
                      key={l.id}
                      type="button"
                      className={`rf-pm-segment-btn ${level === l.id ? 'is-active' : ''}`}
                      onClick={() => setLevel(l.id)}
                    >
                      <span>{l.label}</span>
                      <small>{l.hint}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Budget */}
          {step === 2 && (
            <div className="rf-pm-section">
              <div className="rf-pm-field">
                <span className="rf-pm-label">How do you want to pay?</span>
                <div className="rf-pm-segment rf-pm-segment-3">
                  {MODELS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className={`rf-pm-segment-btn ${model === m.id ? 'is-active' : ''}`}
                      onClick={() => setModel(m.id)}
                    >
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {model === 'fixed' && (
                <div className="rf-pm-field">
                  <span className="rf-pm-label">Timeline</span>
                  <div className="rf-pm-chips">
                    {TIMELINES.filter(t => t.id !== 'ongoing').map(t => (
                      <button
                        key={t.id}
                        type="button"
                        className={`rf-pm-chip ${timeline === t.id ? 'is-active' : ''}`}
                        onClick={() => setTimeline(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="rf-pm-field">
                <label className="rf-pm-label" htmlFor="rf-pm-budget">
                  Your budget <span className="rf-pm-label-muted">({modelCfg.suffix})</span>
                </label>
                <div className="rf-pm-budget-row">
                  <select
                    className="rf-pm-select"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    aria-label="Currency"
                  >
                    {CURRENCY_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    id="rf-pm-budget"
                    className="rf-pm-input"
                    inputMode="decimal"
                    autoFocus
                    value={budgetInput}
                    onChange={e => setBudgetInput(e.target.value.replace(/[^0-9.,]/g, ''))}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && canContinueStep2) goToResults();
                    }}
                    placeholder={new Intl.NumberFormat('en-US').format(Math.round(benchmark.typical / usdRate(currency)))}
                  />
                </div>
              </div>

              <div className="rf-pm-benchmark-hint">
                <TrendingDown size={16} />
                <span>
                  Verified {levelCfg.label.toLowerCase()} {categoryCfg.label.toLowerCase()} talent on Refeir typically charges{' '}
                  <strong>
                    {formatAmount(benchmark.low, currency)} – {formatAmount(benchmark.high, currency)}
                  </strong>{' '}
                  {modelCfg.suffix} for this scope.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3 — Analysis */}
          {step === 3 && (
            <div className="rf-pm-analysis">
              <div className="rf-pm-loader" aria-hidden="true">
                <span />
              </div>
              <ul className="rf-pm-analysis-list">
                {[
                  'Reading your project brief',
                  `Benchmarking ${categoryCfg.label.toLowerCase()} rates across Africa`,
                  `Matching verified talent within ${formatAmount(budgetUsd, currency)}`
                ].map((label, i) => (
                  <li key={label} className={analysisPhase > i ? 'is-done' : analysisPhase === i ? 'is-active' : ''}>
                    <span className="rf-pm-analysis-dot">{analysisPhase > i && <Check size={12} strokeWidth={3} />}</span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* STEP 4 — Results */}
          {step === 4 && (
            <div className="rf-pm-section">
              {/* Budget fit */}
              <div className="rf-pm-card">
                <div className="rf-pm-card-head">
                  <div>
                    <span className="rf-pm-label-muted">Your budget</span>
                    <div className="rf-pm-big">
                      {formatAmount(budgetUsd, currency)} <small>{modelCfg.suffix}</small>
                    </div>
                  </div>
                  <span className={`rf-pm-badge is-${verdict.tone}`}>{verdict.title}</span>
                </div>

                <div className="rf-pm-range">
                  <div className="rf-pm-range-track">
                    <span
                      className="rf-pm-range-fill"
                      style={{ left: `${pos(benchmark.low)}%`, width: `${pos(benchmark.high) - pos(benchmark.low)}%` }}
                    />
                    <span className="rf-pm-range-marker" style={{ left: `${pos(budgetUsd)}%` }} />
                  </div>
                  <div className="rf-pm-range-labels">
                    <span>{formatAmount(benchmark.low, currency)}</span>
                    <span>Typical {formatAmount(benchmark.typical, currency)}</span>
                    <span>{formatAmount(benchmark.high, currency)}</span>
                  </div>
                </div>

                <p className="rf-pm-verdict">{verdict.text}</p>
              </div>

              {/* Matches */}
              <div className="rf-pm-matches-head">
                <span className="rf-pm-label">
                  {withinCount > 0
                    ? `${withinCount} verified ${withinCount === 1 ? 'match' : 'matches'} within your budget`
                    : 'Closest verified matches'}
                </span>
                <button type="button" className="rf-pm-link" onClick={() => setStep(2)}>
                  Adjust budget
                </button>
              </div>

              <div className="rf-pm-matches">
                {matches.map(m => (
                  <div key={m.talent.id} className="rf-pm-talent">
                    <img src={m.talent.avatar_url} alt={m.talent.full_name} className="rf-pm-avatar" loading="lazy" />
                    <div className="rf-pm-talent-main">
                      <div className="rf-pm-talent-name">
                        {m.talent.full_name}
                        {m.talent.verification_status === 'PROFESSION_VERIFIED' && (
                          <BadgeCheck size={15} className="rf-pm-verified" aria-label="Verified" />
                        )}
                      </div>
                      <div className="rf-pm-talent-headline">{m.talent.headline}</div>
                      <div className="rf-pm-talent-meta">
                        <span><MapPin size={12} /> {m.talent.city}, {m.talent.country_name}</span>
                        <span><Star size={12} /> {m.talent.rating.toFixed(2)} ({m.talent.reviews_count})</span>
                      </div>
                    </div>
                    <div className="rf-pm-talent-side">
                      <span className="rf-pm-score">{m.score}% match</span>
                      <span className="rf-pm-talent-price">
                        {formatAmount(m.priceUsd, currency)}
                        <small> {modelCfg.suffix}</small>
                      </span>
                      <span className={`rf-pm-fit ${m.withinBudget ? 'is-in' : 'is-over'}`}>
                        {m.withinBudget ? 'Within budget' : `${m.overByPct}% above budget`}
                      </span>
                      <button
                        type="button"
                        className="rf-pm-btn rf-pm-btn-ghost rf-pm-btn-sm"
                        onClick={() => navigateAndClose(`/talent/${m.talent.id}`)}
                      >
                        View profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost breakdown */}
              <div className="rf-pm-card rf-pm-breakdown">
                <div className="rf-pm-row">
                  <span>Talent payment</span>
                  <strong>{formatAmount(budgetUsd, currency)}</strong>
                </div>
                <div className="rf-pm-row">
                  <span>Refeir service fee (5%)</span>
                  <strong>{formatAmount(fee, currency)}</strong>
                </div>
                <div className="rf-pm-row rf-pm-row-total">
                  <span>Total held in escrow</span>
                  <strong>{formatAmount(budgetUsd + fee, currency)}</strong>
                </div>
                <div className="rf-pm-assurances">
                  <span><ShieldCheck size={14} /> Funds released only when you approve each milestone</span>
                  {savingsPct > 0 && (
                    <span><Wallet size={14} /> About {savingsPct}% less than typical global agency rates</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 3 && (
          <div className="rf-pm-footer">
            {step === 1 && (
              <>
                <span className="rf-pm-footer-note">Free estimate. No account needed.</span>
                <button
                  type="button"
                  className="rf-pm-btn rf-pm-btn-primary"
                  disabled={!canContinueStep1}
                  onClick={() => setStep(2)}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <button type="button" className="rf-pm-btn rf-pm-btn-ghost" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  className="rf-pm-btn rf-pm-btn-primary"
                  disabled={!canContinueStep2}
                  onClick={goToResults}
                >
                  Find matching talent <ArrowRight size={16} />
                </button>
              </>
            )}
            {step === 4 && (
              <>
                <button type="button" className="rf-pm-btn rf-pm-btn-ghost" onClick={() => navigateAndClose('/marketplace')}>
                  Browse all talent
                </button>
                <button
                  type="button"
                  className="rf-pm-btn rf-pm-btn-primary"
                  onClick={() => navigateAndClose('/register?role=client')}
                >
                  Post brief at this budget <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PricingMatchFlow;
