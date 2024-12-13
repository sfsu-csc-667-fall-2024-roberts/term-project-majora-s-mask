import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/connections"; // Import the database connection

const router = express.Router();

// Render the registration form
router.get("/register", (_req, res) => {
  res.render("auth/register", { title: "Register" });
});

// Handle registration form submission
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if ((existingUser as any[]).length > 0) {
      return res.status(400).render("auth/register", {
        title: "Register",
        error: "Username or email already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.redirect("/auth/login");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).render("auth/register", {
      title: "Register",
      error: "An error occurred during registration. Please try again.",
    });
  }
});

// Render the login form
router.get("/login", (_req, res) => {
  res.render("auth/login", { title: "Login" });
});

// Handle login form submission
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [userRows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const user = (userRows as any[])[0];

    if (!user) {
      return res.status(401).render("auth/login", {
        title: "Login",
        error: "Invalid email or password!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).render("auth/login", {
        title: "Login",
        error: "Invalid email or password!",
      });
    }

    // Store user in session
    req.session.user = {
      id: user.user_id,
      username: user.username,
    };

    console.log("Session created:", req.session);

    res.redirect("/");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).render("auth/login", {
      title: "Login",
      error: "An error occurred during login. Please try again.",
    });
  }
});

export default router;
