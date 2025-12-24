// src/db/schema/testers.ts
import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";
import z from "zod";

export const testers = mysqlTable("testers", {
  id: varchar("id", { length: 32 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  ageRange: varchar("ageRange", { length: 16 }).notNull(), // "-18", "-22", etc.
  language: varchar("language", { length: 32 }).notNull(), // "english", "spanish", "catalan"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schéma Zod pour valider ce qui vient du front
export const testerValidate = z.object({
  name: z.string().min(1).max(256),
  email: z.string().email().max(256),
  ageRange: z.enum(["-18", "-22", "-25", "-30", "-50", "+50"]),
  language: z.enum(["english", "spanish", "catalan"]),
});
