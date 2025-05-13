import { relations } from 'drizzle-orm'
import { bigint, mysqlTable, primaryKey, timestamp } from 'drizzle-orm/mysql-core'

import * as schema from '.'

export const collectionTags = mysqlTable(
    'collection_tags',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        collectionId: bigint('collection_id', {mode: "number", unsigned: true}).notNull().references(() => schema.collections.id),
        tagId: bigint('tag_id', {mode: "number", unsigned: true}).notNull().references(() => schema.tags.id),
        createdAt: timestamp('created_at').defaultNow(),
    },
    (t) => [
        primaryKey({ columns: [t.collectionId, t.tagId] }),
    ]
)

export const collectionTagsRelations = relations(collectionTags, ({ one }) => ({
    collection: one(schema.collections, {
        fields: [collectionTags.collectionId],
        references: [schema.collections.id],
    }),
    tag: one(schema.tags, {
        fields: [collectionTags.tagId],
        references: [schema.tags.id],
    }),
}))
