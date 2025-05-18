import type { Artist, Collection } from '.'
interface TrackProperties {
    id: number
    title: string
    slug: string
    duration: number
    trackCollections?: TrackCollection[]
    collections?: Collection[]
    artists?: Artist[]
    trackArtists?: TrackArtist[]
}

interface TrackArtistProperties {
    id: number
    trackId: number
    artistId: number
    track?: Track
    artist?: Artist
}

interface TrackCollectionProperties {
    id: number
    collectionId: number
    trackId: number
    collection?: Collection
    track?: Track
}

export type Track = TrackProperties | undefined | null
export type TrackArtist = TrackArtistProperties | undefined | null
export type TrackCollection = TrackCollectionProperties | undefined | null
