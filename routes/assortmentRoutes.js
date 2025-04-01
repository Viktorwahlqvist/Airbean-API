import express from "express"; 
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "../controllers/assortmentController.js";



export const assortmentRouter = express.Router(); // Router för sortiment


// GET, hämta
assortmentRouter.get("/", getAllProducts);

// POST, lägg till ny
assortmentRouter.post("/", addProduct);

//PUT

// PATCH, updatera produkt med id
assortmentRouter.patch("/:id", updateProduct);

// DELETE, radera produkt med id
assortmentRouter.delete("/:id", deleteProduct);











