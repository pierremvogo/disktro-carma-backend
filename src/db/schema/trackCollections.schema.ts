import { relations } from 'drizzle-orm'
import { bigint, mysqlTable, primaryKey, timestamp } from 'drizzle-orm/mysql-core'

import * as schema from './index'

export const trackCollections = mysqlTable(
    'track_collections',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        collectionId: bigint('collection_id',{mode: "number", unsigned: true}).notNull().references(() => schema.collections.id),
        trackId: bigint('track_id', {mode: "number", unsigned: true}).notNull().references(() => schema.tracks.id),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        primaryKey({ columns: [t.collectionId, t.trackId] }),
    ]
)

export const trackCollectionsRelations = relations(trackCollections,({ one }) => ({
        track: one(schema.tracks, {
            relationName: 'track',
            fields: [trackCollections.trackId],
            references: [schema.tracks.id],
        }),
        collection: one(schema.collections, {
            relationName: 'collection',
            fields: [trackCollections.collectionId],
            references: [schema.collections.id],
        }),
    })
)
