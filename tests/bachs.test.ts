import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  handleCreateCheckoutSession,
  handleGetCheckoutStatus,
  handleBachsWebhook,
  isPublicHttpUrl,
  formatMinorToDecimal,
  amountsMatch
} from '../api/_lib/bachsServer.ts';

const TEST_SECRET = 'whsec_test_secret_12345';
const STORE_PATH = path.join(process.cwd(), '.data', 'bachs-store.json');

function signV2(rawBody: string, secret: string, timestampSec?: number): string {
  const ts = timestampSec ?? Math.floor(Date.now() / 1000);
  const signedPayload = `${ts}.${rawBody}`;
  const sig = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  return `t=${ts},v1=${sig}`;
}

function resetLocalStore() {
  if (fs.existsSync(STORE_PATH)) {
    fs.unlinkSync(STORE_PATH);
  }
}

test('formatMinorToDecimal and amountsMatch handle exact decimal strings', () => {
  assert.equal(formatMinorToDecimal(105000), '1050.00');
  assert.equal(formatMinorToDecimal(500), '5.00');
  assert.equal(amountsMatch('1050.00', '1050.0'), true);
  assert.equal(amountsMatch('1050.00', '1049.99'), false);
});

test('isPublicHttpUrl rejects localhost/private URLs and accepts public HTTPS', () => {
  assert.equal(isPublicHttpUrl('http://localhost:3000'), false);
  assert.equal(isPublicHttpUrl('http://127.0.0.1:3000'), false);
  assert.equal(isPublicHttpUrl('http://192.168.1.10'), false);
  assert.equal(isPublicHttpUrl('https://refeir.africa'), true);
});

test('handleCreateCheckoutSession returns 503 when BACHS_API_KEY is missing', async () => {
  const res = await handleCreateCheckoutSession(
    { projectId: 'proj-1', amountMinor: 10000, currency: 'USD' },
    { BACHS_API_KEY: '' }
  );
  assert.equal(res.status, 503);
  assert.equal(res.body.error, 'BACHS_NOT_CONFIGURED');
});

test('handleBachsWebhook rejects invalid signature with 400 and leaves order untouched', async () => {
  resetLocalStore();
  const payload = JSON.stringify({
    id: 'evt_bad_sig',
    type: 'checkout.completed',
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
    data: { checkout_id: 'chk_123' }
  });

  const res = await handleBachsWebhook(
    payload,
    { 'x-bachs-signature-v2': 't=1700000000,v1=deadbeef' },
    { BACHS_API_KEY: 'sk_sandbox_dummy', BACHS_WEBHOOK_SECRET: TEST_SECRET }
  );

  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'INVALID_SIGNATURE');
});

test('handleBachsWebhook handles unsuccessful checkout, deduplicates events, and protects PAID state from late failure', async () => {
  resetLocalStore();
  const dir = path.dirname(STORE_PATH);
  fs.mkdirSync(dir, { recursive: true });
  const now = new Date().toISOString();
  fs.writeFileSync(
    STORE_PATH,
    JSON.stringify({
      orders: {
        chk_fail_1: {
          id: 'ord_1',
          project_id: 'proj_fail',
          checkout_id: 'chk_fail_1',
          reference: 'RF_proj_fail_1',
          expected_amount: '100.00',
          currency: 'USD',
          status: 'PENDING',
          idempotency_key: 'idem_1',
          created_at: now,
          updated_at: now
        },
        chk_paid_1: {
          id: 'ord_2',
          project_id: 'proj_paid',
          checkout_id: 'chk_paid_1',
          reference: 'RF_proj_paid_1',
          expected_amount: '250.00',
          currency: 'USD',
          status: 'PAID',
          idempotency_key: 'idem_2',
          paid_at: now,
          created_at: now,
          updated_at: now
        }
      },
      events: {}
    })
  );

  // 1. collection.failed marks PENDING order as FAILED
  const failBody = JSON.stringify({
    id: 'evt_fail_1',
    type: 'collection.failed',
    created_at: now,
    organization_id: 'org_1',
    data: { checkout_id: 'chk_fail_1' }
  });
  const failRes = await handleBachsWebhook(
    failBody,
    { 'x-bachs-signature-v2': signV2(failBody, TEST_SECRET) },
    { BACHS_API_KEY: 'sk_sandbox_dummy', BACHS_WEBHOOK_SECRET: TEST_SECRET }
  );
  assert.equal(failRes.status, 200);
  assert.equal(failRes.body.status, 'FAILED');

  const statusAfterFail = await handleGetCheckoutStatus({ checkout_id: 'chk_fail_1' });
  assert.equal(statusAfterFail.status, 200);
  assert.equal(statusAfterFail.body.status, 'FAILED');

  // 2. Duplicate delivery returns 200 duplicate: true
  const dupRes = await handleBachsWebhook(
    failBody,
    { 'x-bachs-signature-v2': signV2(failBody, TEST_SECRET) },
    { BACHS_API_KEY: 'sk_sandbox_dummy', BACHS_WEBHOOK_SECRET: TEST_SECRET }
  );
  assert.equal(dupRes.status, 200);
  assert.equal(dupRes.body.duplicate, true);

  // 3. Out-of-order collection.failed cannot overwrite an already PAID order
  const lateFailBody = JSON.stringify({
    id: 'evt_late_fail',
    type: 'collection.failed',
    created_at: now,
    organization_id: 'org_1',
    data: { checkout_id: 'chk_paid_1' }
  });
  const lateRes = await handleBachsWebhook(
    lateFailBody,
    { 'x-bachs-signature-v2': signV2(lateFailBody, TEST_SECRET) },
    { BACHS_API_KEY: 'sk_sandbox_dummy', BACHS_WEBHOOK_SECRET: TEST_SECRET }
  );
  assert.equal(lateRes.status, 200);

  const paidStatus = await handleGetCheckoutStatus({ checkout_id: 'chk_paid_1' });
  assert.equal(paidStatus.body.status, 'PAID');

  resetLocalStore();
});

