import { db } from "./index";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("Running migrations...");
  
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      display_name TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS memberships (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL DEFAULT 'VIEWER',
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE
    )
  `);

  await db.run(sql`CREATE INDEX IF NOT EXISTS memberships_user_workspace_idx ON memberships(user_id, workspace_id)`);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      metadata TEXT,
      tags TEXT DEFAULT '[]',
      favorite INTEGER NOT NULL DEFAULT 0,
      encrypted INTEGER NOT NULL DEFAULT 0,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_id TEXT REFERENCES workspaces(id) ON DELETE SET NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  await db.run(sql`CREATE INDEX IF NOT EXISTS items_owner_type_idx ON items(owner_id, type)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS items_tags_idx ON items(tags)`);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      platform TEXT NOT NULL,
      trusted INTEGER NOT NULL DEFAULT 1,
      last_seen_at INTEGER NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS share_links (
      id TEXT PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      expires_at INTEGER,
      one_time INTEGER NOT NULL DEFAULT 0,
      viewed_at INTEGER,
      item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS qr_sessions (
      id TEXT PRIMARY KEY,
      session_code TEXT NOT NULL UNIQUE,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'PENDING',
      device_name TEXT,
      device_platform TEXT,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  console.log("✓ Migration complete");
}

migrate().catch(console.error);
