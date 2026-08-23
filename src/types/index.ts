// ============================================================================
// REFEIR MARKETPLACE — CORE DOMAIN TYPES
// ============================================================================

export type AfricanRegion = 
  | 'West Africa'
  | 'East Africa'
  | 'Central Africa'
  | 'North Africa'
  | 'Southern Africa';

export type CountryMarketplaceStatus =
  | 'FULLY_OPERATIONAL'
  | 'PAYMENTS_ENABLED'
  | 'PAYOUTS_ENABLED'
  | 'MARKETPLACE_ONLY'
  | 'COMING_SOON';

export interface Country {
  id: string;
  name: string;
  iso_code: string;       // e.g. "NG", "GH", "KE", "ZA"
  iso3_code: string;      // e.g. "NGA", "GHA", "KEN", "ZAF"
  country_code: string;   // e.g. "+234", "+233", "+254", "+27"
  currency_code: string;  // e.g. "NGN", "GHS", "KES", "ZAR", "USD"
  currency_symbol: string;// e.g. "₦", "GH₵", "KSh", "R", "$"
  flag_emoji: string;
  region: AfricanRegion;
  timezone: string;       // e.g. "Africa/Lagos", "Africa/Accra"
  languages: string[];
  status: CountryMarketplaceStatus;
  payment_availability: boolean;
  verification_availability: boolean;
  payout_availability: boolean;
  popular_cities: string[];
}

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  minor_unit: number;    // e.g. 100 for cents/kobo (1 NGN = 100 kobo)
  symbol_position: 'prefix' | 'suffix';
  exchange_rate_to_usd: number;
}

export interface Money {
  amount_minor: number;   // Integer minor units (e.g. 50000000 kobo = NGN 500,000)
  currency: string;
  formatted?: string;
}

// User & Roles
export type UserRole = 'CLIENT' | 'TALENT' | 'SCOUT' | 'BUSINESS' | 'ADMIN';

export type VerificationStatus = 
  | 'UNVERIFIED'
  | 'EMAIL_VERIFIED'
  | 'PHONE_VERIFIED'
  | 'IDENTITY_VERIFIED'
  | 'PROFESSION_VERIFIED'
  | 'REJECTED';

export type ScoutTier = 'Scout' | 'Verified Scout' | 'Professional Scout' | 'Elite Scout';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;        // Country name or ISO
  city: string;
  primary_language: string;
  timezone: string;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  skills?: string[];
  roles: UserRole[];
  active_role: UserRole;
  verification_status: VerificationStatus;
  created_at: string;
  // Refeir Pro Subscriptions
  is_pro?: boolean;
  pro_tier?: 'SCOUT_PRO' | 'TALENT_PRO' | 'CLIENT_PRO';
  pro_subscribed_at?: string;
  pro_expires_at?: string;
  airfee_tokens_balance?: number;       // For Scouts: Auto-awarded Airfee tokens for 0% fee rate
  is_featured_talent?: boolean;         // For Talents: Boosted placement in Featured Talents
  refeir_desk_enabled?: boolean;        // For Clients: Direct concierge recommendation from Refeir Desk
  // Role Onboarding Details & Access Gate
  scout_onboarding_completed?: boolean;
  scout_specialty?: string;
  scout_payout_preference?: string;
  scout_network_size?: string;
  talent_onboarding_completed?: boolean;
  talent_years_experience?: number;
  talent_starting_rate?: number;
  talent_rate_currency?: string;
  talent_availability?: string;
  client_onboarding_completed?: boolean;
  company_name?: string;
  company_industry?: string;
  company_size?: string;
  client_hiring_scope?: string;
  client_billing_currency?: string;
  // Tax Compliance Profile (Nigeria & International)
  tax_country?: string;
  tax_id_type?: TaxIdType;
  tax_id_number?: string;
  tax_business_type?: TaxBusinessType;
  registered_company_rc?: string;
  vat_registered?: boolean;
  vat_id_number?: string;
  tax_withholding_rate?: number;
  tax_exemption_status?: 'NONE' | 'W8_BEN_FILED' | 'FIRS_EXEMPT' | 'TREATY_EXEMPT';
}

