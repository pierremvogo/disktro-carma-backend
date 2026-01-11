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
// import { eps, tracks, users, artistTags } from '.'

export const epArtists = mysqlTable(
  "ep_artists",
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
    epId: varchar("ep_id", { length: 32 })
      .notNull()
      .references(() => schema.eps.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("unique_artist_ep").on(t.artistId, t.epId)]
);

export const epArtistsRelations = relations(epArtists, ({ one }) => ({
  ep: one(schema.eps, {
    relationName: "ep",
    fields: [epArtists.epId],
    references: [schema.eps.id],
  }),
  artist: one(schema.users, {
    relationName: "users",
    fields: [epArtists.artistId],
    references: [schema.users.id],
  }),
}));
