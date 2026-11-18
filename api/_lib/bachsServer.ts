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
  paid_at?: string | null;
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
}

export interface ServerEnv {
  BACHS_API_KEY?: string;
  BACHS_WEBHOOK_SECRET?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
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
    SUPABASE_SERVICE_ROLE_KEY: override?.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
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
      return { orders: {}, events: {} };
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as LocalStoreData;
    return {
      orders: parsed.orders || {},
      events: parsed.events || {}
    };
  } catch {
    return { orders: {}, events: {} };
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

  if (!projectId) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'projectId is required.' } };
  }
  if (!SUPPORTED_CHECKOUT_CURRENCIES.has(currency)) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: `Unsupported currency: ${currency}` } };
  }
  if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
    return { status: 400, body: { error: 'VALIDATION_ERROR', message: 'amountMinor must be a positive integer.' } };
  }

  const expectedAmount = formatMinorToDecimal(amountMinor);
  const shortNonce = crypto.randomBytes(4).toString('hex').toUpperCase();
  const safeProj = projectId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
  const reference = `RF_${safeProj}_${shortNonce}`.slice(0, 128);
  const idempotencyKey = `refeir-checkout-${reference}`;

  const canUseRedirectUrls = isPublicHttpUrl(originUrl);
  const cleanOrigin = canUseRedirectUrls ? originUrl.replace(/\/+$/, '') : '';

  const bachs = new Bachs({ apiKey: env.BACHS_API_KEY });
  const store = new BachsStore(env);

  try {
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

    const now = new Date().toISOString();
    const orderRecord: BachsOrderRecord = {
      id: crypto.randomUUID(),
      project_id: projectId,
      checkout_id: session.checkout_id,
      reference,
      expected_amount: expectedAmount,
      currency,
      status: 'PENDING',
      idempotency_key: idempotencyKey,
      created_at: now,
      updated_at: now
    };

    await store.saveOrder(orderRecord);

    return {
      status: 201,
      body: {
        checkout_id: session.checkout_id,
        checkout_url: session.checkout_url,
        reference: session.reference || reference,
        status: orderRecord.status,
        expected_amount: expectedAmount,
        currency,
        expires_at: session.expires_at,
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
