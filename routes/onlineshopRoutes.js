import express from "express";
import {
  addItemToCart,
  addToCategories,
  addToMenu,
  deleteCategories,
  deleteItemFromCart,
  deleteMenu,
  getCart,
  getCategories,
  postCheckout,
  getCold,
  getHot,
  getMenu,
  patchCategories,
  patchItemInCart,
  patchMenu,
  putMenu,
  getDelivery,
} from "../controllers/onlineshopController.js";
import {
  categoriesValidation,
  idValidation,
  itemValidation,
  userValidation,
} from "../middlewares/validation.js";

export const OnlineShopRouter = express.Router();
// *******************************
// Alla routes för endpoint *menu*
// *******************************

// Route med controller för hämta menyn.
OnlineShopRouter.get("/menu", getMenu);

// Route med controller för att lägga till i menyn.
OnlineShopRouter.post("/menu", itemValidation, addToMenu);

// Route med controller för att ändra en sak eller fler i menyn men inte hela
OnlineShopRouter.patch("/menu/:id", idValidation, patchMenu);

// Route med controller för att ersätta hela (kaffe sorten) i menyn
OnlineShopRouter.put("/menu/:id", idValidation, itemValidation, putMenu);

// Route med controller för att ta bort en från menyn med ID
OnlineShopRouter.delete("/menu/:id", idValidation, deleteMenu);

// *************************************
// Alla routes för endpoint *categories*
// *************************************

// Route med controller för att hämta alla sorter inom en specifik categories -
// Eller visa alla olika categories som finns ?
OnlineShopRouter.get("/categories", getCategories);

// Route med controller för lägga till i categories
OnlineShopRouter.post("/categories", categoriesValidation, addToCategories);

// Route med controller för ändra en sak eller fler i categories men inte hela.
OnlineShopRouter.patch(
  "/categories/:id",
  idValidation,
  categoriesValidation,
  patchCategories
);

// Route med controller för att ta bort en kategori
OnlineShopRouter.delete("/categories/:id", idValidation, deleteCategories);

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

OnlineShopRouter.post("/checkcart", userValidation, getCart);

OnlineShopRouter.post("/cart", addItemToCart);

OnlineShopRouter.patch("/cart/:orderId/:itemsId", patchItemInCart);

// Ta bort en vara från order
OnlineShopRouter.delete("/cart/:itemId", deleteItemFromCart);

OnlineShopRouter.post("/checkout", userValidation, postCheckout);

OnlineShopRouter.post("/delivery", userValidation, getDelivery);
