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
--> statement-breakpoint
ALTER TABLE payments ADD COLUMN mp_preference_id TEXT;
--> statement-breakpoint
ALTER TABLE payments ADD COLUMN mp_init_point TEXT;
--> statement-breakpoint
ALTER TABLE payments ADD COLUMN mp_payment_id TEXT;
--> statement-breakpoint
ALTER TABLE payments ADD COLUMN payment_provider TEXT;
