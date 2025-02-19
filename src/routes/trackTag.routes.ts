import { Router } from "express";
import { TrackTagController } from "../controllers";
const trackTagRoute = Router()

  
    // Create new trackTag
    trackTagRoute.post("/create", TrackTagController.createTrackTag);
  
    // Retrieve trackTag
    trackTagRoute.get("/get/:trackId/:collectionId", TrackTagController.FindTrackTag);
  
  export default trackTagRoute
  