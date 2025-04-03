import express from "express";
import { addUser, deleteUser, patchUser, getUsers, getUser } from "../controllers/userController.js";

const userRoutes = express.Router();

// GET requests med routes

userRoutes.get("/user:id", getUser); //Hämta specifik användare
userRoutes.get("/users", getUsers); //Hämta alla användare

// POST request med routes
userRoutes.post("/users", addUser); //Skapa en användare

// PATCH request med routes


export default userRoutes