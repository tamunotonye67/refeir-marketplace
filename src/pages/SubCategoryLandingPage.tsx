import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Home,
  Star,
  MapPin,
  Briefcase,
  Wallet,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  UserCheck,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  Cpu,
  Compass,
  Award,
  Share2,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { ReferModal } from '../components/referral/ReferModal';
import { TalentProfile } from '../types';
import { formatMoney } from '../data/currencies';
import { TALENT_SUB_CATEGORIES, TalentSubCategory } from '../data/subCategories';

interface SubCategoryLandingPageProps {
  subCategoryId: string;
  onNavigate: (path: string) => void;
  onSelectTalent: (talent: TalentProfile) => void;
}

interface SubCategoryResolved {
  categoryName: string;
  categoryQuery: string;
  sub: TalentSubCategory;
  singularRole: string;
}

const CATEGORY_QUERY_MAP: Record<string, string> = {
  'Software & Mobile': 'Engineering',
  'AI & Data Science': 'AI & Data',
  'Product & UI/UX Design': 'Design & Creative',
  'DevSecOps & Cloud': 'Security & DevOps',
  'Growth & Marketing': 'Growth & Marketing',
  'Legal & FinTech IP': 'Legal & Operations',
  'Finance & Accounting': 'Finance',
  'Video & Animation': 'Video & Animation',
  'Writing & Translation': 'Writing & Translation',
  'Photography & Media': 'Photography',
};

const PILL_CATEGORY_DEFAULTS: Record<
  string,
  { categoryName: string; name: string; count: string; keywords: string[] }
> = {
  'ai-services': {
    categoryName: 'AI & Data Science',
    name: 'AI Services Specialists',
    count: '780+',
    keywords: ['machine learning', 'llm', 'langchain', 'openai', 'python', 'nlp'],
  },
  'graphic-design': {
    categoryName: 'Product & UI/UX Design',
    name: 'Graphic Designers',
    count: '1,150+',
    keywords: ['brand identity', 'art direction', 'typography', 'packaging', 'figma'],
  },
  'writing-translation': {
    categoryName: 'Writing & Translation',
    name: 'Writing & Translation Specialists',
    count: '640+',
    keywords: ['content strategy', 'copywriting', 'translation', 'multilingual', 'user stories'],
  },
  'video-animation': {
    categoryName: 'Video & Animation',
    name: 'Video & Animation Creators',
    count: '590+',
    keywords: ['motion graphics', 'video', 'art direction', 'brand identity'],
  },
  'digital-marketing': {
    categoryName: 'Growth & Marketing',
    name: 'Digital Marketers',
    count: '820+',
    keywords: ['growth marketing', 'seo', 'paid social', 'e-commerce', 'content strategy'],
  },
  consulting: {
    categoryName: 'Legal & FinTech IP',
    name: 'Management & Strategy Consultants',
    count: '430+',
    keywords: ['product management', 'corporate law', 'venture', 'roadmapping', 'agile'],
  },
  data: {
    categoryName: 'AI & Data Science',
    name: 'Data Engineers & Analysts',
    count: '560+',
    keywords: ['data analytics', 'python', 'postgresql', 'machine learning'],
  },
  finance: {
    categoryName: 'Finance & Accounting',
    name: 'Finance & Accounting Experts',
    count: '410+',
    keywords: ['fraud prevention', 'data analytics', 'venture', 'contracts'],
  },
  photography: {
    categoryName: 'Photography & Media',
    name: 'Commercial Photographers',
    count: '370+',
    keywords: ['packaging', 'art direction', 'brand identity', 'motion graphics'],
  },
  fullstack: {
    categoryName: 'Software & Mobile',
    name: 'Full-Stack & Web Developers',
    count: '1,420+',
    keywords: ['full stack', 'react', 'next.js', 'node.js', 'typescript', 'postgresql'],
  },
  mobile: {
    categoryName: 'Software & Mobile',
    name: 'Mobile App Developers',
    count: '950+',
    keywords: ['flutter', 'ios', 'swift', 'react native', 'mobile'],
  },
  design: {
    categoryName: 'Product & UI/UX Design',
    name: 'UI/UX & Product Designers',
    count: '890+',
    keywords: ['product design', 'ui/ux', 'design systems', 'figma', 'user research'],
  },
  'cloud-devops': {
    categoryName: 'DevSecOps & Cloud',
    name: 'DevSecOps & Cloud Architects',
    count: '510+',
    keywords: ['devops', 'kubernetes', 'terraform', 'aws', 'docker', 'ci/cd'],
  },
  'blockchain-web3': {
    categoryName: 'Software & Mobile',
    name: 'Blockchain & Web3 Developers',
    count: '480+',
    keywords: ['solidity', 'rust', 'web3', 'smart contracts', 'defi'],
  },
  cybersecurity: {
    categoryName: 'DevSecOps & Cloud',
    name: 'Cybersecurity Specialists',
    count: '390+',
    keywords: ['cybersecurity', 'penetration testing', 'devsecops', 'compliance', 'aws security'],
  },
  ecommerce: {
    categoryName: 'Growth & Marketing',
    name: 'E-Commerce Specialists',
    count: '720+',
    keywords: ['e-commerce', 'growth marketing', 'paid social', 'seo', 'react'],
  },
  'game-dev': {
    categoryName: 'Software & Mobile',
    name: 'Game & 3D Developers',
    count: '340+',
    keywords: ['mobile', 'flutter', 'motion graphics', 'rust', 'react'],
  },
  'legal-compliance': {
    categoryName: 'Legal & FinTech IP',
    name: 'Legal & Regulatory Advisors',
    count: '290+',
    keywords: ['corporate law', 'ip protection', 'ndpr', 'gdpr', 'contracts', 'compliance'],
  },
  'audio-music': {
    categoryName: 'Video & Animation',
    name: 'Music & Audio Producers',
    count: '460+',
    keywords: ['voice ai', 'motion graphics', 'art direction', 'multilingual'],
  },
  'customer-support': {
    categoryName: 'AI & Data Science',
    name: 'Customer Support & CX Specialists',
    count: '890+',
    keywords: ['customer support ai', 'conversational ux', 'crm bots', 'zendesk', 'hubspot'],
  },
  'hardware-iot': {
    categoryName: 'Software & Mobile',
    name: 'Hardware & IoT Engineers',
    count: '310+',
    keywords: ['rust', 'go', 'cloud architecture', 'mobile', 'python'],
  },
};

function toSingular(pluralName: string): string {
  const trimmed = pluralName.trim();
  if (trimmed.endsWith('ies')) return `${trimmed.slice(0, -3)}y`;
  if (trimmed.endsWith('s') && !trimmed.endsWith('ss')) return trimmed.slice(0, -1);
  return trimmed;
}

