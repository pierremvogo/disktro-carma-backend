import { relations } from "drizzle-orm";
import {
  double,
  index,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import * as schema from ".";
import { nanoid } from "nanoid";

export const tracks = mysqlTable(
  "tracks",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    isrcCode: varchar("isrc_code", { length: 256 }).notNull(),
    title: varchar("title", { length: 256 }),
    slug: varchar("slug", { length: 256 }).notNull(),
    type: varchar("type", { length: 256 }).notNull(),

    // ✅ userId devient optionnel (nullable)
    userId: varchar("user_id", { length: 32 }).references(
      () => schema.users.id,
      { onDelete: "cascade" }
    ),

    duration: double("duration"),
    moodId: varchar("mood_id", { length: 32 })
      .references(() => schema.mood.id)
      .notNull(),
    audioUrl: varchar("audio_url", { length: 2048 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("track_slug_idx").on(table.slug)]
);

export const tracksRelations = relations(tracks, ({ many, one }) => ({
  trackAlbums: many(schema.trackAlbums),
  trackTags: many(schema.trackTags),
  trackReleases: many(schema.trackReleases),
  trackPlayLists: many(schema.trackPlayLists),

  // Relation vers mood
  mood: one(schema.mood, {
    fields: [tracks.moodId],
    references: [schema.mood.id],
  }),

  // Relation vers user (optionnelle)
  user: one(schema.users, {
    fields: [tracks.userId],
    references: [schema.users.id],
  }),
}));
