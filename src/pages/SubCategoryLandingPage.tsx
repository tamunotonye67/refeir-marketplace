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
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
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

/** Ensures any skill label turns into a natural plural role title for "Hire the Best [Title]". */
function normalizeRolePlural(rawLabel: string): string {
  const cleaned = rawLabel.trim();
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
  ];
  if (roleEndings.some(ending => cleaned.toLowerCase().endsWith(ending.toLowerCase()))) {
    return cleaned;
  }
  return `${cleaned} Specialists`;
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
  const [visibleCount, setVisibleCount] = useState(4);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});
  const testimonialTrackRef = useRef<HTMLDivElement>(null);

  const resolved = useMemo(() => resolveSubCategory(subCategoryId), [subCategoryId]);
  const { categoryName, categoryQuery, sub, singularRole } = resolved;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setVisibleCount(4);
    setExpandedFaqs({});
  }, [subCategoryId]);

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

  const costTiers = useMemo(
    () => [
      {
        title: `Targeted ${singularRole.toLowerCase()} audit or sprint fix`,
        level: 'Entry to intermediate',
        price: '$300–$1,100',
        bullets: [
          `Focused ${primaryKeyword} deliverable or module refinement`,
          'Bug fixes, optimization, and quality assurance review',
          'Rapid turnaround with clear acceptance criteria',
        ],
      },
      {
        title: `Core ${singularRole.toLowerCase()} project build`,
        level: 'Intermediate',
        price: '$1,200–$4,500',
        bullets: [
          `End-to-end ${primaryKeyword} and ${secondaryKeyword} implementation`,
          'Structured architecture, documentation, and handoff',
          'Reusable standards tailored to your product roadmap',
        ],
      },
      {
        title: `Full-scale production delivery & integration`,
        level: 'Intermediate to expert',
        price: '$2,000–$8,000',
        bullets: [
          `Complete production-grade ${sub.name.toLowerCase()} engagement`,
          `Integration with ${tertiaryKeyword}, APIs, and cross-functional workflows`,
          'Comprehensive testing, security review, and deployment support',
        ],
      },
      {
        title: `Legacy modernization & performance overhaul`,
        level: 'Intermediate to expert',
        price: '$1,600–$6,000',
        bullets: [
          `Migration and upgrade to modern ${primaryKeyword} best practices`,
          'Performance benchmarking and bottleneck elimination',
          'Accessibility, compliance, and maintainability improvements',
        ],
      },
      {
        title: `Ongoing retainer, maintenance & support`,
        level: 'Any level',
        price: '$400–$1,500',
        bullets: [
          'Continuous feature enhancements and iteration cycles',
          'Proactive monitoring, updates, and rapid incident response',
          'Dedicated weekly availability inside Refeir Workspace',
        ],
      },
    ],
    [singularRole, sub.name, primaryKeyword, secondaryKeyword, tertiaryKeyword]
  );

  const faqs = useMemo(
    () => [
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
    ],
    [singularRole, sub.name, sub.keywords, primaryKeyword]
  );

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

  return (
    <div className="rf-subcat-journey-page">
      {/* 1. HERO HEADER + RATING + PRIMARY CTA */}
      <section className="rf-sj-hero">
        <div className="rf-sj-container">
          <h1 className="rf-sj-hero-title">Hire the Best {sub.name}</h1>

          <div className="rf-sj-hero-rating">
            <span className="rf-sj-rating-label">Clients rate our {sub.name}</span>
            <span className="rf-sj-stars" aria-label={`${reviewStats.rating} out of 5 stars`}>
              {[0, 1, 2, 3, 4].map(i => (
                <Star key={i} size={17} className="rf-sj-star" />
              ))}
            </span>
            <strong className="rf-sj-rating-score">{reviewStats.rating}/5</strong>
          </div>

          <p className="rf-sj-hero-sub">Based on {reviewStats.reviews} client reviews</p>

          <button
            type="button"
            className="rf-sj-primary-btn"
            onClick={() => onNavigate(`/signup?role=CLIENT`)}
          >
            Hire specialists
          </button>
        </div>
      </section>

      {/* 2. BREADCRUMB + 2-COLUMN TALENT SHOWCASE GRID */}
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

                    <button
                      type="button"
                      className="rf-sj-view-profile-btn"
                      onClick={() => onSelectTalent(talent)}
                    >
                      View profile
                    </button>
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
                      <Wallet size={13} />${totalEarnedK}K+ total earnings
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

      {/* 3. HOW IT WORKS (4-COLUMN STEP ROW) */}
      <section className="rf-sj-section">
        <div className="rf-sj-container">
          <h2 className="rf-sj-section-title">How it works</h2>

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

      {/* 5. RESOURCES TO HELP YOU HIRE */}
      <section className="rf-sj-section">
        <div className="rf-sj-container">
          <h2 className="rf-sj-section-title">Resources to help you hire</h2>

          <div className="rf-sj-resources-grid">
            <a href="#cost-guide" className="rf-sj-resource-card">
              <div className="rf-sj-resource-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                  alt={`Cost to hire a ${singularRole}`}
                  loading="lazy"
                />
              </div>
              <h3>Cost to hire a {singularRole}</h3>
              <p>
                Explore typical {singularRole} rates and what businesses invest to hire top
                specialists.
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
              <h3>{singularRole} job description template</h3>
              <p>
                Get practical steps to write a project brief that attracts qualified {sub.name}.
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
              <h3>{singularRole} interview questions</h3>
              <p>
                Top evaluation questions to help you hire the right {sub.name}, faster.
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

      {/* 7. COST BREAKDOWN TABLE */}
      <section id="cost-guide" className="rf-sj-section">
        <div className="rf-sj-container rf-sj-editorial">
          <h2 className="rf-sj-guide-h2">
            How much does hiring a {singularRole.toLowerCase()} cost?
          </h2>
          <p className="rf-sj-guide-lead">
            Hiring a {singularRole.toLowerCase()} on Refeir generally costs{' '}
            <strong style={{ textDecoration: 'underline' }}>$25–$65 per hour</strong>, depending
            on scope and seniority. Consider these typical project cost ranges when planning your
            budget:
          </p>

          <div className="rf-sj-cost-table">
            {costTiers.map(tier => (
              <div key={tier.title} className="rf-sj-cost-row">
                <div className="rf-sj-cost-left">
                  <div className="rf-sj-cost-title">{tier.title}</div>
                  <div className="rf-sj-cost-price">
                    <strong>{tier.price}</strong> <span>/project</span>
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

      {/* 10. BOTTOM DARK BANNER ("Hire anyone, anywhere.") */}
      <section className="rf-sj-section" style={{ paddingBottom: '4.5rem' }}>
        <div className="rf-sj-container">
          <div className="rf-sj-globe-banner">
            <div className="rf-sj-globe-copy">
              <h2>
                Hire anyone,
                <br />
                anywhere.
              </h2>
              <button
                type="button"
                className="rf-sj-globe-cta"
                onClick={() => onNavigate('/signup?role=CLIENT')}
              >
                Sign up for free
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
    </div>
  );
};
