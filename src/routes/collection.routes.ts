import { Router } from "express";
import { CollectionController } from "../controllers";
const collectionRoute = Router()

    // Create a new collection
    collectionRoute.post("/create", CollectionController.createCollection);
  
    // Retrieve collection by Id
    collectionRoute.get("/getById/:id", CollectionController.FindCollectionById);
  
    // Retrieve collection by artist and slug
    collectionRoute.get("/getByArtistAndSlug/:artistId/:slug", CollectionController.FindCollectionByArtistAndSlug);
  
    // Retrieve collection By ArtistId
    collectionRoute.get("/getByArtist/:artistId", CollectionController.FindCollectionsByArtistId);
  
  export default collectionRoute
  