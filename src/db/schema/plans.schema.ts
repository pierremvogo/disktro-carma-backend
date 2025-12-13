import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  decimal,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const plans = mysqlTable(
  "plans",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    // 🎤 Artiste propriétaire du plan
    artistId: varchar("artist_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    // Nom affiché (ex: "Monthly", "Quarterly", "Annual")
    name: varchar("name", { length: 100 }).notNull(),

    description: text("description"),

    // Prix du plan
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),

    // Devise (si tu veux rester simple -> EUR partout)
    currency: varchar("currency", { length: 10 }).notNull().default("EUR"),

    // Cycle : monthly | quarterly | annual
    billingCycle: varchar("billing_cycle", { length: 20 }).notNull(),

    // Actif / inactif
    active: boolean("active").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index("plans_artist_id_idx").on(t.artistId),

    // 🚫 Un artiste ne peut pas avoir deux "monthly" par exemple
    uniqueIndex("unique_artist_cycle").on(t.artistId, t.billingCycle),
  ]
);

export const plansRelations = relations(plans, ({ one, many }) => ({
  artist: one(schema.users, {
    fields: [plans.artistId],
    references: [schema.users.id],
  }),
  subscriptions: many(schema.subscriptions),
}));
