import { Money, PayoutMethod, PayoutRequest } from '../types';

export interface PayoutProviderResult {
  payout_reference: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  transfer_fee: Money;
  estimated_arrival: string;
  message: string;
}

export interface PayoutProvider {
  provider_name: string;
  createPayout(params: {
    user_id: string;
    amount: Money;
    payout_method: PayoutMethod;
  }): Promise<PayoutProviderResult>;

  verifyPayout(reference: string): Promise<{ status: string; completed_at?: string }>;
}

export class MockPayoutProvider implements PayoutProvider {
  provider_name = 'Refeir Direct Pan-African Payout Rail (Bank & Mobile Money)';

  async createPayout(params: {
    user_id: string;
    amount: Money;
    payout_method: PayoutMethod;
  }): Promise<PayoutProviderResult> {
    const ref = `PO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const isMobileMoney = params.payout_method.type === 'MOBILE_MONEY';

    return {
      payout_reference: ref,
      status: 'COMPLETED', // instant simulation for demo
      transfer_fee: {
        amount_minor: 0,
        currency: params.amount.currency
      },
      estimated_arrival: isMobileMoney ? 'Instant (1-3 minutes via Mobile Money)' : 'Same Day (Within 2 hours via NIP / EFT)',
      message: `Dispatched ${params.amount.currency} payout to ${params.payout_method.institution_name} (${params.payout_method.masked_identifier}).`
    };
  }

  async verifyPayout(reference: string) {
    return {
      status: 'COMPLETED',
      completed_at: new Date().toISOString()
    };
  }
}

export const defaultPayoutProvider = new MockPayoutProvider();
