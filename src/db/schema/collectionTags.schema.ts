import { relations } from "drizzle-orm";
import {
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import * as schema from ".";
import { nanoid } from "nanoid";

export const albumTags = mysqlTable(
  "album_tags",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    albumId: varchar("album_id", { length: 32 })
      .notNull()
      .references(() => schema.albums.id),
    tagId: varchar("tag_id", { length: 32 })
      .notNull()
      .references(() => schema.tags.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [uniqueIndex("album_tag_unique_idx").on(t.albumId, t.tagId)]
);

export const albumTagsRelations = relations(albumTags, ({ one }) => ({
  album: one(schema.albums, {
    fields: [albumTags.albumId],
    references: [schema.albums.id],
  }),
  tag: one(schema.tags, {
    fields: [albumTags.tagId],
    references: [schema.tags.id],
  }),
}));
function puniqueIndex(arg0: string) {
  throw new Error("Function not implemented.");
}
