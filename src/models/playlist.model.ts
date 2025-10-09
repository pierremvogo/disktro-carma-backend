import type { Track } from ".";

interface PlaylistProperties {
  id: string;
  nom: string;
  slug: string;
  userId: string;
  tracks?: Track[];
  trackPlayLists?: TrackPlaylistProperties[];
  createdAt: Date;
  updatedAt: Date;
}

interface TrackPlaylistProperties {
  id: string;
  trackId: string;
  playlistId: string;
  track?: Track;
  playlist?: Playlists;
}

export type Playlists = PlaylistProperties | undefined | null;
export type TrackPlaylist = TrackPlaylistProperties | undefined | null;
