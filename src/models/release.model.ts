import type { Artist } from ".";

interface ReleaseProperties {
  id: string;
  title: string;
  releaseDate: string;
  description: string;
  covertArt: string;
  label: string;
  releaseType: string;
  format: string;
  upcCode: string;
  artist?: Artist;
}

export type Release = ReleaseProperties | undefined | null;
