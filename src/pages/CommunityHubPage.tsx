import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Users,
  MessageSquare,
  Sparkles,
  Search,
  ThumbsUp,
  Share2,
  Bookmark,
  PlusCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Filter,
  Send,
  HelpCircle,
  Flame,
  Globe2,
  Code,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  User,
  Home,
  BookOpen,
  Camera,
  Image as ImageIcon,
  Compass,
  Star,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Play,
  Heart,
  Check,
  Briefcase,
  Globe,
  Radio,
  FileText,
  Upload,
  X,
  Maximize2,
  BookMarked,
  Terminal,
  Copy,
  Zap,
  Download,
  Code2,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type CommunityTab =
  | 'home'
  | 'forum'
  | 'content'
  | 'event'
  | 'clubs'
  | 'ambassadors'
  | 'albums'
  | 'help';

interface DiscussionComment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  time: string;
  likes: number;
  image?: string;
}

interface DiscussionPost {
  id: string;
  title: string;
  category: 'SCOUT_TIPS' | 'TECH_TALENT' | 'COLLAB' | 'REGIONAL' | 'ESCROW_SAFETY';
  author: string;
  authorRole: 'SCOUT' | 'TALENT' | 'CLIENT' | 'ADMIN';
  authorTitle: string;
  avatar: string;
  country: string;
  content: string;
  image?: string;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  timeAgo: string;
  isPinned?: boolean;
  comments: DiscussionComment[];
}

