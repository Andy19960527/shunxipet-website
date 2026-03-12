import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
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
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// TypeScript types
export type Company = typeof company.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
