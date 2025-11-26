import type { Artist, Album, Track, Ep, Single } from ".";

interface TagProperties {
  id: string;
  name: string;
  slug: string | null;
  albums?: Album[];
  artists?: Artist[];
  tracks?: Track[];
  albumTags?: AlbumTag[];
  artistTags?: ArtistTag[];
  trackTags?: TrackTag[];
}
interface ArtistTagProperties {
  id: string;
  artistId: string;
  tagId: string;
  tag?: Tag;
  artist?: Artist;
}

interface AlbumTagProperties {
  id: string;
  albumId: string;
  tagId: string;
  tag?: Tag;
  album?: Album;
}

interface EpTagProperties {
  id: string;
  epId: string;
  tagId: string;
  tag?: Tag;
  ep?: Ep;
}

interface SingleTagProperties {
  id: string;
  singleId: string;
  tagId: string;
  tag?: Tag;
  single?: Single;
}

interface TrackTagProperties {
  id: string;
  trackId: string;
  tagId: string;
  track?: Track;
  tag?: Tag;
}

export type Tag = TagProperties | undefined | null;
export type ArtistTag = ArtistTagProperties | undefined | null;
export type AlbumTag = AlbumTagProperties | undefined | null;
export type TrackTag = TrackTagProperties | undefined | null;
export type EpTag = EpTagProperties | undefined | null;
export type SingleTag = SingleTagProperties | undefined | null;
