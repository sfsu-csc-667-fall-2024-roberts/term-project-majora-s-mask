import express from "express";
const router = express.Router();

router.get("/", (_request, response) => {
  response.render("root", { title: "Ayesha site" });
});
router.post("/", (request, response) => {
  response.send("Hello world");
});
export default router;
