import { relations } from "drizzle-orm";
import {
  bigint,
  getTableConfig,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import * as schema from ".";
import { nanoid } from "nanoid";

export const eps = mysqlTable(
  "eps",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),
    duration: int("duration"),

    // Cover de l’EP
    coverUrl: varchar("cover_url", { length: 256 }).notNull(),
    coverFileName: varchar("cover_file_name", { length: 255 }).notNull(),
    // ============
    // Création / crédits (mêmes champs que albums/singles)
    // ============

    // Auteurs / compositeurs
    authors: varchar("authors", { length: 512 }),

    // Producteurs
    producers: varchar("producers", { length: 512 }),

    // Paroliers
    lyricists: varchar("lyricists", { length: 512 }),

    // Musiciens
    musiciansVocals: varchar("musicians_vocals", { length: 512 }),
    musiciansPianoKeyboards: varchar("musicians_piano_keyboards", {
      length: 512,
    }),
    musiciansWinds: varchar("musicians_winds", { length: 512 }),
    musiciansPercussion: varchar("musicians_percussion", { length: 512 }),
    musiciansStrings: varchar("musicians_strings", { length: 512 }),

    // Ingé mix / mastering
    mixingEngineer: varchar("mixing_engineer", { length: 512 }),
    masteringEngineer: varchar("mastering_engineer", { length: 512 }),

    // 👇 Clé étrangère vers la table `users`
    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("ep_slug_idx").on(table.slug)]
);

export const epsRelations = relations(eps, ({ one, many }) => ({
  user: one(schema.users, {
    fields: [eps.userId],
    references: [schema.users.id],
  }),
  trackEps: many(schema.trackEps),
  epArtists: many(schema.epArtists),
  epTags: many(schema.epTags),
}));

export const epsTableInfo = getTableConfig(eps);
