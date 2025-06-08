import type { Artist } from ".";

interface ReleaseProperties {
  id: string;
  title: string;
  releaseDate: string;
  description: string;
  covertArt: string;
  label: string;
  releaseType: string;
  MessageId: string;
  format: string;
  upcCode: string;
  artist?: Artist;
}

export type Track = {
  isrcCode: string;
  title: string;
  duration: string;
};

export type ReleaseData = {
  title: string;
  releaseDate: string;
  upcCode: string;
  artist: string;
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
