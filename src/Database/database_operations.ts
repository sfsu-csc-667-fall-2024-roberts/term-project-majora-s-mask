import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Insert a user into the users table
const insertUser = async (
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  password: string
) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)",
      [first_name, last_name, username, email, password]
    );
    // Destructure the result to get insertId
    const { insertId } = result as mysql.ResultSetHeader; // Correctly type the result as ResultSetHeader
    console.log("User inserted with ID:", insertId);
  } catch (error) {
    console.error("Error inserting user:", error);
  }
};

// Find a user by username
const findUserByUsername = async (username: string) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows;
  } catch (error) {
    console.error("Error finding user:", error);
  }
};

// Delete a user by username
const deleteUserByUsername = async (username: string) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE username = ?", [
      username,
    ]);
    // Destructure the result to get affectedRows
    const { affectedRows } = result as mysql.ResultSetHeader; // Correctly type the result as ResultSetHeader
    console.log(`Deleted ${affectedRows} user(s).`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Export functions
export { insertUser, findUserByUsername, deleteUserByUsername };
