-- Phase 1.5: founder admin panel foundation.
-- Adds a role flag (single founder today; extensible if more admins are added later) and the
-- first server-side record of learning activity. Progress/curriculum state itself still lives
-- in the browser's localStorage (see app/js/store.js) — these tables are an additive,
-- best-effort telemetry/audit path fed by the client on top of that, not a replacement for it.

ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'learner';
-- After this migration runs, set the founder's own row by hand, e.g.:
--   UPDATE users SET role = 'founder' WHERE email = '<founder email>';

CREATE TABLE IF NOT EXISTS submissions (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  kind          TEXT NOT NULL,       -- 'challenge' | 'checkpoint'
  pathway_id    TEXT,
  cap_id        TEXT NOT NULL,
  challenge_id  TEXT,
  checkpoint_id TEXT,
  band          TEXT NOT NULL,       -- 'Not yet' | 'Developing' | 'Meets' | 'Exceeds'
  confidence    TEXT,
  fields_json   TEXT NOT NULL,       -- learner's raw answer text, verbatim
  started_at    TEXT,                -- client-stamped when the view was entered; may be null
  completed_at  TEXT NOT NULL,
  duration_ms   INTEGER
);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_cap ON submissions(cap_id);
CREATE INDEX IF NOT EXISTS idx_submissions_completed ON submissions(completed_at);

CREATE TABLE IF NOT EXISTS activity_log (
  id       TEXT PRIMARY KEY,
  user_id  TEXT NOT NULL REFERENCES users(id),
  ts       TEXT NOT NULL,
  kind     TEXT NOT NULL,            -- mirrors STORE.log kinds: lesson-done, diagnostic, pathway, project, skip, challenge-evidence, checkpoint-evidence
  detail   TEXT
);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_ts ON activity_log(ts);
