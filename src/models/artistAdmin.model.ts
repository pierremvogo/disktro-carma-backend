interface ArtistAdminProperties {
  id: string;
  userId: bigint;
  artistId: bigint;
  createdAt: Date;
}

export type ArtistAdmin = ArtistAdminProperties | undefined | null;
