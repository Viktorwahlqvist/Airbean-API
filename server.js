import requestId from "./middlewares/requestId.js";
import express from "express";
import cors from "cors"; // om vi behöver det??
import onlineshopRoutes from "./routes/onlineshopRoutes.js";
import assortmentRoutes from "./routes/assortmentRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Initiera appen
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(requestId);


// Routes
app.use("/onlineshop", onlineshopRoutes);
app.use("/sortiment", assortmentRoutes);
app.use("/about", aboutRoutes);
app.use("/users", userRoutes);
