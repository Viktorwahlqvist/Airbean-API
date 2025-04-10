import express from "express";
import { addUser, deleteUserById, patchUser, getUsers, getUserById, guestUser } from "../controllers/userController.js";
import { userValidation } from "../middlewares/validation.js"

const userRoutes = express.Router();

// GET requests med routes
userRoutes.get("/users", getUsers); //Hämta alla användare
userRoutes.get("/guest", guestUser); // Hämta gäst

// POST request med routes
userRoutes.post("/users/add", addUser); //Skapa en användare
userRoutes.post("/users", userValidation, getUserById); // Hämta en användare med Id

// PATCH request med routes
userRoutes.patch("/users", userValidation, patchUser);

// DELETE request med routes
userRoutes.delete("/users", userValidation, deleteUserById);

export default userRoutes
