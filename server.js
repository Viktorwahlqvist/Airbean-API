import express from "express";
import db from "./database/db.js";
import { OnlineShopRouter } from "./routes/onlineshopRoutes.js";
import { aboutRouter } from "./routes/aboutRoutes.js";

// Initiera appen
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/about", aboutRouter);

// Bonus: Tessaan-Test 😎
app.get("/api/hej", (req, res) => {
  res.json({ message: "Hej Tessaan! 🎉 " });
});

app.use("/onlineshop", OnlineShopRouter);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(`Couldn't start server... Error: ${error}`);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
