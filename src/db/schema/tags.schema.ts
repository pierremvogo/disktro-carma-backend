import { relations } from 'drizzle-orm'
import { bigint, index, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core'

import * as schema from './index'

export const tags = mysqlTable(
    'tags',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        name: varchar('name', {length: 256}).notNull(),
        slug: varchar('slug', {length: 256}).unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (table) => [
            index('tag_slug_idx').on(table.slug),
    ]
)

export const tagsRelations = relations(tags, ({ many }) => ({
    artistTags: many(schema.artistTags),
    collectionTags: many(schema.collectionTags),
    trackTags: many(schema.trackTags),
}))
