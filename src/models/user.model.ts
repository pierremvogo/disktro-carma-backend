import type { Artist, Album, Tag } from ".";

interface UserProperties {
  id: string;
  email: string;
  name: string;
  type: "user" | "artist";
  password: string;
  artists?: Artist[];
  albums?: Album[];
  tags?: Tag[];
}

export type User = UserProperties | undefined | null;
