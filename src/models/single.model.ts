import type { Artist, SingleTag, Tag, Track, TrackSingle } from "./index";

interface SingleProperties {
  id: string;
  title: string;
  slug: string;
  duration: number | null;
  coverUrl: string;
  coverFileName: string;
  audioFileName: string;
  tracks?: Track[];
  artists?: Artist[];
  tags?: Tag[];
  singleArtists?: SingleArtist[];
  singleTags?: SingleTag[];
  trackSingles?: TrackSingle[];
}

export type Single = SingleProperties | undefined | null;

interface SingleArtistProperties {
  id: string;
  singleId: string;
  artistId?: string;
  single?: Single;
  artist?: Artist;
}

export type SingleArtist = SingleArtistProperties | undefined | null;
