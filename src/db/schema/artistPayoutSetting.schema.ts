import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";
import * as schema from "./index";

export const artistPayoutSettings = mysqlTable(
  "artist_payout_settings",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    artistId: varchar("artist_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    // --- Bank ---
    bankAccountHolder: varchar("bank_account_holder", { length: 256 }),
    bankName: varchar("bank_name", { length: 256 }),
    accountNumber: varchar("account_number", { length: 128 }),
    routingNumber: varchar("routing_number", { length: 64 }),
    swiftCode: varchar("swift_code", { length: 32 }),
    iban: varchar("iban", { length: 64 }),

    // --- Digital ---
    paypalEmail: varchar("paypal_email", { length: 256 }),
    bizumPhone: varchar("bizum_phone", { length: 64 }),

    mobileMoneyProvider: varchar("mobile_money_provider", { length: 64 }),
    mobileMoneyPhone: varchar("mobile_money_phone", { length: 64 }),
    orangeMoneyPhone: varchar("orange_money_phone", { length: 64 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    uniqueIndex("artist_payout_settings_artist_unique").on(t.artistId),
    index("artist_payout_settings_artist_idx").on(t.artistId),
  ]
);

export const artistPayoutSettingsRelations = relations(
  artistPayoutSettings,
  ({ one }) => ({
    artist: one(schema.users, {
      fields: [artistPayoutSettings.artistId],
      references: [schema.users.id],
    }),
  })
);
