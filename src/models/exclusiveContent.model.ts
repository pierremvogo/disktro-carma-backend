import type { User } from ".";

interface ExclusiveContentProperties {
  id?: string;

  // OWNER
  artistId: string;

  // METADATA
  type: string; // "music" | "video" | "photo" | "document"
  title: string;
  description?: string | null;

  // FILE
  fileUrl: string;

  // DATES
  createdAt?: Date | string | null;
}

interface ExclusiveContentRelations {
  // RELATIONS
  artist?: User;
}

export type ExclusiveContent =
  | (ExclusiveContentProperties & ExclusiveContentRelations)
  | undefined
  | null;
