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
  Compass,
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
  FileText,
  Pin,
  ShieldCheck,
  Share2
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
  const [filterRateBracket, setFilterRateBracket] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [openAccordion, setOpenAccordion] = useState<number | null>(1);
  const [openScoutAccordion, setOpenScoutAccordion] = useState<number | null>(1);
  const [activeDropdown, setActiveDropdown] = useState<'rate' | 'location' | 'skills' | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const filterPillsRef = useRef<HTMLDivElement>(null);

  // Close filter dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterPillsRef.current && !filterPillsRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

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

  // Lock body & html scroll while modal is active so background page doesn't show frozen scrollbar
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
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

  // Example brief ideas for Step 4
  const exampleBriefs = [
    `Creative director for a brand identity refresh, modern visual guidelines, and design deliverables.`,
    `Senior Figma designer to deliver responsive high-converting landing page prototypes with design tokens.`,
    `Full-lifecycle specialist to build clean architecture, optimize conversions, and ensure on-time delivery.`
  ];

  // Curated 6 Verified Pan-African Talents for the Refeir Personalized Results Page
  const personalizedTalentRoster = [
    {
      id: 'talent-taib-b',
      name: 'Taib B.',
      fullName: 'Taib Benani',
      role: 'AI Chatbot & Workflow Architect',
      country: 'Morocco',
      flag: '🇲🇦',
      city: 'Casablanca',
      rate: 20,
      rating: 4.9,
      reviewsCount: 144,
      avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=400&q=80',
      availableNow: true,
      matchPercentage: 98,
      bountyPercent: 12,
      skills: ['OpenAI & Claude', 'Make.com', 'LangChain'],
      isOnline: true
    },
    {
      id: 'talent-carla-i',
      name: 'Carla I.',
      fullName: 'Carla Ibe',
      role: 'Conversational UX & AI Support Lead',
      country: 'Kenya',
      flag: '🇰🇪',
      city: 'Nairobi',
      rate: 50,
      rating: 4.8,
      reviewsCount: 47,
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
      availableNow: true,
      matchPercentage: 96,
      bountyPercent: 10,
      skills: ['Voice AI', 'Python Bots', 'HubSpot AI'],
      isOnline: true
    },
    {
      id: 'talent-axel-b',
      name: 'Axel B.',
      fullName: 'Axel Boateng',
      role: 'Enterprise LLM & Agentic Systems Engineer',
      country: 'Ghana',
      flag: '🇬🇭',
      city: 'Accra',
      rate: 75,
      rating: 5.0,
      reviewsCount: 283,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      availableNow: false,
      matchPercentage: 95,
      bountyPercent: 15,
      skills: ['Autonomous Agents', 'Vector DB', 'RAG Pipelines'],
      isOnline: false
    },
    {
      id: 'talent-lisa-a',
      name: 'Lisa A.',
      fullName: 'Lisa Adeleke',
      role: 'Full-Stack AI Developer & Bot Specialist',
      country: 'Nigeria',
      flag: '🇳🇬',
      city: 'Lagos',
      rate: 65,
      rating: 5.0,
      reviewsCount: 62,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      availableNow: true,
      matchPercentage: 97,
      bountyPercent: 10,
      skills: ['Next.js AI', 'FastAPI', 'Custom LLMs'],
      isOnline: true
    },
    {
      id: 'talent-artur-m',
      name: 'Artur M.',
      fullName: 'Artur Mensah',
      role: 'Support Automation & NLP Engineer',
      country: 'South Africa',
      flag: '🇿🇦',
      city: 'Johannesburg',
      rate: 40,
      rating: 4.9,
      reviewsCount: 165,
      avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=400&q=80',
      availableNow: true,
      matchPercentage: 94,
      bountyPercent: 12,
      skills: ['Dialogflow CX', 'CRM Bots', 'Python'],
      isOnline: true
    },
    {
      id: 'talent-zofia-c',
      name: 'Zofia C.',
      fullName: 'Zofia Chinedu',
      role: 'AI Customer Operations & RAG Specialist',
      country: 'Rwanda',
      flag: '🇷🇼',
      city: 'Kigali',
      rate: 36,
      rating: 5.0,
      reviewsCount: 28,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      availableNow: false,
      matchPercentage: 93,
      bountyPercent: 10,
      skills: ['Fine-Tuning', 'Zendesk AI', 'LangSmith'],
      isOnline: false
    }
  ];

  const displayedPersonalizedTalents = useMemo(() => {
    return personalizedTalentRoster.filter(talent => {
      // 1. Availability filter
      if (filterAvailableOnly && !talent.availableNow) {
        return false;
      }

      // 2. Rate bracket filter
      if (filterRateBracket === 'under-35' && talent.rate >= 35) {
        return false;
      }
      if (filterRateBracket === '35-50' && (talent.rate < 35 || talent.rate > 50)) {
        return false;
      }
      if (filterRateBracket === '50-70' && (talent.rate < 50 || talent.rate > 70)) {
        return false;
      }
      if (filterRateBracket === '70-plus' && talent.rate < 70) {
        return false;
      }

      // 3. Location filter
      if (filterLocation !== 'all' && talent.country.toLowerCase() !== filterLocation.toLowerCase()) {
        return false;
      }

      // 4. Skill filter
      if (filterSkill !== 'all') {
        const matchesSkill = talent.skills.some(s => 
          s.toLowerCase().includes(filterSkill.toLowerCase()) || 
          filterSkill.toLowerCase().includes(s.toLowerCase())
        );
        if (!matchesSkill) return false;
      }

      return true;
    });
  }, [filterAvailableOnly, filterRateBracket, filterLocation, filterSkill, personalizedTalentRoster]);

  const hasActiveFilters = filterAvailableOnly || filterRateBracket !== 'all' || filterLocation !== 'all' || filterSkill !== 'all';

  const handleResetFilters = () => {
    setFilterAvailableOnly(false);
    setFilterRateBracket('all');
    setFilterLocation('all');
    setFilterSkill('all');
    setActiveDropdown(null);
  };

  const getRateButtonLabel = () => {
    switch (filterRateBracket) {
      case 'under-35': return 'Rate (<$35/hr)';
      case '35-50': return 'Rate ($35–$50/hr)';
      case '50-70': return 'Rate ($50–$70/hr)';
      case '70-plus': return 'Rate ($70+/hr)';
      default: return `Rate (${budgetType === 'hourly' ? `$${hourlyRate}/hr` : `$${fixedBudget}`})`;
    }
  };

  const getLocationButtonLabel = () => {
    if (filterLocation === 'all') return 'Location (Africa-wide)';
    const flags: Record<string, string> = {
      Nigeria: '🇳🇬',
      Kenya: '🇰🇪',
      'South Africa': '🇿🇦',
      Ghana: '🇬🇭',
      Morocco: '🇲🇦',
      Rwanda: '🇷🇼'
    };
    return `Location (${filterLocation} ${flags[filterLocation] || ''})`;
  };

  const getSkillsButtonLabel = () => {
    if (filterSkill === 'all') return `Skills (${selectedSkills.length || 3})`;
    return `Skill (${filterSkill})`;
  };

  if (!isOpen) return null;

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
                <Compass size={16} className="rf-ai-search-pulse-icon" />
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
                      rows={4}
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
              <Compass size={16} className="rf-ai-search-pulse-icon" />
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
            {/* Header: Refeir Brand Header & Filter Badges */}
            <div className="rf-personalized-header-row">
              <div className="rf-personalized-header-left">
                <h1 className="rf-personalized-title">Your matched specialists</h1>
                <p className="rf-personalized-query-quote">
                  Curated based on your brief: “{jobDetails || (searchQuery ? searchQuery : 'AI chatbot developer for support automation')}”
                </p>
              </div>

              {/* Filter Pills on Right */}
              <div className="rf-personalized-filter-pills" ref={filterPillsRef}>
                <button
                  type="button"
                  onClick={() => setFilterAvailableOnly(!filterAvailableOnly)}
                  className={`rf-pr-filter-pill ${filterAvailableOnly ? 'is-active' : ''}`}
                >
                  <span className="rf-filter-dot" />
                  <span>Available now</span>
                </button>

                {/* Rate Filter Dropdown */}
                <div className="rf-pr-dropdown-anchor">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'rate' ? null : 'rate')}
                    className={`rf-pr-filter-pill ${filterRateBracket !== 'all' || activeDropdown === 'rate' ? 'is-active' : ''}`}
                  >
                    <DollarSign size={12} strokeWidth={1.8} />
                    <span>{getRateButtonLabel()}</span>
                    <ChevronDown size={12} strokeWidth={1.8} style={{ transform: activeDropdown === 'rate' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  </button>
                  {activeDropdown === 'rate' && (
                    <div className="rf-pr-dropdown-menu">
                      <div className="rf-pr-dropdown-header">Hourly Rates</div>
                      {[
                        { id: 'all', label: 'All Rates', sub: '$20 – $75+/hr across Africa' },
                        { id: 'under-35', label: 'Under $35/hr', sub: 'Budget-friendly specialists' },
                        { id: '35-50', label: '$35 – $50/hr', sub: 'Mid-tier vetted specialists' },
                        { id: '50-70', label: '$50 – $70/hr', sub: 'Senior AI & bot architects' },
                        { id: '70-plus', label: '$70+/hr', sub: 'Lead & enterprise systems' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setFilterRateBracket(opt.id);
                            setActiveDropdown(null);
                          }}
                          className={`rf-pr-dropdown-option ${filterRateBracket === opt.id ? 'is-selected' : ''}`}
                        >
                          <div>
                            <div className="rf-pr-opt-label">{opt.label}</div>
                            <div className="rf-pr-opt-sub">{opt.sub}</div>
                          </div>
                          {filterRateBracket === opt.id && (
                            <span className="rf-pr-opt-check"><Check size={14} strokeWidth={2.5} /></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Filter Dropdown */}
                <div className="rf-pr-dropdown-anchor">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                    className={`rf-pr-filter-pill ${filterLocation !== 'all' || activeDropdown === 'location' ? 'is-active' : ''}`}
                  >
                    <span>{getLocationButtonLabel()}</span>
                    <ChevronDown size={12} strokeWidth={1.8} style={{ transform: activeDropdown === 'location' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  </button>
                  {activeDropdown === 'location' && (
                    <div className="rf-pr-dropdown-menu">
                      <div className="rf-pr-dropdown-header">Talent Country</div>
                      {[
                        { id: 'all', label: 'Africa-wide (All)', flag: '🌍', sub: 'Pan-African network' },
                        { id: 'Nigeria', label: 'Nigeria', flag: '🇳🇬', sub: 'Lagos & Abuja' },
                        { id: 'Kenya', label: 'Kenya', flag: '🇰🇪', sub: 'Nairobi tech hub' },
                        { id: 'South Africa', label: 'South Africa', flag: '🇿🇦', sub: 'Johannesburg & Cape Town' },
                        { id: 'Ghana', label: 'Ghana', flag: '🇬🇭', sub: 'Accra innovation pro' },
                        { id: 'Morocco', label: 'Morocco', flag: '🇲🇦', sub: 'Casablanca & Rabat' },
                        { id: 'Rwanda', label: 'Rwanda', flag: '🇷🇼', sub: 'Kigali AI specialists' },
                      ].map(loc => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => {
                            setFilterLocation(loc.id);
                            setActiveDropdown(null);
                          }}
                          className={`rf-pr-dropdown-option ${filterLocation === loc.id ? 'is-selected' : ''}`}
                        >
                          <div>
                            <div className="rf-pr-opt-label">{loc.flag} {loc.label}</div>
                            <div className="rf-pr-opt-sub">{loc.sub}</div>
                          </div>
                          {filterLocation === loc.id && (
                            <span className="rf-pr-opt-check"><Check size={14} strokeWidth={2.5} /></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills Filter Dropdown */}
                <div className="rf-pr-dropdown-anchor">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'skills' ? null : 'skills')}
                    className={`rf-pr-filter-pill ${filterSkill !== 'all' || activeDropdown === 'skills' ? 'is-active' : ''}`}
                  >
                    <Sliders size={12} strokeWidth={1.8} />
                    <span>{getSkillsButtonLabel()}</span>
                    <ChevronDown size={12} strokeWidth={1.8} style={{ transform: activeDropdown === 'skills' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  </button>
                  {activeDropdown === 'skills' && (
                    <div className="rf-pr-dropdown-menu">
                      <div className="rf-pr-dropdown-header">Specialization Domain</div>
                      {[
                        { id: 'all', label: 'All Specializations', sub: 'All matched skills' },
                        { id: 'OpenAI', label: 'OpenAI & Claude LLMs', sub: 'Prompt chains & assistants' },
                        { id: 'Voice AI', label: 'Voice AI & Speech', sub: 'Conversational audio agents' },
                        { id: 'Agents', label: 'Autonomous Agents & RAG', sub: 'Multi-agent systems & Vector DB' },
                        { id: 'Custom LLMs', label: 'Custom LLMs & APIs', sub: 'FastAPI, Next.js & fine-tuning' },
                        { id: 'Bots', label: 'Support Automation & CRM', sub: 'Zendesk, Dialogflow CX, HubSpot' },
                        { id: 'Make.com', label: 'Make.com & Workflows', sub: 'No-code integration' },
                      ].map(sk => (
                        <button
                          key={sk.id}
                          type="button"
                          onClick={() => {
                            setFilterSkill(sk.id);
                            setActiveDropdown(null);
                          }}
                          className={`rf-pr-dropdown-option ${filterSkill === sk.id ? 'is-selected' : ''}`}
                        >
                          <div>
                            <div className="rf-pr-opt-label">{sk.label}</div>
                            <div className="rf-pr-opt-sub">{sk.sub}</div>
                          </div>
                          {filterSkill === sk.id && (
                            <span className="rf-pr-opt-check"><Check size={14} strokeWidth={2.5} /></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clear Filters Reset Pill */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="rf-pr-clear-all-pill"
                    title="Reset all filters"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* ===================================================================
                SECTION 1: REFEIR PAN-AFRICAN TALENT CARDS GRID (3x2)
                =================================================================== */}
            {displayedPersonalizedTalents.length === 0 ? (
              <div className="rf-pr-empty-filter-state">
                <p className="rf-pr-empty-title">No specialists match your exact filters</p>
                <p className="rf-pr-empty-sub">Try broadening your rate bracket, country, or skill domain to explore more verified professionals.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rf-pr-reset-filters-btn"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="rf-refeir-talent-grid">
              {displayedPersonalizedTalents.map((talent) => (
                <div
                  key={talent.id}
                  className="rf-refeir-talent-card"
                >
                  {/* Card Top: Avatar, Location, Match Score */}
                  <div className="rf-refeir-card-header">
                    <div className="rf-refeir-avatar-box">
                      <img
                        src={talent.avatar}
                        alt={talent.fullName}
                        className="rf-refeir-avatar-img"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <span className={`rf-refeir-online-pulse ${talent.isOnline ? 'is-online' : 'is-offline'}`} title={talent.isOnline ? 'Active now' : 'Offline'} />
                    </div>

                    <div className="rf-refeir-header-meta">
                      <div className="rf-refeir-name-row">
                        <h3 className="rf-refeir-talent-name">{talent.fullName}</h3>
                        <span className="rf-refeir-verified-badge" title="Refeir Verified Pro">
                          <ShieldCheck size={12} strokeWidth={2} className="rf-shield-icon" />
                          <span>Verified</span>
                        </span>
                      </div>

                      <div className="rf-refeir-location-row">
                        <span className="rf-refeir-country-flag">{talent.flag}</span>
                        <span className="rf-refeir-city">{talent.city}, {talent.country}</span>
                      </div>

                      <p className="rf-refeir-talent-role">{talent.role}</p>
                    </div>

                    {/* AI Match Badge (Clean & Minimalist) */}
                    <div className="rf-refeir-match-badge" title="AI Match Confidence based on your brief">
                      <span>{talent.matchPercentage}% Match</span>
                    </div>
                  </div>

                  {/* Metrics Bar: Rate, Rating, Availability */}
                  <div className="rf-refeir-card-metrics">
                    <div className="rf-refeir-metric-item">
                      <span className="rf-metric-label">Rate</span>
                      <span className="rf-metric-value">${talent.rate}<span className="rf-metric-unit">/hr</span></span>
                    </div>
                    <div className="rf-refeir-metric-divider" />
                    <div className="rf-refeir-metric-item">
                      <span className="rf-metric-label">Rating</span>
                      <span className="rf-metric-value">
                        <Star size={11} fill="#F59E0B" color="#F59E0B" strokeWidth={1.5} style={{ marginRight: '3px' }} />
                        {talent.rating}
                        <span className="rf-metric-sub">({talent.reviewsCount})</span>
                      </span>
                    </div>
                    <div className="rf-refeir-metric-divider" />
                    <div className="rf-refeir-metric-item">
                      <span className="rf-metric-label">Status</span>
                      <span className={`rf-metric-status ${talent.availableNow ? 'is-available' : 'is-queued'}`}>
                        {talent.availableNow ? 'Available' : 'Next week'}
                      </span>
                    </div>
                  </div>

                  {/* Matched Skill Tags */}
                  <div className="rf-refeir-skills-row">
                    {talent.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="rf-refeir-skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Signature Refeir Referral Bounty Strip */}
                  <div className="rf-refeir-bounty-strip">
                    <Share2 size={12} strokeWidth={1.8} className="rf-bounty-mini-icon" />
                    <span className="rf-bounty-text">
                      <strong>{talent.bountyPercent}% Referral Bounty</strong> for client scouts
                    </span>
                  </div>

                  {/* Action Footer: View Profile + Refer & Earn */}
                  <div className="rf-refeir-card-actions">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigate(`/talent/${talent.id}`);
                      }}
                      className="rf-refeir-hire-btn"
                    >
                      <span>View Profile & Hire</span>
                      <ArrowRight size={13} strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigate(`/talent/${talent.id}?refer=true`);
                      }}
                      className="rf-refeir-refer-btn"
                      title="Refer this talent and earn bounty"
                    >
                      <Share2 size={12} strokeWidth={1.8} />
                      <span>Refer & Earn</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Centered CTA: Explore Full Pan-African Marketplace */}
            <div className="rf-personalized-more-action">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('/marketplace');
                }}
                className="rf-refeir-explore-all-btn"
              >
                <span>Explore All Pan-African Specialists</span>
                <ArrowRight size={14} strokeWidth={1.8} />
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
                    onNavigate('/jobs');
                  }}
                  className="rf-pr-banner-cta-btn"
                >
                  Finish your job post
                </button>
              </div>

              <div className="rf-pr-banner-right">
                <img
                  src="/african_woman_headset.jpg"
                  alt="African specialist with hands-free headset"
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
                      onNavigate('/jobs');
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

            {/* ===================================================================
                SECTION 4B: "OR YOU CAN GET SCOUTS TO DO THE JOB FOR YOU"
                =================================================================== */}
            <div className="rf-scouts-how-it-works-grid">
              {/* Left Column: Scout Concierge Feature Card */}
              <div className="rf-scout-feature-card">
                <div className="rf-scout-card-top">
                  <span className="rf-scout-card-tag">REFEIR SCOUT NETWORK</span>
                  <span className="rf-scout-card-status">Direct Introductions</span>
                </div>

                <div className="rf-scout-card-center">
                  <div className="rf-scout-card-quote">"Don't search. Get introduced."</div>
                  <p className="rf-scout-card-desc">
                    Tell our Scouts who you need. We source and introduce pre-vetted specialists directly from trusted personal networks.
                  </p>
                </div>

                <div className="rf-scout-card-bottom">
                  <div className="rf-scout-card-metric">
                    <span className="rf-scout-metric-val">24–48h</span>
                    <span className="rf-scout-metric-lbl">Curated shortlist</span>
                  </div>
                  <div className="rf-scout-card-divider" />
                  <div className="rf-scout-card-metric">
                    <span className="rf-scout-metric-val">100%</span>
                    <span className="rf-scout-metric-lbl">Peer recommended</span>
                  </div>
                  <div className="rf-scout-card-divider" />
                  <div className="rf-scout-card-metric">
                    <span className="rf-scout-metric-val">0</span>
                    <span className="rf-scout-metric-lbl">Proposal spam</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Numbered Steps & Actions */}
              <div className="rf-pr-how-right">
                <h2 className="rf-pr-how-title">Or you can get Scouts to do the job for you</h2>

                <div className="rf-pr-accordion-list">
                  {/* Step 1 */}
                  <div className="rf-pr-accordion-item">
                    <button
                      type="button"
                      onClick={() => setOpenScoutAccordion(openScoutAccordion === 1 ? null : 1)}
                      className="rf-pr-accordion-header"
                    >
                      <div className="rf-pr-accordion-header-left">
                        <span className="rf-pr-step-num">1</span>
                        <span className="rf-pr-step-text">Share your brief with a Scout</span>
                      </div>
                      <span className="rf-scout-toggle-sign">{openScoutAccordion === 1 ? '−' : '+'}</span>
                    </button>
                    {openScoutAccordion === 1 && (
                      <div className="rf-pr-accordion-body">
                        Tell us what you're building, the skills you need, and your target budget. Our scout desk routes your brief to domain specialists with zero public noise.
                      </div>
                    )}
                  </div>

                  {/* Step 2 */}
                  <div className="rf-pr-accordion-item">
                    <button
                      type="button"
                      onClick={() => setOpenScoutAccordion(openScoutAccordion === 2 ? null : 2)}
                      className="rf-pr-accordion-header"
                    >
                      <div className="rf-pr-accordion-header-left">
                        <span className="rf-pr-step-num">2</span>
                        <span className="rf-pr-step-text">Scouts tap their private networks</span>
                      </div>
                      <span className="rf-scout-toggle-sign">{openScoutAccordion === 2 ? '−' : '+'}</span>
                    </button>
                    {openScoutAccordion === 2 && (
                      <div className="rf-pr-accordion-body">
                        Certified scouts search private talent circles and recommend specialists who have proven, verifiable track records and authentic proof of work.
                      </div>
                    )}
                  </div>

                  {/* Step 3 */}
                  <div className="rf-pr-accordion-item">
                    <button
                      type="button"
                      onClick={() => setOpenScoutAccordion(openScoutAccordion === 3 ? null : 3)}
                      className="rf-pr-accordion-header"
                    >
                      <div className="rf-pr-accordion-header-left">
                        <span className="rf-pr-step-num">3</span>
                        <span className="rf-pr-step-text">Hire vetted talent with confidence</span>
                      </div>
                      <span className="rf-scout-toggle-sign">{openScoutAccordion === 3 ? '−' : '+'}</span>
                    </button>
                    {openScoutAccordion === 3 && (
                      <div className="rf-pr-accordion-body">
                        Receive a curated shortlist of 2–3 ready-to-interview specialists and begin work immediately, protected by Refeir milestone escrow.
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
                      onNavigate('/scouts');
                    }}
                    className="rf-pr-how-post-btn"
                  >
                    Get Scouts to find talent
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('/scouts');
                    }}
                    className="rf-pr-how-plans-btn"
                  >
                    Learn about Scouts
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================
              SECTION 5: MINIMALIST DARK FOOTER (IMAGE 4)
              =================================================================== */}
          <div className="rf-personalized-footer-bar">
            <div className="rf-pr-footer-content">
              <span>© 2016 - 2017 Refeir Technologies Ltd. • </span>
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
      )}
    </div>
  );
};
