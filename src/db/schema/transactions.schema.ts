import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  timestamp,
  decimal,
} from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";

import * as schema from "./index";

export const transactions = mysqlTable("transactions", {
  id: varchar("id", { length: 21 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),

  userId: varchar("user_id", { length: 21 })
    .notNull()
    .references(() => schema.users.id),

  subscriptionId: varchar("subscription_id", { length: 21 }).references(
    () => schema.subscriptions.id
  ),

  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),

  status: varchar("status", { length: 20 }).notNull().default("pending"), // ex: pending, succeeded, failed

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// relations pour transaction → user / subscription
export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(schema.users, {
    fields: [transactions.userId],
    references: [schema.users.id],
  }),
  subscription: one(schema.subscriptions, {
    fields: [transactions.subscriptionId],
    references: [schema.subscriptions.id],
  }),
}));
