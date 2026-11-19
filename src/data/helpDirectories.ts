import {
  HelpCircle,
  MessageCircle,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
  Briefcase,
  Ticket,
  Crown,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  X,
  Award,
  Zap,
  Globe2,
  Lock,
  Wallet,
  Building2,
  FileText,
  Scale,
  DollarSign,
  Compass,
  ShieldAlert,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Layers,
  Radio,
  Clock,
  KeyRound,
  Check
} from 'lucide-react';


export type HelpRoleCategory = 'ALL' | 'TALENT' | 'CLIENT' | 'SCOUT' | 'PRO';

export interface HelpTopicArticle {
  title: string;
  summary: string;
  steps?: string[];
  tips?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface HelpCategorySection {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  articles: HelpTopicArticle[];
}

export interface RoleHelpDirectory {
  role: HelpRoleCategory;
  roleLabel: string;
  badgeColor: string;
  description: string;
  sections: HelpCategorySection[];
}

export const HELP_DIRECTORIES: Record<Exclude<HelpRoleCategory, 'ALL'>, RoleHelpDirectory> = {
  // ==========================================
  // 1. FOR TALENTS (FREELANCERS)
  // ==========================================
  TALENT: {
    role: 'TALENT',
    roleLabel: 'Talent & Freelancers',
    badgeColor: 'var(--rf-leaf-green)',
    description: 'Everything you need to set up your profile, publish services, fulfill milestones, and withdraw earnings.',
    sections: [
      {
        id: 'talent-security',
        title: 'Account Settings & Security',
        icon: Lock,
        color: '#66BB2A',
        description: 'Manage login credentials, 2FA security, identity data usage, and phone verification.',
        articles: [
          {
            title: 'Creating your Refeir account',
            summary: 'Get started as a verified African tech or creative professional. Choose your core primary skill, location, and set up your sovereign profile.',
            steps: [
              'Click Sign Up and choose "Join as Talent / Freelancer".',
              'Enter your full legal name, professional email, and password.',
              'Confirm your email address through the instant verification token.',
              'Complete your bio, primary service rates, and regional expertise.'
            ],
            tips: 'Using your real legal name is required for KYC identity match and fast payout approvals.',
            actionUrl: '/settings',
            actionLabel: 'Go to Account Settings'
          },
          {
            title: 'ID verification: Data protection and usage',
            summary: 'Understand how Refeir protects your identity data during Tier-2 KYC checks under pan-African and international privacy frameworks.',
            steps: [
              'Navigate to Verification from your profile avatar menu.',
              'Submit a government-issued National ID, International Passport, or Voter Card.',
              'Our encrypted automated engine validates document authenticity within 10 minutes.',
              'All biometric records are salted and hashed — never shared with clients.'
            ],
            tips: 'Verified accounts gain the green Shield badge and receive 3x more scout recommendations.',
            actionUrl: '/verification',
            actionLabel: 'Complete Identity Verification'
          },
          {
            title: 'Password, security question, and two-factor authentication',
            summary: 'Secure your multi-currency wallet and contract workspaces using hardware keys or authenticator apps (TOTP).',
            steps: [
              'Go to Settings > Security & Login.',
              'Toggle on Two-Factor Authentication (2FA).',
              'Scan the QR code with Google Authenticator or Authy.',
              'Save your 8-digit emergency recovery codes in a secure offline location.'
            ],
            tips: '2FA is mandatory for all crypto stablecoin and high-value bank withdrawals over $500 USD.',
            actionUrl: '/settings',
            actionLabel: 'Enable 2FA'
          },
          {
            title: 'Phone verification: Secure your Refeir account',
            summary: 'Link your registered African mobile number (+234, +254, +233, +250, +27, +256, etc.) for instant SMS OTP alerts and Mobile Money routing.',
            steps: [
              'Open Account Settings > Mobile & Phone Verification.',
              'Select your country code and enter your active mobile phone number.',
              'Enter the 6-digit SMS OTP received.',
              'Your phone is now bound to your account and MoMo payout rails.'
            ],
            tips: 'Ensure your phone number matches the SIM registered to your M-Pesa or MTN MoMo wallet.'
          }
        ]
      },
      {
        id: 'talent-pitching',
        title: 'Pitching on Refeir',
        icon: Briefcase,
        color: '#4CAF50',
        description: 'Showcase your skills, create high-converting Service Gigs, and climb the freelancer levels.',
        articles: [
          {
            title: 'Creating & editing your freelancer profile',
            summary: 'Craft a compelling headline, showcase your tech stack, set your scout referral fee percentage, and list verified hourly rates.',
            steps: [
              'Go to Profile Settings from your talent workspace.',
              'Add a crisp, professional headshot and your country flag location.',
              'Define your custom Scout Referral Commission Rate (e.g. 10% or custom).',
              'Highlight portfolio projects, GitHub repos, and live production URLs.'
            ],
            tips: 'Talents offering a 10% referral rate get 4x more scout recommendations because scouts pay 0% fees.',
            actionUrl: '/account/profile',
            actionLabel: 'Edit Talent Profile'
          },
          {
            title: 'Creating a Service / Gig',
            summary: 'Package your expertise into fixed-price deliverables with clear timelines, revision counts, and deliverables.',
            steps: [
              'In your Talent Dashboard, click "Add New Service".',
              'Define your service title, category (Engineering, Design, AI, Writing, Marketing), and tier prices (Basic, Standard, Premium).',
              'Specify milestone breakdowns and delivery turnarounds.',
              'Upload portfolio screenshots and detailed deliverable specifications.'
            ],
            tips: 'Clear, milestone-based packages convert 65% faster than vague hourly offers.',
            actionUrl: '/dashboard/talent',
            actionLabel: 'Manage My Services'
          },
          {
            title: 'Managing your Gigs & Services',
            summary: 'Pause, edit, optimize, or duplicate your active service offerings to match seasonal demand and current workload.',
            steps: [
              'Access the Services tab on your dashboard.',
              'Toggle availability switches to temporarily pause orders when at capacity.',
              'Adjust pricing and delivery timeframes based on client feedback.'
            ],
            tips: 'Keep your response rate above 90% to maintain top visibility in the marketplace catalog.'
          },
          {
            title: "Can't find your Gig in search results?",
            summary: 'Troubleshoot catalog indexing, search ranking algorithms, and category filters.',
            steps: [
              'Verify that your service status is set to "Active" and not "Draft".',
              'Check that your profile identity verification has passed Tier-1.',
              'Review keyword tags in your service description for relevant search terms.',
              'Allow up to 15 minutes for new service listings to propagate across regional nodes.'
            ],
            tips: 'Getting your first verified review from a scout referral permanently boosts search ranking.'
          },
          {
            title: "Understanding Refeir's freelancer levels & badges",
            summary: 'Progress from Rising Talent to Verified Pro and Master Freelancer to unlock fee discounts and priority scout pitches.',
            steps: [
              'Level 1 (Rising Talent): Complete 3 milestones with 4.5+ star rating.',
              'Level 2 (Top Rated): 10+ completed orders, 98% on-time delivery, $2,000+ earned.',
              'Level 3 (Refeir Master): Top 1% talent, vetted technical code audit, dedicated Refeir Desk representation.'
            ],
            tips: 'Higher levels automatically unlock lower payout fees and access to Refeir Pro enterprise briefs.'
          }
        ]
      },
      {
        id: 'talent-orders',
        title: 'Order Management',
        icon: CheckCircle2,
        color: '#2E7D32',
        description: 'Track contracts, submit milestone deliverables, collect reviews, and utilize the Resolution Center.',
        articles: [
          {
            title: "Managing your orders: A freelancer's guide to the Refeir order process",
            summary: 'Learn how orders flow from proposal acceptance and escrow deposit to final approval and payout release.',
            steps: [
              'Receive order notification or proposal acceptance from client.',
              'Confirm that the milestone escrow is 100% funded in Trust Vault before starting work.',
              'Communicate strictly inside the Project Workspace chat.',
              'Submit deliverable files and request client sign-off.'
            ],
            tips: 'Never begin work until the project status shows "Escrow Funded".',
            actionUrl: '/dashboard/talent',
            actionLabel: 'View Active Orders'
          },
          {
            title: 'Leaving and managing reviews on Refeir',
            summary: 'Request reviews from clients and scouts after completing projects. Also rate clients on payment promptness and communication.',
            steps: [
              'Upon milestone approval, click "Request Review" in your workspace.',
              'Send review requests to both the Client and the referring Scout.',
              'Leave an honest evaluation of the client ("Pays Well", "Clear Brief", "Great Communication").',
              'Reviews appear on public profiles and build your platform Trust Score.'
            ],
            tips: 'Talents and Scouts can both evaluate clients, creating transparent accountability across the network.'
          },
          {
            title: 'Using the Resolution Center',
            summary: 'Resolve milestone disagreements, delivery extension requests, and scope adjustments peacefully with automated mediation.',
            steps: [
              'Open your Project Workspace and click "Dispute / Resolution Center".',
              'Select the issue type: Timeline Extension, Scope Adjustment, or Mutual Cancellation.',
              'Submit documented proof, deliverables, and conversation logs.',
              'Refeir mediation arbitrates within 72 business hours with binding escrow release.'
            ],
            tips: 'All in-platform chat messages are cryptographically preserved for instant dispute verification.',
            actionUrl: '/disputes',
            actionLabel: 'Open Resolution Center'
          }
        ]
      },
      {
        id: 'talent-finances',
        title: 'Withdrawals & Finances',
        icon: Wallet,
        color: '#F6B21A',
        description: 'Understand multi-currency balances, instant withdrawals, Early Payout, and cross-border taxes.',
        articles: [
          {
            title: 'Your multi-currency earnings page',
            summary: 'Track pending escrow, cleared funds, and historical earnings across USD, NGN, KES, GHS, ZAR, RWF, and USDT.',
            steps: [
              'Navigate to Wallet from the main navigation header.',
              'Review your Available Balance, Escrow In-Flight, and Lifetime Earnings.',
              'Filter transaction ledgers by project, currency, and date.'
            ],
            tips: 'Funds clear automatically into your available balance the moment a client approves a milestone.',
            actionUrl: '/wallet',
            actionLabel: 'Go to Wallet'
          },
          {
            title: 'Withdrawing your earnings & managing payout methods',
            summary: 'Withdraw directly to local commercial banks across 54 African countries, M-Pesa, MTN MoMo, Airtel Money, or stablecoins.',
            steps: [
              'In your Wallet, click "Withdraw Funds".',
              'Select your preferred payout method (Direct Bank Transfer, Mobile Money, or USDT).',
              'Enter the withdrawal amount and confirm exchange rate conversion.',
              'Authorize the transfer with your 2FA security code.'
            ],
            tips: 'Mobile Money and Stablecoin payouts process in under 60 seconds; bank wires take 1-3 business hours.'
          },
          {
            title: 'Early Payout & instant milestone liquidity',
            summary: 'Access cleared earnings instantly without waiting for standard clearance windows with Refeir Instant Liquidity.',
            steps: [
              'Qualified Level 2+ freelancers will see the "Instant Withdraw" button on approved milestones.',
              'Funds are routed directly to your designated mobile money or crypto address immediately.'
            ],
            tips: 'Maintaining a 100% dispute-free record unlocks 0-second auto-withdrawals.'
          },
          {
            title: 'Freelancer taxes and cross-border compliance',
            summary: 'Download annual earnings statements, withholding tax documentation, and local tax compliance summaries for your tax authority.',
            steps: [
              'Open Wallet > Statement of Account.',
              'Select your fiscal year and export your official PDF summary.',
              'Refeir provides formal proof of foreign export earnings for tax filings.'
            ]
          }
        ]
      },
      {
        id: 'talent-features',
        title: 'Features & Programs',
        icon: Award,
        color: '#7DA2FF',
        description: 'Supercharge your client pipeline with Scout matchmaking, Refeir Plus, and Portfolio showcases.',
        articles: [
          {
            title: 'Dedicated Scout Assistant for freelancers',
            summary: 'Connect with verified Scouts across Africa who scout, pitch, and introduce global businesses directly to your service gigs.',
            steps: [
              'Set a competitive Scout Referral Rate on your profile (default 10%).',
              'Scouts discover your services in the marketplace and generate trackable referral links.',
              'When clients hire through a scout, Refeir guarantees 0% platform deductions on ≤10% rates.'
            ],
            tips: 'Scouts act as your free decentralized sales team across 12+ continental markets.'
          },
          {
            title: 'Refeir Plus Standard and Premium: Advanced tools for business growth',
            summary: 'Unlock priority project invitations, customized branding, advanced analytics, and zero withdrawal fees.',
            steps: [
              'Explore Refeir Plus tiers from your Profile Settings.',
              'Gain featured badges, top-of-catalog placement, and direct client introduction passes.'
            ]
          },
          {
            title: 'Promoting your Gigs with Refeir Featured Listings',
            summary: 'Boost your visibility across regional hub pages and category searches with sponsored top-tier placement.',
            steps: [
              'Click "Promote Service" on any active gig in your dashboard.',
              'Select your target African regions or global client markets.',
              'Track impressions, profile clicks, and conversion rates in real-time.'
            ]
          },
          {
            title: 'Using your Refeir Portfolio & Case Studies',
            summary: 'Upload interactive case studies, code repositories, Figma prototypes, and video walkthroughs to build client trust.',
            steps: [
              'Open your Profile Settings and select the "Portfolio" tab.',
              'Add project titles, client challenges, technical solutions, and measurable outcomes.'
            ]
          },
          {
            title: 'Setting Availability & Out-of-Office for freelancers',
            summary: 'Control your workload by setting weekly capacity hours, vacation mode, and custom project minimums.',
            steps: [
              'Toggle your availability status in your Talent Dashboard.',
              'Clients see your next available start date before submitting inquiries.'
            ]
          }
        ]
      },
      {
        id: 'talent-safety',
        title: 'Trust & Safety',
        icon: ShieldAlert,
        color: '#FF6B6B',
        description: 'Our Community Standards, strict off-platform communication policies, and scam protection.',
        articles: [
          {
            title: 'Our Community Standards & Freelancer Code',
            summary: 'Refeir is built on mutual fairness, intellectual property protection, and pan-African excellence. Learn our core guidelines.',
            steps: [
              'Deliver original work free of copyright infringement.',
              'Treat clients and scouts with professional respect and timely updates.',
              'Honor milestone commitments and agreed deliverables.'
            ]
          },
          {
            title: 'Avoiding spam and staying safe on Refeir',
            summary: 'Learn how to detect fraudulent briefs, fake payment receipts, phishing attempts, and suspicious download requests.',
            steps: [
              'Never share your password, 2FA codes, or personal banking credentials.',
              'Never download executable (.exe, .scr) files from unvetted project chats.',
              'Report suspicious proposals immediately using the Report button.'
            ]
          },
          {
            title: 'Reporting content or behavior on Refeir',
            summary: 'How to flag abusive messages, inappropriate requests, or bad-faith escrow cancellations for rapid trust & safety review.',
            steps: [
              'Click the 3-dots menu on any message or profile.',
              'Select "Report User / Brief" and provide a brief explanation.',
              'Our Trust & Safety team investigates and responds within 2 hours.'
            ]
          },
          {
            title: "Stay protected: Refeir’s strict off-platform communication policy",
            summary: 'Why all messaging, file transfers, and payments MUST remain on-platform — and the severe risks of taking conversations outside.',
            steps: [
              'Never take communications to WhatsApp, Telegram, Skype, or direct email.',
              'Refeir Trust Vault escrow ONLY protects work discussed and submitted inside the platform.',
              'Off-platform negotiations result in immediate forfeiture of escrow protection and permanent account suspension.'
            ],
            tips: 'Protect your hard work — keep 100% of chats and deliverables inside the Refeir Project Workspace.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // 2. FOR CLIENTS (EMPLOYERS)
  // ==========================================
  CLIENT: {
    role: 'CLIENT',
    roleLabel: 'Clients & Employers',
    badgeColor: 'var(--rf-mint)',
    description: 'Guidelines on posting briefs, finding top African talent, managing milestones in Trust Vault, and paying securely.',
    sections: [
      {
        id: 'client-security',
        title: 'Account Settings & Security',
        icon: Lock,
        color: '#2E7D32',
        description: 'Manage company credentials, team access, 2FA authentication, and verified business onboarding.',
        articles: [
          {
            title: 'Account access troubleshooting guide',
            summary: 'Solve login issues, password reset delays, SSO conflicts, and secure enterprise account recovery.',
            steps: [
              'Click "Forgot Password" on the login page.',
              'Enter your registered business email to receive an instant recovery link.',
              'If 2FA is lost, use your emergency recovery codes or contact Support Dispatch.'
            ]
          },
          {
            title: 'Creating your Refeir client account',
            summary: 'Set up your employer profile, add your company website, designate your business country, and invite team members.',
            steps: [
              'Register as a Client / Employer.',
              'Complete your company profile and specify your primary tech hiring needs.',
              'Link your preferred corporate payment method.'
            ],
            actionUrl: '/dashboard/client',
            actionLabel: 'Go to Client Dashboard'
          },
          {
            title: 'Managing your account & company settings',
            summary: 'Update company tax IDs, VAT registration numbers, default invoice currencies, and notification preferences.',
            steps: [
              'Go to Settings > Company & Billing Details.',
              'Add your registered business address and tax identification number.'
            ]
          },
          {
            title: 'Password, security question, and two-factor authentication',
            summary: 'Protect your escrow balances and payment methods with mandatory two-factor authentication.',
            steps: [
              'Enable 2FA in Settings > Security.',
              'Require team members to authenticate with TOTP before approving milestone releases.'
            ]
          },
          {
            title: 'Phone verification: Secure your Refeir account',
            summary: 'Verify your corporate mobile contact for critical payment authorizations and dispute escalation alerts.'
          }
        ]
      },
      {
        id: 'client-finding',
        title: 'Find a Freelancer',
        icon: Search,
        color: '#66BB2A',
        description: 'Post project briefs, browse verified tech catalogs, and collaborate with Scouts for talent sourcing.',
        articles: [
          {
            title: 'Post a project brief: Get tailored offers for your project',
            summary: 'Publish a job brief to receive curated proposals from Africa’s top software engineers, designers, and AI specialists.',
            steps: [
              'Click "Post a Job" or browse the Job Board.',
              'Describe your project scope, budget range, required tech stack, and timeline.',
              'Choose whether to allow open bids or recruit through dedicated Scouts.',
              'Review received proposals, portfolio samples, and scout endorsements.'
            ],
            tips: 'Jobs initiated via proposals split a low 5% client fee + 5% talent fee at the final milestone.',
            actionUrl: '/jobs',
            actionLabel: 'Post or Browse Jobs'
          },
          {
            title: 'How Refeir works for clients & hiring managers',
            summary: 'An end-to-end overview of our Trust Vault escrow protection, scout referral mechanism, and delivery workflows.',
            steps: [
              'Find talent or let scouts match you with vetted candidates.',
              'Fund project milestones securely into Trust Vault escrow.',
              'Review deliverables in the Project Workspace and approve payouts only when 100% satisfied.'
            ]
          },
          {
            title: 'Searching freelancers and services on Refeir: A Guide',
            summary: 'Filter talent by 54 African countries, technical expertise, hourly rate, spoken languages, and client reviews.',
            steps: [
              'Navigate to Marketplace or Regional Hubs.',
              'Use filters for Full-Stack Devs, Mobile Engineers, UI/UX, AI/ML, Cloud DevOps, and Product Managers.'
            ],
            actionUrl: '/marketplace',
            actionLabel: 'Explore Marketplace'
          },
          {
            title: 'Professions catalog for clients',
            summary: 'Explore pre-vetted skill specializations across software engineering, data science, creative design, and technical writing.'
          },
          {
            title: 'Using your inbox effectively',
            summary: 'Message candidates, schedule in-platform video interviews, and share project specifications securely.'
          }
        ]
      },
      {
        id: 'client-orders',
        title: 'Order Management',
        icon: CheckCircle2,
        color: '#4CAF50',
        description: 'Manage active contracts, milestone approvals, reviews, and escrow releases.',
        articles: [
          {
            title: 'The complete guide to your Refeir order: Statuses and process',
            summary: 'Understand order lifecycles: Pending Deposit, In Progress, In Review, Revision Requested, and Completed.',
            steps: [
              'Deposit milestone funds into Trust Vault to initiate work.',
              'Receive deliverable submissions directly in the Project Workspace.',
              'Request free revisions or approve work for instant payout release.'
            ],
            tips: 'You have 5 full business days to review any deliverable before funds are released.'
          },
          {
            title: 'Milestones & Trust Vault Escrow Protection',
            summary: 'Break large projects into manageable deliverables. Your funds remain in neutral custody until you approve the work.',
            steps: [
              'Structure contracts into Milestone 1, Milestone 2, Final Milestone.',
              'Fund milestones sequentially to minimize risk.',
              'Refeir holds funds securely under Tier-1 banking partners.'
            ]
          },
          {
            title: 'Leaving and managing reviews on Refeir',
            summary: 'Evaluate freelancer code quality, communication, and turnaround. Also leave recommendations for referring Scouts.',
            steps: [
              'Upon final milestone approval, submit your star rating and detailed written review.',
              'Your review boosts the talent’s reputation across the pan-African network.'
            ]
          },
          {
            title: 'Using the Resolution Center',
            summary: 'Request refunds, cancel delayed orders, or submit mediation requests with Refeir dispute arbitrators.',
            actionUrl: '/disputes',
            actionLabel: 'Access Dispute Center'
          }
        ]
      },
      {
        id: 'client-payments',
        title: 'Payments & Finances',
        icon: CreditCard,
        color: '#F6B21A',
        description: 'Multi-currency invoicing, credit cards, bank wires, setting Refeir as vendor, and fixing failed payments.',
        articles: [
          {
            title: 'Paying for orders, extras, or custom offers',
            summary: 'Pay securely using international Credit/Debit Cards, Google Pay, Apple Pay, Bank Transfers (ACH/SEPA/SWIFT), or USDT/USDC.',
            steps: [
              'Select your preferred currency (USD, EUR, GBP, NGN, KES, GHS, ZAR, etc.).',
              'Complete checkout via 256-bit encrypted payment gateways.',
              'Funds are credited to Trust Vault escrow immediately.'
            ]
          },
          {
            title: 'How to set Refeir as a corporate vendor',
            summary: 'Download our official Vendor Onboarding Kit, W-8BEN-E / Tax forms, Certificate of Incorporation, and banking details.',
            steps: [
              'Download the Vendor Packet from Billing Settings.',
              'Submit the packet to your corporate Accounts Payable department.',
              'Set up wire transfer authorizations directly into Refeir escrow accounts.'
            ]
          },
          {
            title: 'Adding and managing your Refeir payment methods',
            summary: 'Save company credit cards, set backup payment options, and manage authorized billing contacts.'
          },
          {
            title: 'Fixing a failed or duplicate payment',
            summary: 'Troubleshoot 3D Secure verification timeouts, card declines, bank authorization holds, and duplicate charge reversals.',
            steps: [
              'Check with your issuing bank if cross-border international e-commerce is enabled.',
              'Retry using an alternative card or direct wire transfer.',
              'Any duplicate charge authorizations drop off automatically within 24 hours.'
            ]
          },
          {
            title: 'Downloading, updating, and troubleshooting your Refeir invoices',
            summary: 'Generate monthly consolidated PDF invoices containing your company VAT/Tax ID, line-item breakdowns, and payment receipts.',
            actionUrl: '/wallet',
            actionLabel: 'View Invoices & Receipts'
          }
        ]
      },
      {
        id: 'client-features',
        title: 'Features & Programs',
        icon: Zap,
        color: '#7DA2FF',
        description: 'Referral rewards, enterprise agency matchmaking, and project briefs.',
        articles: [
          {
            title: "Refeir's client referral program",
            summary: 'Invite other hiring managers or partner companies to Refeir and earn platform credits on their first completed project.',
            steps: [
              'Copy your personal Client Referral Link from your dashboard.',
              'Share with hiring managers and founders in your network.',
              'Earn $100 in project credit when they complete their first hire.'
            ]
          },
          {
            title: 'AI Brief Assistant overview',
            summary: 'Use our built-in AI tool to generate professional scopes of work, technical requirements, and milestone breakdowns in seconds.'
          },
          {
            title: 'Hiring vetted African agency teams',
            summary: 'Engage full cross-functional development studios and design agencies for large-scale enterprise deliverables.',
            actionUrl: '/agencies',
            actionLabel: 'Browse Agencies'
          }
        ]
      },
      {
        id: 'client-safety',
        title: 'Trust & Safety',
        icon: ShieldAlert,
        color: '#FF6B6B',
        description: 'Client guidelines, preventing disintermediation, and feedback integrity.',
        articles: [
          {
            title: 'Our Community Standards & Employer Conduct',
            summary: 'Ensure fair treatment, timely milestone reviews, and respectful communications with all talent and scouts.'
          },
          {
            title: 'Avoiding spam and staying safe on Refeir',
            summary: 'Protect your proprietary project code, IP, and business assets from unverified third-party solicitations.'
          },
          {
            title: 'Reporting content or behavior on Refeir',
            summary: 'Flag freelancers who attempt fee evasion, submit plagiarized work, or breach NDA commitments.'
          },
          {
            title: "Stay protected: Refeir’s strict off-platform policy",
            summary: 'All project chat, deliverables, and payments MUST be conducted inside Refeir to maintain escrow safety.',
            steps: [
              'Never pay freelancers directly via PayPal, Wise, or personal crypto wallets.',
              'Refeir Trust Vault cannot protect or refund payments made off-platform.',
              'Violating off-platform payment rules leads to permanent ban and loss of commercial IP warranties.'
            ]
          },
          {
            title: 'Refeir reviews: Content guidelines and removal policy',
            summary: 'Learn about our zero-tolerance policy against fake reviews, review extortion, and defamation.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // 3. FOR SCOUTS (REFERRERS & TALENT CONNECTORS)
  // ==========================================
  SCOUT: {
    role: 'SCOUT',
    roleLabel: 'Scouts & Referrers',
    badgeColor: 'var(--rf-mint)',
    description: 'Learn how to scout top talent, share referral links, enjoy 0% forever fees, and earn Airfee Tokens.',
    sections: [
      {
        id: 'scout-verification',
        title: 'Account & Scout Verification',
        icon: Award,
        color: '#66BB2A',
        description: 'Get verified as an official Refeir Scout, climb scout tiers, and protect your account.',
        articles: [
          {
            title: 'Becoming a verified Refeir Scout',
            summary: 'Join our pan-African network of tech connectors, team leads, community managers, and engineering recruiters.',
            steps: [
              'Sign up as a Scout and complete your onboarding profile.',
              'Submit Tier-2 KYC verification to unlock multi-currency commission payouts.',
              'Receive your unique verified Scout badge and referral tracking link generator.'
            ],
            actionUrl: '/dashboard/scout',
            actionLabel: 'Go to Scout Dashboard'
          },
          {
            title: 'Scout Tier system: Junior, Senior, and Master Scout levels',
            summary: 'Advance across tiers by introducing active talent and hiring clients to unlock higher referral bonuses and VIP summits.',
            steps: [
              'Junior Scout: 1-5 successful referrals, standard dashboard access.',
              'Senior Scout: 6-20 referrals, priority client introductions, monthly Airfee Token bonus.',
              'Master Scout: 20+ referrals, revenue share pool access, country exclusivity opportunities.'
            ]
          },
          {
            title: 'Setting up two-factor authentication and wallet security',
            summary: 'Secure your scout commission withdrawals with hardware or app-based 2FA.'
          }
        ]
      },
      {
        id: 'scout-sourcing',
        title: 'Scout Sourcing & Matching',
        icon: Compass,
        color: '#4CAF50',
        description: 'How to scout vetted engineers, create custom referral links, and make client introductions.',
        articles: [
          {
            title: 'How scouting works: Finding and vetting tech talent',
            summary: 'Discover top freelance software developers, designers, and AI creators across your local tech community.',
            steps: [
              'Browse unrepresented or rising talent in the marketplace.',
              'Vouch for talent skills and endorse their specialized proficiencies.',
              'Help talent set optimal referral rates (recommend 10%).'
            ]
          },
          {
            title: 'Sharing your custom scout referral links',
            summary: 'Generate encrypted links (/r/CODE) for individual talent, specific services, or custom client project briefs.',
            steps: [
              'Click "Refer Talent" on any talent profile or service card.',
              'Copy your unique cryptographic referral URL.',
              'Share via LinkedIn, Twitter, developer WhatsApp groups, or direct client email.'
            ]
          },
          {
            title: 'Exclusive Client Introduction links for business onboarding',
            summary: 'Introduce employers, recruiters, and agencies to earn instant commissions on all their future platform hires.',
            steps: [
              'Copy your exclusive Client Intro link from your Scout Dashboard.',
              'When employers register, all their project milestone spend is attributed to your scout account.'
            ]
          }
        ]
      },
      {
        id: 'scout-commissions',
        title: 'Commissions & Referral Rules',
        icon: DollarSign,
        color: '#F6B21A',
        description: 'The 0% forever platform fee guarantee on ≤10% talent offers, Airfee tokens, and attribution windows.',
        articles: [
          {
            title: 'The 0% forever platform fee guarantee on ≤10% talent offers',
            summary: 'Refeir guarantees Scouts keep 100% of their earnings forever with 0% platform deduction on rates of 10% and below.',
            steps: [
              'When a talent sets a referral rate of 10% or less, Refeir takes 0% cut from the scout payout.',
              'If a talent offers a $5,000 contract at 10%, you receive the full $500 USD with zero deductions.'
            ],
            tips: 'Refeir never takes fees from fair talent referral offers.'
          },
          {
            title: 'How the 2% Airfee works on >10% offers and how to waive it',
            summary: 'If talent offers rates above 10% (e.g. 15% or 20%), a minor 2% Airfee applies unless waived with an Airfee Token.',
            steps: [
              'Example: 15% commission on $1,000 project = $150 total. A 2% fee ($3) applies unless waived.',
              'Use an active Airfee Token to eliminate this fee completely for the entire month.'
            ]
          },
          {
            title: 'Earning and redeeming monthly Airfee Tokens',
            summary: 'Verified Scouts earn 1 free Airfee Token every month simply by introducing a new business client to Refeir.',
            steps: [
              'Share your Client Intro link with 1 company each month.',
              'Upon client registration, your Airfee Token is auto-credited to your account.',
              'Waives all fees on high-tier referrals for 30 consecutive days.'
            ]
          },
          {
            title: 'Cryptographic 30-180 day referral attribution windows',
            summary: 'Your scout referrals are cryptographically locked for 30 to 180 days across repeated client contracts.'
          }
        ]
      },
      {
        id: 'scout-payouts',
        title: 'Multi-Currency Payouts & Wallet',
        icon: Wallet,
        color: '#7DA2FF',
        description: 'Instant commission deposits, Bank transfers, M-Pesa, MTN MoMo, and USDT stablecoins.',
        articles: [
          {
            title: 'Your Scout commission dashboard & analytics',
            summary: 'Track live clicks, converted hires, in-flight milestone escrows, and cleared commission balances in real-time.',
            actionUrl: '/dashboard/scout',
            actionLabel: 'Open Scout Dashboard'
          },
          {
            title: 'Instant withdrawals to local Banks, M-Pesa, MTN MoMo, and Stablecoins',
            summary: 'Withdraw earnings in your local African currency or USDT stablecoins with 60-second instant settlement.',
            steps: [
              'Go to Wallet > Withdraw.',
              'Select Mobile Money (M-Pesa, MTN, Airtel, Orange) or Direct Bank Account.',
              'Confirm 2FA security code to execute the transfer.'
            ]
          },
          {
            title: 'Automatic milestone deposit releases',
            summary: 'Commission funds are released immediately into your wallet the exact second a client signs off on a milestone deliverable.'
          }
        ]
      },
      {
        id: 'scout-tools',
        title: 'Scout Tools & Community',
        icon: Users,
        color: '#2E7D32',
        description: 'Leaderboards, Scout Meetups, promotional toolkits, and regional developer summits.',
        articles: [
          {
            title: 'Pan-African Scout Leaderboard & quarterly bonus pools',
            summary: 'Top 10 performing scouts every quarter share a $25,000 USD performance pool and receive Refeir swag & hardware grants.',
            actionUrl: '/scouts',
            actionLabel: 'View Scouts Network'
          },
          {
            title: 'Scout community hubs, meetups, and developer summits',
            summary: 'Join local Refeir Scout chapters in Lagos, Nairobi, Accra, Kigali, Cape Town, and Cairo.'
          },
          {
            title: 'Scout promotional toolkits and social templates',
            summary: 'Download verified badges, pitch decks, client proposal templates, and talent evaluation rubrics.'
          }
        ]
      },
      {
        id: 'scout-safety',
        title: 'Trust, Ethics & Platform Safety',
        icon: ShieldAlert,
        color: '#FF6B6B',
        description: 'Scout Code of Conduct, anti-spam rules, and verified reputation scores.',
        articles: [
          {
            title: 'Scout Code of Ethics & Quality Standards',
            summary: 'Only recommend talent whose technical skills or portfolio you have genuinely reviewed and vetted.'
          },
          {
            title: 'Avoiding spammy referrals and unvetted recommendations',
            summary: 'Accounts found spamming untargeted referral links across public forums without context are flagged.'
          },
          {
            title: 'Enforcing in-platform project management & escrow rules',
            summary: 'Scouts help ensure clients and talent keep all project discussions on Refeir to preserve escrow safety.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // 4. FOR REFEIR PRO (ENTERPRISE)
  // ==========================================
  PRO: {
    role: 'PRO',
    roleLabel: 'Refeir Pro Users',
    badgeColor: '#F4B942',
    description: 'Enterprise project workspaces, dedicated technical project managers, legal compliance, and consolidated billing.',
    sections: [
      {
        id: 'pro-account',
        title: 'Account Settings & Security',
        icon: Building2,
        color: '#F4B942',
        description: 'Enterprise team roles, seat permissions, SSO integration, and subscription tiers.',
        articles: [
          {
            title: 'Creating your Refeir Pro account',
            summary: 'Onboard your enterprise or scale-up company with multi-user permissions, customized procurement, and dedicated support.',
            steps: [
              'Request Pro access or upgrade your existing client account.',
              'Designate billing administrators, hiring managers, and project observers.',
              'Activate Single Sign-On (SAML/Okta) for team members.'
            ],
            actionUrl: '/business',
            actionLabel: 'Explore Refeir Pro'
          },
          {
            title: 'Team account roles, permission levels, and seat management',
            summary: 'Assign Admin, Hiring Manager, Financial Approver, and Member roles with customized escrow spending limits.',
            steps: [
              'Open Pro Settings > Team Members.',
              'Invite colleagues via corporate email domain.',
              'Set monthly project budget approvals per manager.'
            ]
          },
          {
            title: 'Refeir Pro subscription plans and pricing',
            summary: 'Compare Pro Growth, Scale, and Enterprise plans with zero client service fees and dedicated talent concierges.'
          }
        ]
      },
      {
        id: 'pro-tools',
        title: 'Communication & Project Tools',
        icon: MessageCircle,
        color: '#7DA2FF',
        description: 'Team inboxes, integrated Zoom conferencing, multi-team workspaces, and internal comments.',
        articles: [
          {
            title: 'Using your shared team inbox effectively',
            summary: 'Collaborate with colleagues on candidate screening, joint technical reviews, and milestone sign-offs in one shared thread.',
            steps: [
              'Tag team members using @mentions inside project chats.',
              'Leave private internal notes invisible to the freelancer.',
              'Share interview transcripts and code review notes.'
            ]
          },
          {
            title: 'Integrated secure video conferencing (Zoom / Google Meet)',
            summary: 'Conduct in-platform technical interviews and weekly sprint standups without exchanging personal contact info.'
          },
          {
            title: 'Using workspace projects to organize orders and team collaboration',
            summary: 'Group related milestone contracts under unified department initiatives, epics, and product releases.'
          }
        ]
      },
      {
        id: 'pro-orders',
        title: 'Enterprise Orders & Managed Talent',
        icon: Crown,
        color: '#66BB2A',
        description: 'Top 1% technical talent, dedicated Project Managers, hourly contracts, and quality guarantees.',
        articles: [
          {
            title: 'How to find and match with top 1% talent on Refeir Pro',
            summary: 'Access Africa’s top senior software engineers, principal architects, and AI researchers pre-vetted through technical testing.',
            steps: [
              'Submit an enterprise talent request to your dedicated Refeir Pro Concierge.',
              'Receive 3 curated candidate dossiers with recorded code audits within 24 hours.',
              'Start risk-free trial milestones immediately.'
            ]
          },
          {
            title: 'Dedicated Refeir Pro Project Managers for end-to-end execution',
            summary: 'Let an experienced Refeir technical project manager oversee sprints, QA reviews, and milestone deliveries.'
          },
          {
            title: 'Hourly contracts vs fixed milestone escrow orders',
            summary: 'Choose flexible automated hourly billing with activity logs or fixed milestone contracts with Trust Vault protection.'
          },
          {
            title: 'Refeir Pro 100% Satisfaction & Quality Guarantee',
            summary: 'If a Pro talent does not meet agreed project requirements within the first 14 days, Refeir replaces the talent at zero cost.'
          }
        ]
      },
      {
        id: 'pro-compliance',
        title: 'Features, Compliance & Audits',
        icon: Scale,
        color: '#2E7D32',
        description: 'Background checks, enterprise NDAs, IP assignment, and cross-border contractor tax shield.',
        articles: [
          {
            title: 'Rigorous talent background checks and vetting tiers',
            summary: 'Review verified ID credentials, criminal background screenings, education verifications, and past client audits.'
          },
          {
            title: 'Standardized enterprise Master Services Agreements (MSAs) & NDAs',
            summary: 'Execute customized corporate contracts and intellectual property assignment deeds with automatic digital signatures.'
          },
          {
            title: 'Cross-border contractor classification audits & tax shield',
            summary: 'Eliminate misclassification risks across 54 African countries with automated local labor law compliance.'
          }
        ]
      },
      {
        id: 'pro-billing',
        title: 'Payments & Consolidated Billing',
        icon: Wallet,
        color: '#F6B21A',
        description: 'Consolidated monthly invoicing, Net-30 terms, corporate wire deposits, and tax reporting.',
        articles: [
          {
            title: 'Consolidated monthly enterprise invoicing in USD, EUR, GBP, or local currencies',
            summary: 'Receive a single, unified monthly tax invoice covering all active contractors, teams, and milestone spend.',
            steps: [
              'Download itemized monthly statements for corporate accounting.',
              'Integrate directly with ERP systems (NetSuite, QuickBooks, Xero).'
            ]
          },
          {
            title: 'Corporate credit lines & Net-30 payment terms',
            summary: 'Qualified enterprise clients can pay via Net-30 purchase orders and corporate wire transfers.'
          },
          {
            title: 'Troubleshooting purchase orders and wire reconciliations',
            summary: 'Direct line to your dedicated enterprise billing specialist for rapid payment reconciliation.'
          }
        ]
      },
      {
        id: 'pro-safety',
        title: 'Enterprise Trust & Safety',
        icon: ShieldAlert,
        color: '#FF6B6B',
        description: 'Enterprise Data Protection (GDPR / NDPR), SOC2 compliance, and audit logs.',
        articles: [
          {
            title: 'Enterprise Data Protection (GDPR & African Data Privacy Compliance)',
            summary: 'All project data, code repositories, and communications are encrypted in transit and at rest in certified data centers.'
          },
          {
            title: 'SOC2-ready security infrastructure and audit logs',
            summary: 'Export complete activity logs, user logins, permission changes, and escrow transaction histories for compliance audits.'
          },
          {
            title: 'Zero-tolerance anti-disintermediation enforcement & IP indemnification',
            summary: 'Enjoy comprehensive $1,000,000 USD intellectual property indemnification on all work delivered through Refeir Pro.'
          }
        ]
      }
    ]
  }
};
