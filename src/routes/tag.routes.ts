import { Router } from "express";
import { TagController } from "../controllers";
import { SlugMiddleware } from "../middleware/slug.middleware";
import { db } from "../db/db";
import { tags } from "../db/schema";
const tagRoute = Router();

// Create a new Tag
tagRoute.post(
  "/create",
  SlugMiddleware(db.query.tags, tags.slug),
  TagController.Create
);

// Retrieve Tag by Id
tagRoute.get("/getById/:id", TagController.FindTagById);

// Retrieve tag by slug
tagRoute.get("/getBySlug/:slug", TagController.FindTagBySlug);

// Retrieve Tag Artist
tagRoute.get("/getByArtist/:tagId", TagController.FindTagArtists);

// Retrieve Tag Album
tagRoute.get("/getByTag/:tagId", TagController.FindTagAlbums);

export default tagRoute;
