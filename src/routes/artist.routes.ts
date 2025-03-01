import { Router } from "express";
import { ArtistController } from "../controllers";
const artistsRoute = Router()

  
    // Create a new artist
    artistsRoute.post("/create", ArtistController.CreateArtist);
  
    // Retrieve all artists
    artistsRoute.get("/get", ArtistController.FindAllArtists);
  
    // Retrieve a single artist with id
    artistsRoute.get("/getById/:id", ArtistController.FindArtistById);
  
    // Retrieve artist by slug
    artistsRoute.get("/getBySlug/:slug", ArtistController.FindArtistBySlug);
  
    // Retrieve artistAdmin By UserId
    artistsRoute.get("/getAdmin/:userId", ArtistController.FindArtistsAdminedByUser);
  
    // Retrieve artist By UserEmail
    artistsRoute.get("/getByUserEmail/:userEmail", ArtistController.FindArtistsByUserEmail);

    // Retrieve artist with Tag
    artistsRoute.get("/getWithTag/:tagId", ArtistController.FindArtistsAdminedByUser);
  
  export default artistsRoute
  