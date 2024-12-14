import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../config/db"; // Knex instance for database connection

const router = express.Router();

// Render the registration form
router.get("/register", (_req: Request, res: Response) => {
  res.render("auth/register", { title: "Register" });
});

// Handle registration form submission
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await db("users")
      .where("username", username)
      .orWhere("email", email)
      .first();

    if (existingUser) {
      return res.status(400).render("auth/register", {
        title: "Register",
        error: "Username or email already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db("users").insert({
      username,
      email,
      password: hashedPassword,
    });

    res.redirect("/auth/login");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).render("auth/register", {
      title: "Register",
      error: "An error occurred during registration. Please try again.",
    });
  }
});

// Export the router
export default router;
