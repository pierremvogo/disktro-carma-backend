import { relations } from "drizzle-orm";
import {
  bigint,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const artists = mysqlTable(
  "artists",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),
    media_url: varchar("url", { length: 256 }),
    location: varchar("location", { length: 256 }),
    profileImageUrl: varchar("profile_image_url", { length: 256 }),
    biography: varchar("biography", { length: 256 }),
    spotify_artist_link: varchar("spotify_artist_link", {
      length: 256,
    }).unique(),
    deezer_artist_link: varchar("deezer_artist_link", { length: 256 }).unique(),
    tidal_artist_link: varchar("tidal_artist_link", { length: 256 }).unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("artist_slug_idx").on(table.slug)]
);

export const artistsRelations = relations(artists, ({ many }) => ({
  release: many(schema.release),
  artistTags: many(schema.artistTags),
  albumArtists: many(schema.albumArtists),
  trackArtists: many(schema.trackArtists),
  artistAdmins: many(schema.artistAdmins),
}));
