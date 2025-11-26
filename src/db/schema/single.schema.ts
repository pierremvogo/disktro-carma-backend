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

export const singles = mysqlTable(
  "singles",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),
    duration: int("duration"),
    coverUrl: varchar("cover_url", { length: 256 }).notNull(),

    // 👇 Clé étrangère vers la table `users`
    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("single_slug_idx").on(table.slug)]
);

export const singlesRelations = relations(singles, ({ one, many }) => ({
  user: one(schema.users, {
    fields: [singles.userId],
    references: [schema.users.id],
  }),
  trackSingles: many(schema.trackSingles),
  singleArtists: many(schema.singleArtists),
  singleTags: many(schema.singleTags),
}));

export const singlesTableInfo = getTableConfig(singles);
