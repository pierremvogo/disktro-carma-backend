import { Router } from "express";
import { TrackArtistController } from "../controllers";
const trackArtistRoute = Router()

  
    // Create new trackArtist
    trackArtistRoute.post("/create/:artistId/:trackId", TrackArtistController.createTrackArtist);
  
    // Retrieve trackArtist by artistId and trackId
    trackArtistRoute.get("/get/:artistId/:trackId", TrackArtistController.FindTrackArtistByTrackIdAndArtistId);

    // Retrieve trackArtist by artistId
    trackArtistRoute.get("/get/:artistId", TrackArtistController.FindTrackArtistByArtistId);

    // Retrieve trackArtist by trackId
    trackArtistRoute.get("/get/:trackId", TrackArtistController.FindTrackArtistByTrackId);

     // Retrieve trackArtist by id
     trackArtistRoute.get("/get/:id", TrackArtistController.FindTrackArtistById);
  
  export default trackArtistRoute
  