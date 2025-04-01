import express from "express";
import db from "./database/db.js";
import { OnlineShopRouter } from "./routes/onlineshopRoutes.js";

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/onlineshop", OnlineShopRouter);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(`Couldn't start server...
      Error: ${error}`);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
