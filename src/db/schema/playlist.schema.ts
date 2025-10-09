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

export const playlists = mysqlTable(
  "playlists",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    nom: varchar("nom", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),
    userId: varchar("user_id", { length: 32 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("playlist_slug_idx").on(table.slug)]
);

export const playlistsRelations = relations(playlists, ({ many, one }) => ({
  trackPlayLists: many(schema.trackPlayLists),

  user: one(schema.users, {
    fields: [playlists.userId],
    references: [schema.users.id],
  }),
}));

export const playlistsTableInfo = getTableConfig(playlists);
