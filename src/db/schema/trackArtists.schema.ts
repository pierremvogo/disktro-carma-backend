import { relations } from "drizzle-orm";
import {
  bigint,
  mysqlTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const trackArtists = mysqlTable(
  "track_artists",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    artistId: varchar("artist_id", { length: 21 })
      .notNull()
      .references(() => schema.artists.id),
    trackId: varchar("track_id", { length: 21 })
      .notNull()
      .references(() => schema.tracks.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("artist_track_unique").on(t.artistId, t.trackId)]
);

export const trackArtistsRelations = relations(trackArtists, ({ one }) => ({
  track: one(schema.tracks, {
    relationName: "track",
    fields: [trackArtists.trackId],
    references: [schema.tracks.id],
  }),
  artist: one(schema.artists, {
    relationName: "artist",
    fields: [trackArtists.artistId],
    references: [schema.artists.id],
  }),
}));