// Tax Compliance Types
export type TaxIdType =
  | 'NIGERIA_TIN'
  | 'NIGERIA_NIN'
  | 'KENYA_KRA_PIN'
  | 'GHANA_CARD_TIN'
  | 'SA_SARS_PIN'
  | 'EGYPT_TAX_CARD'
  | 'RWANDA_RRA_TIN'
  | 'US_W8BEN_EIN_SSN'
  | 'UK_UTR_NIN'
  | 'EU_VAT_NUMBER'
  | 'INTERNATIONAL_TAX_ID';

export type TaxBusinessType =
  | 'INDIVIDUAL_FREELANCER'
  | 'REGISTERED_BUSINESS'
  | 'CORPORATION_ENTERPRISE'
  | 'TAX_EXEMPT_ORGANIZATION';

export interface TaxJurisdictionInfo {
  country: string;
  country_code: string;
  tax_authority: string;        // e.g. "FIRS (Federal Inland Revenue Service)", "KRA", "GRA", "SARS"
  primary_tax_id_name: string;  // e.g. "TIN (Tax Identification Number)", "KRA PIN"
  tax_id_placeholder: string;   // e.g. "23819024-0001"
  vat_rate_percent: number;     // e.g. 7.5% in Nigeria, 16% in Kenya
  withholding_tax_percent: number; // e.g. 5% in Nigeria, 5% in Kenya
  is_headquarters: boolean;     // true for Nigeria
  compliance_notes: string;
}

export interface StatementItem {
  id: string;
  reference_code: string;
  timestamp: string;
  date_formatted: string;
  description: string;
  counterparty?: string;
  category: 'ESCROW_DEPOSIT' | 'MILESTONE_RELEASE' | 'SCOUT_COMMISSION' | 'WITHDRAWAL_PAYOUT' | 'AIRFEE_SAVING' | 'PLATFORM_FEE' | 'TAX_DEDUCTION';
  type: 'CREDIT' | 'DEBIT';
  amount: Money;
  vat_amount?: Money;
  wht_amount?: Money;
  balance_after: Money;
  status: 'COMPLETED' | 'PENDING' | 'CLEARED';
}

export interface StatementSummary {
  statement_number: string;
  generated_at: string;
  period_label: string;
  start_date: string;
  end_date: string;
  user_name: string;
  user_email: string;
  user_id: string;
  user_role: UserRole;
  user_country: string;
  tax_id_display: string;
  currency: string;
  opening_balance_minor: number;
  total_credits_minor: number;
  total_debits_minor: number;
  total_vat_minor: number;
  total_wht_minor: number;
  closing_balance_minor: number;
  transactions_count: number;
  digital_signature_hash: string;
}

// Talent Profile
export interface TalentProfile {
  id: string;
  user_id: string;
  full_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  country_id: string;
  country_name: string;
  city: string;
  timezone: string;
  skills: string[];
  languages: string[];
  experience_years: number;
  education: string;
  starting_price: Money;
  referral_percentage: number; // e.g. 10 (%)
  availability: 'Full-time' | 'Part-time' | 'Contract' | 'Available Now';
  response_time: string;
  rating: number;             // 1-5
  reviews_count: number;
  completed_projects: number;
  completion_rate: number;    // e.g. 98 (%)
  verification_status: VerificationStatus;
  is_pro?: boolean;           // Refeir Pro subscriber
  is_featured?: boolean;      // Featured Talent in Carousel & Top Ranking
  pro_badge?: string;         // e.g. "Refeir Pro Featured"
  portfolio: PortfolioItem[];
  services_count?: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  project_url?: string;
}

