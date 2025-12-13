import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  decimal,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const royaltyPayouts = mysqlTable(
  "royalty_payouts",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    // 🎤 Artiste concerné
    artistId: varchar("artist_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    // 💰 Montant payé / à payer (snapshot)
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),

    // Devise
    currency: varchar("currency", { length: 10 }).notNull().default("EUR"),

    // paid | pending
    status: varchar("status", { length: 20 }).notNull().default("paid"),

    // Date effective de paiement (null si pending)
    paidAt: timestamp("paid_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("royalty_payouts_artist_id_idx").on(t.artistId),
    index("royalty_payouts_status_idx").on(t.status),
    index("royalty_payouts_created_at_idx").on(t.createdAt),
  ]
);

export const royaltyPayoutsRelations = relations(royaltyPayouts, ({ one }) => ({
  artist: one(schema.users, {
    fields: [royaltyPayouts.artistId],
    references: [schema.users.id],
  }),
}));
