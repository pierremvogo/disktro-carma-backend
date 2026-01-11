import {
  mysqlTable,
  int,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { albums } from "./albums.schema";
import { tags } from "./tags.schema";
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
      .references(() => albums.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
    tagId: varchar("tag_id", { length: 32 })
      .notNull()
      .references(() => tags.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
  },
  (table) => ({
    albumTagUniqueIndex: uniqueIndex("album_tag_unique_idx").on(
      table.albumId,
      table.tagId
    ),
  })
);

// Relations
export const albumTagsRelations = relations(albumTags, ({ one }) => ({
  album: one(albums, {
    relationName: "album",
    fields: [albumTags.albumId],
    references: [albums.id],
  }),
  tag: one(tags, {
    relationName: "tag",
    fields: [albumTags.tagId],
    references: [tags.id],
  }),
}));
