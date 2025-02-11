import type { Artist, Collection } from '$lib/types'
interface TrackProperties {
    id: string
    title: string
    slug: string
    duration: number
    trackCollections?: TrackCollection[]
    collections?: Collection[]
    artists?: Artist[]
    trackArtists?: TrackArtist[]
}

interface TrackArtistProperties {
    id: string
    trackId: string
    artistId: string
    track?: Track
    artist?: Artist
}

interface TrackCollectionProperties {
    id: string
    collectionId: string
    trackId: string
    collection?: Collection
    track?: Track
}

export type Track = TrackProperties | undefined | null
export type TrackArtist = TrackArtistProperties | undefined | null
export type TrackCollection = TrackCollectionProperties | undefined | null
