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

export const singles = mysqlTable(
  "singles",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    // Titre du morceau (trackTitle côté front)
    title: varchar("title", { length: 256 }).notNull(),

    slug: varchar("slug", { length: 256 }).notNull().unique(),

    // Durée en secondes (optionnel)
    duration: int("duration"),

    // URL de la pochette
    coverUrl: varchar("cover_url", { length: 256 }).notNull(),

    // 👉 URL du fichier audio (celui que l'artiste upload)
    audioUrl: varchar("audio_url", { length: 256 }),

    // ============
    // Création / crédits
    // ============

    // Auteurs (compositeurs / auteurs principaux)
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

    // Ingé son / mix / mastering
    mixingEngineer: varchar("mixing_engineer", { length: 512 }),
    masteringEngineer: varchar("mastering_engineer", { length: 512 }),

    // 👇 Clé étrangère vers la table `users`
    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("single_slug_idx").on(table.slug)]
);

export const singlesRelations = relations(singles, ({ one, many }) => ({
  user: one(schema.users, {
    fields: [singles.userId],
    references: [schema.users.id],
  }),
  trackSingles: many(schema.trackSingles),
  singleArtists: many(schema.singleArtists),
  singleTags: many(schema.singleTags),
}));

export const singlesTableInfo = getTableConfig(singles);
