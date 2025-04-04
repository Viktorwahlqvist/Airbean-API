// routes/aboutRoutes.js

import express from "express";
const router = express.Router();

// exempelkod – byt till riktig route ?
router.get("/", (req, res) => {
  res.send("Om oss 🤓");
});

export default router; // <-- viktigt!
