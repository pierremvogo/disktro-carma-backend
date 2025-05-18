import { relations } from 'drizzle-orm'
import { bigint, mysqlTable, primaryKey, timestamp } from 'drizzle-orm/mysql-core'

import * as schema from './index'

export const trackTags = mysqlTable(
    'track_tags',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        trackId: bigint('track_id', {mode: "number", unsigned: true}).notNull().references(() => schema.tracks.id),
        tagId: bigint('tag_id', {mode: "number", unsigned: true}).notNull().references(() => schema.tags.id),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        primaryKey({ columns: [t.trackId, t.tagId] }),
    ]
)

export const trackTagsRelations = relations(trackTags, ({ one }) => ({
    track: one(schema.tracks, {
        fields: [trackTags.trackId],
        references: [schema.tracks.id],
    }),
    tag: one(schema.tags, {
        fields: [trackTags.tagId],
        references: [schema.tags.id],
    }),
}))