// Service
export type PricingType = 'FIXED' | 'HOURLY' | 'MONTHLY' | 'CUSTOM_QUOTE';

export interface Service {
  id: string;
  talent_id: string;
  talent_name: string;
  talent_avatar: string;
  talent_country: string;
  talent_rating: number;
  title: string;
  category: string;
  description: string;
  skills: string[];
  price: Money;
  pricing_type: PricingType;
  delivery_days: number;
  revisions: number | 'Unlimited';
  referral_percentage: number; // Locked referral % for this service
  availability: boolean;
  country_availability: string[]; // ['ALL'] or specific country ISOs
  remote_availability: boolean;
  image_url: string;
  created_at: string;
}

// Scout Profile
export interface ScoutProfile {
  id: string;
  user_id: string;
  full_name: string;
  headline: string;
  avatar_url: string;
  country_name: string;
  tier: ScoutTier;
  successful_referrals: number;
  projects_generated_value: Money;
  total_earned: Money;
  countries_referred: string[];
  client_satisfaction: number; // 1-5
  dispute_rate: number;        // e.g. 0.5%
  is_public_earnings: boolean;
  is_pro?: boolean;
  airfee_token_balance?: number;
  airfee_waiver_active?: boolean;
}

// Jobs & Proposals
export interface Job {
  id: string;
  client_id: string;
  client_name: string;
  client_country: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: Money;
  deadline: string;
  country_preference: string; // 'Africa-wide' or specific country/region
  remote: boolean;
  proposals_count: number;
  status: 'OPEN' | 'IN_REVIEW' | 'HIRED' | 'CLOSED';
  created_at: string;
}

export interface Proposal {
  id: string;
  job_id: string;
  talent_id: string;
  talent_name: string;
  talent_avatar: string;
  talent_country: string;
  price: Money;
  timeline_days: number;
  cover_message: string;
  milestones?: { title: string; amount: Money }[];
  status: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  created_at: string;
}

// First-Class Referral Object
export type ReferralStatus =
  | 'CREATED'
  | 'CLICKED'
  | 'VIEWED'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL'
  | 'HIRED'
  | 'FUNDED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'ELIGIBLE'
  | 'PAID'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'VOID';

export interface Referral {
  id: string;                 // e.g. "RF-82KX29"
  referral_code: string;
  scout_id: string;
  scout_name: string;
  talent_id: string;
  talent_name: string;
  talent_avatar: string;
  service_id?: string;
  service_title?: string;
  client_id?: string;
  client_name?: string;
  country_iso: string;
  currency: string;
  locked_service_price: Money;
  locked_referral_percentage: number;
  potential_reward: Money;
  clicks_count: number;
  status: ReferralStatus;
  created_at: string;
  expires_at: string;         // 30 days attribution window
  attribution_window_days: number;
  campaign?: string;
}

export interface ReferralClickEvent {
  id: string;
  referral_id: string;
  timestamp: string;
  source: string;
  device: string;
  country: string;
  ip_masked: string;
}

// Project & State Machine
export type ProjectStatus =
  | 'DRAFT'
  | 'AWAITING_PAYMENT'
  | 'FUNDED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'REVISION_REQUESTED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'SETTLEMENT_PENDING'
  | 'SETTLED';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: Money;
  due_date: string;
  status: 'PENDING' | 'FUNDED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'RELEASED';
}

export interface Deliverable {
  id: string;
  project_id: string;
  milestone_id?: string;
  milestone_title?: string;
  title: string;
  message: string;
  github_pr_url?: string;
  figma_url?: string;
  staging_url?: string;
  apk_download_url?: string;
  file_name?: string;
  file_url?: string;
  submitted_at: string;
  status?: 'PENDING_REVIEW' | 'APPROVED' | 'REVISION_REQUESTED';
  revision_notes?: string;
}

