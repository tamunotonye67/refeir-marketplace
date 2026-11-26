-- ==============================================================================
-- BACHS CONNECT MARKETPLACE TABLES (ACCOUNTS, TRANSFERS, PAYOUTS)
-- ==============================================================================

ALTER TABLE public.bachs_orders
  ADD COLUMN IF NOT EXISTS seller_account_id TEXT,
  ADD COLUMN IF NOT EXISTS platform_fee TEXT,
  ADD COLUMN IF NOT EXISTS transfer_id TEXT;

CREATE TABLE IF NOT EXISTS public.bachs_connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  account_id TEXT UNIQUE NOT NULL,
  contact_email TEXT NOT NULL,
  display_name TEXT,
  country TEXT NOT NULL DEFAULT 'NG',
  entity_type TEXT NOT NULL DEFAULT 'individual',
  transfers_status TEXT NOT NULL DEFAULT 'restricted', -- restricted | active
  payouts_status TEXT NOT NULL DEFAULT 'restricted',   -- restricted | active
  international_payouts BOOLEAN NOT NULL DEFAULT FALSE,
  requirements_due JSONB NOT NULL DEFAULT '[]'::jsonb,
  liveness_owed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bachs_connected_accounts_account_id
  ON public.bachs_connected_accounts (account_id);

CREATE TABLE IF NOT EXISTS public.bachs_transfers (
  transfer_id TEXT PRIMARY KEY,
  checkout_id TEXT,
  account_id TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency TEXT NOT NULL,
  source_charge_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bachs_transfers_account_id
  ON public.bachs_transfers (account_id);

CREATE TABLE IF NOT EXISTS public.bachs_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id TEXT UNIQUE,
  user_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency TEXT NOT NULL,
  fee TEXT,
  total_debited TEXT,
  reference TEXT UNIQUE NOT NULL,
  idempotency_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | processing | completed | failed | uncertain
  failure_reason TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bachs_payouts_account_id
  ON public.bachs_payouts (account_id);

ALTER TABLE public.bachs_connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bachs_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bachs_payouts ENABLE ROW LEVEL SECURITY;
