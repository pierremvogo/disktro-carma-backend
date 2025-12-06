import { relations } from "drizzle-orm";
import {
  boolean,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import * as schema from "./index";
import { nanoid } from "nanoid";
import z from "zod";

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 32 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),

    // Nom légal de la personne (artiste ou fan)
    name: varchar("name", { length: 256 }).notNull(),

    // Nom de famille / second champ (peut être laissé vide pour un fan si besoin)
    surname: varchar("surname", { length: 256 }).notNull(),

    videoIntroUrl: varchar("videoIntroUrl", { length: 512 }),
    miniVideoLoopUrl: varchar("miniVideoLoopUrl", { length: 512 }),

    // 🔹 Nouveau : username pour les fans (et artistes si tu veux)
    username: varchar("username", { length: 256 }),

    email: varchar("email", { length: 256 }).notNull().unique(),
    password: varchar("password", { length: 256 }).notNull().unique(),

    profileImageUrl: varchar("profileImageUrl", { length: 512 }),

    // type d'utilisateur : "artist", "fan", "admin", etc.
    type: varchar("type", { length: 256 }),

    isSubscribed: boolean("isSubscribed").notNull().default(false),

    // 🔹 Spécifique artiste (mais peut rester nullable pour un fan)
    artistName: varchar("artistName", { length: 256 }),
    genre: varchar("genre", { length: 256 }),

    // 🔹 Bio commune (artiste ou fan)
    bio: varchar("bio", { length: 1024 }),

    // 🔹 2FA commun
    twoFactorEnabled: boolean("twoFactorEnabled").notNull().default(false),

    emailVerificationToken: varchar("emailVerificationToken", {
      length: 256,
    }),

    emailVerified: boolean("emailVerified").notNull().default(false),

    passwordResetToken: varchar("passwordResetToken", { length: 256 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("email_idx").on(table.email)]
);

export const usersRelations = relations(users, ({ many }) => ({
  albums: many(schema.albums),
  artistAdmins: many(schema.artistAdmins),
  playlists: many(schema.playlists),
}));

export const validate = z.object({
  id: z.string().max(32).optional(), // généré automatiquement

  name: z.string().min(1).max(256),
  surname: z.string().min(1).max(256),

  // 🔹 Fan (et éventuellement artiste) : pseudo
  username: z.string().max(256).optional(),

  email: z.string().email().max(256),
  password: z.string().min(8).max(256),

  profileImageUrl: z.string().max(512).optional(),
  type: z.string().max(256).optional(),

  // 🔹 Artiste
  artistName: z.string().max(256).optional(),
  genre: z.string().max(256).optional(),

  // 🔹 Bio commune
  bio: z.string().max(1024).optional(),

  // 🔹 2FA
  twoFactorEnabled: z.boolean().optional(),

  emailVerificationToken: z
    .string()
    .max(256, "Le token de vérification est trop long")
    .optional(),
  passwordResetToken: z
    .string()
    .max(256, "Le token de réinitialisation est trop long")
    .optional(),
  emailVerified: z.boolean(),
  isSubscribed: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
