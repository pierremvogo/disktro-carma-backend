import { Router } from "express";
import { CollectionTagController } from "../controllers";
const collectionTagRoute = Router()

  
    // Create new collectionTag
    collectionTagRoute.post("/create/:tagId/:collectionId", CollectionTagController.createCollectionTag);
  
    // Retrieve collectionTag by collectionId and TagId
    collectionTagRoute.get("/get/:tagId/:collectionId", CollectionTagController.FindCollectionTagByCollectionIdAndTagId);

    // Retrieve collectionTag by collectionId
    collectionTagRoute.get("/get/collectionId", CollectionTagController.FindCollectionTagByCollectionId);

    
    // Retrieve collectionTag by tagId
    collectionTagRoute.get("/get/tagId", CollectionTagController.FindCollectionTagByTagId);

    // Retrieve collectionTag by Id
    collectionTagRoute.get("/get/id", CollectionTagController.FindCollectionTagById);
  
  export default collectionTagRoute
  