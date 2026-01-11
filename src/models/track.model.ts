import type { Release, Album, Ep, Single } from ".";
interface TrackProperties {
  id?: string;

  // IDENTIFICATION
  isrcCode: string | null;
  title: string | null;
  slug: string | null;

  // METADATA
  duration: number | null;
  type: string; // single, album, ep, etc.
  moodId: string;
  userId?: string | null;

  // AUDIO
  audioUrl: string;
  audioFileName: string;
  signLanguageFileName: string;
  brailleFileName: string;
  lyrics?: string | null;
  signLanguageVideoUrl?: string | null;
  brailleFileUrl?: string | null;

  // RELATIONS
  trackAlbums?: TrackAlbum[];
  albums?: Album[];
  trackReleases?: TrackRelease[];
  releases?: Release[];
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

interface TrackEpProperties {
  id: string;
  epId: string;
  trackId: string;
  ep?: Ep;
  track?: Track;
}

interface TrackSingleProperties {
  id: string;
  singleId: string;
  trackId: string;
  single?: Single;
  track?: Track;
}

export type Track = TrackProperties | undefined | null;
export type TrackRelease = TrackReleaseProperties | undefined | null;
export type TrackAlbum = TrackAlbumProperties | undefined | null;
export type TrackEp = TrackEpProperties | undefined | null;
export type TrackSingle = TrackSingleProperties | undefined | null;
