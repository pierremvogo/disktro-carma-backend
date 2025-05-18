import { relations } from 'drizzle-orm'
import { bigint, mysqlTable, primaryKey, timestamp } from 'drizzle-orm/mysql-core'

import * as schema from './index'

export const trackArtists = mysqlTable(
    'track_artists',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        artistId: bigint('artist_id',{mode: "number", unsigned: true}).notNull().references(() => schema.artists.id),
        trackId: bigint('track_id', {mode: "number", unsigned: true}).notNull().references(() => schema.tracks.id),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        primaryKey({ columns: [t.artistId, t.trackId] }),
    ]
)

export const trackArtistsRelations = relations(trackArtists, ({ one }) => ({
    track: one(schema.tracks, {
        relationName: 'track',
        fields: [trackArtists.trackId],
        references: [schema.tracks.id],
    }),
    artist: one(schema.artists, {
        relationName: 'artist',
        fields: [trackArtists.artistId],
        references: [schema.artists.id],
    }),
}))
