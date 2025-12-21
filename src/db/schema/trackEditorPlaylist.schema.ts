import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";
import * as schema from "./index";

export const editorPlaylistTracks = mysqlTable(
  "editor_playlist_tracks",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    editorPlaylistId: varchar("editor_playlist_id", { length: 32 })
      .notNull()
      .references(() => schema.editorPlaylists.id, { onDelete: "cascade" }),

    trackId: varchar("track_id", { length: 32 })
      .notNull()
      .references(() => schema.tracks.id, { onDelete: "cascade" }),

    // ordre d'affichage
    position: int("position").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("editor_playlist_track_unique").on(
      t.editorPlaylistId,
      t.trackId
    ),
    index("editor_playlist_tracks_playlist_idx").on(t.editorPlaylistId),
    index("editor_playlist_tracks_position_idx").on(t.position),
  ]
);

export const editorPlaylistTracksRelations = relations(
  editorPlaylistTracks,
  ({ one }) => ({
    playlist: one(schema.editorPlaylists, {
      fields: [editorPlaylistTracks.editorPlaylistId],
      references: [schema.editorPlaylists.id],
    }),
    track: one(schema.tracks, {
      fields: [editorPlaylistTracks.trackId],
      references: [schema.tracks.id],
    }),
  })
);
