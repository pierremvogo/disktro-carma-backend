import type { Artist, Collection, Track } from '.'

interface TagProperties {
    id: string
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
    id: string
    artistId: string
    tagId: string
    tag?: Tag
    artist?: Artist
}

interface CollectionTagProperties {
    id: string
    collectionId: string
    tagId: string
    tag?: Tag
    collection?: Collection
}

interface TrackTagProperties {
    id: string
    trackId: string
    tagId: string
    track?: Track
    tag?: Tag
}

export type Tag = TagProperties | undefined | null
export type ArtistTag = ArtistTagProperties | undefined | null
export type CollectionTag = CollectionTagProperties | undefined | null
export type TrackTag = TrackTagProperties | undefined | null
