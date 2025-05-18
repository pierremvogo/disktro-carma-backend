import type { Artist, Album } from ".";
interface TrackProperties {
  id: string;
  title: string | null;
  slug: string | null;
  duration: number | null;
  trackAlbums?: TrackAlbum[];
  albums?: Album[];
  artists?: Artist[];
  trackArtists?: TrackArtist[];
}

interface TrackArtistProperties {
  id: string;
  trackId: string;
  artistId: string;
  track?: Track;
  artist?: Artist;
}

interface TrackAlbumProperties {
  id: string;
  albumId: string;
  trackId: string;
  album?: Album;
  track?: Track;
}

export type Track = TrackProperties | undefined | null;
export type TrackArtist = TrackArtistProperties | undefined | null;
export type TrackAlbum = TrackAlbumProperties | undefined | null;
