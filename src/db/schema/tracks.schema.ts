import { relations } from "drizzle-orm";
import {
  bigint,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import * as schema from ".";
import { nanoid } from "nanoid";

export const tracks = mysqlTable(
  "tracks",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: varchar("title", { length: 256 }),
    slug: varchar("slug", { length: 256 }).notNull(),
    duration: int("duration"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("track_slug_idx").on(table.slug)]
);

export const tracksRelations = relations(tracks, ({ many }) => ({
  trackAlbums: many(schema.trackAlbums),
  trackArtists: many(schema.trackArtists),
  trackTags: many(schema.trackTags),
}));
