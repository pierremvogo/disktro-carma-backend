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
    status: varchar("status", { length: 20 }).notNull().default("active"),
    // active | cancelled | expired | past_due | pending

    // ⏱️ DATES
    startDate: timestamp("start_date").notNull().defaultNow(),
    endDate: timestamp("end_date").notNull(),

    // 💰 PRIX SNAPSHOT (au moment de l’abonnement)
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("EUR"),

    // 🔁 RENOUVELLEMENT AUTO
    autoRenew: boolean("auto_renew").notNull().default(true),

    // ✅ STRIPE (recommandé pour abonnement)
    stripeCustomerId: varchar("stripe_customer_id", { length: 64 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 64 }),
    stripeCheckoutSessionId: varchar("stripe_checkout_session_id", {
      length: 128,
    }),

    // (legacy) si tu veux garder l'ancien champ pour compat
    // stripeSessionId: varchar("stripe_session_id", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },

  (t) => [
    // 🚫 Un fan ne peut avoir QU’UN abonnement par artiste
    uniqueIndex("unique_user_artist").on(t.userId, t.artistId),

    // ✅ Un abonnement Stripe est unique
    uniqueIndex("subscriptions_stripe_sub_unique").on(t.stripeSubscriptionId),

    // ✅ Une session Checkout est unique (optionnel mais utile)
    uniqueIndex("subscriptions_stripe_checkout_unique").on(
      t.stripeCheckoutSessionId
    ),

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
