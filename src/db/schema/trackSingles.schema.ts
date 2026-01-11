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

export const trackSingles = mysqlTable(
  "track_singles",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    singleId: varchar("single_id", { length: 32 })
      .notNull()
      .references(() => schema.singles.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
    trackId: varchar("track_id", { length: 32 })
      .notNull()
      .references(() => schema.tracks.id, {
        onDelete: "cascade", // 🔥 indispensable
      }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("single_track_unique_idx").on(t.singleId, t.trackId)]
);

export const trackSinglesRelations = relations(trackSingles, ({ one }) => ({
  track: one(schema.tracks, {
    relationName: "track",
    fields: [trackSingles.trackId],
    references: [schema.tracks.id],
  }),
  single: one(schema.singles, {
    relationName: "single",
    fields: [trackSingles.singleId],
    references: [schema.singles.id],
  }),
}));
