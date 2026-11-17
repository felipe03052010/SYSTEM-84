CREATE TABLE IF NOT EXISTS subscriptions (
  preapproval_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  amount REAL,
  init_point TEXT,
  granted_quantity INTEGER NOT NULL DEFAULT 0,
  next_payment_date TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS subscriptions_user ON subscriptions(user_id);
