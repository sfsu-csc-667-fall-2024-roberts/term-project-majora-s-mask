import path from "path";
import { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL, // Use DATABASE_URL directly,
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
