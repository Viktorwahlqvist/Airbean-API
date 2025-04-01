import express from "express";
const router = express.Router();

// Exempelroute
router.get("/", (req, res) => {
  res.send("Assortment works!");
});

export default router;
