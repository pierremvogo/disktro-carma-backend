import { type User } from ".";
import { UserResponse } from "./user.model";

export type LoginFormResponse = {
  email: string;
  token: string;
  error: boolean;
  message: string;
};

export type LoginUserResponse = {
  user: UserResponse;
  token: string;
  error: boolean;
  message: string;
};

export type UserSession = {
  id: string;
  user: User;
  expires: string;
};
