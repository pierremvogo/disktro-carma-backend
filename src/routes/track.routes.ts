import { Router } from "express";
import { TrackController } from "../controllers";
const trackRoute = Router()

    // Create a new Track
    trackRoute.post("/create", TrackController.Create)
  
    // Retrieve Track by Id
    trackRoute.get("/getById/:id", TrackController.FindTrackById);
  
    // Retrieve track by artistId
    trackRoute.get("/getByArtist/:artistId", TrackController.FindTracksByArtistId);
  
    // Retrieve Track by collection Id
    trackRoute.get("/getByCollection/:collectionId", TrackController.FindTracksByCollectionId);
 
  export default trackRoute
  