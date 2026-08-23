import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TalentProfile,
  Service,
  ScoutProfile,
  Job,
  Project,
  Referral,
  Wallet,
  Transaction,
  LedgerEntry,
  Commission,
  Dispute,
  RiskFlag,
  AuditLog,
  PlatformSettings,
  CountryComplianceSetting,
  Money,
  PayoutMethod,
  CountryMarketplaceStatus,
  Country,
  AirfeeToken,
  Deliverable,
  ClientIntroduction,
  ClientIntroductionStatus,
  Review,
  ReviewRequest,
  ReviewType,
  ClientReputationScorecard,
  ProjectOrigin,
  User
} from '../types';
import { SEED_TALENT } from '../data/seedTalent';
import { SEED_SERVICES } from '../data/seedServices';
import { SEED_SCOUTS } from '../data/seedScouts';
import { SEED_JOBS } from '../data/seedJobs';
import { SEED_PROJECTS } from '../data/seedProjects';
import { SEED_REVIEWS, SEED_REVIEW_REQUESTS, CLIENT_SCORECARDS } from '../data/seedReviews';
import { AFRICAN_COUNTRIES } from '../data/countries';
import { createMoney, formatMoney } from '../data/currencies';
import { ReferralEngine } from '../services/referralEngine';
import { calculateProjectBreakdown, calculateAirfee, calculateProposalJobBreakdown, calculateDirectHireBreakdown } from '../services/commissionEngine';
import { FraudEngine } from '../services/fraudEngine';
import { defaultPayoutProvider } from '../services/payoutProvider';
import { evaluateWithdrawalCompliance, evaluatePaymentTransferEligibility } from '../services/complianceEngine';

interface MarketplaceContextType {
  talentList: TalentProfile[];
  servicesList: Service[];
  scoutsList: ScoutProfile[];
  jobsList: Job[];
  projectsList: Project[];
  referralsList: Referral[];
  wallets: Record<string, Wallet>;
  transactions: Transaction[];
  ledgerEntries: LedgerEntry[];
  commissionsList: Commission[];
  disputesList: Dispute[];
  riskFlagsList: RiskFlag[];
  auditLogs: AuditLog[];
  platformSettings: PlatformSettings;
  countrySettings: Record<string, CountryComplianceSetting>;
  countries: Country[];
  airfeeTokens: AirfeeToken[];
  clientIntroductionsList: ClientIntroduction[];
  reviewsList: Review[];
  reviewRequestsList: ReviewRequest[];

  // Core Actions
  createReferral: (scout: { id: string; name: string }, talent: TalentProfile, service?: Service) => Referral;
  getReferralByCode: (code: string) => Referral | undefined;
  trackReferralClick: (code: string) => void;
  createProject: (params: {
    title: string;
    talent: TalentProfile;
    client: { id: string; name: string; country: string };
    referral?: Referral;
    service?: Service;
    amount: Money;
    origin?: ProjectOrigin;
    is_proposal_hire?: boolean;
  }) => Project;
  createProjectFromService: (talent: TalentProfile, service?: Service, referral?: any, clientName?: string) => Project;
  fundProject: (projectId: string) => Promise<boolean>;
  submitProjectDeliverable: (
    projectId: string,
    milestoneId: string,
    title: string,
    message: string,
    assets?: {
      github_pr_url?: string;
      figma_url?: string;
      staging_url?: string;
      apk_download_url?: string;
      fileName?: string;
    }
  ) => void;
  requestMilestoneRevision: (
    projectId: string,
    milestoneId: string,
    deliverableId: string,
    revisionNotes: string
  ) => void;
  approveMilestone: (projectId: string, milestoneId: string) => void;
  completeAndSettleProject: (projectId: string) => void;
  requestPayout: (userId: string, amount: Money, method: PayoutMethod, user?: User | null) => Promise<boolean>;
  raiseDispute: (projectId: string, user: { id: string; name: string; role: any }, reason: string, description: string) => void;
  resolveDispute: (disputeId: string, resolution: 'RESOLVED_CLIENT' | 'RESOLVED_TALENT' | 'PARTIAL_SETTLEMENT', notes: string) => void;
  updateCountryStatus: (countryId: string, updates: Partial<CountryComplianceSetting>) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  postJob: (job: Partial<Job>) => Job;
  createService: (service: Partial<Service>) => Service;
  getUserWallet: (userId: string) => Wallet;
  addPayoutMethod: (userId: string, method: Omit<PayoutMethod, 'id'>) => PayoutMethod;
  setDefaultPayoutMethod: (userId: string, methodId: string) => void;
  deletePayoutMethod: (userId: string, methodId: string) => void;
  issueAirfeeToken: (scoutId: string, clientName?: string) => AirfeeToken;
  getActiveAirfeeToken: (scoutId: string) => AirfeeToken | undefined;
  generateClientIntroLink: (scoutId: string, scoutName: string) => { link: string; code: string };
  submitClientIntroduction: (
    scoutId: string,
    scoutName: string,
    clientContactName: string,
    companyName: string,
    clientEmail?: string,
    clientPhone?: string
  ) => ClientIntroduction;
  approveAndGrantAirfeeToken: (
    introductionId: string,
    adminNotes?: string
  ) => boolean;
  rejectClientIntroduction: (
    introductionId: string,
    reason: string
  ) => void;
  // Reviews & Scorecards
  submitReview: (review: Omit<Review, 'id' | 'created_at'>) => Review;
  requestReview: (request: Omit<ReviewRequest, 'id' | 'status' | 'created_at'>) => ReviewRequest;
  respondToReviewRequest: (requestId: string, action: 'COMPLETED' | 'DECLINED') => void;
  getReviewsForTarget: (targetId: string, type?: ReviewType) => Review[];
  getClientScorecard: (clientId: string, clientName?: string) => ClientReputationScorecard;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with local storage cache or rich seed data
  const [talentList, setTalentList] = useState<TalentProfile[]>(() => {
    const saved = localStorage.getItem('refeir_talent');
    return saved ? JSON.parse(saved) : SEED_TALENT;
  });

  const [servicesList, setServicesList] = useState<Service[]>(() => {
    const saved = localStorage.getItem('refeir_services');
    return saved ? JSON.parse(saved) : SEED_SERVICES;
  });

  const [scoutsList, setScoutsList] = useState<ScoutProfile[]>(() => {
    const saved = localStorage.getItem('refeir_scouts');
    return saved ? JSON.parse(saved) : SEED_SCOUTS;
  });

