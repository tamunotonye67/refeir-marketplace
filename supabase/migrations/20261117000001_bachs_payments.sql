-- ==============================================================================
-- BACHS PAYMENT GATEWAY TABLES (ORDERS & WEBHOOK DEDUPLICATION)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.bachs_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  checkout_id TEXT UNIQUE NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  expected_amount TEXT NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING | PAID | FAILED | EXPIRED
  idempotency_key TEXT NOT NULL,
  payment_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bachs_orders_project_id ON public.bachs_orders (project_id);

CREATE TABLE IF NOT EXISTS public.bachs_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  checkout_id TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bachs_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bachs_webhook_events ENABLE ROW LEVEL SECURITY;
