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
