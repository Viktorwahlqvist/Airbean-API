import express from "express";
import { addUser, deleteUser, patchUser, postUser, getUsers, getUser } from "../controllers/userController";

export const userRoute = express.Router();


userRoute.get("/user", getUser);

userRoute.post("/user", addUser);

userRoute.get("/users", getUsers);


