import express from "express";

const router = express.Router();

// Render the homepage
router.get("/", (_req, res) => {
  res.render("home", { title: "Home" });
});

export default router;
