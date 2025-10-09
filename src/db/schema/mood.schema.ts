import { relations } from "drizzle-orm";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";

export const mood = mysqlTable("mood", {
  id: varchar("id", { length: 32 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const moodRelations = relations(mood, ({ many }) => ({
  track: many(schema.tracks),
}));
