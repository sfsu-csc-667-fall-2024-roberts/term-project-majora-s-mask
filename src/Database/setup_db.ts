import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const setupDatabase = async () => {
  try {
    // Connect to MySQL server (without specifying a database)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    console.log("Connected to MySQL server!");

    // Create the database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    console.log(`Database "${process.env.DB_NAME}" created or already exists.`);

    // Switch to the newly created database
    await connection.changeUser({ database: process.env.DB_NAME });

    // Create the tables and populate with test data
    const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_picture VARCHAR(255),
        games_played INT DEFAULT 0,
        games_won INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS game_boards (
        game_id INT AUTO_INCREMENT PRIMARY KEY,
        status ENUM('active', 'paused', 'completed') NOT NULL,
        timer INT NOT NULL,
        current_turn_user_id INT,
        winner_user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (current_turn_user_id) REFERENCES users(user_id),
        FOREIGN KEY (winner_user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS cards (
        card_id INT AUTO_INCREMENT PRIMARY KEY,
        game_id INT,
        user_id INT,
        numbers TEXT NOT NULL,
        marked_numbers TEXT,
        is_winner BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (game_id) REFERENCES game_boards(game_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS random_numbers (
        random_id INT AUTO_INCREMENT PRIMARY KEY,
        game_id INT,
        number INT NOT NULL,
        called_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES game_boards(game_id)
    );

    CREATE TABLE IF NOT EXISTS turns (
        turn_id INT AUTO_INCREMENT PRIMARY KEY,
        game_id INT,
        user_id INT,
        number INT,
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES game_boards(game_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS chat_rooms (
        chat_room_id INT AUTO_INCREMENT PRIMARY KEY,
        game_id INT,
        FOREIGN KEY (game_id) REFERENCES game_boards(game_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
        message_id INT AUTO_INCREMENT PRIMARY KEY,
        chat_room_id INT,
        sender_user_id INT,
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(chat_room_id),
        FOREIGN KEY (sender_user_id) REFERENCES users(user_id)
    );
    `;

    // Split the SQL statements by semicolon and execute each one
    const statements = createTablesSQL.split(";");
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log("All tables have been created or already exist.");

    // Close the connection
    await connection.end();
    console.log("Database setup completed!");
  } catch (error) {
    console.error("Error setting up the database:", error);
  }
};

// Run the setup script
setupDatabase();
