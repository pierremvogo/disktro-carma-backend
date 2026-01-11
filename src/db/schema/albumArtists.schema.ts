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
// import { albums, tracks, users, artistTags } from '.'

export const albumArtists = mysqlTable(
  "album_artists",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    artistId: varchar("artist_id", { length: 32 })
      .notNull()
      .references(() => schema.artists.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
    albumId: varchar("album_id", { length: 32 })
      .notNull()
      .references(() => schema.albums.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("unique_artist_album").on(t.artistId, t.albumId)]
);

export const albumArtistsRelations = relations(albumArtists, ({ one }) => ({
  album: one(schema.albums, {
    relationName: "album",
    fields: [albumArtists.albumId],
    references: [schema.albums.id],
  }),
  artist: one(schema.users, {
    relationName: "users",
    fields: [albumArtists.artistId],
    references: [schema.users.id],
  }),
}));
