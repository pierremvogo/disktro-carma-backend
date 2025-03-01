import { Router } from "express";
import { ArtistAdminController } from "../controllers";
const artistAdminRoute = Router()

  
    // Create new artistAdmin
    artistAdminRoute.post("/create/:adminId/:artistId", ArtistAdminController.createArtistAdmin);
  
    // Retrieve artistAdmin
    artistAdminRoute.get("/get/:userId/:artistId", ArtistAdminController.getArtistAdmin);
  
  export default artistAdminRoute
  