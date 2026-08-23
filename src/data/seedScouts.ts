import { ScoutProfile } from '../types';
import { createMoney } from './currencies';

export const SEED_SCOUTS: ScoutProfile[] = [
  {
    id: 'scout-sarah-adeyemi',
    user_id: 'user-sarah',
    full_name: 'Sarah Adeyemi',
    headline: 'Tech Ecosystem Connector & Founder Talent Scout',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    country_name: 'Nigeria',
    tier: 'Elite Scout',
    successful_referrals: 42,
    projects_generated_value: createMoney(18200000, 'NGN'),
    total_earned: createMoney(1820000, 'NGN'),
    countries_referred: ['Nigeria', 'Ghana', 'Kenya', 'South Africa'],
    client_satisfaction: 4.96,
    dispute_rate: 0.2,
    is_public_earnings: true
  },
  {
    id: 'scout-kofi-boateng',
    user_id: 'user-kofi',
    full_name: 'Kofi Boateng',
    headline: 'Software Engineering Director & Tech Matchmaker',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    country_name: 'Ghana',
    tier: 'Professional Scout',
    successful_referrals: 28,
    projects_generated_value: createMoney(340000, 'GHS'),
    total_earned: createMoney(34000, 'GHS'),
    countries_referred: ['Ghana', 'Nigeria', 'Rwanda', 'Côte d\'Ivoire'],
    client_satisfaction: 4.92,
    dispute_rate: 0.0,
    is_public_earnings: true
  },
  {
    id: 'scout-wambui-kariuki',
    user_id: 'user-wambui',
    full_name: 'Wambui Kariuki',
    headline: 'Venture Partner & East Africa Talent Curator',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    country_name: 'Kenya',
    tier: 'Elite Scout',
    successful_referrals: 36,
    projects_generated_value: createMoney(4800000, 'KES'),
    total_earned: createMoney(480000, 'KES'),
    countries_referred: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Nigeria'],
    client_satisfaction: 4.98,
    dispute_rate: 0.1,
    is_public_earnings: true
  },
  {
    id: 'scout-thabo-nkosi',
    user_id: 'user-thabo',
    full_name: 'Thabo Nkosi',
    headline: 'Product Growth Advisor & Mobile Specialist Scout',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    country_name: 'South Africa',
    tier: 'Verified Scout',
    successful_referrals: 19,
    projects_generated_value: createMoney(580000, 'ZAR'),
    total_earned: createMoney(58000, 'ZAR'),
    countries_referred: ['South Africa', 'Botswana', 'Namibia', 'Kenya'],
    client_satisfaction: 4.88,
    dispute_rate: 0.4,
    is_public_earnings: true
  }
];

export function getScoutById(id: string): ScoutProfile | undefined {
  return SEED_SCOUTS.find(s => s.id === id || s.user_id === id);
}
