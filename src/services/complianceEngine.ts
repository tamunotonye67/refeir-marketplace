// ============================================================================
// REFAIR COMPLIANCE & PAYMENT TRANSFER ALGORITHM ENGINE
// Strict Pan-African & Cross-Border Financial Regulatory Enforcement
// ============================================================================

import { User, VerificationStatus, PayoutMethod, Wallet } from '../types';

export interface MissingRequirementStep {
  code: 'KYC_VERIFICATION' | 'TAX_INFORMATION' | 'LINK_PAYOUT_CHANNEL' | 'CHANNEL_CURRENCY_MISMATCH';
  title: string;
  description: string;
  actionLabel: string;
  actionType: 'NAVIGATE_VERIFY' | 'OPEN_TAX_MODAL' | 'OPEN_LINK_PAYOUT_MODAL';
}

export interface WithdrawalComplianceResult {
  canWithdraw: boolean;
  isVerified: boolean;
  isTaxCompliant: boolean;
  verificationStatus: VerificationStatus;
  taxCountry?: string;
  taxIdNumber?: string;
  reasons: string[];
  missingSteps: MissingRequirementStep[];
  complianceScore: number; // 0 to 100
}

export interface PaymentTransferEligibilityResult {
  canTransfer: boolean;
  isVerified: boolean;
  isTaxCompliant: boolean;
  hasLinkedChannel: boolean;
  isChannelCompatible: boolean;
  verificationStatus: VerificationStatus;
  selectedChannel?: PayoutMethod | null;
  targetCurrency: string;
  complianceScore: number; // 0 to 100
  reasons: string[];
  missingSteps: MissingRequirementStep[];
}

/**
 * Strict Verification Algorithm:
 * A user is considered financially verified only if they have cleared
 * full government ID and biometric KYC (IDENTITY_VERIFIED or PROFESSION_VERIFIED).
 */
export function isUserIdentityVerified(user: User | null | undefined): boolean {
  if (!user) return false;
  return (
    user.verification_status === 'IDENTITY_VERIFIED' ||
    user.verification_status === 'PROFESSION_VERIFIED'
  );
}

/**
 * Strict Tax Compliance Algorithm:
 * A user is considered tax compliant only if they have filled in their
 * Tax Identification Number (TIN / NIN / KRA PIN / GRA / SARS / W-8BEN)
 * and have a registered tax jurisdiction country.
 */
export function isUserTaxCompliant(user: User | null | undefined): boolean {
  if (!user) return false;
  const hasTaxId = Boolean(user.tax_id_number && user.tax_id_number.trim().length >= 3);
  const hasCountry = Boolean(user.tax_country || user.country);
  return hasTaxId && hasCountry;
}

/**
 * Strict Payout Channel Validity Algorithm:
 * Verifies that a payout method is legitimately linked with a valid identifier
 * and not an unconfigured mock fallback.
 */
export function isPayoutChannelValid(method: PayoutMethod | undefined | null): boolean {
  if (!method) return false;
  if (method.id === 'default-bank' || method.id === 'none' || method.id === 'new') return false;
  if (!method.masked_identifier || method.masked_identifier.trim().length < 3) return false;
  if (!method.institution_name || method.institution_name.trim().length === 0) return false;
  if (!method.account_holder_name || method.account_holder_name.trim().length === 0) return false;
  return true;
}

/**
 * Strict Currency & Channel Rail Compatibility Algorithm:
 * Verifies that the payout channel is compatible with the target settlement currency.
 * Stablecoins (USDT/USDC) and Global USD accounts are universally compatible.
 */
export function isPayoutChannelCompatible(
  method: PayoutMethod | undefined | null,
  targetCurrency: string
): { isCompatible: boolean; reason?: string } {
  if (!method || !isPayoutChannelValid(method)) {
    return {
      isCompatible: false,
      reason: 'No verified payout channel is linked. Please link a valid bank account, mobile money wallet, or crypto address.'
    };
  }

  const curr = targetCurrency.toUpperCase();
  const methodCurr = (method.currency || '').toUpperCase();
  const methodType = method.type;

  // Crypto / Stablecoins (USDT / USDC) are universally compatible across all currencies
  if (methodType === 'OTHER' || method.institution_name.includes('USDT') || method.institution_name.includes('USDC')) {
    return { isCompatible: true };
  }

  // Direct currency match
  if (methodCurr === curr) {
    return { isCompatible: true };
  }

  // Global USD SWIFT/ACH accounts can accept foreign disbursements via bank conversion
  if (methodCurr === 'USD' || method.country === 'United States' || method.country === 'United Kingdom') {
    return { isCompatible: true };
  }

  // Cross-Border Currency Mismatch
  return {
    isCompatible: false,
    reason: `Payment channel currency (${methodCurr} • ${method.country}) is not compatible with ${curr} disbursements. Please link a ${curr}-denominated bank account, Mobile Money wallet, or USDT/USDC address.`
  };
}

/**
 * Master Withdrawal Eligibility Algorithm:
 * Evaluates both strict identity verification and tax information requirements.
 */
