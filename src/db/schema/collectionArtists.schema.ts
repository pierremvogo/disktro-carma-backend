import { relations } from 'drizzle-orm'
import { bigint, int, mysqlTable, primaryKey, timestamp } from 'drizzle-orm/mysql-core'

import * as schema from './index'
// import { collections, tracks, users, artistTags } from '.'

export const collectionArtists = mysqlTable(
    'collection_artists',
    {
        id: int("id", {unsigned: true}).notNull().primaryKey().autoincrement(),
        artistId: int('artist_id', {unsigned: true}).notNull().references(() => schema.artists.id),
        collectionId: bigint('collection_id', {mode: "number", unsigned: true}).notNull().references(() => schema.collections.id),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        primaryKey({ columns: [t.artistId, t.collectionId] }),
    ]
)

export const collectionArtistsRelations = relations(
    collectionArtists,
    ({ one }) => ({
        collection: one(schema.collections, {
            relationName: 'collection',
            fields: [collectionArtists.collectionId],
            references: [schema.collections.id],
        }),
        artist: one(schema.artists, {
            relationName: 'artist',
            fields: [collectionArtists.artistId],
            references: [schema.artists.id],
        }),
    })
)
