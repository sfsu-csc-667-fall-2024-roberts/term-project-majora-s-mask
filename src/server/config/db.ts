import knex from "knex";
import knexConfig from "./Knexfile";

const db = knex(knexConfig.development);

export default db;
