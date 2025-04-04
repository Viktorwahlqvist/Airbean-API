import express from "express";
import db from "./database/db.js";
import { aboutRouter } from "./routes/aboutRoutes.js";

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/about", aboutRouter);

// Bonus: Tessaan-test 😎
app.get('/api/hej', (req, res) => {
  res.json({ message: 'Hej Tessaan! 🎉 ' });
});

app.listen(PORT, (error) => {
  if (error) {
    return console.log(`Couldn't start server... Error: ${error}`);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});