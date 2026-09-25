import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  DollarSign,
  Medal,
  Award,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  UserCheck,
  CreditCard,
  Pin
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

  // Phases: 'loading' | 'results' | 'briefing' | 'submitting' | 'personalized_results'
  const [phase, setPhase] = useState<'loading' | 'results' | 'briefing' | 'submitting' | 'personalized_results'>('loading');
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

  // Personalized Results State
  const [filterAvailableOnly, setFilterAvailableOnly] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(1);
  const [activeDropdown, setActiveDropdown] = useState<'rate' | 'location' | 'skills' | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

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

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Initial State Reset & Talents Filtering
  useEffect(() => {
    if (isOpen) {
      setPhase('loading');
      setBriefingStep(1);
      setShowExamples(false);
      setFilterAvailableOnly(false);
      setActiveDropdown(null);

      // Pre-fill initial skills based on defaults
      const defaults = availableSkills.filter(s => s.defaultSelected).map(s => s.name);
      setSelectedSkills(defaults);

      // Pre-fill sample job details tailored to query
      if (searchQuery && searchQuery.trim()) {
        const cleanQ = searchQuery.trim();
        setJobDetails(`${cleanQ.charAt(0).toUpperCase() + cleanQ.slice(1)}`);
      } else {
        setJobDetails('Creative Director for a brand identity refresh');
      }

      const timer = setTimeout(() => {
        setPhase('results');
      }, 1900);

      // Tokenize search query and intelligently score & rank talents
      const rawQ = (searchQuery || '').toLowerCase().trim();
      const tokens = rawQ.split(/[\s,+/]+/).filter(w => w.length > 1);

      const scoredTalents = SEED_TALENT.map(talent => {
        let score = 0;
        const skillsText = (talent.skills || []).join(' ').toLowerCase();
        const headlineText = (talent.headline || '').toLowerCase();
        const bioText = (talent.bio || '').toLowerCase();

        for (const token of tokens) {
          if (skillsText.includes(token)) score += 3;
          if (headlineText.includes(token)) score += 2;
          if (bioText.includes(token)) score += 1;
        }
        return { talent, score };
      });

      scoredTalents.sort((a, b) => b.score - a.score);
      const topMatched = scoredTalents.filter(s => s.score > 0).map(s => s.talent);

      const combined = [...topMatched];
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
      setPhase('personalized_results');
    }, 850);
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

  // Curated 6 Talents for the Personalized Results Page (Matching the exact inspiration image!)
  const personalizedTalentRoster = [
    {
      id: 'talent-taib-b',
      name: 'Taib B.',
      fullName: 'Taib Benani',
      rate: 20,
      rating: 4.4,
      reviewsCount: 144,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      availableNow: true,
      skillsMatched: '3/3 skills',
      badgeType: 'arrow-green',
      isOnline: true
    },
    {
      id: 'talent-carla-i',
      name: 'Carla I.',
      fullName: 'Carla Ibe',
      rate: 50,
      rating: 3.9,
      reviewsCount: 27,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      availableNow: false,
      skillsMatched: '3/3 skills',
      badgeType: 'arrow-green',
      isOnline: false
    },
    {
      id: 'talent-axel-b',
      name: 'Axel B.',
      fullName: 'Axel Boateng',
      rate: 250,
      rating: 4.9,
      reviewsCount: 283,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      availableNow: false,
      skillsMatched: '1/3 skills',
      badgeType: 'crown-gold',
      isOnline: false
    },
    {
      id: 'talent-lisa-a',
      name: 'Lisa A.',
      fullName: 'Lisa Adeleke',
      rate: 125,
      rating: 5.0,
      reviewsCount: 62,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      availableNow: true,
      skillsMatched: '2/3 skills',
      badgeType: 'star-pink',
      isOnline: true
    },
    {
      id: 'talent-artur-m',
      name: 'Artur M.',
      fullName: 'Artur Mensah',
      rate: 40,
      rating: 4.9,
      reviewsCount: 1657,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      availableNow: true,
      skillsMatched: '1/3 skills',
      badgeType: 'star-pink',
      isOnline: true
    },
    {
      id: 'talent-zofia-c',
      name: 'Zofia C.',
      fullName: 'Zofia Chinedu',
      rate: 36,
      rating: 5.0,
      reviewsCount: 18,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      availableNow: false,
      skillsMatched: '1/3 skills',
      badgeType: 'star-blue',
      isOnline: false
    }
  ];

  const displayedPersonalizedTalents = filterAvailableOnly 
    ? personalizedTalentRoster.filter(t => t.availableNow) 
    : personalizedTalentRoster;

  return (
    <div
      className={`rf-ai-search-overlay ${isDark ? 'is-dark' : 'is-light'} ${phase === 'personalized_results' ? 'is-personalized-page-view' : ''}`}
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
                  <defs>
                    <radialGradient id="rfPolyCoreGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#66BB2A" stopOpacity="0.45" />
                      <stop offset="70%" stopColor="#16A34A" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#05160C" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="rfPolyEdgeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#86EFAC" />
                      <stop offset="50%" stopColor="#66BB2A" />
                      <stop offset="100%" stopColor="#16A34A" />
                    </linearGradient>
                    <linearGradient id="rfPolyEdgeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#4ADE80" />
                    </linearGradient>
                  </defs>

                  {/* Pulsing Core Aura */}
                  <circle cx="100" cy="100" r="50" fill="url(#rfPolyCoreGlow)" className="rf-polygon-aura" />

                  {/* Outer Regular Dodecagon (12-Sided Polygon) */}
                  <polygon
                    points="100,16 142,27 173,58 184,100 173,142 142,173 100,184 58,173 27,142 16,100 27,58 58,27"
                    fill="none"
                    stroke="url(#rfPolyEdgeGrad1)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="rf-polygon-dodecagon"
                  />

                  {/* Internal Geodesic Polygon Struts / Star Facets */}
                  <polygon
                    points="100,16 173,142 27,142"
                    fill="none"
                    stroke="rgba(102, 187, 42, 0.45)"
                    strokeWidth="1.2"
                  />
                  <polygon
                    points="100,184 173,58 27,58"
                    fill="none"
                    stroke="rgba(102, 187, 42, 0.45)"
                    strokeWidth="1.2"
                  />

                  {/* Mid Hexagonal Facet Ring */}
                  <polygon
                    points="100,40 152,70 152,130 100,160 48,130 48,70"
                    fill="none"
                    stroke="url(#rfPolyEdgeGrad2)"
                    strokeWidth="1.8"
                    strokeDasharray="6 4"
                    className="rf-polygon-hex-ring"
                  />

                  {/* Inner Gyroscopic 3D Revolving Ellipses */}
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="75"
                    ry="28"
                    fill="none"
                    stroke="#86EFAC"
                    strokeWidth="1.5"
                    transform="rotate(35 100 100)"
                    className="rf-polygon-orbit-1"
                  />
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="75"
                    ry="28"
                    fill="none"
                    stroke="#66BB2A"
                    strokeWidth="1.5"
                    transform="rotate(-35 100 100)"
                    className="rf-polygon-orbit-2"
                  />

                  {/* Central Diamond / Octahedron Node */}
                  <polygon
                    points="100,68 132,100 100,132 68,100"
                    fill="rgba(102, 187, 42, 0.22)"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="rf-polygon-core-gem"
                  />

                  {/* Vertex Nodes (Glowing Data Anchors) */}
                  <circle cx="100" cy="16" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                  <circle cx="173" cy="58" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                  <circle cx="184" cy="100" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                  <circle cx="173" cy="142" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                  <circle cx="100" cy="184" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                  <circle cx="27" cy="142" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                  <circle cx="16" cy="100" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                  <circle cx="27" cy="58" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />

                  {/* Center Node Beacon */}
                  <circle cx="100" cy="100" r="6" fill="#86EFAC" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div className="rf-ai-search-loading-text">
              <span className="rf-ai-search-loading-label">
                <Sparkles size={16} className="rf-ai-search-pulse-icon" />
                {getLoadingActionText()}
              </span>
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
         PHASE 3: MULTI-STEP SLIDES (INSPIRATION QUESTIONNAIRE FLOW)
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
            {/* SLIDE 1: URGENCY & TIMELINE */}
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

            {/* SLIDE 2: TALENT LOCATION */}
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

            {/* SLIDE 3: BUDGET IN MIND */}
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

                        <path
                          d="M 30 145 C 180 145, 230 35, 300 35 C 370 35, 420 145, 570 145 L 570 148 L 30 148 Z"
                          fill={isDark ? "url(#rfCurveGradDark)" : "url(#rfCurveGradLight)"}
                        />

                        <path
                          d="M 30 145 C 180 145, 230 35, 300 35 C 370 35, 420 145, 570 145"
                          fill="none"
                          stroke={isDark ? "#66BB2A" : "#16A34A"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

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

                    <div className="rf-briefing-curve-labels">
                      <span className="rf-curve-label-affordable">Affordable</span>
                      <div className="rf-curve-label-typical">
                        <span>Typical</span>
                        <Info size={13} className="rf-curve-info-icon" />
                      </div>
                      <span className="rf-curve-label-expert">Expert</span>
                    </div>

                    <div
                      className="rf-briefing-price-bubble"
                      style={{ left: `${budgetPercentage}%` }}
                    >
                      <span className="rf-briefing-price-text">
                        {budgetType === 'hourly' ? `$${hourlyRate}/hour` : `$${fixedBudget.toLocaleString()}`}
                      </span>
                    </div>

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

            {/* SLIDE 4: JOB DETAILS & SCOPE */}
            {briefingStep === 4 && (
              <div className="rf-briefing-slide" key="step-4">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">Any job details to share?</h2>
                  <p className="rf-briefing-subtitle">
                    We'll search for talent who have relevant experience.
                  </p>

                  <div className="rf-briefing-textarea-box">
                    <textarea
                      rows={5}
                      value={jobDetails}
                      onChange={(e) => setJobDetails(e.target.value)}
                      placeholder="e.g. Creative director for a brand identity refresh"
                      className="rf-briefing-textarea"
                    />
                  </div>

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

            {/* SLIDE 5: SPECIFIC SKILLS */}
            {briefingStep === 5 && (
              <div className="rf-briefing-slide" key="step-5">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">Any specific skills required?</h2>
                  <p className="rf-briefing-subtitle">
                    You can add more custom skills later, if you decide to post your job.
                  </p>

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
         TRANSITIONAL AI MATCHING PULSE (FROM SLIDE 5 TO PERSONALIZED RESULTS)
         ========================================================================= */}
      {phase === 'submitting' && (
        <div className="rf-ai-search-loading-container">
          <div className="rf-polygon-stage">
            <div className="rf-polygon-rotator">
              <svg viewBox="0 0 200 200" className="rf-polygon-svg" aria-hidden="true">
                <defs>
                  <radialGradient id="rfPolySubmitGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#66BB2A" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#16A34A" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#05160C" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="rfPolySubmitEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#86EFAC" />
                    <stop offset="50%" stopColor="#66BB2A" />
                    <stop offset="100%" stopColor="#16A34A" />
                  </linearGradient>
                </defs>

                <circle cx="100" cy="100" r="50" fill="url(#rfPolySubmitGlow)" className="rf-polygon-aura" />

                <polygon
                  points="100,16 142,27 173,58 184,100 173,142 142,173 100,184 58,173 27,142 16,100 27,58 58,27"
                  fill="none"
                  stroke="url(#rfPolySubmitEdge)"
                  strokeWidth="2.2"
                  className="rf-polygon-dodecagon"
                />

                <polygon
                  points="100,16 173,142 27,142"
                  fill="none"
                  stroke="rgba(102, 187, 42, 0.45)"
                  strokeWidth="1.2"
                />
                <polygon
                  points="100,184 173,58 27,58"
                  fill="none"
                  stroke="rgba(102, 187, 42, 0.45)"
                  strokeWidth="1.2"
                />

                <ellipse
                  cx="100"
                  cy="100"
                  rx="75"
                  ry="28"
                  fill="none"
                  stroke="#86EFAC"
                  strokeWidth="1.5"
                  transform="rotate(35 100 100)"
                  className="rf-polygon-orbit-1"
                />
                <ellipse
                  cx="100"
                  cy="100"
                  rx="75"
                  ry="28"
                  fill="none"
                  stroke="#66BB2A"
                  strokeWidth="1.5"
                  transform="rotate(-35 100 100)"
                  className="rf-polygon-orbit-2"
                />

                <polygon
                  points="100,68 132,100 100,132 68,100"
                  fill="rgba(102, 187, 42, 0.22)"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="rf-polygon-core-gem"
                />

                <circle cx="100" cy="16" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                <circle cx="173" cy="58" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                <circle cx="184" cy="100" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                <circle cx="173" cy="142" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                <circle cx="100" cy="184" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                <circle cx="27" cy="142" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                <circle cx="16" cy="100" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />
                <circle cx="27" cy="58" r="3.5" fill="#FFFFFF" stroke="#66BB2A" strokeWidth="1.5" />

                <circle cx="100" cy="100" r="6" fill="#86EFAC" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="rf-ai-search-loading-text">
            <span className="rf-ai-search-loading-label">
              <Sparkles size={16} className="rf-ai-search-pulse-icon" />
              Matching verified talent for your brief
            </span>
            <h3 className="rf-ai-search-loading-query">Preparing your personalized shortlist...</h3>
          </div>
        </div>
      )}

      {/* =========================================================================
         PHASE 4: YOUR PERSONALIZED RESULTS (EXACTLY MATCHING USER'S INSPIRATION IMAGES)
         ========================================================================= */}
      {phase === 'personalized_results' && (
        <div className="rf-personalized-page-wrapper">
          {/* Top Bar with Exit Button */}
          <div className="rf-personalized-topbar">
            <button
              type="button"
              onClick={onClose}
              className="rf-personalized-exit-btn"
              aria-label="Exit results"
            >
              Exit
            </button>
          </div>

          <div className="rf-personalized-main-content">
            {/* Header: Query Subtitle & Headline + Filter Badges */}
            <div className="rf-personalized-header-row">
              <div className="rf-personalized-header-left">
                <span className="rf-personalized-query-quote">
                  “{jobDetails || (searchQuery ? `Creative Director For A ${searchQuery} Refresh` : 'Creative Director For A Brand Identity Refresh')}”
                </span>
                <h1 className="rf-personalized-title">Your personalized results</h1>
              </div>

              {/* Filter Pills on Right */}
              <div className="rf-personalized-filter-pills">
                <button
                  type="button"
                  onClick={() => setFilterAvailableOnly(!filterAvailableOnly)}
                  className={`rf-pr-filter-pill ${filterAvailableOnly ? 'is-active' : ''}`}
                >
                  <span>Available now</span>
                </button>

                <div className="rf-pr-dropdown-anchor">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'rate' ? null : 'rate')}
                    className="rf-pr-filter-pill"
                  >
                    <span>Rate ({budgetType === 'hourly' ? `$${hourlyRate}/hr` : `$${fixedBudget}`})</span>
                    <ChevronDown size={14} />
                  </button>
                  {activeDropdown === 'rate' && (
                    <div className="rf-pr-dropdown-menu">
                      <div className="rf-pr-dropdown-item">Budget: {budgetType === 'hourly' ? `$${hourlyRate}/hr` : `$${fixedBudget} fixed`}</div>
                      <div className="rf-pr-dropdown-sub">Configured in your briefing</div>
                    </div>
                  )}
                </div>

                <div className="rf-pr-dropdown-anchor">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                    className="rf-pr-filter-pill"
                  >
                    <span>Location (1)</span>
                    <ChevronDown size={14} />
                  </button>
                  {activeDropdown === 'location' && (
                    <div className="rf-pr-dropdown-menu">
                      <div className="rf-pr-dropdown-item">{locationPref}</div>
                    </div>
                  )}
                </div>

                <div className="rf-pr-dropdown-anchor">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'skills' ? null : 'skills')}
                    className="rf-pr-filter-pill"
                  >
                    <span>Skills ({selectedSkills.length || 3})</span>
                    <ChevronDown size={14} />
                  </button>
                  {activeDropdown === 'skills' && (
                    <div className="rf-pr-dropdown-menu">
                      {selectedSkills.slice(0, 4).map((s, idx) => (
                        <div key={idx} className="rf-pr-dropdown-item">✓ {s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===================================================================
                SECTION 1: 3x2 TALENT CARDS GRID
                =================================================================== */}
            <div className="rf-personalized-talent-grid">
              {displayedPersonalizedTalents.map((talent) => (
                <div
                  key={talent.id}
                  className="rf-pr-talent-card"
                  onClick={() => {
                    onClose();
                    onNavigate(`/profile/${talent.id}`);
                  }}
                  title={`View ${talent.fullName}'s verified profile`}
                >
                  {/* Top Profile Summary */}
                  <div className="rf-pr-talent-top">
                    <div className="rf-pr-avatar-wrap">
                      <img
                        src={talent.avatar}
                        alt={talent.fullName}
                        className="rf-pr-avatar-img"
                        loading="lazy"
                      />
                      {/* Top-Left Online Dot */}
                      <span className={`rf-pr-online-dot ${talent.isOnline ? 'is-online' : 'is-offline'}`} />
                      
                      {/* Bottom-Right Badge Icon */}
                      <span className={`rf-pr-badge-icon ${talent.badgeType}`}>
                        {talent.badgeType === 'arrow-green' && <ArrowRight size={13} className="rf-arrow-up-rotate" />}
                        {talent.badgeType === 'crown-gold' && <span className="rf-crown-icon">👑</span>}
                        {talent.badgeType === 'star-pink' && <Star size={11} fill="#FFFFFF" color="#FFFFFF" />}
                        {talent.badgeType === 'star-blue' && <Star size={11} fill="#FFFFFF" color="#FFFFFF" />}
                      </span>
                    </div>

                    <div className="rf-pr-talent-meta">
                      <h3 className="rf-pr-talent-name">{talent.name}</h3>
                      <div className="rf-pr-talent-rate">$ {talent.rate}/hr</div>
                      <div className="rf-pr-talent-rating">
                        <Star size={14} fill="#F6B21A" color="#F6B21A" />
                        <span className="rf-pr-rating-num">{talent.rating}</span>
                        <span className="rf-pr-review-count">({talent.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Badges Row 1: Great Match & Available Now */}
                  <div className="rf-pr-badges-row-1">
                    <div className="rf-pr-badge-pill">
                      <Medal size={14} className="rf-pr-medal-icon" />
                      <span>Great match</span>
                    </div>
                    {talent.availableNow && (
                      <div className="rf-pr-badge-pill is-available">
                        <Check size={14} className="rf-pr-check-icon" />
                        <span>Available now</span>
                      </div>
                    )}
                  </div>

                  {/* Middle Badges Row 2: Skills Match */}
                  <div className="rf-pr-badges-row-2">
                    <div className="rf-pr-skills-pill">
                      <Check size={14} className="rf-pr-check-icon" />
                      <span>{talent.skillsMatched}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Centered CTA: View more matching talent */}
            <div className="rf-personalized-more-action">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('/marketplace');
                }}
                className="rf-personalized-view-more-btn"
              >
                View more matching talent
              </button>
            </div>

            {/* ===================================================================
                SECTION 2: SPLIT BANNER ("Post your job for free")
                =================================================================== */}
            <div className="rf-personalized-banner-card">
              <div className="rf-pr-banner-left">
                {/* 90% Progress Ring Gauge Icon */}
                <div className="rf-pr-banner-gauge-circle">
                  <svg viewBox="0 0 44 44" className="rf-pr-gauge-svg">
                    <circle cx="22" cy="22" r="17" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                    <circle
                      cx="22"
                      cy="22"
                      r="17"
                      fill="none"
                      stroke="#111827"
                      strokeWidth="3.2"
                      strokeDasharray="96 15"
                      strokeLinecap="round"
                    />
                  </svg>
                  <Pin size={17} className="rf-pr-gauge-pin" />
                </div>

                <h2 className="rf-pr-banner-title">
                  Post your job for free and let freelancers come to you
                </h2>
                <p className="rf-pr-banner-sub">It's 90% complete!</p>

                <div className="rf-pr-banner-features">
                  <div className="rf-pr-banner-feature-item">
                    <UserCheck size={18} className="rf-pr-feat-icon" />
                    <span>See who applies and interview top freelancers</span>
                  </div>
                  <div className="rf-pr-banner-feature-item">
                    <CreditCard size={18} className="rf-pr-feat-icon" />
                    <span>5% platform fee only if you hire</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('/job-board');
                  }}
                  className="rf-pr-banner-cta-btn"
                >
                  Finish your job post
                </button>
              </div>

              <div className="rf-pr-banner-right">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
                  alt="Professional freelancer smiling at desk"
                  className="rf-pr-banner-image"
                  loading="lazy"
                />
              </div>
            </div>

            {/* ===================================================================
                SECTION 3: TRUSTED CLIENT LOGOS
                =================================================================== */}
            <div className="rf-personalized-logos-row">
              <div className="rf-pr-logo-item">
                <svg width="120" height="28" viewBox="0 0 120 28" fill="none">
                  <rect x="0" y="3" width="9" height="9" fill="#71717A" />
                  <rect x="12" y="3" width="9" height="9" fill="#71717A" />
                  <rect x="0" y="15" width="9" height="9" fill="#71717A" />
                  <rect x="12" y="15" width="9" height="9" fill="#71717A" />
                  <text x="27" y="18" fill="#71717A" fontSize="15" fontWeight="600" fontFamily="system-ui, sans-serif">Microsoft</text>
                </svg>
              </div>

              <div className="rf-pr-logo-item">
                <span className="rf-pr-logo-text-airbnb">airbnb</span>
              </div>

              <div className="rf-pr-logo-item">
                <span className="rf-pr-logo-text-bissell">BISSELL</span>
              </div>

              <div className="rf-pr-logo-item">
                <span className="rf-pr-logo-text-glassdoor">'GLASSDOOR'</span>
              </div>
            </div>

            {/* ===================================================================
                SECTION 4: "HOW HIRING WORKS" WITH VIDEO & ACCORDION
                =================================================================== */}
            <div className="rf-personalized-how-it-works-grid">
              {/* Left Column: Interactive Video Player Card */}
              <div className="rf-pr-video-card">
                <div className="rf-pr-video-screen">
                  {/* Subtle video ambient backdrop */}
                  <div className="rf-pr-video-backdrop" />

                  {/* Upwork/Refeir styled center logo */}
                  <div className="rf-pr-video-brand-center">
                    <span className="rf-pr-video-logo">refeir</span>
                  </div>

                  {/* Bottom Video Controls Bar */}
                  <div className="rf-pr-video-controls">
                    <button
                      type="button"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="rf-pr-video-ctrl-btn"
                      aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                    >
                      {isVideoPlaying ? <Pause size={15} /> : <Play size={15} />}
                    </button>

                    <div className="rf-pr-video-time">0:03 / 0:32</div>

                    {/* Progress track */}
                    <div className="rf-pr-video-scrubber">
                      <div className="rf-pr-video-scrub-fill" style={{ width: '12%' }} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="rf-pr-video-ctrl-btn"
                      aria-label="Toggle mute"
                    >
                      {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>

                    <button
                      type="button"
                      className="rf-pr-video-ctrl-btn"
                      aria-label="Toggle fullscreen"
                    >
                      <Maximize2 size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Numbered Steps Accordion & Actions */}
              <div className="rf-pr-how-right">
                <h2 className="rf-pr-how-title">How hiring works</h2>

                <div className="rf-pr-accordion-list">
                  {/* Step 1 */}
                  <div className="rf-pr-accordion-item">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
                      className="rf-pr-accordion-header"
                    >
                      <div className="rf-pr-accordion-header-left">
                        <span className="rf-pr-step-num">1</span>
                        <span className="rf-pr-step-text">Post your job or project</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`rf-pr-chevron ${openAccordion === 1 ? 'is-rotated' : ''}`}
                      />
                    </button>
                    {openAccordion === 1 && (
                      <div className="rf-pr-accordion-body">
                        Describe what you need, set your timeline and budget, and get personalized proposals from vetted experts within hours.
                      </div>
                    )}
                  </div>

                  {/* Step 2 */}
                  <div className="rf-pr-accordion-item">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)}
                      className="rf-pr-accordion-header"
                    >
                      <div className="rf-pr-accordion-header-left">
                        <span className="rf-pr-step-num">2</span>
                        <span className="rf-pr-step-text">Contact and hire top freelancers</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`rf-pr-chevron ${openAccordion === 2 ? 'is-rotated' : ''}`}
                      />
                    </button>
                    {openAccordion === 2 && (
                      <div className="rf-pr-accordion-body">
                        Interview candidates, review verified portfolios and client feedback, and begin collaboration protected by smart contracts.
                      </div>
                    )}
                  </div>

                  {/* Step 3 */}
                  <div className="rf-pr-accordion-item">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(openAccordion === 3 ? null : 3)}
                      className="rf-pr-accordion-header"
                    >
                      <div className="rf-pr-accordion-header-left">
                        <span className="rf-pr-step-num">3</span>
                        <span className="rf-pr-step-text">Pay securely, once work is delivered</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`rf-pr-chevron ${openAccordion === 3 ? 'is-rotated' : ''}`}
                      />
                    </button>
                    {openAccordion === 3 && (
                      <div className="rf-pr-accordion-body">
                        Deposit funds securely in escrow. You only release payment when work is delivered to your complete satisfaction.
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary & Secondary Action Buttons */}
                <div className="rf-pr-how-actions">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('/job-board');
                    }}
                    className="rf-pr-how-post-btn"
                  >
                    Post your job
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('/pricing');
                    }}
                    className="rf-pr-how-plans-btn"
                  >
                    Plans and pricing
                  </button>
                </div>
              </div>
            </div>

            {/* ===================================================================
                SECTION 5: MINIMALIST DARK FOOTER (IMAGE 4)
                =================================================================== */}
            <div className="rf-personalized-footer-bar">
              <div className="rf-pr-footer-content">
                <span>© 2015 - 2026 Refeir® Global Inc. • </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('/privacy');
                  }}
                  className="rf-pr-footer-link"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
