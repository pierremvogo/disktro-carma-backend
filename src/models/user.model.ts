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

interface UserResponseProperties {
  id: string;
  email: string;
  name: string;
  type: "user" | "artist";
}

export type User = UserProperties | undefined | null;
export type UserResponse = UserResponseProperties | undefined | null;
