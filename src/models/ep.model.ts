import type { Artist, EpTag, Tag, Track, TrackEp } from "./index";

interface EpProperties {
  id: string;
  title: string;
  slug: string;
  duration: number | null;
  coverUrl: string;
  tracks?: Track[];
  artists?: Artist[];
  tags?: Tag[];
  epArtists?: EpArtist[];
  epTags?: EpTag[];
  trackEps?: TrackEp[];
}

export type Ep = EpProperties | undefined | null;

interface EpArtistProperties {
  id: string;
  epId: string;
  artistId?: string;
  ep?: Ep;
  artist?: Artist;
}

export type EpArtist = EpArtistProperties | undefined | null;
