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
// import { singles, tracks, users, artistTags } from '.'

export const singleArtists = mysqlTable(
  "single_artists",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    artistId: varchar("artist_id", { length: 32 })
      .notNull()
      .references(() => schema.artists.id),
    singleId: varchar("single_id", { length: 32 })
      .notNull()
      .references(() => schema.singles.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("unique_artist_single").on(t.artistId, t.singleId)]
);

export const singleArtistsRelations = relations(singleArtists, ({ one }) => ({
  single: one(schema.singles, {
    relationName: "single",
    fields: [singleArtists.singleId],
    references: [schema.singles.id],
  }),
  artist: one(schema.users, {
    relationName: "users",
    fields: [singleArtists.artistId],
    references: [schema.users.id],
  }),
}));
