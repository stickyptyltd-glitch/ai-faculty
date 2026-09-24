-- Catch-up (remote-only gap): 0006/0007 never landed on the remote D1 because the
-- migration bookkeeping was out of sync (only 0001-0002 recorded, 0003+ objects already
-- present from an earlier partial state). This re-applies exactly the DDL from
-- 0006_faculty_control_plane.sql + 0007_faculty_reviews.sql as idempotent CREATE IF NOT
-- EXISTS, then d1_migrations is backfilled to the expected end state. Nothing here is new:
-- it must stay an exact mirror of those two files.

CREATE TABLE IF NOT EXISTS faculty_calls (
  id               TEXT PRIMARY KEY,
  kind             TEXT NOT NULL,        -- 'checkpoint-strict' | 'challenge-strict' | ...
  user_id          TEXT NOT NULL,
  cp_id            TEXT,                 -- the assessment id when it is a checkpoint
  rubric_dims      TEXT NOT NULL,        -- JSON array of mastery/competency dimension names
  submission_json  TEXT NOT NULL,        -- JSON snapshot of the learner's submitted fields
  policy_id        TEXT NOT NULL,        -- which institutional policy was applied
  adapter          TEXT NOT NULL,        -- 'dry-run' | 'openai-compatible'
  model            TEXT,                 -- model/version when a model scored it (else NULL)
  bands_json       TEXT NOT NULL,        -- JSON object { dimension: band }
  verdict          TEXT NOT NULL,        -- 'ready' | 'revise' | 'more'
  confidence       TEXT NOT NULL,        -- 'high' | 'low'
  degraded         INTEGER NOT NULL DEFAULT 0, -- 1 = a model call was intended but fell back to dry-run
  status           TEXT NOT NULL,        -- 'ok' (reserved: 'error', 'retracted')
  latency_ms       INTEGER,
  created_at       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_faculty_calls_user ON faculty_calls(user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_calls_created ON faculty_calls(created_at);
CREATE INDEX IF NOT EXISTS idx_faculty_calls_adapter ON faculty_calls(adapter);

CREATE TABLE IF NOT EXISTS faculty_reviews (
  id                TEXT PRIMARY KEY,
  call_id           TEXT NOT NULL UNIQUE,   -- originating faculty_calls row being reviewed
  reviewer_user_id  TEXT NOT NULL,          -- the reviewer / authorised Faculty holder
  decision          TEXT NOT NULL,          -- 'uphold' | 'override' | 'dismiss'
  note              TEXT,                   -- the reasoned review — visible to the learner
  created_at        TEXT NOT NULL,
  FOREIGN KEY (call_id) REFERENCES faculty_calls(id)
);
CREATE INDEX IF NOT EXISTS idx_faculty_reviews_reviewer ON faculty_reviews(reviewer_user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_reviews_created ON faculty_reviews(created_at);