export interface AirfeeToken {
  id: string;
  code: string;
  issued_to_scout_id: string;
  issued_at: string;
  expires_at: string;
  is_active: boolean;
  month_label: string;
  client_referrals_count: number;
  airfee_discount_percent: number;
}

export type ClientIntroductionStatus = 
  | 'PENDING_VERIFICATION'              // Scout registered invite, awaiting client registration & hire
  | 'CLIENT_REGISTERED_AWAITING_HIRE'  // Client signed up with matching details, awaiting first hired project
  | 'HIRE_COMPLETED_PENDING_ADMIN'      // Client completed project with talent, ready for manual Admin approval
  | 'VERIFIED_GRANTED'                  // Admin verified matching Hiring Manager & Company name + deal closure; Airfee Token awarded
  | 'REJECTED';                         // Admin rejected (e.g. name mismatch, client didn't register or hire)

export interface ClientIntroduction {
  id: string;
  scout_id: string;
  scout_name: string;
  client_contact_name: string;          // Hiring manager name input by scout
  company_name: string;                 // Business name input by scout
  client_email?: string;
  client_phone?: string;
  referral_link_code: string;
  status: ClientIntroductionStatus;
  has_registered: boolean;
  has_closed_deal: boolean;
  registered_client_name?: string;      // Actual client name on Refeir profile
  registered_company_name?: string;     // Actual company name on Refeir profile
  registered_client_id?: string;
  deal_project_id?: string;
  deal_project_title?: string;
  deal_amount_formatted?: string;
  admin_notes?: string;
  granted_token_code?: string;
  created_at: string;
  verified_at?: string;
}

export type ProjectOrigin = 'DIRECT_HIRE' | 'SCOUT_REFERRAL' | 'PROPOSAL_HIRE';

export interface Project {
  id: string;
  title: string;
  client_id: string;
  client_name: string;
  client_country: string;
  talent_id: string;
  talent_name: string;
  talent_avatar: string;
  talent_country: string;
  scout_id?: string;
  scout_name?: string;
  referral_id?: string;
  origin?: ProjectOrigin;
  is_proposal_hire?: boolean; // True for jobs initiated by proposal on job board (5% client + 5% talent fee)
  currency: string;
  project_amount: Money;      // Base project price
  platform_fee_percent: number;// e.g. 5%
  platform_fee_amount: Money; // 5% fee paid by client
  talent_platform_fee_percent?: number; // 5% for proposal hires deducted from talent
  talent_platform_fee_amount?: Money;   // 5% talent fee
  direct_facilitation_rate_percent?: number; // Referral rate taken by Refeir when direct hire has no scout
  client_total_amount: Money; // Project amount + platform fee
  referral_percentage: number;// e.g. 10%
  scout_reward_amount: Money; // 10% paid to Scout (0 if direct or proposal hire)
  talent_net_amount: Money;   // Net proceeds paid to talent
  status: ProjectStatus;
  timeline_days: number;
  milestones: Milestone[];
  deliverables: Deliverable[];
  dispute_id?: string;
  created_at: string;
  completed_at?: string;
  settled_at?: string;
}

// Financial Ledger & Wallet
export type TransactionType =
  | 'PROJECT_PAYMENT_PROTECTION_HOLD'
  | 'PLATFORM_FEE_COLLECTION'
  | 'TALENT_EARNING_RELEASE'
  | 'SCOUT_COMMISSION_CREDIT'
  | 'PAYOUT_WITHDRAWAL'
  | 'REFUND_RETURN'
  | 'DISPUTE_SETTLEMENT';

export type LedgerEntryType = 'DEBIT' | 'CREDIT';

export interface LedgerEntry {
  id: string;
  transaction_id: string;
  account_id: string;         // User wallet ID or Refeir Treasury
  account_name: string;
  entry_type: LedgerEntryType;
  amount: Money;
  description: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  reference_code: string;
  project_id?: string;
  referral_id?: string;
  type: TransactionType;
  amount: Money;
  original_currency: string;
  settlement_currency: string;
  exchange_rate?: number;
  payment_provider: string;   // e.g. 'NigeriaPaymentProvider (Paystack/Flutterwave Mock)'
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED';
  timestamp: string;
  ledger_entries: LedgerEntry[];
}

