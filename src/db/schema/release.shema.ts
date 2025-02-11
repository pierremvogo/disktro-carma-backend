import { relations } from 'drizzle-orm'
import { bigint, mysqlTable, primaryKey, timestamp, varchar } from 'drizzle-orm/mysql-core'

import * as schema from './index'

export const release = mysqlTable(
    'release',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        artistId: bigint('artist_id', {mode: "number", unsigned: true}).notNull().references(() => schema.artists.id),
        title: varchar("title", {length: 256}).notNull(),
	    releaseDate: varchar("release_date", {length: 256}),
	    description: varchar("description", {length: 256}),
	    coverArt: varchar("covert_art", {length: 256}),
	    label: varchar("label", {length: 256}).notNull(),
	    releaseType: varchar("release_type", {length: 256}), 
	    format: varchar("format", {length: 256}), 
	    upcCode: varchar("upc_code", {length: 256}),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        primaryKey({ columns: [t.id] }),
    ]
)

export const releaseRelations = relations(release, ({ one }) => ({
    artist: one(schema.artists,{
        fields: [release.artistId],
        references: [schema.artists.id]
    }),
}))
