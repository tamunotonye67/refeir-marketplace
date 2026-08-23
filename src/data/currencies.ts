import { CurrencyConfig, Money } from '../types';

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.00067 },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.065 },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.0077 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.055 },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.021 },
  MAD: { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', minor_unit: 100, symbol_position: 'suffix', exchange_rate_to_usd: 0.10 },
  RWF: { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', minor_unit: 100, symbol_position: 'suffix', exchange_rate_to_usd: 0.00075 },
  TZS: { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.00038 },
  UGX: { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.00027 },
  XOF: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', minor_unit: 100, symbol_position: 'suffix', exchange_rate_to_usd: 0.0016 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 1.0 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 1.30 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 1.09 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.74 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.66 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.27 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', minor_unit: 100, symbol_position: 'prefix', exchange_rate_to_usd: 0.76 },
};

/**
 * Format money in integer minor units to human-readable string.
 * Example: 100000000 minor units in NGN (kobo) -> "₦1,000,000"
 */
export function formatMoney(money: Money | { amount_minor: number; currency: string }): string {
  const config = SUPPORTED_CURRENCIES[money.currency] || {
    code: money.currency,
    name: money.currency,
    symbol: money.currency,
    minor_unit: 100,
    symbol_position: 'prefix',
    exchange_rate_to_usd: 1
  };

  const major = money.amount_minor / config.minor_unit;
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(major);

  if (config.symbol_position === 'prefix') {
    return `${config.symbol}${formattedNumber}`;
  } else {
    return `${formattedNumber} ${config.symbol}`;
  }
}

/**
 * Format money with compact abbreviations (K for thousand, M for million, B for billion).
 * Example: 250,000 NGN -> "₦250K", 1,200,000 NGN -> "₦1.2M", 500 USD -> "$500"
 */
export function formatCompactMoney(money: Money | { amount_minor: number; currency: string }): string {
  const config = SUPPORTED_CURRENCIES[money.currency] || {
    code: money.currency,
    name: money.currency,
    symbol: money.currency,
    minor_unit: 100,
    symbol_position: 'prefix',
    exchange_rate_to_usd: 1
  };

  const major = money.amount_minor / config.minor_unit;
  let formattedNumber: string;

  if (Math.abs(major) >= 1_000_000_000) {
    const val = major / 1_000_000_000;
    formattedNumber = (val % 1 === 0 ? val.toString() : val.toFixed(1).replace(/\.0$/, '')) + 'B';
  } else if (Math.abs(major) >= 1_000_000) {
    const val = major / 1_000_000;
    formattedNumber = (val % 1 === 0 ? val.toString() : val.toFixed(1).replace(/\.0$/, '')) + 'M';
  } else if (Math.abs(major) >= 1_000) {
    const val = major / 1_000;
    formattedNumber = (val % 1 === 0 ? val.toString() : val.toFixed(1).replace(/\.0$/, '')) + 'K';
  } else {
    formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: major % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(major);
  }

  if (config.symbol_position === 'prefix') {
    return `${config.symbol}${formattedNumber}`;
  } else {
    return `${formattedNumber} ${config.symbol}`;
  }
}

/**
 * Create a Money object from major units (e.g. 250000 NGN -> amount_minor: 25000000)
 */
export function createMoney(majorAmount: number, currency: string = 'NGN'): Money {
  const config = SUPPORTED_CURRENCIES[currency] || { minor_unit: 100 };
  const minor = Math.round(majorAmount * config.minor_unit);
  return {
    amount_minor: minor,
    currency,
    formatted: formatMoney({ amount_minor: minor, currency })
  };
}

/**
 * Convert money between currencies with rate metadata
 */
export function convertCurrency(
  source: Money,
  targetCurrency: string
): { converted: Money; rate: number; timestamp: string } {
  if (source.currency === targetCurrency) {
    return {
      converted: { ...source },
      rate: 1.0,
      timestamp: new Date().toISOString()
    };
  }

  const srcConfig = SUPPORTED_CURRENCIES[source.currency] || { exchange_rate_to_usd: 1, minor_unit: 100 };
  const tgtConfig = SUPPORTED_CURRENCIES[targetCurrency] || { exchange_rate_to_usd: 1, minor_unit: 100 };

  const srcMajor = source.amount_minor / srcConfig.minor_unit;
  const usdAmount = srcMajor * srcConfig.exchange_rate_to_usd;
  const tgtMajor = usdAmount / tgtConfig.exchange_rate_to_usd;
  const tgtMinor = Math.round(tgtMajor * tgtConfig.minor_unit);
  const rate = (srcConfig.exchange_rate_to_usd / tgtConfig.exchange_rate_to_usd);

  return {
    converted: {
      amount_minor: tgtMinor,
      currency: targetCurrency,
      formatted: formatMoney({ amount_minor: tgtMinor, currency: targetCurrency })
    },
    rate,
    timestamp: new Date().toISOString()
  };
}
