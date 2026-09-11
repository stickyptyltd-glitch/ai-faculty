-- Phase 1: individual accounts (magic-link auth).
-- Progress/curriculum data is unaffected — it stays entirely in the browser's localStorage
-- (see app/js/store.js). This schema only holds identity + session state.

CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS magic_links (
  token_hash  TEXT PRIMARY KEY,   -- sha256 of the raw token; raw token never stored
  email       TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  expires_at  TEXT NOT NULL,      -- 15 minutes from creation
  used_at     TEXT                -- set once consumed; a used or expired link is rejected
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash  TEXT PRIMARY KEY,   -- sha256 of the session cookie value
  user_id     TEXT NOT NULL REFERENCES users(id),
  created_at  TEXT NOT NULL,
  expires_at  TEXT NOT NULL       -- 30 days from creation
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
