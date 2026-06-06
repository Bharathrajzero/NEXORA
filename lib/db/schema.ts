import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash"),
  displayName: text("display_name"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date())
});

export const workspaces = sqliteTable("workspaces", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date())
});

export const memberships = sqliteTable("memberships", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  role: text("role", { enum: ["OWNER", "ADMIN", "EDITOR", "VIEWER"] }).notNull().default("VIEWER"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" })
}, (table) => ({
  userWorkspaceIdx: index("memberships_user_workspace_idx").on(table.userId, table.workspaceId)
}));

export const items = sqliteTable("items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text("type", { enum: ["CLIP", "FILE", "NOTE", "BOOKMARK", "PROMPT"] }).notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  metadata: text("metadata", { mode: "json" }),
  tags: text("tags", { mode: "json" }).$type<string[]>().default(sql`'[]'`),
  favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
  encrypted: integer("encrypted", { mode: "boolean" }).notNull().default(false),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id").references(() => workspaces.id, { onDelete: "set null" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date())
}, (table) => ({
  ownerTypeIdx: index("items_owner_type_idx").on(table.ownerId, table.type),
  tagsIdx: index("items_tags_idx").on(table.tags)
}));

export const devices = sqliteTable("devices", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  trusted: integer("trusted", { mode: "boolean" }).notNull().default(true),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
});

export const shareLinks = sqliteTable("share_links", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  tokenHash: text("token_hash").notNull().unique(),
  passwordHash: text("password_hash"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  oneTime: integer("one_time", { mode: "boolean" }).notNull().default(false),
  viewedAt: integer("viewed_at", { mode: "timestamp" }),
  itemId: text("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date())
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  action: text("action").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date())
});

export const qrSessions = sqliteTable("qr_sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionCode: text("session_code").notNull().unique(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["PENDING", "SCANNED", "CONFIRMED", "EXPIRED"] }).notNull().default("PENDING"),
  deviceName: text("device_name"),
  devicePlatform: text("device_platform"),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date())
});
