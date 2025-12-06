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

export const albums = mysqlTable(
  "albums",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),
    duration: int("duration"),

    // URL de la cover de l’album
    coverUrl: varchar("cover_url", { length: 256 }).notNull(),

    // ============
    // Création / crédits (comme pour singles)
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
  (table) => [index("album_slug_idx").on(table.slug)]
);

export const albumsRelations = relations(albums, ({ one, many }) => ({
  user: one(schema.users, {
    fields: [albums.userId],
    references: [schema.users.id],
  }),
  trackAlbums: many(schema.trackAlbums),
  albumArtists: many(schema.albumArtists),
  albumTags: many(schema.albumTags),
}));

export const albumsTableInfo = getTableConfig(albums);
