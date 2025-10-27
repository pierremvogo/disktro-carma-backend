import type { Artist, Album, Tag } from ".";

interface UserProperties {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  surname: string;
  profileImageUrl: string;
  type: "user" | "artist";
  password: string;
  artists?: Artist[];
  albums?: Album[];
  tags?: Tag[];
  isSubscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserResponseProperties {
  id: string;
  email: string;
  name: string;
  surname: string;
  type: "user" | "artist";
}

export type User = UserProperties | undefined | null;
export type UserResponse = UserResponseProperties | undefined | null;
