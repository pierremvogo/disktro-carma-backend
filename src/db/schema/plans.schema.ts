import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  decimal,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const plans = mysqlTable("plans", {
  id: varchar("id", { length: 32 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),

  name: varchar("name", { length: 100 }).notNull(),

  description: text("description"),

  price: decimal("price", { precision: 10, scale: 2 }).notNull(),

  currency: varchar("currency", { length: 10 }).notNull().default("EUR"),

  billingCycle: varchar("billing_cycle", { length: 20 })
    .notNull()
    .default("monthly"),

  active: boolean("active").notNull().default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(schema.subscriptions),
}));
