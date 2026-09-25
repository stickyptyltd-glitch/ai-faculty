CREATE TABLE IF NOT EXISTS founder_passwords (
  user_id     TEXT PRIMARY KEY,
  salt        TEXT NOT NULL,
  hash        TEXT NOT NULL,
  iterations  INTEGER NOT NULL,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS password_failures (
  user_id      TEXT PRIMARY KEY,
  fails        INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT,
  updated_at   TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
