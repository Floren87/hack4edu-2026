import { createClient, type Client } from '@libsql/client';
export async function openDatabase(url: string, authToken?: string): Promise<Client> {
  const db = createClient({ url, authToken });
  await db.batch([
    `CREATE TABLE IF NOT EXISTS accounts (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES accounts(id), profile TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS students_owner ON students(owner_id)`,
    // csrf_token is retained empty for compatibility with databases created by v1.
    `CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES accounts(id), csrf_token TEXT NOT NULL, mode TEXT NOT NULL CHECK(mode IN ('professional','child')), student_id TEXT, expires_at INTEGER NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at)`,
  ], 'write');
  return db;
}

