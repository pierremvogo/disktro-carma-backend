import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  index,
} from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";
import * as schema from "./index";

export const editorPlaylists = mysqlTable(
  "editor_playlists",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    coverUrl: varchar("cover_url", { length: 2048 }),

    // optional: pour multi-langue plus tard
    locale: varchar("locale", { length: 16 }).default("en").notNull(),

    // publication
    isPublished: boolean("is_published").default(false).notNull(),

    // ordonner les playlists sur la page (homepage)
    priority: int("priority").default(0).notNull(),

    // qui a créé (admin)
    createdByUserId: varchar("created_by_user_id", { length: 32 }).references(
      () => schema.users.id
    ),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [index("editor_playlist_published_idx").on(t.isPublished)]
);

export const editorPlaylistsRelations = relations(
  editorPlaylists,
  ({ many, one }) => ({
    tracks: many(schema.editorPlaylistTracks),
    createdBy: one(schema.users, {
      fields: [editorPlaylists.createdByUserId],
      references: [schema.users.id],
    }),
  })
);
