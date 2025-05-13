interface ArtistAdminProperties {
    id: bigint
    userId: bigint
    artistId: bigint
    createdAt: Date
}

export type ArtistAdmin = ArtistAdminProperties | undefined | null
