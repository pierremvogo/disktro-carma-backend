import { relations } from "drizzle-orm";
import {
  varchar,
  timestamp,
  uniqueIndex,
  mysqlTable,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const trackReleases = mysqlTable(
  "track_releases",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    trackId: varchar("track_id", { length: 21 })
      .notNull()
      .references(() => schema.tracks.id),
    releaseId: varchar("release_id", { length: 21 })
      .notNull()
      .references(() => schema.release.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("track_release_unique").on(t.trackId, t.releaseId)]
);

export const trackReleasesRelations = relations(trackReleases, ({ one }) => ({
  track: one(schema.tracks, {
    relationName: "track",
    fields: [trackReleases.trackId],
    references: [schema.tracks.id],
  }),
  release: one(schema.release, {
    relationName: "release",
    fields: [trackReleases.releaseId],
    references: [schema.release.id],
  }),
}));
