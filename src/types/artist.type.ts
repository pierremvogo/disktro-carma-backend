import type {
    Tag,
    Collection,
    Track,
    TrackArtist,
    ArtistTag,
    CollectionArtist,
    ArtistAdmin,
} from '.'

interface ArtistProperties {
    id: string
    name: string
    slug: string
    url: string
    location?: string
    biography?: string
    profileImageUrl?: string
    createdAt: Date
    collections?: Collection[]
    collectionArtists?: CollectionArtist[]
    tags?: Tag[]
    tracks?: Track[]
    trackArtists?: TrackArtist[]
    artistTags?: ArtistTag[]
    artistAdmins?: ArtistAdmin[]
}

export type Artist = ArtistProperties | undefined | null