export interface ContentGuide {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  readTime: string;
  image: string;
  publishedAt: string;
  snippet: string;
  keyTakeaways: string[];
  contentSections: {
    heading: string;
    paragraphs: string[];
    codeSnippet?: string;
    callout?: string;
  }[];
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface ClubData {
  id: string;
  name: string;
  membersCount: number;
  tag: string;
  lead: string;
  leadAvatar: string;
  leadRole: string;
  description: string;
  bannerImage: string;
  slogan: string;
  channels: string[];
  pinnedPosts: {
    id: string;
    author: string;
    avatar: string;
    role: string;
    title: string;
    body: string;
    time: string;
    likes: number;
    commentsCount: number;
    tags: string[];
  }[];
  resources: {
    title: string;
    type: string;
    downloads: number;
    desc: string;
  }[];
  activeSprints: {
    title: string;
    status: string;
    deadline: string;
    reward: string;
    scope: string;
  }[];
  memberList: {
    name: string;
    role: string;
    country: string;
    avatar: string;
    flag: string;
  }[];
}

const CONTENT_GUIDES: ContentGuide[] = [
  {
    id: 'guide-1',
    title: 'Architecting Sovereign Multi-Currency Escrow on Rust & Solana',
    category: 'ENGINEERING',
    author: 'Chidi Eze',
    authorRole: 'Lead Smart Contract Architect',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    readTime: '6 min read',
    publishedAt: 'August 14, 2026',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    snippet: 'How we eliminate payment settlement delays between London bank accounts and African local mobile money wallets using cryptographic escrow locks.',
    keyTakeaways: [
      'Multi-currency smart contract vaults allow international clients to deposit in USD, GBP, or EUR while settling directly in native African fiat (NGN, KES, GHS, ZAR).',
      'Dual-key multisig authorization guarantees deliverable approval before any funds can be released from escrow.',
      'Instant zero-slippage conversion prevents foreign exchange volatility during milestone delivery.'
    ],
    contentSections: [
      {
        heading: '1. The Pan-African Cross-Border Settlement Challenge',
        paragraphs: [
          'For decades, African engineers delivering high-impact code for European and American enterprises faced significant friction: 5-to-10 day international wire delays, excessive 8% intermediary banking fees, and the ever-present risk of client chargebacks after code handover.',
          'Refeir solves this fundamental structural inefficiency by deploying program-derived escrow accounts on Solana and Rust backends. Every contract milestone is locked upfront in sovereign custody, ensuring that once code passes unit tests and milestone acceptance, disbursement occurs within 1.2 seconds.'
        ],
        callout: 'Sovereign Guarantee: Funds locked in Refeir Escrow cannot be unilaterally recalled by the client once work has begun.'
      },
      {
        heading: '2. Rust Smart Contract Architecture & Milestone Verification',
        paragraphs: [
          'Our milestone program utilizes Anchor framework primitives to create distinct state vaults for each deliverable commit. Below is the simplified state verification routine executed on milestone release:'
        ],
        codeSnippet: `// Refeir Escrow State Handler in Rust
#[derive(Accounts)]
pub struct ReleaseMilestone<'info> {
    #[account(mut, has_one = client, has_one = talent)]
    pub escrow_vault: Account<'info, EscrowVault>,
    pub client: Signer<'info>,
    #[account(mut)]
    pub talent: SystemAccount<'info>,
    #[account(mut)]
    pub scout: Option<SystemAccount<'info>>,
    pub token_program: Program<'info, Token>,
}

pub fn handle_milestone_release(ctx: Context<ReleaseMilestone>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow_vault;
    require!(escrow.status == VaultStatus::Funded, EscrowError::InvalidState);
    
    // Calculate 10% scout referral reward allocation
    let scout_cut = escrow.amount * 10 / 100;
    let talent_payout = escrow.amount - scout_cut;
    
    // Execute atomic parallel transfer
    transfer_escrow_funds(&ctx, talent_payout, scout_cut)?;
    escrow.status = VaultStatus::Settled;
    Ok(())
}`
      },
      {
        heading: '3. Connecting Escrow Releases to Local Mobile Money Rails',
        paragraphs: [
          'Once the on-chain lock verifies milestone settlement, the Refeir Liquidity Engine immediately signals local clearinghouses in Lagos (NIBSS), Nairobi (M-Pesa), and Accra (GhIPSS). The engineer receives an instant SMS notification on their phone with funds available for ATM withdrawal or local bank transfer with zero conversion loss.'
        ]
      }
    ],
    likes: 128,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 'guide-2',
    title: 'The 10% Scout Playbook: Sourcing Enterprise FinTech Contracts in London & NY',
    category: 'SCOUT BLUEPRINT',
    author: 'Kwame Mensah',
    authorRole: 'Elite Scout Partner ($280k+ Referral Vol)',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    readTime: '8 min read',
    publishedAt: 'August 12, 2026',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80',
    snippet: 'Step-by-step methods for approaching foreign CTOs with pre-vetted African talent profiles and locking lifetime referral commissions.',
    keyTakeaways: [
      'Focus on foreign startups and Series A companies in the UK, US, and EU actively looking for senior Go, Rust, and React Native talent.',
      'Never send raw CVs; always send verified Refeir talent portfolio links with code audit badges.',
      'Refeir locked referral attribution protects your 10% commission on every future project the client hires with that talent.'
    ],
    contentSections: [
      {
        heading: '1. Identifying High-Yield Foreign Client Leads',
        paragraphs: [
          'The most lucrative scouting opportunities do not come from job boards. They come from monitoring Y Combinator, Techstars, and Seed-stage funding rounds in tech hubs like London, San Francisco, Berlin, and Dubai.',
          'Startups that just raised $2M-$5M need senior engineers immediately, but local US/UK talent costs $180k-$250k. By presenting verified Refeir engineers who build at the same caliber for competitive rates, you solve the CTO\'s biggest headache.'
        ]
      },
      {
        heading: '2. The High-Converting 3-Point Referral Pitch',
        paragraphs: [
          'When reaching out to hiring managers or engineering directors, keep your outreach concise and value-driven:',
          '1. Identify their specific tech stack bottleneck (e.g. "Saw you are migrating your payments backend to Go/Rust").',
          '2. Present a verified Refeir talent profile with benchmarked git commits and 3D KYC verification.',
          '3. Emphasize that all milestone payments are held in Refeir Escrow with 0% payment risk.'
        ],
        callout: 'Pro Tip: Scouts who attach verified portfolio links see a 42% higher click-to-hire conversion rate.'
      }
    ],
    likes: 215,
    isLiked: true,
    isBookmarked: true
  },
  {
    id: 'guide-3',
    title: 'Zero-Knowledge Biometric Identity Audits for Distributed Remote Teams',
    category: 'SECURITY',
    author: 'Refeir Trust & Security Tribunal',
    authorRole: 'Platform Compliance & KYC Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    readTime: '5 min read',
    publishedAt: 'August 10, 2026',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80',
    snippet: 'Understanding 3D face liveness detection, government OCR verification, and cryptographic trust badges on Refeir.',
    keyTakeaways: [
      'Refeir 4-tier verification combines government ID OCR, 3D facial liveness, and github code history verification.',
      'Verified badges provide clients with 100% certainty of identity and work authenticity.',
      'Zero-knowledge proof architecture protects talent privacy while providing proof of residency across 54 African countries.'
    ],
    contentSections: [
      {
        heading: '1. Why Enterprise Clients Demand Cryptographic Identity',
        paragraphs: [
          'When international companies hire remote contractors across borders, identity fraud, proxy interviewing, and profile spoofing represent severe security hazards.',
          'Refeir implements zero-knowledge identity validation. We confirm government database records, national tax IDs, and live biometric 3D depth maps without ever exposing raw biometric data to third parties.'
        ]
      }
    ],
    likes: 94,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 'guide-4',
    title: 'Flutter vs React Native in 2026: Benchmarking African FinTech Apps',
    category: 'MOBILE TECH',
    author: 'Fatima Al-Sayed',
    authorRole: 'Senior Mobile Architect (Cairo)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    readTime: '7 min read',
    publishedAt: 'August 08, 2026',
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1000&auto=format&fit=crop&q=80',
    snippet: 'Real-world performance metrics across low-bandwidth 3G/4G networks in Nairobi, Lagos, and Cairo.',
    keyTakeaways: [
      'Flutter Impeller engine delivers 60fps animations on entry-level Android devices common across African consumer markets.',
      'React Native with TurboModules offers faster cold-start times for native SDK banking integrations.',
      'Offline-first SQLite caching is mandatory for high-reliability payments in variable network conditions.'
    ],
    contentSections: [
      {
        heading: '1. The Network Realities of Pan-African Mobile Applications',
        paragraphs: [
          'Developing mobile apps for users in Africa requires architectural empathy. 60% of daily transactions occur over congested 3G networks or intermittent LTE connections.',
          'Our benchmark tests across 12 African cities evaluated APK payload sizes, memory overhead, and offline queue synchronization between Flutter and React Native.'
        ]
      }
    ],
    likes: 167,
    isLiked: false,
    isBookmarked: false
  }
];

const CLUBS_DATA: ClubData[] = [
  {
    id: 'club-1',
    name: 'Pan-African Rust & Web3 Guild',
    membersCount: 1420,
    tag: 'SMART CONTRACTS',
    lead: 'Chidi Eze & Tunde Adeleke',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    leadRole: 'Senior Solana Core Contributor',
    description: 'Deep dives into Solana, CosmWasm, and Substrate contracts with automated escrow verification.',
    slogan: 'Building sovereign smart contracts and cryptographic trust vaults for the continent.',
    bannerImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&auto=format&fit=crop&q=80',
    channels: ['#announcements', '#solana-sprints', '#code-reviews', '#job-referrals', '#zero-knowledge'],
    pinnedPosts: [
      {
        id: 'cp-1',
        author: 'Chidi Eze',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        role: 'Guild Lead',
        title: 'Weekly Sprint: Auditing Anchor Escrow Programs for Client Milestone Releases',
        body: 'Welcome to this week\'s guild sprint. We have open review bounties on PR #42 fixing program-derived token transfers for escrow payouts. Check out the resources tab for the audit template!',
        time: '3 hours ago',
        likes: 24,
        commentsCount: 9,
        tags: ['#Solana', '#Rust', '#EscrowAudit', '#Bounty']
      },
      {
        id: 'cp-2',
        author: 'Tunde Adeleke',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        role: 'Senior Core Dev',
        title: 'Performance Benchmark: Zero-Knowledge Verification Gas Optimization',
        body: 'We reduced on-chain verify proof gas costs by 34% by batching ed25519 signature checks. Benchmarks and Rust test harness available in our guild toolkit.',
        time: '1 day ago',
        likes: 38,
        commentsCount: 14,
        tags: ['#ZeroKnowledge', '#Optimization', '#Rust']
      }
    ],
    resources: [
      {
        title: 'Refeir Sovereign Escrow Anchor Program Template (v2.4)',
        type: 'Rust Repository',
        downloads: 412,
        desc: 'Production-ready smart contract template for milestone locking and automatic scout reward dispatch.'
      },
      {
        title: 'Solana Security & Reentrancy Audit Checklist',
        type: 'PDF Guide',
        downloads: 680,
        desc: 'Comprehensive 40-point verification checklist used by Refeir arbiters.'
      }
    ],
    activeSprints: [
      {
        title: 'Build Zero-Knowledge Identity Signature Verifier in Rust',
        status: 'OPEN BOUNTY',
        deadline: 'Aug 25, 2026',
        reward: '$2,500 USDC Escrow',
        scope: 'Implement off-chain zk-SNARK proof generation with Anchor verification program.'
      }
    ],
    memberList: [
      { name: 'Chidi Eze', role: 'Guild Lead / Rust Architect', country: 'Nigeria', flag: '🇳🇬', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { name: 'Tunde Adeleke', role: 'Smart Contract Auditor', country: 'Nigeria', flag: '🇳🇬', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
      { name: 'Fatima Al-Sayed', role: 'Cryptography Engineer', country: 'Egypt', flag: '🇪🇬', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'David Kamau', role: 'Solana Protocol Dev', country: 'Kenya', flag: '🇰🇪', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'club-2',
    name: 'Elite Scout Referral Syndicate',
    membersCount: 980,
    tag: 'COMMISSIONS',
    lead: 'Kwame Mensah & Amina Diop',
    leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    leadRole: 'Principal Scout Partner',
    description: 'Strategies for closing Fortune 500 tech leads, negotiating splits, and maximizing lifetime referral revenue.',
    slogan: 'Mastering enterprise matchmaking and lifetime 10% scout attribution.',
    bannerImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    channels: ['#scout-leads', '#cold-outreach-templates', '#rate-negotiation', '#wins-and-payouts'],
    pinnedPosts: [
      {
        id: 'cp-3',
        author: 'Kwame Mensah',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        role: 'Syndicate Lead',
        title: 'New European Enterprise Hiring Wave: London FinTechs looking for Senior Go Engineers',
        body: '3 foreign clients in our syndicate network have open $80k-$120k remote contracts for senior backend engineers. Submit your verified talent profiles directly via the Scout Portal!',
        time: '5 hours ago',
        likes: 47,
        commentsCount: 18,
        tags: ['#ClientLeads', '#ScoutCommissions', '#LondonTech']
      }
    ],
    resources: [
      {
        title: 'Enterprise Scout Pitch Deck & Email Templates (2026 Edition)',
        type: 'Keynote & PDF',
        downloads: 890,
        desc: 'Battle-tested cold outreach copy for foreign CTOs with 38% response rate.'
      }
    ],
    activeSprints: [
      {
        title: 'Place 5 Senior React Native Engineers with Berlin Mobile Startup',
        status: 'ACTIVE SYNDICATE SPRINT',
        deadline: 'Sept 1, 2026',
        reward: '10% Lifetime ($8k-$12k/yr per talent)',
        scope: 'Match vetted Pan-African mobile engineers with verified foreign enterprise client.'
      }
    ],
    memberList: [
      { name: 'Kwame Mensah', role: 'Syndicate Lead ($280k Vol)', country: 'Ghana', flag: '🇬🇭', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
      { name: 'Amina Diop', role: 'Francophone Tech Scout', country: 'Senegal', flag: '🇸🇳', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
      { name: 'Sarah Al-Mansoor', role: 'Enterprise Matchmaker', country: 'Egypt', flag: '🇪🇬', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'club-3',
    name: 'African AI & Local Language LLMs',
    membersCount: 860,
    tag: 'MACHINE LEARNING',
    lead: 'Zainab Nwachukwu',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    leadRole: 'Senior NLP & LLM Researcher',
    description: 'Fine-tuning open models for Yoruba, Swahili, Amharic, Hausa, and Zulu voice & text applications.',
    slogan: 'Empowering 2,000+ African languages through cutting-edge open weights and speech models.',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    channels: ['#datasets', '#voice-agents', '#fine-tuning', '#model-evals'],
    pinnedPosts: [
      {
        id: 'cp-4',
        author: 'Zainab Nwachukwu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: 'Club Lead',
        title: 'Open Dataset Release: 50,000 Hours of Clean Swahili & Yoruba Audio for Whisper fine-tuning',
        body: 'We have compiled and open-sourced an ethically sourced audio corpus covering everyday commerce, banking, and medical conversations. Download link in resources!',
        time: '6 hours ago',
        likes: 62,
        commentsCount: 22,
        tags: ['#AfricanLLMs', '#Swahili', '#VoiceAI', '#OpenSource']
      }
    ],
    resources: [
      {
        title: 'Pan-African Multi-Lingual Speech Dataset (Audio & Transcripts)',
        type: 'HuggingFace Dataset',
        downloads: 1240,
        desc: 'Curated 50,000 hour speech corpus across Swahili, Yoruba, Hausa, and Amharic.'
      }
    ],
    activeSprints: [
      {
        title: 'Build Low-Latency M-Pesa USSD Voice Assistant in Swahili',
        status: 'HACKATHON SPRINT',
        deadline: 'Aug 30, 2026',
        reward: '$5,000 Escrow Bounty',
        scope: 'Create sub-500ms voice agent for automated mobile money transfers.'
      }
    ],
    memberList: [
      { name: 'Zainab Nwachukwu', role: 'AI Lead / NLP Researcher', country: 'Nigeria', flag: '🇳🇬', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'Jean-Paul Habimana', role: 'Speech Synthesis Specialist', country: 'Rwanda', flag: '🇷🇼', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'club-4',
    name: 'FinTech & Multi-Currency Architecture',
    membersCount: 1150,
    tag: 'PAYMENTS',
    lead: 'David Kamau & SafariPay Team',
    leadAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    leadRole: 'Principal Payments Architect',
    description: 'Bridging cross-border payment rails, Central Bank APIs, and sovereign fiat-crypto settlement.',
    slogan: 'Engineering the financial nervous system for frictionless cross-border commerce.',
    bannerImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
    channels: ['#payment-rails', '#central-bank-compliance', '#instant-clearing', '#crypto-fiat-bridge'],
    pinnedPosts: [
      {
        id: 'cp-5',
        author: 'David Kamau',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
        role: 'Guild Lead',
        title: 'Unified API Wrapper for M-Pesa Daraja, NIBSS Instant Payments & MTN MoMo',
        body: 'We have finalized our standardized TypeScript SDK that handles webhooks, idempotent retries, and ledger reconciliation across 6 African central banking gateways.',
        time: '8 hours ago',
        likes: 53,
        commentsCount: 11,
        tags: ['#FinTech', '#MPesa', '#NIBSS', '#SDK']
      }
    ],
    resources: [
      {
        title: 'Universal African Payment Gateway TypeScript SDK',
        type: 'NPM Package & Repo',
        downloads: 750,
        desc: 'Unified interface for M-Pesa, MTN MoMo, NIBSS, and Paystack webhooks.'
      }
    ],
    activeSprints: [
      {
        title: 'Implement Multi-Currency Sub-Cent Escrow Reconciliation Engine',
        status: 'OPEN SPRINT',
        deadline: 'Sept 10, 2026',
        reward: '$3,200 USDC Escrow',
        scope: 'Automated double-entry ledger auditing for foreign client USD-to-NGN payouts.'
      }
    ],
    memberList: [
      { name: 'David Kamau', role: 'Payments Architect', country: 'Kenya', flag: '🇰🇪', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'club-5',
    name: 'Francophone Africa Tech Circle',
    membersCount: 740,
    tag: 'WEST & CENTRAL AFRICA',
    lead: 'Amina Diop & Michel Kouamé',
    leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    leadRole: 'Regional Coordinator',
    description: 'Uniting software creators across Dakar, Abidjan, Douala, Lomé, and Kigali.',
    slogan: 'Accélérer les opportunités technologiques à travers l\'Afrique francophone.',
    bannerImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=80',
    channels: ['#annonces-francophones', '#opportunites-client', '#partage-code', '#meetups-abidjan-dakar'],
    pinnedPosts: [
      {
        id: 'cp-6',
        author: 'Michel Kouamé',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        role: 'Tech Lead',
        title: 'Opportunité: 4 Développeurs Fullstack pour une FinTech basée à Paris et Abidjan',
        body: 'Les profils vérifiés sur Refeir avec expérience React / Node.js et intégration Mobile Money peuvent postuler directement via le lien ci-joint.',
        time: '12 hours ago',
        likes: 31,
        commentsCount: 8,
        tags: ['#Francophone', '#Abidjan', '#Dakar', '#Recrutement']
      }
    ],
    resources: [
      {
        title: 'Guide de Facturation Internationale & Conformité Fiscale OHADA',
        type: 'Document PDF',
        downloads: 520,
        desc: 'Modèles de contrats conformes pour développeurs indépendants en zone UEMOA / CEMAC.'
      }
    ],
    activeSprints: [
      {
        title: 'Traduction Complète des Outils Refeir en Français et Arabe',
        status: 'COMMUNITY SPRINT',
        deadline: 'Sept 15, 2026',
        reward: '$1,800 Escrow Reward',
        scope: 'Assurer une localisation fluide de toutes les interfaces de négociation.'
      }
    ],
    memberList: [
      { name: 'Amina Diop', role: 'Coordinatrice Régionale', country: 'Senegal', flag: '🇸🇳', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'club-6',
    name: 'Product & Design Systems Masters',
    membersCount: 690,
    tag: 'UI / UX',
    lead: 'Adaeze Okafor',
    leadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    leadRole: 'Staff Product Designer',
    description: 'Figma component tokens, Pan-African design languages, and micro-animations for enterprise web apps.',
    slogan: 'Crafting world-class, culturally rooted digital product experiences.',
    bannerImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    channels: ['#figma-tokens', '#design-critiques', '#animation-physics', '#case-studies'],
    pinnedPosts: [
      {
        id: 'cp-7',
        author: 'Adaeze Okafor',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
        role: 'Design Guild Lead',
        title: 'Release: Refeir African UI Design System (Figma Community File)',
        body: 'Includes 120+ accessible component primitives, high-contrast dark theme tokens, and bespoke currency input widgets tailored for African fintechs.',
        time: '1 day ago',
        likes: 74,
        commentsCount: 19,
        tags: ['#Figma', '#DesignSystem', '#Tokens', '#UIUX']
      }
    ],
    resources: [
      {
        title: 'Refeir African Enterprise Design System UI Kit',
        type: 'Figma Community File',
        downloads: 1680,
        desc: 'Complete token library with accessible WCAG AAA palettes and layout grids.'
      }
    ],
    activeSprints: [
      {
        title: 'Redesign Multi-Currency Currency Swap UX for Mobile Viewports',
        status: 'DESIGN SPRINT',
        deadline: 'Sept 5, 2026',
        reward: '$2,000 Escrow Prize',
        scope: 'Interactive prototypes in Figma with micro-interaction states.'
      }
    ],
    memberList: [
      { name: 'Adaeze Okafor', role: 'Staff Product Designer', country: 'Nigeria', flag: '🇳🇬', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' }
    ]
  }
];

export const CommunityHubPage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate = () => {} }) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  // Read initial tab from URL query param if present e.g. /community?tab=forum
  const [activeTab, setActiveTab] = useState<CommunityTab>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as CommunityTab;
      if (tabParam && ['home', 'forum', 'content', 'event', 'clubs', 'ambassadors', 'albums', 'help'].includes(tabParam)) {
        return tabParam;
      }
    } catch (e) {}
    return 'home';
  });

  // Listen to popstate or url changes
  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as CommunityTab;
        if (tabParam && ['home', 'forum', 'content', 'event', 'clubs', 'ambassadors', 'albums', 'help'].includes(tabParam)) {
          setActiveTab(tabParam);
        }
      } catch (e) {}
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleTabSwitch = (tab: CommunityTab) => {
    setActiveTab(tab);
    window.history.pushState({}, '', `/community?tab=${tab}`);
  };

  // Forum State
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [activeCommentDrawerId, setActiveCommentDrawerId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'SCOUT_TIPS' | 'TECH_TALENT' | 'COLLAB' | 'REGIONAL' | 'ESCROW_SAFETY'>('SCOUT_TIPS');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);

  // Fullscreen Image Lightbox State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Content Guides State & Reader Modal
  const [guides, setGuides] = useState<ContentGuide[]>(CONTENT_GUIDES);
  const [selectedGuide, setSelectedGuide] = useState<ContentGuide | null>(null);
  const [contentCategoryFilter, setContentCategoryFilter] = useState<string>('ALL');

  // Clubs State & Guild Workspace Modal
  const [clubs, setClubs] = useState<ClubData[]>(CLUBS_DATA);
  const [joinedClubIds, setJoinedClubIds] = useState<string[]>(['club-1', 'club-3']);
  const [selectedClub, setSelectedClub] = useState<ClubData | null>(null);
  const [activeClubTab, setActiveClubTab] = useState<'FEED' | 'MEMBERS' | 'RESOURCES' | 'SPRINTS'>('FEED');
  const [guildPostInput, setGuildPostInput] = useState('');

  // Ambassador Modal State
  const [showAmbassadorModal, setShowAmbassadorModal] = useState(false);
  const [ambassadorCountry, setAmbassadorCountry] = useState('Nigeria');
  const [ambassadorBio, setAmbassadorBio] = useState('');

  // Selected Album for viewer
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);

  const [posts, setPosts] = useState<DiscussionPost[]>([
    {
      id: 'post-1',
      title: 'How I closed a $14,000 smart contract referral for a Nairobi FinTech as a Scout',
      category: 'SCOUT_TIPS',
      author: 'Kwame Mensah',
      authorRole: 'SCOUT',
      authorTitle: 'Senior Scout & Partner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      country: 'Ghana',
      isPinned: true,
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
      content:
        'Fellow scouts! A key takeaway from closing international enterprise leads is providing pre-vetted Rust and Solidity portfolios verified via Refeir Tier 2 KYC. The client in London felt 100% confident because the Refeir Escrow Vault guaranteed deliverable milestones. With the 10% lifetime scout attribution, this resulted in a $1,400 instant payout upon milestone approval.',
      tags: ['#ScoutTactics', '#FinTech', '#EscrowProtection', '#PanAfrica'],
      likes: 42,
      isLiked: false,
      commentsCount: 6,
      timeAgo: '2 hours ago',
      comments: [
        {
          id: 'c1',
          author: 'Chidi Eze',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          role: 'Full-Stack Rust Engineer',
          content: 'Spot on Kwame! As a talent, having the scout handle initial enterprise introductions allows me to focus purely on high-velocity code deliverables.',
          time: '1 hour ago',
          likes: 9
        },
        {
          id: 'c2',
          author: 'Amina Diop',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
          role: 'Tech Scout Lead (Dakar)',
          content: 'Do you recommend sharing the Talent profile directly from the Refeir Scout link or creating a tailored pitch deck first?',
          time: '35 mins ago',
          likes: 4
        }
      ]
    },
    {
      id: 'post-2',
      title: 'Best practices for setting hourly & milestone rates across Nigeria, Kenya, and Egypt',
      category: 'TECH_TALENT',
      author: 'Fatima Al-Sayed',
      authorRole: 'TALENT',
      authorTitle: 'Senior Full-Stack Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      country: 'Egypt',
      isPinned: false,
      content:
        'When dealing with European or North American clients on Refeir, do not undervalue your engineering depth! We have world-class talent delivering distributed systems in Cairo, Nairobi, and Lagos. I recommend pricing by milestone deliverables in USD or EUR, backed by the Refeir Sovereign Vault so there are zero exchange rate surprises.',
      tags: ['#Pricing', '#RemoteWork', '#CareerGrowth', '#Engineering'],
      likes: 28,
      isLiked: false,
      commentsCount: 2,
      timeAgo: '5 hours ago',
      comments: [
        {
          id: 'c3',
          author: 'David Kamau',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
          role: 'Client Partner (Nairobi)',
          content: 'Agreed! Clear milestone scope definitions make it effortless for clients to approve funds immediately.',
          time: '3 hours ago',
          likes: 5
        }
      ]
    },
    {
      id: 'post-3',
      title: 'Looking for a Senior Python/Django engineer for a Kigali AgriTech API project',
      category: 'COLLAB',
      author: 'Jean-Paul Habimana',
      authorRole: 'SCOUT',
      authorTitle: 'Tech Matchmaker (Kigali Chapter)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      country: 'Rwanda',
      isPinned: false,
      content:
        'We have an enterprise AgriTech client in Rwanda looking for a senior backend engineer with experience integrating SMS USSD gateways and PostgreSQL. Budget is $4,500 locked in Refeir Escrow. If interested, drop your portfolio link below or message via Refeir chat.',
      tags: ['#KigaliTech', '#Django', '#AgriTech', '#Hiring'],
      likes: 19,
      isLiked: false,
      commentsCount: 1,
      timeAgo: '1 day ago',
      comments: [
        {
          id: 'c4',
          author: 'Zainab Nwachukwu',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          role: 'AI / LLM Engineer',
          content: 'Count me in! I have experience fine-tuning Mistral and LLaMA for localized Swahili and Yoruba voice agents.',
          time: '18 hours ago',
          likes: 8
        }
      ]
    },
    {
      id: 'post-4',
      title: 'Reminder on Zero-Tolerance Contact Sharing & DLP Safety Rules inside Refeir',
      category: 'ESCROW_SAFETY',
      author: 'Refeir Trust & Safety Tribunal',
      authorRole: 'ADMIN',
      authorTitle: 'Platform Security Arbiter',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      country: 'Pan-African Sovereign Vault',
      isPinned: true,
      content:
        'All community members are reminded that negotiating or chatting outside Refeir (WhatsApp, Zoom, Telegram) and sharing phone numbers is strictly prohibited. All conversations and deliverables are monitored by real-time DLP to protect scout commissions and escrow payouts. Violators face immediate permanent ban and total asset forfeiture.',
      tags: ['#TrustSafety', '#DLPEnforcement', '#EscrowProtection', '#Guidelines'],
      likes: 115,
      isLiked: false,
      commentsCount: 4,
      timeAgo: '2 days ago',
      comments: []
    }
  ]);

  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isForComment: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Please select an image smaller than 5MB.', 'WARNING');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isForComment) {
          setCommentImage(reader.result);
        } else {
          setNewPostImage(reader.result);
        }
        showToast('Image Attached', 'Image ready for sharing in discussion.', 'SUCCESS');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim() && !commentImage) return;

    const newComment: DiscussionComment = {
      id: `c-${Date.now()}`,
      author: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Kwame Mensah',
      avatar: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: (currentUser?.active_role as string) || 'SCOUT',
      content: commentInput.trim(),
      image: commentImage || undefined,
      time: 'Just now',
      likes: 0
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );

    setCommentInput('');
    setCommentImage(null);
    showToast('Reply Posted', 'Your insight has been published to the community forum.', 'SUCCESS');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Missing Fields', 'Please provide a title and content for your discussion.', 'WARNING');
      return;
    }

    const tagArray = newTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith('#') ? t : `#${t}`));

    const newPostObj: DiscussionPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      author: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Chidi Eze',
      authorRole: (currentUser?.active_role as any) || 'TALENT',
      authorTitle: currentUser?.headline || 'Senior Software Engineer',
      avatar: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      country: currentUser?.country || 'Nigeria',
      content: newContent.trim(),
      image: newPostImage || undefined,
      tags: tagArray.length > 0 ? tagArray : ['#RefeirCommunity', '#PanAfrica'],
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      timeAgo: 'Just now',
      comments: []
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setNewPostImage(null);
    setShowNewPostModal(false);
    showToast('Discussion Published!', 'Your post and image are now live across the Scout and Talent Community Hub.', 'SUCCESS');
  };

  const toggleJoinClub = (clubId: string, clubName: string) => {
    if (joinedClubIds.includes(clubId)) {
      setJoinedClubIds(prev => prev.filter(id => id !== clubId));
      setClubs(prev => prev.map(c => c.id === clubId ? { ...c, membersCount: Math.max(0, c.membersCount - 1) } : c));
      showToast('Left Club', `You have left ${clubName}.`, 'INFO');
    } else {
      setJoinedClubIds(prev => [...prev, clubId]);
      setClubs(prev => prev.map(c => c.id === clubId ? { ...c, membersCount: c.membersCount + 1 } : c));
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast('Welcome to the Guild!', `You are now an active member of ${clubName}.`, 'SUCCESS');
    }
  };

  const handlePostToGuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guildPostInput.trim() || !selectedClub) return;

    const newGuildPost = {
      id: `gpost-${Date.now()}`,
      author: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'You',
      avatar: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: (currentUser?.active_role as string) || 'Member',
      title: guildPostInput.trim().slice(0, 50) + (guildPostInput.length > 50 ? '...' : ''),
      body: guildPostInput.trim(),
      time: 'Just now',
      likes: 1,
      commentsCount: 0,
      tags: [`#${selectedClub.tag.replace(/\s+/g, '')}`, '#GuildFeed']
    };

    setClubs(prev => prev.map(c => {
      if (c.id === selectedClub.id) {
        return {
          ...c,
          pinnedPosts: [newGuildPost, ...c.pinnedPosts]
        };
      }
      return c;
    }));

    setSelectedClub(prev => prev ? { ...prev, pinnedPosts: [newGuildPost, ...prev.pinnedPosts] } : null);
    setGuildPostInput('');
    showToast('Guild Post Published', `Posted to ${selectedClub.name} discussion feed.`, 'SUCCESS');
  };

