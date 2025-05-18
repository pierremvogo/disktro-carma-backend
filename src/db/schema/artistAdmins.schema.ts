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

export const artistAdmins = mysqlTable(
  "artist_admins",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    artistId: varchar("artist_id", { length: 21 })
      .notNull()
      .references(() => schema.artists.id),
    userId: varchar("user_id", { length: 21 })
      .notNull()
      .references(() => schema.users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("artist_admins_artist_user_idx").on(t.artistId, t.userId)]
);

export const artistAdminsRelations = relations(artistAdmins, ({ one }) => ({
  user: one(schema.users, {
    relationName: "user",
    fields: [artistAdmins.userId],
    references: [schema.users.id],
  }),
  artist: one(schema.artists, {
    relationName: "artist",
    fields: [artistAdmins.artistId],
    references: [schema.artists.id],
  }),
}));
