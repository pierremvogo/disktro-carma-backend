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

export const trackTags = mysqlTable(
  "track_tags",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    trackId: varchar("track_id", { length: 32 })
      .notNull()
      .references(() => schema.tracks.id),
    tagId: varchar("tag_id", { length: 32 })
      .notNull()
      .references(() => schema.tags.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("track_tag_unique_idx").on(t.trackId, t.tagId)]
);

export const trackTagsRelations = relations(trackTags, ({ one }) => ({
  track: one(schema.tracks, {
    fields: [trackTags.trackId],
    references: [schema.tracks.id],
  }),
  tag: one(schema.tags, {
    fields: [trackTags.tagId],
    references: [schema.tags.id],
  }),
}));