  const toggleLikeGuide = (guideId: string) => {
    setGuides(prev => prev.map(g => {
      if (g.id === guideId) {
        const isLiked = !g.isLiked;
        return {
          ...g,
          isLiked,
          likes: isLiked ? g.likes + 1 : g.likes - 1
        };
      }
      return g;
    }));

    if (selectedGuide && selectedGuide.id === guideId) {
      const isLiked = !selectedGuide.isLiked;
      setSelectedGuide({
        ...selectedGuide,
        isLiked,
        likes: isLiked ? selectedGuide.likes + 1 : selectedGuide.likes - 1
      });
    }
  };

  const toggleBookmarkGuide = (guideId: string) => {
    setGuides(prev => prev.map(g => {
      if (g.id === guideId) {
        const isBookmarked = !g.isBookmarked;
        showToast(
          isBookmarked ? 'Guide Bookmarked' : 'Removed from Bookmarks',
          isBookmarked ? 'Saved to your personal reading library.' : 'Guide removed from reading list.',
          'SUCCESS'
        );
        return { ...g, isBookmarked };
      }
      return g;
    }));

    if (selectedGuide && selectedGuide.id === guideId) {
      setSelectedGuide({
        ...selectedGuide,
        isBookmarked: !selectedGuide.isBookmarked
      });
    }
  };

