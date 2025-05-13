import type {
    ArtistAdmin,
    ArtistTag,
    Collection,
    CollectionArtist,
    Release,
    Tag,
    Track,
    TrackArtist,
} from '.'

interface ArtistProperties {
    id: number
    name: string
    slug: string
    media_url: string
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
    release?: Release[]
}

export type Artist = ArtistProperties | undefined | null
