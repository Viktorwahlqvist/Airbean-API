import express from "express";
<<<<<<< HEAD
import {
  addItemToCart,
  addToCategories,
  addToMenu,
  deleteCategories,
  deleteMenu,
  getCart,
  getCategories,
  getCold,
  getHot,
  getMenu,
  patchCategories,
  patchMenu,
  putMenu,
} from "../controllers/onlineshopController.js";

export const OnlineShopRouter = express.Router();
// *******************************
// Alla routes för endpoint *menu*
// *******************************

// Route med controller för hämta menyn.
OnlineShopRouter.get("/menu", getMenu);

// Route med controller för att lägga till i menyn.
OnlineShopRouter.post("/menu", addToMenu);

// Route med controller för att ändra en sak eller fler i menyn men inte hela
OnlineShopRouter.patch("/menu/:id", patchMenu);

// Route med controller för att ersätta hela (kaffe sorten) i menyn
OnlineShopRouter.put("/menu/:id", putMenu);

// Route med controller för att ta bort en från menyn med ID
OnlineShopRouter.delete("/menu/:id", deleteMenu);

// *************************************
// Alla routes för endpoint *categories*
// *************************************

// Route med controller för att hämta alla sorter inom en specifik categories -
// Eller visa alla olika categories som finns ?
OnlineShopRouter.get("/categories", getCategories);

// Route med controller för lägga till i categories
OnlineShopRouter.post("/categories", addToCategories);

// Route med controller för ändra en sak eller fler i categories men inte hela.
OnlineShopRouter.patch("/categories/:id", patchCategories);

// Route med controller för att ta bort en kategori
OnlineShopRouter.delete("/categories/:id", deleteCategories);

// *************************************
// Alla routes för endpoint *cold*/*hot*
// *************************************
// Route med controller för hämta alla kalla drycker
OnlineShopRouter.get("/cold", getCold);

// Route med controller för hämta alla varma drycker
OnlineShopRouter.get("/hot", getHot);

// ***********************************
// Alla routes för endpoint Varukorg.
// ***********************************

OnlineShopRouter.get("/cart", getCart);

OnlineShopRouter.post("/cart", addItemToCart);

OnlineShopRouter.put("/cart/:orderId/:itemId");
=======
import { getMenu } from "../controllers/onlineshopController.js";

const router = express.Router();

router.get("/meny", getMenu);

export default router;
>>>>>>> origin