  const handleApplyAmbassador = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAmbassadorModal(false);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast(
      'Ambassador Application Submitted!',
      `Thank you for applying to represent the Refeir ${ambassadorCountry} Chapter. The Community Council will review your profile within 48 hours.`,
      'SUCCESS'
    );
    setAmbassadorBio('');
  };

  const filteredPosts = posts.filter(post => {
    const matchesCat = activeCategory === 'ALL' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('ALL');

  const filteredGuides = guides.filter(g => {
    if (contentCategoryFilter === 'ALL') return true;
    return g.category.toUpperCase().includes(contentCategoryFilter.toUpperCase());
  });

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem', maxWidth: '1240px', boxSizing: 'border-box' }}>
      {/* Community Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(10, 23, 15, 0.95) 0%, rgba(18, 43, 26, 0.95) 100%)',
          border: '1.5px solid rgba(102, 187, 42, 0.35)',
          borderRadius: 'var(--rf-radius-2xl)',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'rgba(102, 187, 42, 0.18)', border: '1px solid rgba(102, 187, 42, 0.35)', marginBottom: '0.75rem' }}>
              <Users size={14} color="var(--rf-leaf-green)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--rf-leaf-green)', textTransform: 'uppercase' }}>
                Refeir Pan-African Community Hub
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--rf-cream)', letterSpacing: '-0.02em', marginBottom: '0.5rem', lineHeight: 1.15 }}>
              The Pan-African Guild of Scouts, Talents & Leaders
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--rf-slate-300)', lineHeight: 1.6, margin: 0 }}>
              Join 18,400+ verified African developers, referral scouts, designers, and foreign enterprise clients collaborating across all 54 nations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setActiveTab('forum');
                setShowNewPostModal(true);
              }}
              className="rf-btn rf-btn-primary"
              style={{ gap: '0.4rem', fontWeight: 800 }}
            >
              <PlusCircle size={16} />
              <span>Start Discussion</span>
            </button>
            <button
              onClick={() => setShowAmbassadorModal(true)}
              className="rf-btn-ghost"
              style={{
                gap: '0.4rem',
                border: '1.5px solid var(--rf-leaf-green)',
                color: 'var(--rf-leaf-green)',
                background: 'transparent',
                borderRadius: 'var(--rf-radius-md)',
                padding: '0.625rem 1.25rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }}
            >
              <Award size={16} />
              <span>Become an Ambassador</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Features Sub-Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--rf-navy-surface)',
          padding: '0.5rem',
          borderRadius: 'var(--rf-radius-xl)',
          border: '1px solid var(--rf-navy-border)',
          marginBottom: '2rem',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'forum', label: 'Forum', icon: MessageSquare },
          { id: 'content', label: 'Content', icon: BookOpen },
          { id: 'event', label: 'Event', icon: Calendar },
          { id: 'clubs', label: 'Clubs', icon: Layers },
          { id: 'ambassadors', label: 'Ambassadors', icon: Award },
          { id: 'albums', label: 'Albums', icon: Camera },
          { id: 'help', label: 'Help', icon: HelpCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id as CommunityTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.2rem',
                borderRadius: 'var(--rf-radius-lg)',
                background: isActive ? 'var(--rf-leaf-green)' : 'transparent',
                color: isActive ? 'var(--rf-dark-green)' : 'var(--rf-cream)',
                border: 'none',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--rf-dark-green)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: HOME (OVERVIEW) ================= */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Key Community Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Active Talents', val: '18,450+', sub: 'Across 54 Countries', icon: Users, color: 'var(--rf-leaf-green)' },
              { label: 'Verified Scouts', val: '4,280+', sub: 'Attribution Protected', icon: Sparkles, color: 'var(--rf-golden-yellow)' },
              { label: 'Scout Commissions Paid', val: '$2.85M+', sub: 'Instant Sovereign Escrow', icon: Award, color: 'var(--rf-leaf-green)' },
              { label: 'Active Guilds', val: '6 Specializations', sub: 'Rust, AI, FinTech & Design', icon: Layers, color: '#38BDF8' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="rf-card" style={{ padding: '1.25rem', border: '1px solid var(--rf-navy-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)' }}>{stat.label}</span>
                    <Icon size={18} color={stat.color} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--rf-cream)' }}>{stat.val}</div>
                  <div style={{ fontSize: '0.75rem', color: stat.color, fontWeight: 700, marginTop: '0.2rem' }}>{stat.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Access Tiles to 7 Other Features */}
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '1rem' }}>
              Explore the 8 Community Hub Pillars
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {[
                { tab: 'forum', title: 'Refeir Forum', desc: 'Pan-African technical discussions & peer negotiation boards', icon: MessageSquare },
                { tab: 'content', title: 'Technical Content & Blueprints', desc: 'Case studies, architectural deep dives & scout guides', icon: BookOpen },
                { tab: 'event', title: 'Live Events & AMAs', desc: 'Virtual hackathons, city chapter meetups & pitch sessions', icon: Calendar },
                { tab: 'clubs', title: 'Specialized Guilds', desc: 'Rust, Web3, AI, FinTech & UI Design micro-communities', icon: Layers },
                { tab: 'ambassadors', title: 'Ambassador Corps', desc: 'Lead your local city chapter and earn regional rewards', icon: Award },
                { tab: 'albums', title: 'Community Albums', desc: 'Photo galleries and visual recaps from tech meetups', icon: Camera },
                { tab: 'help', title: 'Trust & Safety Code', desc: 'Anti-disintermediation rules & escrow mediation', icon: HelpCircle }
              ].map(tile => {
                const Icon = tile.icon;
                return (
                  <div
                    key={tile.tab}
                    onClick={() => handleTabSwitch(tile.tab as CommunityTab)}
                    className="rf-card rf-card-interactive"
                    style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--rf-navy-border)' }}
                  >
                    <div>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(102, 187, 42, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rf-leaf-green)', marginBottom: '0.75rem' }}>
                        <Icon size={18} />
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.35rem' }}>{tile.title}</h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>{tile.desc}</p>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 700 }}>
                      <span>Open Feature</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trending Community Discussions Preview */}
          <div className="rf-card" style={{ padding: '1.5rem', border: '1px solid var(--rf-navy-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="var(--rf-leaf-green)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Trending in the Community
                </h3>
              </div>
              <button onClick={() => handleTabSwitch('forum')} className="rf-btn-ghost" style={{ color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 700 }}>
                View All Forum Posts →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {posts.slice(0, 3).map(post => (
                <div
                  key={post.id}
                  onClick={() => handleTabSwitch('forum')}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--rf-radius-lg)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span className="rf-badge rf-badge-mint rf-text-xs" style={{ marginBottom: '0.35rem' }}>{post.category}</span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--rf-cream)', margin: '2px 0' }}>{post.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>By {post.author} • {post.timeAgo}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--rf-slate-300)', fontSize: '0.8125rem' }}>
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.commentsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: FORUM ================= */}
      {activeTab === 'forum' && (
        <div className="rf-community-grid" style={{ boxSizing: 'border-box' }}>
          {/* Main Forum Feed */}
          <div style={{ minWidth: 0, width: '100%', maxWidth: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Search and Category Filters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--rf-slate-400)' }} />
                <input
                  type="text"
                  placeholder="Search discussions, topics, keywords or tags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="rf-input"
                  style={{ paddingLeft: '2.75rem', fontSize: '0.9375rem' }}
                />
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Discussions' },
                  { id: 'SCOUT_TIPS', label: 'Scout Tactics (10%)' },
                  { id: 'TECH_TALENT', label: 'Tech & Architecture' },
                  { id: 'COLLAB', label: 'Collaborations & Sprints' },
                  { id: 'ESCROW_SAFETY', label: 'Trust Vault & Security' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rf-category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                    style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Discussions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredPosts.length === 0 ? (
                <div className="rf-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <MessageSquare size={36} color="var(--rf-slate-400)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                    No discussions found
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                    Try searching for different keywords or start a new discussion topic.
                  </p>
                  <button onClick={() => setShowNewPostModal(true)} className="rf-btn rf-btn-primary">
                    Start a New Discussion
                  </button>
                </div>
              ) : (
                filteredPosts.map(post => (
                  <div
                    key={post.id}
                    className="rf-card"
                    style={{
                      padding: '1.5rem',
                      border: post.isPinned ? '1.5px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
                      position: 'relative'
                    }}
                  >
                    {post.isPinned && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rf-leaf-green)', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        <Flame size={13} />
                        <span>PINNED DISCUSSION</span>
                      </div>
                    )}

                    {/* Author & Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={post.avatar}
                          alt={post.author}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--rf-leaf-green)' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{post.author}</span>
                            <span className="rf-badge rf-badge-mint rf-text-xs">{post.authorRole}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                            {post.authorTitle} • {post.country} • {post.timeAgo}
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      {post.title}
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-200)', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                      {post.content}
                    </p>

                    {/* Shared Image Attachment in Forum */}
                    {post.image && (
                      <div
                        style={{
                          marginBottom: '1rem',
                          borderRadius: 'var(--rf-radius-lg)',
                          overflow: 'hidden',
                          maxHeight: '360px',
                          cursor: 'pointer',
                          position: 'relative',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                        onClick={() => setLightboxImage(post.image || null)}
                      >
                        <img
                          src={post.image}
                          alt="Discussion Attachment"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s ease' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.7)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Maximize2 size={12} />
                          <span>Click to Zoom</span>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {post.tags.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--rf-leaf-green)',
                            fontWeight: 700
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Post Actions Toolbar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                          onClick={() => handleLikePost(post.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: post.isLiked ? 'rgba(102, 187, 42, 0.15)' : 'none',
                            border: post.isLiked ? '1px solid var(--rf-leaf-green)' : '1px solid transparent',
                            color: post.isLiked ? 'var(--rf-leaf-green)' : 'var(--rf-slate-300)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--rf-radius-md)',
                            cursor: 'pointer',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <ThumbsUp size={15} />
                          <span>{post.likes}</span>
                        </button>

                        <button
                          onClick={() => setActiveCommentDrawerId(activeCommentDrawerId === post.id ? null : post.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: activeCommentDrawerId === post.id ? 'rgba(255, 255, 255, 0.08)' : 'none',
                            border: '1px solid transparent',
                            color: 'var(--rf-slate-300)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--rf-radius-md)',
                            cursor: 'pointer',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <MessageSquare size={15} />
                          <span>{post.commentsCount} Replies</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          showToast('Link Copied', 'Discussion link copied to clipboard.', 'INFO');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--rf-slate-400)',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                        title="Share Discussion"
                      >
                        <Share2 size={14} />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Collapsible Replies Drawer */}
                    {activeCommentDrawerId === post.id && (
                      <div
                        style={{
                          marginTop: '1rem',
                          paddingTop: '1rem',
                          borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
                          animation: 'fadeIn 0.2s ease'
                        }}
                      >
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                          Community Insights ({post.comments.length})
                        </h4>

                        {/* Existing Comments */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                          {post.comments.length === 0 ? (
                            <div style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-400)', fontStyle: 'italic' }}>
                              Be the first to share your perspective on this topic!
                            </div>
                          ) : (
                            post.comments.map(c => (
                              <div
                                key={c.id}
                                style={{
                                  padding: '0.75rem 1rem',
                                  borderRadius: 'var(--rf-radius-md)',
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  border: '1px solid rgba(255, 255, 255, 0.04)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <img src={c.avatar} alt={c.author} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{c.author}</span>
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--rf-leaf-green)', fontWeight: 700 }}>{c.role}</span>
                                  </div>
                                  <span style={{ fontSize: '0.6875rem', color: 'var(--rf-slate-400)' }}>{c.time}</span>
                                </div>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-200)', lineHeight: 1.5, margin: 0 }}>
                                  {c.content}
                                </p>
                                {c.image && (
                                  <div style={{ marginTop: '0.5rem', maxWidth: '240px', borderRadius: 'var(--rf-radius-sm)', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLightboxImage(c.image || null)}>
                                    <img src={c.image} alt="Reply media" style={{ width: '100%', height: 'auto', borderRadius: 'var(--rf-radius-sm)' }} />
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* Image Attachment Preview for Comment */}
                        {commentImage && (
                          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem', borderRadius: 'var(--rf-radius-sm)', overflow: 'hidden' }}>
                            <img src={commentImage} alt="Preview" style={{ height: '60px', width: 'auto', borderRadius: 'var(--rf-radius-sm)' }} />
                            <button
                              onClick={() => setCommentImage(null)}
                              style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.8)', border: 'none', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        {/* Comment Input */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Add your verified reply..."
                            value={commentInput}
                            onChange={e => setCommentInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            style={{
                              flex: 1,
                              padding: '0.6rem 0.85rem',
                              borderRadius: 'var(--rf-radius-md)',
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid var(--rf-navy-border)',
                              color: 'var(--rf-cream)',
                              fontSize: '0.8125rem'
                            }}
                          />

                          <label
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0.6rem',
                              borderRadius: 'var(--rf-radius-md)',
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid var(--rf-navy-border)',
                              color: 'var(--rf-leaf-green)'
                            }}
                            title="Attach Image"
                          >
                            <ImageIcon size={16} />
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, true)} />
                          </label>

                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="rf-btn rf-btn-primary"
                            style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}
                          >
                            <Send size={14} />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ minWidth: 0, width: '100%', maxWidth: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* City Chapters & Hubs */}
            <div className="rf-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Globe2 size={18} color="var(--rf-leaf-green)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Pan-African City Chapters
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { city: 'Lagos Silicon Lagoon', talents: '4,820 Talents', flag: '🇳🇬' },
                  { city: 'Nairobi Silicon Savannah', talents: '3,410 Talents', flag: '🇰🇪' },
                  { city: 'Cape Town Tech Guild', talents: '2,950 Talents', flag: '🇿🇦' },
                  { city: 'Kigali Innovation Hub', talents: '1,840 Talents', flag: '🇷🇼' },
                  { city: 'Cairo Smart Developers', talents: '2,120 Talents', flag: '🇪🇬' },
                  { city: 'Accra Dev Circle', talents: '1,490 Talents', flag: '🇬🇭' }
                ].map((hub, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.75rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--rf-radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{hub.flag}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--rf-cream)' }}>{hub.city}</span>
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--rf-leaf-green)', fontWeight: 700 }}>
                      {hub.talents}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scout & Talent Rules Card */}
            <div className="rf-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--rf-leaf-green)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--rf-leaf-green)" />
                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Community Trust Code
                </h4>
              </div>
              <ul style={{ paddingLeft: '1.1rem', fontSize: '0.75rem', color: 'var(--rf-slate-300)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Respect peer scouts and talents across all 54 nations.</li>
                <li>Share verified insights, portfolio code, and rates openly.</li>
                <li>Chatting outside Refeir and contact sharing is strictly prohibited.</li>
                <li>All contracts and milestone releases are escrow-guaranteed.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CONTENT (TECHNICAL GUIDES & PLAYBOOKS) ================= */}
      {activeTab === 'content' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--rf-cream)', marginBottom: '0.25rem' }}>
                Technical Guides, Case Studies & Scout Playbooks
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
                In-depth technical blueprints written by top 1% African engineers and enterprise referral scouts.
              </p>
            </div>

            {/* Content Category Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['ALL', 'ENGINEERING', 'SCOUT BLUEPRINT', 'SECURITY', 'MOBILE TECH'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setContentCategoryFilter(cat)}
                  className={`rf-category-pill ${contentCategoryFilter === cat ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredGuides.map(guide => (
              <div
                key={guide.id}
                className="rf-card"
                style={{
                  overflow: 'hidden',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--rf-navy-border)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                onClick={() => setSelectedGuide(guide)}
              >
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img src={guide.image} alt={guide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    <span className="rf-badge rf-badge-mint rf-text-xs">{guide.category}</span>
                  </div>
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: '#fff' }}>
                    {guide.readTime}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      {guide.title}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5 }}>
                      {guide.snippet}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <img src={guide.authorAvatar} alt={guide.author} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>By {guide.author}</span>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedGuide(guide);
                      }}
                      className="rf-btn-ghost"
                      style={{ color: 'var(--rf-leaf-green)', fontSize: '0.8125rem', fontWeight: 800, padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <span>Read Full Guide</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: EVENT ================= */}
      {activeTab === 'event' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header & Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--rf-cream)', letterSpacing: '-0.01em', marginBottom: '0.35rem' }}>
                Upcoming Pan-African AMAs, Meetups & Hackathons
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
                Connect live with mentors, scout syndicate leaders, foreign enterprise clients, and core contributors.
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['ALL', 'VIRTUAL AMA', 'PHYSICAL MEETUP', 'HACKATHON', 'WORKSHOP'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setEventCategoryFilter(cat)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: eventCategoryFilter === cat ? '1px solid var(--rf-leaf-green)' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: eventCategoryFilter === cat ? 'rgba(102, 187, 42, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                    color: eventCategoryFilter === cat ? 'var(--rf-leaf-green)' : 'var(--rf-slate-300)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {eventCategoryFilter === cat && cat !== 'ALL' && (
                    <span className="rf-beep-dot" style={{ width: '5.5px', height: '5.5px', marginRight: '5px' }} />
                  )}
                  {cat === 'ALL' ? 'All Events' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                id: 'ev-1',
                title: 'Enterprise Scout Pitching Masterclass',
                type: 'VIRTUAL AMA',
                date: 'Thursday, Aug 20 • 6:00 PM GMT',
                host: 'Kwame Mensah (Top 1% Scout)',
                attendees: 312,
                location: 'Refeir Live Auditorium (Virtual)',
                desc: 'Master the art of pitching African developer portfolios to European and North American enterprise executives for 10% commission.'
              },
              {
                id: 'ev-2',
                title: 'Lagos Tech Meetup: Multi-Currency Escrow & Remote Contracts',
                type: 'PHYSICAL MEETUP',
                date: 'Saturday, Aug 22 • 2:00 PM WAT',
                host: 'Refeir Lagos Chapter & Guild Leads',
                attendees: 184,
                location: 'Victoria Island Innovation Center, Lagos 🇳🇬',
                desc: 'Networking session, portfolio speed audits, and live demonstrations of Refeir API integrations and milestone protection.'
              },
              {
                id: 'ev-3',
                title: 'Nairobi 48-Hour Swahili LLM & AI Hackathon',
                type: 'HACKATHON',
                date: 'Aug 28–30 • Hybrid',
                host: 'Silicon Savannah Guild & Jean-Paul Habimana',
                attendees: 420,
                location: 'Nairobi Tech Hub / Discord 🇰🇪',
                desc: '$15,000 in escrow prizes for teams building localized African AI agents, automated transcribers, and speech interfaces.'
              },
              {
                id: 'ev-4',
                title: 'Pan-African Sovereign Dispute Arbitration Q&A',
                type: 'WORKSHOP',
                date: 'Sept 5 • 4:00 PM CAT',
                host: 'Refeir Sovereign Legal Tribunal',
                attendees: 145,
                location: 'Virtual Sovereign Stream',
                desc: 'Learn how neutral arbiters inspect git commits and milestone briefs to guarantee 100% fair payouts for both clients and talent.'
              }
            ]
              .filter(ev => eventCategoryFilter === 'ALL' || ev.type === eventCategoryFilter)
              .map(ev => (
                <div
                  key={ev.id}
                  className="rf-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--rf-navy-border)',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Top Row: Badge with Animated Beeping Dot and Registered Count */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <span
                        className="rf-badge rf-badge-gold rf-text-xs"
                        style={{
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          letterSpacing: '0.04em'
                        }}
                      >
                        <span className="rf-beep-dot" />
                        <span>{ev.type}</span>
                      </span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 800 }}>
                        <Users size={13} />
                        <span>{ev.attendees} Registered</span>
                      </div>
                    </div>

                    {/* Title with aligned vertical baseline */}
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: 'var(--rf-cream)',
                        marginBottom: '0.85rem',
                        lineHeight: 1.35,
                        minHeight: '3.1rem',
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}
                    >
                      {ev.title}
                    </h3>

                    {/* Aligned Details Card Box */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        padding: '0.85rem',
                        borderRadius: 'var(--rf-radius-md)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        marginBottom: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8125rem' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'rgba(102, 187, 42, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Calendar size={13} color="var(--rf-leaf-green)" />
                        </div>
                        <span style={{ color: 'var(--rf-cream)', fontWeight: 700 }}>{ev.date}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8125rem' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'rgba(102, 187, 42, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MapPin size={13} color="var(--rf-leaf-green)" />
                        </div>
                        <span style={{ color: 'var(--rf-slate-300)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ev.location}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8125rem' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'rgba(102, 187, 42, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <User size={13} color="var(--rf-leaf-green)" />
                        </div>
                        <span style={{ color: 'var(--rf-slate-400)' }}>
                          Host: <strong style={{ color: 'var(--rf-cream)' }}>{ev.host}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--rf-slate-300)',
                        lineHeight: 1.6,
                        margin: 0,
                        minHeight: '3.6rem'
                      }}
                    >
                      {ev.desc}
                    </p>
                  </div>

                  {/* Card Footer RSVP Action */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <button
                      onClick={() => {
                        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                        showToast('RSVP Confirmed!', `You are registered for ${ev.title}. Check your email for calendar invite.`, 'SUCCESS');
                      }}
                      className="rf-btn rf-btn-primary"
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Calendar size={14} />
                      <span>RSVP Free & Add to Calendar</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: CLUBS (INTERACTIVE GUILDS & WORKSPACES) ================= */}
      {activeTab === 'clubs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
              Specialized Guilds & Micro-Communities
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
              Join domain-specific clubs to collaborate on open-source code, share client leads, and participate in private sprints.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {clubs.map(club => {
              const isJoined = joinedClubIds.includes(club.id);
              return (
                <div
                  key={club.id}
                  className="rf-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: isJoined ? '1.5px solid var(--rf-leaf-green)' : '1px solid var(--rf-navy-border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSelectedClub(club)}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="rf-badge rf-badge-mint rf-text-xs">{club.tag}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                        {club.membersCount} Engineers
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>
                      {club.name}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      {club.description}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 700 }}>
                      Club Leads: {club.lead}
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedClub(club);
                      }}
                      className="rf-btn-ghost"
                      style={{
                        flex: 1,
                        padding: '0.65rem 0.75rem',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--rf-radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        color: 'var(--rf-cream)'
                      }}
                    >
                      <Layers size={14} color="var(--rf-leaf-green)" />
                      <span>Enter Guild Workspace</span>
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleJoinClub(club.id, club.name);
                      }}
                      style={{
                        padding: '0.65rem 1rem',
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        borderRadius: 'var(--rf-radius-md)',
                        background: isJoined ? 'rgba(102, 187, 42, 0.18)' : 'var(--rf-leaf-green)',
                        border: isJoined ? '1.5px solid var(--rf-leaf-green)' : 'none',
                        color: isJoined ? '#4ade80' : 'var(--rf-dark-green)',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      {isJoined ? (
                        <>
                          <Check size={15} color="#4ade80" />
                          <span>Joined</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle size={15} />
                          <span>Join Club</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 6: AMBASSADORS ================= */}
      {activeTab === 'ambassadors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
                Sovereign Ambassador Corps
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
                Lead city chapter meetups, mentor junior talents, and represent Refeir across African innovation hubs.
              </p>
            </div>
            <button
              onClick={() => setShowAmbassadorModal(true)}
              className="rf-btn rf-btn-primary"
              style={{ fontWeight: 800, gap: '0.4rem' }}
            >
              <Award size={16} />
              <span>Apply for Ambassador Status</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                name: 'Kwame Mensah',
                role: 'Lead Ambassador • Ghana Chapter',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
                flag: '🇬🇭',
                city: 'Accra',
                contributions: 'Organized 8 meetups • Mentored 120 Scouts'
              },
              {
                name: 'Zainab Nwachukwu',
                role: 'Lead Ambassador • Nigeria Chapter',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                flag: '🇳🇬',
                city: 'Lagos',
                contributions: 'Host of AI Voice Hackathon • 450 Members'
              },
              {
                name: 'David Kamau',
                role: 'Lead Ambassador • Kenya Chapter',
                avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
                flag: '🇰🇪',
                city: 'Nairobi',
                contributions: 'Silicon Savannah Founder • 310 Members'
              },
              {
                name: 'Amina Diop',
                role: 'Lead Ambassador • Francophone Hub',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
                flag: '🇸🇳',
                city: 'Dakar',
                contributions: 'Regional Translation Lead • 240 Members'
              }
            ].map((amb, i) => (
              <div key={i} className="rf-card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--rf-navy-border)' }}>
                <img
                  src={amb.avatar}
                  alt={amb.name}
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', border: '2px solid var(--rf-leaf-green)' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{amb.flag}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{amb.name}</h3>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--rf-leaf-green)', fontWeight: 700, marginBottom: '0.75rem' }}>
                  {amb.role}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--rf-radius-sm)' }}>
                  {amb.contributions}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 7: ALBUMS ================= */}
      {activeTab === 'albums' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
              Pan-African Tech Albums & Meetup Galleries
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
              Visual highlights from hackathons, guild summits, and city chapter meetups.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                id: 'alb-1',
                title: 'Lagos Tech Week 2026: Escrow Sprints',
                photosCount: 24,
                city: 'Lagos 🇳🇬',
                cover: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
                desc: 'Over 400 developers gathered at Victoria Island for the launch of Refeir Solana escrow rails.'
              },
              {
                id: 'alb-2',
                title: 'Nairobi Silicon Savannah Hackathon',
                photosCount: 38,
                city: 'Nairobi 🇰🇪',
                cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
                desc: 'Building localized Swahili LLM agents and multi-currency mobile payment integrations.'
              },
              {
                id: 'alb-3',
                title: 'Kigali Innovation Summit 2026',
                photosCount: 19,
                city: 'Kigali 🇷🇼',
                cover: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
                desc: 'Cross-border scout masterclasses and enterprise client networking sessions.'
              },
              {
                id: 'alb-4',
                title: 'Cape Town Rust Core Dev Meetup',
                photosCount: 31,
                city: 'Cape Town 🇿🇦',
                cover: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
                desc: 'Systems engineering, zero-knowledge verification proofs, and smart contract audits.'
              }
            ].map(album => (
              <div
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="rf-card"
                style={{ overflow: 'hidden', padding: 0, border: '1px solid var(--rf-navy-border)', cursor: 'pointer' }}
              >
                <div style={{ position: 'relative', height: '180px' }}>
                  <img src={album.cover} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    📷 {album.photosCount} Photos
                  </span>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {album.city}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                    {album.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
                    {album.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 8: HELP & TRUST RULES ================= */}
      {activeTab === 'help' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--rf-cream)' }}>
              Refeir Community Safety, Trust & Arbitration Code
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', margin: 0 }}>
              Guidelines for maintaining 100% safe, scam-free, and sovereign talent-client interactions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div className="rf-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--rf-vibrant-orange)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={20} color="var(--rf-vibrant-orange)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Zero-Tolerance Contact Sharing & DLP
                </h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.6 }}>
                Chatting or conducting business outside Refeir (e.g. sharing WhatsApp numbers, Personal Emails, Telegram handles) is strictly prohibited. All project communications must occur on-platform to protect scout commissions and guarantee escrow releases.
              </p>
            </div>

            <div className="rf-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--rf-leaf-green)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--rf-leaf-green)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  100% Guaranteed Sovereign Escrow
                </h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.6 }}>
                Every milestone contract is locked in advance in the Refeir Escrow Vault. Talents are guaranteed payout upon delivering the agreed scope, and clients are protected against non-delivery.
              </p>
            </div>

            <div className="rf-card" style={{ padding: '1.5rem', borderLeft: '4px solid #38BDF8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <HelpCircle size={20} color="#38BDF8" />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                    Need Direct Assistance?
                  </h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', lineHeight: 1.6 }}>
                  Our neutral mediation arbiters and support engineers are available 24/7 to resolve contract queries, payment verification, and scout attribution inquiries.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/help')}
                className="rf-btn rf-btn-primary"
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  background: 'var(--rf-leaf-green)',
                  color: 'var(--rf-dark-green)',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxSizing: 'border-box'
                }}
              >
                <span>Visit Refeir Help Center</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: FULL IN-DEPTH CONTENT ARTICLE READER ================= */}
      {selectedGuide && (
        <div className="rf-modal-backdrop" onClick={() => setSelectedGuide(null)}>
          <div
            className="rf-modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '820px', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Top Modal Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="rf-badge rf-badge-mint rf-text-xs">{selectedGuide.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>{selectedGuide.readTime} • {selectedGuide.publishedAt}</span>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', cursor: 'pointer', padding: '0.25rem' }}
                aria-label="Close reader"
              >
                <X size={20} />
              </button>
            </div>

            {/* Article Title */}
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--rf-cream)', lineHeight: 1.25, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              {selectedGuide.title}
            </h1>

            {/* Author Byline & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={selectedGuide.authorAvatar}
                  alt={selectedGuide.author}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--rf-leaf-green)' }}
                />
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{selectedGuide.author}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 600 }}>{selectedGuide.authorRole}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => toggleLikeGuide(selectedGuide.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--rf-radius-md)',
                    background: selectedGuide.isLiked ? 'rgba(102, 187, 42, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedGuide.isLiked ? '1px solid var(--rf-leaf-green)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: selectedGuide.isLiked ? 'var(--rf-leaf-green)' : 'var(--rf-cream)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <ThumbsUp size={15} />
                  <span>{selectedGuide.likes}</span>
                </button>

                <button
                  onClick={() => toggleBookmarkGuide(selectedGuide.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--rf-radius-md)',
                    background: selectedGuide.isBookmarked ? 'rgba(246, 178, 26, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedGuide.isBookmarked ? '1px solid var(--rf-golden-yellow)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: selectedGuide.isBookmarked ? 'var(--rf-golden-yellow)' : 'var(--rf-cream)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Bookmark size={15} />
                  <span>{selectedGuide.isBookmarked ? 'Saved' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Link Copied', 'Guide URL copied to clipboard.', 'INFO');
                  }}
                  style={{
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--rf-radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--rf-slate-300)',
                    cursor: 'pointer'
                  }}
                  title="Share Guide"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div style={{ borderRadius: 'var(--rf-radius-lg)', overflow: 'hidden', marginBottom: '1.75rem', maxHeight: '340px' }}>
              <img src={selectedGuide.image} alt={selectedGuide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Key Takeaways Box */}
            <div
              style={{
                background: 'rgba(102, 187, 42, 0.08)',
                border: '1.5px solid rgba(102, 187, 42, 0.3)',
                borderRadius: 'var(--rf-radius-lg)',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--rf-leaf-green)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                <Zap size={16} />
                <span>Key Technical Takeaways</span>
              </div>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--rf-cream)', fontSize: '0.875rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                {selectedGuide.keyTakeaways.map((takeaway, i) => (
                  <li key={i}>{takeaway}</li>
                ))}
              </ul>
            </div>

            {/* In-Depth Article Content Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', color: 'var(--rf-slate-200)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
              {selectedGuide.contentSections.map((sec, i) => (
                <div key={i}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                    {sec.heading}
                  </h2>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} style={{ marginBottom: '0.75rem' }}>
                      {p}
                    </p>
                  ))}

                  {sec.codeSnippet && (
                    <div style={{ margin: '1rem 0', borderRadius: 'var(--rf-radius-md)', overflow: 'hidden', border: '1px solid rgba(102, 187, 42, 0.3)', background: '#051009' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 800 }}>
                          <Terminal size={14} />
                          <span>Smart Contract Implementation</span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(sec.codeSnippet || '');
                            showToast('Code Copied', 'Rust implementation snippet copied.', 'INFO');
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Copy size={12} />
                          <span>Copy</span>
                        </button>
                      </div>
                      <pre style={{ margin: 0, padding: '1rem', overflowX: 'auto', fontSize: '0.8125rem', fontFamily: 'var(--rf-font-mono)', color: '#A3E635' }}>
                        <code>{sec.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {sec.callout && (
                    <div style={{ background: 'rgba(246, 178, 26, 0.08)', borderLeft: '3px solid var(--rf-golden-yellow)', padding: '0.75rem 1rem', borderRadius: '0 var(--rf-radius-sm) var(--rf-radius-sm) 0', fontSize: '0.85rem', color: 'var(--rf-cream)', margin: '1rem 0', fontStyle: 'italic' }}>
                      {sec.callout}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Footer Actions */}
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setSelectedGuide(null)}
                className="rf-btn-ghost"
                style={{ color: 'var(--rf-slate-300)', fontSize: '0.875rem', fontWeight: 700 }}
              >
                ← Back to All Guides
              </button>
              <button
                onClick={() => {
                  setSelectedGuide(null);
                  setActiveTab('forum');
                }}
                className="rf-btn rf-btn-primary"
                style={{ fontWeight: 800 }}
              >
                Discuss in Refeir Forum →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: DEDICATED GUILD / CLUB WORKSPACE ================= */}
      {selectedClub && (
        <div className="rf-modal-backdrop" onClick={() => setSelectedClub(null)}>
          <div
            className="rf-modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '900px', padding: 0, maxHeight: '92vh', overflowY: 'auto', borderRadius: 'var(--rf-radius-2xl)' }}
          >
            {/* Guild Hero Banner */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
              <img src={selectedClub.bannerImage} alt={selectedClub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7, 22, 13, 0.95) 0%, rgba(7, 22, 13, 0.4) 100%)' }} />

              <button
                onClick={() => setSelectedClub(null)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label="Close Guild"
              >
                <X size={18} />
              </button>

              <div style={{ position: 'absolute', bottom: '15px', left: '25px', right: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="rf-badge rf-badge-mint rf-text-xs" style={{ marginBottom: '0.35rem' }}>{selectedClub.tag}</span>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--rf-cream)', margin: 0 }}>{selectedClub.name}</h1>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', margin: '3px 0 0' }}>{selectedClub.slogan}</p>
                </div>

                <button
                  onClick={() => toggleJoinClub(selectedClub.id, selectedClub.name)}
                  className={joinedClubIds.includes(selectedClub.id) ? 'rf-btn-ghost' : 'rf-btn rf-btn-primary'}
                  style={{
                    padding: '0.6rem 1.25rem',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    border: joinedClubIds.includes(selectedClub.id) ? '1.5px solid var(--rf-leaf-green)' : 'none',
                    color: joinedClubIds.includes(selectedClub.id) ? '#4ade80' : 'var(--rf-dark-green)',
                    background: joinedClubIds.includes(selectedClub.id) ? 'rgba(102, 187, 42, 0.18)' : 'var(--rf-leaf-green)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderRadius: 'var(--rf-radius-md)'
                  }}
                >
                  {joinedClubIds.includes(selectedClub.id) ? (
                    <>
                      <Check size={16} />
                      <span>Joined Guild ({selectedClub.membersCount})</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      <span>Join Guild ({selectedClub.membersCount})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Guild Sub-Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem 1.5rem', background: '#051009', borderBottom: '1px solid var(--rf-navy-border)', overflowX: 'auto' }}>
              {[
                { id: 'FEED', label: '💬 Discussion Feed & Sprints', icon: MessageCircle },
                { id: 'MEMBERS', label: `👥 Engineers & Scouts (${selectedClub.memberList.length})`, icon: Users },
                { id: 'RESOURCES', label: `📂 Toolkits & Code Repos (${selectedClub.resources.length})`, icon: Download },
                { id: 'SPRINTS', label: `⚡ Active Bounties (${selectedClub.activeSprints.length})`, icon: Zap }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveClubTab(t.id as any)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--rf-radius-md)',
                    background: activeClubTab === t.id ? 'rgba(102, 187, 42, 0.18)' : 'transparent',
                    border: activeClubTab === t.id ? '1px solid var(--rf-leaf-green)' : '1px solid transparent',
                    color: activeClubTab === t.id ? 'var(--rf-leaf-green)' : 'var(--rf-cream)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Guild Tab Content */}
            <div style={{ padding: '1.75rem', background: '#07160D' }}>
              {/* SUB-TAB 1: FEED */}
              {activeClubTab === 'FEED' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Post into Guild Form */}
                  <form onSubmit={handlePostToGuild} style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--rf-radius-lg)', border: '1px solid var(--rf-navy-border)' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                      Share with {selectedClub.name}
                    </div>
                    <textarea
                      rows={2}
                      className="rf-input"
                      placeholder="Share a technical question, architecture design, or sprint update with guild peers..."
                      value={guildPostInput}
                      onChange={e => setGuildPostInput(e.target.value)}
                      style={{ fontSize: '0.85rem', resize: 'none', marginBottom: '0.75rem' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)' }}>Channels: {selectedClub.channels.join(' ')}</span>
                      <button type="submit" className="rf-btn rf-btn-primary rf-btn-sm" style={{ fontWeight: 800 }}>
                        <Send size={13} />
                        <span>Post to Guild</span>
                      </button>
                    </div>
                  </form>

                  {/* Pinned Guild Posts */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedClub.pinnedPosts.map(post => (
                      <div key={post.id} style={{ padding: '1.25rem', borderRadius: 'var(--rf-radius-lg)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                          <img src={post.avatar} alt={post.author} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{post.author}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--rf-leaf-green)' }}>{post.role} • {post.time}</div>
                          </div>
                        </div>

                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.4rem' }}>{post.title}</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-200)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>{post.body}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {post.tags.map((t, idx) => (
                              <span key={idx} style={{ fontSize: '0.7rem', color: 'var(--rf-leaf-green)', fontWeight: 700 }}>{t}</span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>
                            <span>👍 {post.likes}</span>
                            <span>💬 {post.commentsCount} comments</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: MEMBERS DIRECTORY */}
              {activeClubTab === 'MEMBERS' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {selectedClub.memberList.map((m, idx) => (
                    <div key={idx} style={{ padding: '1rem', borderRadius: 'var(--rf-radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--rf-navy-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={m.avatar} alt={m.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--rf-cream)' }}>{m.name}</span>
                          <span>{m.flag}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 600 }}>{m.role}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)' }}>{m.country}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-TAB 3: RESOURCES */}
              {activeClubTab === 'RESOURCES' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedClub.resources.map((res, idx) => (
                    <div key={idx} style={{ padding: '1.25rem', borderRadius: 'var(--rf-radius-lg)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--rf-navy-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span className="rf-badge rf-badge-mint rf-text-xs" style={{ marginBottom: '0.35rem' }}>{res.type}</span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--rf-cream)', margin: '2px 0' }}>{res.title}</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', margin: '2px 0 0' }}>{res.desc}</p>
                      </div>
                      <button
                        onClick={() => showToast('Download Started', `Downloading ${res.title}...`, 'SUCCESS')}
                        className="rf-btn rf-btn-primary rf-btn-sm"
                        style={{ fontWeight: 800, gap: '0.35rem' }}
                      >
                        <Download size={14} />
                        <span>Download Toolkit</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-TAB 4: SPRINTS */}
              {activeClubTab === 'SPRINTS' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedClub.activeSprints.map((sp, idx) => (
                    <div key={idx} style={{ padding: '1.25rem', borderRadius: 'var(--rf-radius-lg)', background: 'rgba(102, 187, 42, 0.06)', border: '1.5px solid rgba(102, 187, 42, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="rf-badge rf-badge-mint rf-text-xs">{sp.status}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--rf-leaf-green)' }}>{sp.reward}</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>{sp.title}</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--rf-slate-300)', margin: 0 }}>{sp.scope}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--rf-slate-400)' }}>Deadline: {sp.deadline}</span>
                        <button
                          onClick={() => {
                            confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } });
                            showToast('Sprint Joined', `You have registered for: ${sp.title}`, 'SUCCESS');
                          }}
                          className="rf-btn rf-btn-primary rf-btn-sm"
                          style={{ fontWeight: 800 }}
                        >
                          Submit Solution / PR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: START DISCUSSION MODAL ================= */}
      {showNewPostModal && (
        <div className="rf-modal-backdrop" onClick={() => setShowNewPostModal(false)}>
          <div className="rf-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={22} color="var(--rf-leaf-green)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Start Community Discussion
                </h3>
              </div>
              <button onClick={() => setShowNewPostModal(false)} style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              <div className="rf-form-group">
                <label className="rf-label">Topic Category</label>
                <select className="rf-select" value={newCategory} onChange={e => setNewCategory(e.target.value as any)}>
                  <option value="SCOUT_TIPS">Scout Tactics (10% Lifetime Attribution)</option>
                  <option value="TECH_TALENT">Tech Architecture & Engineering Rates</option>
                  <option value="COLLAB">Project Collaboration & Sprints</option>
                  <option value="REGIONAL">Pan-African City Chapters & Meetups</option>
                  <option value="ESCROW_SAFETY">Trust Vault & DLP Security</option>
                </select>
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Discussion Title</label>
                <input
                  type="text"
                  className="rf-input"
                  placeholder="e.g. How to structure Rust and Go milestones for London clients"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Your Insight & Discussion Body</label>
                <textarea
                  rows={5}
                  className="rf-textarea"
                  placeholder="Share details, portfolio tips, or question for the Pan-African community..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                />
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Attach Image (Optional)</label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--rf-radius-md)',
                    border: '1.5px dashed var(--rf-navy-border)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    color: 'var(--rf-leaf-green)',
                    fontSize: '0.8125rem',
                    fontWeight: 700
                  }}
                >
                  <Upload size={16} />
                  <span>{newPostImage ? 'Replace Attached Image' : 'Upload Image (PNG, JPG up to 5MB)'}</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, false)} />
                </label>
                {newPostImage && (
                  <div style={{ position: 'relative', marginTop: '0.5rem', borderRadius: 'var(--rf-radius-md)', overflow: 'hidden', maxHeight: '160px' }}>
                    <img src={newPostImage} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => setNewPostImage(null)}
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="rf-input"
                  placeholder="#Rust, #Solana, #FinTech, #Escrow"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                />
              </div>

              <button type="submit" className="rf-btn rf-btn-primary rf-w-full" style={{ padding: '0.85rem', fontWeight: 800 }}>
                Publish Discussion
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: BECOME AMBASSADOR MODAL ================= */}
      {showAmbassadorModal && (
        <div className="rf-modal-backdrop" onClick={() => setShowAmbassadorModal(false)}>
          <div className="rf-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={22} color="var(--rf-leaf-green)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>
                  Apply for Chapter Ambassador
                </h3>
              </div>
              <button onClick={() => setShowAmbassadorModal(false)} style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplyAmbassador}>
              <div className="rf-form-group">
                <label className="rf-label">Country Chapter You Wish to Lead</label>
                <select className="rf-select" value={ambassadorCountry} onChange={e => setAmbassadorCountry(e.target.value)}>
                  <option value="Nigeria">Nigeria 🇳🇬</option>
                  <option value="Kenya">Kenya 🇰🇪</option>
                  <option value="Ghana">Ghana 🇬🇭</option>
                  <option value="South Africa">South Africa 🇿🇦</option>
                  <option value="Egypt">Egypt 🇪🇬</option>
                  <option value="Rwanda">Rwanda 🇷🇼</option>
                  <option value="Senegal">Senegal 🇸🇳</option>
                  <option value="Uganda">Uganda 🇺🇬</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire 🇨🇮</option>
                  <option value="Morocco">Morocco 🇲🇦</option>
                  <option value="Other">Other Sovereign Nation 🌍</option>
                </select>
              </div>

              <div className="rf-form-group">
                <label className="rf-label">Why do you want to represent Refeir?</label>
                <textarea
                  rows={4}
                  className="rf-textarea"
                  placeholder="Share your community leadership experience, scout network, or developer group background..."
                  value={ambassadorBio}
                  onChange={e => setAmbassadorBio(e.target.value)}
                  required
                />
              </div>

              <div style={{ background: 'rgba(102, 187, 42, 0.08)', padding: '0.75rem 1rem', borderRadius: 'var(--rf-radius-md)', border: '1px solid rgba(102, 187, 42, 0.25)', fontSize: '0.75rem', color: 'var(--rf-slate-300)', marginBottom: '1.25rem' }}>
                Ambassadors receive monthly community event stipends, direct Discord admin roles, and exclusive Sovereign Ambassador profile badges.
              </div>

              <button type="submit" className="rf-btn rf-btn-primary rf-w-full" style={{ padding: '0.85rem', fontWeight: 800 }}>
                Submit Ambassador Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: ALBUM VIEWER ================= */}
      {selectedAlbum && (
        <div className="rf-modal-backdrop" onClick={() => setSelectedAlbum(null)}>
          <div className="rf-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 700 }}>{selectedAlbum.city}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--rf-cream)', margin: 0 }}>{selectedAlbum.title}</h3>
              </div>
              <button onClick={() => setSelectedAlbum(null)} style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <img
              src={selectedAlbum.cover}
              alt={selectedAlbum.title}
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: 'var(--rf-radius-md)', marginBottom: '1rem' }}
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--rf-slate-300)', lineHeight: 1.5, margin: 0 }}>
              {selectedAlbum.desc}
            </p>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: FULLSCREEN IMAGE LIGHTBOX ================= */}
      {lightboxImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1.5rem'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
            <img
              src={lightboxImage}
              alt="Full view"
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--rf-radius-lg)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
