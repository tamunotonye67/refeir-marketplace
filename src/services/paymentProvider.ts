import { Money, Transaction } from '../types';
import { createMoney, formatMoney } from '../data/currencies';

export interface PaymentInitializationResult {
  payment_reference: string;
  authorization_url?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  supported_methods: string[];
  provider_name: string;
}

export interface PaymentVerificationResult {
  payment_reference: string;
  is_successful: boolean;
  amount_paid: Money;
  settlement_currency: string;
  gateway_response: string;
  timestamp: string;
}

export interface PaymentProvider {
  provider_name: string;
  supported_countries: string[];
  initializePayment(params: {
    amount: Money;
    customer_email: string;
    customer_name: string;
    project_id: string;
    country_iso: string;
  }): Promise<PaymentInitializationResult>;

  verifyPayment(reference: string): Promise<PaymentVerificationResult>;
  refundPayment(reference: string, amount: Money, reason: string): Promise<{ success: boolean; refund_ref: string }>;
  handleWebhook(payload: any, signature: string): Promise<{ handled: boolean; event: string }>;
}

export class MockPaymentProvider implements PaymentProvider {
  provider_name = 'Refeir Protected Payments Gateway (Simulated Africa Rail)';
  supported_countries = ['ALL'];

  async initializePayment(params: {
    amount: Money;
    customer_email: string;
    customer_name: string;
    project_id: string;
    country_iso: string;
  }): Promise<PaymentInitializationResult> {
    const ref = `PAY-RF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    return {
      payment_reference: ref,
      authorization_url: `https://checkout.refeir.africa/pay/${ref}`,
      status: 'PENDING',
      supported_methods: ['Debit Card', 'Bank Transfer', 'Mobile Money (M-Pesa, MTN, Airtel)', 'USSD'],
      provider_name: this.provider_name
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    // Simulated instant verification
    return {
      payment_reference: reference,
      is_successful: true,
      amount_paid: createMoney(1050000, 'NGN'),
      settlement_currency: 'NGN',
      gateway_response: 'Simulated Payment Authorized and Locked into Refeir Project Protection Pool.',
      timestamp: new Date().toISOString()
    };
  }

  async refundPayment(reference: string, amount: Money, reason: string) {
    return {
      success: true,
      refund_ref: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
  }

  async handleWebhook(payload: any, signature: string) {
    return { handled: true, event: 'charge.success' };
  }
}

export class NigeriaPaymentProvider extends MockPaymentProvider {
  override provider_name = 'Nigeria Payment Provider (Paystack / Flutterwave Rail)';
  override supported_countries = ['NG'];
}

export class GhanaPaymentProvider extends MockPaymentProvider {
  override provider_name = 'Ghana Payment Provider (MTN MoMo & Card Rail)';
  override supported_countries = ['GH'];
}

export class KenyaPaymentProvider extends MockPaymentProvider {
  override provider_name = 'Kenya Payment Provider (Safaricom M-Pesa & Card Rail)';
  override supported_countries = ['KE'];
}

export class SouthAfricaPaymentProvider extends MockPaymentProvider {
  override provider_name = 'South Africa Payment Provider (Ozow Instant EFT & Card Rail)';
  override supported_countries = ['ZA'];
}

export class InternationalPaymentProvider extends MockPaymentProvider {
  override provider_name = 'International Card Provider (Visa / Mastercard Multi-Currency Rail)';
  override supported_countries = ['USD', 'EUR', 'GBP'];
}

export function getPaymentProviderForCountry(countryIso: string): PaymentProvider {
  switch (countryIso.toUpperCase()) {
    case 'NG':
      return new NigeriaPaymentProvider();
    case 'GH':
      return new GhanaPaymentProvider();
    case 'KE':
      return new KenyaPaymentProvider();
    case 'ZA':
      return new SouthAfricaPaymentProvider();
    default:
      return new MockPaymentProvider();
  }
}
