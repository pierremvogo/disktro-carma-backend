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

export const trackEps = mysqlTable(
  "track_eps",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    epId: varchar("ep_id", { length: 32 })
      .notNull()
      .references(() => schema.eps.id),
    trackId: varchar("track_id", { length: 32 })
      .notNull()
      .references(() => schema.tracks.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("ep_track_unique_idx").on(t.epId, t.trackId)]
);

export const trackEpsRelations = relations(trackEps, ({ one }) => ({
  track: one(schema.tracks, {
    relationName: "track",
    fields: [trackEps.trackId],
    references: [schema.tracks.id],
  }),
  ep: one(schema.eps, {
    relationName: "ep",
    fields: [trackEps.epId],
    references: [schema.eps.id],
  }),
}));
