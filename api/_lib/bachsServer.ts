import { Bachs, webhooks, BachsApiError, BachsWebhookError, type WebhookHeaders } from '@bachs/sdk';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export interface BachsOrderRecord {
  id: string;
  project_id: string;
  checkout_id: string;
  reference: string;
  expected_amount: string;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
  idempotency_key: string;
  payment_id?: string | null;
  seller_account_id?: string | null;
  platform_fee?: string | null;
  transfer_id?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BachsConnectedAccountRecord {
  id: string;
  user_id: string;
  account_id: string;
  contact_email: string;
  display_name?: string | null;
  country: string;
  entity_type: 'individual' | 'company';
  transfers_status: 'restricted' | 'active';
  payouts_status: 'restricted' | 'active';
  international_payouts: boolean;
  requirements_due: string[];
  liveness_owed: boolean;
  created_at: string;
  updated_at: string;
}

export interface BachsTransferRecord {
  transfer_id: string;
  checkout_id?: string | null;
  account_id: string;
  amount: string;
  currency: string;
  source_charge_id?: string | null;
  description?: string | null;
  created_at: string;
}

export interface BachsPayoutRecord {
  id: string;
  payout_id?: string | null;
  user_id: string;
  account_id: string;
  destination_id: string;
  amount: string;
  currency: string;
  fee?: string | null;
  total_debited?: string | null;
  reference: string;
  idempotency_key: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'uncertain';
  failure_reason?: string | null;
  session_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BachsWebhookEventRecord {
  event_id: string;
  event_type: string;
  checkout_id: string | null;
  processed_at: string;
}

interface LocalStoreData {
  orders: Record<string, BachsOrderRecord>; // keyed by checkout_id
  events: Record<string, BachsWebhookEventRecord>; // keyed by event_id
  accounts: Record<string, BachsConnectedAccountRecord>; // keyed by account_id
  transfers: Record<string, BachsTransferRecord>; // keyed by transfer_id
  payouts: Record<string, BachsPayoutRecord>; // keyed by reference
}

export interface ServerEnv {
  BACHS_API_KEY?: string;
  BACHS_WEBHOOK_SECRET?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  fetchImpl?: typeof fetch;
}

export interface HandlerResult {
  status: number;
  body: Record<string, unknown>;
}

const SUPPORTED_CHECKOUT_CURRENCIES = new Set([
  'USD', 'GBP', 'EUR', 'CAD', 'AUD', 'AED', 'SGD',
  'NGN', 'KES', 'GHS', 'ZAR', 'EGP', 'RWF', 'TZS', 'UGX', 'XOF'
]);

function getEnv(override?: ServerEnv): ServerEnv {
  return {
    BACHS_API_KEY: override?.BACHS_API_KEY ?? process.env.BACHS_API_KEY,
    BACHS_WEBHOOK_SECRET: override?.BACHS_WEBHOOK_SECRET ?? process.env.BACHS_WEBHOOK_SECRET,
    SUPABASE_URL: override?.SUPABASE_URL ?? process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: override?.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
    fetchImpl: override?.fetchImpl
  };
}

function getSupabaseAdmin(env: ServerEnv): SupabaseClient | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

function getLocalStorePath(): string {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    return '/tmp/refeir-bachs-store.json';
  }
  return path.join(process.cwd(), '.data', 'bachs-store.json');
}

function readLocalStore(): LocalStoreData {
  const filePath = getLocalStorePath();
  try {
    if (!fs.existsSync(filePath)) {
      return { orders: {}, events: {}, accounts: {}, transfers: {}, payouts: {} };
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalStoreData>;
    return {
      orders: parsed.orders || {},
      events: parsed.events || {},
      accounts: parsed.accounts || {},
      transfers: parsed.transfers || {},
      payouts: parsed.payouts || {}
    };
  } catch {
    return { orders: {}, events: {}, accounts: {}, transfers: {}, payouts: {} };
  }
}

function writeLocalStore(data: LocalStoreData): void {
  const filePath = getLocalStorePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = `${filePath}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
}

class BachsStore {
  private supabase: SupabaseClient | null;

  constructor(env: ServerEnv) {
    this.supabase = getSupabaseAdmin(env);
  }

  async saveOrder(order: BachsOrderRecord): Promise<void> {
    if (this.supabase) {
      const { error } = await this.supabase.from('bachs_orders').upsert(order, {
        onConflict: 'checkout_id'
      });
      if (error) {
        throw new Error(`Supabase saveOrder failed: ${error.message}`);
      }
      return;
    }

    const store = readLocalStore();
    store.orders[order.checkout_id] = order;
    writeLocalStore(store);
  }

  async getOrderByCheckoutId(checkoutId: string): Promise<BachsOrderRecord | null> {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('bachs_orders')
        .select('*')
        .eq('checkout_id', checkoutId)
        .maybeSingle();
      if (error) throw new Error(`Supabase getOrderByCheckoutId failed: ${error.message}`);
      return (data as BachsOrderRecord) || null;
    }

    const store = readLocalStore();
    return store.orders[checkoutId] || null;
  }

  async getLatestOrderByProjectId(projectId: string): Promise<BachsOrderRecord | null> {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('bachs_orders')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`Supabase getLatestOrderByProjectId failed: ${error.message}`);
      return (data as BachsOrderRecord) || null;
    }

    const store = readLocalStore();
    const matches = Object.values(store.orders)
      .filter(o => o.project_id === projectId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return matches[0] || null;
  }

  async hasProcessedEvent(eventId: string): Promise<boolean> {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('bachs_webhook_events')
        .select('event_id')
        .eq('event_id', eventId)
        .maybeSingle();
      if (error) throw new Error(`Supabase hasProcessedEvent failed: ${error.message}`);
      return Boolean(data);
    }

    const store = readLocalStore();
    return Boolean(store.events[eventId]);
  }

  async commitOrderUpdateAndEvent(
    checkoutId: string,
    nextStatus: BachsOrderRecord['status'],
    eventRecord: BachsWebhookEventRecord,
    paymentId?: string | null
  ): Promise<BachsOrderRecord | null> {
    const now = new Date().toISOString();

    if (this.supabase) {
      const existing = await this.getOrderByCheckoutId(checkoutId);
      if (existing) {
        // Prevent older/unsuccessful events from overwriting a PAID order
        const shouldUpdateStatus = existing.status !== 'PAID' || nextStatus === 'PAID';
        if (shouldUpdateStatus) {
          const { error: orderErr } = await this.supabase
            .from('bachs_orders')
            .update({
              status: nextStatus,
              payment_id: paymentId ?? existing.payment_id ?? null,
              paid_at: nextStatus === 'PAID' ? (existing.paid_at || now) : existing.paid_at,
              updated_at: now
            })
            .eq('checkout_id', checkoutId);
          if (orderErr) throw new Error(`Supabase update order failed: ${orderErr.message}`);
        }
      }

      const { error: evtErr } = await this.supabase.from('bachs_webhook_events').upsert(eventRecord, {
        onConflict: 'event_id'
      });
      if (evtErr) throw new Error(`Supabase record event failed: ${evtErr.message}`);

      return await this.getOrderByCheckoutId(checkoutId);
    }

    const store = readLocalStore();
    const existing = store.orders[checkoutId] || null;
    if (existing) {
      const shouldUpdateStatus = existing.status !== 'PAID' || nextStatus === 'PAID';
      if (shouldUpdateStatus) {
        store.orders[checkoutId] = {
          ...existing,
          status: nextStatus,
          payment_id: paymentId ?? existing.payment_id ?? null,
          paid_at: nextStatus === 'PAID' ? (existing.paid_at || now) : existing.paid_at,
          updated_at: now
        };
      }
    }
    store.events[eventRecord.event_id] = eventRecord;
    writeLocalStore(store);
    return store.orders[checkoutId] || null;
  }

  async recordEventOnly(eventRecord: BachsWebhookEventRecord): Promise<void> {
    if (this.supabase) {
      const { error } = await this.supabase.from('bachs_webhook_events').upsert(eventRecord, {
        onConflict: 'event_id'
      });
      if (error) throw new Error(`Supabase recordEventOnly failed: ${error.message}`);
      return;
    }

    const store = readLocalStore();
    store.events[eventRecord.event_id] = eventRecord;
    writeLocalStore(store);
  }

  async saveConnectedAccount(account: BachsConnectedAccountRecord): Promise<void> {
    if (this.supabase) {
      const { error } = await this.supabase.from('bachs_connected_accounts').upsert(account, {
        onConflict: 'account_id'
      });
      if (error) throw new Error(`Supabase saveConnectedAccount failed: ${error.message}`);
      return;
    }

    const store = readLocalStore();
    store.accounts[account.account_id] = account;
    writeLocalStore(store);
  }

  async getConnectedAccountByUserId(userId: string): Promise<BachsConnectedAccountRecord | null> {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('bachs_connected_accounts')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw new Error(`Supabase getConnectedAccountByUserId failed: ${error.message}`);
      return (data as BachsConnectedAccountRecord) || null;
    }

    const store = readLocalStore();
    return Object.values(store.accounts).find(a => a.user_id === userId) || null;
  }

  async getConnectedAccountByAccountId(accountId: string): Promise<BachsConnectedAccountRecord | null> {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('bachs_connected_accounts')
        .select('*')
        .eq('account_id', accountId)
        .maybeSingle();
      if (error) throw new Error(`Supabase getConnectedAccountByAccountId failed: ${error.message}`);
      return (data as BachsConnectedAccountRecord) || null;
    }

    const store = readLocalStore();
    return store.accounts[accountId] || null;
  }

  async saveTransfer(transfer: BachsTransferRecord): Promise<void> {
    if (this.supabase) {
      const { error } = await this.supabase.from('bachs_transfers').upsert(transfer, {
        onConflict: 'transfer_id'
      });
      if (error) throw new Error(`Supabase saveTransfer failed: ${error.message}`);
      return;
    }

    const store = readLocalStore();
    store.transfers[transfer.transfer_id] = transfer;
    writeLocalStore(store);
  }

  async listTransfersByAccountId(accountId: string): Promise<BachsTransferRecord[]> {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('bachs_transfers')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(`Supabase listTransfersByAccountId failed: ${error.message}`);
      return (data as BachsTransferRecord[]) || [];
    }

    const store = readLocalStore();
    return Object.values(store.transfers)
      .filter(t => t.account_id === accountId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async savePayout(payout: BachsPayoutRecord): Promise<void> {
    if (this.supabase) {
      const { error } = await this.supabase.from('bachs_payouts').upsert(payout, {
        onConflict: 'reference'
      });
      if (error) throw new Error(`Supabase savePayout failed: ${error.message}`);
      return;
    }

    const store = readLocalStore();
    store.payouts[payout.reference] = payout;
    writeLocalStore(store);
  }

  async getPayoutByReference(reference: string): Promise<BachsPayoutRecord | null> {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('bachs_payouts')
        .select('*')
        .eq('reference', reference)
        .maybeSingle();
      if (error) throw new Error(`Supabase getPayoutByReference failed: ${error.message}`);
      return (data as BachsPayoutRecord) || null;
    }

    const store = readLocalStore();
    return store.payouts[reference] || null;
  }

  async listPayoutsByAccountId(accountId: string): Promise<BachsPayoutRecord[]> {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('bachs_payouts')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(`Supabase listPayoutsByAccountId failed: ${error.message}`);
      return (data as BachsPayoutRecord[]) || [];
    }

    const store = readLocalStore();
    return Object.values(store.payouts)
      .filter(p => p.account_id === accountId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
}

export function getBachsBaseUrl(apiKey: string): string {
  if (apiKey.startsWith('sk_sandbox_')) return 'https://sandbox-api.bachs.io';
  if (apiKey.startsWith('sk_live_')) return 'https://api.bachs.io';
  throw new Error('Invalid BACHS_API_KEY prefix: expected sk_sandbox_ or sk_live_.');
}

interface BachsApiResponse<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T | null;
  errorCode?: string;
  message?: string;
  outcomeUnknown: boolean;
}

async function bachsApiRequest<T = Record<string, unknown>>(
  env: ServerEnv,
  apiPath: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: Record<string, unknown>;
    accountId?: string;
    idempotencyKey?: string;
  } = {}
): Promise<BachsApiResponse<T>> {
  const apiKey = env.BACHS_API_KEY || '';
  const baseUrl = getBachsBaseUrl(apiKey);
  const fetchFn = env.fetchImpl ?? fetch;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  if (options.accountId) {
    headers['X-Account-Id'] = options.accountId;
  }
  if (options.idempotencyKey) {
    headers['Idempotency-Key'] = options.idempotencyKey;
  }

  try {
    const response = await fetchFn(`${baseUrl}${apiPath}`, {
      method: options.method || 'GET',
      headers,
      ...(options.body ? { body: JSON.stringify(options.body) } : {})
    });

    const text = await response.text();
    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = text ? (JSON.parse(text) as Record<string, unknown>) : null;
    } catch {
      parsed = null;
    }

    if (response.ok) {
      return {
        ok: true,
        status: response.status,
        data: parsed as T,
        outcomeUnknown: false
      };
    }

    const isServerError = response.status >= 500;
    return {
      ok: false,
      status: response.status,
      data: parsed as T | null,
      errorCode: typeof parsed?.error_code === 'string' ? parsed.error_code : 'BACHS_API_ERROR',
      message:
        typeof parsed?.detail === 'string'
          ? parsed.detail
          : typeof parsed?.message === 'string'
            ? parsed.message
            : `Bachs API responded with HTTP ${response.status}`,
      outcomeUnknown: isServerError
    };
  } catch (err) {
    return {
      ok: false,
      status: 504,
      data: null,
      errorCode: 'NETWORK_OR_TIMEOUT',
      message: err instanceof Error ? err.message : 'Network error calling Bachs API',
      outcomeUnknown: true
    };
  }
}

export function isPublicHttpUrl(rawUrl?: string): boolean {
  if (!rawUrl) return false;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host === '[::1]' ||
      host.endsWith('.local') ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function formatMinorToDecimal(amountMinor: number): string {
  return (amountMinor / 100).toFixed(2);
}

export function amountsMatch(expectedDecimal: string, receivedDecimal?: string | null): boolean {
  if (!receivedDecimal) return false;
  const expectedCents = Math.round(Number(expectedDecimal) * 100);
  const receivedCents = Math.round(Number(receivedDecimal) * 100);
  return Number.isFinite(expectedCents) && Number.isFinite(receivedCents) && expectedCents === receivedCents;
}

export async function handleCreateCheckoutSession(
  body: Record<string, unknown>,
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  if (!env.BACHS_API_KEY) {
    return {
      status: 503,
      body: {
        error: 'BACHS_NOT_CONFIGURED',
        message: 'BACHS_API_KEY is not configured on the server. Add your sk_sandbox_... key to .env.'
      }
    };
  }

  const projectId = typeof body.projectId === 'string' ? body.projectId.trim() : '';
  const currency = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : '';
  const amountMinor = typeof body.amountMinor === 'number' ? Math.round(body.amountMinor) : 0;
  const customerEmail = typeof body.customerEmail === 'string' ? body.customerEmail.trim() : '';
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const originUrl = typeof body.originUrl === 'string' ? body.originUrl.trim() : '';
  const sellerUserId = typeof body.sellerUserId === 'string' ? body.sellerUserId.trim() : '';
  const explicitSellerAccountId = typeof body.sellerAccountId === 'string' ? body.sellerAccountId.trim() : '';

  if (!projectId) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'projectId is required.' } };
  }
  if (!SUPPORTED_CHECKOUT_CURRENCIES.has(currency)) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: `Unsupported currency: ${currency}` } };
  }
  if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'amountMinor must be a positive integer.' } };
  }

  const store = new BachsStore(env);
  let sellerAccountId: string | null = explicitSellerAccountId || null;
  if (!sellerAccountId && sellerUserId) {
    const sellerAcct = await store.getConnectedAccountByUserId(sellerUserId);
    if (sellerAcct) {
      sellerAccountId = sellerAcct.account_id;
    }
  }

  // Compute platform fee strictly on the server (10% marketplace platform fee by default)
  const platformFeeMinor = sellerAccountId ? Math.max(1, Math.round(amountMinor * 0.1)) : 0;
  if (sellerAccountId && platformFeeMinor >= amountMinor) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', message: 'Platform fee must be less than total checkout amount.' }
    };
  }
  const platformFeeDecimal = sellerAccountId ? formatMinorToDecimal(platformFeeMinor) : null;

  const expectedAmount = formatMinorToDecimal(amountMinor);
  const shortNonce = crypto.randomBytes(4).toString('hex').toUpperCase();
  const safeProj = projectId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
  const reference = `RF_${safeProj}_${shortNonce}`.slice(0, 128);
  const idempotencyKey = `refeir-checkout-${reference}`;

  const canUseRedirectUrls = isPublicHttpUrl(originUrl);
  const cleanOrigin = canUseRedirectUrls ? originUrl.replace(/\/+$/, '') : '';

  const bachs = new Bachs({ apiKey: env.BACHS_API_KEY });

  try {
    let checkoutId = '';
    let checkoutUrl = '';
    let sessionReference = reference;
    let expiresAt: string | undefined;

    if (sellerAccountId && platformFeeDecimal) {
      // Destination charge: Connect split fields (transfer_data, platform_fee) are sent via documented REST API
      const payload: Record<string, unknown> = {
        pricing: {
          currency,
          amount: expectedAmount,
          price_type: 'fixed'
        },
        transfer_data: {
          destination: sellerAccountId
        },
        platform_fee: platformFeeDecimal,
        customer_creation: 'if_required',
        reference,
        metadata: {
          project_id: projectId,
          platform: 'refeir-marketplace',
          seller_account_id: sellerAccountId,
          expected_amount: expectedAmount,
          expected_currency: currency,
          platform_fee: platformFeeDecimal
        }
      };
      if (customerEmail) {
        payload.customer = {
          email: customerEmail,
          name: customerName || 'Refeir Client'
        };
      }
      if (canUseRedirectUrls) {
        payload.success_url = `${cleanOrigin}/projects/${encodeURIComponent(projectId)}`;
        payload.cancel_url = `${cleanOrigin}/projects/${encodeURIComponent(projectId)}?payment=cancelled`;
      }

      const apiRes = await bachsApiRequest<{
        checkout_id: string;
        checkout_url: string;
        reference?: string;
        expires_at?: string;
      }>(env, '/v1/checkout-sessions', {
        method: 'POST',
        body: payload,
        idempotencyKey
      });

      if (!apiRes.ok || !apiRes.data) {
        return {
          status: apiRes.status >= 400 && apiRes.status < 600 ? apiRes.status : 502,
          body: {
            error: apiRes.errorCode || 'BACHS_API_ERROR',
            message: apiRes.message || 'Failed to create destination checkout session.',
            outcomeUnknown: apiRes.outcomeUnknown
          }
        };
      }

      checkoutId = apiRes.data.checkout_id;
      checkoutUrl = apiRes.data.checkout_url;
      sessionReference = apiRes.data.reference || reference;
      expiresAt = apiRes.data.expires_at;
    } else {
      const session = await bachs.checkoutSessions.create(
        {
          pricing: {
            currency,
            amount: expectedAmount,
            price_type: 'fixed'
          },
          ...(customerEmail
            ? {
                customer: {
                  email: customerEmail,
                  name: customerName || 'Refeir Client'
                }
              }
            : {}),
          customer_creation: 'if_required',
          reference,
          metadata: {
            project_id: projectId,
            platform: 'refeir-marketplace',
            expected_amount: expectedAmount,
            expected_currency: currency
          },
          ...(canUseRedirectUrls
            ? {
                success_url: `${cleanOrigin}/projects/${encodeURIComponent(projectId)}`,
                cancel_url: `${cleanOrigin}/projects/${encodeURIComponent(projectId)}?payment=cancelled`
              }
            : {})
        },
        { idempotencyKey }
      );
      checkoutId = session.checkout_id;
      checkoutUrl = session.checkout_url;
      sessionReference = session.reference || reference;
      expiresAt = session.expires_at;
    }

    const now = new Date().toISOString();
    const orderRecord: BachsOrderRecord = {
      id: crypto.randomUUID(),
      project_id: projectId,
      checkout_id: checkoutId,
      reference: sessionReference,
      expected_amount: expectedAmount,
      currency,
      status: 'PENDING',
      idempotency_key: idempotencyKey,
      seller_account_id: sellerAccountId,
      platform_fee: platformFeeDecimal,
      created_at: now,
      updated_at: now
    };

    await store.saveOrder(orderRecord);

    return {
      status: 201,
      body: {
        checkout_id: checkoutId,
        checkout_url: checkoutUrl,
        reference: sessionReference,
        status: orderRecord.status,
        expected_amount: expectedAmount,
        currency,
        seller_account_id: sellerAccountId,
        platform_fee: platformFeeDecimal,
        expires_at: expiresAt,
        environment: bachs.environment,
        is_local_no_redirect: !canUseRedirectUrls
      }
    };
  } catch (err) {
    if (err instanceof BachsApiError) {
      return {
        status: err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 502,
        body: {
          error: err.errorCode || 'BACHS_API_ERROR',
          message: err.message,
          outcomeUnknown: Boolean((err as any).outcomeUnknown)
        }
      };
    }
    const message = err instanceof Error ? err.message : 'Failed to create Bachs checkout session.';
    return {
      status: 500,
      body: { error: 'INTERNAL_ERROR', message }
    };
  }
}

export async function handleGetCheckoutStatus(
  query: { checkout_id?: string; project_id?: string },
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  const store = new BachsStore(env);

  try {
    let order: BachsOrderRecord | null = null;
    if (query.checkout_id) {
      order = await store.getOrderByCheckoutId(query.checkout_id);
    } else if (query.project_id) {
      order = await store.getLatestOrderByProjectId(query.project_id);
    } else {
      return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'checkout_id or project_id is required.' } };
    }

    if (!order) {
      return { status: 404, body: { error: 'NOT_FOUND', message: 'Order not found.' } };
    }

    // Read-only status check: fulfillment is strictly driven by verified webhooks.
    return {
      status: 200,
      body: {
        checkout_id: order.checkout_id,
        project_id: order.project_id,
        reference: order.reference,
        status: order.status,
        expected_amount: order.expected_amount,
        currency: order.currency,
        paid_at: order.paid_at || null
      }
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read checkout status.';
    return { status: 500, body: { error: 'INTERNAL_ERROR', message } };
  }
}

export async function handleBachsWebhook(
  rawBody: string | Uint8Array,
  headers: WebhookHeaders,
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  if (!env.BACHS_WEBHOOK_SECRET || !env.BACHS_API_KEY) {
    return {
      status: 500,
      body: { error: 'BACHS_NOT_CONFIGURED', message: 'BACHS_WEBHOOK_SECRET or BACHS_API_KEY is missing.' }
    };
  }

  let event;
  try {
    event = webhooks.constructEvent(rawBody, headers, env.BACHS_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof BachsWebhookError || err instanceof Error ? err.message : 'Invalid webhook signature.';
    return { status: 400, body: { error: 'INVALID_SIGNATURE', message } };
  }

  const store = new BachsStore(env);

  try {
    const alreadyProcessed = await store.hasProcessedEvent(event.id);
    if (alreadyProcessed) {
      return { status: 200, body: { received: true, duplicate: true, event_id: event.id } };
    }

    const data = (event.data || {}) as Record<string, unknown>;
    const checkoutId =
      (typeof data.checkout_id === 'string' && data.checkout_id) ||
      (typeof data.id === 'string' && event.type.startsWith('checkout.') ? data.id : '') ||
      '';

    if (event.type === 'checkout.completed' || event.type === 'collection.succeeded') {
      if (!checkoutId) {
        await store.recordEventOnly({
          event_id: event.id,
          event_type: event.type,
          checkout_id: null,
          processed_at: new Date().toISOString()
        });
        return { status: 200, body: { received: true, ignored: 'missing_checkout_id' } };
      }

      const order = await store.getOrderByCheckoutId(checkoutId);
      if (!order) {
        // Unrelated checkout or deposit without a matching local order — do not mark any order paid.
        await store.recordEventOnly({
          event_id: event.id,
          event_type: event.type,
          checkout_id: checkoutId,
          processed_at: new Date().toISOString()
        });
        return { status: 200, body: { received: true, ignored: 'order_not_found' } };
      }

      const bachs = new Bachs({ apiKey: env.BACHS_API_KEY });
      const session = await bachs.checkoutSessions.get(checkoutId);

      if (session.status !== 'completed') {
        // Return 5xx so Bachs retries once checkout reaches completed state
        return {
          status: 500,
          body: {
            error: 'CHECKOUT_NOT_COMPLETED_YET',
            message: `Checkout ${checkoutId} status is ${session.status}; retrying.`
          }
        };
      }

      const amountValid = amountsMatch(order.expected_amount, session.amount);
      const currencyValid = (session.currency || '').toUpperCase() === order.currency.toUpperCase();

      if (!amountValid || !currencyValid) {
        await store.recordEventOnly({
          event_id: event.id,
          event_type: event.type,
          checkout_id: checkoutId,
          processed_at: new Date().toISOString()
        });
        return {
          status: 200,
          body: {
            received: true,
            ignored: 'amount_or_currency_mismatch'
          }
        };
      }

      const paymentId = session.charge?.payment_id || (typeof data.payment_id === 'string' ? data.payment_id : null);
      await store.commitOrderUpdateAndEvent(
        checkoutId,
        'PAID',
        {
          event_id: event.id,
          event_type: event.type,
          checkout_id: checkoutId,
          processed_at: new Date().toISOString()
        },
        paymentId
      );

      return { status: 200, body: { received: true, fulfilled: true, checkout_id: checkoutId } };
    }

    if (event.type === 'checkout.expired' || event.type === 'collection.failed') {
      const nextStatus = event.type === 'checkout.expired' ? 'EXPIRED' : 'FAILED';
      if (checkoutId) {
        await store.commitOrderUpdateAndEvent(checkoutId, nextStatus, {
          event_id: event.id,
          event_type: event.type,
          checkout_id: checkoutId,
          processed_at: new Date().toISOString()
        });
      } else {
        await store.recordEventOnly({
          event_id: event.id,
          event_type: event.type,
          checkout_id: null,
          processed_at: new Date().toISOString()
        });
      }
      return { status: 200, body: { received: true, status: nextStatus } };
    }

    if (event.type === 'account.updated') {
      const accountId =
        (typeof data.account === 'string' && data.account) ||
        (typeof (event as unknown as Record<string, unknown>).account === 'string'
          ? ((event as unknown as Record<string, unknown>).account as string)
          : '') ||
        (typeof event.organization_id === 'string' ? event.organization_id : '');
      const outstanding = Array.isArray(data.outstanding)
        ? data.outstanding.filter((item): item is string => typeof item === 'string')
        : [];
      if (accountId) {
        const existingAccount = await store.getConnectedAccountByAccountId(accountId);
        if (existingAccount) {
          await store.saveConnectedAccount({
            ...existingAccount,
            requirements_due: outstanding,
            updated_at: new Date().toISOString()
          });
        }
      }
      await store.recordEventOnly({
        event_id: event.id,
        event_type: event.type,
        checkout_id: accountId || null,
        processed_at: new Date().toISOString()
      });
      return { status: 200, body: { received: true, account_id: accountId || null } };
    }

    if (event.type === 'capability.updated') {
      const accountId =
        (typeof data.account === 'string' && data.account) ||
        (typeof (event as unknown as Record<string, unknown>).account === 'string'
          ? ((event as unknown as Record<string, unknown>).account as string)
          : '') ||
        (typeof event.organization_id === 'string' ? event.organization_id : '');
      const capability = typeof data.capability === 'string' ? data.capability : '';
      const capStatus = data.status === 'active' ? 'active' : 'restricted';

      if (accountId) {
        const existingAccount = await store.getConnectedAccountByAccountId(accountId);
        if (existingAccount) {
          const updated: BachsConnectedAccountRecord = {
            ...existingAccount,
            updated_at: new Date().toISOString()
          };
          if (capability === 'transfers') {
            updated.transfers_status = capStatus;
          } else if (capability === 'payouts') {
            updated.payouts_status = capStatus;
            if (typeof data.international === 'boolean') {
              updated.international_payouts = data.international;
            }
          }
          await store.saveConnectedAccount(updated);
        }
      }
      await store.recordEventOnly({
        event_id: event.id,
        event_type: event.type,
        checkout_id: accountId || null,
        processed_at: new Date().toISOString()
      });
      return { status: 200, body: { received: true, capability, status: capStatus } };
    }

    if (event.type === 'transfer.created') {
      const transferId = typeof data.transfer_id === 'string' ? data.transfer_id : '';
      const destinationAccountId =
        (typeof data.destination === 'string' && data.destination) ||
        (typeof (event as unknown as Record<string, unknown>).account === 'string'
          ? ((event as unknown as Record<string, unknown>).account as string)
          : '');
      const amount = typeof data.amount === 'string' ? data.amount : '0.00';
      const currency = typeof data.currency === 'string' ? data.currency.toUpperCase() : 'NGN';

      if (transferId && destinationAccountId) {
        await store.saveTransfer({
          transfer_id: transferId,
          checkout_id: typeof data.checkout_id === 'string' ? data.checkout_id : null,
          account_id: destinationAccountId,
          amount,
          currency,
          source_charge_id: typeof data.source_charge_id === 'string' ? data.source_charge_id : null,
          description: typeof data.description === 'string' ? data.description : null,
          created_at: typeof data.created_at === 'string' ? data.created_at : new Date().toISOString()
        });
      }
      await store.recordEventOnly({
        event_id: event.id,
        event_type: event.type,
        checkout_id: transferId || null,
        processed_at: new Date().toISOString()
      });
      return { status: 200, body: { received: true, transfer_id: transferId || null } };
    }

    if (event.type === 'payout.paid' || event.type === 'payout.failed') {
      const reference = typeof data.reference === 'string' ? data.reference : '';
      const withdrawalId = typeof data.withdrawal_id === 'string' ? data.withdrawal_id : null;
      const nextStatus = event.type === 'payout.paid' ? 'completed' : 'failed';

      if (reference) {
        const existingPayout = await store.getPayoutByReference(reference);
        if (existingPayout) {
          // Protect completed payout state from late out-of-order failure events
          const shouldUpdate = existingPayout.status !== 'completed' || nextStatus === 'completed';
          if (shouldUpdate) {
            await store.savePayout({
              ...existingPayout,
              payout_id: withdrawalId ?? existingPayout.payout_id,
              status: nextStatus,
              fee: typeof data.withdrawal_fee === 'string' ? data.withdrawal_fee : existingPayout.fee,
              session_id: typeof data.session_id === 'string' ? data.session_id : existingPayout.session_id,
              failure_reason:
                nextStatus === 'failed'
                  ? (typeof data.failure_reason === 'string' ? data.failure_reason : 'Payout delivery failed.')
                  : null,
              updated_at: new Date().toISOString()
            });
          }
        }
      }
      await store.recordEventOnly({
        event_id: event.id,
        event_type: event.type,
        checkout_id: withdrawalId || reference || null,
        processed_at: new Date().toISOString()
      });
      return { status: 200, body: { received: true, payout_status: nextStatus } };
    }

    // Acknowledge any other subscribed event types idempotently
    await store.recordEventOnly({
      event_id: event.id,
      event_type: event.type,
      checkout_id: checkoutId || null,
      processed_at: new Date().toISOString()
    });
    return { status: 200, body: { received: true } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed.';
    // Return 500 on processing failure so Bachs redelivers the event
    return { status: 500, body: { error: 'WEBHOOK_PROCESSING_ERROR', message } };
  }
}

export async function handleCreateConnectedAccount(
  body: Record<string, unknown>,
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  if (!env.BACHS_API_KEY) {
    return {
      status: 503,
      body: { error: 'BACHS_NOT_CONFIGURED', message: 'BACHS_API_KEY is not configured on the server.' }
    };
  }

  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const contactEmail = typeof body.contactEmail === 'string' ? body.contactEmail.trim() : '';
  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
  const country = typeof body.country === 'string' && body.country.trim() ? body.country.trim().toUpperCase() : 'NG';
  const entityType = body.entityType === 'company' ? 'company' : 'individual';
  const internationalPayouts = Boolean(body.internationalPayouts);

  if (!userId) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'userId is required.' } };
  }
  if (!contactEmail || !contactEmail.includes('@')) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'A valid seller contactEmail is required.' } };
  }

  const store = new BachsStore(env);
  const existing = await store.getConnectedAccountByUserId(userId);
  if (existing) {
    return { status: 200, body: { account: existing, already_exists: true } };
  }

  const idempotencyKey = `refeir-acct-${userId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48)}`;
  const apiRes = await bachsApiRequest<{
    id?: string;
    account_id?: string;
    capabilities?: Record<string, { status?: string; requested?: boolean }>;
    requirements?: { currently_due?: string[] };
    liveness_owed?: boolean;
  }>(env, '/v1/accounts', {
    method: 'POST',
    idempotencyKey,
    body: {
      contact_email: contactEmail,
      ...(displayName ? { display_name: displayName } : {}),
      country,
      entity_type: entityType,
      configuration: {
        recipient: {
          capabilities: {
            transfers: { requested: true },
            payouts: {
              requested: true,
              ...(internationalPayouts ? { international: true } : {})
            }
          }
        }
      }
    }
  });

  if (!apiRes.ok || !apiRes.data) {
    return {
      status: apiRes.status >= 400 && apiRes.status < 600 ? apiRes.status : 502,
      body: {
        error: apiRes.errorCode || 'BACHS_API_ERROR',
        message: apiRes.message || 'Failed to create connected account.',
        outcomeUnknown: apiRes.outcomeUnknown
      }
    };
  }

  const accountId = apiRes.data.id || apiRes.data.account_id || '';
  if (!accountId) {
    return { status: 502, body: { error: 'BACHS_API_ERROR', message: 'Bachs did not return an account ID.' } };
  }

  const caps = apiRes.data.capabilities || {};
  const now = new Date().toISOString();
  const record: BachsConnectedAccountRecord = {
    id: crypto.randomUUID(),
    user_id: userId,
    account_id: accountId,
    contact_email: contactEmail,
    display_name: displayName || null,
    country,
    entity_type: entityType,
    transfers_status: caps.transfers?.status === 'active' ? 'active' : 'restricted',
    payouts_status: caps.payouts?.status === 'active' ? 'active' : 'restricted',
    international_payouts: internationalPayouts,
    requirements_due: Array.isArray(apiRes.data.requirements?.currently_due)
      ? apiRes.data.requirements.currently_due
      : [],
    liveness_owed: Boolean(apiRes.data.liveness_owed),
    created_at: now,
    updated_at: now
  };

  await store.saveConnectedAccount(record);
  return { status: 201, body: { account: record } };
}

export async function handleGetConnectedAccount(
  query: { user_id?: string; account_id?: string; refresh?: string },
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  const store = new BachsStore(env);

  let account: BachsConnectedAccountRecord | null = null;
  if (query.account_id) {
    account = await store.getConnectedAccountByAccountId(query.account_id);
  } else if (query.user_id) {
    account = await store.getConnectedAccountByUserId(query.user_id);
  } else {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'user_id or account_id is required.' } };
  }

  if (!account) {
    return { status: 404, body: { error: 'NOT_FOUND', message: 'Connected account not found.' } };
  }

  if (query.refresh === 'true' && env.BACHS_API_KEY) {
    const apiRes = await bachsApiRequest<{
      capabilities?: Record<string, { status?: string }>;
      requirements?: { currently_due?: string[] };
      liveness_owed?: boolean;
    }>(env, `/v1/accounts/${encodeURIComponent(account.account_id)}`, { method: 'GET' });

    if (apiRes.ok && apiRes.data) {
      const caps = apiRes.data.capabilities || {};
      account = {
        ...account,
        transfers_status: caps.transfers?.status === 'active' ? 'active' : account.transfers_status,
        payouts_status: caps.payouts?.status === 'active' ? 'active' : account.payouts_status,
        requirements_due: Array.isArray(apiRes.data.requirements?.currently_due)
          ? apiRes.data.requirements.currently_due
          : account.requirements_due,
        liveness_owed:
          typeof apiRes.data.liveness_owed === 'boolean' ? apiRes.data.liveness_owed : account.liveness_owed,
        updated_at: new Date().toISOString()
      };
      await store.saveConnectedAccount(account);
    }
  }

  const [transfers, payouts] = await Promise.all([
    store.listTransfersByAccountId(account.account_id),
    store.listPayoutsByAccountId(account.account_id)
  ]);

  return {
    status: 200,
    body: {
      account,
      transfers,
      payouts
    }
  };
}

export async function handleCreateAccountLink(
  body: Record<string, unknown>,
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  if (!env.BACHS_API_KEY) {
    return {
      status: 503,
      body: { error: 'BACHS_NOT_CONFIGURED', message: 'BACHS_API_KEY is not configured on the server.' }
    };
  }

  const accountId = typeof body.accountId === 'string' ? body.accountId.trim() : '';
  const linkType = body.type === 'update' || body.type === 'liveness' ? body.type : 'onboarding';
  const originUrl = typeof body.originUrl === 'string' ? body.originUrl.trim() : '';

  if (!accountId) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'accountId is required.' } };
  }

  const canUseRedirect = isPublicHttpUrl(originUrl);
  const cleanOrigin = canUseRedirect ? originUrl.replace(/\/+$/, '') : '';

  const payload: Record<string, unknown> = {
    type: linkType
  };
  if (canUseRedirect) {
    payload.return_url = `${cleanOrigin}/wallet?connect=returned`;
    payload.refresh_url = `${cleanOrigin}/wallet?connect=refresh`;
  }

  const apiRes = await bachsApiRequest<{ url?: string; expires_at?: string }>(
    env,
    `/v1/accounts/${encodeURIComponent(accountId)}/account-links`,
    {
      method: 'POST',
      body: payload
    }
  );

  if (!apiRes.ok || !apiRes.data?.url) {
    return {
      status: apiRes.status >= 400 && apiRes.status < 600 ? apiRes.status : 502,
      body: {
        error: apiRes.errorCode || 'BACHS_API_ERROR',
        message: apiRes.message || 'Failed to create onboarding link.'
      }
    };
  }

  return {
    status: 201,
    body: {
      url: apiRes.data.url,
      expires_at: apiRes.data.expires_at || null
    }
  };
}

export async function handleGetAccountBalances(
  query: { account_id?: string },
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  if (!env.BACHS_API_KEY) {
    return {
      status: 503,
      body: { error: 'BACHS_NOT_CONFIGURED', message: 'BACHS_API_KEY is not configured on the server.' }
    };
  }
  const accountId = (query.account_id || '').trim();
  if (!accountId) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'account_id is required.' } };
  }

  const apiRes = await bachsApiRequest(env, '/v1/balances', {
    method: 'GET',
    accountId
  });

  if (!apiRes.ok) {
    return {
      status: apiRes.status >= 400 && apiRes.status < 600 ? apiRes.status : 502,
      body: {
        error: apiRes.errorCode || 'BACHS_API_ERROR',
        message: apiRes.message || 'Failed to retrieve account balances.'
      }
    };
  }

  return { status: 200, body: (apiRes.data || {}) as Record<string, unknown> };
}

export async function handleListPayoutDestinations(
  query: { account_id?: string },
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  if (!env.BACHS_API_KEY) {
    return {
      status: 503,
      body: { error: 'BACHS_NOT_CONFIGURED', message: 'BACHS_API_KEY is not configured on the server.' }
    };
  }
  const accountId = (query.account_id || '').trim();
  if (!accountId) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'account_id is required.' } };
  }

  const apiRes = await bachsApiRequest(env, '/v1/payouts/destinations', {
    method: 'GET',
    accountId
  });

  if (!apiRes.ok) {
    return {
      status: apiRes.status >= 400 && apiRes.status < 600 ? apiRes.status : 502,
      body: {
        error: apiRes.errorCode || 'BACHS_API_ERROR',
        message: apiRes.message || 'Failed to list payout destinations.'
      }
    };
  }

  return { status: 200, body: (apiRes.data || {}) as Record<string, unknown> };
}

export async function handleCreatePayoutDestination(
  body: Record<string, unknown>,
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  if (!env.BACHS_API_KEY) {
    return {
      status: 503,
      body: { error: 'BACHS_NOT_CONFIGURED', message: 'BACHS_API_KEY is not configured on the server.' }
    };
  }

  const accountId = typeof body.accountId === 'string' ? body.accountId.trim() : '';
  const type = body.type === 'mobile_money' || body.type === 'crypto_wallet' ? body.type : 'bank_account';
  const currency = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : 'NGN';

  if (!accountId) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'accountId is required.' } };
  }

  const payload: Record<string, unknown> = {
    type,
    currency
  };
  if (typeof body.accountNumber === 'string' && body.accountNumber.trim()) {
    payload.account_number = body.accountNumber.trim();
  }
  if (typeof body.accountName === 'string' && body.accountName.trim()) {
    payload.account_name = body.accountName.trim();
  }
  if (typeof body.bankCode === 'string' && body.bankCode.trim()) {
    payload.bank_code = body.bankCode.trim();
  }
  if (typeof body.phoneNumber === 'string' && body.phoneNumber.trim()) {
    payload.phone_number = body.phoneNumber.trim();
  }
  if (typeof body.provider === 'string' && body.provider.trim()) {
    payload.provider = body.provider.trim();
  }

  const idempotencyKey = `refeir-dest-${accountId}-${crypto.randomBytes(6).toString('hex')}`;
  const apiRes = await bachsApiRequest(env, '/v1/payouts/destinations', {
    method: 'POST',
    accountId,
    idempotencyKey,
    body: payload
  });

  if (!apiRes.ok) {
    return {
      status: apiRes.status >= 400 && apiRes.status < 600 ? apiRes.status : 502,
      body: {
        error: apiRes.errorCode || 'BACHS_API_ERROR',
        message: apiRes.message || 'Failed to register payout destination.',
        outcomeUnknown: apiRes.outcomeUnknown
      }
    };
  }

  return { status: 201, body: (apiRes.data || {}) as Record<string, unknown> };
}

export async function handleCreateSellerPayout(
  body: Record<string, unknown>,
  envOverride?: ServerEnv
): Promise<HandlerResult> {
  const env = getEnv(envOverride);
  if (!env.BACHS_API_KEY) {
    return {
      status: 503,
      body: { error: 'BACHS_NOT_CONFIGURED', message: 'BACHS_API_KEY is not configured on the server.' }
    };
  }

  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const accountId = typeof body.accountId === 'string' ? body.accountId.trim() : '';
  const destinationId = typeof body.destinationId === 'string' ? body.destinationId.trim() : '';
  const currency = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : 'NGN';
  const amountMinor = typeof body.amountMinor === 'number' ? Math.round(body.amountMinor) : 0;

  if (!userId || !accountId || !destinationId) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', message: 'userId, accountId, and destinationId are required.' }
    };
  }
  if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
    return {
      status: 400,
      body: { error: 'VALIDATION_ERROR', message: 'amountMinor must be a positive integer.' }
    };
  }

  const store = new BachsStore(env);
  const account = await store.getConnectedAccountByAccountId(accountId);
  if (!account || account.user_id !== userId) {
    return {
      status: 403,
      body: { error: 'FORBIDDEN', message: 'Connected account does not belong to this user.' }
    };
  }

  // Gate 1: payouts capability must be active
  if (account.payouts_status !== 'active') {
    return {
      status: 409,
      body: {
        error: 'PAYOUTS_CAPABILITY_RESTRICTED',
        message: 'Seller payouts capability is not active yet. Complete onboarding requirements first.'
      }
    };
  }

  // Gate 2: destination must belong to this seller account and have is_usable === true
  const destRes = await bachsApiRequest<{ is_usable?: boolean; status?: string; currency?: string }>(
    env,
    `/v1/payouts/destinations/${encodeURIComponent(destinationId)}`,
    { method: 'GET', accountId }
  );
  if (!destRes.ok || !destRes.data) {
    return {
      status: destRes.status >= 400 && destRes.status < 600 ? destRes.status : 502,
      body: {
        error: destRes.errorCode || 'DESTINATION_LOOKUP_FAILED',
        message: destRes.message || 'Could not verify payout destination.'
      }
    };
  }
  if (!destRes.data.is_usable) {
    return {
      status: 409,
      body: {
        error: 'DESTINATION_NOT_USABLE',
        message: 'Selected payout destination is not usable yet (awaiting approval or rejected).'
      }
    };
  }

  const amountDecimal = formatMinorToDecimal(amountMinor);
  const reference =
    typeof body.reference === 'string' && body.reference.trim()
      ? body.reference.trim().slice(0, 128)
      : `PO_RF_${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const idempotencyKey = `refeir-payout-${reference}`;

  // Persist pending payout record with its Idempotency-Key before sending write
  const now = new Date().toISOString();
  const existingPayout = await store.getPayoutByReference(reference);
  const payoutRecord: BachsPayoutRecord = existingPayout || {
    id: crypto.randomUUID(),
    payout_id: null,
    user_id: userId,
    account_id: accountId,
    destination_id: destinationId,
    amount: amountDecimal,
    currency,
    reference,
    idempotency_key: idempotencyKey,
    status: 'pending',
    created_at: now,
    updated_at: now
  };
  await store.savePayout(payoutRecord);

  const apiRes = await bachsApiRequest<{
    id?: string;
    status?: string;
    amount?: string;
    currency?: string;
    fee?: string;
    total_debited?: string;
  }>(env, '/v1/payouts', {
    method: 'POST',
    accountId,
    idempotencyKey: payoutRecord.idempotency_key,
    body: {
      destination: destinationId,
      amount: amountDecimal,
      reference
    }
  });

  if (apiRes.outcomeUnknown) {
    // Uncertain write (timeout or 5xx): reconcile via GET /v1/payouts before retrying
    const reconcileRes = await bachsApiRequest<{ items?: Array<Record<string, unknown>> }>(
      env,
      `/v1/payouts?reference=${encodeURIComponent(reference)}`,
      { method: 'GET', accountId }
    );
    const matched = reconcileRes.ok
      ? reconcileRes.data?.items?.find(item => item.reference === reference)
      : undefined;

    if (matched) {
      const reconciled: BachsPayoutRecord = {
        ...payoutRecord,
        payout_id: typeof matched.id === 'string' ? matched.id : payoutRecord.payout_id,
        status:
          matched.status === 'completed' || matched.status === 'failed' || matched.status === 'processing'
            ? matched.status
            : 'pending',
        fee: typeof matched.fee === 'string' ? matched.fee : payoutRecord.fee,
        total_debited: typeof matched.total_debited === 'string' ? matched.total_debited : payoutRecord.total_debited,
        updated_at: new Date().toISOString()
      };
      await store.savePayout(reconciled);
      return { status: 200, body: { payout: reconciled, reconciled: true } };
    }

    const uncertainRecord: BachsPayoutRecord = {
      ...payoutRecord,
      status: 'uncertain',
      updated_at: new Date().toISOString()
    };
    await store.savePayout(uncertainRecord);
    return {
      status: 504,
      body: {
        error: 'OUTCOME_UNKNOWN',
        message: 'Payout request outcome is uncertain. Reconcile before retrying with the same reference.',
        payout: uncertainRecord,
        outcomeUnknown: true
      }
    };
  }

  if (!apiRes.ok || !apiRes.data) {
    await store.savePayout({
      ...payoutRecord,
      status: 'failed',
      failure_reason: apiRes.message || 'Payout rejected by Bachs.',
      updated_at: new Date().toISOString()
    });
    return {
      status: apiRes.status >= 400 && apiRes.status < 600 ? apiRes.status : 502,
      body: {
        error: apiRes.errorCode || 'BACHS_API_ERROR',
        message: apiRes.message || 'Failed to create payout.'
      }
    };
  }

  const createdPayout: BachsPayoutRecord = {
    ...payoutRecord,
    payout_id: apiRes.data.id || null,
    status:
      apiRes.data.status === 'completed' || apiRes.data.status === 'failed' || apiRes.data.status === 'processing'
        ? apiRes.data.status
        : 'pending',
    fee: apiRes.data.fee || null,
    total_debited: apiRes.data.total_debited || null,
    updated_at: new Date().toISOString()
  };
  await store.savePayout(createdPayout);

  return { status: 201, body: { payout: createdPayout } };
}

