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
  Share2,
  Briefcase,
  Copy,
  CheckCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SEED_TALENT } from '../../data/seedTalent';
import { SEED_JOBS } from '../../data/seedJobs';
import { formatMoney } from '../../data/currencies';
import { TalentProfile, Job } from '../../types';

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

  // Intent-Specific Briefing Choices
  const [workAvailability, setWorkAvailability] = useState<string>('Available Immediately');
  const [clientScope, setClientScope] = useState<string>('Global / US & EU (USD)');
  const [networkDomain, setNetworkDomain] = useState<string>('Software & AI Engineers');
  const [networkRegion, setNetworkRegion] = useState<string>('Pan-African & Diaspora');
  const [referralVolume, setReferralVolume] = useState<number>(3);
  const [customScoutCode, setCustomScoutCode] = useState<string>('');
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);

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

  // Matching jobs for Work & Scout intents
  const matchedJobs = useMemo(() => {
    if (!searchQuery) return SEED_JOBS;
    const q = searchQuery.toLowerCase();
    const filtered = SEED_JOBS.filter(job => 
      job.title.toLowerCase().includes(q) ||
      job.category.toLowerCase().includes(q) ||
      job.skills.some(s => s.toLowerCase().includes(q)) ||
      job.description.toLowerCase().includes(q) ||
      job.client_country.toLowerCase().includes(q)
    );
    return filtered.length > 0 ? filtered : SEED_JOBS;
  }, [searchQuery]);

  // Filtered jobs for personalized view (Work & Scout)
  const displayedJobs = useMemo(() => {
    return matchedJobs.filter(job => {
      if (filterAvailableOnly && job.status !== 'OPEN') return false;
      if (filterLocation !== 'all' && !job.client_country.toLowerCase().includes(filterLocation.toLowerCase())) {
        return false;
      }
      if (filterSkill !== 'all' && !job.skills.some(s => s.toLowerCase() === filterSkill.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [matchedJobs, filterAvailableOnly, filterLocation, filterSkill]);

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

      // Pre-fill sample job details tailored to query & intent
      if (searchQuery && searchQuery.trim()) {
        const cleanQ = searchQuery.trim();
        setJobDetails(`${cleanQ.charAt(0).toUpperCase() + cleanQ.slice(1)}`);
      } else {
        if (intent === 'work') {
          setJobDetails('Full-Stack Engineer specialized in React, Node.js and AI APIs');
        } else if (intent === 'scout') {
          setJobDetails('Senior software engineers and product designers in West Africa');
        } else {
          setJobDetails('Creative Director for a brand identity refresh');
        }
      }

      if (!customScoutCode) {
        setCustomScoutCode(`RF-${Math.floor(100000 + Math.random() * 900000)}`);
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
  }, [isOpen, searchQuery, availableSkills, intent, customScoutCode]);

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

  // Dynamic loading step ticker for the modern AI loader
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);

  useEffect(() => {
    if (phase === 'loading') {
      setLoadingStepIdx(0);
      const t1 = setTimeout(() => setLoadingStepIdx(1), 600);
      const t2 = setTimeout(() => setLoadingStepIdx(2), 1250);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (phase === 'submitting') {
      setLoadingStepIdx(0);
      const t1 = setTimeout(() => setLoadingStepIdx(1), 500);
      return () => {
        clearTimeout(t1);
      };
    }
  }, [phase]);

  const getLoadingStepText = () => {
    if (phase === 'submitting') {
      if (loadingStepIdx === 0) {
        return intent === 'work'
          ? 'Scanning escrow-funded opportunities...'
          : intent === 'scout'
          ? 'Calculating referral yield tiers...'
          : 'Scoring vetted specialists...';
      }
      return intent === 'work'
        ? 'Finalizing your personalized matches...'
        : intent === 'scout'
        ? 'Unlocking top bounty contracts...'
        : 'Preparing your customized shortlist...';
    }

    // phase === 'loading'
    if (loadingStepIdx === 0) {
      return intent === 'work'
        ? 'Analyzing work preferences...'
        : intent === 'scout'
        ? 'Analyzing scout network domain...'
        : 'Analyzing brief requirements...';
    }
    if (loadingStepIdx === 1) {
      return intent === 'work'
        ? 'Scanning verified Pan-African contracts...'
        : intent === 'scout'
        ? 'Scanning high-bounty client briefs...'
        : 'Scanning verified Pan-African network...';
    }
    return intent === 'work'
      ? 'Synthesizing matching opportunities...'
      : intent === 'scout'
      ? 'Synthesizing referral opportunities...'
      : 'Synthesizing top talent matches...';
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
    }, 1100);
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

  // Copy Scout referral link handler
  const handleCopyLink = (jobId: string) => {
    const code = customScoutCode.trim() || 'RF-SCOUT-78';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://refeir.com';
    const url = `${origin}/jobs/${jobId}?ref=${code}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedJobId(jobId);
    setTimeout(() => {
      setCopiedJobId(null);
    }, 2000);
  };

  // Dynamic example brief ideas for Step 4
  const exampleBriefs = useMemo(() => {
    if (intent === 'work') {
      return [
        `Senior Full-Stack & AI developer (Python, React, TypeScript) with 5+ years building scale-up SaaS.`,
        `Product Designer specializing in design systems, mobile apps, and developer handoff.`,
        `DevOps & Cloud Engineer certified in AWS, Docker, and CI/CD pipelines.`
      ];
    }
    if (intent === 'scout') {
      return [
        `Network of 30+ vetted full-stack and mobile engineers across Lagos, Nairobi, and Accra.`,
        `Senior UI/UX and product designers with portfolio verification ready for US remote teams.`,
        `Technical leads and engineering managers open to high-yield escrow contracts.`
      ];
    }
    return [
      `Creative director for a brand identity refresh, modern visual guidelines, and design deliverables.`,
      `Senior Figma designer to deliver responsive high-converting landing page prototypes with design tokens.`,
      `Full-lifecycle specialist to build clean architecture, optimize conversions, and ensure on-time delivery.`
    ];
  }, [intent]);

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
            {/* Modern AI Refeir Intelligence Loader */}
            <div className="rf-modern-ai-loader">
              <div className="rf-loader-ambient-glow" />

              <div className="rf-loader-rings-stage">
                <svg viewBox="0 0 160 160" className="rf-loader-svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="rfModernLoaderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#22C55E" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="rfModernLoaderGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.9" />
                      <stop offset="60%" stopColor="#66BB2A" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#66BB2A" stopOpacity="0.05" />
                    </linearGradient>
                    <radialGradient id="rfModernCoreAura" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.35" />
                      <stop offset="60%" stopColor="#16A34A" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Ambient Core Radial Glow */}
                  <circle cx="80" cy="80" r="58" fill="url(#rfModernCoreAura)" className="rf-loader-aura-pulse" />

                  {/* Outer Orbital Track Guide */}
                  <circle cx="80" cy="80" r="68" fill="none" className="rf-loader-track-outer" />

                  {/* Outer Sweeping Orbital Arc */}
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    fill="none"
                    stroke="url(#rfModernLoaderGrad1)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeDasharray="250 175"
                    className="rf-loader-arc-outer"
                  />

                  {/* Middle Counter-Rotating Track & Arc */}
                  <circle cx="80" cy="80" r="48" fill="none" className="rf-loader-track-mid" />
                  <circle
                    cx="80"
                    cy="80"
                    r="48"
                    fill="none"
                    stroke="url(#rfModernLoaderGrad2)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeDasharray="165 135"
                    className="rf-loader-arc-mid"
                  />

                  {/* Inner Harmonic Wave Ring */}
                  <circle
                    cx="80"
                    cy="80"
                    r="32"
                    fill="none"
                    strokeWidth="1.5"
                    className="rf-loader-arc-inner"
                  />

                  {/* Orbiting Satellite Particle 1 */}
                  <g className="rf-loader-satellite-orbit-1">
                    <circle cx="80" cy="12" r="3.2" className="rf-loader-satellite-dot" />
                  </g>

                  {/* Orbiting Satellite Particle 2 */}
                  <g className="rf-loader-satellite-orbit-2">
                    <circle cx="80" cy="32" r="2.2" className="rf-loader-satellite-dot small" />
                  </g>
                </svg>

                {/* Center Core Glass Beacon */}
                <div className="rf-loader-core-beacon">
                  <div className="rf-core-sonar-ripple" />
                  <div className="rf-core-sonar-ripple ripple-2" />
                  <div className="rf-core-spark-center">
                    <Sparkles size={20} className="rf-core-spark-icon" />
                  </div>
                </div>
              </div>

              {/* Real-Time Live Status Pill */}
              <div className="rf-loader-status-pill">
                <span className="rf-loader-pulse-dot" />
                <span className="rf-loader-status-step">{getLoadingStepText()}</span>
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
                  <span className="rf-ai-search-score">
                    {intent === 'work' ? '4.9' : intent === 'scout' ? '4.96' : '4.8'}
                  </span>
                </div>
                <div className="rf-ai-search-rating-desc">
                  {intent === 'work'
                    ? 'Rated 4.9 / 5 by African talent'
                    : intent === 'scout'
                    ? 'Rated 4.96 / 5 by verified scouts'
                    : 'Rated 4.8 / 5 on avg.'}
                </div>
                <div className="rf-ai-search-rating-sub">
                  {intent === 'work'
                    ? 'From $1.2M+ in escrow payouts released'
                    : intent === 'scout'
                    ? 'Over $480,000 paid in referral bounties'
                    : 'From over 4k+ past clients'}
                </div>

                {/* Primary Continue Button -> Leads to the 5-Step Slides */}
                <button
                  type="button"
                  onClick={() => setPhase('briefing')}
                  className="rf-ai-search-continue-btn"
                >
                  <span>
                    {intent === 'work'
                      ? 'Personalize job matches'
                      : intent === 'scout'
                      ? 'Set up scout desk'
                      : 'Continue'}
                  </span>
                  <ArrowRight size={16} />
                </button>

                {/* Quick Context Links */}
                <div className="rf-ai-search-links-row">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate(intent === 'scout' ? '/scouts' : intent === 'work' ? '/protection' : '/why-refeir');
                    }}
                    className="rf-ai-search-link"
                  >
                    {intent === 'work' ? 'Payment protection' : intent === 'scout' ? 'How scouting works' : 'How hiring works'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate(intent === 'scout' ? '/scouts' : '/pricing');
                    }}
                    className="rf-ai-search-link"
                  >
                    {intent === 'scout' ? 'Bounty tiers & rates' : 'Platform pricing'}
                  </button>
                </div>

                {/* Footer AI Attribution */}
                <div className="rf-ai-search-footer-note">
                  <span>We use AI to power this experience.</span>
                  <Info size={14} className="rf-ai-info-icon" />
                </div>
              </div>

              {/* Right Column: Dynamic Matching Cards */}
              <div className="rf-ai-search-right-col">
                {intent === 'recruit' ? (
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
                ) : intent === 'work' ? (
                  <div className="rf-ai-preview-job-list">
                    {matchedJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="rf-ai-preview-job-item">
                        <div className="rf-ai-job-item-top">
                          <span className="rf-ai-job-item-client">{job.client_name}</span>
                          <span className="rf-ai-job-escrow-badge">Escrow Funded</span>
                        </div>
                        <div className="rf-ai-job-item-title">{job.title}</div>
                        <div className="rf-ai-job-item-footer">
                          <span className="rf-ai-job-country">🌍 {job.client_country}</span>
                          <span className="rf-ai-job-budget">{formatMoney(job.budget)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rf-ai-preview-job-list">
                    {matchedJobs.slice(0, 3).map((job) => {
                      const bountyAmt = Math.round((job.budget.amount_minor / 100) * 0.12) * 100;
                      return (
                        <div key={job.id} className="rf-ai-preview-job-item">
                          <div className="rf-ai-job-item-top">
                            <span className="rf-ai-job-item-client">{job.client_name}</span>
                            <span className="rf-ai-bounty-badge">10%–15% Bounty</span>
                          </div>
                          <div className="rf-ai-job-item-title">{job.title}</div>
                          <div className="rf-ai-job-item-footer">
                            <span className="rf-ai-job-country">🌍 {job.client_country}</span>
                            <span className="rf-ai-job-bounty-amt">Earn {formatMoney({ amount_minor: bountyAmt, currency: job.budget.currency })}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
            {/* SLIDE 1: URGENCY & TIMELINE / AVAILABILITY / TALENT DOMAIN */}
            {briefingStep === 1 && (
              <div className="rf-briefing-slide" key="step-1">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">
                    {intent === 'work'
                      ? 'When can you take on client work?'
                      : intent === 'scout'
                      ? 'What talent domain is in your network?'
                      : 'How soon do you need help?'}
                  </h2>
                  <p className="rf-briefing-subtitle">
                    {intent === 'work'
                      ? "We'll prioritize open jobs and contracts matching your availability."
                      : intent === 'scout'
                      ? "We'll surface client briefs with high referral bounties in your sweet spot."
                      : `We'll prioritize ${categoryLabel} pros that can start immediately, if needed.`}
                  </p>

                  <div className="rf-briefing-pills-row">
                    {intent === 'work'
                      ? ['Available Immediately', 'In 1–2 weeks', 'Part-Time (10–20h/wk)', 'Flexible / Weekends'].map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setWorkAvailability(option);
                              setTimeout(() => setBriefingStep(2), 220);
                            }}
                            className={`rf-briefing-pill-btn ${workAvailability === option ? 'is-active' : ''}`}
                          >
                            {option}
                          </button>
                        ))
                      : intent === 'scout'
                      ? ['Software & AI Engineers', 'Product Designers & PMs', 'Growth & Marketing', 'Multi-Disciplinary Network'].map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setNetworkDomain(option);
                              setTimeout(() => setBriefingStep(2), 220);
                            }}
                            className={`rf-briefing-pill-btn ${networkDomain === option ? 'is-active' : ''}`}
                          >
                            {option}
                          </button>
                        ))
                      : ['Now', 'In 1-2 weeks', 'No Rush'].map(option => (
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

            {/* SLIDE 2: TALENT LOCATION / CLIENT PREFERENCE / NETWORK REGION */}
            {briefingStep === 2 && (
              <div className="rf-briefing-slide" key="step-2">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">
                    {intent === 'work'
                      ? 'What kind of clients do you prefer?'
                      : intent === 'scout'
                      ? 'Where is your talent network concentrated?'
                      : 'Does talent location matter?'}
                  </h2>
                  <p className="rf-briefing-subtitle">
                    {intent === 'work'
                      ? 'Choose whether you prefer international USD contracts or fast regional projects.'
                      : intent === 'scout'
                      ? 'Connect employers to certified local and diaspora talent circles.'
                      : "We'll filter from hundreds of freelancers across 250+ countries."}
                  </p>

                  <div className="rf-briefing-pills-row">
                    {intent === 'work'
                      ? ['Global / US & EU (USD)', 'Pan-African Scale-ups', 'Local in my Country', 'Any Remote Team'].map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setClientScope(option);
                              setTimeout(() => setBriefingStep(3), 220);
                            }}
                            className={`rf-briefing-pill-btn ${clientScope === option ? 'is-active' : ''}`}
                          >
                            {option}
                          </button>
                        ))
                      : intent === 'scout'
                      ? ['Nigeria & Ghana', 'Kenya & East Africa', 'South Africa & SADC', 'Pan-African & Diaspora'].map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setNetworkRegion(option);
                              setTimeout(() => setBriefingStep(3), 220);
                            }}
                            className={`rf-briefing-pill-btn ${networkRegion === option ? 'is-active' : ''}`}
                          >
                            {option}
                          </button>
                        ))
                      : ['U.S. only', 'Near my timezone', 'Anywhere in the world'].map(option => (
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

            {/* SLIDE 3: BUDGET IN MIND / TARGET RATE / SCOUT BOUNTY CALCULATOR */}
            {briefingStep === 3 && (
              <div className="rf-briefing-slide" key="step-3">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">
                    {intent === 'work'
                      ? 'What is your target minimum compensation?'
                      : intent === 'scout'
                      ? 'What is your monthly talent referral goal?'
                      : 'Do you have a budget in mind?'}
                  </h2>
                  <p className="rf-briefing-subtitle">
                    {intent === 'work'
                      ? "We'll filter out projects below your expectations so you never undercharge."
                      : intent === 'scout'
                      ? 'Estimate your monthly earnings based on an average 12% escrow bounty ($350–$1,200 per placement).'
                      : 'This helps prioritize freelancers within your range.'}
                  </p>

                  {intent === 'scout' ? (
                    <div className="rf-briefing-calculator-container" style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>
                      <div className="rf-briefing-calculator-box">
                        <div className="rf-calc-value-big">
                          ${(referralVolume * 650).toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>/ month</span>
                        </div>
                        <div className="rf-calc-subtext">
                          Estimated passive bounty earnings for {referralVolume} {referralVolume === 1 ? 'placement' : 'placements'} per month
                        </div>
                      </div>

                      <div className="rf-briefing-slider-track-wrap" style={{ marginTop: '1.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginBottom: '0.5rem' }}>
                          <span>1 placement</span>
                          <span><strong>{referralVolume}</strong> referrals/mo</span>
                          <span>10 placements</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          step={1}
                          value={referralVolume}
                          onChange={(e) => setReferralVolume(Number(e.target.value))}
                          className="rf-briefing-range-slider"
                          aria-label="Monthly referral goal"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
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
                          <span className="rf-curve-label-affordable">{intent === 'work' ? 'Entry tier' : 'Affordable'}</span>
                          <div className="rf-curve-label-typical">
                            <span>{intent === 'work' ? 'Market average' : 'Typical'}</span>
                            <Info size={13} className="rf-curve-info-icon" />
                          </div>
                          <span className="rf-curve-label-expert">{intent === 'work' ? 'Senior lead' : 'Expert'}</span>
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
                    </>
                  )}

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

            {/* SLIDE 4: JOB DETAILS & SCOPE / PORTFOLIO SUPERPOWERS / ROLES TO VOUCH */}
            {briefingStep === 4 && (
              <div className="rf-briefing-slide" key="step-4">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">
                    {intent === 'work'
                      ? 'Highlight your portfolio or superpowers'
                      : intent === 'scout'
                      ? 'Which roles can you easily source and vouch for?'
                      : 'Any job details to share?'}
                  </h2>
                  <p className="rf-briefing-subtitle">
                    {intent === 'work'
                      ? 'Add your portfolio, GitHub, or a quick summary of what makes you stand out.'
                      : intent === 'scout'
                      ? 'Let us know the specialist roles you have trusted peers or connections for.'
                      : "We'll search for talent who have relevant experience."}
                  </p>

                  <div className="rf-briefing-textarea-box">
                    <textarea
                      rows={4}
                      value={jobDetails}
                      onChange={(e) => setJobDetails(e.target.value)}
                      placeholder={
                        intent === 'work'
                          ? 'e.g. Senior Full-Stack & AI engineer with 5 years building high-load fintech and SaaS apps...'
                          : intent === 'scout'
                          ? 'e.g. Senior backend engineers (Go/Python), AI researchers, and Head of Growth leaders in Lagos & Nairobi...'
                          : 'e.g. Creative director for a brand identity refresh'
                      }
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

            {/* SLIDE 5: SPECIFIC SKILLS / TECH STACK / SCOUT CODE & SKILLS */}
            {briefingStep === 5 && (
              <div className="rf-briefing-slide" key="step-5">
                <div className="rf-briefing-slide-inner">
                  <h2 className="rf-briefing-title">
                    {intent === 'work'
                      ? 'What are your core skills & tech stack?'
                      : intent === 'scout'
                      ? 'Customize your Refeir Scout attribution handle'
                      : 'Any specific skills required?'}
                  </h2>
                  <p className="rf-briefing-subtitle">
                    {intent === 'work'
                      ? 'Select your primary skills to match with open escrow-funded contracts.'
                      : intent === 'scout'
                      ? 'This unique handle is attached to every link you share so bounties route directly to you.'
                      : 'You can add more custom skills later, if you decide to post your job.'}
                  </p>

                  {intent === 'scout' && (
                    <div className="rf-briefing-scout-code-wrap" style={{ width: '100%', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>Scout Code:</span>
                      <input
                        type="text"
                        value={customScoutCode}
                        onChange={(e) => setCustomScoutCode(e.target.value.toUpperCase())}
                        placeholder="RF-SCOUT-78"
                        className="rf-scout-code-input"
                      />
                    </div>
                  )}

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
                      {intent === 'work'
                        ? 'Finish and view jobs'
                        : intent === 'scout'
                        ? 'Finish and view active bounties'
                        : 'Finish and view talent'}
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
          {/* Modern AI Refeir Intelligence Loader */}
          <div className="rf-modern-ai-loader">
            <div className="rf-loader-ambient-glow" />

            <div className="rf-loader-rings-stage">
              <svg viewBox="0 0 160 160" className="rf-loader-svg" aria-hidden="true">
                <defs>
                  <linearGradient id="rfModernLoaderGrad1Submit" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#22C55E" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="rfModernLoaderGrad2Submit" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#66BB2A" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#66BB2A" stopOpacity="0.05" />
                  </linearGradient>
                  <radialGradient id="rfModernCoreAuraSubmit" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#16A34A" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Ambient Core Radial Glow */}
                <circle cx="80" cy="80" r="58" fill="url(#rfModernCoreAuraSubmit)" className="rf-loader-aura-pulse" />

                {/* Outer Orbital Track Guide */}
                <circle cx="80" cy="80" r="68" fill="none" className="rf-loader-track-outer" />

                {/* Outer Sweeping Orbital Arc */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="url(#rfModernLoaderGrad1Submit)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeDasharray="250 175"
                  className="rf-loader-arc-outer"
                />

                {/* Middle Counter-Rotating Track & Arc */}
                <circle cx="80" cy="80" r="48" fill="none" className="rf-loader-track-mid" />
                <circle
                  cx="80"
                  cy="80"
                  r="48"
                  fill="none"
                  stroke="url(#rfModernLoaderGrad2Submit)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="165 135"
                  className="rf-loader-arc-mid"
                />

                {/* Inner Harmonic Wave Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="32"
                  fill="none"
                  strokeWidth="1.5"
                  className="rf-loader-arc-inner"
                />

                {/* Orbiting Satellite Particle 1 */}
                <g className="rf-loader-satellite-orbit-1">
                  <circle cx="80" cy="12" r="3.2" className="rf-loader-satellite-dot" />
                </g>

                {/* Orbiting Satellite Particle 2 */}
                <g className="rf-loader-satellite-orbit-2">
                  <circle cx="80" cy="32" r="2.2" className="rf-loader-satellite-dot small" />
                </g>
              </svg>

              {/* Center Core Glass Beacon */}
              <div className="rf-loader-core-beacon">
                <div className="rf-core-sonar-ripple" />
                <div className="rf-core-sonar-ripple ripple-2" />
                <div className="rf-core-spark-center">
                  <Sparkles size={20} className="rf-core-spark-icon" />
                </div>
              </div>
            </div>

            {/* Real-Time Live Status Pill */}
            <div className="rf-loader-status-pill">
              <span className="rf-loader-pulse-dot" />
              <span className="rf-loader-status-step">{getLoadingStepText()}</span>
            </div>
          </div>
          <div className="rf-ai-search-loading-text">
            <span className="rf-ai-search-loading-label">
              <Compass size={16} className="rf-ai-search-pulse-icon" />
              {intent === 'work'
                ? 'Searching escrow-funded jobs matching your skills'
                : intent === 'scout'
                ? 'Curating high-yield referral bounties'
                : 'Matching verified talent for your brief'}
            </span>
            <h3 className="rf-ai-search-loading-query">
              {intent === 'work'
                ? 'Preparing your personalized job matches...'
                : intent === 'scout'
                ? 'Unlocking 10%–15% scout referral opportunities...'
                : 'Preparing your personalized shortlist...'}
            </h3>
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
                <h1 className="rf-personalized-title">
                  {intent === 'work'
                    ? 'Funded jobs matching your profile'
                    : intent === 'scout'
                    ? 'Active referral bounties for your network'
                    : 'Your matched specialists'}
                </h1>
                <p className="rf-personalized-query-quote">
                  {intent === 'work'
                    ? `Curated contracts based on your skills & preferences: “${jobDetails || (searchQuery ? searchQuery : 'Full-stack & AI projects')}”`
                    : intent === 'scout'
                    ? `Earn 10%–15% escrow-guaranteed bounties by referring qualified talent: “${jobDetails || (searchQuery ? searchQuery : 'Verified tech talent')}”`
                    : `Curated based on your brief: “${jobDetails || (searchQuery ? searchQuery : 'AI chatbot developer for support automation')}”`}
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
                SECTION 1: REFEIR PAN-AFRICAN TALENT / JOB / BOUNTY GRID
                =================================================================== */}
            {intent === 'recruit' ? (
              displayedPersonalizedTalents.length === 0 ? (
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
              )
            ) : intent === 'work' ? (
              displayedJobs.length === 0 ? (
                <div className="rf-pr-empty-filter-state">
                  <p className="rf-pr-empty-title">No funded contracts match your exact filters</p>
                  <p className="rf-pr-empty-sub">Try broadening your search or resetting filters to explore all available projects.</p>
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
                  {displayedJobs.map((job) => (
                    <div key={job.id} className="rf-refeir-talent-card">
                      {/* Card Top: Client Initial Box, Header Meta, Escrow Badge */}
                      <div className="rf-refeir-card-header">
                        <div className="rf-refeir-avatar-box is-client">
                          <span className="rf-refeir-client-initial">
                            {job.client_name.charAt(0)}
                          </span>
                          <span className="rf-refeir-online-pulse is-online" title="Client active" />
                        </div>

                        <div className="rf-refeir-header-meta">
                          <div className="rf-refeir-name-row">
                            <h3 className="rf-refeir-talent-name">{job.client_name}</h3>
                            <span className="rf-refeir-verified-badge" title="Escrow Payment Verified">
                              <ShieldCheck size={12} strokeWidth={2} className="rf-shield-icon" />
                              <span>Escrow Funded</span>
                            </span>
                          </div>

                          <div className="rf-refeir-location-row">
                            <span className="rf-refeir-country-flag">🌍</span>
                            <span className="rf-refeir-city">{job.client_country}</span>
                          </div>

                          <p className="rf-refeir-talent-role" style={{ fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                            {job.title}
                          </p>
                        </div>

                        <div className="rf-refeir-match-badge" title="Matching your skills">
                          <span>98% Match</span>
                        </div>
                      </div>

                      {/* Metrics Bar: Budget, Proposals, Timeline */}
                      <div className="rf-refeir-card-metrics">
                        <div className="rf-refeir-metric-item">
                          <span className="rf-metric-label">Budget</span>
                          <span className="rf-metric-value is-escrow">{formatMoney(job.budget)}</span>
                        </div>
                        <div className="rf-refeir-metric-divider" />
                        <div className="rf-refeir-metric-item">
                          <span className="rf-metric-label">Proposals</span>
                          <span className="rf-metric-value">{job.proposals_count} sent</span>
                        </div>
                        <div className="rf-refeir-metric-divider" />
                        <div className="rf-refeir-metric-item">
                          <span className="rf-metric-label">Timeline</span>
                          <span className="rf-metric-status is-available">{job.deadline}</span>
                        </div>
                      </div>

                      <p className="rf-refeir-job-desc-snippet">{job.description}</p>

                      {/* Matched Skill Tags */}
                      <div className="rf-refeir-skills-row">
                        {job.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="rf-refeir-skill-chip">{skill}</span>
                        ))}
                      </div>

                      {/* Security Strip */}
                      <div className="rf-refeir-bounty-strip">
                        <ShieldCheck size={12} strokeWidth={1.8} className="rf-bounty-mini-icon" />
                        <span className="rf-bounty-text">
                          <strong>Escrow Protection:</strong> Funds deposited safely prior to work commencement
                        </span>
                      </div>

                      {/* Action Footer: Apply for Job + View Brief */}
                      <div className="rf-refeir-card-actions">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate(`/jobs/${job.id}`);
                          }}
                          className="rf-refeir-hire-btn"
                        >
                          <span>Apply for Job</span>
                          <ArrowRight size={13} strokeWidth={1.8} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate(`/jobs/${job.id}`);
                          }}
                          className="rf-refeir-refer-btn"
                        >
                          <Briefcase size={12} strokeWidth={1.8} />
                          <span>View Brief</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              displayedJobs.length === 0 ? (
                <div className="rf-pr-empty-filter-state">
                  <p className="rf-pr-empty-title">No referral bounties match your exact filters</p>
                  <p className="rf-pr-empty-sub">Try broadening your search or resetting filters to explore all active bounty opportunities.</p>
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
                  {displayedJobs.map((job) => {
                    const bountyMinor = Math.round((job.budget.amount_minor / 100) * 0.12) * 100;
                    const bountyFormatted = formatMoney({ amount_minor: bountyMinor, currency: job.budget.currency });
                    const isCopied = copiedJobId === job.id;

                    return (
                      <div key={job.id} className="rf-refeir-talent-card">
                        {/* Card Top: Client Avatar, Title, Bounty Tag */}
                        <div className="rf-refeir-card-header">
                          <div className="rf-refeir-avatar-box is-client" style={{ background: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)' }}>
                            <span className="rf-refeir-client-initial">
                              {job.client_name.charAt(0)}
                            </span>
                            <span className="rf-refeir-online-pulse is-online" title="Client hiring" />
                          </div>

                          <div className="rf-refeir-header-meta">
                            <div className="rf-refeir-name-row">
                              <h3 className="rf-refeir-talent-name">{job.client_name}</h3>
                              <span className="rf-refeir-verified-badge" title="Verified Bounty Payer">
                                <ShieldCheck size={12} strokeWidth={2} className="rf-shield-icon" />
                                <span>Verified Bounty</span>
                              </span>
                            </div>

                            <div className="rf-refeir-location-row">
                              <span className="rf-refeir-country-flag">🌍</span>
                              <span className="rf-refeir-city">{job.client_country}</span>
                            </div>

                            <p className="rf-refeir-talent-role" style={{ fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                              {job.title}
                            </p>
                          </div>

                          <div className="rf-refeir-match-badge is-bounty" title="Referral Bounty Tier">
                            <span>12% Bounty</span>
                          </div>
                        </div>

                        {/* Metrics Bar */}
                        <div className="rf-refeir-card-metrics">
                          <div className="rf-refeir-metric-item">
                            <span className="rf-metric-label">Contract Value</span>
                            <span className="rf-metric-value">{formatMoney(job.budget)}</span>
                          </div>
                          <div className="rf-refeir-metric-divider" />
                          <div className="rf-refeir-metric-item">
                            <span className="rf-metric-label">Your Bounty</span>
                            <span className="rf-metric-value is-bounty-val">{bountyFormatted}</span>
                          </div>
                          <div className="rf-refeir-metric-divider" />
                          <div className="rf-refeir-metric-item">
                            <span className="rf-metric-label">Payout</span>
                            <span className="rf-metric-status is-available">Instant Escrow</span>
                          </div>
                        </div>

                        <p className="rf-refeir-job-desc-snippet">{job.description}</p>

                        {/* Skills */}
                        <div className="rf-refeir-skills-row">
                          {job.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="rf-refeir-skill-chip">{skill}</span>
                          ))}
                        </div>

                        {/* Signature Scout Bounty Strip */}
                        <div className="rf-refeir-bounty-strip is-scout-highlight">
                          <Share2 size={12} strokeWidth={1.8} className="rf-bounty-mini-icon" style={{ color: '#D97706' }} />
                          <span className="rf-bounty-text">
                            <strong>Scout Reward:</strong> Earn {bountyFormatted} immediately upon candidate contract milestone
                          </span>
                        </div>

                        {/* Actions: Copy Referral Link + Refer Candidate */}
                        <div className="rf-refeir-card-actions">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(job.id)}
                            className="rf-refeir-hire-btn"
                            style={{ background: isCopied ? '#059669' : '#D97706' }}
                          >
                            {isCopied ? <CheckCheck size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={2} />}
                            <span>{isCopied ? 'Link Copied!' : 'Copy Referral Link'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigate(`/scouts?job=${job.id}`);
                            }}
                            className="rf-refeir-refer-btn"
                            style={{ borderColor: 'rgba(217, 119, 6, 0.4)', color: '#D97706' }}
                          >
                            <Share2 size={12} strokeWidth={1.8} />
                            <span>Refer Talent</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Centered CTA: Explore Full Pan-African Marketplace / Jobs / Bounties */}
            <div className="rf-personalized-more-action">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate(intent === 'work' ? '/jobs' : intent === 'scout' ? '/scouts' : '/marketplace');
                }}
                className="rf-refeir-explore-all-btn"
              >
                <span>
                  {intent === 'work'
                    ? 'Explore All Pan-African Jobs & Contracts'
                    : intent === 'scout'
                    ? 'Explore All Active Referral Bounties'
                    : 'Explore All Pan-African Specialists'}
                </span>
                <ArrowRight size={14} strokeWidth={1.8} />
              </button>
            </div>

            {/* ===================================================================
                SECTION 2: SPLIT BANNER
                =================================================================== */}
            <div className="rf-personalized-banner-card">
              <div className="rf-pr-banner-left">
                {intent === 'work' ? (
                  <>
                    <div className="rf-pr-banner-gauge-circle" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
                      <ShieldCheck size={22} strokeWidth={2.2} />
                    </div>
                    <h2 className="rf-pr-banner-title">
                      Work safely with Refeir Escrow Vault
                    </h2>
                    <p className="rf-pr-banner-sub">Guaranteed payouts on every completed milestone</p>
                    <div className="rf-pr-banner-features">
                      <div className="rf-pr-banner-feature-item">
                        <ShieldCheck size={18} className="rf-pr-feat-icon" style={{ color: '#16A34A' }} />
                        <span>Milestone funds are deposited into escrow before you start work</span>
                      </div>
                      <div className="rf-pr-banner-feature-item">
                        <CreditCard size={18} className="rf-pr-feat-icon" />
                        <span>Instant withdrawals to local African banks, Mobile Money, or USD</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigate('/talent');
                      }}
                      className="rf-pr-banner-cta-btn"
                    >
                      Complete profile & start applying
                    </button>
                  </>
                ) : intent === 'scout' ? (
                  <>
                    <div className="rf-pr-banner-gauge-circle" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#D97706' }}>
                      <TrendingUp size={22} strokeWidth={2.2} />
                    </div>
                    <h2 className="rf-pr-banner-title">
                      Earn passive income every time your network lands a job
                    </h2>
                    <p className="rf-pr-banner-sub">Active scouts earn an avg. of $1,800/mo in recurring bounties</p>
                    <div className="rf-pr-banner-features">
                      <div className="rf-pr-banner-feature-item">
                        <TrendingUp size={18} className="rf-pr-feat-icon" style={{ color: '#D97706' }} />
                        <span>Escrow-guaranteed payouts released immediately on milestone approval</span>
                      </div>
                      <div className="rf-pr-banner-feature-item">
                        <Share2 size={18} className="rf-pr-feat-icon" />
                        <span>Scout link tracks lifetime attribution across repeat contracts</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigate('/scouts');
                      }}
                      className="rf-pr-banner-cta-btn"
                    >
                      Activate your Scout Desk
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div className="rf-pr-banner-right">
                <img
                  src={intent === 'scout' ? '/scout_hero.jpg' : '/african_woman_headset.jpg'}
                  alt={intent === 'scout' ? 'Refeir Talent Scout' : 'African specialist with hands-free headset'}
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
                SECTION 4: "HOW IT WORKS" WITH VIDEO & ACCORDION
                =================================================================== */}
            <div className="rf-personalized-how-it-works-grid">
              {/* Left Column: Interactive Video Player Card */}
              <div className="rf-pr-video-card">
                <div className="rf-pr-video-screen">
                  {/* Subtle video ambient backdrop */}
                  <div className="rf-pr-video-backdrop" />

                  {/* Refeir center logo */}
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
                <h2 className="rf-pr-how-title">
                  {intent === 'work'
                    ? 'How working on Refeir works'
                    : intent === 'scout'
                    ? 'How scouting & referring works'
                    : 'How hiring works'}
                </h2>

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
                        <span className="rf-pr-step-text">
                          {intent === 'work'
                            ? 'Browse funded jobs & submit proposals'
                            : intent === 'scout'
                            ? 'Pick high-bounty client briefs'
                            : 'Post your job or project'}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`rf-pr-chevron ${openAccordion === 1 ? 'is-rotated' : ''}`}
                      />
                    </button>
                    {openAccordion === 1 && (
                      <div className="rf-pr-accordion-body">
                        {intent === 'work'
                          ? 'Apply directly to verified jobs where clients have already deposited milestone funds into secure Refeir escrow.'
                          : intent === 'scout'
                          ? 'Explore hundreds of open client contracts looking for senior engineering, design, and growth talent.'
                          : 'Describe what you need, set your timeline and budget, and get personalized proposals from vetted experts within hours.'}
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
                        <span className="rf-pr-step-text">
                          {intent === 'work'
                            ? 'Complete milestones & collaborate'
                            : intent === 'scout'
                            ? 'Share your unique Scout Link with talent'
                            : 'Contact and hire top freelancers'}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`rf-pr-chevron ${openAccordion === 2 ? 'is-rotated' : ''}`}
                      />
                    </button>
                    {openAccordion === 2 && (
                      <div className="rf-pr-accordion-body">
                        {intent === 'work'
                          ? 'Work with international clients through structured, transparent milestones protected by Refeir smart contracts.'
                          : intent === 'scout'
                          ? 'Send your unique tracking link to skilled friends, alumni circles, or tech communities across Africa.'
                          : 'Interview candidates, review verified portfolios and client feedback, and begin collaboration protected by smart contracts.'}
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
                        <span className="rf-pr-step-text">
                          {intent === 'work'
                            ? 'Get paid instantly with zero friction'
                            : intent === 'scout'
                            ? 'Collect 10%–15% bounty in escrow'
                            : 'Pay securely, once work is delivered'}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`rf-pr-chevron ${openAccordion === 3 ? 'is-rotated' : ''}`}
                      />
                    </button>
                    {openAccordion === 3 && (
                      <div className="rf-pr-accordion-body">
                        {intent === 'work'
                          ? 'Withdraw your earnings directly to your local bank, Payoneer, or Mobile Money with industry-low fees.'
                          : intent === 'scout'
                          ? 'When your referral gets hired and completes a milestone, your bounty is automatically deposited into your wallet.'
                          : 'Deposit funds securely in escrow. You only release payment when work is delivered to your complete satisfaction.'}
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
                      onNavigate(intent === 'work' ? '/jobs' : intent === 'scout' ? '/scouts' : '/jobs');
                    }}
                    className="rf-pr-how-post-btn"
                  >
                    {intent === 'work' ? 'Browse all open jobs' : intent === 'scout' ? 'Start scouting now' : 'Post your job'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate(intent === 'work' ? '/protection' : intent === 'scout' ? '/scouts' : '/pricing');
                    }}
                    className="rf-pr-how-plans-btn"
                  >
                    {intent === 'work' ? 'Payment protection' : intent === 'scout' ? 'Scout earnings guide' : 'Plans and pricing'}
                  </button>
                </div>
              </div>
            </div>

            {/* ===================================================================
                SECTION 4B: "OR YOU CAN GET SCOUTS / BE REPRESENTED / SCOUT PARTNER"
                =================================================================== */}
            <div className="rf-scouts-how-it-works-grid">
              {/* Left Column: Scout Picture Card Blending into Background */}
              <div className="rf-scout-feature-card">
                <img
                  src="/scout_hero.jpg"
                  alt="Refeir Talent Scout"
                  className="rf-scout-card-img"
                  loading="lazy"
                />
                <div className="rf-scout-card-blend" />
              </div>

              {/* Right Column: Numbered Steps & Actions */}
              <div className="rf-pr-how-right">
                <h2 className="rf-pr-how-title">
                  {intent === 'work'
                    ? 'Or let Refeir Scouts pitch and represent you'
                    : intent === 'scout'
                    ? 'Or become a certified Refeir Scout Partner'
                    : 'Or you can get Scouts to do the job for you'}
                </h2>

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
                        <span className="rf-pr-step-text">
                          {intent === 'work'
                            ? 'Get listed in the Refeir Scout Directory'
                            : intent === 'scout'
                            ? 'Apply for Scout Partner certification'
                            : 'Share your brief with a Scout'}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`rf-pr-chevron ${openScoutAccordion === 1 ? 'is-rotated' : ''}`}
                      />
                    </button>
                    {openScoutAccordion === 1 && (
                      <div className="rf-pr-accordion-body">
                        {intent === 'work'
                          ? 'Verified scouts actively recommend top-performing freelancers to their private enterprise clients.'
                          : intent === 'scout'
                          ? 'Get early access to exclusive enterprise briefs from US, European, and African scale-ups before public posting.'
                          : "Tell us what you're building, the skills you need, and your target budget. Our scout desk routes your brief to domain specialists with zero public noise."}
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
                        <span className="rf-pr-step-text">
                          {intent === 'work'
                            ? 'Skip cold outreach and bidding wars'
                            : intent === 'scout'
                            ? 'Direct Slack & WhatsApp Scout Desk access'
                            : 'Scouts tap their private networks'}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`rf-pr-chevron ${openScoutAccordion === 2 ? 'is-rotated' : ''}`}
                      />
                    </button>
                    {openScoutAccordion === 2 && (
                      <div className="rf-pr-accordion-body">
                        {intent === 'work'
                          ? 'Scouts introduce you directly to high-budget hiring managers looking for your exact skillset.'
                          : intent === 'scout'
                          ? 'Collaborate directly with Refeir talent directors to match specialists at record speed.'
                          : 'Certified scouts search private talent circles and recommend specialists who have proven, verifiable track records and authentic proof of work.'}
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
                        <span className="rf-pr-step-text">
                          {intent === 'work'
                            ? 'Keep 100% of your agreed contract rate'
                            : intent === 'scout'
                            ? 'Earn recurring bounties on enterprise squads'
                            : 'Hire vetted talent with confidence'}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`rf-pr-chevron ${openScoutAccordion === 3 ? 'is-rotated' : ''}`}
                      />
                    </button>
                    {openScoutAccordion === 3 && (
                      <div className="rf-pr-accordion-body">
                        {intent === 'work'
                          ? 'The scout bounty is paid as an incentive bonus by the client—never deducted from your earnings.'
                          : intent === 'scout'
                          ? 'Scale your passive earnings to over $3,500/month by referring entire cross-functional tech squads.'
                          : 'Receive a curated shortlist of 2–3 ready-to-interview specialists and begin work immediately, protected by Refeir milestone escrow.'}
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
                      onNavigate(intent === 'work' ? '/talent' : '/scouts');
                    }}
                    className="rf-pr-how-post-btn"
                  >
                    {intent === 'work'
                      ? 'Get represented by a Scout'
                      : intent === 'scout'
                      ? 'Apply for Scout Certification'
                      : 'Get Scouts to find talent'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('/scouts');
                    }}
                    className="rf-pr-how-plans-btn"
                  >
                    {intent === 'work'
                      ? 'How Scouts help talent'
                      : intent === 'scout'
                      ? 'Scout Partner playbook'
                      : 'Learn about Scouts'}
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
