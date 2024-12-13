import path from "path";
import { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: path.resolve(__dirname, "../../database/migrations"), // Absolute path to migrations
    },
    seeds: {
      directory: path.resolve(__dirname, "../../database/seeds"), // Optional: Absolute path to seeds
    },
  },
};

console.log(
  "Migrations Directory:",
  path.resolve(__dirname, "../../database/migrations")
);
export default config;
