import express from "express";

const router = express.Router();

// Render the games page
router.get("/", (_req, res) => {
  res.render("games", { title: "Games" });
});

export default router;
