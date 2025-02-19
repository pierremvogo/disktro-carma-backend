import { Router } from "express";
import { CollectionArtistController } from "../controllers";
const collectionArtistRoute = Router()

  
    // Create new collectionArtist
    collectionArtistRoute.post("/create", CollectionArtistController.createCollectionArtist);
  
    // Retrieve collectionArtist
    collectionArtistRoute.get("/get/:artistId/:collectionId", CollectionArtistController.FindCollectionArtist);
  
  export default collectionArtistRoute
  