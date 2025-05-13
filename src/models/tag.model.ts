import type { Artist, Collection, Track } from '.'

interface TagProperties {
    id: number
    name: string
    slug: string
    collections?: Collection[]
    artists?: Artist[]
    tracks?: Track[]
    collectionTags?: CollectionTag[]
    artistTags?: ArtistTag[]
    trackTags?: TrackTag[]
}
interface ArtistTagProperties {
    id: number
    artistId: number
    tagId: number
    tag?: Tag
    artist?: Artist
}

interface CollectionTagProperties {
    id: number
    collectionId: number
    tagId: number
    tag?: Tag
    collection?: Collection
}

interface TrackTagProperties {
    id: number
    trackId: number
    tagId: number
    track?: Track
    tag?: Tag
}

export type Tag = TagProperties | undefined | null
export type ArtistTag = ArtistTagProperties | undefined | null
export type CollectionTag = CollectionTagProperties | undefined | null
export type TrackTag = TrackTagProperties | undefined | null