  const [jobsList, setJobsList] = useState<Job[]>(() => {
    const saved = localStorage.getItem('refeir_jobs');
    return saved ? JSON.parse(saved) : SEED_JOBS;
  });

  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const saved = localStorage.getItem('refeir_projects');
    return saved ? JSON.parse(saved) : SEED_PROJECTS;
  });

  const [referralsList, setReferralsList] = useState<Referral[]>(() => {
    const saved = localStorage.getItem('refeir_referrals');
    if (saved) return JSON.parse(saved);
    // Seed initial demo referral
    return [
      {
        id: 'RF-82KX29',
        referral_code: 'RF-82KX29',
        scout_id: 'user-sarah',
        scout_name: 'Sarah Adeyemi',
        talent_id: 'talent-amaka-nwosu',
        talent_name: 'Amaka Nwosu',
        talent_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        service_id: 'srv-fintech-mobile-ui',
        service_title: 'High-Converting Fintech Mobile App UI/UX Design System in Figma',
        country_iso: 'NG',
        currency: 'NGN',
        locked_service_price: createMoney(450000, 'NGN'),
        locked_referral_percentage: 10,
        potential_reward: createMoney(45000, 'NGN'),
        clicks_count: 34,
        status: 'ACTIVE',
        created_at: '2026-06-20T10:00:00Z',
        expires_at: '2026-07-20T10:00:00Z',
        attribution_window_days: 30,
        campaign: 'whatsapp-founders'
      },
      {
        id: 'RF-99GH44',
        referral_code: 'RF-99GH44',
        scout_id: 'user-kofi',
        scout_name: 'Kofi Boateng',
        talent_id: 'talent-kwame-mensah',
        talent_name: 'Kwame Mensah',
        talent_avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        service_id: 'srv-web-backend-api',
        service_title: 'Scalable Full-Stack Web Application & High-Throughput API Development',
        country_iso: 'GH',
        currency: 'GHS',
        locked_service_price: createMoney(18000, 'GHS'),
        locked_referral_percentage: 10,
        potential_reward: createMoney(1800, 'GHS'),
        clicks_count: 52,
        status: 'PAID',
        created_at: '2026-06-01T12:00:00Z',
        expires_at: '2026-07-01T12:00:00Z',
        attribution_window_days: 30,
        campaign: 'tech-accra'
      }
    ];
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('refeir_platform_settings');
    return saved
      ? JSON.parse(saved)
      : {
          platform_fee_percent: 5,
          min_referral_percentage: 5,
          max_referral_percentage: 25,
          payout_hold_period_days: 3,
          minimum_payout_minor: { NGN: 500000, GHS: 10000, KES: 100000, ZAR: 15000, USD: 1000 },
          attribution_window_days: 30
        };
  });

  const [countrySettings, setCountrySettings] = useState<Record<string, CountryComplianceSetting>>(() => {
    const saved = localStorage.getItem('refeir_country_settings');
    if (saved) return JSON.parse(saved);
    const initial: Record<string, CountryComplianceSetting> = {};
    AFRICAN_COUNTRIES.forEach(c => {
      initial[c.id] = {
        country_id: c.id,
        country_name: c.name,
        terms_url: `/legal/terms/${c.id}`,
        privacy_url: `/legal/privacy/${c.id}`,
        payment_rules: 'Project funds protected in regulated partner custody until milestone sign-off.',
        kyc_required: c.verification_availability,
        payout_rules: 'Instant Mobile Money or Same-day NIP/EFT bank transfer.',
        tax_disclaimer: 'Refeir facilitates peer professional connections. Users are responsible for local tax filings.',
        supported_payment_methods: c.payment_availability ? ['Debit/Credit Card', 'Bank Transfer', 'Mobile Money'] : ['Marketplace Inquiries Only'],
        status: c.status
      };
    });
    return initial;
  });

  const [wallets, setWallets] = useState<Record<string, Wallet>>(() => {
    const saved = localStorage.getItem('refeir_wallets');
    if (saved) return JSON.parse(saved);
    return {
      'user-sarah': {
        user_id: 'user-sarah',
        balances: {
          NGN: { currency: 'NGN', available_minor: 182000000, pending_minor: 4500000, processing_minor: 0 },
          GHS: { currency: 'GHS', available_minor: 180000, pending_minor: 0, processing_minor: 0 },
          KES: { currency: 'KES', available_minor: 0, pending_minor: 2200000, processing_minor: 0 },
          USD: { currency: 'USD', available_minor: 150000, pending_minor: 0, processing_minor: 0 }
        },
        payout_methods: [
          {
            id: 'pm-1',
            type: 'BANK_ACCOUNT',
            country: 'Nigeria',
            currency: 'NGN',
            institution_name: 'Access Bank Nigeria',
            masked_identifier: '•••• 3821',
            account_holder_name: 'Sarah Adeyemi',
            is_default: true
          }
        ]
      },
      'user-kofi': {
        user_id: 'user-kofi',
        balances: {
          GHS: { currency: 'GHS', available_minor: 3400000, pending_minor: 0, processing_minor: 0 },
          NGN: { currency: 'NGN', available_minor: 0, pending_minor: 10000000, processing_minor: 0 }
        },
        payout_methods: [
          {
            id: 'pm-2',
            type: 'MOBILE_MONEY',
            country: 'Ghana',
            currency: 'GHS',
            institution_name: 'MTN Mobile Money Ghana',
            masked_identifier: '+233 24 •••• 567',
            account_holder_name: 'Kofi Boateng',
            is_default: true
          }
        ]
      },
      'user-amaka': {
        user_id: 'user-amaka',
        balances: {
          NGN: { currency: 'NGN', available_minor: 245000000, pending_minor: 90000000, processing_minor: 0 }
        },
        payout_methods: [
          {
            id: 'pm-3',
            type: 'BANK_ACCOUNT',
            country: 'Nigeria',
            currency: 'NGN',
            institution_name: 'Zenith Bank PLC',
            masked_identifier: '•••• 9104',
            account_holder_name: 'Amaka Nwosu',
            is_default: true
          }
        ]
      }
    };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('refeir_transactions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'tx-1001',
        reference_code: 'TXN-RF-98231',
        project_id: 'proj-pan-africa-demo',
        referral_id: 'RF-82KX29',
        type: 'PROJECT_PAYMENT_PROTECTION_HOLD',
        amount: createMoney(1050000, 'NGN'),
        original_currency: 'NGN',
        settlement_currency: 'NGN',
        payment_provider: 'Nigeria Payment Provider (Paystack / Flutterwave Rail)',
        status: 'SUCCESS',
        timestamp: '2026-06-28T10:05:00Z',
        ledger_entries: [
          {
            id: 'le-1',
            transaction_id: 'tx-1001',
            account_id: 'user-client-kenya',
            account_name: 'David Kamau',
            entry_type: 'DEBIT',
            amount: createMoney(1050000, 'NGN'),
            description: 'Protected project payment deposit for Cross-Border Dispatch Platform',
            timestamp: '2026-06-28T10:05:00Z'
          },
          {
            id: 'le-2',
            transaction_id: 'tx-1001',
            account_id: 'refeir-protection-vault',
            account_name: 'Refeir Protected Trust Vault Pool',
            entry_type: 'CREDIT',
            amount: createMoney(1050000, 'NGN'),
            description: 'Funds locked in protected custody pending milestone approvals',
            timestamp: '2026-06-28T10:05:00Z'
          }
        ]
      }
    ];
  });

  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('refeir_ledger');
    return saved ? JSON.parse(saved) : [];
  });

  const [commissionsList, setCommissionsList] = useState<Commission[]>(() => {
    const saved = localStorage.getItem('refeir_commissions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'comm-1',
        scout_id: 'user-sarah',
        referral_id: 'RF-82KX29',
        project_id: 'proj-pan-africa-demo',
        project_title: 'Cross-Border Supply Chain Analytics & Dispatch Engine',
        talent_name: 'Amaka Nwosu',
        client_name: 'David Kamau',
        eligible_amount: createMoney(1000000, 'NGN'),
        referral_percentage: 10,
        commission_amount: createMoney(100000, 'NGN'),
        state: 'PENDING',
        hold_period_days: 3,
        eligible_at: '2026-07-22T10:00:00Z',
        created_at: '2026-06-28T10:00:00Z'
      }
    ];
  });

  const SEED_DISPUTES: Dispute[] = [
    {
      id: 'DISP-94821',
      project_id: 'proj-pan-africa-demo',
      project_title: 'FinTech Mobile App UI/UX Design System in Figma',
      initiated_by_id: 'user-client-kenya',
      initiated_by_name: 'David Kamau',
      initiated_by_role: 'CLIENT',
      reason: 'Scope Alignment & Tablet Responsive Variants',
      description: 'Client states Milestone #2 (Interactive Component Library & Token Export) was delivered without tablet/iPad responsive variants. Talent states initial agreed proposal scope was mobile-only (iOS/Android) and tablet support is a Phase 2 add-on.',
      evidence_urls: [
        'https://figma.com/@refeir/fintech-design-system-v2',
        'https://refeir.africa/evidence/scope-brief-signed.pdf'
      ],
      disputed_amount: createMoney(220000, 'KES'),
      status: 'UNDER_REVIEW',
      created_at: '2026-08-14T11:20:00Z',
      updated_at: '2026-08-15T09:40:00Z'
    },
    {
      id: 'DISP-88204',
      project_id: 'proj-ai-nlp-model',
      project_title: 'Custom AI NLP Model Pipeline & Swahili Tokenizer',
      initiated_by_id: 'user-client-london',
      initiated_by_name: 'Alpha Global Ventures',
      initiated_by_role: 'CLIENT',
      reason: 'Inference Latency SLA Benchmark Discrepancy',
      description: 'Client benchmark showed 420ms p99 latency vs 150ms promised in technical spec. Talent submitted Docker container benchmark showing 130ms on GPU instances and claims client tested on standard CPU tier.',
      evidence_urls: [
        'https://github.com/refeir-demo/nlp-swahili-inference/pull/44',
        'https://refeir.africa/evidence/benchmark-cloudwatch.png'
      ],
      disputed_amount: createMoney(18000, 'GHS'),
      status: 'EVIDENCE_REQUESTED',
      created_at: '2026-08-13T14:15:00Z',
      updated_at: '2026-08-14T16:30:00Z'
    },
    {
      id: 'DISP-73190',
      project_id: 'proj-remittance-engine',
      project_title: 'Cross-Border Remittance & Web3 Settlement Engine',
      initiated_by_id: 'talent-chidi',
      initiated_by_name: 'Chidi Emmanuel Okafor',
      initiated_by_role: 'TALENT',
      reason: 'Milestone Delivery Approved but Payment Delayed by Client',
      description: 'Talent delivered complete smart contract bytecode and unit tests on Polygon testnet with 98.4% coverage. Client did not approve within 14-day review window due to internal organizational delays.',
      evidence_urls: [
        'https://github.com/refeir-demo/polygon-settlement-contracts',
        'https://polygonscan.com/address/0x72a91b4899120c'
      ],
      disputed_amount: createMoney(45000, 'ZAR'),
      status: 'RESOLVED_TALENT',
      resolution_notes: 'Tribunal verified smart contracts on Polygon testnet with 98.4% test coverage. 100% of Milestone 1 escrow funds released to Talent wallet.',
      created_at: '2026-08-10T08:00:00Z',
      updated_at: '2026-08-12T17:22:00Z'
    },
    {
      id: 'DISP-61049',
      project_id: 'proj-logistics-dispatch',
      project_title: 'Logistics Dispatch & GPS Fleet Tracker Engine',
      initiated_by_id: 'user-simba-logistics',
      initiated_by_name: 'Simba Freight & Logistics',
      initiated_by_role: 'CLIENT',
      reason: 'Partial Deliverable Completion on Backend APIs vs Mobile Frontend',
      description: 'Dispute over milestone split. Talent finished all core REST APIs and PostgreSQL schema, but Flutter mobile app had 4 days delay on live telemetry streaming.',
      evidence_urls: [
        'https://api.simba-dispatch.demo/v1/health',
        'https://github.com/refeir-demo/simba-backend-core'
      ],
      disputed_amount: createMoney(150000, 'KES'),
      status: 'PARTIAL_SETTLEMENT',
      resolution_notes: 'Mediated 60/40 Split: Talent awarded 60% (KES 90,000) for completed backend APIs, and Client refunded 40% (KES 60,000) for uncompleted frontend components.',
      created_at: '2026-08-08T10:00:00Z',
      updated_at: '2026-08-11T13:45:00Z'
    }
  ];

  const [disputesList, setDisputesList] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem('refeir_disputes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback to seed
      }
    }
    return SEED_DISPUTES;
  });

  const [riskFlagsList, setRiskFlagsList] = useState<RiskFlag[]>(() => {
    const saved = localStorage.getItem('refeir_risk_flags');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('refeir_audit_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'aud-1',
        actor_id: 'sys-cron',
        actor_name: 'System Ledger Daemon',
        action: 'HOLD_VERIFICATION',
        object_type: 'PROJECT',
        object_id: 'proj-pan-africa-demo',
        timestamp: '2026-06-28T10:05:00Z',
        ip_address: '10.0.4.1',
        country: 'Pan-Africa',
        reason: 'Client payment of ₦1,050,000 verified and held in protected custody.'
      }
    ];
  });

  const [airfeeTokens, setAirfeeTokens] = useState<AirfeeToken[]>(() => {
    const saved = localStorage.getItem('refeir_airfee_tokens');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'token-sarah-aug',
        code: 'RF-AIRTOKEN-2026-08',
        issued_to_scout_id: 'user-sarah',
        issued_at: '2026-08-01T00:00:00Z',
        expires_at: '2026-08-31T23:59:59Z',
        is_active: true,
        month_label: 'August 2026',
        client_referrals_count: 3,
        airfee_discount_percent: 2
      },
      {
        id: 'token-kofi-aug',
        code: 'RF-AIRTOKEN-KOFI-08',
        issued_to_scout_id: 'user-kofi',
        issued_at: '2026-08-01T00:00:00Z',
        expires_at: '2026-08-31T23:59:59Z',
        is_active: true,
        month_label: 'August 2026',
        client_referrals_count: 2,
        airfee_discount_percent: 2
      }
    ];
  });

  const [clientIntroductionsList, setClientIntroductionsList] = useState<ClientIntroduction[]>(() => {
    const saved = localStorage.getItem('refeir_client_introductions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'intro-1',
        scout_id: 'user-sarah',
        scout_name: 'Sarah Adeyemi',
        client_contact_name: 'Tunde Bakare',
        company_name: 'Apex Fintech Africa',
        client_email: 'tunde@apexfintech.ng',
        referral_link_code: 'SCOUT-SARAHADEYEMI',
        status: 'HIRE_COMPLETED_PENDING_ADMIN',
        has_registered: true,
        has_closed_deal: true,
        registered_client_name: 'Tunde Bakare',
        registered_company_name: 'Apex Fintech Africa',
        registered_client_id: 'user-client-apex',
        deal_project_id: 'proj-pan-africa-demo',
        deal_project_title: 'Fintech Mobile App UI/UX Design System in Figma',
        deal_amount_formatted: '₦450,000',
        created_at: '2026-08-10T11:00:00Z',
        admin_notes: 'Client registered with matching details and completed project escrow settlement with Talent Amaka Nwosu.'
      },
      {
        id: 'intro-2',
        scout_id: 'user-kofi',
        scout_name: 'Kofi Boateng',
        client_contact_name: 'Abena Serwaa',
        company_name: 'Accra Digital Hub',
        client_email: 'abena@accradigital.gh',
        referral_link_code: 'SCOUT-KOFIBOATENG',
        status: 'CLIENT_REGISTERED_AWAITING_HIRE',
        has_registered: true,
        has_closed_deal: false,
        registered_client_name: 'Abena Serwaa',
        registered_company_name: 'Accra Digital Hub',
        registered_client_id: 'user-client-abena',
        created_at: '2026-08-12T14:30:00Z',
        admin_notes: 'Client registered on platform, but has not completed any paid project hire yet. Scout receives token only after deal completion.'
      },
      {
        id: 'intro-3',
        scout_id: 'user-sarah',
        scout_name: 'Sarah Adeyemi',
        client_contact_name: 'David Kamau',
        company_name: 'East Africa Freight & Logistics',
        client_email: 'david@eafreight.ke',
        referral_link_code: 'SCOUT-SARAHADEYEMI',
        status: 'VERIFIED_GRANTED',
        has_registered: true,
        has_closed_deal: true,
        registered_client_name: 'David Kamau',
        registered_company_name: 'East Africa Freight & Logistics',
        registered_client_id: 'user-client-kenya',
        deal_project_id: 'proj-logistics-dispatch',
        deal_project_title: 'Logistics Dispatch & GPS Fleet Tracker Engine',
        deal_amount_formatted: 'KES 300,000',
        granted_token_code: 'RF-AIRTOKEN-2026-08',
        created_at: '2026-08-01T09:00:00Z',
        verified_at: '2026-08-02T16:00:00Z',
        admin_notes: 'Verified: Client names matched and contract completed. Granted Monthly Airfee Token.'
      },
      {
        id: 'intro-4',
        scout_id: 'user-sarah',
        scout_name: 'Sarah Adeyemi',
        client_contact_name: 'Chidi Okonkwo',
        company_name: 'Lagos Enterprise Group',
        client_email: 'chidi@lagosenterprise.com',
        referral_link_code: 'SCOUT-SARAHADEYEMI',
        status: 'PENDING_VERIFICATION',
        has_registered: false,
        has_closed_deal: false,
        created_at: '2026-08-15T18:00:00Z',
        admin_notes: 'Link dispatched. Waiting for client to click, register, and close a deal.'
      }
    ];
  });

  // Reviews state (Talent <-> Client, Scout <-> Talent, Scout <-> Client)
  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    const saved = localStorage.getItem('refeir_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return SEED_REVIEWS;
  });

  const [reviewRequestsList, setReviewRequestsList] = useState<ReviewRequest[]>(() => {
    const saved = localStorage.getItem('refeir_review_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return SEED_REVIEW_REQUESTS;
  });

  // Sync to LocalStorage on state changes
  useEffect(() => {
    localStorage.setItem('refeir_client_introductions', JSON.stringify(clientIntroductionsList));
  }, [clientIntroductionsList]);

  useEffect(() => {
    localStorage.setItem('refeir_reviews', JSON.stringify(reviewsList));
  }, [reviewsList]);

  useEffect(() => {
    localStorage.setItem('refeir_review_requests', JSON.stringify(reviewRequestsList));
  }, [reviewRequestsList]);

  useEffect(() => {
    localStorage.setItem('refeir_airfee_tokens', JSON.stringify(airfeeTokens));
  }, [airfeeTokens]);

  useEffect(() => {
    localStorage.setItem('refeir_talent', JSON.stringify(talentList));
  }, [talentList]);

  useEffect(() => {
    localStorage.setItem('refeir_services', JSON.stringify(servicesList));
  }, [servicesList]);

  useEffect(() => {
    localStorage.setItem('refeir_jobs', JSON.stringify(jobsList));
  }, [jobsList]);

  useEffect(() => {
    localStorage.setItem('refeir_projects', JSON.stringify(projectsList));
  }, [projectsList]);

  useEffect(() => {
    localStorage.setItem('refeir_referrals', JSON.stringify(referralsList));
  }, [referralsList]);

  useEffect(() => {
    localStorage.setItem('refeir_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('refeir_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('refeir_commissions', JSON.stringify(commissionsList));
  }, [commissionsList]);

  useEffect(() => {
    localStorage.setItem('refeir_country_settings', JSON.stringify(countrySettings));
  }, [countrySettings]);

  useEffect(() => {
    localStorage.setItem('refeir_platform_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  // --- ACTIONS ---

  const createReferral = (
    scout: { id: string; name: string },
    talent: TalentProfile,
    service?: Service
  ): Referral => {
    const referral = ReferralEngine.createReferral({
      scout,
      talent,
      service,
      attributionWindowDays: platformSettings.attribution_window_days
    });
    setReferralsList(prev => [referral, ...prev]);

    // Audit log
    const auditEntry: AuditLog = {
      id: `audit-${Date.now()}`,
      action: 'CREATE_REFERRAL',
      actor_id: scout.id,
      actor_name: scout.name,
      object_type: 'REFERRAL',
      object_id: referral.id,
      timestamp: new Date().toISOString(),
      country: talent.country_name,
      reason: `Locked referral created for ${talent.full_name} at ${referral.locked_referral_percentage}% commission rate.`,
      ip_address: '102.89.43.12 (Masked - Lagos, Nigeria)'
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return referral;
  };

  const getReferralByCode = (code: string): Referral | undefined => {
    return referralsList.find(r => r.referral_code.toUpperCase() === code.toUpperCase());
  };

  const trackReferralClick = (code: string) => {
    setReferralsList(prev =>
      prev.map(r => {
        if (r.referral_code.toUpperCase() === code.toUpperCase()) {
          return { ...r, clicks_count: r.clicks_count + 1 };
        }
        return r;
      })
    );
  };

  const createProject = (params: {
    title: string;
    talent: TalentProfile;
    client: { id: string; name: string; country: string };
    referral?: Referral;
    service?: Service;
    amount: Money;
    origin?: ProjectOrigin;
    is_proposal_hire?: boolean;
  }): Project => {
    const isProposal = params.is_proposal_hire || params.origin === 'PROPOSAL_HIRE';
    const isScoutReferral = !isProposal && Boolean(params.referral && params.referral.scout_id);
    const origin: ProjectOrigin = isProposal
      ? 'PROPOSAL_HIRE'
      : isScoutReferral
      ? 'SCOUT_REFERRAL'
      : 'DIRECT_HIRE';

    let platformFeePct = platformSettings.platform_fee_percent || 5;
    let platformFeeAmount: Money;
    let clientTotalAmount: Money;
    let referralPct = 0;
    let scoutRewardAmount: Money = createMoney(0, params.amount.currency);
    let talentNetAmount: Money;
    let talentPlatformFeePct: number | undefined;
    let talentPlatformFeeAmount: Money | undefined;
    let directFacilitationPct: number | undefined;

    if (origin === 'PROPOSAL_HIRE') {
      // Proposal Job rule: 5% from client + 5% from talent at final milestone
      const breakdown = calculateProposalJobBreakdown(params.amount);
      platformFeePct = breakdown.client_fee_percent;
      platformFeeAmount = breakdown.client_fee_amount;
      clientTotalAmount = breakdown.client_total_amount;
      talentPlatformFeePct = breakdown.talent_fee_percent;
      talentPlatformFeeAmount = breakdown.talent_fee_amount;
      talentNetAmount = breakdown.talent_net_amount;
      referralPct = 0;
    } else if (origin === 'DIRECT_HIRE') {
      // Direct reachout rule: Refeir takes the referral rate the Talent had set initially
      referralPct = params.service?.referral_percentage || params.talent.referral_percentage || 10;
      directFacilitationPct = referralPct;
      const breakdown = calculateDirectHireBreakdown(params.amount, referralPct, platformFeePct);
      platformFeeAmount = breakdown.platform_fee_amount;
      clientTotalAmount = breakdown.client_total_amount;
      talentNetAmount = breakdown.talent_net_amount;
    } else {
      // Scout referral
      referralPct = params.referral?.locked_referral_percentage || params.service?.referral_percentage || params.talent.referral_percentage || 10;
      const breakdown = calculateProjectBreakdown(params.amount, referralPct, platformFeePct);
      platformFeeAmount = breakdown.platform_fee_amount;
      clientTotalAmount = breakdown.client_total_amount;
      scoutRewardAmount = breakdown.scout_reward_amount;
      talentNetAmount = breakdown.talent_net_amount;
    }

    const newProject: Project = {
      id: `proj-${Math.random().toString(36).substring(2, 9)}`,
      title: params.title || (params.service ? params.service.title : `Engagement with ${params.talent.full_name}`),
      client_id: params.client.id,
      client_name: params.client.name,
      client_country: params.client.country,
      talent_id: params.talent.id,
      talent_name: params.talent.full_name,
      talent_avatar: params.talent.avatar_url,
      talent_country: params.talent.country_name,
      scout_id: isScoutReferral ? params.referral?.scout_id : undefined,
      scout_name: isScoutReferral ? params.referral?.scout_name : undefined,
      referral_id: isScoutReferral ? params.referral?.id : undefined,
      origin,
      is_proposal_hire: isProposal,
      currency: params.amount.currency,
      project_amount: params.amount,
      platform_fee_percent: platformFeePct,
      platform_fee_amount: platformFeeAmount,
      talent_platform_fee_percent: talentPlatformFeePct,
      talent_platform_fee_amount: talentPlatformFeeAmount,
      direct_facilitation_rate_percent: directFacilitationPct,
      client_total_amount: clientTotalAmount,
      referral_percentage: referralPct,
      scout_reward_amount: scoutRewardAmount,
      talent_net_amount: talentNetAmount,
      status: 'AWAITING_PAYMENT',
      timeline_days: params.service ? params.service.delivery_days : 14,
      milestones: [
        {
          id: `ms-${Date.now()}-1`,
          title: 'Initial Milestone: Discovery & Scope Delivery',
          description: 'Delivery of core requirements and architecture blueprint.',
          amount: {
            amount_minor: Math.round(params.amount.amount_minor * 0.4),
            currency: params.amount.currency,
            formatted: formatMoney({ amount_minor: Math.round(params.amount.amount_minor * 0.4), currency: params.amount.currency })
          },
          due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          status: 'PENDING'
        },
        {
          id: `ms-${Date.now()}-2`,
          title: 'Final Milestone: Project Delivery & Handoff',
          description: 'Final deliverables, source files, and developer walk-through.',
          amount: {
            amount_minor: Math.round(params.amount.amount_minor * 0.6),
            currency: params.amount.currency,
            formatted: formatMoney({ amount_minor: Math.round(params.amount.amount_minor * 0.6), currency: params.amount.currency })
          },
          due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          status: 'PENDING'
        }
      ],
      deliverables: [],
      created_at: new Date().toISOString()
    };

    setProjectsList(prev => [newProject, ...prev]);

    // Update referral status to HIRED
    if (params.referral) {
      setReferralsList(prev =>
        prev.map(r => (r.id === params.referral!.id ? { ...r, status: 'HIRED' } : r))
      );
    }

    return newProject;
  };

  const createProjectFromService = (
    talent: TalentProfile,
    service?: Service,
    referral?: any,
    clientName: string = 'David Kamau'
  ): Project => {
    const projectAmount: Money = service ? service.price : talent.starting_price;
    const title = service
      ? `${service.title} for ${clientName}`
      : `Professional Engagement with ${talent.full_name}`;

    return createProject({
      title,
      talent,
      client: {
        id: 'user-client-kenya',
        name: clientName,
        country: 'Kenya'
      },
      referral,
      service,
      amount: projectAmount
    });
  };

  const fundProject = async (projectId: string): Promise<boolean> => {
    const project = projectsList.find(p => p.id === projectId);
    if (!project) return false;

    const txId = `tx-${Math.random().toString(36).substring(2, 9)}`;
    const newTx: Transaction = {
      id: txId,
      reference_code: `TXN-RF-${Math.floor(100000 + Math.random() * 900000)}`,
      project_id: projectId,
      referral_id: project.referral_id,
      type: 'PROJECT_PAYMENT_PROTECTION_HOLD',
      amount: project.client_total_amount,
      original_currency: project.currency,
      settlement_currency: project.currency,
      payment_provider: 'Refeir Protected Payments Rail',
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      ledger_entries: [
        {
          id: `le-${Date.now()}-1`,
          transaction_id: txId,
          account_id: project.client_id,
          account_name: project.client_name,
          entry_type: 'DEBIT',
          amount: project.client_total_amount,
          description: `Client payment for ${project.title}`,
          timestamp: new Date().toISOString()
        },
        {
          id: `le-${Date.now()}-2`,
          transaction_id: txId,
          account_id: 'refeir-protection-vault',
          account_name: 'Refeir Protected Trust Vault Pool',
          entry_type: 'CREDIT',
          amount: project.client_total_amount,
          description: 'Funds locked in protected custody pending milestone approvals',
          timestamp: new Date().toISOString()
        }
      ]
    };

    setTransactions(prev => [newTx, ...prev]);
    setProjectsList(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'FUNDED',
            milestones: p.milestones.map((m, idx) => ({
              ...m,
              status: idx === 0 ? 'FUNDED' : 'PENDING'
            }))
          };
        }
        return p;
      })
    );

    if (project.referral_id) {
      setReferralsList(prev =>
        prev.map(r => (r.id === project.referral_id ? { ...r, status: 'FUNDED' } : r))
      );
    }

    return true;
  };

  const submitProjectDeliverable = (
    projectId: string,
    milestoneId: string,
    title: string,
    message: string,
    assets?: {
      github_pr_url?: string;
      figma_url?: string;
      staging_url?: string;
      apk_download_url?: string;
      fileName?: string;
    }
  ) => {
    const project = projectsList.find(p => p.id === projectId);
    const milestone = project?.milestones.find(m => m.id === milestoneId);

    const newDeliverable: Deliverable = {
      id: `del-${Date.now()}`,
      project_id: projectId,
      milestone_id: milestoneId,
      milestone_title: milestone?.title || 'Milestone Deliverable',
      title,
      message,
      github_pr_url: assets?.github_pr_url,
      figma_url: assets?.figma_url,
      staging_url: assets?.staging_url,
      apk_download_url: assets?.apk_download_url,
      file_name: assets?.fileName || 'Refeir_Deliverables_Package.zip',
      submitted_at: new Date().toISOString(),
      status: 'PENDING_REVIEW'
    };

    setProjectsList(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'SUBMITTED',
            deliverables: [newDeliverable, ...(p.deliverables || [])],
            milestones: p.milestones.map(m => (m.id === milestoneId ? { ...m, status: 'SUBMITTED' } : m))
          };
        }
        return p;
      })
    );
  };

  const requestMilestoneRevision = (
    projectId: string,
    milestoneId: string,
    deliverableId: string,
    revisionNotes: string
  ) => {
    setProjectsList(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'IN_PROGRESS',
            deliverables: (p.deliverables || []).map(d =>
              d.id === deliverableId
                ? { ...d, status: 'REVISION_REQUESTED', revision_notes: revisionNotes }
                : d
            ),
            milestones: p.milestones.map(m =>
              m.id === milestoneId ? { ...m, status: 'IN_PROGRESS' } : m
            )
          };
        }
        return p;
      })
    );
  };

  const approveMilestone = (projectId: string, milestoneId: string) => {
    setProjectsList(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const updatedMilestones = p.milestones.map(m =>
            m.id === milestoneId ? { ...m, status: 'APPROVED' as const } : m
          );
          const updatedDeliverables = (p.deliverables || []).map(d =>
            d.milestone_id === milestoneId ? { ...d, status: 'APPROVED' as const } : d
          );
          const allApproved = updatedMilestones.every(m => m.status === 'APPROVED' || m.status === 'RELEASED');
          return {
            ...p,
            status: allApproved ? 'COMPLETED' : 'IN_PROGRESS',
            milestones: updatedMilestones,
            deliverables: updatedDeliverables
          };
        }
        return p;
      })
    );
  };

  const getActiveAirfeeToken = (scoutId: string): AirfeeToken | undefined => {
    const now = new Date().toISOString();
    return airfeeTokens.find(t => t.issued_to_scout_id === scoutId && t.is_active && t.expires_at > now);
  };

  const issueAirfeeToken = (scoutId: string, clientName?: string): AirfeeToken => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    const existing = getActiveAirfeeToken(scoutId);
    if (existing) {
      const updated: AirfeeToken = {
        ...existing,
        client_referrals_count: existing.client_referrals_count + 1
      };
      setAirfeeTokens(prev => prev.map(t => (t.id === existing.id ? updated : t)));
      return updated;
    }

    const newToken: AirfeeToken = {
      id: `token-${scoutId}-${Date.now()}`,
      code: `RF-AIRTOKEN-${year}-${String(month + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
      issued_to_scout_id: scoutId,
      issued_at: now.toISOString(),
      expires_at: endOfMonth.toISOString(),
      is_active: true,
      month_label: monthName,
      client_referrals_count: 1,
      airfee_discount_percent: 2
    };

    setAirfeeTokens(prev => [newToken, ...prev]);
    return newToken;
  };

  const generateClientIntroLink = (scoutId: string, scoutName: string) => {
    const origin = window.location.origin;
    const cleanCode = `SCOUT-${scoutName.replace(/\s+/g, '').toUpperCase()}`;
    return {
      link: `${origin}/client-intro?scout=${scoutId}&code=${cleanCode}`,
      code: cleanCode
    };
  };

  const submitClientIntroduction = (
    scoutId: string,
    scoutName: string,
    clientContactName: string,
    companyName: string,
    clientEmail?: string,
    clientPhone?: string
  ): ClientIntroduction => {
    const cleanCode = `SCOUT-${scoutName.replace(/\s+/g, '').toUpperCase()}`;
    const newIntro: ClientIntroduction = {
      id: `intro-${Date.now()}`,
      scout_id: scoutId,
      scout_name: scoutName,
      client_contact_name: clientContactName.trim(),
      company_name: companyName.trim(),
      client_email: clientEmail?.trim(),
      client_phone: clientPhone?.trim(),
      referral_link_code: cleanCode,
      status: 'PENDING_VERIFICATION',
      has_registered: false,
      has_closed_deal: false,
      created_at: new Date().toISOString()
    };

    setClientIntroductionsList(prev => [newIntro, ...prev]);

    // Audit log
    const auditEntry: AuditLog = {
      id: `aud-intro-${Date.now()}`,
      actor_id: scoutId,
      actor_name: scoutName,
      action: 'CLIENT_INTRODUCTION_SUBMITTED',
      object_type: 'CLIENT_INTRO',
      object_id: newIntro.id,
      timestamp: new Date().toISOString(),
      ip_address: '102.89.44.12',
      country: 'Nigeria',
      reason: `Scout registered invite for ${clientContactName} (${companyName}). Token pending registration, deal closure & admin manual verification.`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return newIntro;
  };

  const approveAndGrantAirfeeToken = (introductionId: string, adminNotes?: string): boolean => {
    const intro = clientIntroductionsList.find(i => i.id === introductionId);
    if (!intro) return false;

    // Issue new active token to scout
    const token = issueAirfeeToken(intro.scout_id, intro.client_contact_name);

    setClientIntroductionsList(prev =>
      prev.map(i =>
        i.id === introductionId
          ? {
              ...i,
              status: 'VERIFIED_GRANTED',
              granted_token_code: token.code,
              verified_at: new Date().toISOString(),
              admin_notes: adminNotes || 'Admin confirmed matching Hiring Manager & Company name and verified completed project deal.'
            }
          : i
      )
    );

    // Audit log
    const auditEntry: AuditLog = {
      id: `aud-airgrant-${Date.now()}`,
      actor_id: 'admin-governance-officer',
      actor_name: 'Admin Compliance & Verification Team',
      action: 'AIRFEE_TOKEN_MANUALLY_GRANTED',
      object_type: 'AIRFEE_TOKEN',
      object_id: token.id,
      timestamp: new Date().toISOString(),
      ip_address: '197.210.8.44',
      country: 'Pan-Africa Admin',
      reason: `Verified ${intro.client_contact_name} at ${intro.company_name} closed a deal. Token ${token.code} manually awarded to Scout ${intro.scout_name}.`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return true;
  };

  const rejectClientIntroduction = (introductionId: string, reason: string) => {
    setClientIntroductionsList(prev =>
      prev.map(i =>
        i.id === introductionId
          ? {
              ...i,
              status: 'REJECTED',
              admin_notes: reason || 'Details do not match or client did not close any hired project.'
            }
          : i
      )
    );

    // Audit log
    const auditEntry: AuditLog = {
      id: `aud-reject-${Date.now()}`,
      actor_id: 'admin-governance-officer',
      actor_name: 'Admin Compliance & Verification Team',
      action: 'CLIENT_INTRODUCTION_REJECTED',
      object_type: 'CLIENT_INTRO',
      object_id: introductionId,
      timestamp: new Date().toISOString(),
      ip_address: '197.210.8.44',
      country: 'Pan-Africa Admin',
      reason: `Client introduction rejected: ${reason}`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  const completeAndSettleProject = (projectId: string) => {
    const project = projectsList.find(p => p.id === projectId);
    if (!project) return;

    const completedTime = new Date().toISOString();

    // Calculate dynamic Airfee and Net Rewards
    const scoutId = project.scout_id;
    const hasToken = scoutId ? !!getActiveAirfeeToken(scoutId) : false;
    const breakdown = calculateProjectBreakdown(
      project.project_amount,
      project.referral_percentage,
      project.platform_fee_percent,
      hasToken
    );

    const netScoutReward = breakdown.scout_net_reward_amount;
    const airfeeAmount = breakdown.airfee_amount;

    // 1. Update Project Status to SETTLED
    setProjectsList(prev =>
      prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              status: 'SETTLED',
              completed_at: p.completed_at || completedTime,
              settled_at: completedTime,
              milestones: p.milestones.map(m => ({ ...m, status: 'RELEASED' }))
            }
          : p
      )
    );

    // 2. Credit Talent Wallet with net amount
    setWallets(prev => {
      const talentId = project.talent_id;
      const curr = project.currency;
      const currentWallet = prev[talentId] || {
        user_id: talentId,
        balances: {},
        payout_methods: []
      };

      const existingBalance = currentWallet.balances[curr] || {
        currency: curr,
        available_minor: 0,
        pending_minor: 0,
        processing_minor: 0
      };

      return {
        ...prev,
        [talentId]: {
          ...currentWallet,
          balances: {
            ...currentWallet.balances,
            [curr]: {
              ...existingBalance,
              available_minor: existingBalance.available_minor + project.talent_net_amount.amount_minor
            }
          }
        }
      };
    });

    // 3. Credit Scout Commission (with 0% forever on <=10% or Airfee Token, and 2% Airfee deducted if >10%)
    if (scoutId && netScoutReward.amount_minor > 0) {
      setWallets(prev => {
        const curr = project.currency;
        const currentWallet = prev[scoutId] || {
          user_id: scoutId,
          balances: {},
          payout_methods: []
        };

        const existingBalance = currentWallet.balances[curr] || {
          currency: curr,
          available_minor: 0,
          pending_minor: 0,
          processing_minor: 0
        };

        return {
          ...prev,
          [scoutId]: {
            ...currentWallet,
            balances: {
              ...currentWallet.balances,
              [curr]: {
                ...existingBalance,
                available_minor: existingBalance.available_minor + netScoutReward.amount_minor
              }
            }
          }
        };
      });

      // Update commission status to PAID
      setCommissionsList(prev =>
        prev.map(c =>
          c.project_id === projectId
            ? { ...c, state: 'PAID', paid_at: completedTime, amount: netScoutReward }
            : c
        )
      );

      // Update referral status to PAID
      if (project.referral_id) {
        setReferralsList(prev =>
          prev.map(r => (r.id === project.referral_id ? { ...r, status: 'PAID' } : r))
        );
      }
    }

    // 4. Create Ledger Entries for Settlement
    const txId = `tx-${Math.random().toString(36).substring(2, 9)}`;
    const settleTx: Transaction = {
      id: txId,
      reference_code: `SETTLE-RF-${Math.floor(100000 + Math.random() * 900000)}`,
      project_id: projectId,
      referral_id: project.referral_id,
      type: 'TALENT_EARNING_RELEASE',
      amount: project.project_amount,
      original_currency: project.currency,
      settlement_currency: project.currency,
      payment_provider: 'Refeir Commission & Settlement Engine',
      status: 'SUCCESS',
      timestamp: completedTime,
      ledger_entries: [
        {
          id: `le-rel-1`,
          transaction_id: txId,
          account_id: 'refeir-protection-vault',
          account_name: 'Refeir Protected Trust Vault Pool',
          entry_type: 'DEBIT',
          amount: project.project_amount,
          description: `Settlement release for project ${project.title}`,
          timestamp: completedTime
        },
        {
          id: `le-rel-2`,
          transaction_id: txId,
          account_id: project.talent_id,
          account_name: project.talent_name,
          entry_type: 'CREDIT',
          amount: project.talent_net_amount,
          description: `Net earnings credited to talent after scout reward`,
          timestamp: completedTime
        },
        ...(scoutId
          ? [
              {
                id: `le-rel-3`,
                transaction_id: txId,
                account_id: scoutId,
                account_name: project.scout_name || 'Scout',
                entry_type: 'CREDIT' as const,
                amount: netScoutReward,
                description: `Locked ${project.referral_percentage}% referral reward credited to Scout (${breakdown.airfee_percentage}% Airfee applied)`,
                timestamp: completedTime
              },
              ...(airfeeAmount.amount_minor > 0
                ? [
                    {
                      id: `le-rel-4`,
                      transaction_id: txId,
                      account_id: 'refeir-treasury',
                      account_name: 'Refeir Platform Treasury',
                      entry_type: 'CREDIT' as const,
                      amount: airfeeAmount,
                      description: `2% Airfee collected on >10% referral proceeds for ${project.title}`,
                      timestamp: completedTime
                    }
                  ]
                : [])
            ]
          : [])
      ]
    };

    setTransactions(prev => [settleTx, ...prev]);
  };

  const requestPayout = async (
    userId: string, 
    amount: Money, 
    method: PayoutMethod,
    user?: User | null
  ): Promise<boolean> => {
    const userWallet = wallets[userId];
    if (!userWallet) return false;

    // Strict Rule & Algorithm:
    // 1. User must be KYC verified and have completed tax information
    // 2. The right, compatible payment channel must be legitimately linked
    const transferEligibility = evaluatePaymentTransferEligibility(user, userWallet, amount.currency, method);
    if (!transferEligibility.canTransfer) {
      return false;
    }

    const curr = amount.currency;
    const balance = userWallet.balances[curr];
    if (!balance || balance.available_minor < amount.amount_minor) {
      return false;
    }

    // Call Payout Provider
    const result = await defaultPayoutProvider.createPayout({
      user_id: userId,
      amount,
      payout_method: method
    });

    if (result.status === 'COMPLETED') {
      // Deduct from wallet
      setWallets(prev => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          balances: {
            ...prev[userId].balances,
            [curr]: {
              ...prev[userId].balances[curr],
              available_minor: prev[userId].balances[curr].available_minor - amount.amount_minor
            }
          }
        }
      }));

      // Log transaction
      const txId = `tx-po-${Date.now()}`;
      const tx: Transaction = {
        id: txId,
        reference_code: result.payout_reference,
        type: 'PAYOUT_WITHDRAWAL',
        amount,
        original_currency: curr,
        settlement_currency: curr,
        payment_provider: defaultPayoutProvider.provider_name,
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        ledger_entries: [
          {
            id: `le-po-1`,
            transaction_id: txId,
            account_id: userId,
            account_name: method.account_holder_name,
            entry_type: 'DEBIT',
            amount,
            description: `Withdrawal via ${method.institution_name} (${method.masked_identifier})`,
            timestamp: new Date().toISOString()
          }
        ]
      };
      setTransactions(prev => [tx, ...prev]);
      return true;
    }
    return false;
  };

  const raiseDispute = (projectId: string, user: { id: string; name: string; role: any }, reason: string, description: string) => {
    const project = projectsList.find(p => p.id === projectId);
    if (!project) return;

    const newDispute: Dispute = {
      id: `DISP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      project_id: projectId,
      project_title: project.title,
      initiated_by_id: user.id,
      initiated_by_name: user.name,
      initiated_by_role: user.role,
      reason,
      description,
      evidence_urls: [],
      disputed_amount: project.project_amount,
      status: 'OPEN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setDisputesList(prev => [newDispute, ...prev]);
    setProjectsList(prev =>
      prev.map(p => (p.id === projectId ? { ...p, status: 'DISPUTED', dispute_id: newDispute.id } : p))
    );
  };

  const resolveDispute = (
    disputeId: string,
    resolution: 'RESOLVED_CLIENT' | 'RESOLVED_TALENT' | 'PARTIAL_SETTLEMENT',
    notes: string
  ) => {
    setDisputesList(prev =>
      prev.map(d => (d.id === disputeId ? { ...d, status: resolution, resolution_notes: notes, updated_at: new Date().toISOString() } : d))
    );
  };

  const updateCountryStatus = (countryId: string, updates: Partial<CountryComplianceSetting>) => {
    setCountrySettings(prev => ({
      ...prev,
      [countryId]: {
        ...prev[countryId],
        ...updates
      }
    }));
  };

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => ({
      ...prev,
      ...settings
    }));
  };

  const postJob = (job: Partial<Job>): Job => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      client_id: job.client_id || 'user-client-kenya',
      client_name: job.client_name || 'David Kamau',
      client_country: job.client_country || 'Kenya',
      title: job.title || 'New African Project Opportunity',
      description: job.description || '',
      category: job.category || 'Development & Tech',
      skills: job.skills || ['React', 'Node.js'],
      budget: job.budget || createMoney(300000, 'KES'),
      deadline: job.deadline || '30 Days',
      country_preference: job.country_preference || 'Africa-wide',
      remote: job.remote !== undefined ? job.remote : true,
      proposals_count: 0,
      status: 'OPEN',
      created_at: new Date().toISOString()
    };
    setJobsList(prev => [newJob, ...prev]);
    return newJob;
  };

  const createService = (service: Partial<Service>): Service => {
    const newService: Service = {
      id: `srv-${Date.now()}`,
      talent_id: service.talent_id || 'talent-amaka-nwosu',
      talent_name: service.talent_name || 'Amaka Nwosu',
      talent_avatar: service.talent_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      talent_country: service.talent_country || 'Nigeria',
      talent_rating: 5.0,
      title: service.title || 'Custom Professional Service',
      category: service.category || 'Design & Creative',
      description: service.description || '',
      skills: service.skills || ['Product Design', 'Figma'],
      price: service.price || createMoney(300000, 'NGN'),
      pricing_type: service.pricing_type || 'FIXED',
      delivery_days: service.delivery_days || 7,
      revisions: service.revisions || 3,
      referral_percentage: service.referral_percentage || 10,
      availability: true,
      country_availability: service.country_availability || ['ALL'],
      remote_availability: service.remote_availability !== undefined ? service.remote_availability : true,
      image_url: service.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString()
    };
    setServicesList(prev => [newService, ...prev]);
    return newService;
  };

  const getUserWallet = (userId: string): Wallet => {
    return (
      wallets[userId] || {
        user_id: userId,
        balances: {
          NGN: { currency: 'NGN', available_minor: 0, pending_minor: 0, processing_minor: 0 },
          GHS: { currency: 'GHS', available_minor: 0, pending_minor: 0, processing_minor: 0 },
          KES: { currency: 'KES', available_minor: 0, pending_minor: 0, processing_minor: 0 },
          USD: { currency: 'USD', available_minor: 0, pending_minor: 0, processing_minor: 0 }
        },
        payout_methods: []
      }
    );
  };
  const addPayoutMethod = (userId: string, method: Omit<PayoutMethod, 'id'>): PayoutMethod => {
    const newMethod: PayoutMethod = {
      ...method,
      id: `pm-${Date.now()}`
    };

    setWallets(prev => {
      const currentWallet = prev[userId] || {
        user_id: userId,
        balances: {
          NGN: { currency: 'NGN', available_minor: 0, pending_minor: 0, processing_minor: 0 },
          GHS: { currency: 'GHS', available_minor: 0, pending_minor: 0, processing_minor: 0 },
          KES: { currency: 'KES', available_minor: 0, pending_minor: 0, processing_minor: 0 },
          USD: { currency: 'USD', available_minor: 0, pending_minor: 0, processing_minor: 0 }
        },
        payout_methods: []
      };

      let updatedMethods = [...currentWallet.payout_methods];
      if (newMethod.is_default || updatedMethods.length === 0) {
        newMethod.is_default = true;
        updatedMethods = updatedMethods.map(m => ({ ...m, is_default: false }));
      }
      updatedMethods.push(newMethod);

      return {
        ...prev,
        [userId]: {
          ...currentWallet,
          payout_methods: updatedMethods
        }
      };
    });

    return newMethod;
  };

  const setDefaultPayoutMethod = (userId: string, methodId: string) => {
    setWallets(prev => {
      const currentWallet = prev[userId];
      if (!currentWallet) return prev;

      return {
        ...prev,
        [userId]: {
          ...currentWallet,
          payout_methods: currentWallet.payout_methods.map(m => ({
            ...m,
            is_default: m.id === methodId
          }))
        }
      };
    });
  };

  const deletePayoutMethod = (userId: string, methodId: string) => {
    setWallets(prev => {
      const currentWallet = prev[userId];
      if (!currentWallet) return prev;

      const remaining = currentWallet.payout_methods.filter(m => m.id !== methodId);
      if (remaining.length > 0 && !remaining.some(m => m.is_default)) {
        remaining[0].is_default = true;
      }

      return {
        ...prev,
        [userId]: {
          ...currentWallet,
          payout_methods: remaining
        }
      };
    });
  };

  // --- REVIEWS & SCORECARDS IMPLEMENTATION ---

  const submitReview = (reviewData: Omit<Review, 'id' | 'created_at'>): Review => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };

    setReviewsList(prev => [newReview, ...prev]);

    // Mark any matching pending review request as completed
    setReviewRequestsList(prev =>
      prev.map(req =>
        req.target_id === reviewData.author_id && req.requester_id === reviewData.target_id
          ? { ...req, status: 'COMPLETED' }
          : req
      )
    );

    // Update Talent rating & reviews count if talent was reviewed
    if (reviewData.target_role === 'TALENT') {
      setTalentList(prev =>
        prev.map(t => {
          if (t.id === reviewData.target_id || t.user_id === reviewData.target_id) {
            const allTargetReviews = [newReview, ...reviewsList.filter(r => (r.target_id === t.id || r.target_id === t.user_id) && r.id !== newReview.id)];
            const avgRating = allTargetReviews.reduce((sum, r) => sum + r.rating_overall, 0) / allTargetReviews.length;
            return {
              ...t,
              rating: parseFloat(avgRating.toFixed(1)),
              reviews_count: allTargetReviews.length
            };
          }
          return t;
        })
      );
    }

    return newReview;
  };

  const requestReview = (requestData: Omit<ReviewRequest, 'id' | 'status' | 'created_at'>): ReviewRequest => {
    const newRequest: ReviewRequest = {
      ...requestData,
      id: `req-rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    setReviewRequestsList(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const respondToReviewRequest = (requestId: string, action: 'COMPLETED' | 'DECLINED') => {
    setReviewRequestsList(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: action } : r))
    );
  };

  const getReviewsForTarget = (targetId: string, type?: ReviewType): Review[] => {
    return reviewsList.filter(r => {
      const matchTarget = r.target_id === targetId || r.author_id === targetId;
      if (!matchTarget) return false;
      if (type && r.review_type !== type) return false;
      return true;
    });
  };

  const getClientScorecard = (clientId: string, clientName?: string): ClientReputationScorecard => {
    const clientReviews = reviewsList.filter(r => r.target_id === clientId && (r.review_type === 'TALENT_TO_CLIENT' || r.review_type === 'SCOUT_TO_CLIENT'));
    if (CLIENT_SCORECARDS[clientId] && clientReviews.length === 0) {
      return CLIENT_SCORECARDS[clientId];
    }

    if (clientReviews.length === 0) {
      return {
        client_id: clientId,
        client_name: clientName || 'Verified Refeir Client',
        total_reviews_count: 0,
        overall_rating: 5.0,
        pays_well_score: 5.0,
        pays_on_time_percentage: 100,
        on_time_release_count: 0,
        total_funded_projects: 1,
        verified_payer_status: true,
        top_badges: ['⚡ 100% On-Time Payer', '💎 Fair Rates Guaranteed', '🛡️ Escrow Verified']
      };
    }

    const avgOverall = clientReviews.reduce((sum, r) => sum + r.rating_overall, 0) / clientReviews.length;
    const paysWellReviews = clientReviews.filter(r => typeof r.rating_pays_well === 'number');
    const avgPaysWell = paysWellReviews.length > 0
      ? paysWellReviews.reduce((sum, r) => sum + (r.rating_pays_well || 5), 0) / paysWellReviews.length
      : 5.0;

    const paysOnTimeReviews = clientReviews.filter(r => typeof r.rating_pays_on_time === 'number');
    const onTimeCount = paysOnTimeReviews.filter(r => (r.rating_pays_on_time || 5) >= 4).length;
    const onTimePercent = paysOnTimeReviews.length > 0 ? Math.round((onTimeCount / paysOnTimeReviews.length) * 100) : 100;

    const allBadges = Array.from(new Set(clientReviews.flatMap(r => r.endorsement_badges || [])));
    if (allBadges.length === 0) {
      allBadges.push('⚡ Prompt Payer', '💎 Competitive Rates', '🤝 Verified Client');
    }

    return {
      client_id: clientId,
      client_name: clientName || 'Verified Client',
      total_reviews_count: clientReviews.length,
      overall_rating: parseFloat(avgOverall.toFixed(1)),
      pays_well_score: parseFloat(avgPaysWell.toFixed(1)),
      pays_on_time_percentage: onTimePercent,
      on_time_release_count: onTimeCount,
      total_funded_projects: clientReviews.length,
      verified_payer_status: true,
      top_badges: allBadges.slice(0, 4)
    };
  };

  return (
    <MarketplaceContext.Provider
      value={{
        talentList,
        servicesList,
        scoutsList,
        jobsList,
        projectsList,
        referralsList,
        wallets,
        transactions,
        ledgerEntries,
        commissionsList,
        disputesList,
        riskFlagsList,
        auditLogs,
        platformSettings,
        countrySettings,
        countries: AFRICAN_COUNTRIES,
        airfeeTokens,
        clientIntroductionsList,
        reviewsList,
        reviewRequestsList,
        createReferral,
        getReferralByCode,
        trackReferralClick,
        createProject,
        createProjectFromService,
        fundProject,
        submitProjectDeliverable,
        requestMilestoneRevision,
        approveMilestone,
        completeAndSettleProject,
        requestPayout,
        raiseDispute,
        resolveDispute,
        updateCountryStatus,
        updatePlatformSettings,
        postJob,
        createService,
        getUserWallet,
        addPayoutMethod,
        setDefaultPayoutMethod,
        deletePayoutMethod,
        issueAirfeeToken,
        getActiveAirfeeToken,
        generateClientIntroLink,
        submitClientIntroduction,
        approveAndGrantAirfeeToken,
        rejectClientIntroduction,
        submitReview,
        requestReview,
        respondToReviewRequest,
        getReviewsForTarget,
        getClientScorecard
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within a MarketplaceProvider');
  return context;
};
