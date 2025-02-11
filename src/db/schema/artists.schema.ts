import { relations } from 'drizzle-orm'
import { bigint, mysqlTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'

import * as schema from './index'

export const artists = mysqlTable(
    'artists',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        name: varchar('name', {length: 256}).notNull(),
        slug: varchar('slug').notNull().unique(),
        media_url: varchar('url', {length: 256}),
        adminId: bigint('admin_id',{mode: "number", unsigned: true}).notNull(),
        location: varchar('location', {length: 256}),
        profileImageUrl: varchar('profile_image_url', {length: 256}),
        biography: varchar('biography', {length: 256}),
        spotify_artist_link: varchar("spotify_artist_link", {length: 256}).notNull().unique(),
        deezer_artist_link: varchar("deezer_artist_link", {length: 256}).notNull().unique(),
	    tidal_artist_link:  varchar("tidal_artist_link", {length: 256}).notNull().unique(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (table) => [
        uniqueIndex('artist_slug_idx').on(table.slug),
    ]
)

export const artistsRelations = relations(artists, ({ one, many }) => ({
    admin: one(schema.users, {
        fields: [artists.adminId],
        references: [schema.users.id],
    }),
    release: many(schema.release),
    artistTags: many(schema.artistTags),
    collectionArtists: many(schema.collectionArtists),
    trackArtists: many(schema.trackArtists),
    artistAdmins: many(schema.artistAdmins),
}))
