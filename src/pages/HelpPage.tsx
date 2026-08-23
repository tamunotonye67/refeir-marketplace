import React, { useState, useMemo } from 'react';
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
  Sparkles,
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
import { useTheme } from '../context/ThemeContext';

interface HelpPageProps {
  onNavigate?: (path: string) => void;
}

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
        icon: Sparkles,
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
        icon: Sparkles,
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

export const HelpPage: React.FC<HelpPageProps> = ({ onNavigate = () => {} }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<HelpRoleCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<{
    role: string;
    sectionTitle: string;
    article: HelpTopicArticle;
  } | null>(null);

  const [selectedSectionModal, setSelectedSectionModal] = useState<{
    role: string;
    section: HelpCategorySection;
  } | null>(null);

  // Flatten all articles for search
  const allArticlesList = useMemo(() => {
    const list: {
      role: HelpRoleCategory;
      roleLabel: string;
      sectionId: string;
      sectionTitle: string;
      sectionColor: string;
      article: HelpTopicArticle;
    }[] = [];

    (Object.keys(HELP_DIRECTORIES) as (keyof typeof HELP_DIRECTORIES)[]).forEach(roleKey => {
      const dir = HELP_DIRECTORIES[roleKey];
      dir.sections.forEach(section => {
        section.articles.forEach(art => {
          list.push({
            role: roleKey,
            roleLabel: dir.roleLabel,
            sectionId: section.id,
            sectionTitle: section.title,
            sectionColor: section.color,
            article: art
          });
        });
      });
    });

    return list;
  }, []);

  // Filter based on search and activeCategory
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();

    return allArticlesList.filter(item => {
      const matchesCategory = activeCategory === 'ALL' || item.role === activeCategory;
      const matchesSearch =
        item.article.title.toLowerCase().includes(query) ||
        item.article.summary.toLowerCase().includes(query) ||
        item.sectionTitle.toLowerCase().includes(query) ||
        item.roleLabel.toLowerCase().includes(query) ||
        (item.article.steps && item.article.steps.some(s => s.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, allArticlesList]);

  // Active directory to display when not in full search results
  const currentDirectories = useMemo(() => {
    if (activeCategory === 'ALL') {
      return Object.values(HELP_DIRECTORIES);
    }
    return [HELP_DIRECTORIES[activeCategory]];
  }, [activeCategory]);

  return (
    <div style={{ paddingBottom: '6rem', minHeight: '100vh', background: 'var(--rf-bg-base)' }}>
      {/* ── HERO BANNER with transparent background image ── */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '340px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '2.5rem'
        }}
      >
        {/* Background image */}
        <img
          src="/help_center_hero.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            opacity: 0.45
          }}
        />

        {/* Transparent gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(7,22,13,0.65) 0%, rgba(7,22,13,0.3) 50%, rgba(7,22,13,0.85) 100%)'
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '4rem 1.5rem 3.5rem',
            maxWidth: '820px',
            width: '100%'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--rf-leaf-green)',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '1rem',
              background: 'rgba(102, 187, 42, 0.18)',
              border: '1px solid rgba(102, 187, 42, 0.35)',
              padding: '0.35rem 0.95rem',
              borderRadius: '100px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <HelpCircle size={15} />
            <span>KNOWLEDGE BASE &amp; SUPPORT DIRECTORY</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 5vw, 3.1rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              textShadow: '0 2px 20px rgba(0,0,0,0.6)',
              marginBottom: '1rem'
            }}
          >
            How can we help you today?
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.88)',
              fontSize: '1.0625rem',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.65,
              textShadow: '0 1px 8px rgba(0,0,0,0.5)'
            }}
          >
            Official guides, policies, troubleshooting, and answers for Talents, Clients, Scouts, and Refeir Pro members.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="rf-container" style={{ maxWidth: '1180px' }}>
        {/* Prominent Search Box */}
        <div
          style={{
            position: 'relative',
            maxWidth: '740px',
            margin: '0 auto 2.5rem auto',
            zIndex: 2
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF',
              border: '2px solid rgba(102, 187, 42, 0.45)',
              borderRadius: 'var(--rf-radius-full)',
              padding: '0.45rem 0.75rem 0.45rem 1.35rem',
              boxShadow: '0 14px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(102, 187, 42, 0.12)'
            }}
          >
            <Search size={22} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginRight: '0.85rem' }} />
            <input
              type="text"
              placeholder="Search topics (e.g. 0% scout fee, milestone escrow, 2FA, create a gig, dispute, early payout)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                fontSize: '0.98rem',
                fontWeight: 500
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDark ? 'var(--rf-slate-400)' : '#527560',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  marginRight: '0.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Clear Search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Role Category Toggles */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem'
          }}
        >
          {[
            { id: 'ALL', label: 'All Roles', icon: BookOpen },
            { id: 'TALENT', label: 'For Talents', icon: Briefcase },
            { id: 'CLIENT', label: 'For Clients', icon: ShieldCheck },
            { id: 'SCOUT', label: 'For Scouts', icon: Ticket },
            { id: 'PRO', label: 'Refeir Pro', icon: Sparkles }
          ].map(({ id, label, icon: Icon }) => {
            const isActive = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id as HelpRoleCategory)}
                style={{
                  padding: '0.7rem 1.35rem',
                  borderRadius: 'var(--rf-radius-full)',
                  border: isActive
                    ? id === 'PRO' ? '1.5px solid #F4B942' : '1.5px solid var(--rf-leaf-green)'
                    : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                  background: isActive
                    ? id === 'PRO'
                      ? 'linear-gradient(135deg, rgba(244, 185, 66, 0.25), rgba(229, 160, 36, 0.15))'
                      : 'linear-gradient(135deg, rgba(102, 187, 42, 0.25), rgba(46, 125, 50, 0.15))'
                    : isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                  color: isActive
                    ? id === 'PRO' ? '#F4B942' : 'var(--rf-leaf-green)'
                    : isDark ? 'var(--rf-slate-300)' : '#2D4A38',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
                }}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Access Channels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
          {[
            { icon: MessageCircle, label: 'Live Support Desk', sub: 'Chat with Support Leads', path: '/contact', color: 'var(--rf-leaf-green)' },
            { icon: Headphones, label: 'Refeir Desk Concierge', sub: 'Dedicated hiring support', path: '/dashboard/client', color: '#7DA2FF' },
            { icon: Ticket, label: 'Airfee Token Hub', sub: 'Waive scout referral fees', path: '/dashboard/scout', color: '#F4B942' },
            { icon: ShieldCheck, label: 'Dispute Arbitration', sub: '72-hour escrow mediation', path: '/disputes', color: '#FF6B6B' }
          ].map(({ icon: Icon, label, sub, path, color }) => (
            <button
              key={label}
              onClick={() => onNavigate(path)}
              className="rf-card rf-card-interactive"
              style={{
                padding: '1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                border: isDark ? '1px solid var(--rf-navy-border)' : '1px solid rgba(0, 0, 0, 0.08)',
                background: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF',
                borderRadius: 'var(--rf-radius-lg)'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--rf-radius-md)',
                  background: `${color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: color,
                  flexShrink: 0,
                  marginTop: '1px'
                }}
              >
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', fontSize: '0.9rem', lineHeight: 1.3 }}>{label}</div>
                <div style={{ fontSize: '0.78rem', color: isDark ? 'var(--rf-slate-400)' : '#527560', marginTop: '4px', lineHeight: 1.4 }}>{sub}</div>
              </div>
              <ChevronRight size={16} color="var(--rf-slate-400)" style={{ marginTop: '3px' }} />
            </button>
          ))}
        </div>

        {/* ── SEARCH RESULTS VIEW (when search query is active) ── */}
        {filteredSearchResults !== null ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', margin: 0 }}>
                Search Results for "{searchQuery}"
              </h2>
              <span style={{ fontSize: '0.875rem', color: isDark ? 'var(--rf-slate-400)' : '#527560' }}>
                Found <strong>{filteredSearchResults.length}</strong> matching articles
              </span>
            </div>

            {filteredSearchResults.length === 0 ? (
              <div
                className="rf-card"
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  background: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF'
                }}
              >
                <HelpCircle size={48} color="var(--rf-slate-400)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', marginBottom: '0.5rem' }}>
                  No articles found
                </h3>
                <p style={{ color: isDark ? 'var(--rf-slate-400)' : '#527560', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
                  Try different keywords, or browse through the categorized sections below.
                </p>
                <button onClick={() => setSearchQuery('')} className="rf-btn rf-btn-secondary">
                  Clear Search
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {filteredSearchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="rf-card rf-card-interactive"
                    onClick={() =>
                      setSelectedArticle({
                        role: item.roleLabel,
                        sectionTitle: item.sectionTitle,
                        article: item.article
                      })
                    }
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF',
                      border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '100px',
                            background: `${item.sectionColor}18`,
                            color: item.sectionColor,
                            border: `1px solid ${item.sectionColor}30`
                          }}
                        >
                          {item.roleLabel}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: isDark ? 'var(--rf-slate-400)' : '#527560' }}>
                          • {item.sectionTitle}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                          lineHeight: 1.4,
                          marginBottom: '0.5rem'
                        }}
                      >
                        {item.article.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: isDark ? 'var(--rf-slate-300)' : '#4A6B56',
                          lineHeight: 1.55,
                          marginBottom: '1rem'
                        }}
                      >
                        {item.article.summary}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rf-leaf-green)', fontSize: '0.8rem', fontWeight: 800 }}>
                      <span>Read Full Guide</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── CATEGORIZED DIRECTORY VIEW (For Talents, Clients, Scouts, Pro) ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {currentDirectories.map(dir => (
              <div key={dir.role} id={`role-${dir.role}`}>
                {/* Role Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '100px',
                          background: `${dir.badgeColor}20`,
                          color: dir.badgeColor,
                          border: `1px solid ${dir.badgeColor}40`
                        }}
                      >
                        {dir.roleLabel}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', margin: '0.25rem 0 0.5rem' }}>
                      {dir.roleLabel} Help &amp; Support Hub
                    </h2>
                    <p style={{ color: isDark ? 'var(--rf-slate-300)' : '#4A6B56', fontSize: '0.95rem', maxWidth: '680px', margin: 0, lineHeight: 1.5 }}>
                      {dir.description}
                    </p>
                  </div>
                </div>

                {/* 6 Category Cards Grid for this role */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '1.5rem'
                  }}
                >
                  {dir.sections.map((sec, secIdx) => {
                    const IconComponent = sec.icon;
                    return (
                      <div
                        key={sec.id}
                        className="rf-card"
                        style={{
                          padding: '1.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          background: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF',
                          border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid rgba(0, 0, 0, 0.08)',
                          borderRadius: 'var(--rf-radius-xl)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                      >
                        <div>
                          {/* Card Icon & Number Header */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1.25rem' }}>
                            <div
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: `${sec.color}18`,
                                border: `1px solid ${sec.color}35`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: sec.color,
                                flexShrink: 0,
                                marginTop: '1px'
                              }}
                            >
                              <IconComponent size={22} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: sec.color, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
                                Section {secIdx + 1}
                              </div>
                              <h3
                                style={{
                                  fontSize: '1.15rem',
                                  fontWeight: 800,
                                  color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                                  margin: 0,
                                  lineHeight: 1.3
                                }}
                              >
                                {sec.title}
                              </h3>
                            </div>
                          </div>

                          {/* Articles List */}
                          <ul
                            style={{
                              listStyle: 'none',
                              padding: 0,
                              margin: '0 0 1.5rem 0',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.65rem'
                            }}
                          >
                            {sec.articles.map((art, aIdx) => (
                              <li key={aIdx}>
                                <button
                                  onClick={() =>
                                    setSelectedArticle({
                                      role: dir.roleLabel,
                                      sectionTitle: sec.title,
                                      article: art
                                    })
                                  }
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    color: isDark ? 'var(--rf-slate-200)' : '#1F3A2B',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.45,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.5rem',
                                    width: '100%',
                                    fontWeight: 500,
                                    transition: 'color 0.15s ease'
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--rf-leaf-green)')}
                                  onMouseLeave={e => (e.currentTarget.style.color = isDark ? 'var(--rf-slate-200)' : '#1F3A2B')}
                                >
                                  <span style={{ color: 'var(--rf-leaf-green)', fontSize: '0.8rem', marginTop: '2px' }}>•</span>
                                  <span style={{ flex: 1 }}>{art.title}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* "See all articles" Action Button under each card */}
                        <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                          <button
                            onClick={() => setSelectedSectionModal({ role: dir.roleLabel, section: sec })}
                            className="rf-btn rf-btn-outline"
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              padding: '0.55rem 1rem',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              borderRadius: 'var(--rf-radius-md)',
                              color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                              gap: '0.4rem'
                            }}
                          >
                            <span>See all articles ({sec.articles.length})</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── POPULAR ARTICLES SECTION (Contextual for Active Role / Profile) ── */}
        <div style={{ marginTop: '5rem', marginBottom: '4.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: 'var(--rf-leaf-green)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                  background: 'rgba(102, 187, 42, 0.1)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '100px',
                  border: '1px solid rgba(102, 187, 42, 0.25)'
                }}
              >
                <Zap size={13} />
                <span>TOP READS &amp; TRENDING GUIDES</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', margin: 0 }}>
                Popular Articles {activeCategory !== 'ALL' ? `for ${activeCategory === 'TALENT' ? 'Talents' : activeCategory === 'CLIENT' ? 'Clients' : activeCategory === 'SCOUT' ? 'Scouts' : 'Refeir Pro'}` : ''}
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: isDark ? 'var(--rf-slate-400)' : '#527560' }}>
              Frequently referenced by {activeCategory === 'TALENT' ? 'freelancers' : activeCategory === 'CLIENT' ? 'employers' : activeCategory === 'SCOUT' ? 'scouts' : activeCategory === 'PRO' ? 'enterprise teams' : 'the community'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
            {(activeCategory === 'TALENT'
              ? [
                  {
                    title: 'How the 100% Trust Vault Milestone Escrow Works',
                    summary: 'Learn how your deliverables and funds are protected from non-payment before starting work.',
                    readTime: '4 min read',
                    views: '18.4k views',
                    icon: ShieldCheck,
                    color: '#66BB2A',
                    role: 'Talent & Freelancers',
                    sectionTitle: 'Order Management',
                    article: {
                      title: 'How the 100% Trust Vault Milestone Escrow Works',
                      summary: 'All project milestones on Refeir require 100% upfront escrow deposit by the client into the neutral Trust Vault before work begins.',
                      steps: [
                        'Confirm project milestone displays "Escrow Funded" in Project Workspace.',
                        'Submit deliverables directly through the workspace with file attachments or repository links.',
                        'The client has 5 business days to review; once approved, funds release instantly to your multi-currency wallet.'
                      ],
                      tips: 'Never begin work on a milestone that is unbonded or shows "Pending Deposit".',
                      actionUrl: '/dashboard/talent',
                      actionLabel: 'Check My Project Escrows'
                    }
                  },
                  {
                    title: 'Setting a 10% Referral Rate for 4x More Scout Recommendations',
                    summary: 'Why talents offering a 10% rate get promoted across 12+ markets with 0% platform deductions.',
                    readTime: '3 min read',
                    views: '14.2k views',
                    icon: Award,
                    color: '#4CAF50',
                    role: 'Talent & Freelancers',
                    sectionTitle: 'Pitching on Refeir',
                    article: {
                      title: 'Setting a 10% Referral Rate for 4x More Scout Recommendations',
                      summary: 'Refeir guarantees Scouts keep 100% of their commission with 0% platform fees on talent offers of 10% and below.',
                      steps: [
                        'Open Profile Settings and locate Scout Referral Rate.',
                        'Set your rate to 10% to ensure scouts pay zero fees when recommending you.',
                        'Scouts pitch your profile directly to verified client job briefs.'
                      ],
                      actionUrl: '/account/profile',
                      actionLabel: 'Update Referral Rate'
                    }
                  },
                  {
                    title: 'Instant Multi-Currency Payouts to Bank, M-Pesa & MoMo',
                    summary: 'Complete guide to withdrawing earnings in local African currencies and USDT stablecoins.',
                    readTime: '5 min read',
                    views: '12.9k views',
                    icon: Wallet,
                    color: '#F6B21A',
                    role: 'Talent & Freelancers',
                    sectionTitle: 'Withdrawals & Finances',
                    article: {
                      title: 'Instant Multi-Currency Payouts to Bank, M-Pesa & MoMo',
                      summary: 'Refeir connects with local banking switches and Mobile Money networks across 54 African nations for sub-minute settlements.',
                      steps: [
                        'Navigate to Wallet and click "Withdraw Funds".',
                        'Choose between Direct Bank Account, M-Pesa, MTN MoMo, Airtel Money, or USDT.',
                        'Authorize the transfer with your 2FA OTP code.'
                      ],
                      actionUrl: '/wallet',
                      actionLabel: 'Go to Wallet'
                    }
                  },
                  {
                    title: 'Stay Protected: Why Off-Platform Messaging Forfeits Escrow',
                    summary: 'Understand the risks of taking client chats to WhatsApp or Telegram and how to stay 100% safe.',
                    readTime: '3 min read',
                    views: '21.5k views',
                    icon: ShieldAlert,
                    color: '#FF6B6B',
                    role: 'Talent & Freelancers',
                    sectionTitle: 'Trust & Safety',
                    article: {
                      title: 'Stay Protected: Why Off-Platform Messaging Forfeits Escrow',
                      summary: 'Refeir Trust Vault escrow and dispute protection ONLY cover communications and files submitted inside the platform.',
                      steps: [
                        'Keep 100% of messaging, file deliveries, and revision notes inside Refeir chat.',
                        'Never accept direct payments via wire, PayPal, or personal crypto outside Refeir.',
                        'Report any client requesting off-platform payments to Support Dispatch.'
                      ],
                      tips: 'Off-platform transactions lead to permanent account suspension and total loss of escrow coverage.'
                    }
                  }
                ]
              : activeCategory === 'CLIENT'
              ? [
                  {
                    title: 'How to Post a High-Converting Brief & Receive Top Talent',
                    summary: 'Craft clear project scopes, set realistic milestone budgets, and receive curated proposals within hours.',
                    readTime: '4 min read',
                    views: '16.8k views',
                    icon: Search,
                    color: '#66BB2A',
                    role: 'Clients & Employers',
                    sectionTitle: 'Find a Freelancer',
                    article: {
                      title: 'How to Post a High-Converting Brief & Receive Top Talent',
                      summary: 'A well-structured brief attracts top-tier senior engineers and vetted pan-African development agencies.',
                      steps: [
                        'Click "Post a Job" and detail your deliverables, timeline, and tech stack.',
                        'Set fixed milestone milestones to attract verified talent.',
                        'Review incoming proposals and scout recommendations in your project dashboard.'
                      ],
                      actionUrl: '/jobs',
                      actionLabel: 'Post a Brief'
                    }
                  },
                  {
                    title: 'Milestones & Your 5-Day Deliverable Inspection Guarantee',
                    summary: 'How Trust Vault protects your funds until you test and approve milestone deliverables.',
                    readTime: '3 min read',
                    views: '13.4k views',
                    icon: CheckCircle2,
                    color: '#2E7D32',
                    role: 'Clients & Employers',
                    sectionTitle: 'Order Management',
                    article: {
                      title: 'Milestones & Your 5-Day Deliverable Inspection Guarantee',
                      summary: 'Clients have 5 full business days to inspect, test code, and request revisions before funds release.',
                      steps: [
                        'Review submitted files and repository pull requests in the Project Workspace.',
                        'Click "Request Revision" if anything does not match the agreed brief.',
                        'Approve the milestone to release payout only when 100% satisfied.'
                      ]
                    }
                  },
                  {
                    title: 'Setting Up Refeir as an Approved Corporate Vendor',
                    summary: 'Download our official Vendor Packet, W-8BEN-E, and tax registration for accounts payable.',
                    readTime: '4 min read',
                    views: '10.1k views',
                    icon: CreditCard,
                    color: '#F6B21A',
                    role: 'Clients & Employers',
                    sectionTitle: 'Payments & Finances',
                    article: {
                      title: 'Setting Up Refeir as an Approved Corporate Vendor',
                      summary: 'Refeir provides comprehensive vendor onboarding documentation for corporate procurement departments.',
                      steps: [
                        'Download the Vendor Onboarding Packet from Billing Settings.',
                        'Submit banking SWIFT/ACH routing and W-8BEN-E forms to your accounting team.',
                        'Pay invoices via corporate wire, credit card, or ACH transfer.'
                      ]
                    }
                  },
                  {
                    title: 'Proposal-Based Job Fees: 5% Client + 5% Talent Split',
                    summary: 'Transparent breakdown of the 5% + 5% platform fee structure on open proposal contracts.',
                    readTime: '3 min read',
                    views: '15.6k views',
                    icon: DollarSign,
                    color: '#7DA2FF',
                    role: 'Clients & Employers',
                    sectionTitle: 'Payments & Finances',
                    article: {
                      title: 'Proposal-Based Job Fees: 5% Client + 5% Talent Split',
                      summary: 'For jobs initiated via proposals (where talent applies directly), Refeir charges a minimal 5% fee to the client and 5% to the talent at the final milestone.',
                      steps: [
                        'No upfront subscription or posting fees.',
                        'Fee is split equally upon final milestone completion.',
                        'All escrow custody and dispute mediation is included at zero extra cost.'
                      ],
                      actionUrl: '/pricing',
                      actionLabel: 'View Pricing Breakdown'
                    }
                  }
                ]
              : activeCategory === 'SCOUT'
              ? [
                  {
                    title: 'The 0% Forever Fee Guarantee on ≤10% Talent Offers',
                    summary: 'Keep 100% of your earnings forever with zero platform deduction on talent offers of 10% and below.',
                    readTime: '4 min read',
                    views: '24.1k views',
                    icon: Award,
                    color: '#66BB2A',
                    role: 'Scouts & Referrers',
                    sectionTitle: 'Commissions & Referral Rules',
                    article: {
                      title: 'The 0% Forever Fee Guarantee on ≤10% Talent Offers',
                      summary: 'Refeir guarantees Scouts keep 100% of all referral proceeds forever on talent offer rates of 10% and below.',
                      steps: [
                        'Find talent offering 10% or less in custom referral rates.',
                        'Share your unique scout referral link with hiring clients.',
                        'Earn full commissions with 0% platform deductions upon milestone completion.'
                      ],
                      actionUrl: '/dashboard/scout',
                      actionLabel: 'Go to Scout Dashboard'
                    }
                  },
                  {
                    title: 'How to Earn and Redeem Monthly Airfee Tokens',
                    summary: 'Eliminate the 2% fee on high-tier talent offers (>10%) by introducing local businesses.',
                    readTime: '3 min read',
                    views: '17.3k views',
                    icon: Ticket,
                    color: '#F6B21A',
                    role: 'Scouts & Referrers',
                    sectionTitle: 'Commissions & Referral Rules',
                    article: {
                      title: 'How to Earn and Redeem Monthly Airfee Tokens',
                      summary: 'Verified Scouts earn 1 free Airfee Token every month by using their Client Intro link to invite a local company.',
                      steps: [
                        'Copy your Client Introduction link from your Scout Dashboard.',
                        'Invite a local business, agency, or startup to Refeir.',
                        'Receive an instant Airfee Token crediting 30 days of 0% fees on all high-tier referrals.'
                      ]
                    }
                  },
                  {
                    title: 'Client Introduction Links: Lifetime Spend Attribution',
                    summary: 'How bringing employers onto Refeir earns you recurring commissions on all their future hires.',
                    readTime: '5 min read',
                    views: '15.8k views',
                    icon: Compass,
                    color: '#4CAF50',
                    role: 'Scouts & Referrers',
                    sectionTitle: 'Scout Sourcing & Matching',
                    article: {
                      title: 'Client Introduction Links: Lifetime Spend Attribution',
                      summary: 'When a client registers through your exclusive link, their hiring activity is attributed to your scout profile for ongoing rewards.',
                      steps: [
                        'Share your exclusive Client Intro link with hiring managers.',
                        'Track client registration and job brief publications in your dashboard.',
                        'Receive automated commission deposits as milestones complete.'
                      ]
                    }
                  },
                  {
                    title: 'Instant Commission Withdrawals in 54 African Currencies',
                    summary: 'Withdraw scout payouts to Bank, M-Pesa, MTN MoMo, and Stablecoins within 60 seconds.',
                    readTime: '3 min read',
                    views: '13.1k views',
                    icon: Wallet,
                    color: '#7DA2FF',
                    role: 'Scouts & Referrers',
                    sectionTitle: 'Multi-Currency Payouts & Wallet',
                    article: {
                      title: 'Instant Commission Withdrawals in 54 African Currencies',
                      summary: 'Scouts enjoy instant automated payouts directly to commercial banks, Mobile Money wallets, or USDT.',
                      steps: [
                        'Navigate to Wallet > Commission Balance.',
                        'Select payout method and confirm exchange rate.',
                        'Funds arrive within 60 seconds.'
                      ],
                      actionUrl: '/wallet',
                      actionLabel: 'Open Wallet'
                    }
                  }
                ]
              : activeCategory === 'PRO'
              ? [
                  {
                    title: 'Refeir Pro 100% Satisfaction & 14-Day Replacement Guarantee',
                    summary: 'Enterprise risk-free hiring: trial senior engineers with a full 14-day replacement guarantee.',
                    readTime: '4 min read',
                    views: '11.5k views',
                    icon: Sparkles,
                    color: '#F4B942',
                    role: 'Refeir Pro Users',
                    sectionTitle: 'Enterprise Orders & Managed Talent',
                    article: {
                      title: 'Refeir Pro 100% Satisfaction & 14-Day Replacement Guarantee',
                      summary: 'If a Pro talent does not meet your technical expectations within the first 14 days, Refeir replaces the talent at zero cost.',
                      steps: [
                        'Engage vetted top 1% engineering talent through Refeir Pro.',
                        'Work during the 14-day onboarding trial period.',
                        'Request a talent replacement or complete refund if unsatisfied.'
                      ],
                      actionUrl: '/business',
                      actionLabel: 'Learn About Refeir Pro'
                    }
                  },
                  {
                    title: 'Cross-Border Contractor Classification & Pan-African Tax Shield',
                    summary: 'Eliminate compliance and misclassification risks across 54 African jurisdictions.',
                    readTime: '6 min read',
                    views: '9.8k views',
                    icon: Scale,
                    color: '#2E7D32',
                    role: 'Refeir Pro Users',
                    sectionTitle: 'Features, Compliance & Audits',
                    article: {
                      title: 'Cross-Border Contractor Classification & Pan-African Tax Shield',
                      summary: 'Refeir automates local labor law compliance, contractor agreements, and withholding tax documentation.',
                      steps: [
                        'Execute standardized Master Services Agreements (MSAs).',
                        'Automate intellectual property assignment and non-disclosure deeds.',
                        'Download annual cross-border compliance certificates for audit defense.'
                      ]
                    }
                  },
                  {
                    title: 'Consolidated Monthly Invoicing & Net-30 Enterprise Terms',
                    summary: 'Streamline procurement with a single monthly invoice covering all distributed contractors.',
                    readTime: '4 min read',
                    views: '8.7k views',
                    icon: Wallet,
                    color: '#F6B21A',
                    role: 'Refeir Pro Users',
                    sectionTitle: 'Payments & Consolidated Billing',
                    article: {
                      title: 'Consolidated Monthly Invoicing & Net-30 Enterprise Terms',
                      summary: 'Enterprise clients can consolidate multiple freelancer invoices into a single monthly payment with Net-30 terms.',
                      steps: [
                        'Receive a unified monthly statement with department breakdown.',
                        'Pay via corporate SWIFT wire transfer or ACH.',
                        'Sync invoices directly into NetSuite, QuickBooks, or Xero.'
                      ]
                    }
                  },
                  {
                    title: 'Dedicated Technical Project Manager Workflows',
                    summary: 'Let an experienced Refeir technical lead oversee sprints, code reviews, and milestone QA.',
                    readTime: '5 min read',
                    views: '7.9k views',
                    icon: Building2,
                    color: '#7DA2FF',
                    role: 'Refeir Pro Users',
                    sectionTitle: 'Enterprise Orders & Managed Talent',
                    article: {
                      title: 'Dedicated Technical Project Manager Workflows',
                      summary: 'Refeir Pro provides enterprise clients with a dedicated technical manager to streamline sprint planning and deliverables.',
                      steps: [
                        'Your Project Manager conducts candidate technical screenings.',
                        'Manages milestone timelines, standups, and QA testing.',
                        'Ensures all deliverables meet enterprise production standards.'
                      ]
                    }
                  }
                ]
              : [
                  {
                    title: 'How the 100% Trust Vault Milestone Escrow Protects Work',
                    summary: 'Neutral escrow custody that protects both clients and freelancers across all projects.',
                    readTime: '4 min read',
                    views: '28.9k views',
                    icon: ShieldCheck,
                    color: '#66BB2A',
                    role: 'All Roles',
                    sectionTitle: 'Trust & Safety',
                    article: {
                      title: 'How the 100% Trust Vault Milestone Escrow Protects Work',
                      summary: 'Refeir Trust Vault holds milestone funds in neutral custody until the client inspects and approves deliverables.',
                      steps: [
                        'Client deposits milestone funds into escrow before work begins.',
                        'Freelancer submits deliverables in the Project Workspace.',
                        'Client reviews with 5-day inspection guarantee before instant payout release.'
                      ]
                    }
                  },
                  {
                    title: 'The 0% Forever Fee Guarantee on ≤10% Talent Offers',
                    summary: 'Scouts keep 100% of all referral earnings with zero platform deductions.',
                    readTime: '4 min read',
                    views: '24.1k views',
                    icon: Award,
                    color: '#4CAF50',
                    role: 'Scouts & Referrers',
                    sectionTitle: 'Commissions',
                    article: {
                      title: 'The 0% Forever Fee Guarantee on ≤10% Talent Offers',
                      summary: 'Refeir guarantees Scouts keep 100% of all referral proceeds forever on talent offer rates of 10% and below.',
                      steps: [
                        'Talent sets custom referral fee (recommend 10%).',
                        'Scout shares referral link with hiring clients.',
                        'Scout receives 100% of commission with 0% platform fee.'
                      ]
                    }
                  },
                  {
                    title: 'Instant Multi-Currency Payouts in 54 African Currencies',
                    summary: 'Direct withdrawals to local Banks, M-Pesa, MTN MoMo, and USDT stablecoins.',
                    readTime: '5 min read',
                    views: '22.4k views',
                    icon: Wallet,
                    color: '#F6B21A',
                    role: 'Finance & Payouts',
                    sectionTitle: 'Wallet',
                    article: {
                      title: 'Instant Multi-Currency Payouts in 54 African Currencies',
                      summary: 'Withdraw cleared earnings directly to commercial banks or mobile wallets in under 60 seconds.',
                      steps: [
                        'Go to Wallet > Withdraw.',
                        'Select local currency payout method.',
                        'Confirm 2FA security code to execute.'
                      ],
                      actionUrl: '/wallet',
                      actionLabel: 'Go to Wallet'
                    }
                  },
                  {
                    title: 'Stay Protected: Why Off-Platform Communication is Prohibited',
                    summary: 'Why all chats and payments must stay on Refeir to preserve escrow security and legal warranties.',
                    readTime: '3 min read',
                    views: '29.2k views',
                    icon: ShieldAlert,
                    color: '#FF6B6B',
                    role: 'Trust & Safety',
                    sectionTitle: 'Platform Rules',
                    article: {
                      title: 'Stay Protected: Why Off-Platform Communication is Prohibited',
                      summary: 'All project chat, deliverables, and payments MUST be conducted inside Refeir to maintain escrow safety.',
                      steps: [
                        'Keep all conversations inside the encrypted Project Workspace.',
                        'Never accept or send payments through outside wire or personal crypto.',
                        'Violating off-platform payment rules leads to permanent ban and loss of escrow protection.'
                      ]
                    }
                  }
                ]
            ).map((card, cIdx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={cIdx}
                  className="rf-card rf-card-interactive"
                  onClick={() =>
                    setSelectedArticle({
                      role: card.role,
                      sectionTitle: card.sectionTitle,
                      article: card.article
                    })
                  }
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF',
                    border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: 'var(--rf-radius-xl)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div>
                    {/* Header with Icon, Read Time & Views */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: `${card.color}18`,
                          border: `1px solid ${card.color}35`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: card.color
                        }}
                      >
                        <IconComp size={18} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.72rem', color: isDark ? 'var(--rf-slate-400)' : '#527560', fontWeight: 600 }}>
                        <Clock size={12} />
                        <span>{card.readTime}</span>
                        <span>•</span>
                        <span>{card.views}</span>
                      </div>
                    </div>

                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                        lineHeight: 1.35,
                        marginBottom: '0.6rem'
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: isDark ? 'var(--rf-slate-300)' : '#4A6B56',
                        lineHeight: 1.55,
                        margin: 0
                      }}
                    >
                      {card.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--rf-leaf-green)', fontSize: '0.82rem', fontWeight: 800, marginTop: '1.25rem' }}>
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── COMMUNITY & ECOSYSTEM FEATURES SECTION ── */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: 'var(--rf-leaf-green)',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                marginBottom: '0.6rem',
                background: 'rgba(102, 187, 42, 0.1)',
                padding: '0.25rem 0.75rem',
                borderRadius: '100px',
                border: '1px solid rgba(102, 187, 42, 0.25)'
              }}
            >
              <Users size={14} />
              <span>REFEIR COMMUNITY &amp; ECOSYSTEM</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', margin: '0 0 0.6rem 0' }}>
              Connect, Learn &amp; Grow with the Network
            </h2>
            <p style={{ color: isDark ? 'var(--rf-slate-300)' : '#4A6B56', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Join 50,000+ African software engineers, designers, scouts, and hiring leaders shaping the sovereign future of work.
            </p>
          </div>

          {/* 4 Community Feature Containers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {[
              {
                icon: MessageCircle,
                title: 'Community Forum & Discussions',
                desc: 'Ask questions, share pitch strategies, explore open job briefs, and exchange best practices with top-rated African freelancers.',
                features: ['Daily AMA discussions', 'Peer code & design reviews', 'Direct scout connections'],
                actionLabel: 'Join Community Forum',
                actionPath: '/community',
                color: '#66BB2A',
                tag: 'Active Community'
              },
              {
                icon: Compass,
                title: 'Regional Chapters & Meetups',
                desc: 'Attend monthly in-person tech mixers, hackathons, and networking dinners hosted by Refeir Scout Chapters in 12+ African cities.',
                features: ['Lagos, Nairobi, Accra & Kigali', 'Free co-working day passes', 'Client networking mixers'],
                actionLabel: 'Explore Local Chapters',
                actionPath: '/scouts',
                color: '#4CAF50',
                tag: 'Physical Meetups'
              },
              {
                icon: BookOpen,
                title: 'Refeir Academy Masterclasses',
                desc: 'Access 40+ free video masterclasses on winning international contracts, technical portfolio reviews, and multi-currency tax optimization.',
                features: ['Free proposal templates', 'Contract negotiation guides', 'Verified skill masterclasses'],
                actionLabel: 'Browse Free Courses',
                actionPath: '/blog',
                color: '#F6B21A',
                tag: 'Free Learning'
              },
              {
                icon: Layers,
                title: 'Product Roadmap & Feature Voting',
                desc: 'Shape Refeir’s product development. Vote on upcoming features, request new local currency payout methods, and inspect changelogs.',
                features: ['Public feature voting', 'Request currency integrations', 'Weekly release changelog'],
                actionLabel: 'View Release Notes & Vote',
                actionPath: '/release-notes',
                color: '#7DA2FF',
                tag: 'Public Roadmap'
              }
            ].map((feat, fIdx) => {
              const IconComponent = feat.icon;
              return (
                <div
                  key={fIdx}
                  className="rf-card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF',
                    border: isDark ? '1px solid var(--rf-bg-card-border)' : '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: 'var(--rf-radius-xl)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div>
                    {/* Top Tag & Icon */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: `${feat.color}18`,
                          border: `1px solid ${feat.color}35`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: feat.color
                        }}
                      >
                        <IconComponent size={22} />
                      </div>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '100px',
                          background: `${feat.color}18`,
                          color: feat.color,
                          border: `1px solid ${feat.color}30`
                        }}
                      >
                        {feat.tag}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                        marginBottom: '0.65rem',
                        lineHeight: 1.35
                      }}
                    >
                      {feat.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: isDark ? 'var(--rf-slate-300)' : '#4A6B56',
                        lineHeight: 1.55,
                        marginBottom: '1.25rem'
                      }}
                    >
                      {feat.desc}
                    </p>

                    {/* Bullet Highlights */}
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 1.5rem 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.45rem'
                      }}
                    >
                      {feat.features.map((item, iIdx) => (
                        <li
                          key={iIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            fontSize: '0.8rem',
                            color: isDark ? 'var(--rf-slate-200)' : '#1F3A2B',
                            fontWeight: 600
                          }}
                        >
                          <CheckCircle2 size={13} color="var(--rf-leaf-green)" style={{ flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => onNavigate(feat.actionPath)}
                    className="rf-btn rf-btn-outline"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.6rem 1rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      borderRadius: 'var(--rf-radius-md)',
                      color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                      gap: '0.4rem'
                    }}
                  >
                    <span>{feat.actionLabel}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Support Dispatch Banner */}
        <div
          className="rf-card"
          style={{
            marginTop: '2rem',
            padding: '3.25rem 2rem',
            textAlign: 'center',
            background: isDark
              ? 'linear-gradient(135deg, rgba(15,46,30,0.95) 0%, rgba(10,23,15,0.98) 100%)'
              : 'linear-gradient(135deg, #EAF7EE 0%, #D8F0DF 100%)',
            border: '1px solid rgba(102, 187, 42, 0.3)',
            borderRadius: 'var(--rf-radius-2xl)'
          }}
        >
          <Headphones size={36} color="var(--rf-leaf-green)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? 'var(--rf-cream)' : '#0F2E1B', marginBottom: '0.5rem' }}>
            Still can't find what you're looking for?
          </h2>
          <p style={{ color: isDark ? 'var(--rf-slate-300)' : '#355340', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 2rem' }}>
            Our 24/7 pan-African support dispatch is available for instant dispute mediation, payment assistance, and account verification.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/contact')} className="rf-btn rf-btn-primary rf-btn-lg">
              <MessageCircle size={18} />
              <span>Contact Support Dispatch</span>
            </button>
            <button onClick={() => onNavigate('/disputes')} className="rf-btn rf-btn-secondary rf-btn-lg">
              <ShieldCheck size={18} />
              <span>Open Dispute Center</span>
            </button>
          </div>
        </div>
      </div>


      {/* ── MODAL 1: SINGLE ARTICLE DETAIL MODAL ── */}
      {selectedArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="rf-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF',
              border: '1.5px solid rgba(102, 187, 42, 0.4)',
              borderRadius: 'var(--rf-radius-xl)',
              padding: '2.25rem',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isDark ? 'var(--rf-cream)' : '#0F2E1B'
              }}
            >
              <X size={18} />
            </button>

            {/* Breadcrumb Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '100px',
                  background: 'rgba(102, 187, 42, 0.15)',
                  color: 'var(--rf-leaf-green)'
                }}
              >
                {selectedArticle.role}
              </span>
              <span style={{ fontSize: '0.8rem', color: isDark ? 'var(--rf-slate-400)' : '#527560' }}>
                / {selectedArticle.sectionTitle}
              </span>
            </div>

            {/* Article Title */}
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                lineHeight: 1.3,
                marginBottom: '1rem'
              }}
            >
              {selectedArticle.article.title}
            </h2>

            {/* Article Summary */}
            <p
              style={{
                fontSize: '1rem',
                color: isDark ? 'var(--rf-slate-200)' : '#2D4A38',
                lineHeight: 1.65,
                marginBottom: '1.5rem'
              }}
            >
              {selectedArticle.article.summary}
            </p>

            {/* Step-by-Step Instructions if present */}
            {selectedArticle.article.steps && selectedArticle.article.steps.length > 0 && (
              <div
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : '#F6FAF7',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(18,43,26,0.08)',
                  borderRadius: 'var(--rf-radius-lg)',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--rf-leaf-green)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Step-by-Step Guide
                </div>
                <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {selectedArticle.article.steps.map((step, sIdx) => (
                    <li key={sIdx} style={{ fontSize: '0.9rem', color: isDark ? 'var(--rf-slate-200)' : '#1F3A2B', lineHeight: 1.55 }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Pro Tip Box if present */}
            {selectedArticle.article.tips && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  background: 'rgba(102, 187, 42, 0.12)',
                  border: '1px solid rgba(102, 187, 42, 0.25)',
                  borderRadius: 'var(--rf-radius-md)',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.75rem'
                }}
              >
                <Sparkles size={18} color="var(--rf-leaf-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.875rem', color: isDark ? 'var(--rf-cream)' : '#0F2E1B', lineHeight: 1.5 }}>
                  <strong>Refeir Tip:</strong> {selectedArticle.article.tips}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {selectedArticle.article.actionUrl ? (
                <button
                  onClick={() => {
                    const url = selectedArticle.article.actionUrl!;
                    setSelectedArticle(null);
                    onNavigate(url);
                  }}
                  className="rf-btn rf-btn-primary"
                >
                  <span>{selectedArticle.article.actionLabel || 'Take Action in App'}</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div />
              )}

              <button onClick={() => setSelectedArticle(null)} className="rf-btn rf-btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: "SEE ALL ARTICLES" SECTION MODAL ── */}
      {selectedSectionModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setSelectedSectionModal(null)}
        >
          <div
            className="rf-card"
            style={{
              width: '100%',
              maxWidth: '780px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: isDark ? 'var(--rf-bg-surface)' : '#FFFFFF',
              border: `1.5px solid ${selectedSectionModal.section.color}50`,
              borderRadius: 'var(--rf-radius-2xl)',
              padding: '2.5rem',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedSectionModal(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isDark ? 'var(--rf-cream)' : '#0F2E1B'
              }}
            >
              <X size={18} />
            </button>

            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: `${selectedSectionModal.section.color}20`,
                  border: `1px solid ${selectedSectionModal.section.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: selectedSectionModal.section.color,
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                {React.createElement(selectedSectionModal.section.icon, { size: 24 })}
              </div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: selectedSectionModal.section.color
                  }}
                >
                  {selectedSectionModal.role} Directory
                </span>
                <h2
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                    margin: '0.15rem 0 0'
                  }}
                >
                  {selectedSectionModal.section.title}
                </h2>
              </div>
            </div>

            <p style={{ color: isDark ? 'var(--rf-slate-300)' : '#4A6B56', fontSize: '0.95rem', marginBottom: '2rem' }}>
              {selectedSectionModal.section.description}
            </p>

            {/* Detailed Articles Accordion / List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {selectedSectionModal.section.articles.map((art, aIdx) => (
                <div
                  key={aIdx}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#F6FAF7',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(18,43,26,0.08)',
                    borderRadius: 'var(--rf-radius-lg)',
                    padding: '1.25rem 1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: isDark ? 'var(--rf-cream)' : '#0F2E1B',
                        margin: 0,
                        lineHeight: 1.4
                      }}
                    >
                      {art.title}
                    </h3>
                    {art.actionUrl && (
                      <button
                        onClick={() => {
                          const url = art.actionUrl!;
                          setSelectedSectionModal(null);
                          onNavigate(url);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--rf-leaf-green)',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          flexShrink: 0
                        }}
                      >
                        <span>{art.actionLabel || 'Action'}</span>
                        <ExternalLink size={13} />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: isDark ? 'var(--rf-slate-300)' : '#2D4A38', lineHeight: 1.55, margin: '0 0 0.75rem 0' }}>
                    {art.summary}
                  </p>

                  {art.steps && (
                    <div style={{ fontSize: '0.84rem', color: isDark ? 'var(--rf-slate-400)' : '#527560', borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem' }}>
                      <ol style={{ paddingLeft: '1.15rem', margin: 0 }}>
                        {art.steps.map((st, sIdx) => (
                          <li key={sIdx} style={{ marginBottom: '0.25rem' }}>
                            {st}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setSelectedSectionModal(null)} className="rf-btn rf-btn-secondary">
                Done Viewing Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
