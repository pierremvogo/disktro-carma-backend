import type { Release, Album } from ".";
interface TrackProperties {
  id?: string;
  isrcCode: string | null;
  title: string | null;
  slug: string | null;
  duration: number | null;
  trackAlbums?: TrackAlbum[];
  albums?: Album[];
  releases?: Release[];
  trackReleases?: TrackRelease[];
}
interface TrackReleaseProperties {
  id: string;
  trackId: string;
  releaseId: string;
  track?: Track;
  release?: Release;
}
interface TrackAlbumProperties {
  id: string;
  albumId: string;
  trackId: string;
  album?: Album;
  track?: Track;
}

export type Track = TrackProperties | undefined | null;
export type TrackRelease = TrackReleaseProperties | undefined | null;
export type TrackAlbum = TrackAlbumProperties | undefined | null;
