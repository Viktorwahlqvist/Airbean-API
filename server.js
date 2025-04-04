import requestId from "./middlewares/requestId.js";
import express from "express";
import db from "./database/db.js";
import { aboutRouter } from "./routes/aboutRoutes.js";

// Initiera appen
const app = express();
const PORT = 3000;

app.use("/about", aboutRouter);

// Bonus: Tessaan-test 😎
app.get('/api/hej', (req, res) => {
  res.json({ message: 'Hej Tessaan! 🎉 ' });
});

// Starta servern
app.listen(PORT, () => {
  console.log(`✅ Servern körs på http://localhost:${PORT}`);
});

