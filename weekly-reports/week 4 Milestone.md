# Project Changes and Database Setup

## 1. Database Setup (`setup_db.ts`):

- **Database Creation**: Created the database `bingo_game` if it didn’t already exist.
- **Table Creation**: Set up the required tables (`users`, `game_boards`, `cards`, `random_numbers`, `turns`, `chat_rooms`, and `messages`).
- **Foreign Key Constraints**: Ensured proper relationships between tables using foreign keys (e.g., `user_id`, `game_id`).
- **SQL Execution**: Split SQL statements and executed each to create the necessary tables.

## 2. Insert, Find, and Delete Operations (`database_operations.ts`):

- **Insert User**: Implemented a method for inserting a new user into the `users` table, ensuring no duplicate entries (checked for existing `username` or `email`).
- **Find User by Username**: Implemented a method to find users by their `username` and return user details.
- **Delete User**: Set up a method for deleting users by `username` (optional, with foreign key handling in place).
