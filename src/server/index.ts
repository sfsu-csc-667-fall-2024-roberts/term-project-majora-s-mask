import express from "express";
import session from "express-session";
const connectPgSimple = require("connect-pg-simple");
import { authRoutes, gameRoutes, registerRoutes } from "./routes/index";
import { isAuthenticated } from "./middleware/auth";
import db from "./config/db";
import path from "path";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
const PGStore = connectPgSimple(session);

app.use(
  session({
    store: new PGStore({
      conString: process.env.DATABASE_URL,
      tableName: "session", // Explicitly set the table name for sessions
      createTableIfMissing: true, // Automatically create table if it doesn't exist
    }),
    secret: process.env.SESSION_SECRET || "default_secret", // Use a secure secret for production
    resave: false, // Prevent resaving sessions that haven’t changed
    saveUninitialized: false, // Don’t save empty sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    },
  })
);
// Static files
const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));

// Set EJS as the template engine
app.set("views", path.join(__dirname, "views")); // Set the directory for views
app.set("view engine", "ejs");

// Routes

app.use("/auth", authRoutes);
app.use("/auth", registerRoutes); // Ensure `/auth/register` is accessible
app.use("/game", isAuthenticated, gameRoutes);

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { userId: (req.session as any)?.userId });
});

// Home page route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    userId: (req.session as any)?.userId || null,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
