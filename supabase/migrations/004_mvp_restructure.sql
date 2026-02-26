-- MVP Restructure: Add 'ppf' reading type, deprecate unused tables
-- Safe migration: no destructive changes, rollback-friendly

-- Add 'ppf' to readings type check constraint
ALTER TABLE readings DROP CONSTRAINT IF EXISTS readings_type_check;
ALTER TABLE readings ADD CONSTRAINT readings_type_check
  CHECK (type IN ('basic', 'detailed', 'compatibility', 'ppf'));

-- DEPRECATED: destiny_cards table (kept for rollback safety)
COMMENT ON TABLE destiny_cards IS 'DEPRECATED — MVP removed card features. Do not use in new code.';

-- DEPRECATED: subscriptions table (kept for rollback safety)
COMMENT ON TABLE subscriptions IS 'DEPRECATED — MVP uses pay-per-view only. Do not use in new code.';
