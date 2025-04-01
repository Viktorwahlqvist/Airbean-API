import express from "express";
import { getMenu } from "../controllers/onlineshopController.js";

const router = express.Router();

router.get("/meny", getMenu);

export default router;
