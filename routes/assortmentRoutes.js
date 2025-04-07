import express from "express";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  replaceProduct,
  getSortedItems,
} from "../controllers/assortmentController.js";

export const assortmentRouter = express.Router(); // Router för sortiment

// GET, hämta
assortmentRouter.get("/", getAllProducts);

// GET, sortera
assortmentRouter.get("/sorted", getSortedItems);

// POST, lägg till ny
assortmentRouter.post("/", addProduct);

//PUT
assortmentRouter.put("/:id", replaceProduct);

// PATCH, updatera produkt med id
assortmentRouter.patch("/:id", updateProduct);

// DELETE, radera produkt med id
assortmentRouter.delete("/:id", deleteProduct);
