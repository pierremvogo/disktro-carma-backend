import { Router } from "express";
import { UserController } from "../controllers";
const usersRoute = Router()

  
    // Create a new user
    usersRoute.post("/create", UserController.CreateUser);
  
    // Retrieve all users
    usersRoute.get("/get", UserController.FindAllUser);
  
    // Retrieve a single users with id
    usersRoute.get("/getById/:id", UserController.FindUserById);

    // Retrieve user By Email
    usersRoute.get("/getByEmail/:email", UserController.FindUserByEmail);
  
    // Login User
    usersRoute.post("/login", UserController.LoginUser);
  
  export default usersRoute
  