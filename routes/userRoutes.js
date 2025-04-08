import express from "express";
import { addUser, deleteUserById, patchUser, getUsers, getUserById } from "../controllers/userController.js";

const userRoutes = express.Router();

// GET requests med routes
userRoutes.get("/users", getUsers); //Hämta alla användare
userRoutes.get("/users/:id", getUserById) // Hämta en användare med Id

// POST request med routes
userRoutes.post("/users", addUser); //Skapa en användare

// PATCH request med routes


// DELETE request med routes
userRoutes.delete("/users/:id", deleteUserById);

export default userRoutes
