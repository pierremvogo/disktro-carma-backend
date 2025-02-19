import { Router } from "express";
import { TrackCollectionController } from "../controllers";
const trackCollectionRoute = Router()

  
    // Create new trackCollection
    trackCollectionRoute.post("/create", TrackCollectionController.createTrackCollection);
  
    // Retrieve trackCollection
    trackCollectionRoute.get("/get/:trackId/:collectionId", TrackCollectionController.FindTrackCollection);
  
  export default trackCollectionRoute
  