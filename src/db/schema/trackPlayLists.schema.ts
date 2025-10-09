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

export const trackPlayLists = mysqlTable(
  "track_playlists",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    playlistId: varchar("playlist_id", { length: 32 })
      .notNull()
      .references(() => schema.playlists.id),
    trackId: varchar("track_id", { length: 32 })
      .notNull()
      .references(() => schema.tracks.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("playlist_track_unique_idx").on(t.playlistId, t.trackId)]
);

export const trackPlaylistsRelations = relations(trackPlayLists, ({ one }) => ({
  track: one(schema.tracks, {
    relationName: "track",
    fields: [trackPlayLists.trackId],
    references: [schema.tracks.id],
  }),
  playlist: one(schema.playlists, {
    relationName: "playlist",
    fields: [trackPlayLists.playlistId],
    references: [schema.playlists.id],
  }),
}));
