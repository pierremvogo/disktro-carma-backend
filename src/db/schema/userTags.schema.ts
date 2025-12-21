import { relations } from "drizzle-orm";
import {
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import * as schema from "./index";
import { nanoid } from "nanoid";

export const userTags = mysqlTable(
  "user_tags",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    tagId: varchar("tag_id", { length: 32 })
      .notNull()
      .references(() => schema.tags.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("user_tag_unique_idx").on(t.userId, t.tagId)]
);

export const userTagsRelations = relations(userTags, ({ one }) => ({
  user: one(schema.users, {
    fields: [userTags.userId],
    references: [schema.users.id],
  }),
  tag: one(schema.tags, {
    fields: [userTags.tagId],
    references: [schema.tags.id],
  }),
}));
