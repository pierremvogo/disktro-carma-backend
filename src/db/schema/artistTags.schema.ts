import { relations } from 'drizzle-orm'
import { bigint, mysqlTable, primaryKey, timestamp } from 'drizzle-orm/mysql-core'

import * as schema from './index'

export const artistTags = mysqlTable(
    'artist_tags',
    {
        id: bigint('id', {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement().unique(),
        artistId: bigint('artist_id', {mode: "number", unsigned: true}).notNull().references(() => schema.artists.id),
        tagId: bigint('tag_id', {mode: "number", unsigned: true}).notNull().references(() => schema.tags.id),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        primaryKey({ columns: [t.artistId, t.tagId] }),
    ]
)

export const artistTagsRelations = relations(artistTags, ({ one }) => ({
    artist: one(schema.artists, {
        fields: [artistTags.artistId],
        references: [schema.artists.id],
    }),
    tag: one(schema.tags, {
        fields: [artistTags.tagId],
        references: [schema.tags.id],
    }),
}))