export function evaluateWithdrawalCompliance(user: User | null | undefined): WithdrawalComplianceResult {
  if (!user) {
    return {
      canWithdraw: false,
      isVerified: false,
      isTaxCompliant: false,
      verificationStatus: 'UNVERIFIED',
      reasons: ['User authentication is required to access withdrawal rails.'],
      missingSteps: [
        {
          code: 'KYC_VERIFICATION',
          title: 'Authentication & Identity Verification',
          description: 'Please sign in and verify your identity to enable fund disbursements.',
          actionLabel: 'Sign In',
          actionType: 'NAVIGATE_VERIFY'
        }
      ],
      complianceScore: 0
    };
  }

  const isVerified = isUserIdentityVerified(user);
  const isTax = isUserTaxCompliant(user);

  const missingSteps: MissingRequirementStep[] = [];
  const reasons: string[] = [];

  // 1. Evaluate Identity / KYC Verification
  if (!isVerified) {
    reasons.push(
      'Government Identity Verification (KYC) is mandatory for anti-money laundering (AML) and cross-border settlement.'
    );
    missingSteps.push({
      code: 'KYC_VERIFICATION',
      title: 'Complete Government ID & Face Verification (KYC)',
      description:
        'Upload your government-issued ID (National ID, Passport, or Driver\'s License) and complete a real-time biometric face verification.',
      actionLabel: 'Verify Identity Now',
      actionType: 'NAVIGATE_VERIFY'
    });
  }

  // 2. Evaluate Tax Identification Number & Jurisdiction
  if (!isTax) {
    reasons.push(
      'Tax Compliance Profile and registered Tax Identification Number (TIN) must be on file for statutory reporting.'
    );
    missingSteps.push({
      code: 'TAX_INFORMATION',
      title: 'Submit Tax Information & Identification (TIN)',
      description:
        'Provide your official Tax Identification Number (e.g. Nigerian FIRS TIN, Kenyan KRA PIN, Ghana TIN, South African SARS PIN, or International Tax ID).',
      actionLabel: 'Complete Tax Information',
      actionType: 'OPEN_TAX_MODAL'
    });
  }

  let complianceScore = 0;
  if (isVerified) complianceScore += 50;
  if (isTax) complianceScore += 50;

  const canWithdraw = isVerified && isTax;

  return {
    canWithdraw,
    isVerified,
    isTaxCompliant: isTax,
    verificationStatus: user.verification_status,
    taxCountry: user.tax_country || user.country,
    taxIdNumber: user.tax_id_number,
    reasons,
    missingSteps,
    complianceScore
  };
}

/**
 * Master Payment Transfer Eligibility Algorithm:
 * Strictly enforces all 3 regulatory & rail pillars:
 *   1. Identity Verification (KYC cleared)
 *   2. Tax Information & TIN on file
 *   3. Verified & Currency-Compatible Payment Channel linked
 */
export function evaluatePaymentTransferEligibility(
  user: User | null | undefined,
  wallet: Wallet | null | undefined,
  targetCurrency: string,
  selectedMethod: PayoutMethod | null | undefined
): PaymentTransferEligibilityResult {
  const baseCompliance = evaluateWithdrawalCompliance(user);
  const isVerified = baseCompliance.isVerified;
  const isTax = baseCompliance.isTaxCompliant;

  const missingSteps: MissingRequirementStep[] = [...baseCompliance.missingSteps];
  const reasons: string[] = [...baseCompliance.reasons];

  const userMethods = wallet?.payout_methods || [];
  const hasLinkedChannel = userMethods.length > 0 && isPayoutChannelValid(selectedMethod);

  // Evaluate Channel Linking & Compatibility
  let isChannelCompatible = false;

  if (!hasLinkedChannel) {
    reasons.push(
      `No verified payout channel is linked for ${targetCurrency}. A linked local bank account, mobile money wallet, or stablecoin address is required.`
    );
    missingSteps.push({
      code: 'LINK_PAYOUT_CHANNEL',
      title: `Link Payout Channel for ${targetCurrency}`,
      description: `Add your verified local commercial bank account, telecom Mobile Money (M-Pesa, MTN MoMo), or USDT/USDC wallet address.`,
      actionLabel: 'Link Payout Channel',
      actionType: 'OPEN_LINK_PAYOUT_MODAL'
    });
  } else {
    const compatibilityCheck = isPayoutChannelCompatible(selectedMethod, targetCurrency);
    isChannelCompatible = compatibilityCheck.isCompatible;

    if (!isChannelCompatible) {
      reasons.push(compatibilityCheck.reason || `Payout channel is incompatible with ${targetCurrency}.`);
      missingSteps.push({
        code: 'CHANNEL_CURRENCY_MISMATCH',
        title: `Incompatible Payout Channel Currency`,
        description: `Selected channel (${selectedMethod?.institution_name}) does not support ${targetCurrency} direct settlement. Please link or select a ${targetCurrency} account or USDT/USDC.`,
        actionLabel: `Link ${targetCurrency} Channel`,
        actionType: 'OPEN_LINK_PAYOUT_MODAL'
      });
    }
  }

  let complianceScore = 0;
  if (isVerified) complianceScore += 34;
  if (isTax) complianceScore += 33;
  if (hasLinkedChannel && isChannelCompatible) complianceScore += 33;

  const canTransfer = isVerified && isTax && hasLinkedChannel && isChannelCompatible;

  return {
    canTransfer,
    isVerified,
    isTaxCompliant: isTax,
    hasLinkedChannel,
    isChannelCompatible,
    verificationStatus: user ? user.verification_status : 'UNVERIFIED',
    selectedChannel: selectedMethod,
    targetCurrency,
    complianceScore,
    reasons,
    missingSteps
  };
}
