import type { Database as BunDatabase, SQLQueryBindings } from 'bun:sqlite';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'app.db');

let _db: BunDatabase | null = null;

export function getDb(): BunDatabase {
  if (!_db) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Database } = require('bun:sqlite') as typeof import('bun:sqlite');
    _db = new Database(DB_PATH, { create: true });
    _db.run('PRAGMA journal_mode = WAL;');
    _db.run('PRAGMA foreign_keys = ON;');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: BunDatabase) {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content_json TEXT NOT NULL,
      is_public INTEGER NOT NULL DEFAULT 0,
      public_slug TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES user(id)
    )
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)`);
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_notes_public_slug ON notes(public_slug)`,
  );
  db.run(`CREATE INDEX IF NOT EXISTS idx_notes_is_public ON notes(is_public)`);
}

export function query<T>(sql: string, params?: SQLQueryBindings[]): T[] {
  const db = getDb();
  const stmt = db.query<T, SQLQueryBindings[]>(sql);
  return params ? stmt.all(...params) : stmt.all();
}

export function get<T>(
  sql: string,
  params?: SQLQueryBindings[],
): T | undefined {
  const db = getDb();
  const stmt = db.query<T, SQLQueryBindings[]>(sql);
  return (params ? stmt.get(...params) : stmt.get()) ?? undefined;
}

export function run(sql: string, params?: SQLQueryBindings[]): void {
  const db = getDb();
  const stmt = db.query(sql);
  params ? stmt.run(...params) : stmt.run();
}
