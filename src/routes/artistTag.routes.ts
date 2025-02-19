import { Router } from "express";
import { ArtistTagController } from "../controllers";
const artistsTagRoute = Router()

  
    // Create a new artistTag
    artistsTagRoute.post("/create", ArtistTagController.createArtistTag);
  
    // Retrieve artistTag
    artistsTagRoute.get("/get/:artistId/:tagId", ArtistTagController.getArtistTag);
  
  export default artistsTagRoute
  