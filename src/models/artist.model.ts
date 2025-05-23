import type {
  ArtistAdmin,
  ArtistTag,
  Album,
  AlbumArtist,
  Release,
  Tag,
  Track,
  TrackArtist,
} from ".";

interface ArtistProperties {
  id: string;
  name: string | null;
  slug: string | null;
  media_url: string | null;
  location?: string | null;
  biography?: string | null;
  profileImageUrl?: string | null;
  createdAt: Date;
  albums?: Album[];
  albumArtists?: AlbumArtist[];
  tags?: Tag[];
  tracks?: Track[];
  trackArtists?: TrackArtist[];
  artistTags?: ArtistTag[];
  artistAdmins?: ArtistAdmin[];
  release?: Release[];
}

export type Artist = ArtistProperties | undefined | null;