import {
  handleCreateConnectedAccount,
  handleGetConnectedAccount,
  handleCreateSellerPayout
} from '../api/_lib/bachsServer.ts';

test('destination charge checkout sends transfer_data.destination and server-computed platform_fee as decimal strings', async () => {
  resetLocalStore();
  let capturedUrl = '';
  let capturedHeaders: Record<string, string> = {};
  let capturedBody: Record<string, unknown> = {};

  const mockFetch = (async (url: string | URL | Request, init?: RequestInit) => {
    capturedUrl = String(url);
    capturedHeaders = (init?.headers || {}) as Record<string, string>;
    capturedBody = init?.body ? JSON.parse(String(init.body)) : {};

    if (capturedUrl.endsWith('/v1/accounts')) {
      return new Response(
        JSON.stringify({
          id: 'acct_seller_123',
          capabilities: { transfers: { status: 'restricted' }, payouts: { status: 'restricted' } },
          requirements: { currently_due: ['payout_destination'] }
        }),
        { status: 201 }
      );
    }

    if (capturedUrl.endsWith('/v1/checkout-sessions')) {
      return new Response(
        JSON.stringify({
          checkout_id: 'chk_dest_1',
          checkout_url: 'https://checkout.bachs.io/c/dest1',
          reference: 'RF_proj_dest_1'
        }),
        { status: 201 }
      );
    }

    return new Response('{}', { status: 404 });
  }) as typeof fetch;

  const env = { BACHS_API_KEY: 'sk_sandbox_test', BACHS_WEBHOOK_SECRET: TEST_SECRET, fetchImpl: mockFetch };

  const acctRes = await handleCreateConnectedAccount(
    { userId: 'talent-1', contactEmail: 'ada@example.com', country: 'NG' },
    env
  );
  assert.equal(acctRes.status, 201);

  const checkoutRes = await handleCreateCheckoutSession(
    { projectId: 'proj_dest', sellerUserId: 'talent-1', amountMinor: 100000, currency: 'NGN' },
    env
  );
  assert.equal(checkoutRes.status, 201);
  assert.equal(capturedUrl, 'https://sandbox-api.bachs.io/v1/checkout-sessions');
  assert.equal(capturedHeaders['X-Account-Id'], undefined);
  assert.deepEqual(capturedBody.transfer_data, { destination: 'acct_seller_123' });
  assert.equal(capturedBody.platform_fee, '100.00');
  assert.equal((capturedBody.pricing as Record<string, unknown>).amount, '1000.00');

  resetLocalStore();
});

