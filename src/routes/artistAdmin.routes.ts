import { Router } from "express";
import { ArtistAdminController } from "../controllers";
const artistAdminRoute = Router()

  
    // Create new artistAdmin
    artistAdminRoute.post("/create/:adminId/:artistId", ArtistAdminController.createArtistAdmin);
  
    // Retrieve artistAdmin by userId and artistId
    artistAdminRoute.get("/get/:userId/:artistId", ArtistAdminController.FindArtistAdminByUserIdAndArtistId);

    // Retrieve artistAdmin by userId
    artistAdminRoute.get("/get/:userId", ArtistAdminController.FindArtistAdminByUserId);

    // Retrieve artistAdmin by artistId
    artistAdminRoute.get("/get/:artistId", ArtistAdminController.FindArtistAdminByArtistId);

    // Retrieve artistAdmin by id
    artistAdminRoute.get("/get/:id", ArtistAdminController.FindArtistAdminById);
    
  
  export default artistAdminRoute
  