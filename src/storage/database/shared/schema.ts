import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 分类表
export const categories = pgTable("categories", {
	id: serial().notNull().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	description: text("description"),
	image: varchar("image", { length: 500 }),
	sort_order: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 公司信息表
export const company = pgTable("company", {
	id: serial().notNull().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	slogan: varchar("slogan", { length: 500 }).notNull(),
	description: text("description").notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	whatsapp: varchar("whatsapp", { length: 50 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 产品表
export const products = pgTable("products", {
	id: serial().notNull().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description").notNull(),
	image: varchar("image", { length: 500 }).notNull(),
	price: varchar("price", { length: 50 }).notNull(),
	category_id: integer("category_id").references(() => categories.id),
	sort_order: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// TypeScript types
export type Category = typeof categories.$inferSelect;
export type Company = typeof company.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
