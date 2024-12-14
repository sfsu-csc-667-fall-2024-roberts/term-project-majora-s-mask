/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("session", (table) => {
    table.string("sid").primary(); // Session ID
    table.json("sess").notNullable(); // Session data stored as JSON
    table.timestamp("expire").notNullable(); // Expiry timestamp
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("session");
};
