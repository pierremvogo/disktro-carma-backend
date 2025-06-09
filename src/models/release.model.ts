import type { Artist, Track, TrackRelease } from ".";

interface ReleaseProperties {
  id: string;
  title: string;
  releaseDate?: string | null;
  description?: string | null;
  covertArt?: string;
  label: string;
  releaseType?: string | null;
  MessageId?: string | null;
  format?: string | null;
  upcCode?: string | null;
  artist?: Artist;
  tracks?: Track[];
  trackReleases?: TrackRelease[];
}

export type ReleaseData = {
  artistId: string;
  artistName: string;
  title: string;
  releaseDate: string;
  description?: string | null;
  covertArt?: string;
  label: string;
  releaseType?: string | null;
  MessageId?: string | null;
  format?: string | null;
  upcCode: string;
  artist: Artist;
  tracks: Track[];
};

export type SalesReport = {
  period: string;
  totalSales: number;
  totalStreams: number;
  details: {
    trackTitle: string;
    unitsSold: number;
    streams: number;
    revenue: number;
  }[];
};

export type Release = ReleaseProperties | undefined | null;
