CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL, expires_at INTEGER NOT NULL DEFAULT 0);
--> statement-breakpoint
CREATE TABLE sessions (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE payments (ref TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), status TEXT NOT NULL DEFAULT 'pending', created_at INTEGER NOT NULL, submitted_at INTEGER, approved_at INTEGER, bank_reference TEXT UNIQUE, approval_id TEXT, approved_by TEXT REFERENCES users(id), payer_note TEXT, mp_preference_id TEXT, mp_init_point TEXT, mp_payment_id TEXT, payment_provider TEXT);
--> statement-breakpoint
CREATE UNIQUE INDEX one_open_payment ON payments(user_id) WHERE status IN ('pending','submitted');
--> statement-breakpoint
CREATE TABLE rate_limits (bucket TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  year INTEGER,
  author TEXT,
  author_name TEXT,
  description TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  sources TEXT NOT NULL DEFAULT '[]',
  article TEXT,
  media_url TEXT,
  media_kind TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  reviewed_at INTEGER,
  reviewer_id TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (preapproval_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', amount REAL, init_point TEXT, granted_quantity INTEGER NOT NULL DEFAULT 0, next_payment_date TEXT, created_at INTEGER NOT NULL, updated_at INTEGER);
CREATE INDEX IF NOT EXISTS subscriptions_user ON subscriptions(user_id);
