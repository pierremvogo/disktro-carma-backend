import { Router } from "express";
import { AlbumTagController } from "../controllers";
const albumTagRoute = Router();

// Create new albumTag
albumTagRoute.post(
  "/create/:tagId/:albumId",
  AlbumTagController.createAlbumTag
);

// Retrieve albumTag by albumId and TagId
albumTagRoute.get(
  "/get/:tagId/:albumId",
  AlbumTagController.FindAlbumTagByAlbumIdAndTagId
);

// Retrieve albumTag by albumId
albumTagRoute.get("/get/albumId", AlbumTagController.FindAlbumTagByAlbumId);

// Retrieve albumTag by tagId
albumTagRoute.get("/get/tagId", AlbumTagController.FindAlbumTagByTagId);

// Retrieve albumTag by Id
albumTagRoute.get("/get/id", AlbumTagController.FindAlbumTagById);

export default albumTagRoute;
