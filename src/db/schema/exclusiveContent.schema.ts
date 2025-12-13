import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  timestamp,
  text,
  index,
} from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";
import * as schema from "./index";

export const exclusiveContents = mysqlTable(
  "exclusive_contents",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    // l’artiste propriétaire du contenu
    artistId: varchar("artist_id", { length: 32 })
      .notNull()
      .references(() => schema.users.id, { onDelete: "cascade" }),

    type: varchar("type", { length: 16 }).notNull(), // music | video | photo | document
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),

    // URL du fichier (Cloudinary / S3 / etc.)
    fileUrl: varchar("file_url", { length: 1024 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("exclusive_contents_artist_idx").on(t.artistId)]
);

export const exclusiveContentsRelations = relations(
  exclusiveContents,
  ({ one }) => ({
    artist: one(schema.users, {
      fields: [exclusiveContents.artistId],
      references: [schema.users.id],
    }),
  })
);
