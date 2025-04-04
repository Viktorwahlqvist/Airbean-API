import express from "express";
const router = express.Router();

// Importera middleware
import { idValidation } from "../middlewares/validation.js";

// (Exempel) importera din controller
import { getUserById, deleteUser } from "../controllers/userController.js";

// En route som hämtar en användare med ID
router.get("/users/:id", idValidation, getUserById);

// En route som tar bort en användare med ID
router.delete("/users/:id", idValidation, deleteUser);

// Testroute
router.get("/", (req, res) => {
  res.send("User-routes funkar!");
});

export default router;
