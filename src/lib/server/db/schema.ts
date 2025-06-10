import { integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const session = pgTable('session', {
	id: text().primaryKey(),
	userName: text().notNull(),
	expiresAt: timestamp().notNull()
});

export const purchase = pgTable('purchase', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp(),
	amount: numeric({ precision: 12, scale: 2 }).notNull(),
	name: text().notNull()
});
