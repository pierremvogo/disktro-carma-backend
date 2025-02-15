import type { Track } from '../models'
import {
    getTrackFromDbById,
    getTracksFromDbByArtistId,
    getTracksFromDbByCollectionId,
} from '../utils/track.utils'

export class TrackController {
    
    static async FindTrackById(id: number): Promise<Track | null> {
        return await getTrackFromDbById(id)
    }

    static async FindTracksByArtistId(artistId: number): Promise<Track[] | null> {
        return await getTracksFromDbByArtistId(artistId)
    }

    static async FindTracksByCollectionId(collectionId: number): Promise<Track[] | null> {
        return await getTracksFromDbByCollectionId(collectionId)
    }
}
