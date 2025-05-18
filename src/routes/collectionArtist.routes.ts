import { Router } from "express";
import { CollectionArtistController } from "../controllers";
const collectionArtistRoute = Router()

  
    // Create new collectionArtist
    collectionArtistRoute.post("/create/:artistId/:collectionId", CollectionArtistController.createCollectionArtist);
  
    // Retrieve collectionArtist by artistId and collectionId
    collectionArtistRoute.get("/get/:artistId/:collectionId", CollectionArtistController.FindCollectionArtistByArtistIdAndCollectionId);

    // Retrieve collectionArtist by artistId
    collectionArtistRoute.get("/get/:artistId", CollectionArtistController.FindCollectionArtistByArtistId);

    // Retrieve collectionArtist by collectionId
    collectionArtistRoute.get("/get/:collectionId", CollectionArtistController.FindCollectionArtistBycollectionId);

    // Retrieve collectionArtist by id
    collectionArtistRoute.get("/get/:id", CollectionArtistController.FindCollectionArtistById);
  
  export default collectionArtistRoute
  