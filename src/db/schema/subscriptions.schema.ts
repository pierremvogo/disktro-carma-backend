import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  uniqueIndex,
  decimal,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    userId: varchar("user_id", { length: 21 })
      .notNull()
      .references(() => schema.users.id),

    planId: varchar("plan_id", { length: 21 })
      .notNull()
      .references(() => schema.plans.id),

    status: varchar("status", { length: 20 }).notNull().default("active"), // ex: active, canceled, past_due, expired

    startDate: timestamp("start_date").notNull().defaultNow(),
    endDate: timestamp("end_date"),
    stripeSessionId: varchar("stripeSessionId", { length: 255 }),

    price: decimal("price", { precision: 10, scale: 2 }).notNull(),

    autoRenew: boolean("auto_renew").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("unique_user_plan").on(t.userId, t.planId)]
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(schema.users, {
    fields: [subscriptions.userId],
    references: [schema.users.id],
  }),
  plan: one(schema.plans, {
    fields: [subscriptions.planId],
    references: [schema.plans.id],
  }),
}));