export type CommissionState =
  | 'PENDING'
  | 'LOCKED'
  | 'ELIGIBLE'
  | 'PROCESSING'
  | 'PAID'
  | 'REVERSED'
  | 'VOID'
  | 'DISPUTED';

export interface Commission {
  id: string;
  scout_id: string;
  referral_id: string;
  project_id: string;
  project_title: string;
  talent_name: string;
  client_name: string;
  eligible_amount: Money;
  referral_percentage: number;
  commission_amount: Money;
  state: CommissionState;
  hold_period_days: number;
  eligible_at: string;
  paid_at?: string;
  created_at: string;
}

export interface WalletCurrencyBalance {
  currency: string;
  available_minor: number;
  pending_minor: number;
  processing_minor: number;
}

export interface Wallet {
  user_id: string;
  balances: Record<string, WalletCurrencyBalance>; // keyed by currency e.g. "NGN", "GHS", "KES", "USD"
  payout_methods: PayoutMethod[];
}

export type PayoutMethodType = 'BANK_ACCOUNT' | 'MOBILE_MONEY' | 'OTHER';

export interface PayoutMethod {
  id: string;
  type: PayoutMethodType;
  country: string;
  currency: string;
  institution_name: string;   // e.g. "Access Bank", "M-Pesa", "MTN Mobile Money"
  masked_identifier: string;  // e.g. "•••• 3821" or "+254 •••• 890"
  account_holder_name: string;
  is_default: boolean;
}

export interface PayoutRequest {
  id: string;
  user_id: string;
  amount: Money;
  payout_method: PayoutMethod;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  provider_reference?: string;
  requested_at: string;
  completed_at?: string;
}

// Messaging
export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  text: string;
  file_url?: string;
  file_name?: string;
  timestamp: string;
}

export interface MessageThread {
  id: string;
  project_id?: string;
  project_title?: string;
  participants: { id: string; name: string; role: UserRole; avatar: string }[];
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

// Reviews & Endorsements
export type ReviewType = 
  | 'CLIENT_TO_TALENT'  // Client reviews Talent's deliverable quality, communication, speed
  | 'SCOUT_TO_TALENT'   // Scout endorses/reviews Talent's technical capabilities and reliability
  | 'TALENT_TO_CLIENT'  // Talent reviews Client on payment fairness, punctuality, and requirements
  | 'SCOUT_TO_CLIENT';  // Scout reviews Client on responsiveness, payment speed, and deal closure

export interface Review {
  id: string;
  project_id?: string;
  project_title?: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_country: string;
  author_role: UserRole;
  target_id: string;
  target_name?: string;
  target_role: UserRole;
  review_type: ReviewType;
  // Ratings (1-5)
  rating_overall: number;
  rating_communication?: number;
  rating_quality?: number;              // For talents
  rating_professionalism?: number;
  rating_timeliness?: number;
  // Client-specific ratings by Talents and Scouts:
  rating_pays_well?: number;            // 1-5: Payment fairness / generosity (5 = Above market / generous, 4 = Fair rate, 1 = Low)
  rating_pays_on_time?: number;         // 1-5: Payment punctuality (5 = Instant milestone release, 4 = On due date, 1 = Late)
  pays_well_label?: string;             // e.g. "Pays Generously", "Fair Industry Rates", "Strict Budget"
  pays_on_time_label?: string;          // e.g. "Instant Milestone Release (100% On-Time)", "Prompt Payer"
  comment: string;
  endorsement_badges?: string[];        // e.g. ["Top Payer", "Instant Release", "Clear Requirements", "Vetted Specialist"]
  created_at: string;
}

export interface ReviewRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_role: UserRole;
  requester_avatar?: string;
  target_id: string;
  target_name: string;
  target_role: UserRole;
  project_id?: string;
  project_title?: string;
  custom_message?: string;
  status: 'PENDING' | 'COMPLETED' | 'DECLINED';
  created_at: string;
}

