import express from "express";
import db from "./database/db.js";
<<<<<<< HEAD
import { OnlineShopRouter } from "./routes/onlineshopRoutes.js";
=======
import { assortmentRouter } from "./routes/assortmentRoutes.js";
import userRoutes from "./routes/userRoutes.js"
>>>>>>> origin
import { aboutRouter } from "./routes/aboutRoutes.js";

// Initiera appen
const app = express();
const PORT = 3000;

<<<<<<< HEAD
app.use(express.json());
app.use("/about", aboutRouter);
=======
app.use("/assortment", assortmentRouter);
>>>>>>> origin

// Bonus: Tessaan-Test 😎
app.get("/api/hej", (req, res) => {
  res.json({ message: "Hej Tessaan! 🎉 " });
});
app.use("/about", aboutRouter);

app.use("/api", userRoutes);

app.use("/onlineshop", OnlineShopRouter);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(`Couldn't start server... Error: ${error}`);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
<<<<<<< HEAD
=======

});

app.get("/", (req,res) => {
  res.send("Välkommen till AIRBEAN-API")
>>>>>>> origin
});
