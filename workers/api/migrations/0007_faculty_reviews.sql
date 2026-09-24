-- Phase 4: learner-faculty (mentor / reviewer) scoped roles — ARP resolution.
-- docs/08-assessment-model.md §5.5: unresolved or high-stakes assessments escalate to a specialist
-- or authorised Faculty holder. faculty_reviews is where that resolution is recorded, determinative,
-- audited, and traceable back to the originating Control-Plane call (faculty_calls). A review is
-- single-decision per call: a later review overrides an earlier one, and the audit table keeps the
-- full chain. Roles come from the existing users.role column ('learner' | 'reviewer' | 'founder').

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