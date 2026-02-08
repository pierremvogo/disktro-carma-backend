import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../models";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const AuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }
  jwt.verify(token, process.env.JWT_PRIVATE_KEY!, (err: any, decoded: any) => {
    if (err) {
      console.log(err);
      res.status(403).json({ message: "Invalid token." });
      return;
    }
    req.user = decoded as User;
    next();
  });
};
