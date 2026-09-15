-- Phase C (founder admin panel plan, /home/dayle/.claude/plans/humble-purring-hopper.md):
-- a small persistent feedback channel. Any signed-in learner can leave free-text feedback with
-- an optional 1-5 rating from wherever they are in the app; the founder reads it newest-first
-- in the admin panel. See docs/continuity-log.md v0.25 for the phases this follows on from.

CREATE TABLE IF NOT EXISTS feedback (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id),
  text         TEXT NOT NULL,
  page_context TEXT,                -- the #/... hash the learner was on, best-effort
  rating       INTEGER,             -- optional 1-5, NULL if not given
  created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
