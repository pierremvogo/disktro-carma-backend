import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import { nanoid } from "nanoid";

export const suggestion = mysqlTable("suggestion", {
  id: varchar("id", { length: 32 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  email: varchar("email", { length: 256 }).notNull(),
  song: varchar("song", { length: 512 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
