import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useTheme } from '../context/ThemeContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { TalentCard } from '../components/marketplace/TalentCard';
import { ServiceCard } from '../components/marketplace/ServiceCard';
import { AfricaMapExplorer } from '../components/marketplace/AfricaMapExplorer';
import { Africa3DMap } from '../components/marketplace/Africa3DMap';
import { PolygonNetwork3D } from '../components/common/PolygonNetwork3D';
import { ReferModal } from '../components/referral/ReferModal';
import { RefeirLogo } from '../components/common/RefeirLogo';
import { TalentProfile, Service, AfricanRegion } from '../types';
import { REGIONS } from '../data/countries';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  Lock,
  Globe2,
  TrendingUp,
  MapPin,
  Compass,
  Briefcase,
  Code2,
  Brain,
  Palette,
  ShieldAlert,
  Scale,
  Calculator,
  Award,
  DollarSign,
  Building2,
  Check,
  X,
  Smartphone,
  Database,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  PenTool,
  Video,
  Camera,
  Wand2,
  Bot,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Coins,
  Shield,
  ShoppingBag,
  Gamepad2,
  Headphones,
  Music,
  Cpu,
  MessageSquare
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectTalent: (talent: TalentProfile) => void;
  onSelectService: (service: Service) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectTalent,
  onSelectService
}) => {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { talentList, servicesList } = useMarketplace();

  const videoRef = useRef<HTMLVideoElement>(null);

  // Try multiple video sources in order until one plays
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = true;
    (vid as any).defaultMuted = true;

    // Public business/handshake videos — local file first, CDN fallbacks after
    const SOURCES = [
      // LOCAL — served from /public, guaranteed to work
      '/hero-video.mp4',
      // CDN fallbacks (in case local is missing)
      'https://cdn.pixabay.com/video/2022/03/08/110784-686940004_large.mp4',
      'https://cdn.pixabay.com/video/2020/11/22/57649-484128903_large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-two-business-people-shaking-hands-21-large.mp4',
    ];

    let idx = 0;

    const tryNext = () => {
      if (idx >= SOURCES.length) return; // all sources exhausted, poster shows
      vid.src = SOURCES[idx++];
      vid.load();
      const onCanPlay = () => {
        vid.play().catch(() => {
          // Blocked by browser policy — attach to first click
          document.addEventListener('click', () => vid.play().catch(() => {}), { once: true });
        });
      };
      const onError = () => tryNext();
      vid.addEventListener('canplay', onCanPlay, { once: true });
      vid.addEventListener('error', onError, { once: true });
    };

    tryNext();
  }, []);

  const [heroRole, setHeroRole] = useState<'recruiter' | 'scouter' | 'talent'>('scouter');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTalentForRefer, setSelectedTalentForRefer] = useState<TalentProfile | null>(null);
  const [selectedServiceForRefer, setSelectedServiceForRefer] = useState<Service | null>(null);
  const [activeWizardCardIndex, setActiveWizardCardIndex] = useState<number>(0);

  // Dynamic Disintegrating & Morphing Hero Headlines (Strict 2-Line Format)
  const HERO_HEADLINES: React.ReactNode[] = [
    <>
      <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
        Refer a <span className="rf-talent-stylish">talent</span> and
      </span>
      <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
        earn from the connect
      </span>
    </>,
    <>
      <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
        Get a scout to rec
      </span>
      <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
        the right <span className="rf-talent-stylish">talent</span> for you
      </span>
    </>
  ];
  const [headlineIndex, setHeadlineIndex] = useState<number>(0);
  const [headlineStatus, setHeadlineStatus] = useState<'entering' | 'active' | 'disintegrating'>('active');

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      // 1. Begin faster disintegration
      setHeadlineStatus('disintegrating');

      // 2. Once disintegrated, change text and start materializing
      setTimeout(() => {
        setHeadlineIndex(prev => (prev + 1) % HERO_HEADLINES.length);
        setHeadlineStatus('entering');

        // 3. Settle into active resting state
        setTimeout(() => {
          setHeadlineStatus('active');
        }, 720);
      }, 620);
    }, 3600);

    return () => clearInterval(cycleInterval);
  }, [HERO_HEADLINES.length]);

  // How It Works Tab State & Data
  const [howItWorksTab, setHowItWorksTab] = useState<'recruiting' | 'hunting' | 'scouting'>('recruiting');
  const [isFirstVideoPlaying, setIsFirstVideoPlaying] = useState<boolean>(false);
  const firstVideoRef = useRef<HTMLVideoElement>(null);
  const howItWorksSectionRef = useRef<HTMLDivElement>(null);

  // Hover handlers: Video audio and video only play when the "How It Works" section is hovered on
  const handleHowItWorksMouseEnter = () => {
    if (firstVideoRef.current) {
      firstVideoRef.current.muted = false;
      firstVideoRef.current.volume = 1.0;
      firstVideoRef.current.play().then(() => {
        setIsFirstVideoPlaying(true);
      }).catch(() => {
        if (firstVideoRef.current) {
          firstVideoRef.current.muted = true;
          firstVideoRef.current.play().catch(() => {});
          setIsFirstVideoPlaying(true);
        }
      });
    }
  };

  const handleHowItWorksMouseLeave = () => {
    if (firstVideoRef.current) {
      firstVideoRef.current.pause();
      setIsFirstVideoPlaying(false);
    }
  };

  const handleToggleFirstVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement)?.blur();
    if (!firstVideoRef.current) return;
    if (firstVideoRef.current.paused) {
      firstVideoRef.current.muted = false;
      firstVideoRef.current.volume = 1.0;
      firstVideoRef.current.play().then(() => setIsFirstVideoPlaying(true)).catch(() => {});
    } else {
      firstVideoRef.current.pause();
      setIsFirstVideoPlaying(false);
    }
  };

  const HOW_IT_WORKS_DATA = {
    recruiting: {
      label: 'For Recruiting',
      tag: 'HIRE VERIFIED AFRICAN TALENT',
      cards: [
        {
          title: 'Post job at no cost',
          description: 'Generate a job post with AI or create your own and filter talent matches.',
          buttonText: 'Create a job',
          buttonAction: () => onNavigate('/jobs'),
          thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
          videoUrl: '/launching_demo.mp4'
        },
        {
          title: 'Get recommendations and hire',
          description: 'Interract or book a consult with a scout before hiring.',
          buttonText: 'Discover scouts',
          buttonAction: () => onNavigate('/marketplace?tab=scouts'),
          thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
        },
        {
          title: 'Pay when work is done',
          description: 'Release payments after approving work, by milestone or upon project completion.',
          buttonText: 'Explore Pricing',
          buttonAction: () => onNavigate('/pricing'),
          thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'
        }
      ]
    },
    hunting: {
      label: 'For Job Hunting',
      tag: 'FOR FREELANCERS & PROFESSIONALS',
      cards: [
        {
          title: 'Let clients and scouts find you easily',
          description: "Create your profile to highlight your best work and attract top clients and scout's trust.",
          buttonText: 'Create a profile',
          buttonAction: () => onNavigate('/register'),
          thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
          videoUrl: '/Refeir_logo.mp4'
        },
        {
          title: 'Position yourself for work',
          description: 'Negotiate scouts commission rates to be selected quickly or reply to invites from clients.',
          buttonText: 'Enter the market',
          buttonAction: () => onNavigate('/marketplace'),
          thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
        },
        {
          title: 'Get paid when you do a good job',
          description: 'Land a contract, do the work you love well, and get paid on time.',
          buttonText: 'Estimate earnings',
          buttonAction: () => onNavigate('/pricing'),
          thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80'
        }
      ]
    },
    scouting: {
      label: 'For Scouting',
      tag: 'MONETIZE YOUR NETWORK ACROSS AFRICA',
      cards: [
        {
          title: 'Go client hunting',
          description: "Explore the market to see a client's needs or maybe you have a local client you want to link to a talent.",
          buttonText: 'Start Scouting',
          buttonAction: () => onNavigate('/dashboard/scout'),
          thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
          videoUrl: 'https://cdn.pixabay.com/video/2020/11/22/57649-484128903_large.mp4'
        },
        {
          title: 'Look for corresponding talent',
          description: 'Go around and look for the right talent for the job and send the link to the client that wants the job.',
          buttonText: 'Become a bridge',
          buttonAction: () => onNavigate('/marketplace'),
          thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80'
        },
        {
          title: 'Get your commission',
          description: 'Once the talent has delievered the job, your 10% commission is guaranteed.',
          buttonText: 'Build a fortune',
          buttonAction: () => onNavigate('/dashboard/scout'),
          thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
        }
      ]
    }
  };

  const WIZARD_CARDS = [
    {
      id: 'ai-video-wizards',
      badge: 'AI CREATIVE PRODUCTION',
      badgeColor: '#66BB2A',
      title: 'The AI Wizard era has arrived',
      description: 'From ideation to final frame, work with the most renowned AI Video Wizards to create scroll-stopping content and campaigns that drive real impact.',
      ctaText: 'Borrow a Wand',
      ctaQuery: '/marketplace?q=AI%20Video',
      stats: '4.9★ from 180+ global brand campaigns',
      cardTag: 'AI Video Wizards',
      author: 'Tariq Al-Mansoor 🇪🇬',
      role: 'Generative AI Film Director & VFX Lead',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      tags: ['Sora & Runway Gen-3', 'Midjourney v6', 'DaVinci AI Mastering', 'ComfyUI']
    },
    {
      id: 'ai-agents',
      badge: 'AUTONOMOUS ENGINEERING',
      badgeColor: '#F6B21A',
      title: 'Architect Autonomous AI Agents',
      description: 'Supercharge your operations with elite African AI engineers building bespoke RAG pipelines, fine-tuned LLMs, and custom workflow automations.',
      ctaText: 'Deploy an Agent',
      ctaQuery: '/marketplace?q=AI%20Agents',
      stats: 'Over 2.4M automated workflow tasks executed',
      cardTag: 'Autonomous AI Agents',
      author: 'Chidinma Eze 🇳🇬',
      role: 'Principal LLM & RAG Systems Architect',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      tags: ['LangChain', 'LlamaIndex', 'Vector DBs', 'Custom Fine-Tuning']
    },
    {
      id: 'ai-visuals',
      badge: 'GENERATIVE VISUALS & 3D',
      badgeColor: '#F47C20',
      title: 'Hyper-Real 3D & Brand Generation',
      description: 'Transform product concepts into stunning visual assets, photo-realistic CGI renders, and generative brand collateral crafted by top digital artists.',
      ctaText: 'Commission Visuals',
      ctaQuery: '/marketplace?q=Generative%20Design',
      stats: 'Sub-24h asset delivery with 100% IP rights',
      cardTag: 'Hyper-Real 3D & CGI',
      author: 'Liam Van Der Merwe 🇿🇦',
      role: 'Generative 3D & Spatial Designer',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      tags: ['Blender 3D', 'Unreal Engine 5', 'Stable Diffusion XL', 'ControlNet']
    }
  ];

  const AI_WIZARDS_PORTRAITS = [
    {
      name: 'Tariq Al-Mansoor 🇪🇬',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'Amara Okafor 🇳🇬',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'Kofi Mensah 🇬🇭',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'Nia Mwangi 🇰🇪',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'Liam Van Der Merwe 🇿🇦',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'Fatima Zahra 🇲🇦',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'Chidinma Eze 🇳🇬',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'Jean-Paul Habimana 🇷🇼',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80'
    }
  ];

  const [activeWizardPortraitIndex, setActiveWizardPortraitIndex] = useState<number>(0);
  const [isHoveredWizard, setIsHoveredWizard] = useState<boolean>(false);

  useEffect(() => {
    if (isHoveredWizard) return;
    const interval = setInterval(() => {
      setActiveWizardPortraitIndex((prev) => (prev + 1) % AI_WIZARDS_PORTRAITS.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [isHoveredWizard, AI_WIZARDS_PORTRAITS.length]);

  // Scout Calculator State
  const [calcProjectValue, setCalcProjectValue] = useState<number>(1500);
  const [calcReferralCount, setCalcReferralCount] = useState<number>(4);
  const [calcCurrency, setCalcCurrency] = useState<'USD' | 'NGN' | 'KES' | 'GHS'>('USD');

  const currencyRates: Record<string, { rate: number; symbol: string }> = {
    USD: { rate: 1, symbol: '$' },
    NGN: { rate: 1550, symbol: '₦' },
    KES: { rate: 130, symbol: 'KSh' },
    GHS: { rate: 15.5, symbol: 'GH₵' }
  };

  const scoutTotalEarnings = (calcProjectValue * 0.10 * calcReferralCount) * currencyRates[calcCurrency].rate;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleReferTalent = (talent: TalentProfile) => {
    setSelectedTalentForRefer(talent);
  };

  const handleReferService = (service: Service) => {
    setSelectedServiceForRefer(service);
    const talent = talentList.find(t => t.id === service.talent_id);
    if (talent) setSelectedTalentForRefer(talent);
  };

  const recruiterCategories = [
    { name: 'Software & Mobile', icon: Code2, count: '1,420+ Engineers', query: 'Engineering' },
    { name: 'AI & Data Science', icon: Brain, count: '680+ Practitioners', query: 'AI & Data' },
    { name: 'Product & UI/UX Design', icon: Palette, count: '890+ Designers', query: 'Design & Creative' },
    { name: 'DevSecOps & Cloud', icon: ShieldAlert, count: '510+ Architects', query: 'Security & DevOps' },
    { name: 'Growth & Marketing', icon: TrendingUp, count: '740+ Specialists', query: 'Growth & Marketing' },
    { name: 'Legal & FinTech IP', icon: Scale, count: '320+ Advisors', query: 'Legal & Operations' },
    { name: 'Finance & Accounting', icon: DollarSign, count: '460+ Experts', query: 'Finance' },
    { name: 'Video & Animation', icon: Video, count: '590+ Creators', query: 'Video & Animation' },
    { name: 'Writing & Translation', icon: PenTool, count: '430+ Writers', query: 'Writing & Translation' },
    { name: 'Photography & Media', icon: Camera, count: '380+ Artists', query: 'Photography' }
  ];

  const TRUSTED_BRANDS = [
    {
      name: 'Flutterwave',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 6C4 6 8 4 12 8C16 12 20 10 20 10" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 12C4 12 8 10 12 14C16 18 20 16 20 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 18C4 18 8 16 12 20C16 24 20 22 20 22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      )
    },
    {
      name: 'PostGlee',
      logo: (
        <img
          src="/postglee-favicon.png"
          alt="PostGlee"
          style={{
            width: '24px',
            height: '24px',
            objectFit: 'contain',
            borderRadius: '6px',
            display: 'block'
          }}
        />
      )
    },
    {
      name: 'Paystack',
      subtext: 'by Stripe',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="4" rx="2" fill="#FFFFFF" />
          <rect x="3" y="14" width="13" height="4" rx="2" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      name: 'Andela',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M8 15L12 8L16 15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.5 13H14.5" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      )
    },
    {
      name: 'Moniepoint',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" rx="2" fill="#FFFFFF" />
          <rect x="13" y="3" width="8" height="8" rx="2" fill="#FFFFFF" />
          <rect x="3" y="13" width="8" height="8" rx="2" fill="#FFFFFF" />
          <rect x="13" y="13" width="8" height="8" rx="2" fill="#FFFFFF" fillOpacity="0.4" />
        </svg>
      )
    },
    {
      name: 'Chipper Cash',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FFFFFF" />
          <path d="M2 17L12 22L22 17" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'Interswitch',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="8" cy="12" r="5" fill="#FFFFFF" />
          <circle cx="16" cy="12" r="5" stroke="#FFFFFF" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      name: 'OPay',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="12" cy="12" r="3.5" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      name: 'Kuda Bank',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 4V20M6 12L16 4M10 12L17 20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'M-Pesa / Safaricom',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 14C7 8 17 8 20 14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M7 18C9.5 14 14.5 14 17 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="12" cy="6" r="2.5" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      name: 'Piggyvest',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M12 6V12L16 14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'Wave Money',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 9C6 6 9 6 12 9C15 12 18 12 21 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M3 15C6 12 9 12 12 15C15 18 18 18 21 15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'Bolt Africa',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      name: 'Jumia',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      name: 'Yoco',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="4" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="3.5" fill="#FFFFFF" />
        </svg>
      )
    }
  ];

  const heroSectionRef = useRef<HTMLElement>(null);
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const skillsScrollRef = useRef<HTMLDivElement>(null);
  const [showStickySkills, setShowStickySkills] = useState(false);
  const [activeSkillFlyout, setActiveSkillFlyout] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 20);

      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        const headerH = typeof window !== 'undefined' && window.innerWidth <= 480 ? 64 : 72;
        // Trigger sticky bar when the bottom of the hero video section has scrolled past the header
        const isPastHero = rect.bottom <= headerH;
        setShowStickySkills(isPastHero);
        if (!isPastHero) {
          setActiveSkillFlyout(null);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close flyout on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stickyBarRef.current && !stickyBarRef.current.contains(event.target as Node)) {
        setActiveSkillFlyout(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollSkills = (direction: 'left' | 'right') => {
    if (skillsScrollRef.current) {
      skillsScrollRef.current.scrollBy({
        left: direction === 'right' ? 320 : -320,
        behavior: 'smooth'
      });
    }
  };

  const SKILL_FLYOUT_DATA = [
    {
      id: 'ai-services',
      label: 'AI Services',
      category: 'AI Services',
      icon: Brain,
      tagline: 'Generative AI practitioners, prompt architects, computer vision & LLM fine-tuners across Africa',
      columns: [
        {
          title: 'Generative AI & LLMs',
          skills: ['LLM Fine-Tuning & Custom Models', 'RAG Pipeline Architecture', 'LangChain & LlamaIndex', 'Prompt Engineering', 'Vector Databases (Pinecone/Chroma)', 'Autonomous AI Agents']
        },
        {
          title: 'AI Applications & Automation',
          skills: ['AI Chatbot Development', 'AI Audio & Voice Cloning', 'Computer Vision (YOLO / OpenCV)', 'AI Image & Video Generation', 'Custom AI Workflow Automation', 'AI SaaS MVP Development']
        },
        {
          title: 'MLOps & Model Training',
          skills: ['PyTorch & TensorFlow Models', 'HuggingFace Deployment', 'Model Optimization & Quantization', 'AWS SageMaker & GCP Vertex', 'Data Labeling & Fine-tuning Datasets', 'Edge AI Optimization']
        }
      ],
      topHubs: ['Nairobi 🇰🇪', 'Lagos 🇳🇬', 'Johannesburg 🇿🇦', 'Tunis 🇹🇳', 'Accra 🇬🇭', 'Cairo 🇪🇬'],
      talentCount: '780+ AI Specialists'
    },
    {
      id: 'graphic-design',
      label: 'Graphic Design',
      category: 'Design & Creative',
      icon: Palette,
      tagline: 'Brand identity designers, logo creators, packaging visualizers, digital illustrators & marketing artists',
      columns: [
        {
          title: 'Brand Identity & Logos',
          skills: ['Custom Logo Design & Guidelines', 'Brand Books & Typography', 'Business Cards & Stationery', 'Corporate Brand Refresh', 'Vector Mascot & Monogram Design', 'Brand Style Guides']
        },
        {
          title: 'Marketing & Social Creatives',
          skills: ['Social Media Graphics (Canva/PS)', 'Ad Banners & Billboard Creatives', 'Infographics & Slide Pitch Decks', 'Brochures, Flyers & Posters', 'Email Template & Banner Design', 'Event Branding & Roll-up Banners']
        },
        {
          title: 'Packaging & Digital Art',
          skills: ['Product Packaging & Label Design', 'Digital Illustration & Concept Art', 'Merchandise & T-Shirt Design', 'Book & Album Cover Artwork', 'Vector Art & Icon Design', 'Print Production & Pre-Press QA']
        }
      ],
      topHubs: ['Cape Town 🇿🇦', 'Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Dakar 🇸🇳', 'Accra 🇬🇭', 'Casablanca 🇲🇦'],
      talentCount: '1,150+ Graphic Designers'
    },
    {
      id: 'writing-translation',
      label: 'Writing & Translation',
      category: 'Writing & Translation',
      icon: PenTool,
      tagline: 'Pan-African multilingual copywriters, technical writers, translation experts, and content strategists',
      columns: [
        {
          title: 'Content & Copywriting',
          skills: ['Website Copy & Landing Pages', 'SEO Articles & Blog Posts', 'B2B Whitepapers & E-books', 'Ad Copy & Social Content', 'Brand Storytelling & Scripts', 'Email Newsletters & Sequences']
        },
        {
          title: 'Technical & Business Writing',
          skills: ['API Documentation & Tech Specs', 'Investor Pitch Decks & Grants', 'Business Plans & Feasibility Studies', 'Legal & Policy Drafting', 'Grant Writing & RFPs', 'Resume & Executive Bios']
        },
        {
          title: 'African & Global Translation',
          skills: ['French & English Localization', 'Arabic & Swahili Translation', 'Yoruba, Igbo & Hausa Translators', 'Portuguese (Angola/Mozambique)', 'Document Certification & Subtitles', 'Audio Transcription & Voiceover']
        }
      ],
      topHubs: ['Dakar 🇸🇳', 'Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Cairo 🇪🇬', 'Kigali 🇷🇼', 'Casablanca 🇲🇦'],
      talentCount: '640+ Professional Writers'
    },
    {
      id: 'video-animation',
      label: 'Video & Animation',
      category: 'Video & Animation',
      icon: Video,
      tagline: 'Motion designers, video editors, 3D animators, and commercial video producers across Africa',
      columns: [
        {
          title: 'Video Editing & Post-Production',
          skills: ['YouTube & Podcast Video Editing', 'Commercials & Promo Ads', 'Color Grading (DaVinci Resolve)', 'TikTok, Reels & Shorts Editing', 'Sound Design & Audio Mastering', 'Documentary & Event Editing']
        },
        {
          title: 'Motion Graphics & 2D Animation',
          skills: ['After Effects Motion Graphics', 'Explainer Videos & SaaS Demos', 'Logo Animations & Intros', 'Character Animation (2D)', 'Typography & Kinetic Title Cards', 'Infographic & UI Animations']
        },
        {
          title: '3D Animation & VFX',
          skills: ['3D Product Visualizations (Blender/C4D)', 'Architectural 3D Walkthroughs', 'VFX & CGI Compositing', '3D Character Rigging & Animation', 'Unreal Engine 5 Environments', 'Game Asset Animation']
        }
      ],
      topHubs: ['Cape Town 🇿🇦', 'Lagos 🇳🇬', 'Johannesburg 🇿🇦', 'Nairobi 🇰🇪', 'Casablanca 🇲🇦'],
      talentCount: '590+ Motion Artists'
    },
    {
      id: 'digital-marketing',
      label: 'Digital Marketing',
      category: 'Digital Marketing',
      icon: TrendingUp,
      tagline: 'Performance marketers, paid media specialists, SEO leaders, and social growth strategists',
      columns: [
        {
          title: 'Paid Ads & Acquisition',
          skills: ['Meta & Instagram Ads (Africa-Wide)', 'Google Search & Performance Max', 'TikTok Ads & Influencer Campaigns', 'YouTube & Display Advertising', 'LinkedIn B2B Lead Gen', 'App Install Campaigns (iOS/Android)']
        },
        {
          title: 'SEO & Organic Visibility',
          skills: ['Comprehensive Technical SEO', 'Pan-African Keyword Strategy', 'Local SEO & Google Business', 'Link Building & Digital PR', 'E-Commerce SEO (Shopify/Woo)', 'Programmatic SEO Scaling']
        },
        {
          title: 'Social Media & Growth',
          skills: ['Social Media Management', 'Community Building (Twitter/X & Discord)', 'Influencer Outreach & Management', 'Email Marketing & Retention (Klaviyo)', 'Conversion Rate Optimization (CRO)', 'Viral Referral Loops']
        }
      ],
      topHubs: ['Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Johannesburg 🇿🇦', 'Accra 🇬🇭', 'Cairo 🇪🇬'],
      talentCount: '820+ Growth Marketers'
    },
    {
      id: 'consulting',
      label: 'Consulting',
      category: 'Consulting',
      icon: Briefcase,
      tagline: 'Management consultants, African market-entry advisors, legal compliance, and strategy experts',
      columns: [
        {
          title: 'Business & Market Strategy',
          skills: ['African Market Entry Strategy', 'Go-To-Market (GTM) Planning', 'Competitive Intelligence & Research', 'Fundraising & Investor Pitch Prep', 'Pricing Strategy & Unit Economics', 'Startup Advisory & Board Advisory']
        },
        {
          title: 'Operations & Transformation',
          skills: ['Supply Chain & Logistics Strategy', 'Digital Transformation Audits', 'Process Optimization & SOPs', 'Product Management Consulting', 'Change Management & OKRs', 'Cross-Border Expansion Advisory']
        },
        {
          title: 'Legal, Governance & HR',
          skills: ['African Cross-Border Entity Setup', 'Contract & IP Law Advisory', 'AfCFTA Trade Compliance', 'Executive Talent Sourcing & HR', 'ESG & Sustainability Frameworks', 'Regulatory & Licensing Advisory']
        }
      ],
      topHubs: ['Nairobi 🇰🇪', 'Lagos 🇳🇬', 'Johannesburg 🇿🇦', 'Kigali 🇷🇼', 'Abidjan 🇨🇮'],
      talentCount: '430+ Senior Advisors'
    },
    {
      id: 'data',
      label: 'Data',
      category: 'Data',
      icon: Database,
      tagline: 'Data engineers, BI dashboard builders, data scientists, and quantitative research analysts',
      columns: [
        {
          title: 'Data Engineering & Pipelines',
          skills: ['SQL Optimization & Data Modeling', 'dbt (Data Build Tool) Pipelines', 'Snowflake & BigQuery Warehousing', 'Apache Airflow & ETL Orchestration', 'Data Lakehouse Architecture', 'Real-time Streaming (Kafka)']
        },
        {
          title: 'Business Intelligence & Analytics',
          skills: ['Power BI Executive Dashboards', 'Tableau & Looker Studio Reports', 'Metabase & Custom BI Solutions', 'Cohort Retention & Funnel Analysis', 'Financial & KPI Metric Tracking', 'Automated Executive Reporting']
        },
        {
          title: 'Data Science & Predictive ML',
          skills: ['Statistical Analysis & Python (Pandas)', 'Customer Lifetime Value (LTV) Models', 'Churn Prediction Algorithms', 'Time-Series Forecasting', 'A/B Test Design & Significance', 'Data Cleaning & Wrangling']
        }
      ],
      topHubs: ['Johannesburg 🇿🇦', 'Nairobi 🇰🇪', 'Lagos 🇳🇬', 'Cairo 🇪🇬', 'Casablanca 🇲🇦'],
      talentCount: '560+ Data Experts'
    },
    {
      id: 'finance',
      label: 'Finance',
      category: 'Finance',
      icon: DollarSign,
      tagline: 'Financial modelers, CFO advisors, accountants, fintech architects, and tax compliance specialists',
      columns: [
        {
          title: 'Corporate Finance & Modeling',
          skills: ['3-Statement Financial Models', 'Startup Valuation & Cap Table Modeling', 'Discounted Cash Flow (DCF) Analysis', 'Scenario & Sensitivity Analysis', 'Budgeting, Forecasting & FP&A', 'Due Diligence Reports']
        },
        {
          title: 'Accounting & Tax Compliance',
          skills: ['Bookkeeping (QuickBooks/Xero)', 'Pan-African Multi-Country Tax Filing', 'Auditing & Financial Statements', 'Payroll Administration (Africa-wide)', 'VAT, WHT & Statutory Filings', 'IFRS Financial Reporting']
        },
        {
          title: 'Fintech & Treasury',
          skills: ['African Payment Rails Integration', 'Cross-Border FX & Treasury Mgmt', 'Mobile Money Settlement Architectures', 'Credit Scoring & Risk Modeling', 'DeFi & Stablecoin Settlement Rails', 'Banking API Integrations']
        }
      ],
      topHubs: ['Lagos 🇳🇬', 'Johannesburg 🇿🇦', 'Nairobi 🇰🇪', 'Cape Town 🇿🇦', 'Casablanca 🇲🇦'],
      talentCount: '410+ Finance Professionals'
    },
    {
      id: 'photography',
      label: 'Photography',
      category: 'Photography',
      icon: Camera,
      tagline: 'Commercial photographers, e-commerce product shooters, portrait artists & photo retouchers across Africa',
      columns: [
        {
          title: 'Commercial & Product Photography',
          skills: ['E-Commerce Product Photography', 'Amazon & Shopify White-Background Stills', 'Fashion & Lookbook Shoots', 'Food & Restaurant Photography', 'High-End Jewelry & Macro Shots', 'Packaging & Lifestyle Visuals']
        },
        {
          title: 'Portrait, Events & Aerial',
          skills: ['Corporate Headshots & Team Portraits', 'Editorial & Magazine Photography', 'Conferences & Corporate Events', 'Documentary & Storytelling Shoots', 'Architectural & Interior Stills', 'Drone & Aerial Photography']
        },
        {
          title: 'Photo Retouching & Post-Production',
          skills: ['High-End Beauty & Skin Retouching', 'Color Grading & RAW Processing', 'Background Removal & Clipping Paths', 'Ghost Mannequin & Composite Edits', 'Lightroom Batch Color Correction', 'AI-Assisted Photo Upscaling']
        }
      ],
      topHubs: ['Cape Town 🇿🇦', 'Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Accra 🇬🇭', 'Marrakech 🇲🇦', 'Dakar 🇸🇳'],
      talentCount: '370+ Professional Photographers'
    },
    {
      id: 'fullstack',
      label: 'Fullstack & Web',
      category: 'Engineering',
      icon: Code2,
      tagline: 'Vetted frontend, backend, and fullstack architects across modern frameworks',
      columns: [
        {
          title: 'Frontend & Frameworks',
          skills: ['React.js & Next.js', 'Vue.js & Nuxt', 'TypeScript', 'Angular', 'TailwindCSS & Design Systems', 'WebAssembly']
        },
        {
          title: 'Backend & APIs',
          skills: ['Node.js & Express', 'Python (Django / FastAPI)', 'Go (Golang)', 'Java & Spring Boot', 'PHP (Laravel)', 'Ruby on Rails']
        },
        {
          title: 'Databases & Architecture',
          skills: ['PostgreSQL & MySQL', 'MongoDB', 'Redis Caching', 'GraphQL & REST APIs', 'Microservices', 'Serverless Functions']
        }
      ],
      topHubs: ['Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Cape Town 🇿🇦', 'Cairo 🇪🇬', 'Kigali 🇷🇼'],
      talentCount: '1,420+ Engineers'
    },
    {
      id: 'mobile',
      label: 'Mobile Development',
      category: 'Engineering',
      icon: Smartphone,
      tagline: 'Cross-platform and native iOS/Android engineers building scalable consumer apps',
      columns: [
        {
          title: 'Cross-Platform Mobile',
          skills: ['Flutter & Dart', 'React Native', 'Kotlin Multiplatform', 'Expo Ecosystem', 'Capacitor / Ionic', 'Offline-First Data Sync']
        },
        {
          title: 'Native iOS & macOS',
          skills: ['Swift & SwiftUI', 'Xcode & Instruments', 'Combine & CoreData', 'iOS Push Services', 'Apple Pay Integration', 'TestFlight & App Store']
        },
        {
          title: 'Native Android',
          skills: ['Kotlin & Jetpack Compose', 'Coroutines & Flow', 'Android NDK', 'Google Play Billing', 'Biometric Authentication', 'Material You UI']
        }
      ],
      topHubs: ['Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Cairo 🇪🇬', 'Accra 🇬🇭', 'Kampala 🇺🇬'],
      talentCount: '950+ Mobile Builders'
    },
    {
      id: 'design',
      label: 'UI/UX & Design',
      category: 'Design & Creative',
      icon: Palette,
      tagline: 'Design systems architects, UX researchers and product visualizers',
      columns: [
        {
          title: 'Product & UI Design',
          skills: ['Figma Design Systems', 'Interactive Prototyping', 'Responsive Web Design', 'Mobile App UI', 'Micro-Animations', 'Accessibility (a11y)']
        },
        {
          title: 'UX Research & Strategy',
          skills: ['User Journey Mapping', 'Usability Testing', 'Information Architecture', 'User Personas', 'Wireframing & Sitemaps', 'Design Sprints']
        },
        {
          title: 'Brand & Visual Creative',
          skills: ['Brand Identity & Guidelines', '3D Modeling (Blender)', 'Motion Graphics', 'Custom Iconography', 'Design Audits', 'Marketing Collateral']
        }
      ],
      topHubs: ['Cape Town 🇿🇦', 'Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Casablanca 🇲🇦', 'Dakar 🇸🇳'],
      talentCount: '890+ Product Designers'
    },
    {
      id: 'cloud-devops',
      label: 'DevSecOps & Cloud',
      category: 'Security & DevOps',
      icon: ShieldAlert,
      tagline: 'Cloud architects, SREs, and container infrastructure specialists',
      columns: [
        {
          title: 'Cloud Infrastructure',
          skills: ['AWS (Certified Solutions)', 'Google Cloud Platform (GCP)', 'Microsoft Azure', 'Terraform (IaC)', 'Ansible & Pulumi', 'Multi-Region Architecture']
        },
        {
          title: 'Containers & Orchestration',
          skills: ['Kubernetes (K8s)', 'Docker & Containerd', 'Helm Charts', 'Service Mesh (Istio)', 'Serverless (Lambda/Cloud Run)', 'Linux Systems Administration']
        },
        {
          title: 'CI/CD & Observability',
          skills: ['GitHub Actions', 'GitLab CI/CD', 'Prometheus & Grafana', 'Datadog & New Relic', 'ELK Stack / Loki', 'Zero-Downtime Deployments']
        }
      ],
      topHubs: ['Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Johannesburg 🇿🇦', 'Cairo 🇪🇬', 'Kigali 🇷🇼'],
      talentCount: '510+ Cloud Architects'
    },
    {
      id: 'blockchain-web3',
      label: 'Blockchain & Web3',
      category: 'Blockchain & Web3',
      icon: Coins,
      tagline: 'Smart contract architects, DeFi developers, Solidity/Rust engineers & tokenomics strategists',
      columns: [
        {
          title: 'Smart Contracts & Protocols',
          skills: ['Solidity & EVM Contracts', 'Rust & Solana Programs', 'DeFi Liquidity Protocols', 'ERC-20 & ERC-721 Tokenomics', 'Cross-Chain Bridges', 'Smart Contract Security Audits']
        },
        {
          title: 'Web3 dApps & Frontends',
          skills: ['Ethers.js & Viem / Wagmi', 'Web3Auth & WalletConnect', 'IPFS & Decentralized Storage', 'The Graph & Subgraphs', 'NFT Marketplaces & Minting', 'DAO Governance Platforms']
        },
        {
          title: 'Payments & Stablecoins',
          skills: ['USDT/USDC Settlement Rails', 'African P2P & Crypto On-Ramps', 'L2 Rollups (Arbitrum/Optimism)', 'Zero-Knowledge (zk-SNARKs)', 'Fintech Crypto Gateway APIs', 'Custody & Multi-Sig Vaults']
        }
      ],
      topHubs: ['Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Cape Town 🇿🇦', 'Accra 🇬🇭', 'Kigali 🇷🇼'],
      talentCount: '480+ Web3 Engineers'
    },
    {
      id: 'cybersecurity',
      label: 'Cybersecurity',
      category: 'Security & DevOps',
      icon: Shield,
      tagline: 'Ethical hackers, SOC analysts, penetration testers, and enterprise compliance consultants',
      columns: [
        {
          title: 'Offensive Security & Pen-Testing',
          skills: ['Web & API Penetration Testing', 'Mobile App Vulnerability Audits', 'Network Infrastructure Testing', 'Red Teaming & Social Engineering', 'Bug Bounty & CVE Remediation', 'Cloud Security Posture (CSPM)']
        },
        {
          title: 'Defensive Security & SOC',
          skills: ['SIEM & Log Analysis (Splunk/Wazuh)', 'Incident Response & Forensics', 'Threat Hunting & Intelligence', 'Firewall & Zero-Trust Architecture', 'DDoS Mitigation & WAF Tuning', 'Identity & Access Mgmt (IAM)']
        },
        {
          title: 'Compliance & Data Privacy',
          skills: ['ISO 27001 & SOC 2 Readiness', 'PCI-DSS Fintech Certification', 'NDPR & GDPR Compliance Audits', 'HIPAA & Health Data Privacy', 'Disaster Recovery & BCP Plans', 'Security Awareness Training']
        }
      ],
      topHubs: ['Johannesburg 🇿🇦', 'Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Cairo 🇪🇬', 'Casablanca 🇲🇦'],
      talentCount: '390+ Security Experts'
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce & Retail',
      category: 'E-Commerce',
      icon: ShoppingBag,
      tagline: 'Shopify Plus architects, WooCommerce builders, marketplace managers & funnel optimizers',
      columns: [
        {
          title: 'Storefronts & Platforms',
          skills: ['Shopify Plus & Liquid Coding', 'WooCommerce & WordPress Store', 'Headless Commerce (Medusa/Next)', 'Magento / Adobe Commerce', 'Custom Checkout & Cart Customization', 'Omnichannel Inventory Sync']
        },
        {
          title: 'Payments & Logistics',
          skills: ['African Gateways (Paystack/Flutterwave)', 'M-Pesa & Mobile Money Checkouts', 'Multi-Currency Geolocation Pricing', 'DHL & Local Courier API Integrations', 'Cross-Border Customs & VAT Setup', 'ERP & Warehousing Connections']
        },
        {
          title: 'Growth & Funnels',
          skills: ['E-commerce CRO & Landing Pages', 'Klaviyo Email & SMS Automations', 'Amazon & Jumia Storefront Mgmt', 'Product Photography Integration', 'Subscription & Loyalty Apps', 'Cart Abandonment Recovery']
        }
      ],
      topHubs: ['Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Cape Town 🇿🇦', 'Casablanca 🇲🇦', 'Accra 🇬🇭'],
      talentCount: '720+ E-Commerce Specialists'
    },
    {
      id: 'game-dev',
      label: 'Game Development',
      category: 'Game Development',
      icon: Gamepad2,
      tagline: 'Unity & Unreal Engine programmers, 3D asset modelers, game designers & AR/VR creators',
      columns: [
        {
          title: 'Game Engines & Coding',
          skills: ['Unity (C# Game Logic)', 'Unreal Engine 5 (C++ & Blueprints)', 'Godot Engine (2D/3D)', 'Mobile Game Optimization (iOS/Android)', 'Multiplayer & Networking (Photon/Mirror)', 'Custom Shaders & HLSL Lighting']
        },
        {
          title: '3D Art & World-Building',
          skills: ['3D Character Modeling & Sculpting', 'Environment Art & Level Design', 'Texturing & PBR Materials (Substance)', 'Rigging & Skeletal Animation', 'VFX Particle Systems (Niagara)', 'African Mythological Lore & Narrative']
        },
        {
          title: 'AR, VR & Interactive Tech',
          skills: ['Meta Quest VR Development', 'Apple Vision Pro (visionOS)', 'ARKit & ARCore Mobile Apps', 'Virtual Production (Unreal)', 'Gamified Web Experiences (Three.js)', 'Game UI/UX & HUD Design']
        }
      ],
      topHubs: ['Cape Town 🇿🇦', 'Lagos 🇳🇬', 'Nairobi 🇰🇪', 'Johannesburg 🇿🇦', 'Tunis 🇹🇳'],
      talentCount: '340+ Game Developers'
    },
    {
      id: 'legal-compliance',
      label: 'Legal & Regulatory',
      category: 'Legal & Operations',
      icon: Scale,
      tagline: 'Pan-African legal counsels, intellectual property lawyers, AfCFTA trade specialists & corporate secretaries',
      columns: [
        {
          title: 'Corporate & Cross-Border Law',
          skills: ['Pan-African Corporate Formation', 'AfCFTA Trade & Tariff Compliance', 'Commercial Contracts & Master MSAs', 'Shareholders & Safe Agreements', 'M&A & Joint Venture Structuring', 'Cross-Border Employment Law']
        },
        {
          title: 'Tech, IP & Licensing',
          skills: ['African Trademark & Patent Filing', 'Software Licensing & SaaS Terms', 'IP Assignment & Non-Competes', 'Data Privacy Terms & Cookie Policies', 'Fintech Regulatory Sandboxes', 'Crypto & Digital Asset Licensing']
        },
        {
          title: 'Dispute Mediation & Governance',
          skills: ['Commercial Arbitration & Mediation', 'Board Governance & ESG Policies', 'Anti-Bribery & FCPA Compliance', 'Immigration & Expat Work Permits', 'Tax Structuring & Transfer Pricing', 'Due Diligence Reports']
        }
      ],
      topHubs: ['Nairobi 🇰🇪', 'Lagos 🇳🇬', 'Johannesburg 🇿🇦', 'Accra 🇬🇭', 'Kigali 🇷🇼'],
      talentCount: '290+ Legal Advisors'
    },
    {
      id: 'audio-music',
      label: 'Music & Audio',
      category: 'Audio & Music',
      icon: Music,
      tagline: 'Afrobeats & Amapiano producers, sound engineers, voice actors, mixing specialists & podcast creators',
      columns: [
        {
          title: 'Music Production & Beats',
          skills: ['Afrobeats & Afro-Fusion Production', 'Amapiano & Deep House Beats', 'Hip-Hop & R&B Beatmaking', 'Film Scoring & Cinematic Soundtracks', 'Custom Commercial Jingles', 'Session Musicians (Guitar/Percussion)']
        },
        {
          title: 'Audio Post & Mastering',
          skills: ['Mixing & Mastering (Pro Tools/Logic)', 'Vocal Tuning & Melodyne Processing', 'Podcast Editing & Noise Reduction', 'Audiobook Production (ACX Standards)', 'Dolby Atmos & Spatial Audio', 'Sound Effects (SFX) Design']
        },
        {
          title: 'Voiceover & Localization',
          skills: ['African Accent English Voiceovers', 'French & Arabic Commercial VO', 'Pidgin, Yoruba, Swahili & Hausa VO', 'E-Learning & Corporate Narration', 'Character & Animation Voice Acting', 'IVR & Phone Menu Prompt Recording']
        }
      ],
      topHubs: ['Lagos 🇳🇬', 'Johannesburg 🇿🇦', 'Nairobi 🇰🇪', 'Accra 🇬🇭', 'Dakar 🇸🇳'],
      talentCount: '460+ Audio Creators'
    },
    {
      id: 'customer-support',
      label: 'Customer Support & CX',
      category: 'Support & CX',
      icon: Headphones,
      tagline: 'Multilingual customer support representatives, Zendesk admins, live chat reps & customer success leaders',
      columns: [
        {
          title: 'Omnichannel Customer Support',
          skills: ['24/7 Live Chat & Helpdesk Agents', 'Email Support & Ticket Resolution', 'Phone & Inbound Call Center Reps', 'Social Media Direct Message Support', 'VIP Customer Success Managers', 'Tech Support & Tier-2 Escalations']
        },
        {
          title: 'Helpdesk Tools & Automations',
          skills: ['Zendesk Suite Implementation', 'Intercom & Custom Bot Workflows', 'Freshdesk & Zoho Desk Admins', 'Help Center Knowledge Base Articles', 'Macro Writing & Response Templates', 'CRM Integration (HubSpot/Salesforce)']
        },
        {
          title: 'Multilingual BPO Support',
          skills: ['English & French Bilingual Support', 'Arabic & Swahili Support Reps', 'Portuguese Customer Care', 'E-Commerce Order Tracking Agents', 'Chargeback & Dispute Handling', 'CSAT & NPS Score Optimization']
        }
      ],
      topHubs: ['Cairo 🇪🇬', 'Cape Town 🇿🇦', 'Nairobi 🇰🇪', 'Lagos 🇳🇬', 'Casablanca 🇲🇦', 'Dakar 🇸🇳'],
      talentCount: '890+ CX Professionals'
    },
    {
      id: 'hardware-iot',
      label: 'Hardware & IoT',
      category: 'Hardware & IoT',
      icon: Cpu,
      tagline: 'Embedded systems engineers, IoT architect, firmware developers, PCB designers & robotics innovators',
      columns: [
        {
          title: 'Embedded Systems & Firmware',
          skills: ['Embedded C / C++ & Rust', 'ARM Cortex & STM32 Development', 'ESP32 & ESP8266 IoT Modules', 'RTOS (FreeRTOS / Zephyr)', 'Arduino & Raspberry Pi Prototyping', 'Microcontroller Optimization']
        },
        {
          title: 'PCB Design & Prototyping',
          skills: ['KiCad & Altium PCB Layout', 'Schematic Design & Component Sourcing', 'High-Speed Signal Integrity', 'SMD Soldering & Hardware Assembly', '3D Enclosure Design (CAD/Fusion360)', 'Hardware Testing & QA Benchmarks']
        },
        {
          title: 'IoT Networks & Telematics',
          skills: ['LoRaWAN & NB-IoT Connectivity', 'MQTT & CoAP Protocol Pipelines', 'Solar & Smart Energy Telematics', 'Agricultural IoT & Smart Meters', 'Fleet Management & GPS Trackers', 'Edge Computing & Hardware AI']
        }
      ],
      topHubs: ['Nairobi 🇰🇪', 'Lagos 🇳🇬', 'Kigali 🇷🇼', 'Cape Town 🇿🇦', 'Tunis 🇹🇳'],
      talentCount: '310+ Hardware Engineers'
    }
  ];

  const selectedFlyoutGroup = SKILL_FLYOUT_DATA.find(item => item.id === activeSkillFlyout);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
      {/* STICKY SKILLS & TALENT BAR (Appears when scrolling past hero, always crisp light style) */}
      <div
        ref={stickyBarRef}
        className="rf-sticky-skills-bar"
        style={{
          position: 'fixed',
          top: 'var(--rf-header-height, 72px)',
          left: 0,
          right: 0,
          zIndex: 89,
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.94) 55%, rgba(255, 255, 255, 0.88) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(18, 43, 26, 0.1)',
          boxShadow: '0 4px 20px rgba(18, 43, 26, 0.06)',
          transform: showStickySkills ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showStickySkills ? 1 : 0,
          pointerEvents: showStickySkills ? 'auto' : 'none',
          transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
          padding: '0.4rem 0'
        }}
      >
        <div
          className="rf-container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            position: 'relative'
          }}
        >
          {/* Left scroll pointer */}
          <button
            onClick={() => handleScrollSkills('left')}
            aria-label="Scroll skills left"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(18, 43, 26, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#122B1A',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F0F7F2';
              e.currentTarget.style.color = '#66BB2A';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#122B1A';
            }}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Horizontal scrollable list of skill/talent pills */}
          <div
            ref={skillsScrollRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              flex: 1,
              padding: '0.2rem 0'
            }}
          >
            {SKILL_FLYOUT_DATA.map(skill => {
              const Icon = skill.icon;
              const isActive = activeSkillFlyout === skill.id;
              return (
                <button
                  key={skill.id}
                  onClick={() => setActiveSkillFlyout(isActive ? null : skill.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: isActive ? '#66BB2A' : 'rgba(255, 255, 255, 0.85)',
                    border: `1.5px solid ${isActive ? '#66BB2A' : 'rgba(18, 43, 26, 0.12)'}`,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isActive ? '#07160D' : '#122B1A',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                    boxShadow: isActive ? '0 2px 8px rgba(102, 187, 42, 0.4)' : 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(102, 187, 42, 0.12)';
                      e.currentTarget.style.borderColor = '#66BB2A';
                      e.currentTarget.style.color = '#2E7D32';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                      e.currentTarget.style.borderColor = 'rgba(18, 43, 26, 0.12)';
                      e.currentTarget.style.color = '#122B1A';
                    }
                  }}
                >
                  <Icon size={14} color={isActive ? '#07160D' : '#66BB2A'} />
                  <span>{skill.label}</span>
                  <ChevronDown
                    size={12}
                    color={isActive ? '#07160D' : '#64748B'}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: isActive ? 'rotate(180deg)' : 'rotate(0)'
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Right scroll pointer button (>) */}
          <button
            onClick={() => handleScrollSkills('right')}
            aria-label="Scroll skills right"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(18, 43, 26, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#122B1A',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F0F7F2';
              e.currentTarget.style.color = '#66BB2A';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#122B1A';
            }}
          >
            <ChevronRight size={16} />
          </button>

          {/* Direct link to all marketplace */}
          <button
            onClick={() => onNavigate('/marketplace')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: '#0F2E1E',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(15, 46, 30, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2E7D32'}
            onMouseLeave={e => e.currentTarget.style.background = '#0F2E1E'}
          >
            <span>Browse All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* =========================================================================
            WIDE DROPDOWN FLYOUT FOR SELECTED SKILLSET
            ========================================================================= */}
        {selectedFlyoutGroup && (
          <div
            className="rf-skills-flyout-container"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#FFFFFF',
              borderTop: '1px solid rgba(18, 43, 26, 0.08)',
              borderBottom: '1px solid rgba(18, 43, 26, 0.12)',
              boxShadow: '0 20px 40px -10px rgba(18, 43, 26, 0.14)',
              zIndex: 100,
              animation: 'rfSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              padding: 'clamp(1rem, 3vw, 2rem) 0',
              maxHeight: 'calc(100vh - 140px)',
              overflowY: 'auto'
            }}
          >
            <div className="rf-container-wide">
              {/* Header inside flyout */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(18, 43, 26, 0.08)', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(102, 187, 42, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#66BB2A',
                      flexShrink: 0,
                      marginTop: '1px'
                    }}
                  >
                    <selectedFlyoutGroup.icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F2E1E', margin: 0, lineHeight: 1.25 }}>
                      {selectedFlyoutGroup.label}
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: '#64748B', margin: '0.35rem 0 0 0', lineHeight: 1.45 }}>
                      {selectedFlyoutGroup.tagline}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#66BB2A', background: 'rgba(102, 187, 42, 0.12)', padding: '0.3rem 0.75rem', borderRadius: '9999px' }}>
                    {selectedFlyoutGroup.talentCount}
                  </span>
                  <button
                    onClick={() => {
                      setActiveSkillFlyout(null);
                      onNavigate(`/marketplace?category=${encodeURIComponent(selectedFlyoutGroup.category)}`);
                    }}
                    className="rf-btn rf-btn-primary rf-btn-sm"
                    style={{ gap: '0.4rem', fontWeight: 700, fontSize: '0.8125rem' }}
                  >
                    <span>View All in {selectedFlyoutGroup.label}</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => setActiveSkillFlyout(null)}
                    aria-label="Close flyout"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* 3-Column Grid of subskills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {selectedFlyoutGroup.columns.map((col, idx) => (
                  <div key={idx} style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(18, 43, 26, 0.06)' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', color: '#66BB2A', letterSpacing: '0.04em', marginBottom: '0.875rem' }}>
                      {col.title}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {col.skills.map((s, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => {
                            setActiveSkillFlyout(null);
                            onNavigate(`/marketplace?q=${encodeURIComponent(s)}`);
                          }}
                          style={{
                            padding: '0.45rem 0.65rem',
                            borderRadius: '8px',
                            fontSize: '0.84rem',
                            fontWeight: 500,
                            color: '#1E293B',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#FFFFFF';
                            e.currentTarget.style.color = '#66BB2A';
                            e.currentTarget.style.transform = 'translateX(3px)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#1E293B';
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <span>{s}</span>
                          <ChevronRight size={13} color="#94A3B8" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom footer with Top African Hubs */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F0FDF4', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(102, 187, 42, 0.2)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#66BB2A', letterSpacing: '0.04em' }}>
                    Top Pan-African Talent Hubs:
                  </span>
                  {selectedFlyoutGroup.topHubs.map((hub, hIdx) => (
                    <span key={hIdx} style={{ fontSize: '0.8rem', fontWeight: 600, color: '#14532D', background: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid rgba(22, 101, 52, 0.15)' }}>
                      {hub}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
                  🛡️ 100% Trust Vault Escrow Protected on all milestone contracts
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* 1. HERO SECTION — VIDEO IN A ROUNDED CONTAINER ON WHITE BACKGROUND */}
      <section
        ref={heroSectionRef}
        className="rf-hero-section"
        style={{
          background: 'var(--rf-bg-base)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2rem)',
          paddingBottom: 'clamp(2.5rem, 5vw, 4rem)'
        }}
      >
        <div
          className="rf-container rf-hero-container"
          style={{ maxWidth: '1200px' }}
        >
          {/* Scout Referral Announcement Banner — Transparent White Blend */}
          <div
            className={`rf-hero-announcement ${isScrolled ? 'is-scrolled' : ''}`}
            style={{
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.65) 60%, rgba(255, 255, 255, 0.25) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(18, 43, 26, 0.12)',
              borderRadius: '16px',
              padding: '1rem 1.75rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              boxShadow: '0 4px 20px rgba(18, 43, 26, 0.05)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, minWidth: '280px' }}>
              <span
                className="rf-hero-announcement-text"
                style={{
                  fontFamily: 'var(--rf-font-display)',
                  fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
                  fontWeight: 600,
                  color: '#122B1A',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.35
                }}
              >
                You don't need a skill to earn. Get from <span style={{ color: '#2E7D32', fontWeight: 700, textDecoration: 'underline', textDecorationColor: '#66BB2A' }}>10%</span> just by Scouting Talents.
              </span>
            </div>

            <button
              onClick={() => onNavigate('/dashboard/scout')}
              className="rf-hero-announcement-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#122B1A',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid #66BB2A',
                padding: '0.25rem 0',
                paddingBottom: '2px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#66BB2A';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#122B1A';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>Start Scouting</span>
              <ArrowRight size={16} color="#66BB2A" />
            </button>
          </div>

          {/* Rounded Video Card */}
          <div
            className="rf-hero-video-card"
            style={{
              position: 'relative',
              borderRadius: '28px',
              overflow: 'hidden',
              minHeight: 'clamp(480px, 72vh, 680px)',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 24px 60px rgba(18, 43, 26, 0.18)',
              backgroundColor: '#0A170F'
            }}
          >
            {/* Background Video — Pexels CDN (reliable, CORS-safe, no auth needed) */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1920&q=80"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                filter: 'brightness(0.58) contrast(1.08) saturate(0.88)'
              }}
            />

            {/* Left-heavy gradient overlay for text clarity */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(100deg, rgba(8,20,12,0.90) 0%, rgba(10,23,15,0.70) 45%, rgba(10,23,15,0.25) 100%)',
                zIndex: 1
              }}
            />

            {/* Hero text content — top left of the video */}
            <div
              className="rf-hero-video-content"
              style={{
                position: 'relative',
                zIndex: 2,
                padding: 'clamp(2rem, 5vw, 4rem)',
                width: '100%'
              }}
            >
              {/* Tagline */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem'
                }}
              >
                <span
                  style={{
                    width: '7px', height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#66BB2A',
                    boxShadow: '0 0 0 3px rgba(102,187,42,0.3)'
                  }}
                  className="rf-pulse"
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#66BB2A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Africa's Talent Referral Marketplace
                </span>
              </div>

              {/* Hero Headline with Grow & Reveal Transition (Zero Layout Shift for Text Below) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gridTemplateRows: 'auto',
                  alignItems: 'start',
                  marginBottom: '1.25rem',
                  maxWidth: '860px'
                }}
              >
                {/* Fixed Ghost Baseline to lock physical height so text beneath never shifts */}
                <h1
                  aria-hidden="true"
                  style={{
                    gridArea: '1 / 1',
                    fontFamily: 'var(--rf-font-display)',
                    fontSize: 'clamp(2.1rem, 4.4vw, 3.65rem)',
                    fontWeight: 600,
                    lineHeight: 1.16,
                    color: 'transparent',
                    margin: 0,
                    paddingBottom: '0.4rem',
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}
                >
                  <span style={{ display: 'block' }}>Refer a talent and</span>
                  <span style={{ display: 'block' }}>earn from the connect</span>
                </h1>

                {/* Animated Visible Headline */}
                <h1
                  key={headlineIndex}
                  className={`rf-headline-${headlineStatus}`}
                  style={{
                    gridArea: '1 / 1',
                    fontFamily: 'var(--rf-font-display)',
                    fontSize: 'clamp(2.1rem, 4.4vw, 3.65rem)',
                    fontWeight: 600,
                    lineHeight: 1.16,
                    color: '#FFFFFF',
                    margin: 0,
                    paddingBottom: '0.4rem',
                    textShadow: '0 4px 24px rgba(0,0,0,0.55)'
                  }}
                >
                  {HERO_HEADLINES[headlineIndex]}
                </h1>
              </div>

              {/* Subheadline */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.65,
                  maxWidth: '560px',
                  marginBottom: '2rem',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.55)'
                }}
              >
                Connect clients with verified professionals across 54 nations and earn a guaranteed 10% commission on every completed milestone
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} style={{ maxWidth: '540px', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(8, 20, 12, 0.82)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 187, 42, 0.4)',
                    borderRadius: '14px',
                    padding: '0.4rem 0.5rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35)'
                  }}
                >
                  <div className="rf-hero-search-left-icon" style={{ paddingLeft: '0.75rem', paddingRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <Search size={19} className="rf-search-icon-wiggle" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="What talent or service are you looking for?"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      flex: 1,
                      padding: '0.5rem 0'
                    }}
                  />
                  <button
                    type="submit"
                    className="rf-btn rf-btn-mint rf-hero-search-submit-btn"
                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
                    aria-label="Search"
                  >
                    <span className="rf-hero-search-text">Search</span>
                    <Search size={16} color="#0F2E1E" className="rf-hero-search-icon-only rf-search-icon-wiggle" />
                  </button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="rf-hero-cta-group" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.875rem', marginBottom: '2rem' }}>
                <button
                  onClick={() => onNavigate('/marketplace')}
                  className="rf-btn rf-btn-primary rf-btn-lg rf-hero-cta-btn"
                  style={{ gap: '0.5rem', boxShadow: '0 4px 20px rgba(102,187,42,0.45)' }}
                >
                  <span className="rf-desktop-only">Browse African Talent</span>
                  <span className="rf-mobile-only">Browse Talent</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => onNavigate('/dashboard/scout')}
                  className="rf-hero-cta-btn rf-hero-cta-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1.75rem',
                    borderRadius: '14px',
                    fontSize: '1.0625rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer'
                  }}
                >
                  <span className="rf-desktop-only">Start Referring & Earn</span>
                  <span className="rf-mobile-only">Refer & Earn</span>
                </button>
              </div>

              {/* Trust stat pills — evenly distributed from left to right on larger screens */}
              <div className="rf-hero-trust-badges">
                <div className="rf-hero-trust-badge-item">
                  <Globe2 size={15} color="#66BB2A" />
                  <span><strong style={{ color: '#FFFFFF' }}>54</strong> African Nations</span>
                </div>
                <div className="rf-hero-trust-badge-item">
                  <Lock size={15} color="#66BB2A" />
                  <span><strong style={{ color: '#FFFFFF' }}>10%</strong> Locked Scout Reward</span>
                </div>
                <div className="rf-hero-trust-badge-item">
                  <ShieldCheck size={15} color="#66BB2A" />
                  <span><strong style={{ color: '#FFFFFF' }}>100%</strong> Trust Vault</span>
                </div>
                <div className="rf-hero-trust-badge-item">
                  <CheckCircle2 size={15} color="#66BB2A" />
                  <span><strong style={{ color: '#FFFFFF' }}>Verified</strong> Top Talents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS THAT TRUST US — ANIMATED LEFT-TO-RIGHT MARQUEE (A Touch of Black Background, White Brands) */}
      <section
        style={{
          background: '#0A170F',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2.25rem 0',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '0 1rem' }}>
          <p
            style={{
              fontFamily: 'var(--rf-font-display)',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.12em',
              margin: 0
            }}
          >
            TRUSTED BY LEADING TECH HUBS & FAST-GROWING ENTERPRISES ACROSS AFRICA
          </p>
        </div>

        {/* Marquee Ticker Track with Soft Edge Fading */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
          }}
        >
          <div className="rf-marquee-track" style={{ display: 'flex', gap: '3.75rem', alignItems: 'center' }}>
            {/* Duplicated array for seamless infinite looping */}
            {[...TRUSTED_BRANDS, ...TRUSTED_BRANDS].map((brand, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#FFFFFF',
                  opacity: 0.9,
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {brand.logo}
                </div>
                <span
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {brand.name}
                </span>
                {brand.subtext && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: 'rgba(255, 255, 255, 0.65)',
                      marginLeft: '-0.25rem',
                      background: 'rgba(255, 255, 255, 0.12)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px'
                    }}
                  >
                    {brand.subtext}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 2. RECRUITER TALENT CATEGORIES SHOWCASE */}
      <section className="rf-section" style={{ backgroundColor: 'var(--rf-bg-surface)' }}>
        <div className="rf-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'var(--rf-leaf-green)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                FOR RECRUITERS & HIRING TEAMS
              </span>
              <h2
                style={{
                  fontFamily: 'var(--rf-font-display)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                  fontWeight: 800,
                  color: 'var(--rf-cream)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em',
                  maxWidth: '480px'
                }}
              >
                Explore Talent Categories<br />Across Africa
              </h2>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem' }}>
                Pre-vetted engineering, design, AI, and compliance leaders ready for milestone engagement.
              </p>
            </div>
            <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-secondary" style={{ gap: '0.5rem' }}>
              <span>View All 54 African Countries</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="rf-grid-5 rf-talent-categories-slider" style={{ gap: '1rem' }}>
            {recruiterCategories.map(cat => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => onNavigate(`/marketplace?cat=${encodeURIComponent(cat.query)}`)}
                  className="rf-talent-cat-card"
                >
                  <div className="rf-cat-icon-box">
                    <Icon size={19} className="rf-cat-icon" />
                  </div>
                  <h3 className="rf-cat-title">
                    {cat.name}
                  </h3>
                  <div className="rf-cat-count">
                    {cat.count}
                  </div>
                  <div className="rf-cat-action">
                    <span>Browse available</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCOUT SOURCING SHOWCASE CARD — LET EXPERTS FIND THE RIGHT FREELANCER */}
      <section style={{ padding: '0 0 5rem 0', background: 'var(--rf-bg-surface)' }}>
        <div className="rf-container" style={{ maxWidth: '1200px' }}>
          <div
            className="rf-scout-sourcing-grid"
            style={{
              background: 'linear-gradient(135deg, #0F2E1E 0%, #0A1E14 55%, #122B1A 100%)',
              border: '1px solid rgba(102, 187, 42, 0.25)',
              borderRadius: '28px',
              padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.75rem, 4vw, 3.5rem)',
              boxShadow: '0 24px 60px -12px rgba(10, 23, 15, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient Background Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                right: '-15%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 187, 42, 0.2) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            {/* Left Content */}
            <div className="rf-scout-sourcing-text" style={{ position: 'relative', zIndex: 2 }}>
              {/* Official Refeir Logo & Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <RefeirLogo size="lg" isLight={true} showTagline={false} />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#66BB2A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}
                >
                  Scout Sourcing
                </span>
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontFamily: 'var(--rf-font-sans)',
                  fontSize: 'clamp(2.1rem, 4.4vw, 2.9rem)',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  letterSpacing: '-0.015em',
                  marginBottom: '1.75rem'
                }}
              >
                Let scouts find the right freelancer for you
              </h2>

              {/* 3 Bullet Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '2.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Check size={14} color="#66BB2A" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '1.02rem', color: 'rgba(235, 245, 238, 0.95)', lineHeight: 1.5, fontWeight: 500 }}>
                    Work with scouts who reconnoiter our marketplace, source, and recommend talents for you
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Check size={14} color="#66BB2A" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '1.02rem', color: 'rgba(235, 245, 238, 0.95)', lineHeight: 1.5, fontWeight: 500 }}>
                    Get a report with clear recommendations
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Check size={14} color="#66BB2A" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '1.02rem', color: 'rgba(235, 245, 238, 0.95)', lineHeight: 1.5, fontWeight: 500 }}>
                    Recruit recommended freelance talent with confidence
                  </span>
                </div>
              </div>

              {/* Button & Guarantee */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <button
                  onClick={() => onNavigate('/dashboard/scout')}
                  className="rf-btn rf-btn-primary rf-btn-lg"
                  style={{
                    gap: '0.625rem',
                    padding: '0.95rem 2rem',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 20px rgba(102, 187, 42, 0.45)'
                  }}
                >
                  <span>Explore scout sourcing</span>
                  <ArrowRight size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.95)', fontSize: '0.925rem', fontWeight: 600 }}>
                  <div className="rf-shield-beep-container">
                    <span className="rf-shield-beep-icon">
                      <ShieldCheck size={18} color="#66BB2A" />
                    </span>
                  </div>
                  <span>100% money back guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Visual — Stacked Profile Pictures with Big Mouse Pointer */}
            <div
              className="rf-scout-sourcing-visual"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '380px'
              }}
            >
              {/* Back Stacked Card: Shortlist & Candidate Match Report */}
              <div
                style={{
                  position: 'absolute',
                  width: '88%',
                  maxWidth: '360px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '22px',
                  padding: '1.5rem',
                  color: '#FFFFFF',
                  transform: 'rotate(6deg) translateY(-22px) translateX(24px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  zIndex: 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt="Candidate Profile"
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #66BB2A' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>Kofi Mensah 🇬🇭</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Lead Mobile Architect</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#66BB2A', background: 'rgba(102, 187, 42, 0.2)', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                    99% Match
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>Flutter</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>React Native</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>FastAPI</span>
                </div>
              </div>

              {/* Front Stacked Card: Scout Profile */}
              <div
                style={{
                  position: 'relative',
                  width: '92%',
                  maxWidth: '380px',
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '1.75rem',
                  boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                  color: '#122B1A',
                  transform: 'rotate(-2deg)',
                  zIndex: 2,
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* Scout Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                      alt="Scout Profile"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #66BB2A',
                        boxShadow: '0 4px 12px rgba(102, 187, 42, 0.35)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        background: '#66BB2A',
                        color: '#0F2E1E',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 900
                      }}
                    >
                      ★
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2E1E' }}>Amara Okafor 🇳🇬</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2E7D32', background: 'rgba(102, 187, 42, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                        Top 1% Scout
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.15rem 0 0.4rem 0', fontWeight: 500 }}>
                      Senior Pan-African Tech Scout
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>
                      <span>⭐ 4.98 Rating</span>
                      <span>•</span>
                      <span>340+ Hires Recommended</span>
                    </div>
                  </div>
                </div>

                {/* Sourcing Report Pill */}
                <div
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid rgba(102, 187, 42, 0.25)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#166534', letterSpacing: '0.04em' }}>
                      Active Sourcing Dossier
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2E7D32' }}>
                      Matched in 24h
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#14532D', margin: 0, fontWeight: 600 }}>
                    "Shortlisted 3 Principal Engineers with Trust Vault milestone protection."
                  </p>
                </div>

                {/* Scout Trust Stats */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(18, 43, 26, 0.08)', paddingTop: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Reward: <strong style={{ color: '#0F2E1E' }}>10% Guaranteed</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700, color: '#2E7D32' }}>
                    <ShieldCheck size={14} color="#66BB2A" />
                    <span>Verified Scout</span>
                  </div>
                </div>
              </div>

              {/* Big Mouse Pointer SVG pointing at Scout Card */}
              <div
                className="rf-scout-pointer-tooltip"
                style={{
                  position: 'absolute',
                  bottom: '12%',
                  right: '12%',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.45))',
                  animation: 'rfFloat 3s ease-in-out infinite'
                }}
              >
                {/* Pointer SVG */}
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 32 32"
                  fill="none"
                  style={{ transform: 'rotate(-25deg)', flexShrink: 0 }}
                >
                  <path
                    d="M6 3L26 14L16 17L12 27L6 3Z"
                    fill="#122B1A"
                    stroke="#66BB2A"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="14" r="2.5" fill="#66BB2A" />
                </svg>

                {/* Attached Interactive Tooltip */}
                <div
                  style={{
                    background: '#0F2E1E',
                    color: '#FFFFFF',
                    border: '1.5px solid #66BB2A',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 16px rgba(102, 187, 42, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#66BB2A' }} className="rf-pulse" />
                  <span>Hire via Scout Amara</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI WIZARD & CREATIVE STACKED CARDS SHOWCASE (90% Black Curved Container) */}
      <section style={{ padding: '0 0 5rem 0', background: 'var(--rf-bg-surface)' }}>
        <div className="rf-container" style={{ maxWidth: '1200px' }}>
          <div
            className="rf-ai-wizard-grid"
            style={{
              background: 'rgba(0, 0, 0, 0.90)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '28px',
              padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.75rem, 4vw, 3.5rem)',
              boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.06)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient Background Glow Effect */}
            <div
              style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 187, 42, 0.18) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-25%',
                right: '-10%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(246, 178, 26, 0.12) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            {/* Left Content Area */}
            <div className="rf-ai-wizard-text" style={{ position: 'relative', zIndex: 2 }}>
              {/* Pre-header */}
              <div style={{ marginBottom: '1rem' }}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: WIZARD_CARDS[activeWizardCardIndex].badgeColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}
                >
                  {WIZARD_CARDS[activeWizardCardIndex].badge}
                </span>
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontFamily: 'var(--rf-font-sans)',
                  fontSize: 'clamp(2.1rem, 4.4vw, 2.9rem)',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  letterSpacing: '-0.015em',
                  marginBottom: '1.25rem',
                  minHeight: '2.4em'
                }}
              >
                {WIZARD_CARDS[activeWizardCardIndex].title}
              </h2>

              {/* Body Description */}
              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'rgba(235, 245, 238, 0.88)',
                  lineHeight: 1.65,
                  fontWeight: 400,
                  marginBottom: '2.25rem',
                  maxWidth: '520px',
                  minHeight: '3.6em'
                }}
              >
                {WIZARD_CARDS[activeWizardCardIndex].description}
              </p>

              {/* Action Button & Stack Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <button
                  onClick={() => onNavigate(WIZARD_CARDS[activeWizardCardIndex].ctaQuery)}
                  className="rf-btn rf-btn-primary rf-btn-lg"
                  style={{
                    width: '265px',
                    justifyContent: 'center',
                    gap: '0.625rem',
                    padding: '0.95rem 1.5rem',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 20px rgba(102, 187, 42, 0.45)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {activeWizardCardIndex === 0 && <Wand2 size={19} className="rf-wand-animated" />}
                  {activeWizardCardIndex === 1 && <Bot size={19} className="rf-bot-animated" />}
                  {activeWizardCardIndex === 2 && <Palette size={19} className="rf-wand-animated" />}
                  <span>{WIZARD_CARDS[activeWizardCardIndex].ctaText}</span>
                  <ArrowRight size={18} />
                </button>

                {/* Previous / Next Stack Nav Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => setActiveWizardCardIndex((prev) => (prev === 0 ? WIZARD_CARDS.length - 1 : prev - 1))}
                    aria-label="Previous Card"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(102, 187, 42, 0.25)';
                      e.currentTarget.style.borderColor = '#66BB2A';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', padding: '0 0.4rem' }}>
                    {activeWizardCardIndex + 1} / {WIZARD_CARDS.length}
                  </span>

                  <button
                    onClick={() => setActiveWizardCardIndex((prev) => (prev === WIZARD_CARDS.length - 1 ? 0 : prev + 1))}
                    aria-label="Next Card"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(102, 187, 42, 0.25)';
                      e.currentTarget.style.borderColor = '#66BB2A';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Stack of Moving Portrait Photos (1 Grown in Front, Previous & Next Sits Right Behind) */}
            <div
              className="rf-ai-wizard-visual"
              onMouseEnter={() => setIsHoveredWizard(true)}
              onMouseLeave={() => setIsHoveredWizard(false)}
              style={{
                position: 'relative',
                width: '100%',
                minHeight: isMobile ? '260px' : '380px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '1000px',
                overflow: 'visible'
              }}
            >
              {AI_WIZARDS_PORTRAITS.map((wizard, idx) => {
                const total = AI_WIZARDS_PORTRAITS.length;
                let offset = (idx - activeWizardPortraitIndex + total) % total;
                if (offset > total / 2) {
                  offset -= total;
                }

                // Center (active/grown), Next (right behind), Prev (left behind), Far
                const isCenter = offset === 0;
                const isNext = offset === 1;
                const isPrev = offset === -1;
                const isFarNext = offset === 2;
                const isFarPrev = offset === -2;
                const isVisible = Math.abs(offset) <= 2;

                const cardW = isMobile ? 124 : 185;
                const cardH = isMobile ? 170 : 255;
                const cardRadius = isMobile ? '16px' : '22px';

                let translateX = 0;
                let scale = 0.6;
                let zIndex = 1;
                let opacity = 0;
                let rotateY = 0;

                const centerScale = isMobile ? 1.08 : 1.15;
                const nextTranslate = isMobile ? 85 : 135;
                const nextScale = isMobile ? 0.80 : 0.86;
                const farTranslate = isMobile ? 145 : 230;
                const farScale = isMobile ? 0.62 : 0.70;

                if (isCenter) {
                  translateX = 0;
                  scale = centerScale;
                  zIndex = 10;
                  opacity = 1;
                  rotateY = 0;
                } else if (isNext) {
                  translateX = nextTranslate;
                  scale = nextScale;
                  zIndex = 5;
                  opacity = 0.68;
                  rotateY = -8;
                } else if (isPrev) {
                  translateX = -nextTranslate;
                  scale = nextScale;
                  zIndex = 5;
                  opacity = 0.68;
                  rotateY = 8;
                } else if (isFarNext) {
                  translateX = farTranslate;
                  scale = farScale;
                  zIndex = 2;
                  opacity = 0.25;
                  rotateY = -14;
                } else if (isFarPrev) {
                  translateX = -farTranslate;
                  scale = farScale;
                  zIndex = 2;
                  opacity = 0.25;
                  rotateY = 14;
                } else {
                  translateX = offset > 0 ? (isMobile ? 190 : 320) : (isMobile ? -190 : -320);
                  scale = 0.5;
                  zIndex = 1;
                  opacity = 0;
                }

                return (
                  <div
                    key={wizard.name}
                    onClick={() => setActiveWizardPortraitIndex(idx)}
                    style={{
                      position: 'absolute',
                      width: `${cardW}px`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: isMobile ? '0.5rem' : '0.85rem',
                      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                      zIndex,
                      opacity: isVisible ? opacity : 0,
                      pointerEvents: isVisible ? 'auto' : 'none',
                      transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                      cursor: isCenter ? 'default' : 'pointer'
                    }}
                  >
                    {/* Vertical Portrait Photo */}
                    <div
                      style={{
                        width: `${cardW}px`,
                        height: `${cardH}px`,
                        borderRadius: cardRadius,
                        overflow: 'hidden',
                        position: 'relative',
                        border: isCenter 
                          ? '2.5px solid #66BB2A' 
                          : '1.5px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: isCenter
                          ? '0 24px 48px -8px rgba(0, 0, 0, 0.9), 0 0 35px rgba(102, 187, 42, 0.35)'
                          : '0 12px 28px rgba(0, 0, 0, 0.7)',
                        background: '#0F2E1E'
                      }}
                    >
                      <img
                        src={wizard.image}
                        alt={wizard.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      {/* Dark gradient base on the photo */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: isCenter 
                            ? 'linear-gradient(180deg, transparent 65%, rgba(10, 23, 15, 0.5) 100%)'
                            : 'linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(10, 23, 15, 0.75) 100%)'
                        }}
                      />
                    </div>

                    {/* ONLY Name Below Photo */}
                    <span
                      style={{
                        fontSize: isCenter ? (isMobile ? '0.82rem' : '0.95rem') : (isMobile ? '0.72rem' : '0.82rem'),
                        fontWeight: isCenter ? 700 : 500,
                        color: isCenter ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        letterSpacing: '-0.01em',
                        transition: 'all 0.4s ease',
                        textShadow: '0 2px 4px rgba(0,0,0,0.7)'
                      }}
                    >
                      {wizard.name}
                    </span>
                  </div>
                );
              })}

              {/* Bottom Quick Indicator Dots */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  zIndex: 20
                }}
              >
                {AI_WIZARDS_PORTRAITS.map((_, dotIdx) => {
                  const isDotActive = dotIdx === activeWizardPortraitIndex;
                  return (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveWizardPortraitIndex(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      style={{
                        width: isDotActive ? '20px' : '6px',
                        height: '6px',
                        background: isDotActive ? '#66BB2A' : 'rgba(255, 255, 255, 0.25)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SCOUTER INTERACTIVE EARNINGS CALCULATOR */}
      <section id="scout-calculator" className="rf-section rf-scout-calculator-section">
        <div className="rf-container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'var(--rf-leaf-green)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem'
              }}
            >
              INTERACTIVE REVENUE SIMULATOR
            </span>
            <h2
              style={{
                fontFamily: 'var(--rf-font-display)',
                fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                fontWeight: 800,
                color: 'var(--rf-cream)',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                maxWidth: '540px',
                margin: '0.5rem auto 0',
                textAlign: 'center'
              }}
            >
              How Much Can You Earn<br />as a Refeir Scout?
            </h2>
            <div className="rf-scout-heading-line" />
            <p
              style={{
                color: 'var(--rf-slate-300)',
                fontSize: '1.05rem',
                lineHeight: 1.55,
                maxWidth: '580px',
                margin: '0.5rem auto 0',
                textAlign: 'center'
              }}
            >
              Every time you refer a skilled professional and their project is completed,<br />you receive a guaranteed 10% reward.
            </p>
          </div>

          <div
            className="rf-scout-calculator-card"
            style={{
              padding: '2.5rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            {/* Controls */}
            <div>
              {/* Currency selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)' }}>Display Currency:</span>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {(['USD', 'NGN', 'KES', 'GHS'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setCalcCurrency(c)}
                      className={`rf-scout-currency-btn ${calcCurrency === c ? 'active' : ''}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Average Project Size */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)' }}>Average Project Value:</span>
                  <span className="rf-scout-val-highlight">
                    ${calcProjectValue.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="8000"
                  step="100"
                  value={calcProjectValue}
                  onChange={e => setCalcProjectValue(Number(e.target.value))}
                  className="rf-scout-range-slider"
                  style={{
                    '--slider-fill': `${Math.min(100, Math.max(0, ((calcProjectValue - 300) / (8000 - 300)) * 100))}%`
                  } as React.CSSProperties}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                  <span>$300 (Micro MVP)</span>
                  <span>$8,000 (Full Enterprise Build)</span>
                </div>
              </div>

              {/* Slider 2: Number of Successful Referrals */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--rf-cream)' }}>Successful Connections / Month:</span>
                  <span className="rf-scout-intro-highlight">
                    {calcReferralCount} Introductions
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={calcReferralCount}
                  onChange={e => setCalcReferralCount(Number(e.target.value))}
                  className="rf-scout-range-slider"
                  style={{
                    '--slider-fill': `${Math.min(100, Math.max(0, ((calcReferralCount - 1) / (15 - 1)) * 100))}%`
                  } as React.CSSProperties}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                  <span>1 hire / mo</span>
                  <span>15 hires / mo</span>
                </div>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="rf-scout-output-box">
              <span className="rf-scout-output-tag">
                ESTIMATED MONTHLY SCOUT REVENUE
              </span>
              <div style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 800, color: 'var(--rf-cream)', margin: '0.75rem 0 0.5rem' }}>
                {currencyRates[calcCurrency].symbol}{Math.round(scoutTotalEarnings).toLocaleString()}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', marginBottom: '1.5rem' }}>
                Based on <strong>10% guaranteed locked reward</strong> per completed project. Deposited directly to your Refeir Wallet.
              </p>

              <button
                onClick={() => onNavigate('/dashboard/scout')}
                className="rf-scout-cta-btn"
              >
                <span>Start Referring & Earn →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED AFRICAN TALENT */}
      <section className="rf-section" style={{ backgroundColor: 'var(--rf-bg-surface)' }}>
        <div className="rf-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'var(--rf-leaf-green)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                REFEIR PRO FEATURED TALENT
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                Featured Talent Ready for Hire
              </h2>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem' }}>
                Top vetted African professionals enrolled in Featured Talent Pro for accelerated global discovery.
              </p>
            </div>
            <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-secondary" style={{ gap: '0.5rem' }}>
              <span>View All Talent</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="rf-grid-cards rf-featured-talent-slider">
            {talentList
              .filter(talent => talent.is_pro || talent.is_featured)
              .map(talent => (
                <TalentCard
                  key={talent.id}
                  talent={talent}
                  onSelect={onSelectTalent}
                  onRefer={handleReferTalent}
                />
              ))}
          </div>
        </div>
      </section>

      {/* 5. POPULAR SERVICES WITH LOCKED REFERRAL REWARDS */}
      <section className="rf-section">
        <div className="rf-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'var(--rf-leaf-green)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                HIGH-CONVERTING PACKAGES
              </span>
              <h2
                style={{
                  fontFamily: 'var(--rf-font-display)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                  fontWeight: 800,
                  color: 'var(--rf-cream)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em',
                  maxWidth: '480px'
                }}
              >
                Popular Services<br />with Guaranteed Rewards
              </h2>
              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.9375rem', marginTop: '0.35rem' }}>
                Fixed deliverables with permanently locked referral commission rates.
              </p>
            </div>
            <button onClick={() => onNavigate('/marketplace')} className="rf-btn rf-btn-secondary" style={{ gap: '0.5rem' }}>
              <span>Explore All Services</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="rf-grid-cards rf-popular-services-slider">
            {servicesList.slice(0, 4).map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={onSelectService}
                onRefer={handleReferService}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY REFEIR MARKETPLACE COMPARISON */}
      <section className="rf-section" style={{ backgroundColor: 'var(--rf-bg-surface)' }}>
        <div className="rf-container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'var(--rf-leaf-green)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem'
              }}
            >
              THE REFEIR DIFFERENCE
            </span>
            <h2
              style={{
                fontFamily: 'var(--rf-font-display)',
                fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                fontWeight: 800,
                color: 'var(--rf-cream)',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                maxWidth: '540px',
                margin: '0.5rem auto 0',
                textAlign: 'center'
              }}
            >
              How Refeir Compares<br />to Traditional Platforms
            </h2>
            <p style={{ color: 'var(--rf-slate-300)', fontSize: '1rem', marginTop: '0.5rem' }}>
              Turning word-of-mouth recommendations into a verifiable economic system.
            </p>
          </div>

          <div style={{ background: 'var(--rf-bg-card)', border: '1px solid var(--rf-bg-card-border)', borderRadius: 'var(--rf-radius-xl)', overflow: 'hidden', boxShadow: 'var(--rf-shadow-lg)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                    <th style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-300)', fontWeight: 700 }}>Feature / Capability</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-leaf-green)', fontWeight: 800, background: 'rgba(102, 187, 42, 0.08)' }}>REFEIR</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-400)', fontWeight: 600 }}>Upwork / Fiverr</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-400)', fontWeight: 600 }}>Offline Agencies</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-cream)', fontWeight: 600 }}>
                      10% Locked Scout Referral Reward
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-leaf-green)', fontWeight: 800, background: 'rgba(102, 187, 42, 0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Check size={16} /> Guaranteed</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-400)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><X size={16} color="var(--rf-vibrant-orange)" /> 0% (No rewards)</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-400)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><X size={16} color="var(--rf-vibrant-orange)" /> Informal / Unpaid</div>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-cream)', fontWeight: 600 }}>
                      54 Sovereign African Currency Rails
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-leaf-green)', fontWeight: 800, background: 'rgba(102, 187, 42, 0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Check size={16} /> Native (M-Pesa, MoMo, Bank)</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-400)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><X size={16} color="var(--rf-vibrant-orange)" /> Expensive USD wire fees</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-400)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>Manual international SWIFT</div>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--rf-bg-card-border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-cream)', fontWeight: 600 }}>
                      100% Trust Vault Milestone Protection
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-leaf-green)', fontWeight: 800, background: 'rgba(102, 187, 42, 0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Check size={16} /> Double-entry Vault</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-cream)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Check size={16} /> Trust Vault available</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-400)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><X size={16} color="var(--rf-vibrant-orange)" /> Risky 50% upfront invoices</div>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-cream)', fontWeight: 600 }}>
                      Paid Connects & Bidding Tokens
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-leaf-green)', fontWeight: 800, background: 'rgba(102, 187, 42, 0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Check size={16} /> Zero ($0 Forever)</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-400)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><X size={16} color="var(--rf-vibrant-orange)" /> Expensive Connects to bid</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--rf-slate-400)' }}>
                      N/A
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 7A. 3D INTERACTIVE AFRICA MAP — FIND PROVEN TALENTS IN AND ACROSS AFRICA */}
      <section style={{ padding: '4rem 0 2rem 0', background: 'var(--rf-bg-base)' }}>
        <div className="rf-container" style={{ maxWidth: '1200px' }}>
          <Africa3DMap onNavigate={onNavigate} />
        </div>
      </section>

      {/* 7B. INTERACTIVE AFRICA MARKETPLACE MAP & EXPLORER */}
      <section className="rf-section">
        <div className="rf-container">
          <AfricaMapExplorer
            onSelectCountry={countryId => onNavigate(`/countries/${countryId}`)}
            onSelectRegion={region => onNavigate(`/africa/${region.toLowerCase().replace(' ', '-')}`)}
          />
        </div>
      </section>

      {/* 8. BUSINESS & ENTERPRISE BANNER WITH 3D POLYGON RELATIONSHIPS MESH */}
      <section className="rf-section" style={{ backgroundColor: 'var(--rf-bg-surface)', padding: '5rem 0' }}>
        <div className="rf-container">
          <div
            className="rf-business-grid"
            style={{
              background: 'linear-gradient(135deg, rgba(10, 28, 18, 0.95) 0%, rgba(8, 20, 14, 0.98) 100%)',
              border: '1px solid rgba(102, 187, 42, 0.35)',
              borderRadius: 'var(--rf-radius-2xl, 24px)',
              padding: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* LEFT: 3D Animated Polygon Network of Links (Countries & People) */}
            <div style={{ position: 'relative', width: '100%', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PolygonNetwork3D />
            </div>

            {/* RIGHT: Refeir for Business Info & Action Buttons */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#F6B21A',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                FOR SCALE-UPS & ENTERPRISE
              </span>
              <h3
                style={{
                  fontFamily: 'var(--rf-font-display)',
                  fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em',
                  marginTop: '0.25rem'
                }}
              >
                Refeir for Business<br />& Global Teams
              </h3>
              <p style={{ color: 'rgba(235, 245, 238, 0.9)', fontSize: '1rem', marginTop: '0.85rem', lineHeight: 1.65, maxWidth: '560px' }}>
                Consolidated multi-currency invoicing, cross-border contractor tax compliance across 54 jurisdictions, and dedicated tech scout sourcing to build high-performance distributed teams.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
                <button onClick={() => onNavigate('/business')} className="rf-btn rf-btn-primary rf-btn-lg">
                  <span>Explore Enterprise Solutions</span>
                  <ArrowRight size={18} />
                </button>
                <button onClick={() => onNavigate('/pricing')} className="rf-btn rf-btn-secondary rf-btn-lg">
                  <span>View Pricing Breakdown</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REFEIR MANIFESTO SECTION */}
      <section
        className="rf-section"
        style={{
          background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.2) 0%, rgba(246, 178, 26, 0.12) 50%, rgba(244, 124, 32, 0.12) 100%)',
          borderTop: '1px solid var(--rf-bg-card-border)',
          borderBottom: '1px solid var(--rf-bg-card-border)'
        }}
      >
        <div className="rf-container" style={{ maxWidth: '820px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--rf-leaf-green)', textTransform: 'uppercase' }}>
            THE REFEIR MANIFESTO
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--rf-cream)', marginTop: '0.75rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            "Sometimes the most valuable thing you can say is: <span style={{ color: 'var(--rf-leaf-green)' }}>I know someone</span>."
          </h2>
          <p style={{ color: 'var(--rf-cream)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '2rem', opacity: 0.9 }}>
            Your network is worth infinitely more than a passive contact list. For generations, Africa's greatest business breakthroughs have happened through trusted word-of-mouth. Refeir gives that age-old truth a modern, pan-African digital rail — locking in fair rewards, protecting project payments, and opening doors across borders.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('/dashboard/scout')}
              className="rf-btn rf-btn-mint rf-btn-lg"
            >
              <span>Join the Scout Network</span>
            </button>
            <button
              onClick={() => onNavigate('/demo-tour')}
              className="rf-btn rf-btn-secondary rf-btn-lg"
              style={{ gap: '0.5rem' }}
            >
              <span>Watch Cross-Border Demo</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 9.5 HOW IT WORKS SECTION */}
      <section
        ref={howItWorksSectionRef}
        className="rf-section"
        onMouseEnter={handleHowItWorksMouseEnter}
        onMouseLeave={handleHowItWorksMouseLeave}
        style={{
          background: 'var(--rf-bg-surface)',
          borderTop: '1px solid var(--rf-bg-card-border)',
          borderBottom: '1px solid var(--rf-bg-card-border)',
          padding: '6rem 0'
        }}
      >
        <div className="rf-container">
          {/* Section Header with Left-Aligned Title and Toggle Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.75rem',
              marginBottom: '3rem'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'var(--rf-leaf-green)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                {HOW_IT_WORKS_DATA[howItWorksTab].tag}
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 800,
                  color: 'var(--rf-cream)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  margin: 0
                }}
              >
                How it Works
              </h2>
            </div>

            {/* 3 Toggle Buttons: For Recruiting, For Job Hunting, For Scouting */}
            <div className="rf-how-toggle-group">
              <button
                type="button"
                onClick={() => setHowItWorksTab('recruiting')}
                className={`rf-how-toggle-btn ${howItWorksTab === 'recruiting' ? 'active' : ''}`}
              >
                For Recruiting
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('hunting')}
                className={`rf-how-toggle-btn ${howItWorksTab === 'hunting' ? 'active' : ''}`}
              >
                For Job Hunting
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('scouting')}
                className={`rf-how-toggle-btn ${howItWorksTab === 'scouting' ? 'active' : ''}`}
              >
                For Scouting
              </button>
            </div>
          </div>

          {/* 3 Tab Grids kept continuously in DOM so For Recruiting video persists across tab toggles */}
          {(['recruiting', 'hunting', 'scouting'] as const).map(tabKey => (
            <div
              key={tabKey}
              className="rf-how-grid"
              style={{ display: howItWorksTab === tabKey ? 'grid' : 'none' }}
            >
              {HOW_IT_WORKS_DATA[tabKey].cards.map((card, idx) => (
                <div key={`${tabKey}-${idx}`} className="rf-how-card">
                  {/* Thumbnail: Card 1 is looping video with lightweight top-right pause/play button; Cards 2 & 3 are clean photos */}
                  <div className="rf-how-thumb-wrapper" onClick={idx === 0 && tabKey === 'recruiting' ? handleToggleFirstVideo : undefined}>
                    {idx === 0 ? (
                      <>
                        <video
                          ref={tabKey === 'recruiting' ? firstVideoRef : undefined}
                          src={(card as any).videoUrl || (tabKey === 'recruiting' ? '/launching_demo.mp4' : '/Refeir_logo.mp4')}
                          poster={card.thumbnail}
                          loop
                          muted={tabKey !== 'recruiting'}
                          playsInline
                          className="rf-how-thumb-img"
                          style={{ objectFit: 'cover' }}
                        />
                        {/* Top-Right Glassmorphic Curvy Square Pause/Play Toggle Button with Solid Filled Icon */}
                        <button
                          type="button"
                          onClick={tabKey === 'recruiting' ? handleToggleFirstVideo : undefined}
                          className="rf-how-video-control-btn"
                          aria-label={tabKey === 'recruiting' ? (isFirstVideoPlaying ? 'Pause video' : 'Play video') : 'Play video'}
                        >
                          {tabKey === 'recruiting' ? (
                            isFirstVideoPlaying ? (
                              <Pause size={14} fill="#FFFFFF" color="#FFFFFF" strokeWidth={0} />
                            ) : (
                              <Play size={14} fill="#FFFFFF" color="#FFFFFF" strokeWidth={0} style={{ marginLeft: '1.5px' }} />
                            )
                          ) : (
                            <Play size={14} fill="#FFFFFF" color="#FFFFFF" strokeWidth={0} style={{ marginLeft: '1.5px' }} />
                          )}
                        </button>
                      </>
                    ) : (
                      <img
                        src={card.thumbnail}
                        alt={card.title}
                        className="rf-how-thumb-img"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Card Content & Hover Reveal Container */}
                  <div className="rf-how-card-body">
                    <h3 className="rf-how-card-title">{card.title}</h3>
                    <div className="rf-how-card-reveal">
                      <div className="rf-how-card-reveal-inner">
                        <p className="rf-how-card-desc">{card.description}</p>
                        <button
                          onClick={card.buttonAction}
                          className="rf-how-cta-btn"
                        >
                          <span>{card.buttonText}</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL HERO CTA */}
      <section
        className="rf-section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          padding: '7rem 1.5rem',
          backgroundColor: 'var(--rf-navy-dark)'
        }}
      >
        {/* Blurred Google Map Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/google_map_bg.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px) brightness(0.65) saturate(1.25)',
            transform: 'scale(1.08)',
            zIndex: 0
          }}
        />

        {/* Gradient Overlay Vignette & Radial Glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, rgba(10, 23, 15, 0.45) 0%, rgba(10, 23, 15, 0.88) 70%, rgba(10, 23, 15, 0.98) 100%), linear-gradient(180deg, rgba(10, 23, 15, 0.9) 0%, rgba(102, 187, 42, 0.08) 50%, rgba(10, 23, 15, 0.95) 100%)',
            zIndex: 1
          }}
        />

        {/* Ambient Top & Bottom Separator Borders */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(102, 187, 42, 0.4), transparent)',
            zIndex: 2
          }}
        />

        <div className="rf-container" style={{ maxWidth: '720px', position: 'relative', zIndex: 3 }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
            Refer and Earn
          </h2>
          <p style={{ color: 'rgba(240, 248, 243, 0.92)', fontSize: '1.125rem', marginBottom: '2.25rem', lineHeight: 1.65, textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}>
            The next opportunity might already be in your network.<br />
            Find someone. Refer someone. Get work done. Earn from the connection.
          </p>
          <button
            onClick={() => onNavigate('/marketplace')}
            className="rf-revolving-btn-wrapper"
            style={{ textTransform: 'none' }}
          >
            {/* Fast Revolving Glowing Beam */}
            <div className="rf-revolving-orbit-beam" />
            <span className="rf-revolving-btn-inner">
              Join Refeir Today
            </span>
          </button>
        </div>
      </section>

      {/* Refer Modal when trigger is clicked */}
      {selectedTalentForRefer && (
        <ReferModal
          talent={selectedTalentForRefer}
          service={selectedServiceForRefer || undefined}
          onClose={() => {
            setSelectedTalentForRefer(null);
            setSelectedServiceForRefer(null);
          }}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
