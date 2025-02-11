import { relations } from 'drizzle-orm'
import { bigint, mysqlTable, primaryKey, timestamp } from 'drizzle-orm/mysql-core'

import * as schema from './index'

export const artistAdmins = mysqlTable(
    'artist_admins',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        artistId: bigint('artist_id', {mode: "number", unsigned: true}).notNull().references(() => schema.artists.id),
        userId: bigint('user_id', {mode: "number", unsigned: true}).notNull().references(() => schema.users.id),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        primaryKey({ columns: [t.artistId, t.userId] }),
    ]
)

export const artistAdminsRelations = relations(artistAdmins, ({ one }) => ({
    user: one(schema.users, {
        relationName: 'user',
        fields: [artistAdmins.userId],
        references: [schema.users.id],
    }),
    artist: one(schema.artists, {
        relationName: 'artist',
        fields: [artistAdmins.artistId],
        references: [schema.artists.id],
    }),
}))