/** Ensures any skill label turns into a concise 2-4 word plural role title so "Hire the Best [Title]" never exceeds 2 lines. */
function normalizeRolePlural(rawLabel: string): string {
  // 1. Strip any parenthetical notes like "(Blender/C4D)" or "(FP&A)"
  let cleaned = rawLabel.replace(/\s*\([^)]*\)/g, '').trim();

  // 2. If a compound phrase with "&" or "/" is long, keep the primary phrase
  if (cleaned.length > 22 && /\s+(?:&|\/)\s+/.test(cleaned)) {
    const parts = cleaned.split(/\s+(?:&|\/)\s+/);
    cleaned = parts[0].trim();
  }

  // 3. Natural action-to-role conversions to avoid adding an extra "Specialists" word
  const suffixReplacements: Array<[RegExp, string]> = [
    [/\bDesign$/i, 'Designers'],
    [/\bDevelopment$/i, 'Developers'],
    [/\bEngineering$/i, 'Engineers'],
    [/\bWriting$/i, 'Writers'],
    [/\bCopywriting$/i, 'Copywriters'],
    [/\bEditing$/i, 'Editors'],
    [/\bConsulting$/i, 'Consultants'],
    [/\bAdvisory$/i, 'Advisors'],
    [/\bManagement$/i, 'Managers'],
    [/\bAdministration$/i, 'Admins'],
    [/\bArchitecture$/i, 'Architects'],
    [/\bProduction$/i, 'Producers'],
    [/\bAnimation$/i, 'Animators'],
    [/\bIllustration$/i, 'Illustrators'],
    [/\bVisualization$/i, 'Visualizers'],
    [/\bVisualizations$/i, 'Visualizers'],
    [/\bPhotography$/i, 'Photographers'],
    [/\bRetouching$/i, 'Retouchers'],
    [/\bTranslation$/i, 'Translators'],
    [/\bStrategy$/i, 'Strategists'],
    [/\bAnalytics$/i, 'Analysts'],
    [/\bAnalysis$/i, 'Analysts'],
    [/\bModeling$/i, 'Modelers'],
    [/\bAuditing$/i, 'Auditors'],
    [/\bAudits$/i, 'Auditors'],
    [/\bTesting$/i, 'Testers'],
    [/\bMarketing$/i, 'Marketers'],
    [/\bRecruiting$/i, 'Recruiters'],
  ];

  for (const [pattern, replacement] of suffixReplacements) {
    if (pattern.test(cleaned)) {
      return cleaned.replace(pattern, replacement);
    }
  }

  const roleEndings = [
    'Engineers',
    'Developers',
    'Designers',
    'Specialists',
    'Analysts',
    'Architects',
    'Marketers',
    'Strategists',
    'Lawyers',
    'Counsel',
    'Consultants',
    'Advisors',
    'Accountants',
    'Bookkeepers',
    'CFOs',
    'Editors',
    'Artists',
    'Animators',
    'Directors',
    'Writers',
    'Translators',
    'Photographers',
    'Retouchers',
    'Storytellers',
    'Creators',
    'Producers',
    'Agents',
    'Reps',
    'Managers',
    'Admins',
    'Practitioners',
    'Experts',
    'Visualizers',
    'Illustrators',
    'Modelers',
    'Auditors',
    'Testers',
    'Musicians',
  ];
  if (roleEndings.some(ending => cleaned.toLowerCase().endsWith(ending.toLowerCase()))) {
    return cleaned;
  }

  // Cap at 3 words before appending "Experts" so total heading stays <= 6 words
  const words = cleaned.split(/\s+/);
  const compactBase = words.length > 3 ? words.slice(0, 3).join(' ') : cleaned;
  return `${compactBase} Experts`;
}

function extractKeywordsFromTitle(title: string, parentCategory: string): string[] {
  const tokens = title
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .split(/[\s,&/+-]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2 && !['and', 'the', 'for', 'with'].includes(t));
  const parentSubs = TALENT_SUB_CATEGORIES[parentCategory] || [];
  const parentKws = parentSubs.flatMap(s => s.keywords);
  return Array.from(new Set([...tokens, ...parentKws])).slice(0, 8);
}

function resolveSubCategory(subId: string): SubCategoryResolved {
  const rawSearch = typeof window !== 'undefined' ? window.location.search : '';
  const searchParams = new URLSearchParams(rawSearch);
  const customTitle = searchParams.get('title')?.trim();
  const customCat = searchParams.get('cat')?.trim();

  const decoded = decodeURIComponent(subId || '').trim();
  const cleanId = decoded.toLowerCase();

  // 1. Exact or slug match in TALENT_SUB_CATEGORIES
  for (const [catName, subs] of Object.entries(TALENT_SUB_CATEGORIES)) {
    for (const sub of subs) {
      const subSlug = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (
        sub.id.toLowerCase() === cleanId ||
        sub.name.toLowerCase() === cleanId ||
        subSlug === cleanId
      ) {
        return {
          categoryName: catName,
          categoryQuery: CATEGORY_QUERY_MAP[catName] || catName,
          sub,
          singularRole: toSingular(sub.name),
        };
      }
    }
  }

  // 2. Match top sticky-bar pill category IDs (e.g., 'ai-services', 'graphic-design', etc.)
  if (PILL_CATEGORY_DEFAULTS[cleanId] && !customTitle) {
    const preset = PILL_CATEGORY_DEFAULTS[cleanId];
    const sub: TalentSubCategory = {
      id: cleanId,
      name: preset.name,
      count: preset.count,
      keywords: preset.keywords,
    };
    return {
      categoryName: preset.categoryName,
      categoryQuery: CATEGORY_QUERY_MAP[preset.categoryName] || preset.categoryName,
      sub,
      singularRole: toSingular(sub.name),
    };
  }

  // 3. Dynamic skill / sub-category from the sticky flyout menu or custom title
  const baseLabel =
    customTitle ||
    decoded
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, ch => ch.toUpperCase());

  const resolvedCatName =
    (customCat &&
      (Object.keys(TALENT_SUB_CATEGORIES).find(
        k => k.toLowerCase() === customCat.toLowerCase()
      ) ||
        PILL_CATEGORY_DEFAULTS[customCat.toLowerCase()]?.categoryName)) ||
    'Software & Mobile';

  const pluralRoleName = normalizeRolePlural(baseLabel);
  const dynamicSub: TalentSubCategory = {
    id: cleanId || 'custom-skill',
    name: pluralRoleName,
    count: '240+',
    keywords: extractKeywordsFromTitle(baseLabel, resolvedCatName),
  };

  return {
    categoryName: resolvedCatName,
    categoryQuery: CATEGORY_QUERY_MAP[resolvedCatName] || resolvedCatName,
    sub: dynamicSub,
    singularRole: toSingular(pluralRoleName),
  };
}

function scoreTalent(talent: TalentProfile, keywords: string[]): number {
  const skills = talent.skills.map(s => s.toLowerCase());
  const headline = talent.headline.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    const k = kw.toLowerCase();
    if (skills.some(s => s.includes(k))) score += 2;
    else if (headline.includes(k)) score += 1;
  }
  return score;
}

function shortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

const TESTIMONIALS = [
  {
    quote:
      'Refeir provides an umbrella-level of security. I can see a specialist’s verified work history and ratings, hold payments in milestone escrow, and collaborate inside Refeir Messages instead of scattered email threads.',
    author: 'Kim Darling',
    initials: 'KD',
    company: 'Emerald Tiger Ventures',
  },
  {
    quote:
      'Refeir is the best platform to hire skilled Pan-African professionals when we need fast execution without compromising on engineering or design quality. Every company in our portfolio relies on Refeir to scale.',
    author: 'David Merry',
    initials: 'DM',
    company: 'Kinetic Investments',
  },
  {
    quote:
      'Our specialized sprints require vetted talent who can onboard in 48 hours. Refeir’s scout-backed vetting and multi-currency escrow give our leadership team complete confidence on every deliverable.',
    author: 'Katja Krohn',
    initials: 'KK',
    company: 'Summa Global Labs',
  },
  {
    quote:
      'From initial brief to final milestone release, the quality of specialists we hired through Refeir exceeded our expectations. We shipped our v2 platform three weeks ahead of schedule.',
    author: 'Tunde Bakare',
    initials: 'TB',
    company: 'Paystack Ecosystem Partner',
  },
];

const PAN_AFRICAN_HUBS = [
  'Nigeria',
  'Kenya',
  'South Africa',
  'Ghana',
  'Egypt',
  'Rwanda',
  'Morocco',
  'Senegal',
  'Tanzania',
  'Uganda',
  'Ethiopia',
  'Côte d’Ivoire',
  'Tunisia',
  'Zambia',
  'Cameroon',
  'Mauritius',
];

