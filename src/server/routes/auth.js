"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const connections_1 = __importDefault(require("../db/connections")); // Import the database connection
const router = express_1.default.Router();
// Render the registration form
router.get("/register", (_req, res) => {
    res.render("auth/register", { title: "Register" });
});
// Handle registration form submission
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const [existingUser] = yield connections_1.default.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);
        if (existingUser.length > 0) {
            return res.status(400).render("auth/register", {
                title: "Register",
                error: "Username or email already exists!",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield connections_1.default.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
        res.redirect("/auth/login");
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).render("auth/register", {
            title: "Register",
            error: "An error occurred during registration. Please try again.",
        });
    }
}));
// Render the login form
router.get("/login", (_req, res) => {
    res.render("auth/login", { title: "Login" });
});
// Handle login form submission
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const [userRows] = yield connections_1.default.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        const user = userRows[0];
        if (!user) {
            return res.status(401).render("auth/login", {
                title: "Login",
                error: "Invalid email or password!",
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
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
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).render("auth/login", {
            title: "Login",
            error: "An error occurred during login. Please try again.",
        });
    }
}));
exports.default = router;
