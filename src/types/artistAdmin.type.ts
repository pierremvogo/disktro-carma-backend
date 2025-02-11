interface ArtistAdminProperties {
    id: string
    userId: string
    artistId: string
    createdAt: Date
}

export type ArtistAdmin = ArtistAdminProperties | undefined | null
