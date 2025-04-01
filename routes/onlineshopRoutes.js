import express from "express";
import {
  addToCategories,
  addToMenu,
  deleteCategories,
  deleteMenu,
  getCategories,
  getCold,
  getHot,
  getMenu,
  patchCategories,
  patchMenu,
  putCategories,
  putMenu,
} from "../controllers/onlineshopController.js";

export const OnlineShopRouter = express.Router();

// Alla routes för endpoint *menu*

// Route med controller för hämta menyn.
OnlineShopRouter.get("/menu", getMenu);

// Route med controller för att lägga till i menyn.
OnlineShopRouter.post("/menu", addToMenu);

// Route med controller för att ändra en sak eller fler i menyn men inte hela
OnlineShopRouter.patch("/menu", patchMenu);

// Route med controller för att ersätta hela (kaffe sorten) i menyn
OnlineShopRouter.put("/menu", putMenu);

// Route med controller för att ta bort en från menyn med ID
OnlineShopRouter.delete("/menu/:id", deleteMenu);

// Alla routes för endpoint *categories*

// Route med controller för att hämta alla sorter inom en specifik categories -
// Eller visa alla olika categories som finns ?
OnlineShopRouter.get("/categories", getCategories);

// Route med controller för lägga till i categories
OnlineShopRouter.post("/categories", addToCategories);

// Route med controller för ändra en sak eller fler i categories men inte hela.
OnlineShopRouter.patch("/categories", patchCategories);

// Route med controller för att ersätta hela categories (en men hela resursen.)
OnlineShopRouter.put("/categories", putCategories);

// Route med controller för att ta bort en kategori
OnlineShopRouter.delete("/categories/:id", deleteCategories);

// Alla routes för endpoint *cold*

// Route med controller för hämta alla kalla drycker
OnlineShopRouter.get("/cold", getCold);

// Alla route sför endpoint *hot*
OnlineShopRouter.get("/hot", getHot);