export interface ClientReputationScorecard {
  client_id: string;
  client_name: string;
  total_reviews_count: number;
  overall_rating: number;               // 1-5
  pays_well_score: number;              // 1-5 e.g. 4.9
  pays_on_time_percentage: number;      // e.g. 98%
  on_time_release_count: number;
  total_funded_projects: number;
  verified_payer_status: boolean;
  top_badges: string[];
}

// Disputes
export type DisputeStatus =
  | 'OPEN'
  | 'EVIDENCE_REQUESTED'
  | 'UNDER_REVIEW'
  | 'MEDIATION'
  | 'DECISION_PENDING'
  | 'RESOLVED_CLIENT'
  | 'RESOLVED_TALENT'
  | 'PARTIAL_SETTLEMENT'
  | 'CLOSED';

export interface Dispute {
  id: string;
  project_id: string;
  project_title: string;
  initiated_by_id: string;
  initiated_by_name: string;
  initiated_by_role: UserRole;
  reason: string;
  description: string;
  evidence_urls: string[];
  disputed_amount: Money;
  status: DisputeStatus;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

// Fraud & Risk
export interface RiskFlag {
  id: string;
  user_id: string;
  user_name: string;
  signal_type: 'SELF_REFERRAL' | 'DUPLICATE_ACCOUNT' | 'SAME_PAYMENT_IDENTITY' | 'SAME_DEVICE' | 'ANOMALOUS_VOLUME' | 'CIRCULAR_REFERRAL';
  risk_score: number; // 0-100
  details: string;
  status: 'PENDING_REVIEW' | 'DISMISSED' | 'ACTION_TAKEN';
  timestamp: string;
}

// Platform & Country Configuration Settings
export interface PlatformSettings {
  platform_fee_percent: number;      // e.g. 5 (%)
  min_referral_percentage: number;   // e.g. 5 (%)
  max_referral_percentage: number;   // e.g. 25 (%)
  payout_hold_period_days: number;   // e.g. 3 (days)
  minimum_payout_minor: Record<string, number>; // per currency e.g. NGN: 500000, GHS: 10000
  attribution_window_days: number;   // e.g. 30 (days)
}

export interface CountryComplianceSetting {
  country_id: string;
  country_name: string;
  terms_url: string;
  privacy_url: string;
  payment_rules: string;
  kyc_required: boolean;
  payout_rules: string;
  tax_disclaimer: string;
  supported_payment_methods: string[];
  status: CountryMarketplaceStatus;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  object_type: string;
  object_id: string;
  before_state?: string;
  after_state?: string;
  timestamp: string;
  ip_address: string;
  country: string;
  reason?: string;
}

// Refeir Desk Concierge Recommendation
export interface RefeirDeskTalentMatch {
  talent_id: string;
  talent_name: string;
  talent_avatar: string;
  headline: string;
  country_name: string;
  match_score: number;        // e.g. 98 (%)
  hourly_or_fixed: string;
  recommended_rate: Money;
  scout_name?: string;
  endorsement_note: string;
  availability: string;
}

export interface RefeirDeskRecommendation {
  id: string;
  client_id: string;
  client_name: string;
  project_title: string;
  required_skills: string[];
  budget: Money;
  urgency: 'Immediate (<24h)' | 'Within 3 Days' | 'Next Week';
  recommended_talents: RefeirDeskTalentMatch[];
  status: 'PENDING_DISPATCH' | 'CURATED' | 'ACCEPTED' | 'CONTRACT_INITIATED';
  created_at: string;
  notes?: string;
}
