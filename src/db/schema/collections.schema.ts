import { relations } from 'drizzle-orm'
import {
    bigint,
    getTableConfig,
    index,
    int,
    mysqlTable,
    timestamp,
    varchar,
} from 'drizzle-orm/mysql-core'

import * as schema from '.'

export const collections = mysqlTable(
    'collections',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        title: varchar('title', {length: 256}).notNull(),
        slug: varchar('slug', {length: 256}).notNull().unique(),
        duration: int('duration'),
        coverUrl: varchar('cover_url', {length: 256}).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (table) => [
         index('collection_slug_idx').on(table.slug),   
    ]
)

export const collectionsRelations = relations(collections, ({ many }) => ({
    trackCollections: many(schema.trackCollections),
    collectionArtists: many(schema.collectionArtists),
    collectionTags: many(schema.collectionTags),
}))

export const collectionsTableInfo = getTableConfig(collections)
