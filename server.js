import express from "express";
import db from "./database/db.js";
import { assortmentRouter } from "./routes/assortmentRoutes.js";

const PORT = 3000;
const app = express();
app.use(express.json());

<<<<<<< HEAD
app.use("/assortment", assortmentRouter);
=======
// Bonus: Tessaan-test 😎
app.get('/api/hej', (req, res) => {
  res.json({ message: 'Hej Tessaan! 🎉 ' });
});
>>>>>>> main

app.listen(PORT, (error) => {
  if (error) {
    return console.log(`Couldn't start server... Error: ${error}`);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});