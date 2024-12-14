import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../config/db";
import "express-session";
const authRoutes = express.Router();

authRoutes.get("/login", (_req: Request, res: Response) => {
  res.render("auth/login", { title: "Login" });
});

// Logout route
authRoutes.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Could not log out. Please try again.");
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect("/auth/login");
  });
});

/**
 * Login route.
 */
authRoutes.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await db("users").where("email", email).first();

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

    console.log("Session before setting user:", req.session);

    // Set the user object in the session
    if (req.session) {
      (req.session as any).userId = user.user_id;
    } else {
      console.error("Session is not initialized!");
    }

    res.redirect("/");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).render("auth/login", {
      title: "Login",
      error: "An error occurred during login. Please try again.",
    });
  }
});

export { authRoutes };
