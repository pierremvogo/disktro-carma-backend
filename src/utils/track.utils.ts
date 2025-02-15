import { eq } from 'drizzle-orm'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { Track } from '../models'

export async function getTrackFromDbById(id: number): Promise<Track | null> {
    const res = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, id),
    })

    if (!res) {
        throw new Error(`No collection found with id ${id}.`)
    }

    const track: Track = { ...res } as Track

    // track.artists = res.trackArtists.map((a: TrackArtist) => a.artist as Artist)

    // // track.collections = res.trackCollections.map(
    // //     (tc) => tc.collection as Collection
    // // )

    // delete track.trackArtists
    // delete track.trackCollections

    return track
}

export async function getTracksFromDbByArtistId(artistId: number): Promise<Track[] | null> {
    const tracksByArtist = await db.query.tracks.findMany({
         where: eq(schema.trackArtists.artistId, artistId),
     })
     if (!tracksByArtist) {
         return null
     }
     return tracksByArtist as Track[]
}


export async function getTracksFromDbByCollectionId(collectionId: number): Promise<Track[] | null> {
    const tracksOnCollection = await db.query.tracks.findMany({
        where: eq(schema.trackCollections.collectionId, collectionId),
    })

    if (!tracksOnCollection) {
        return null
    }

    return tracksOnCollection as Track[]
}
