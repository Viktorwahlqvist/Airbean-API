import express from "express";
import db from "./database/db.js";
import userRoutes from "./routes/userRoutes.js"

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/api", userRoutes);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(`Couldn't start server... Error: ${error}`);
  }
  console.log(`Server is running on http://localhost:${PORT}`);

});

app.get("/", (req,res) => {
  res.send("Välkommen till AIRBEAN-API")
});
