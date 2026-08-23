import { Money, Commission, CommissionState, Project } from '../types';
import { formatMoney } from '../data/currencies';

export interface FinancialBreakdown {
  project_amount: Money;
  platform_fee_percent: number;
  platform_fee_amount: Money;
  client_total_amount: Money;
  referral_percentage: number;
  scout_reward_amount: Money;        // Net or gross depending on context (backwards compatible)
  scout_gross_reward_amount: Money;  // Full referral reward allocated by talent
  airfee_percentage: number;         // 0% if <= 10% or token applied, 2% if > 10%
  airfee_amount: Money;              // 2% platform airfee on proceeds
  scout_net_reward_amount: Money;    // scout_gross - airfee_amount
  has_airfee_token_applied: boolean; // True if waived by monthly Airfee Token
  talent_net_amount: Money;
  refeir_revenue_amount: Money;
}

/**
 * Calculates Airfee on Scout Referral Proceeds:
 * - 0% forever if referralPercentage <= 10%
 * - 2% Airfee if referralPercentage > 10% (unless waived by Airfee Token)
 */
export function calculateAirfee(
  grossScoutProceeds: Money,
  referralPercentage: number,
  hasAirfeeToken: boolean = false
): { airfeePercentage: number; airfeeAmount: Money; netScoutReward: Money; tokenApplied: boolean } {
  const isAboveTenPercent = referralPercentage > 10;
  const tokenApplied = isAboveTenPercent && hasAirfeeToken;
  const airfeePercentage = isAboveTenPercent && !tokenApplied ? 2 : 0;

  const airfeeMinor = Math.round(grossScoutProceeds.amount_minor * (airfeePercentage / 100));
  const netRewardMinor = grossScoutProceeds.amount_minor - airfeeMinor;

  const currency = grossScoutProceeds.currency;

  return {
    airfeePercentage,
    airfeeAmount: {
      amount_minor: airfeeMinor,
      currency,
      formatted: formatMoney({ amount_minor: airfeeMinor, currency })
    },
    netScoutReward: {
      amount_minor: netRewardMinor,
      currency,
      formatted: formatMoney({ amount_minor: netRewardMinor, currency })
    },
    tokenApplied
  };
}

/**
 * Calculates Scout Referral Reward in exact integer minor units
 */
export function calculateScoutReward(
  projectPrice: Money,
  referralPercentage: number,
  hasAirfeeToken: boolean = false
): { grossReward: Money; netReward: Money; airfeeAmount: Money; airfeePercentage: number } {
  const grossMinor = Math.round(projectPrice.amount_minor * (referralPercentage / 100));
  const grossMoney: Money = {
    amount_minor: grossMinor,
    currency: projectPrice.currency,
    formatted: formatMoney({ amount_minor: grossMinor, currency: projectPrice.currency })
  };

  const { airfeePercentage, airfeeAmount, netScoutReward } = calculateAirfee(
    grossMoney,
    referralPercentage,
    hasAirfeeToken
  );

  return {
    grossReward: grossMoney,
    netReward: netScoutReward,
    airfeeAmount,
    airfeePercentage
  };
}

/**
 * Calculates complete itemized project financial breakdown including Airfee rules
 */
export function calculateProjectBreakdown(
  projectPrice: Money,
  referralPercentage: number = 10,
  platformFeePercentage: number = 5,
  hasAirfeeToken: boolean = false
): FinancialBreakdown {
  const platformFeeMinor = Math.round(projectPrice.amount_minor * (platformFeePercentage / 100));
  const clientTotalMinor = projectPrice.amount_minor + platformFeeMinor;
  const scoutGrossMinor = Math.round(projectPrice.amount_minor * (referralPercentage / 100));
  const talentNetMinor = projectPrice.amount_minor - scoutGrossMinor;

  const currency = projectPrice.currency;

  const grossRewardMoney: Money = {
    amount_minor: scoutGrossMinor,
    currency,
    formatted: formatMoney({ amount_minor: scoutGrossMinor, currency })
  };

  const { airfeePercentage, airfeeAmount, netScoutReward, tokenApplied } = calculateAirfee(
    grossRewardMoney,
    referralPercentage,
    hasAirfeeToken
  );

  const refeirTotalRevenueMinor = platformFeeMinor + airfeeAmount.amount_minor;

  return {
    project_amount: { ...projectPrice },
    platform_fee_percent: platformFeePercentage,
    platform_fee_amount: {
      amount_minor: platformFeeMinor,
      currency,
      formatted: formatMoney({ amount_minor: platformFeeMinor, currency })
    },
    client_total_amount: {
      amount_minor: clientTotalMinor,
      currency,
      formatted: formatMoney({ amount_minor: clientTotalMinor, currency })
    },
    referral_percentage: referralPercentage,
    scout_reward_amount: netScoutReward,
    scout_gross_reward_amount: grossRewardMoney,
    airfee_percentage: airfeePercentage,
    airfee_amount: airfeeAmount,
    scout_net_reward_amount: netScoutReward,
    has_airfee_token_applied: tokenApplied,
    talent_net_amount: {
      amount_minor: talentNetMinor,
      currency,
      formatted: formatMoney({ amount_minor: talentNetMinor, currency })
    },
    refeir_revenue_amount: {
      amount_minor: refeirTotalRevenueMinor,
      currency,
      formatted: formatMoney({ amount_minor: refeirTotalRevenueMinor, currency })
    }
  };
}

