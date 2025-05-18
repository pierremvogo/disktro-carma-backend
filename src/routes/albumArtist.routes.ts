import { Router } from "express";
import { AlbumArtistController } from "../controllers";
const albumArtistRoute = Router();

// Create new albumArtist
albumArtistRoute.post(
  "/create/:artistId/:albumId",
  AlbumArtistController.createAlbumArtist
);

// Retrieve albumArtist by artistId and albumId
albumArtistRoute.get(
  "/get/:artistId/:albumId",
  AlbumArtistController.FindAlbumArtistByArtistIdAndAlbumId
);

// Retrieve albumArtist by artistId
albumArtistRoute.get(
  "/get/:artistId",
  AlbumArtistController.FindAlbumArtistByArtistId
);

// Retrieve albumArtist by albumId
albumArtistRoute.get(
  "/get/:albumId",
  AlbumArtistController.FindAlbumArtistByAlbumId
);

// Retrieve albumArtist by id
albumArtistRoute.get("/get/:id", AlbumArtistController.FindAlbumArtistById);

export default albumArtistRoute;
