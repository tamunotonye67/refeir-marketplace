import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Info, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SEED_TALENT } from '../../data/seedTalent';
import { TalentProfile } from '../../types';

interface AISearchModalProps {
  isOpen: boolean;
  searchQuery: string;
  intent: 'recruit' | 'work' | 'scout';
  onClose: () => void;
  onContinue: (query: string, intent: 'recruit' | 'work' | 'scout') => void;
  onNavigate: (path: string) => void;
}

export const AISearchModal: React.FC<AISearchModalProps> = ({
  isOpen,
  searchQuery,
  intent,
  onClose,
  onContinue,
  onNavigate
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Phases: 'loading' | 'results' | 'briefing' | 'submitting'
  const [phase, setPhase] = useState<'loading' | 'results' | 'briefing' | 'submitting'>('loading');
  const [briefingStep, setBriefingStep] = useState<number>(1);
  const [matchedTalent, setMatchedTalent] = useState<TalentProfile[]>([]);

  // Briefing User Choices
  const [urgency, setUrgency] = useState<string>('Now');
  const [locationPref, setLocationPref] = useState<string>('Anywhere in the world');
  const [budgetType, setBudgetType] = useState<'hourly' | 'fixed'>('hourly');
  const [hourlyRate, setHourlyRate] = useState<number>(63);
  const [fixedBudget, setFixedBudget] = useState<number>(1500);
  const [jobDetails, setJobDetails] = useState<string>('');
  const [showExamples, setShowExamples] = useState<boolean>(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [isAddingCustomSkill, setIsAddingCustomSkill] = useState<boolean>(false);

  // Dynamic Category Label
  const categoryLabel = useMemo(() => {
    if (!searchQuery) return 'brand identity design';
    const q = searchQuery.toLowerCase();
    if (q.includes('web')) return 'web design & development';
    if (q.includes('ai')) return 'AI development & engineering';
    if (q.includes('video')) return 'video editing & motion';
    if (q.includes('google ads') || q.includes('ad')) return 'growth & ads marketing';
    return `${searchQuery.toLowerCase()} design`;
  }, [searchQuery]);

  // Dynamic Skills List according to search query
  const availableSkills = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (q.includes('web') || q.includes('front') || q.includes('dev')) {
      return [
        { name: 'Responsive Web Design', defaultSelected: true },
        { name: 'UI/UX Prototyping', defaultSelected: true },
        { name: 'Figma to Code', defaultSelected: true },
        { name: 'Design Systems', defaultSelected: false },
        { name: 'Frontend Architecture', defaultSelected: false },
        { name: 'React & Next.js', defaultSelected: false },
        { name: 'Tailwind CSS', defaultSelected: false },
        { name: 'Landing Page Optimization', defaultSelected: false },
        { name: 'Interaction Design', defaultSelected: false },
        { name: 'Web Performance & SEO', defaultSelected: false }
      ];
    }
    if (q.includes('ai') || q.includes('machine') || q.includes('python')) {
      return [
        { name: 'LLM Prompt Engineering', defaultSelected: true },
        { name: 'AI Model Integration', defaultSelected: true },
        { name: 'Python Architecture', defaultSelected: true },
        { name: 'RAG Pipelines', defaultSelected: false },
        { name: 'OpenAI & Claude API', defaultSelected: false },
        { name: 'Vector Databases', defaultSelected: false },
        { name: 'Fine-tuning Models', defaultSelected: false },
        { name: 'Agentic Workflows', defaultSelected: false },
        { name: 'Data Pipeline Automation', defaultSelected: false }
      ];
    }
    if (q.includes('video') || q.includes('animat') || q.includes('motion')) {
      return [
        { name: 'Short-Form Video Editing', defaultSelected: true },
        { name: 'Motion Graphics', defaultSelected: true },
        { name: 'Sound Design & Mixing', defaultSelected: true },
        { name: 'Color Grading & LUTs', defaultSelected: false },
        { name: 'Adobe Premiere Pro', defaultSelected: false },
        { name: 'After Effects', defaultSelected: false },
        { name: 'Social Media Video Ads', defaultSelected: false },
        { name: 'YouTube Content Editing', defaultSelected: false },
        { name: 'Kinetic Typography', defaultSelected: false }
      ];
    }
    if (q.includes('ad') || q.includes('market') || q.includes('growth')) {
      return [
        { name: 'Google Ads & PPC', defaultSelected: true },
        { name: 'Conversion Rate Optimization', defaultSelected: true },
        { name: 'Target Audience Research', defaultSelected: true },
        { name: 'Ad Copywriting', defaultSelected: false },
        { name: 'Analytics & Tag Manager', defaultSelected: false },
        { name: 'Campaign Scaling', defaultSelected: false },
        { name: 'Meta & LinkedIn Ads', defaultSelected: false },
        { name: 'A/B Testing & Funnels', defaultSelected: false }
      ];
    }

    // Default Brand Identity Skills (Matches reference image!)
    return [
      { name: 'Brand Identity & Guidelines', defaultSelected: true },
      { name: 'Creative Direction', defaultSelected: true },
      { name: 'Art Direction', defaultSelected: true },
      { name: 'Brand Identity Design', defaultSelected: false },
      { name: 'Art Direction Focus', defaultSelected: false },
      { name: 'Brand Development', defaultSelected: false },
      { name: 'Corporate Brand Identity', defaultSelected: false },
      { name: 'Brand Style Guide', defaultSelected: false },
      { name: 'Visual Identity', defaultSelected: false },
      { name: 'Brand Identity Deliverables', defaultSelected: false }
    ];
  }, [searchQuery]);

  // Initial State Reset & Talents Filtering
  useEffect(() => {
    if (isOpen) {
      setPhase('loading');
      setBriefingStep(1);
      setShowExamples(false);

      // Pre-fill initial skills based on defaults
      const defaults = availableSkills.filter(s => s.defaultSelected).map(s => s.name);
      setSelectedSkills(defaults);

      // Pre-fill sample job details tailored to query
      if (searchQuery) {
        setJobDetails(`Experienced specialist for a ${searchQuery.toLowerCase()} project refresh`);
      } else {
        setJobDetails('Creative director for a brand identity refresh');
      }

      const timer = setTimeout(() => {
        setPhase('results');
      }, 1900);

      // Filter 4 matching talents based on the query keywords
      const q = searchQuery.toLowerCase().trim();
      const filtered = SEED_TALENT.filter(t => {
        if (!q) return true;
        const inSkills = t.skills?.some(s => s.toLowerCase().includes(q) || q.includes(s.toLowerCase()));
        const inHeadline = t.headline?.toLowerCase().includes(q);
        const inBio = t.bio?.toLowerCase().includes(q);
        return inSkills || inHeadline || inBio;
      });

      const combined = [...filtered];
      for (const t of SEED_TALENT) {
        if (combined.length >= 4) break;
        if (!combined.some(item => item.id === t.id)) {
          combined.push(t);
        }
      }

      setMatchedTalent(combined.slice(0, 4));

      return () => clearTimeout(timer);
    }
  }, [isOpen, searchQuery, availableSkills]);

  if (!isOpen) return null;

  // Format short name: "Amaka N."
  const formatShortName = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1].charAt(0)}.`;
  };

  // Dynamic Headline formatting for Results screen
  const getHeadline = () => {
    const displayQuery = searchQuery ? searchQuery.toLowerCase() : 'tech & creative';
    if (intent === 'work') {
      return `We found thousands of top client gigs & projects for ${displayQuery}`;
    }
    if (intent === 'scout') {
      return `We found thousands of high-yield referral bounties for ${displayQuery}`;
    }
    return `We found thousands of top-rated ${displayQuery} pros`;
  };

  const getLoadingActionText = () => {
    if (intent === 'work') return 'Searching open opportunities & projects for';
    if (intent === 'scout') return 'Scouting verified talent & referral bounties for';
    return 'Searching talent for';
  };

  // Briefing Step Navigation
  const handleNextStep = () => {
    if (briefingStep < 5) {
      setBriefingStep(prev => prev + 1);
    } else {
      handleFinishBriefing();
    }
  };

  const handlePrevStep = () => {
    if (briefingStep > 1) {
      setBriefingStep(prev => prev - 1);
    } else {
      // Return to Phase 2 (Results preview)
      setPhase('results');
    }
  };

  const handleFinishBriefing = () => {
    setPhase('submitting');
    setTimeout(() => {
      onContinue(searchQuery, intent);
    }, 1200);
  };

  const toggleSkill = (skillName: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillName) 
        ? prev.filter(s => s !== skillName) 
        : [...prev, skillName]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkillInput.trim()) {
      const trimmed = customSkillInput.trim();
      if (!selectedSkills.includes(trimmed)) {
        setSelectedSkills(prev => [...prev, trimmed]);
      }
      setCustomSkillInput('');
      setIsAddingCustomSkill(false);
    }
  };

  // Calculation for Budget Bell Curve thumb position (0 to 100%)
  const budgetPercentage = useMemo(() => {
    if (budgetType === 'hourly') {
      const min = 15;
      const max = 150;
      return Math.min(100, Math.max(0, ((hourlyRate - min) / (max - min)) * 100));
    } else {
      const min = 200;
      const max = 10000;
      return Math.min(100, Math.max(0, ((fixedBudget - min) / (max - min)) * 100));
    }
  }, [budgetType, hourlyRate, fixedBudget]);

  // Example brief ideas for Step 4
  const exampleBriefs = [
    `Creative director for a brand identity refresh, modern visual guidelines, and design deliverables.`,
    `Senior Figma designer to deliver responsive high-converting landing page prototypes with design tokens.`,
    `Full-lifecycle specialist to build clean architecture, optimize conversions, and ensure on-time delivery.`
  ];

  return (
    <div
      className={`rf-ai-search-overlay ${isDark ? 'is-dark' : 'is-light'}`}
      role="dialog"
      aria-modal="true"
    >
      {/* =========================================================================
         PHASE 1: REVOLVING POLYGON AI LOADER
         ========================================================================= */}
      {phase === 'loading' && (
        <>
          <div className="rf-ai-search-topbar">
            <button
              type="button"
              onClick={onClose}
              className="rf-ai-search-exit-btn"
              aria-label="Exit search"
            >
              Exit
            </button>
          </div>

          <div className="rf-ai-search-loading-container">
            <div className="rf-polygon-stage">
              <div className="rf-polygon-rotator">
                <svg
                  viewBox="0 0 200 200"
                  className="rf-polygon-svg"
                  aria-hidden="true"
                >
                  {[...Array(12)].map((_, i) => (
                    <ellipse
                      key={i}
                      cx="100"
                      cy="100"
                      rx="68"
                      ry="24"
                      transform={`rotate(${i * 15} 100 100)`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="rf-polygon-petal"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                  <circle
                    cx="100"
                    cy="100"
                    r="14"
                    fill="none"
                    stroke="#66BB2A"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>

            <div className="rf-ai-search-loading-text">
              <span className="rf-ai-search-loading-label">{getLoadingActionText()}</span>
              <h3 className="rf-ai-search-loading-query">‘{searchQuery || 'Pan-African Talent'}’</h3>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
         PHASE 2: MINIMALIST RESULTS PREVIEW SHOWCASE
         ========================================================================= */}
      {phase === 'results' && (
        <>
          <div className="rf-ai-search-topbar">
            <button
              type="button"
              onClick={onClose}
              className="rf-ai-search-exit-btn"
              aria-label="Exit search"
            >
              Exit
            </button>
          </div>

          <div className="rf-ai-search-results-container">
            {/* Subtle Constellation Particle Backdrop */}
            <div className="rf-ai-search-particles" aria-hidden="true">
              <div className="rf-particle p1" />
              <div className="rf-particle p2" />
              <div className="rf-particle p3" />
              <div className="rf-particle p4" />
              <div className="rf-particle p5" />
              <div className="rf-particle p6" />
              <div className="rf-particle p7" />
              <div className="rf-particle p8" />
            </div>

            <div className="rf-ai-search-results-card">
              {/* Left Column: Heading, Stars, CTA & Info Links */}
              <div className="rf-ai-search-left-col">
                <h1 className="rf-ai-search-title">{getHeadline()}</h1>

                {/* Star Rating Section */}
                <div className="rf-ai-search-rating-row">
                  <div className="rf-ai-search-stars">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={18} fill="#F6B21A" color="#F6B21A" />
                    ))}
                  </div>
                  <span className="rf-ai-search-score">4.8</span>
                </div>
                <div className="rf-ai-search-rating-desc">Rated 4.8 / 5 on avg.</div>
                <div className="rf-ai-search-rating-sub">From over 4k+ past clients</div>

                {/* Primary Continue Button -> Leads to the 5-Step Slides */}
                <button
                  type="button"
                  onClick={() => setPhase('briefing')}
                  className="rf-ai-search-continue-btn"
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>

                {/* Quick Context Links */}
                <div className="rf-ai-search-links-row">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('/why-refeir');
                    }}
                    className="rf-ai-search-link"
                  >
                    How hiring works
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('/pricing');
                    }}
                    className="rf-ai-search-link"
                  >
                    Platform pricing
                  </button>
                </div>

                {/* Footer AI Attribution */}
                <div className="rf-ai-search-footer-note">
                  <span>We use AI to power this experience.</span>
                  <Info size={14} className="rf-ai-info-icon" />
                </div>
              </div>

              {/* Right Column: 2x2 Curated Matching Talent Cards */}
              <div className="rf-ai-search-right-col">
                <div className="rf-ai-talent-grid">
                  {matchedTalent.map((talent) => (
                    <div
                      key={talent.id}
                      className="rf-ai-talent-card"
                      onClick={() => {
                        onClose();
                        onNavigate(`/profile/${talent.user_id || talent.id}`);
                      }}
                      title={`View ${talent.full_name}'s verified profile`}
                    >
                      <div className="rf-ai-talent-avatar-wrap">
                        <img
                          src={talent.avatar_url}
                          alt={talent.full_name}
                          className="rf-ai-talent-avatar"
                          loading="lazy"
                        />
                        <span className="rf-ai-talent-status-dot" title="Available now" />
                        <span className="rf-ai-talent-verified-badge">
                          <Star size={11} fill="#FFFFFF" color="#FFFFFF" />
                        </span>
                      </div>

                      <div className="rf-ai-talent-name">{formatShortName(talent.full_name)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
         PHASE 3: MULTI-STEP SLIDES (EXACTLY MATCHING USER'S INSPIRATION IMAGES)
         ========================================================================= */}
      {phase === 'briefing' && (
        <div className="rf-briefing-modal-wrapper">
          {/* Top Bar with Back, Progress Line, and Skip */}
          <div className="rf-briefing-topbar-wrapper">
            <div className="rf-briefing-topbar">
              <button
                type="button"
                onClick={handlePrevStep}
                className="rf-briefing-back-btn"
                aria-label="Go back to previous step"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="rf-briefing-skip-btn"
                aria-label="Skip this step"
              >
                Skip
              </button>
            </div>

            {/* Seamless 5-Step Progress Bar Indicator */}
            <div className="rf-briefing-progress-track">
              <div
                className="rf-briefing-progress-fill"
                style={{ width: `${(briefingStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Slide Stage Container */}
          <div className="rf-briefing-stage">
            {/* -------------------------------------------------------------------
                SLIDE 1: URGENCY & TIMELINE (IMAGE 1)
                ------------------------------------------------------------------- */}
            {briefingStep === 1 && (
              <div className="rf-briefing-slide" key="step-1">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">How soon do you need help?</h2>
                  <p className="rf-briefing-subtitle">
                    We'll prioritize {categoryLabel} pros that can start immediately, if needed.
                  </p>

                  <div className="rf-briefing-pills-row">
                    {['Now', 'In 1-2 weeks', 'No Rush'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setUrgency(option);
                          setTimeout(() => setBriefingStep(2), 220);
                        }}
                        className={`rf-briefing-pill-btn ${urgency === option ? 'is-active' : ''}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                SLIDE 2: TALENT LOCATION (IMAGE 2)
                ------------------------------------------------------------------- */}
            {briefingStep === 2 && (
              <div className="rf-briefing-slide" key="step-2">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">Does talent location matter?</h2>
                  <p className="rf-briefing-subtitle">
                    We'll filter from hundreds of freelancers across 250+ countries.
                  </p>

                  <div className="rf-briefing-pills-row">
                    {['U.S. only', 'Near my timezone', 'Anywhere in the world'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setLocationPref(option);
                          setTimeout(() => setBriefingStep(3), 220);
                        }}
                        className={`rf-briefing-pill-btn ${locationPref === option ? 'is-active' : ''}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                SLIDE 3: BUDGET IN MIND (IMAGE 3)
                ------------------------------------------------------------------- */}
            {briefingStep === 3 && (
              <div className="rf-briefing-slide" key="step-3">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">Do you have a budget in mind?</h2>
                  <p className="rf-briefing-subtitle">
                    This helps prioritize freelancers within your range.
                  </p>

                  {/* Hourly vs Fixed Price Switcher Toggle */}
                  <div className="rf-briefing-budget-toggle">
                    <button
                      type="button"
                      onClick={() => setBudgetType('hourly')}
                      className={`rf-briefing-toggle-opt ${budgetType === 'hourly' ? 'is-selected' : ''}`}
                    >
                      Hourly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetType('fixed')}
                      className={`rf-briefing-toggle-opt ${budgetType === 'fixed' ? 'is-selected' : ''}`}
                    >
                      Fixed price
                    </button>
                  </div>

                  {/* Bell Curve Graphic & Interactive Rate Slider */}
                  <div className="rf-briefing-curve-container">
                    {/* SVG Bell Distribution Curve */}
                    <div className="rf-briefing-curve-svg-box">
                      <svg
                        viewBox="0 0 600 150"
                        className="rf-briefing-curve-svg"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="rfCurveGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#66BB2A" stopOpacity="0.45" />
                            <stop offset="70%" stopColor="#66BB2A" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#66BB2A" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="rfCurveGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                            <stop offset="70%" stopColor="#16A34A" stopOpacity="0.06" />
                            <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Fill under bell curve */}
                        <path
                          d="M 30 145 C 180 145, 230 35, 300 35 C 370 35, 420 145, 570 145 L 570 148 L 30 148 Z"
                          fill={isDark ? "url(#rfCurveGradDark)" : "url(#rfCurveGradLight)"}
                        />

                        {/* Stroke Outline */}
                        <path
                          d="M 30 145 C 180 145, 230 35, 300 35 C 370 35, 420 145, 570 145"
                          fill="none"
                          stroke={isDark ? "#66BB2A" : "#16A34A"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Center "Typical" Dotted Guideline */}
                        <line
                          x1="300"
                          y1="12"
                          x2="300"
                          y2="145"
                          stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(15, 23, 42, 0.22)"}
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                      </svg>
                    </div>

                    {/* Labels over the curve: Affordable | Typical ⓘ | Expert */}
                    <div className="rf-briefing-curve-labels">
                      <span className="rf-curve-label-affordable">Affordable</span>
                      <div className="rf-curve-label-typical">
                        <span>Typical</span>
                        <Info size={13} className="rf-curve-info-icon" />
                      </div>
                      <span className="rf-curve-label-expert">Expert</span>
                    </div>

                    {/* Dynamic Floating Price Value Tag */}
                    <div
                      className="rf-briefing-price-bubble"
                      style={{ left: `${budgetPercentage}%` }}
                    >
                      <span className="rf-briefing-price-text">
                        {budgetType === 'hourly' ? `$${hourlyRate}/hour` : `$${fixedBudget.toLocaleString()}`}
                      </span>
                    </div>

                    {/* Range Input Track & Thumb */}
                    <div className="rf-briefing-slider-track-wrap">
                      <input
                        type="range"
                        min={budgetType === 'hourly' ? 15 : 200}
                        max={budgetType === 'hourly' ? 150 : 10000}
                        step={budgetType === 'hourly' ? 1 : 50}
                        value={budgetType === 'hourly' ? hourlyRate : fixedBudget}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (budgetType === 'hourly') {
                            setHourlyRate(val);
                          } else {
                            setFixedBudget(val);
                          }
                        }}
                        className="rf-briefing-range-slider"
                        aria-label="Select budget rate"
                      />
                    </div>
                  </div>

                  {/* Primary Next Action Button */}
                  <div className="rf-briefing-action-box">
                    <button
                      type="button"
                      onClick={() => setBriefingStep(4)}
                      className="rf-briefing-primary-btn"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                SLIDE 4: JOB DETAILS & SCOPE (IMAGE 4)
                ------------------------------------------------------------------- */}
            {briefingStep === 4 && (
              <div className="rf-briefing-slide" key="step-4">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">Any job details to share?</h2>
                  <p className="rf-briefing-subtitle">
                    We'll search for talent who have relevant experience.
                  </p>

                  {/* Clean Textarea Input */}
                  <div className="rf-briefing-textarea-box">
                    <textarea
                      rows={5}
                      value={jobDetails}
                      onChange={(e) => setJobDetails(e.target.value)}
                      placeholder="e.g. Creative director for a brand identity refresh"
                      className="rf-briefing-textarea"
                    />
                  </div>

                  {/* See an Example Collapsible Accordion */}
                  <div className="rf-briefing-examples-wrap">
                    <button
                      type="button"
                      onClick={() => setShowExamples(!showExamples)}
                      className="rf-briefing-example-toggle"
                    >
                      <span>See an example</span>
                      {showExamples ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {showExamples && (
                      <div className="rf-briefing-examples-dropdown">
                        {exampleBriefs.map((exampleText, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setJobDetails(exampleText);
                              setShowExamples(false);
                            }}
                            className="rf-briefing-example-item"
                          >
                            <span>“{exampleText}”</span>
                            <span className="rf-briefing-use-tag">Use this</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Primary Next Action Button */}
                  <div className="rf-briefing-action-box">
                    <button
                      type="button"
                      onClick={() => setBriefingStep(5)}
                      className="rf-briefing-primary-btn"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                SLIDE 5: SPECIFIC SKILLS (IMAGE 5)
                ------------------------------------------------------------------- */}
            {briefingStep === 5 && (
              <div className="rf-briefing-slide" key="step-5">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">Any specific skills required?</h2>
                  <p className="rf-briefing-subtitle">
                    You can add more custom skills later, if you decide to post your job.
                  </p>

                  {/* Interactive Skills Pill Tags */}
                  <div className="rf-briefing-skills-cloud">
                    {availableSkills.map((skill) => {
                      const isSelected = selectedSkills.includes(skill.name);
                      return (
                        <button
                          key={skill.name}
                          type="button"
                          onClick={() => toggleSkill(skill.name)}
                          className={`rf-briefing-skill-pill ${isSelected ? 'is-selected' : ''}`}
                        >
                          <span className="rf-skill-pill-text">{skill.name}</span>
                          <span className="rf-skill-pill-icon">
                            {isSelected ? <Check size={14} /> : <Plus size={14} />}
                          </span>
                        </button>
                      );
                    })}

                    {/* Any custom added skills */}
                    {selectedSkills
                      .filter(s => !availableSkills.some(as => as.name === s))
                      .map(customSkill => (
                        <button
                          key={customSkill}
                          type="button"
                          onClick={() => toggleSkill(customSkill)}
                          className="rf-briefing-skill-pill is-selected"
                        >
                          <span className="rf-skill-pill-text">{customSkill}</span>
                          <span className="rf-skill-pill-icon">
                            <Check size={14} />
                          </span>
                        </button>
                      ))}

                    {/* Add Custom Skill Button */}
                    {!isAddingCustomSkill ? (
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomSkill(true)}
                        className="rf-briefing-add-skill-btn"
                      >
                        <Plus size={14} />
                        <span>Add custom skill</span>
                      </button>
                    ) : (
                      <div className="rf-briefing-add-skill-inline">
                        <input
                          type="text"
                          autoFocus
                          value={customSkillInput}
                          onChange={(e) => setCustomSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomSkill();
                            } else if (e.key === 'Escape') {
                              setIsAddingCustomSkill(false);
                            }
                          }}
                          placeholder="Skill name..."
                          className="rf-briefing-add-skill-input"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSkill}
                          className="rf-briefing-add-skill-confirm"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Primary Finish & View Talent Button */}
                  <div className="rf-briefing-action-box">
                    <button
                      type="button"
                      onClick={handleFinishBriefing}
                      className="rf-briefing-primary-btn is-finish"
                    >
                      Finish and view talent
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
         FINAL MATCHING PULSE (WHEN COMPLETING SLIDES)
         ========================================================================= */}
      {phase === 'submitting' && (
        <div className="rf-ai-search-loading-container">
          <div className="rf-polygon-stage">
            <div className="rf-polygon-rotator">
              <svg viewBox="0 0 200 200" className="rf-polygon-svg" aria-hidden="true">
                {[...Array(12)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx="100"
                    cy="100"
                    rx="68"
                    ry="24"
                    transform={`rotate(${i * 15} 100 100)`}
                    fill="none"
                    stroke="#66BB2A"
                    strokeWidth="2"
                    className="rf-polygon-petal"
                  />
                ))}
              </svg>
            </div>
          </div>
          <div className="rf-ai-search-loading-text">
            <span className="rf-ai-search-loading-label">Matching verified talent for your brief</span>
            <h3 className="rf-ai-search-loading-query">Preparing your personalized shortlist...</h3>
          </div>
        </div>
      )}
    </div>
  );
};
