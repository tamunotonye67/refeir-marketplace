import { RiskFlag, User } from '../types';

export class FraudEngine {
  /**
   * Evaluates relationship and transaction for potential risks
   */
  static evaluateRisk(params: {
    scoutId: string;
    talentId: string;
    clientId?: string;
    scoutEmail?: string;
    clientEmail?: string;
    talentEmail?: string;
    referralsCreatedLast24h?: number;
  }): { risk_score: number; risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; flags: string[] } {
    let score = 5; // Baseline low trust score
    const flags: string[] = [];

    // 1. Self-Referral Checks
    if (params.scoutId === params.talentId) {
      score += 75;
      flags.push('SELF_REFERRAL_DETECTED: Scout and Talent share the exact same user ID.');
    }
    if (params.clientId && params.scoutId === params.clientId) {
      score += 80;
      flags.push('SELF_REFERRAL_DETECTED: Scout and Client share the exact same user ID.');
    }
    if (params.scoutEmail && params.clientEmail && params.scoutEmail.toLowerCase() === params.clientEmail.toLowerCase()) {
      score += 65;
      flags.push('DUPLICATE_IDENTITY_DETECTED: Scout and Client share matching email address.');
    }
    if (params.scoutEmail && params.talentEmail && params.scoutEmail.toLowerCase() === params.talentEmail.toLowerCase()) {
      score += 65;
      flags.push('DUPLICATE_IDENTITY_DETECTED: Scout and Talent share matching email address.');
    }

    // 2. High velocity referral creation
    if (params.referralsCreatedLast24h && params.referralsCreatedLast24h > 25) {
      score += 25;
      flags.push('ANOMALOUS_VOLUME: More than 25 referrals created in a 24-hour window.');
    }

    const finalScore = Math.min(100, score);
    let risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (finalScore > 80) risk_level = 'CRITICAL';
    else if (finalScore > 50) risk_level = 'HIGH';
    else if (finalScore > 20) risk_level = 'MEDIUM';

    return {
      risk_score: finalScore,
      risk_level,
      flags
    };
  }

  /**
   * Creates a formal RiskFlag object for admin queue
   */
  static createRiskFlag(params: {
    userId: string;
    userName: string;
    signalType: RiskFlag['signal_type'];
    riskScore: number;
    details: string;
  }): RiskFlag {
    return {
      id: `FLAG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      user_id: params.userId,
      user_name: params.userName,
      signal_type: params.signalType,
      risk_score: params.riskScore,
      details: params.details,
      status: 'PENDING_REVIEW',
      timestamp: new Date().toISOString()
    };
  }
}
