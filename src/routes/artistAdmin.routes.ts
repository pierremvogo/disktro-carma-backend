import { Router } from "express";
import { ArtistAdminController } from "../controllers";
const artistAdminRoute = Router()

  
    // Create new artistAdmin
    artistAdminRoute.post("/create", ArtistAdminController.createArtistAdmin);
  
    // Retrieve artistAdmin
    artistAdminRoute.get("/get/:artistId/:userId", ArtistAdminController.getArtistAdmin);
  
  export default artistAdminRoute
  