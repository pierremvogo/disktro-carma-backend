import { Router } from "express";
import { ArtistTagController } from "../controllers";
const artistsTagRoute = Router()

  
    // Create a new artistTag
    artistsTagRoute.post("/create/:artistId/:tagId", ArtistTagController.create);
  
    // Retrieve artistTag by artistId and tag Ig
    artistsTagRoute.get("/get/:artistId/:tagId", ArtistTagController.FindArtistTagByArtistIdAndTagId);

    // Retrieve artistTag by artistId
    artistsTagRoute.get("/get/:artistId", ArtistTagController.FindArtistTagByArtistId);

    // Retrieve artistTag by tagId
    artistsTagRoute.get("/get/:tagId", ArtistTagController.FindArtistTagBytagId);

    
    // Retrieve artistTag by id
    artistsTagRoute.get("/get/:id", ArtistTagController.FindArtistTagById);
    
  
  export default artistsTagRoute
  