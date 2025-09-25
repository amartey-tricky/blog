import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const blogPost = pgTable("blog_post", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  content: text("content").notNull(),
  statusId: integer("status_id")
    .notNull()
    .references(() => blogStatus.id),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const blogStatus = pgTable("blog_status", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
})

export const images = pgTable("images", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }),
  url: text("url"),
  key: text("key"),
  size: integer("size"),
  type: varchar("type", { length: 100 }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})
