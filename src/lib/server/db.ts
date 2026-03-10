import Database from 'better-sqlite3';
import { resolve } from 'path';

const dbPath = resolve('data', 'guestbook.db');

// Ensure data directory exists
import { mkdirSync } from 'fs';
mkdirSync(resolve('data'), { recursive: true });

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
	CREATE TABLE IF NOT EXISTS guestbook (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		message TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	)
`);

export default db;
