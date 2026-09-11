-- Support the "DELETE ... WHERE expires_at < ?" sweep in handleRequestLink without a full
-- table scan as these tables grow.
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
