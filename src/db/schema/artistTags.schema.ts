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

export const artistTags = mysqlTable(
  "artist_tags",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    artistId: varchar("artist_id", { length: 21 })
      .notNull()
      .references(() => schema.artists.id),
    tagId: varchar("tag_id", { length: 21 })
      .notNull()
      .references(() => schema.tags.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("artist_tag_unique_idx").on(t.artistId, t.tagId)]
);

export const artistTagsRelations = relations(artistTags, ({ one }) => ({
  artist: one(schema.artists, {
    fields: [artistTags.artistId],
    references: [schema.artists.id],
  }),
  tag: one(schema.tags, {
    fields: [artistTags.tagId],
    references: [schema.tags.id],
  }),
}));
