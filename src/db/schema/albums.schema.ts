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
    id: varchar("id", { length: 21 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),
    duration: int("duration"),
    coverUrl: varchar("cover_url", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("album_slug_idx").on(table.slug)]
);

export const albumsRelations = relations(albums, ({ many }) => ({
  trackAlbums: many(schema.trackAlbums),
  albumArtists: many(schema.albumArtists),
  albumTags: many(schema.albumTags),
}));

export const albumsTableInfo = getTableConfig(albums);
