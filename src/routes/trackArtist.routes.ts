import { Router } from "express";
import { TrackArtistController } from "../controllers";
const trackArtistRoute = Router()

  
    // Create new trackArtist
    trackArtistRoute.post("/create", TrackArtistController.createTrackArtist);
  
    // Retrieve trackArtist
    trackArtistRoute.get("/get/:artistId/:collectionId", TrackArtistController.FindTrackArtist);
  
  export default trackArtistRoute
  