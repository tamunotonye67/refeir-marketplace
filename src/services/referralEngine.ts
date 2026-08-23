import { Referral, ReferralClickEvent, ReferralStatus, TalentProfile, Service, ScoutProfile } from '../types';
import { calculateScoutReward } from './commissionEngine';

export class ReferralEngine {
  /**
   * Generates a unique short uppercase referral code (e.g. RF-82KX29)
   */
  static generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'RF-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Creates a new first-class Referral object with locked terms
   */
  static createReferral(params: {
    scout: { id: string; name: string };
    talent: TalentProfile;
    service?: Service;
    attributionWindowDays?: number;
    campaign?: string;
  }): Referral {
    const code = this.generateCode();
    const windowDays = params.attributionWindowDays || 30;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + windowDays * 24 * 60 * 60 * 1000);

    const price = params.service ? params.service.price : params.talent.starting_price;
    const referralPct = params.service ? params.service.referral_percentage : params.talent.referral_percentage;
    const scoutRewardBreakdown = calculateScoutReward(price, referralPct);
    const potentialReward = scoutRewardBreakdown.netReward;

    return {
      id: code,
      referral_code: code,
      scout_id: params.scout.id,
      scout_name: params.scout.name,
      talent_id: params.talent.id,
      talent_name: params.talent.full_name,
      talent_avatar: params.talent.avatar_url,
      service_id: params.service?.id,
      service_title: params.service?.title,
      country_iso: params.talent.country_id,
      currency: price.currency,
      locked_service_price: price,
      locked_referral_percentage: referralPct,
      potential_reward: potentialReward,
      clicks_count: 0,
      status: 'CREATED',
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      attribution_window_days: windowDays,
      campaign: params.campaign || 'direct'
    };
  }

  /**
   * Generates a WhatsApp share pitch message with required transparent disclosure
   */
  static generateWhatsAppMessage(referral: Referral, shareUrl: string): string {
    const serviceOrTitle = referral.service_title || 'a verified professional';
    return (
      `I know someone who can help with this.\n\n` +
      `Meet ${referral.talent_name}, specialized in ${serviceOrTitle} on Refeir.\n\n` +
      `View profile & protected offer:\n` +
      `${shareUrl}\n\n` +
      `⚖️ *Refeir Referral Disclosure:* I may receive a referral reward if this introduction results in a successfully completed project.`
    );
  }

  /**
   * Generates general copy for LinkedIn, X, SMS, Email
   */
  static generateSocialShareText(referral: Referral, shareUrl: string) {
    return {
      subject: `Introduction to ${referral.talent_name} on Refeir`,
      body: `I recommend working with ${referral.talent_name} for ${referral.service_title || 'professional services'}. View portfolio and hire with project payment protection: ${shareUrl}`,
      disclosure: 'Recommended via Refeir Scout. Scout may receive a commission upon project completion.'
    };
  }

  /**
   * Logs a click attribution event
   */
  static trackClick(referral: Referral, userAgent: string, referrerUrl: string): ReferralClickEvent {
    return {
      id: `evt-${Math.random().toString(36).substring(2, 9)}`,
      referral_id: referral.id,
      timestamp: new Date().toISOString(),
      source: referrerUrl || 'direct',
      device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      country: referral.country_iso.toUpperCase(),
      ip_masked: '102.89.***.***'
    };
  }
}
