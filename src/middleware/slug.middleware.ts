import { Request, Response, NextFunction, RequestHandler } from "express";
import { eq } from "drizzle-orm";

export const SlugMiddleware = (
  queryBuilder: any,
  slugColumn: any
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.body;

      if (!slug) {
        res.status(400).json({ message: "Slug is required." });
        return;
      }

      const existingSlug = await queryBuilder.findFirst({
        where: eq(slugColumn, slug),
      });

      if (existingSlug) {
        res.status(409).json({ message: "Slug already exists." });
        return;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
      return;
    }
  };
};