/**
 * Proposal Job Breakdown (Initiated via Job Board proposals without a Scout):
 * - Refeir collects 5% from Client (Platform Facilitation Fee)
 * - Refeir collects 5% from Talent (Platform Success Fee) at final milestone
 * - Total Company Revenue = 10% (5% Client + 5% Talent)
 * - Scout Reward = 0
 */
export function calculateProposalJobBreakdown(projectPrice: Money): {
  project_amount: Money;
  client_fee_percent: number;      // 5%
  client_fee_amount: Money;        // 5% paid by client
  client_total_amount: Money;      // project amount + 5%
  talent_fee_percent: number;      // 5%
  talent_fee_amount: Money;        // 5% deducted from talent payout at final milestone
  talent_net_amount: Money;        // 95% paid to talent
  refeir_total_revenue: Money;     // 10% (5% client + 5% talent)
  rules_note: string;
} {
  const currency = projectPrice.currency;
  const clientFeeMinor = Math.round(projectPrice.amount_minor * 0.05);
  const clientTotalMinor = projectPrice.amount_minor + clientFeeMinor;
  const talentFeeMinor = Math.round(projectPrice.amount_minor * 0.05);
  const talentNetMinor = projectPrice.amount_minor - talentFeeMinor;
  const refeirRevenueMinor = clientFeeMinor + talentFeeMinor;

  return {
    project_amount: { ...projectPrice },
    client_fee_percent: 5,
    client_fee_amount: {
      amount_minor: clientFeeMinor,
      currency,
      formatted: formatMoney({ amount_minor: clientFeeMinor, currency })
    },
    client_total_amount: {
      amount_minor: clientTotalMinor,
      currency,
      formatted: formatMoney({ amount_minor: clientTotalMinor, currency })
    },
    talent_fee_percent: 5,
    talent_fee_amount: {
      amount_minor: talentFeeMinor,
      currency,
      formatted: formatMoney({ amount_minor: talentFeeMinor, currency })
    },
    talent_net_amount: {
      amount_minor: talentNetMinor,
      currency,
      formatted: formatMoney({ amount_minor: talentNetMinor, currency })
    },
    refeir_total_revenue: {
      amount_minor: refeirRevenueMinor,
      currency,
      formatted: formatMoney({ amount_minor: refeirRevenueMinor, currency })
    },
    rules_note: 'Proposal Hire: 5% platform fee from client + 5% success fee from talent at final milestone. All chatting must stay within Refeir.'
  };
}

/**
 * Direct Reachout Breakdown (Client reaches out to Talent directly without a Scout):
 * - Refeir retains the referral rate the Talent had set initially (e.g. 10%)
 * - Platform standard fee = 5% paid by Client
 * - Total Company Revenue = 5% (Client) + Talent referral rate % (from project amount)
 * - Scout Reward = 0
 */
export function calculateDirectHireBreakdown(
  projectPrice: Money,
  talentReferralPercentage: number = 10,
  platformFeePercentage: number = 5
): {
  project_amount: Money;
  platform_fee_percent: number;
  platform_fee_amount: Money;
  client_total_amount: Money;
  direct_facilitation_percent: number; // Talent's set referral % retained by Refeir
  direct_facilitation_amount: Money;
  talent_net_amount: Money;
  refeir_total_revenue: Money;
  rules_note: string;
} {
  const currency = projectPrice.currency;
  const platformFeeMinor = Math.round(projectPrice.amount_minor * (platformFeePercentage / 100));
  const clientTotalMinor = projectPrice.amount_minor + platformFeeMinor;
  const directFacilitationMinor = Math.round(projectPrice.amount_minor * (talentReferralPercentage / 100));
  const talentNetMinor = projectPrice.amount_minor - directFacilitationMinor;
  const refeirRevenueMinor = platformFeeMinor + directFacilitationMinor;

  return {
    project_amount: { ...projectPrice },
    platform_fee_percent: platformFeePercentage,
    platform_fee_amount: {
      amount_minor: platformFeeMinor,
      currency,
      formatted: formatMoney({ amount_minor: platformFeeMinor, currency })
    },
    client_total_amount: {
      amount_minor: clientTotalMinor,
      currency,
      formatted: formatMoney({ amount_minor: clientTotalMinor, currency })
    },
    direct_facilitation_percent: talentReferralPercentage,
    direct_facilitation_amount: {
      amount_minor: directFacilitationMinor,
      currency,
      formatted: formatMoney({ amount_minor: directFacilitationMinor, currency })
    },
    talent_net_amount: {
      amount_minor: talentNetMinor,
      currency,
      formatted: formatMoney({ amount_minor: talentNetMinor, currency })
    },
    refeir_total_revenue: {
      amount_minor: refeirRevenueMinor,
      currency,
      formatted: formatMoney({ amount_minor: refeirRevenueMinor, currency })
    },
    rules_note: `Direct Reachout: Refeir retains the ${talentReferralPercentage}% facilitation rate set on Talent's profile since no Scout was involved.`
  };
}

/**
 * Commission Eligibility Verifier
 */
export function evaluateCommissionEligibility(
  commission: Commission,
  project: Project,
  hasActiveDispute: boolean = false
): { is_eligible: boolean; reason: string } {
  if (hasActiveDispute || project.status === 'DISPUTED') {
    return { is_eligible: false, reason: 'Commission locked: Project has an unresolved active dispute.' };
  }
  if (project.status !== 'COMPLETED' && project.status !== 'SETTLED') {
    return { is_eligible: false, reason: `Commission pending: Project state is ${project.status}.` };
  }
  return { is_eligible: true, reason: 'Commission is eligible and ready for scout withdrawal.' };
}
