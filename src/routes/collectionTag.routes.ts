import { Router } from "express";
import { CollectionTagController } from "../controllers";
const collectionTagRoute = Router()

  
    // Create new collectionTag
    collectionTagRoute.post("/create", CollectionTagController.createCollectionTag);
  
    // Retrieve collectionTag
    collectionTagRoute.get("/get/:artistId/:collectionId", CollectionTagController.FindCollectionTag);
  
  export default collectionTagRoute
  