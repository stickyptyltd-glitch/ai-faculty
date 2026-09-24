-- Phase 3: Institutional AI Control Plane (docs/01-architecture.md §3).
-- Audit/lineage for every faculty interaction: who asked, with which model/version (or the
-- deterministic dry-run heuristic), under which policy, and what it concluded. Append-only —
-- assessments are never rewritten, matching the evidence standards (docs/08 §7). The submission
-- snapshot is the learner's own work, in the restricted zone (docs/01 §4).

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