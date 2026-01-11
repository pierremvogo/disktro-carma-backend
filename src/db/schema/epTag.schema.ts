import {
  mysqlTable,
  int,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { eps } from "./ep.schema";
import { tags } from "./tags.schema";
import { nanoid } from "nanoid";

export const epTags = mysqlTable(
  "ep_tags",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    epId: varchar("ep_id", { length: 32 })
      .notNull()
      .references(() => eps.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
    tagId: varchar("tag_id", { length: 32 })
      .notNull()
      .references(() => tags.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
  },
  (table) => ({
    epTagUniqueIndex: uniqueIndex("ep_tag_unique_idx").on(
      table.epId,
      table.tagId
    ),
  })
);

// Relations
export const epTagsRelations = relations(epTags, ({ one }) => ({
  ep: one(eps, {
    relationName: "ep",
    fields: [epTags.epId],
    references: [eps.id],
  }),
  tag: one(tags, {
    relationName: "tag",
    fields: [epTags.tagId],
    references: [tags.id],
  }),
}));
