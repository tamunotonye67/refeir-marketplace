-- ============================================================
-- Refeir Pioneers — Application Schema
-- Migration: 20260826000001_pioneer_applications.sql
-- ============================================================

DO $`$ BEGIN
  CREATE TYPE pioneer_status AS ENUM ('PENDING','REVIEWING','ACCEPTED','WAITLISTED','REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $`$;

DO $`$ BEGIN
  CREATE TYPE pioneer_division AS ENUM ('TECH_PRODUCT','CREATIVE','GROWTH','BUSINESS','COMMUNITY','RESEARCH_TESTING');
EXCEPTION WHEN duplicate_object THEN NULL;
END $`$;

CREATE TABLE IF NOT EXISTS pioneer_applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL DEFAULT '',
  full_name          TEXT NOT NULL,
  email              TEXT NOT NULL,
  whatsapp_number    TEXT NOT NULL,
  country            TEXT NOT NULL,
  city               TEXT,
  roles              TEXT[] NOT NULL DEFAULT '{}',
  skills             TEXT,
  portfolio_url      TEXT,
  primary_division   pioneer_division,
  contribution       TEXT,
  availability       TEXT,
  motivation         TEXT,
  learning_goals     TEXT,
  discovery_source   TEXT,
  referred_by        TEXT,
  status             pioneer_status NOT NULL DEFAULT 'PENDING',
  is_founding_100    BOOLEAN NOT NULL DEFAULT FALSE,
  pioneer_id         TEXT UNIQUE,
  internal_notes     TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE pioneer_applications ENABLE ROW LEVEL SECURITY;