export const SubCategoryLandingPage: React.FC<SubCategoryLandingPageProps> = ({
  subCategoryId,
  onNavigate,
  onSelectTalent,
}) => {
  const { talentList } = useMarketplace();
  const { currentUser } = useAuth();
  const [visibleCount, setVisibleCount] = useState(4);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});
  const [referTalent, setReferTalent] = useState<TalentProfile | null>(null);
  const testimonialTrackRef = useRef<HTMLDivElement>(null);

  const getInitialMode = (): 'HIRE' | 'SCOUT' | 'TALENT' => {
    if (typeof window !== 'undefined') {
      const modeParam = new URLSearchParams(window.location.search).get('mode')?.toUpperCase();
      if (modeParam === 'SCOUT') return 'SCOUT';
      if (modeParam === 'TALENT') return 'TALENT';
      if (modeParam === 'HIRE' || modeParam === 'CLIENT') return 'HIRE';
    }
    if (currentUser?.active_role === 'SCOUT') return 'SCOUT';
    if (currentUser?.active_role === 'TALENT') return 'TALENT';
    return 'HIRE';
  };

  const [journeyMode, setJourneyMode] = useState<'HIRE' | 'SCOUT' | 'TALENT'>(getInitialMode);

  const resolved = useMemo(() => resolveSubCategory(subCategoryId), [subCategoryId]);
  const { categoryName, categoryQuery, sub, singularRole } = resolved;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setVisibleCount(4);
    setExpandedFaqs({});
    setJourneyMode(getInitialMode());
  }, [subCategoryId]);

  const handleReferClick = (talent: TalentProfile) => {
    if (currentUser) {
      setReferTalent(talent);
    } else {
      onNavigate(`/talent/${talent.id}?intent=scout`);
    }
  };

  const categorySubs = TALENT_SUB_CATEGORIES[categoryName] || [];
  const categoryKeywords = useMemo(
    () => categorySubs.flatMap(s => s.keywords),
    [categorySubs]
  );

  // Rank and match talents so we have at least 8 profiles for "View more"
  const matchedTalents = useMemo(() => {
    const rank = (keywords: string[]) =>
      talentList
        .map(t => ({ t, s: scoreTalent(t, keywords) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s || b.t.rating - a.t.rating)
        .map(x => x.t);

    const picked: TalentProfile[] = [];
    const add = (list: TalentProfile[]) => {
      for (const t of list) {
        if (!picked.some(p => p.id === t.id)) picked.push(t);
      }
    };
    add(rank(sub.keywords));
    add(rank(categoryKeywords));
    add([...talentList].sort((a, b) => b.rating - a.rating));
    return picked;
  }, [talentList, sub.keywords, categoryKeywords]);

  const displayedTalents = matchedTalents.slice(0, visibleCount);

  // Deterministic review count & rating per sub-category
  const reviewStats = useMemo(() => {
    const hash = sub.name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const reviews = 4800 + (hash % 19) * 840 + (hash % 97);
    const rating = (4.8 + ((hash % 3) * 0.05)).toFixed(1);
    return { reviews: reviews.toLocaleString(), rating };
  }, [sub.name]);

  // Dynamic Hiring Guide responsibilities & cost tiers tailored to the specialty
  const primaryKeyword = sub.keywords[0] || sub.name;
  const secondaryKeyword = sub.keywords[1] || categoryName;
  const tertiaryKeyword = sub.keywords[2] || 'scalable systems';

  // Open specialty contracts shown in TALENT mode
  const openSpecialtyJobs = useMemo(
    () => [
      {
        id: `job-${sub.id}-1`,
        title: `Senior ${singularRole} — Milestone Delivery`,
        company: 'Emerald FinTech Labs (London / Lagos)',
        budget: '$2,400–$4,800',
        scoutBounty: '$240–$480 Scout Bonus',
        duration: '4–6 weeks · Milestone Escrow',
        skills: [primaryKeyword, secondaryKeyword, tertiaryKeyword].map(s =>
          s.replace(/\b\w/g, c => c.toUpperCase())
        ),
        summary: `Seeking a verified ${singularRole.toLowerCase()} to lead our ${primaryKeyword} sprint with weekly milestone payouts via Trust Vault.`,
      },
      {
        id: `job-${sub.id}-2`,
        title: `${sub.name} Lead for Cross-Border Product`,
        company: 'Kora Growth Ventures (Nairobi / Remote)',
        budget: '$1,500–$3,200',
        scoutBounty: '$150–$320 Scout Bonus',
        duration: '3–4 weeks · Milestone Escrow',
        skills: sub.keywords
          .slice(0, 3)
          .map(s => s.replace(/\b\w/g, c => c.toUpperCase())),
        summary: `Collaborate with our product and engineering team to ship production-ready ${primaryKeyword} workflows and documentation.`,
      },
      {
        id: `job-${sub.id}-3`,
        title: `Contract ${singularRole} (Ongoing Retainer)`,
        company: 'Sahara Cloud Systems (Cape Town / Remote)',
        budget: '$1,200/mo',
        scoutBounty: '$120/mo Recurring Scout Bonus',
        duration: 'Ongoing monthly · Trust Vault',
        skills: [secondaryKeyword, primaryKeyword, 'Quality Assurance'].map(s =>
          s.replace(/\b\w/g, c => c.toUpperCase())
        ),
        summary: `Dedicated weekly retainer for a vetted ${singularRole.toLowerCase()} to optimize performance, ship iterations, and maintain high reliability.`,
      },
      {
        id: `job-${sub.id}-4`,
        title: `Rapid ${singularRole} Audit & Optimization`,
        company: 'Paystack Ecosystem Partner (Accra / Remote)',
        budget: '$650–$1,100',
        scoutBounty: '$65–$110 Scout Bonus',
        duration: '1–2 weeks · Instant Payout',
        skills: [primaryKeyword, tertiaryKeyword, 'Audit'].map(s =>
          s.replace(/\b\w/g, c => c.toUpperCase())
        ),
        summary: `Fast-turnaround audit and optimization engagement with pre-funded escrow milestone ready for immediate kickoff.`,
      },
    ],
    [sub.id, sub.name, sub.keywords, singularRole, primaryKeyword, secondaryKeyword, tertiaryKeyword]
  );

  const costTiers = useMemo(
    () => [
      {
        title: `Targeted ${singularRole.toLowerCase()} audit or sprint fix`,
        level: 'Entry to intermediate',
        price:
          journeyMode === 'SCOUT'
            ? '$30–$110'
            : journeyMode === 'TALENT'
              ? '$270–$990'
              : '$300–$1,100',
        unit:
          journeyMode === 'SCOUT'
            ? '10% Scout reward'
            : journeyMode === 'TALENT'
              ? '90% net payout'
              : '/project',
        bullets: [
          `Focused ${primaryKeyword} deliverable or module refinement`,
          'Bug fixes, optimization, and quality assurance review',
          'Rapid turnaround with clear acceptance criteria',
        ],
      },
      {
        title: `Core ${singularRole.toLowerCase()} project build`,
        level: 'Intermediate',
        price:
          journeyMode === 'SCOUT'
            ? '$120–$450'
            : journeyMode === 'TALENT'
              ? '$1,080–$4,050'
              : '$1,200–$4,500',
        unit:
          journeyMode === 'SCOUT'
            ? '10% Scout reward'
            : journeyMode === 'TALENT'
              ? '90% net payout'
              : '/project',
        bullets: [
          `End-to-end ${primaryKeyword} and ${secondaryKeyword} implementation`,
          'Structured architecture, documentation, and handoff',
          'Reusable standards tailored to your product roadmap',
        ],
      },
      {
        title: `Full-scale production delivery & integration`,
        level: 'Intermediate to expert',
        price:
          journeyMode === 'SCOUT'
            ? '$200–$800'
            : journeyMode === 'TALENT'
              ? '$1,800–$7,200'
              : '$2,000–$8,000',
        unit:
          journeyMode === 'SCOUT'
            ? '10% Scout reward'
            : journeyMode === 'TALENT'
              ? '90% net payout'
              : '/project',
        bullets: [
          `Complete production-grade ${sub.name.toLowerCase()} engagement`,
          `Integration with ${tertiaryKeyword}, APIs, and cross-functional workflows`,
          'Comprehensive testing, security review, and deployment support',
        ],
      },
      {
        title: `Legacy modernization & performance overhaul`,
        level: 'Intermediate to expert',
        price:
          journeyMode === 'SCOUT'
            ? '$160–$600'
            : journeyMode === 'TALENT'
              ? '$1,440–$5,400'
              : '$1,600–$6,000',
        unit:
          journeyMode === 'SCOUT'
            ? '10% Scout reward'
            : journeyMode === 'TALENT'
              ? '90% net payout'
              : '/project',
        bullets: [
          `Migration and upgrade to modern ${primaryKeyword} best practices`,
          'Performance benchmarking and bottleneck elimination',
          'Accessibility, compliance, and maintainability improvements',
        ],
      },
      {
        title: `Ongoing retainer, maintenance & support`,
        level: 'Any level',
        price:
          journeyMode === 'SCOUT'
            ? '$40–$150/mo'
            : journeyMode === 'TALENT'
              ? '$360–$1,350/mo'
              : '$400–$1,500',
        unit:
          journeyMode === 'SCOUT'
            ? 'recurring Scout reward'
            : journeyMode === 'TALENT'
              ? 'recurring payout'
              : '/project',
        bullets: [
          'Continuous feature enhancements and iteration cycles',
          'Proactive monitoring, updates, and rapid incident response',
          'Dedicated weekly availability inside Refeir Workspace',
        ],
      },
    ],
    [singularRole, sub.name, primaryKeyword, secondaryKeyword, tertiaryKeyword, journeyMode]
  );

  const faqs = useMemo(() => {
    if (journeyMode === 'SCOUT') {
      return [
        {
          q: `How do I earn 10% referring ${sub.name} on Refeir?`,
          short: `Click "Refer & Earn 10%" on any ${singularRole.toLowerCase()} profile to generate your unique tracked referral link and share it with a client.`,
          more: ` When the client hires that specialist, Refeir automatically locks 10% of every milestone payout to your Scout Trust Vault wallet for the lifetime of the contract.`,
        },
        {
          q: `When are Scout commissions released?`,
          short: `Your 10% Scout commission is released automatically the exact moment a client approves a milestone deliverable in Trust Vault.`,
          more: ` There is no manual invoicing or chasing payments — funds appear immediately in your multi-currency wallet ready for withdrawal in USD, NGN, KES, GHS, ZAR, or Mobile Money.`,
        },
        {
          q: `Can I refer ${sub.name} who aren't on Refeir yet?`,
          short: `Yes! You can invite external specialists from your network using your Scout invite link and earn commissions on every contract they win.`,
          more: ` Once your invited specialist completes verification and lands client milestones, your Scout attribution is permanently recorded on-chain in our ledger.`,
        },
        {
          q: `Is there a cap on how much a Scout can earn?`,
          short: `No — there is zero cap on Scout referral rewards. You earn 10% across initial sprints, follow-on milestones, and monthly retainers.`,
          more: ` Top Refeir Scouts build recurring income streams by matching high-demand ${sub.name.toLowerCase()} with international startups and enterprise teams.`,
        },
      ];
    }

    if (journeyMode === 'TALENT') {
      return [
        {
          q: `How do ${sub.name} get hired faster on Refeir?`,
          short: `Complete your identity and portfolio verification, showcase your top ${primaryKeyword} case studies, and let Refeir Scouts actively pitch your profile to clients.`,
          more: ` Because Scouts earn a 10% reward when you land a contract, hundreds of industry connectors across Africa and the diaspora are incentivized to bring you warm client leads.`,
        },
        {
          q: `How are my milestone payments protected as a ${singularRole}?`,
          short: `Every client must fund milestone escrow in the Refeir Trust Vault before you begin work, guaranteeing the money is locked and verified.`,
          more: ` Once you submit your deliverable and the client approves the milestone, 90% is credited immediately to your wallet with zero payment delays.`,
        },
        {
          q: `Which currencies can I withdraw my earnings in?`,
          short: `You can hold and withdraw your earnings in USD, EUR, GBP, NGN, KES, GHS, ZAR, RWF, EGP, or local bank and Mobile Money rails.`,
          more: ` Refeir handles cross-border FX settlement automatically so you can work with global clients and cash out locally in minutes.`,
        },
        {
          q: `Can I also refer other specialists when my schedule is full?`,
          short: `Yes! Every Talent account on Refeir can switch to Scout mode with one click to refer peers and earn a 10% commission on overflow projects.`,
          more: ` Never let a good client lead go to waste — refer a trusted colleague in ${sub.name.toLowerCase()} and earn passive milestone rewards.`,
        },
      ];
    }

    return [
      {
        q: `Is hiring a ${singularRole} on Refeir worth it?`,
        short: `Yes, hiring a vetted ${singularRole} on Refeir is worth it when your team needs reliable execution, domain expertise in ${primaryKeyword}, and milestone escrow protection.`,
        more: ` Every specialist on Refeir goes through identity and portfolio verification, and your funds remain safely held in escrow until you approve each completed milestone.`,
      },
      {
        q: `What sets Refeir ${sub.name} apart from traditional job boards?`,
        short: `Refeir combines a Pan-African and diaspora talent marketplace with a built-in Scout referral network and multi-currency milestone escrow.`,
        more: ` Instead of sifting through hundreds of unverified resumes, you get matched with proven ${sub.name.toLowerCase()} who have verified project histories, transparent rates, and real client ratings.`,
      },
      {
        q: `Should I hire a freelance or full-time ${singularRole}?`,
        short: `Hire a freelance or contract ${singularRole} when you need specialized ${primaryKeyword} expertise for a defined roadmap, want to accelerate delivery, or have variable workload needs.`,
        more: ` A full-time hire makes sense when you require long-term internal ownership. On Refeir, many clients start with a milestone-protected contract and transition top performers into ongoing retainers.`,
      },
      {
        q: `Are ${sub.name} still in high demand?`,
        short: `Yes, ${sub.name.toLowerCase()} remain among the most sought-after specialists for startups, fintechs, and global enterprises building modern products.`,
        more: ` Strong proficiency in ${sub.keywords.slice(0, 3).join(', ')} continues to drive high demand across both regional African markets and international teams.`,
      },
      {
        q: `How does Refeir protect my payments when working with ${sub.name}?`,
        short: `All engagements on Refeir are backed by Milestone Payment Protection. You fund milestones upfront in your preferred currency, and funds are only released when you approve the work.`,
        more: ` If scope changes or questions arise, Refeir’s workspace audit logs and dispute mediation team ensure fair, transparent resolution for both clients and talent.`,
      },
    ];
  }, [singularRole, sub.name, sub.keywords, primaryKeyword, journeyMode]);

  const similarSkills = useMemo(() => {
    const allSubs = Object.values(TALENT_SUB_CATEGORIES).flat();
    const list: TalentSubCategory[] = [];
    for (const s of categorySubs) {
      if (s.id !== sub.id) list.push(s);
    }
    for (const s of allSubs) {
      if (list.length >= 16) break;
      if (s.id !== sub.id && !list.some(item => item.id === s.id)) {
        list.push(s);
      }
    }
    return list.slice(0, 16);
  }, [categorySubs, sub.id]);

  const scrollTestimonials = (dir: 'prev' | 'next') => {
    if (!testimonialTrackRef.current) return;
    const width = testimonialTrackRef.current.clientWidth;
    testimonialTrackRef.current.scrollBy({
      left: dir === 'next' ? width * 0.75 : -width * 0.75,
      behavior: 'smooth',
    });
  };

  const heroHeading =
    journeyMode === 'SCOUT'
      ? `Refer ${sub.name} & Earn 10%`
      : journeyMode === 'TALENT'
        ? `Find ${singularRole} Jobs & Contracts`
        : `Hire the Best ${sub.name}`;

  const heroRatingLabel =
    journeyMode === 'SCOUT'
      ? `Scouts rate ${sub.name} referral payouts`
      : journeyMode === 'TALENT'
        ? `${sub.name} rate Refeir Milestone Escrow`
        : `Clients rate our ${sub.name}`;

  const heroSubText =
    journeyMode === 'SCOUT'
      ? `Guaranteed 10% lifetime commission across ${reviewStats.reviews} completed milestones`
      : journeyMode === 'TALENT'
        ? `Keep 90% of every milestone · Instant payouts across 54 African nations`
        : `Based on ${reviewStats.reviews} client reviews`;

  return (
    <div className="rf-subcat-journey-page">
      {/* 1. HERO HEADER + ROLE JOURNEY SWITCHER + RATING + PRIMARY CTA */}
      <section className="rf-sj-hero">
        <div className="rf-sj-container">
          {/* 3-Role Journey Switcher (Client / Scout / Talent) */}
          <div className="rf-sj-mode-switcher" role="tablist" aria-label="Select your Refeir journey">
            <button
              type="button"
              role="tab"
              aria-selected={journeyMode === 'HIRE'}
              className={`rf-sj-mode-pill${journeyMode === 'HIRE' ? ' is-active' : ''}`}
              onClick={() => setJourneyMode('HIRE')}
            >
              <Briefcase size={14} />
              <span>Hire Talent</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={journeyMode === 'SCOUT'}
              className={`rf-sj-mode-pill${journeyMode === 'SCOUT' ? ' is-active' : ''}`}
              onClick={() => setJourneyMode('SCOUT')}
            >
              <Compass size={14} />
              <span>Scout &amp; Earn 10%</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={journeyMode === 'TALENT'}
              className={`rf-sj-mode-pill${journeyMode === 'TALENT' ? ' is-active' : ''}`}
              onClick={() => setJourneyMode('TALENT')}
            >
              <Award size={14} />
              <span>Work as Talent</span>
            </button>
          </div>

          <h1 className="rf-sj-hero-title">{heroHeading}</h1>

          <div className="rf-sj-hero-rating">
            <span className="rf-sj-rating-label">{heroRatingLabel}</span>
            <span className="rf-sj-stars" aria-label={`${reviewStats.rating} out of 5 stars`}>
              {[0, 1, 2, 3, 4].map(i => (
                <Star key={i} size={17} className="rf-sj-star" />
              ))}
            </span>
            <strong className="rf-sj-rating-score">{reviewStats.rating}/5</strong>
          </div>

          <p className="rf-sj-hero-sub">{heroSubText}</p>

          <div className="rf-sj-hero-cta-row">
            {journeyMode === 'SCOUT' ? (
              <>
                <button
                  type="button"
                  className="rf-sj-primary-btn"
                  onClick={() =>
                    onNavigate(currentUser ? '/dashboard/scout' : '/signup?role=SCOUT')
                  }
                >
                  Start Scouting &amp; Earning 10%
                </button>
                <button
                  type="button"
                  className="rf-sj-secondary-btn"
                  onClick={() => onNavigate('/scout-sourcing')}
                >
                  How Scouting Works
                </button>
              </>
            ) : journeyMode === 'TALENT' ? (
              <>
                <button
                  type="button"
                  className="rf-sj-primary-btn"
                  onClick={() =>
                    onNavigate(currentUser ? '/jobs' : '/signup?role=TALENT')
                  }
                >
                  Apply as a {singularRole}
                </button>
                <button
                  type="button"
                  className="rf-sj-secondary-btn"
                  onClick={() => onNavigate('/jobs')}
                >
                  Browse All Open Jobs
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="rf-sj-primary-btn"
                  onClick={() =>
                    onNavigate(currentUser ? '/jobs' : '/signup?role=CLIENT')
                  }
                >
                  Hire specialists
                </button>
                <button
                  type="button"
                  className="rf-sj-secondary-btn"
                  onClick={() => setJourneyMode('SCOUT')}
                >
                  Refer a {singularRole} (Earn 10%)
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMB + ROLE-AWARE SHOWCASE GRID */}
      <section className="rf-sj-section">
        <div className="rf-sj-container">
          <nav className="rf-sj-breadcrumbs" aria-label="Breadcrumb">
            <button
              type="button"
              className="rf-sj-crumb-home"
              onClick={() => onNavigate('/')}
              aria-label="Home"
            >
              <Home size={15} />
            </button>
            <span className="rf-sj-crumb-sep">/</span>
            <button
              type="button"
              className="rf-sj-crumb-link"
              onClick={() =>
                onNavigate(`/marketplace?type=talent&category=${encodeURIComponent(categoryQuery)}`)
              }
            >
              {categoryName} Talent
            </button>
            <span className="rf-sj-crumb-sep">/</span>
            <span className="rf-sj-crumb-current">{sub.name}</span>
          </nav>

          {/* TALENT MODE: Open Client Bounties & Contracts in this Specialty */}
          {journeyMode === 'TALENT' && (
            <div className="rf-sj-bounties-wrap">
              <div className="rf-sj-bounties-head">
                <div>
                  <span className="rf-sj-bounties-eyebrow">LIVE ESCROW CONTRACTS</span>
                  <h2 className="rf-sj-bounties-title">
                    Open {sub.name} Jobs &amp; Client Bounties
                  </h2>
                </div>
                <button
                  type="button"
                  className="rf-sj-outline-pill-btn"
                  onClick={() => onNavigate('/jobs')}
                >
                  View all open jobs
                </button>
              </div>

              <div className="rf-sj-talent-grid">
                {openSpecialtyJobs.map(job => (
                  <article key={job.id} className="rf-sj-talent-card rf-sj-job-card">
                    <div className="rf-sj-job-top">
                      <div>
                        <span className="rf-sj-job-badge">
                          <ShieldCheck size={13} /> Escrow Funded
                        </span>
                        <h3 className="rf-sj-job-title">{job.title}</h3>
                        <p className="rf-sj-job-company">{job.company}</p>
                      </div>
                      <div className="rf-sj-job-budget">
                        <strong>{job.budget}</strong>
                        <span>{job.duration}</span>
                      </div>
                    </div>

                    <p className="rf-sj-talent-bio">{job.summary}</p>

                    <div className="rf-sj-skill-row">
                      {job.skills.map(skill => (
                        <span key={skill} className="rf-sj-skill-pill">
                          {skill}
                        </span>
                      ))}
                      <span className="rf-sj-scout-bonus-pill">
                        <Compass size={12} /> {job.scoutBounty}
                      </span>
                    </div>

                    <div className="rf-sj-job-actions">
                      <button
                        type="button"
                        className="rf-sj-view-profile-btn"
                        onClick={() =>
                          onNavigate(currentUser ? '/jobs' : '/signup?role=TALENT')
                        }
                      >
                        Apply for Role
                      </button>
                      <button
                        type="button"
                        className="rf-sj-refer-inline-btn"
                        onClick={() =>
                          onNavigate(currentUser ? '/dashboard/scout' : '/signup?role=SCOUT')
                        }
                      >
                        <Share2 size={13} />
                        <span>Refer a Peer (10%)</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <h3 className="rf-sj-peers-heading">
                Top Verified {sub.name} Earning on Refeir
              </h3>
            </div>
          )}

          {/* 2-Column Talent Cards */}
          <div className="rf-sj-talent-grid">
            {displayedTalents.map(talent => {
              const verified =
                talent.verification_status === 'IDENTITY_VERIFIED' ||
                talent.verification_status === 'PROFESSION_VERIFIED';
              const extraSkills = Math.max(0, talent.skills.length - 3 + 9);
              const totalEarnedK = Math.max(
                12,
                Math.round((talent.completed_projects * talent.starting_price.amount_minor) / 100000) * 5
              );
              const scoutReward = Math.max(25, Math.round(talent.starting_price.amount_minor / 1000));

              return (
                <article key={talent.id} className="rf-sj-talent-card">
                  <div className="rf-sj-talent-head">
                    <img
                      src={talent.avatar_url}
                      alt={talent.full_name}
                      className="rf-sj-talent-avatar"
                      loading="lazy"
                    />

                    <div className="rf-sj-talent-identity">
                      <div className="rf-sj-talent-name-row">
                        <h3 className="rf-sj-talent-name">{shortName(talent.full_name)}</h3>
                        {verified && (
                          <span className="rf-sj-verified-badge" title="Verified Specialist">
                            <CheckCircle2 size={15} />
                          </span>
                        )}
                      </div>
                      <p className="rf-sj-talent-headline">{talent.headline}</p>
                      <div className="rf-sj-talent-loc">
                        <MapPin size={13} />
                        <span>
                          {talent.city}, {talent.country_name}
                        </span>
                      </div>
                    </div>

                    <div className="rf-sj-card-cta-col">
                      {journeyMode === 'SCOUT' ? (
                        <>
                          <button
                            type="button"
                            className="rf-sj-view-profile-btn"
                            onClick={() => handleReferClick(talent)}
                          >
                            Refer &amp; Earn 10%
                          </button>
                          <button
                            type="button"
                            className="rf-sj-refer-inline-btn"
                            onClick={() => onSelectTalent(talent)}
                          >
                            View profile
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="rf-sj-view-profile-btn"
                            onClick={() => onSelectTalent(talent)}
                          >
                            View profile
                          </button>
                          <button
                            type="button"
                            className="rf-sj-refer-inline-btn"
                            onClick={() => handleReferClick(talent)}
                            title="Refer this specialist and earn 10% on every milestone"
                          >
                            <Compass size={12} />
                            <span>Refer (10%)</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stats Line */}
                  <div className="rf-sj-talent-metrics">
                    <span className="rf-sj-metric-rate">
                      {formatMoney(talent.starting_price)}/hr
                    </span>
                    <span className="rf-sj-metric-item">
                      <Star size={13} className="rf-sj-star-inline" />
                      <strong>{talent.rating.toFixed(1)}</strong> ({talent.reviews_count})
                    </span>
                    <span className="rf-sj-metric-item">
                      <Briefcase size={13} />
                      {talent.completed_projects} jobs
                    </span>
                    <span className="rf-sj-metric-item">
                      <Wallet size={13} />${totalEarnedK}K+ earned
                    </span>
                    <span className="rf-sj-scout-bonus-pill">
                      <Compass size={12} /> Scout 10%: ${scoutReward}+/milestone
                    </span>
                  </div>

                  {/* Skill Pills */}
                  <div className="rf-sj-skill-row">
                    {talent.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="rf-sj-skill-pill">
                        {skill}
                      </span>
                    ))}
                    <span className="rf-sj-skill-pill is-count">+{extraSkills}</span>
                  </div>

                  {/* Bio Excerpt */}
                  <p className="rf-sj-talent-bio">{talent.bio}</p>
                </article>
              );
            })}
          </div>

          <div className="rf-sj-more-wrap">
            {visibleCount < matchedTalents.length && visibleCount < 8 ? (
              <button
                type="button"
                className="rf-sj-outline-pill-btn"
                onClick={() => setVisibleCount(c => Math.min(8, c + 4))}
              >
                View more specialists
              </button>
            ) : (
              <button
                type="button"
                className="rf-sj-outline-pill-btn"
                onClick={() =>
                  onNavigate(
                    `/marketplace?type=talent&category=${encodeURIComponent(categoryQuery)}`
                  )
                }
              >
                Browse all {sub.count} {sub.name}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4-COLUMN STEP ROW ADAPTED TO ACTIVE ROLE) */}
      <section className="rf-sj-section">
        <div className="rf-sj-container">
          <h2 className="rf-sj-section-title">
            {journeyMode === 'SCOUT'
              ? `How Scouting ${sub.name} Works`
              : journeyMode === 'TALENT'
                ? `How ${sub.name} Win Contracts on Refeir`
                : 'How it works'}
          </h2>

          {journeyMode === 'SCOUT' ? (
            <div className="rf-sj-how-grid">
              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <Compass size={28} />
                </div>
                <h3>1. Pick a vetted specialist</h3>
                <p>
                  Browse verified {sub.name.toLowerCase()} above or invite a trusted specialist
                  from your own professional network.
                </p>
              </div>

              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <Share2 size={28} />
                </div>
                <h3>2. Share your referral link</h3>
                <p>
                  Generate a one-click tracked referral link and introduce the specialist to a
                  founder, hiring manager, or client.
                </p>
              </div>

              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <ShieldCheck size={28} />
                </div>
                <h3>3. Lock 10% attribution</h3>
                <p>
                  Refeir’s Trust Vault permanently locks your 10% Scout attribution across every
                  milestone and retainer the client funds.
                </p>
              </div>

              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <Wallet size={28} />
                </div>
                <h3>4. Instant multi-currency payouts</h3>
                <p>
                  Receive 10% automatically in your wallet the moment each milestone is approved —
                  withdraw in USD, NGN, KES, GHS, or Mobile Money.
                </p>
              </div>
            </div>
          ) : journeyMode === 'TALENT' ? (
            <div className="rf-sj-how-grid">
              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <UserCheck size={28} />
                </div>
                <h3>1. Complete verified profile</h3>
                <p>
                  Showcase your {primaryKeyword} portfolio, pass rapid identity &amp; skill
                  verification, and set your milestone rates.
                </p>
              </div>

              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <Compass size={28} />
                </div>
                <h3>2. Get endorsed by Scouts</h3>
                <p>
                  Industry Scouts across Africa and the diaspora pitch your profile directly to
                  international clients looking for {sub.name.toLowerCase()}.
                </p>
              </div>

              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <ShieldCheck size={28} />
                </div>
                <h3>3. Deliver in Trust Vault</h3>
                <p>
                  Never start work unpaid. Clients pre-fund every milestone in Refeir Escrow before
                  you write a line of code or design.
                </p>
              </div>

              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <CreditCard size={28} />
                </div>
                <h3>4. Keep 90% with instant payouts</h3>
                <p>
                  Withdraw your earnings immediately upon milestone approval in USD, GBP, EUR, NGN,
                  KES, GHS, ZAR, or Mobile Money.
                </p>
              </div>
            </div>
          ) : (
            <div className="rf-sj-how-grid">
              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <FileText size={28} />
                </div>
                <h3>Post a job for free</h3>
                <p>
                  Tell us what you need. Create your own project brief or generate one with our
                  AI Wizard, then filter vetted {sub.name.toLowerCase()} matches.
                </p>
              </div>

              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <UserCheck size={28} />
                </div>
                <h3>Hire top talent fast</h3>
                <p>
                  Consult, interview, and hire quickly, so you can onboard the{' '}
                  {sub.name.toLowerCase()} you’re excited to build with.
                </p>
              </div>

              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <MessageSquare size={28} />
                </div>
                <h3>Collaborate easily</h3>
                <p>
                  Use Refeir Workspace to chat, share deliverables, and track milestone progress
                  in one encrypted place.
                </p>
              </div>

              <div className="rf-sj-how-item">
                <div className="rf-sj-how-illus">
                  <CreditCard size={28} />
                </div>
                <h3>Payment simplified</h3>
                <p>
                  Manage multi-currency escrow in one place with flexible billing options. Only
                  release funds for approved work.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. CLIENT TESTIMONIALS CAROUSEL */}
      <section className="rf-sj-section rf-sj-section-tinted">
        <div className="rf-sj-container">
          <div className="rf-sj-Band-head">
            <h2 className="rf-sj-section-title" style={{ margin: 0 }}>
              Don&apos;t just take our word for it
            </h2>
            <div className="rf-sj-carousel-nav">
              <button
                type="button"
                className="rf-sj-nav-circle"
                onClick={() => scrollTestimonials('prev')}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="rf-sj-nav-circle"
                onClick={() => scrollTestimonials('next')}
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div ref={testimonialTrackRef} className="rf-sj-testimonial-track">
            {TESTIMONIALS.map(item => (
              <div key={item.author} className="rf-sj-testimonial-card">
                <p className="rf-sj-testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
                <div className="rf-sj-testimonial-author">
                  <span className="rf-sj-author-avatar">{item.initials}</span>
                  <div>
                    <div className="rf-sj-author-name">
                      <span>{item.author}</span>
                      <ShieldCheck size={14} className="rf-sj-author-verified" />
                    </div>
                    <div className="rf-sj-author-company">{item.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RESOURCES TO HELP YOU HIRE / SCOUT / SUCCEED */}
      <section className="rf-sj-section">
        <div className="rf-sj-container">
          <h2 className="rf-sj-section-title">
            {journeyMode === 'SCOUT'
              ? `Resources for ${sub.name} Scouts`
              : journeyMode === 'TALENT'
                ? `Resources for ${sub.name}`
                : 'Resources to help you hire'}
          </h2>

          <div className="rf-sj-resources-grid">
            <a href="#cost-guide" className="rf-sj-resource-card">
              <div className="rf-sj-resource-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                  alt={`Cost to hire a ${singularRole}`}
                  loading="lazy"
                />
              </div>
              <h3>
                {journeyMode === 'SCOUT'
                  ? `10% Scout commission calculator for ${sub.name}`
                  : journeyMode === 'TALENT'
                    ? `${singularRole} milestone rate benchmarks`
                    : `Cost to hire a ${singularRole}`}
              </h3>
              <p>
                {journeyMode === 'SCOUT'
                  ? `See how much you earn in 10% referral rewards when matching ${sub.name.toLowerCase()}.`
                  : journeyMode === 'TALENT'
                    ? `Explore what top ${sub.name.toLowerCase()} charge per sprint and retainer on Refeir.`
                    : `Explore typical ${singularRole} rates and what businesses invest to hire top specialists.`}
              </p>
            </a>

            <a href="#hiring-steps" className="rf-sj-resource-card">
              <div className="rf-sj-resource-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt={`${singularRole} job description template`}
                  loading="lazy"
                />
              </div>
              <h3>
                {journeyMode === 'SCOUT'
                  ? `How to pitch ${sub.name} to global founders`
                  : journeyMode === 'TALENT'
                    ? `Winning ${singularRole} portfolio playbook`
                    : `${singularRole} job description template`}
              </h3>
              <p>
                {journeyMode === 'SCOUT'
                  ? `Proven outreach templates to connect ${sub.name.toLowerCase()} with funded startups.`
                  : journeyMode === 'TALENT'
                    ? `Structure your case studies and skills so Scouts and clients shortlist you first.`
                    : `Get practical steps to write a project brief that attracts qualified ${sub.name}.`}
              </p>
            </a>

            <a href="#interview-step" className="rf-sj-resource-card">
              <div className="rf-sj-resource-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt={`${singularRole} interview questions`}
                  loading="lazy"
                />
              </div>
              <h3>
                {journeyMode === 'SCOUT'
                  ? `Vetting checklist for ${sub.name}`
                  : journeyMode === 'TALENT'
                    ? `Acing your ${singularRole} discovery call`
                    : `${singularRole} interview questions`}
              </h3>
              <p>
                {journeyMode === 'SCOUT'
                  ? `How to verify domain mastery before endorsing a ${singularRole.toLowerCase()}.`
                  : journeyMode === 'TALENT'
                    ? `Key technical and architecture questions clients ask ${sub.name.toLowerCase()}.`
                    : `Top evaluation questions to help you hire the right ${sub.name}, faster.`}
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL HIRING GUIDE + 4-STEP PLAYBOOK */}
      <section className="rf-sj-section">
        <div className="rf-sj-container rf-sj-editorial">
          <h2 className="rf-sj-guide-h2">{singularRole} hiring guide</h2>
          <p className="rf-sj-guide-lead">
            High-impact execution in {categoryName.toLowerCase()} improves customer experience
            and makes it easier to ship new capabilities as your business scales. Companies hire{' '}
            {sub.name.toLowerCase()} on Refeir to build resilient deliverables, modernize existing
            workflows, and maintain high standards across every sprint.
          </p>

          <h3 className="rf-sj-guide-h3">What does a {singularRole.toLowerCase()} do?</h3>
          <p>
            A {singularRole.toLowerCase()} designs, builds, and maintains specialized{' '}
            {categoryName.toLowerCase()} deliverables centered around{' '}
            <strong>{sub.keywords.slice(0, 3).join(', ')}</strong>. They collaborate closely with
            product owners, designers, and engineering leads to ensure work is reliable,
            well-documented, and aligned with business outcomes.
          </p>
          <p>Typical responsibilities for {sub.name.toLowerCase()} include:</p>
          <ul className="rf-sj-guide-list">
            <li>
              <strong>Core execution &amp; architecture.</strong> Deliver production-ready work
              using {primaryKeyword} and proven industry standards.
            </li>
            <li>
              <strong>Reusable systems &amp; documentation.</strong> Build modular assets and clear
              documentation that your internal team can maintain effortlessly.
            </li>
            <li>
              <strong>Cross-functional integration.</strong> Connect deliverables cleanly with{' '}
              {secondaryKeyword}, APIs, and existing team workflows.
            </li>
            <li>
              <strong>Performance &amp; quality optimization.</strong> Benchmark output quality,
              eliminate bottlenecks, and maintain high reliability under real-world load.
            </li>
            <li>
              <strong>Testing &amp; iterative refinement.</strong> Validate edge cases, review
              feedback at every milestone, and adapt quickly as requirements evolve.
            </li>
            <li>
              <strong>Transparent stakeholder communication.</strong> Share structured progress
              updates inside Refeir Workspace from kickoff through final handoff.
            </li>
          </ul>

          <h3 id="hiring-steps" className="rf-sj-guide-h3">
            How to hire a {singularRole.toLowerCase()} on Refeir
          </h3>
          <p>
            Finding the right {singularRole.toLowerCase()} requires a clear understanding of your
            project goals and a structured evaluation process. Follow these four steps to find and
            onboard the right specialist with full escrow confidence.
          </p>

          <h4 className="rf-sj-guide-h4">Step 1: Craft a targeted project brief</h4>
          <p>
            A clear brief helps attract {sub.name.toLowerCase()} whose domain experience matches
            your exact scope and timeline.
          </p>
          <ul className="rf-sj-guide-list">
            <li>
              Outline your business objectives, target deliverables, and whether you are starting
              from scratch or improving an existing system
            </li>
            <li>
              Specify your core tools and stack, such as{' '}
              {sub.keywords.slice(0, 4).join(', ')}
            </li>
            <li>
              List expected milestones, deliverable formats, and quality acceptance criteria
            </li>
            <li>
              Include timeline expectations, timezone overlap preferences, and budget range
            </li>
          </ul>

          <h4 className="rf-sj-guide-h4">Step 2: Filter and evaluate candidates</h4>
          <p>
            A structured review helps you identify specialists with verified{' '}
            {primaryKeyword} experience and strong fundamentals.
          </p>
          <ul className="rf-sj-guide-list">
            <li>
              Review Refeir portfolios for past projects similar in complexity and industry to
              yours
            </li>
            <li>
              Look for live case studies, production links, or repositories demonstrating clean
              execution
            </li>
            <li>
              Confirm hands-on experience with {secondaryKeyword} and adjacent tools in your
              workflow
            </li>
            <li>
              Check verified client ratings, completion rate, and Scout endorsements on each
              profile
            </li>
          </ul>

          <h4 id="interview-step" className="rf-sj-guide-h4">
            Step 3: Interview your top choices
          </h4>
          <p>
            Short discovery calls help you evaluate technical depth and how candidates approach
            real-world tradeoffs.
          </p>
          <ul className="rf-sj-guide-list">
            <li>
              Ask practical questions covering {sub.keywords.slice(0, 3).join(', ')} and
              architecture decisions
            </li>
            <li>
              Discuss how they structure milestones, handle edge cases, and ensure quality before
              handoff
            </li>
            <li>
              Request examples of complex challenges they solved in recent client engagements
            </li>
            <li>
              Evaluate how clearly they communicate timelines and constraints to non-technical
              stakeholders
            </li>
          </ul>

          <h4 className="rf-sj-guide-h4">Step 4: Agree on scope and fund milestone escrow</h4>
          <p>
            Define deliverables, deadlines, and acceptance criteria before work begins so both
            sides are protected.
          </p>
          <ul className="rf-sj-guide-list">
            <li>
              Break the engagement into clear milestones (e.g., discovery, core build, QA, final
              handoff)
            </li>
            <li>
              Establish expectations for review cycles, documentation, and source ownership
            </li>
            <li>
              Fund the project securely via Refeir Payment Protection — funds are released only
              when you approve completed work
            </li>
          </ul>
        </div>
      </section>

      {/* 7. COST / COMMISSION / EARNINGS BREAKDOWN TABLE */}
      <section id="cost-guide" className="rf-sj-section">
        <div className="rf-sj-container rf-sj-editorial">
          <h2 className="rf-sj-guide-h2">
            {journeyMode === 'SCOUT'
              ? `How much do Scouts earn referring a ${singularRole.toLowerCase()}?`
              : journeyMode === 'TALENT'
                ? `How much do ${sub.name.toLowerCase()} earn on Refeir?`
                : `How much does hiring a ${singularRole.toLowerCase()} cost?`}
          </h2>
          <p className="rf-sj-guide-lead">
            {journeyMode === 'SCOUT' ? (
              <>
                Scouts earn a guaranteed{' '}
                <strong style={{ textDecoration: 'underline' }}>
                  10% lifetime commission
                </strong>{' '}
                on every milestone a referred {singularRole.toLowerCase()} completes. Here are
                typical Scout rewards by project size:
              </>
            ) : journeyMode === 'TALENT' ? (
              <>
                Verified {sub.name.toLowerCase()} on Refeir keep{' '}
                <strong style={{ textDecoration: 'underline' }}>
                  90% of every milestone
                </strong>{' '}
                (typically $25–$65/hr) with instant multi-currency payouts. Here are typical net
                project earnings:
              </>
            ) : (
              <>
                Hiring a {singularRole.toLowerCase()} on Refeir generally costs{' '}
                <strong style={{ textDecoration: 'underline' }}>$25–$65 per hour</strong>,
                depending on scope and seniority. Consider these typical project cost ranges when
                planning your budget:
              </>
            )}
          </p>

          <div className="rf-sj-cost-table">
            {costTiers.map(tier => (
              <div key={tier.title} className="rf-sj-cost-row">
                <div className="rf-sj-cost-left">
                  <div className="rf-sj-cost-title">{tier.title}</div>
                  <div className="rf-sj-cost-price">
                    <strong>{tier.price}</strong> <span>{tier.unit}</span>
                  </div>
                </div>

                <div className="rf-sj-cost-right">
                  <div className="rf-sj-cost-level">
                    <Cpu size={15} />
                    <span>{tier.level}</span>
                  </div>
                  <ul className="rf-sj-cost-bullets">
                    {tier.bullets.map(b => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="rf-sj-section">
        <div className="rf-sj-container">
          <div className="rf-sj-faq-box">
            <div className="rf-sj-faq-left">
              <h2>Frequently asked questions</h2>
            </div>

            <div className="rf-sj-faq-right">
              {faqs.map((faq, idx) => {
                const isExpanded = Boolean(expandedFaqs[idx]);
                return (
                  <div key={faq.q} className="rf-sj-faq-item">
                    <h3>{faq.q}</h3>
                    <p>
                      {faq.short}
                      {isExpanded ? faq.more : '...'}
                    </p>
                    <button
                      type="button"
                      className="rf-sj-read-more-btn"
                      onClick={() =>
                        setExpandedFaqs(prev => ({ ...prev, [idx]: !prev[idx] }))
                      }
                    >
                      <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                      <ChevronDown
                        size={14}
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FIND MORE SPECIALISTS */}
      <section className="rf-sj-section">
        <div className="rf-sj-container">
          <h2 className="rf-sj-section-title">Find more specialists</h2>

          <div className="rf-sj-directory-block">
            <h3>Similar {singularRole} Skills</h3>
            <div className="rf-sj-links-grid">
              {similarSkills.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className="rf-sj-dir-link"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onNavigate(`/subcategories/${item.id}`);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rf-sj-directory-block">
            <h3>Top Countries for {sub.name}</h3>
            <div className="rf-sj-links-grid">
              {PAN_AFRICAN_HUBS.map(countryName => (
                <button
                  key={countryName}
                  type="button"
                  className="rf-sj-dir-link"
                  onClick={() =>
                    onNavigate(
                      `/marketplace?type=talent&category=${encodeURIComponent(categoryQuery)}`
                    )
                  }
                >
                  {sub.name} in {countryName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. BOTTOM DARK BANNER (Role-Aware CTA) */}
      <section className="rf-sj-section" style={{ paddingBottom: '4.5rem' }}>
        <div className="rf-sj-container">
          <div className="rf-sj-globe-banner">
            <div className="rf-sj-globe-copy">
              <h2>
                {journeyMode === 'SCOUT' ? (
                  <>
                    Refer anyone,
                    <br />
                    earn 10% anywhere.
                  </>
                ) : journeyMode === 'TALENT' ? (
                  <>
                    Work globally,
                    <br />
                    get paid fairly.
                  </>
                ) : (
                  <>
                    Hire anyone,
                    <br />
                    anywhere.
                  </>
                )}
              </h2>
              <button
                type="button"
                className="rf-sj-globe-cta"
                onClick={() =>
                  onNavigate(
                    journeyMode === 'SCOUT'
                      ? '/signup?role=SCOUT'
                      : journeyMode === 'TALENT'
                        ? '/signup?role=TALENT'
                        : '/signup?role=CLIENT'
                  )
                }
              >
                {journeyMode === 'SCOUT'
                  ? 'Join as a Scout for free'
                  : journeyMode === 'TALENT'
                    ? 'Join as Talent for free'
                    : 'Sign up for free'}
              </button>
            </div>

            <div className="rf-sj-globe-art" aria-hidden="true">
              <svg width="210" height="210" viewBox="0 0 220 220" fill="none">
                <rect x="20" y="106" width="38" height="10" rx="5" fill="#F8FAFC" opacity="0.92" />
                <rect x="166" y="74" width="40" height="10" rx="5" fill="#F8FAFC" opacity="0.92" />
                <circle cx="112" cy="98" r="56" fill="#16A34A" />
                <path
                  d="M92 52C104 62 108 76 100 90C92 104 98 122 114 134C126 142 142 138 152 126C162 112 168 92 158 72C146 50 112 42 92 52Z"
                  fill="#065F46"
                  opacity="0.55"
                />
                <circle cx="96" cy="82" r="24" fill="#34D399" opacity="0.45" />
                <path
                  d="M74 36 A72 72 0 1 0 150 160"
                  stroke="#CBD5E1"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1="70"
                  y1="26"
                  x2="78"
                  y2="42"
                  stroke="#94A3B8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <rect x="106" y="166" width="12" height="20" fill="#94A3B8" />
                <path d="M82 184H142L148 198H76L82 184Z" fill="#B45309" />
                <rect x="64" y="198" width="96" height="4" rx="2" fill="#64748B" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Refer Modal for Logged-in Scouts/Users */}
      {referTalent && (
        <ReferModal
          talent={referTalent}
          onClose={() => setReferTalent(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
