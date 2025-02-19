import { Router } from "express";
import { ReleaseController } from "../controllers";
const releaseRoute = Router()

  
    // Create a new artist
    releaseRoute.post("/create", ReleaseController.createRelease);
  
    releaseRoute.get("/getById/:id", ReleaseController.FindReleaseById);
  
  export default releaseRoute
  