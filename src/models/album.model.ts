import type { Artist, AlbumTag, Tag, Track, TrackAlbum } from "./index";

interface AlbumProperties {
  id: string;
  title: string;
  slug: string;
  duration: number | null;
  coverUrl: string;
  tracks?: Track[];
  artists?: Artist[];
  tags?: Tag[];
  albumArtists?: AlbumArtist[];
  albumTags?: AlbumTag[];
  trackAlbums?: TrackAlbum[];
}

export type Album = AlbumProperties | undefined | null;

interface AlbumArtistProperties {
  id: string;
  albumId: string;
  artistId?: string;
  album?: Album;
  artist?: Artist;
}

export type AlbumArtist = AlbumArtistProperties | undefined | null;
