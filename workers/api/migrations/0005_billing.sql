-- Phase 1.6: monetization foundation.
-- Adds a plan to users (free | pro | founding) and a payments ledger table that records every
-- Stripe event we act on. The ledger is append-only and feeds the founder revenue view; nothing
-- here touches assessment/curriculum data (payment must never buy a grade).
--
-- Plans applied via migration bullet (0003) pattern: the founder sets their own row by hand, e.g.
--   UPDATE users SET plan='pro', plan_status='active' WHERE email='<founder email>';

ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
ALTER TABLE users ADD COLUMN plan_status TEXT NOT NULL DEFAULT 'none';
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;

CREATE TABLE IF NOT EXISTS payments (
  id               TEXT PRIMARY KEY,
  user_id          TEXT,                 -- set once we can resolve the payer (may be null briefly)
  stripe_event_id  TEXT UNIQUE NOT NULL, -- dedupe: replaying a webhook must not double-count
  event_type       TEXT NOT NULL,        -- 'checkout' | 'subscription' | 'invoice'
  plan             TEXT NOT NULL,        -- the plan bought/renewed
  amount_cents     INTEGER NOT NULL,
  currency         TEXT NOT NULL,
  status           TEXT NOT NULL,        -- 'succeeded' | 'pending' | 'refunded'
  created_at       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);