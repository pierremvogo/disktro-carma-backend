import { Router } from "express";
import { TrackCollectionController } from "../controllers";
const trackCollectionRoute = Router()

  
    // Create new trackCollection
    trackCollectionRoute.post("/create/:collectionId/:trackId", TrackCollectionController.createTrackCollection);
  
    // Retrieve trackCollection by trackId and collectionId
    trackCollectionRoute.get("/get/:collectionId/:trackId", TrackCollectionController.FindTrackCollectionByTrackIdAndCollectionId);

    // Retrieve trackCollection by trackId
    trackCollectionRoute.get("/get/:trackId", TrackCollectionController.FindTrackCollectionByTrackId);

    // Retrieve trackCollection by collectionId
    trackCollectionRoute.get("/get/:collectionId", TrackCollectionController.FindTrackCollectionByCollectionId);

    // Retrieve trackCollection by id
    trackCollectionRoute.get("/get/:id", TrackCollectionController.FindTrackCollectionById);
  
  export default trackCollectionRoute
  