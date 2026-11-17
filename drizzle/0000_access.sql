CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL, expires_at INTEGER NOT NULL DEFAULT 0);
--> statement-breakpoint
CREATE TABLE sessions (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE payments (ref TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), status TEXT NOT NULL DEFAULT 'pending', created_at INTEGER NOT NULL, submitted_at INTEGER, approved_at INTEGER, bank_reference TEXT UNIQUE, approval_id TEXT, approved_by TEXT REFERENCES users(id), payer_note TEXT);
--> statement-breakpoint
CREATE UNIQUE INDEX one_open_payment ON payments(user_id) WHERE status IN ('pending','submitted');
--> statement-breakpoint
CREATE TABLE rate_limits (bucket TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires_at INTEGER NOT NULL);
