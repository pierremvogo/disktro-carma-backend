import {
  mysqlTable,
  int,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { singles } from "./single.schema";
import { tags } from "./tags.schema";
import { nanoid } from "nanoid";

export const singleTags = mysqlTable(
  "single_tags",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    singleId: varchar("single_id", { length: 32 })
      .notNull()
      .references(() => singles.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
    tagId: varchar("tag_id", { length: 32 })
      .notNull()
      .references(() => tags.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
  },
  (table) => ({
    singleTagUniqueIndex: uniqueIndex("single_tag_unique_idx").on(
      table.singleId,
      table.tagId
    ),
  })
);

// Relations
export const singleTagsRelations = relations(singleTags, ({ one }) => ({
  single: one(singles, {
    relationName: "single",
    fields: [singleTags.singleId],
    references: [singles.id],
  }),
  tag: one(tags, {
    relationName: "tag",
    fields: [singleTags.tagId],
    references: [tags.id],
  }),
}));
