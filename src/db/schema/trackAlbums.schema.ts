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

export const trackAlbums = mysqlTable(
  "track_albums",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    albumId: varchar("album_id", { length: 21 })
      .notNull()
      .references(() => schema.albums.id),
    trackId: varchar("track_id", { length: 21 })
      .notNull()
      .references(() => schema.tracks.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("album_track_unique_idx").on(t.albumId, t.trackId)]
);

export const trackAlbumsRelations = relations(trackAlbums, ({ one }) => ({
  track: one(schema.tracks, {
    relationName: "track",
    fields: [trackAlbums.trackId],
    references: [schema.tracks.id],
  }),
  album: one(schema.albums, {
    relationName: "album",
    fields: [trackAlbums.albumId],
    references: [schema.albums.id],
  }),
}));
