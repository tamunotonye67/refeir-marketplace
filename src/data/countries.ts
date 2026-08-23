import { Country, AfricanRegion } from '../types';

export interface CountryInfo {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  region: 'GLOBAL' | 'AFRICA';
}

export const GLOBAL_COUNTRIES: CountryInfo[] = [
  // --- Global Markets (Foreign Clients & Enterprise Partners) ---
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', region: 'GLOBAL' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', region: 'GLOBAL' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', region: 'GLOBAL' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', region: 'GLOBAL' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', region: 'GLOBAL' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', region: 'GLOBAL' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', region: 'GLOBAL' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', region: 'GLOBAL' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', region: 'GLOBAL' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', region: 'GLOBAL' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪', region: 'GLOBAL' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪', region: 'GLOBAL' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', region: 'GLOBAL' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', region: 'GLOBAL' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', region: 'GLOBAL' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', region: 'GLOBAL' },
  { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴', region: 'GLOBAL' },
  { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰', region: 'GLOBAL' },
  { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪', region: 'GLOBAL' },

  // --- Pan-African Sovereign Nations (Talents, Scouts & African Clients) ---
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬', region: 'AFRICA' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪', region: 'AFRICA' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭', region: 'AFRICA' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', region: 'AFRICA' },
  { name: 'Rwanda', code: 'RW', dialCode: '+250', flag: '🇷🇼', region: 'AFRICA' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬', region: 'AFRICA' },
  { name: 'Senegal', code: 'SN', dialCode: '+221', flag: '🇸🇳', region: 'AFRICA' },
  { name: 'Uganda', code: 'UG', dialCode: '+256', flag: '🇺🇬', region: 'AFRICA' },
  { name: 'Côte d\'Ivoire', code: 'CI', dialCode: '+225', flag: '🇨🇮', region: 'AFRICA' },
  { name: 'Morocco', code: 'MA', dialCode: '+212', flag: '🇲🇦', region: 'AFRICA' },
  { name: 'Tanzania', code: 'TZ', dialCode: '+255', flag: '🇹🇿', region: 'AFRICA' },
  { name: 'Cameroon', code: 'CM', dialCode: '+237', flag: '🇨🇲', region: 'AFRICA' },
  { name: 'Ethiopia', code: 'ET', dialCode: '+251', flag: '🇪🇹', region: 'AFRICA' },
  { name: 'Zambia', code: 'ZM', dialCode: '+260', flag: '🇿🇲', region: 'AFRICA' },
  { name: 'Zimbabwe', code: 'ZW', dialCode: '+263', flag: '🇿🇼', region: 'AFRICA' },
  { name: 'Mauritius', code: 'MU', dialCode: '+230', flag: '🇲🇺', region: 'AFRICA' },
  { name: 'Angola', code: 'AO', dialCode: '+244', flag: '🇦🇴', region: 'AFRICA' },
  { name: 'Tunisia', code: 'TN', dialCode: '+216', flag: '🇹🇳', region: 'AFRICA' },
  { name: 'Algeria', code: 'DZ', dialCode: '+213', flag: '🇩🇿', region: 'AFRICA' },
  { name: 'Botswana', code: 'BW', dialCode: '+267', flag: '🇧🇼', region: 'AFRICA' },
  { name: 'Namibia', code: 'NA', dialCode: '+264', flag: '🇳🇦', region: 'AFRICA' },
  { name: 'Benin', code: 'BJ', dialCode: '+229', flag: '🇧🇯', region: 'AFRICA' },
  { name: 'Togo', code: 'TG', dialCode: '+228', flag: '🇹🇬', region: 'AFRICA' },
  { name: 'Democratic Republic of Congo', code: 'CD', dialCode: '+243', flag: '🇨🇩', region: 'AFRICA' },
  { name: 'Other Sovereign Nation', code: 'XX', dialCode: '+1', flag: '🌍', region: 'GLOBAL' }
];

export const REGIONS: AfricanRegion[] = [
  'West Africa',
  'East Africa',
  'Southern Africa',
  'North Africa',
  'Central Africa'
];

export const AFRICAN_COUNTRIES: Country[] = [
  {
    id: 'nigeria',
    name: 'Nigeria',
    iso_code: 'NG',
    iso3_code: 'NGA',
    country_code: '+234',
    currency_code: 'NGN',
    currency_symbol: '₦',
    flag_emoji: '🇳🇬',
    region: 'West Africa',
    timezone: 'Africa/Lagos',
    languages: ['English', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin'],
    status: 'FULLY_OPERATIONAL',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu']
  },
  {
    id: 'kenya',
    name: 'Kenya',
    iso_code: 'KE',
    iso3_code: 'KEN',
    country_code: '+254',
    currency_code: 'KES',
    currency_symbol: 'KSh',
    flag_emoji: '🇰🇪',
    region: 'East Africa',
    timezone: 'Africa/Nairobi',
    languages: ['English', 'Swahili'],
    status: 'FULLY_OPERATIONAL',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']
  },
  {
    id: 'ghana',
    name: 'Ghana',
    iso_code: 'GH',
    iso3_code: 'GHA',
    country_code: '+233',
    currency_code: 'GHS',
    currency_symbol: 'GH₵',
    flag_emoji: '🇬🇭',
    region: 'West Africa',
    timezone: 'Africa/Accra',
    languages: ['English', 'Twi', 'Ga', 'Fante'],
    status: 'FULLY_OPERATIONAL',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Accra', 'Kumasi', 'Takoradi', 'Tema', 'Tamale']
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    iso_code: 'ZA',
    iso3_code: 'ZAF',
    country_code: '+27',
    currency_code: 'ZAR',
    currency_symbol: 'R',
    flag_emoji: '🇿🇦',
    region: 'Southern Africa',
    timezone: 'Africa/Johannesburg',
    languages: ['English', 'Zulu', 'Xhosa', 'Afrikaans'],
    status: 'FULLY_OPERATIONAL',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Sandton']
  },
  {
    id: 'egypt',
    name: 'Egypt',
    iso_code: 'EG',
    iso3_code: 'EGY',
    country_code: '+20',
    currency_code: 'EGP',
    currency_symbol: 'E£',
    flag_emoji: '🇪🇬',
    region: 'North Africa',
    timezone: 'Africa/Cairo',
    languages: ['Arabic', 'English'],
    status: 'FULLY_OPERATIONAL',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Aswan']
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    iso_code: 'RW',
    iso3_code: 'RWA',
    country_code: '+250',
    currency_code: 'RWF',
    currency_symbol: 'FRw',
    flag_emoji: '🇷🇼',
    region: 'East Africa',
    timezone: 'Africa/Kigali',
    languages: ['English', 'Kinyarwanda', 'French'],
    status: 'FULLY_OPERATIONAL',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Kigali', 'Butare', 'Gisenyi', 'Ruhengeri']
  },
  {
    id: 'senegal',
    name: 'Senegal',
    iso_code: 'SN',
    iso3_code: 'SEN',
    country_code: '+221',
    currency_code: 'XOF',
    currency_symbol: 'CFA',
    flag_emoji: '🇸🇳',
    region: 'West Africa',
    timezone: 'Africa/Dakar',
    languages: ['French', 'Wolof'],
    status: 'PAYMENTS_ENABLED',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Dakar', 'Thies', 'Saint-Louis', 'Touba']
  },
  {
    id: 'uganda',
    name: 'Uganda',
    iso_code: 'UG',
    iso3_code: 'UGA',
    country_code: '+256',
    currency_code: 'UGX',
    currency_symbol: 'USh',
    flag_emoji: '🇺🇬',
    region: 'East Africa',
    timezone: 'Africa/Kampala',
    languages: ['English', 'Luganda', 'Swahili'],
    status: 'FULLY_OPERATIONAL',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Kampala', 'Entebbe', 'Jinja', 'Mbarara']
  },
  {
    id: 'morocco',
    name: 'Morocco',
    iso_code: 'MA',
    iso3_code: 'MAR',
    country_code: '+212',
    currency_code: 'MAD',
    currency_symbol: 'DH',
    flag_emoji: '🇲🇦',
    region: 'North Africa',
    timezone: 'Africa/Casablanca',
    languages: ['Arabic', 'French', 'Berber'],
    status: 'PAYMENTS_ENABLED',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Casablanca', 'Rabat', 'Marrakech', 'Tangier']
  },
  {
    id: 'cote-divoire',
    name: "Côte d'Ivoire",
    iso_code: 'CI',
    iso3_code: 'CIV',
    country_code: '+225',
    currency_code: 'XOF',
    currency_symbol: 'CFA',
    flag_emoji: '🇨🇮',
    region: 'West Africa',
    timezone: 'Africa/Abidjan',
    languages: ['French', 'Baoulé', 'Dioula'],
    status: 'PAYMENTS_ENABLED',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro']
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    iso_code: 'TZ',
    iso3_code: 'TZA',
    country_code: '+255',
    currency_code: 'TZS',
    currency_symbol: 'TSh',
    flag_emoji: '🇹🇿',
    region: 'East Africa',
    timezone: 'Africa/Dar_es_Salaam',
    languages: ['Swahili', 'English'],
    status: 'PAYMENTS_ENABLED',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Zanzibar City']
  },
  {
    id: 'cameroon',
    name: 'Cameroon',
    iso_code: 'CM',
    iso3_code: 'CMR',
    country_code: '+237',
    currency_code: 'XAF',
    currency_symbol: 'FCFA',
    flag_emoji: '🇨🇲',
    region: 'Central Africa',
    timezone: 'Africa/Douala',
    languages: ['French', 'English'],
    status: 'PAYMENTS_ENABLED',
    payment_availability: true,
    verification_availability: true,
    payout_availability: true,
    popular_cities: ['Douala', 'Yaoundé', 'Bamenda', 'Bafoussam']
  },
  {
    id: 'ethiopia',
    name: 'Ethiopia',
    iso_code: 'ET',
    iso3_code: 'ETH',
    country_code: '+251',
    currency_code: 'ETB',
    currency_symbol: 'Br',
    flag_emoji: '🇪🇹',
    region: 'East Africa',
    timezone: 'Africa/Addis_Ababa',
    languages: ['Amharic', 'Oromo', 'English'],
    status: 'MARKETPLACE_ONLY',
    payment_availability: true,
    verification_availability: true,
    payout_availability: false,
    popular_cities: ['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar']
  }
];

export function getCountryByIso(isoOrName: string): Country | undefined {
  if (!isoOrName) return undefined;
  const lower = isoOrName.toLowerCase();
  return AFRICAN_COUNTRIES.find(
    c => c.iso_code.toLowerCase() === lower || c.name.toLowerCase() === lower || c.id.toLowerCase() === lower
  );
}

export function getCountryById(id: string): Country | undefined {
  if (!id) return undefined;
  const lower = id.toLowerCase();
  return AFRICAN_COUNTRIES.find(c => c.id.toLowerCase() === lower || c.iso_code.toLowerCase() === lower);
}

export function getCountryByDialCode(dialCode: string): CountryInfo | undefined {
  return GLOBAL_COUNTRIES.find(c => c.dialCode === dialCode);
}

export function getCountryByName(name: string): CountryInfo | undefined {
  if (!name) return undefined;
  return GLOBAL_COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}
