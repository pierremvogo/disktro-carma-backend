import { relations } from 'drizzle-orm'
import { bigint, index, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core'

import * as schema from '.'

export const tracks = mysqlTable(
    'tracks',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        title: varchar('title', {length: 256}),
        slug: varchar('slug', {length: 256}).notNull(),
        duration: int('duration'),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (table) => [
        index('track_slug_idx').on(table.slug),
    ]
    
)

export const tracksRelations = relations(tracks, ({ many }) => ({
    trackCollections: many(schema.trackCollections),
    trackArtists: many(schema.trackArtists),
    trackTags: many(schema.trackTags),
}))
