import type { Artist, CollectionTag, Tag, Track, TrackCollection } from './index'

interface CollectionProperties {
    id: number
    title: string
    slug: string
    duration: number
    coverUrl: string
    tracks?: Track[]
    artists?: Artist[]
    tags?: Tag[]
    collectionArtists?: CollectionArtist[]
    collectionTags?: CollectionTag[]
    trackCollections?: TrackCollection[]
}

export type Collection = CollectionProperties | undefined | null

interface CollectionArtistProperties {
    id: number
    collectionId: number
    artistId?: number
    collection?: Collection
    artist?: Artist
}

export type CollectionArtist = CollectionArtistProperties | undefined | null
