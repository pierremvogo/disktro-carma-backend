import { relations } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const tags = mysqlTable(
  "tags",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("tag_slug_idx").on(table.slug)]
);

export const tagsRelations = relations(tags, ({ many }) => ({
  artistTags: many(schema.artistTags),
  albumTags: many(schema.albumTags),
  trackTags: many(schema.trackTags),
  userTags: many(schema.userTags),
}));
