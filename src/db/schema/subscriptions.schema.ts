import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  uniqueIndex,
  decimal,
  index,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    // 👤 FAN (celui qui s’abonne)
    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    // 🎤 ARTISTE (propriétaire du plan)
    artistId: varchar("artist_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    // 📦 PLAN (monthly / quarterly / annual)
    planId: varchar("plan_id", { length: 32 })
      .notNull()
      .references(() => schema.plans.id, { onDelete: "cascade" }),

    // 🔄 STATUT
    status: varchar("status", { length: 20 }).notNull().default("active"), // active | canceled | expired | past_due

    // ⏱️ DATES
    startDate: timestamp("start_date").notNull().defaultNow(),
    endDate: timestamp("end_date").notNull(),

    // 💳 STRIPE (optionnel)
    stripeSessionId: varchar("stripe_session_id", { length: 255 }),

    // 💰 PRIX SNAPSHOT (au moment de l’abonnement)
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("EUR"),

    // 🔁 RENOUVELLEMENT AUTO
    autoRenew: boolean("auto_renew").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },

  (t) => [
    // 🚫 Un fan ne peut avoir QU’UN abonnement par artiste
    uniqueIndex("unique_user_artist").on(t.userId, t.artistId),

    // 📊 Index utiles pour stats
    index("subscriptions_artist_idx").on(t.artistId),
    index("subscriptions_user_idx").on(t.userId),
    index("subscriptions_status_idx").on(t.status),
  ]
);
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  fan: one(schema.users, {
    fields: [subscriptions.userId],
    references: [schema.users.id],
  }),
  artist: one(schema.users, {
    fields: [subscriptions.artistId],
    references: [schema.users.id],
  }),
  plan: one(schema.plans, {
    fields: [subscriptions.planId],
    references: [schema.plans.id],
  }),
}));
