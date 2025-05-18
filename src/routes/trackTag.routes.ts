import { Router } from "express";
import { TrackTagController } from "../controllers";
const trackTagRoute = Router()

  
    // Create new trackTag
    trackTagRoute.post("/create/:tagId/:trackId", TrackTagController.createTrackTag);
  
    // Retrieve trackTag by trackId and tagId
    trackTagRoute.get("/get/:tagId/:trackId", TrackTagController.FindTrackTagByTrackIdAndTagId);

    // Retrieve trackTag by trackId
    trackTagRoute.get("/get/:trackId", TrackTagController.FindTrackTagByTrackId);

    // Retrieve trackTag by tagId
    trackTagRoute.get("/get/:tagId", TrackTagController.FindTrackTagByTagId);

    // Retrieve trackTag by id
    
    trackTagRoute.get("/get/:id", TrackTagController.FindTrackTagById);

  
  export default trackTagRoute
  