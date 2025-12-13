import { relations } from "drizzle-orm";
import { mysqlTable, varchar, timestamp, index } from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";
import * as schema from "./index";

export const trackStreams = mysqlTable(
  "track_streams",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    trackId: varchar("track_id", { length: 32 })
      .notNull()
      .references(() => schema.tracks.id),

    // si tu as un modèle users dans ton schema
    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    ipAddress: varchar("ip_address", { length: 45 }), // IPv4 / IPv6
    country: varchar("country", { length: 2 }), // ex: "FR", "ES"
    city: varchar("city", { length: 191 }),
    device: varchar("device", { length: 50 }), // "mobile", "desktop", etc.

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("track_streams_track_id_idx").on(t.trackId),
    index("track_streams_user_id_idx").on(t.userId),
    index("track_streams_created_at_idx").on(t.createdAt),
  ]
);

export const trackStreamsRelations = relations(trackStreams, ({ one }) => ({
  track: one(schema.tracks, {
    relationName: "track",
    fields: [trackStreams.trackId],
    references: [schema.tracks.id],
  }),
  // décommente ceci si tu as schema.users
  user: one(schema.users, {
    relationName: "user",
    fields: [trackStreams.userId],
    references: [schema.users.id],
  }),
}));
