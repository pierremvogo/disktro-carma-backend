import { Router } from "express";
import { TagController } from "../controllers";
const tagRoute = Router()

  
    // Create a new Tag
    tagRoute.post("/create", TagController.Create);
  
    // Retrieve Tag by Id
    tagRoute.get("/getById/:id", TagController.FindTagById);
  
    // Retrieve tag by slug
    tagRoute.get("/getBySlug/:slug", TagController.FindTagBySlug);
  
    // Retrieve Tag Artist
    tagRoute.get("/getByArtist/:tagId", TagController.FindTagArtists);
  
    // Retrieve Tag Collection
    tagRoute.get("/getByTag/:tagId", TagController.FindTagCollections);
 
  export default tagRoute
  