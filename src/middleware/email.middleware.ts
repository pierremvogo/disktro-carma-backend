import { Request, Response, NextFunction, RequestHandler } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/db";
import * as schema from "../db/schema";

export const EmailMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (existingUser) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    next(); // passe au middleware suivant si pas de doublon
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
