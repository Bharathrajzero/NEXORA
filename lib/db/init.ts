import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL || "file:nexora.db"
});

async function initDb() {
  console.log("Initializing database...");

  try {
    // Create users table
    await client.execute(`
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

    // Create workspaces table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    // Create items table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        metadata TEXT,
        tags TEXT DEFAULT '[]',
        favorite INTEGER NOT NULL DEFAULT 0,
        encrypted INTEGER NOT NULL DEFAULT 0,
        owner_id TEXT NOT NULL,
        workspace_id TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL
      )
    `);

    // Create indexes
    await client.execute(`CREATE INDEX IF NOT EXISTS items_owner_type_idx ON items(owner_id, type)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS items_tags_idx ON items(tags)`);

    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

initDb();