test('Connect webhooks update onboarding/capabilities, record transfer.created, and gate/reconcile payouts', async () => {
  resetLocalStore();
  let payoutPostCount = 0;

  const mockFetch = (async (url: string | URL | Request, init?: RequestInit) => {
    const u = String(url);
    if (u.endsWith('/v1/accounts')) {
      return new Response(
        JSON.stringify({
          id: 'acct_seller_456',
          capabilities: { transfers: { status: 'restricted' }, payouts: { status: 'restricted' } },
          requirements: { currently_due: ['persons.representative'] }
        }),
        { status: 201 }
      );
    }
    if (u.endsWith('/v1/payouts/destinations/pd_unusable')) {
      return new Response(JSON.stringify({ id: 'pd_unusable', is_usable: false, status: 'pending_review' }), {
        status: 200
      });
    }
    if (u.endsWith('/v1/payouts/destinations/pd_usable')) {
      return new Response(JSON.stringify({ id: 'pd_usable', is_usable: true, status: 'approved', currency: 'NGN' }), {
        status: 200
      });
    }
    if (u.endsWith('/v1/payouts') && init?.method === 'POST') {
      payoutPostCount += 1;
      // Simulate 502 uncertain write on first attempt
      return new Response(JSON.stringify({ detail: 'Upstream timeout' }), { status: 502 });
    }
    if (u.includes('/v1/payouts?reference=')) {
      return new Response(
        JSON.stringify({
          items: [{ id: 'pay_reconciled_1', reference: 'PO_RECON_1', status: 'pending', fee: '50.00' }]
        }),
        { status: 200 }
      );
    }
    return new Response('{}', { status: 404 });
  }) as typeof fetch;

  const env = { BACHS_API_KEY: 'sk_sandbox_test', BACHS_WEBHOOK_SECRET: TEST_SECRET, fetchImpl: mockFetch };

  await handleCreateConnectedAccount({ userId: 'talent-2', contactEmail: 'ada2@example.com', country: 'NG' }, env);

  // 1. Blocked payout while payouts capability is restricted
  const blockedCapRes = await handleCreateSellerPayout(
    { userId: 'talent-2', accountId: 'acct_seller_456', destinationId: 'pd_usable', amountMinor: 50000, currency: 'NGN' },
    env
  );
  assert.equal(blockedCapRes.status, 409);
  assert.equal(blockedCapRes.body.error, 'PAYOUTS_CAPABILITY_RESTRICTED');

  // 2. Activate payouts capability via capability.updated webhook
  const capBody = JSON.stringify({
    id: 'evt_cap_1',
    type: 'capability.updated',
    created_at: new Date().toISOString(),
    organization_id: 'acct_seller_456',
    account: 'acct_seller_456',
    data: { account: 'acct_seller_456', capability: 'payouts', status: 'active', requested: true }
  });
  const capRes = await handleBachsWebhook(capBody, { 'x-bachs-signature-v2': signV2(capBody, TEST_SECRET) }, env);
  assert.equal(capRes.status, 200);

  // 3. Record transfer.created settlement
  const trBody = JSON.stringify({
    id: 'evt_tr_1',
    type: 'transfer.created',
    created_at: new Date().toISOString(),
    organization_id: 'acct_seller_456',
    account: 'acct_seller_456',
    data: {
      transfer_id: 'tr_123',
      destination: 'acct_seller_456',
      amount: '900.00',
      currency: 'NGN',
      source_charge_id: 'ch_123'
    }
  });
  const trRes = await handleBachsWebhook(trBody, { 'x-bachs-signature-v2': signV2(trBody, TEST_SECRET) }, env);
  assert.equal(trRes.status, 200);

  const acctState = await handleGetConnectedAccount({ user_id: 'talent-2' }, env);
  assert.equal((acctState.body.transfers as Array<Record<string, unknown>>).length, 1);

  // 4. Blocked payout when destination is_usable is false
  const blockedDestRes = await handleCreateSellerPayout(
    { userId: 'talent-2', accountId: 'acct_seller_456', destinationId: 'pd_unusable', amountMinor: 50000, currency: 'NGN' },
    env
  );
  assert.equal(blockedDestRes.status, 409);
  assert.equal(blockedDestRes.body.error, 'DESTINATION_NOT_USABLE');

  // 5. Uncertain 502 write on POST /v1/payouts reconciles via GET /v1/payouts?reference=...
  const reconRes = await handleCreateSellerPayout(
    {
      userId: 'talent-2',
      accountId: 'acct_seller_456',
      destinationId: 'pd_usable',
      amountMinor: 50000,
      currency: 'NGN',
      reference: 'PO_RECON_1'
    },
    env
  );
  assert.equal(reconRes.status, 200);
  assert.equal(reconRes.body.reconciled, true);
  assert.equal(payoutPostCount, 1);

  // 6. payout.paid marks completed, and late payout.failed does not overwrite completed
  const paidBody = JSON.stringify({
    id: 'evt_po_paid',
    type: 'payout.paid',
    created_at: new Date().toISOString(),
    organization_id: 'acct_seller_456',
    data: { withdrawal_id: 'pay_reconciled_1', reference: 'PO_RECON_1', status: 'completed', session_id: 'nip_1' }
  });
  await handleBachsWebhook(paidBody, { 'x-bachs-signature-v2': signV2(paidBody, TEST_SECRET) }, env);

  const lateFailBody = JSON.stringify({
    id: 'evt_po_late_fail',
    type: 'payout.failed',
    created_at: new Date().toISOString(),
    organization_id: 'acct_seller_456',
    data: { withdrawal_id: 'pay_reconciled_1', reference: 'PO_RECON_1', status: 'failed' }
  });
  await handleBachsWebhook(lateFailBody, { 'x-bachs-signature-v2': signV2(lateFailBody, TEST_SECRET) }, env);

  const finalAcct = await handleGetConnectedAccount({ user_id: 'talent-2' }, env);
  const payouts = finalAcct.body.payouts as Array<Record<string, unknown>>;
  assert.equal(payouts[0].status, 'completed');

  resetLocalStore();
});

