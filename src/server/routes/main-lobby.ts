import express from "express";

const router = express.Router();

// Render the main lobby
router.get("/", (_req, res) => {
  res.render("main-lobby", { title: "Main Lobby" });
});

export default router;
