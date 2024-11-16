import express from "express";
import pool from "../../Database/setup_db"; // Import the database connection

const router = express.Router();

// Render the registration form
router.get("/register", (_req, res) => {
  res.render("auth/register", { title: "Register" });
});

// Handle registration form submission
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the username or email already exists
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.redirect("/auth/login"); // Redirect to the login page
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
    // Check if the user exists in the database
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

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).render("auth/login", {
        title: "Login",
        error: "Invalid email or password!",
      });
    }

    // Assuming sessions are configured
    // req.session.user = { id: user.user_id, username: user.username };

    res.redirect("/"); // Redirect to the homepage on success
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).render("auth/login", {
      title: "Login