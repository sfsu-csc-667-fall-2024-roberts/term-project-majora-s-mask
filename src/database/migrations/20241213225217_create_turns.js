/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("turns", (table) => {
    table.increments("turn_id").primary();
    table
      .integer("game_id")
      .unsigned()
      .references("game_id") // Reference the `games` table
      .inTable("games")
      .onDelete("CASCADE"); // Ensure cascading deletes
    table
      .integer("user_id")
      .unsigned()
      .references("user_id") // Reference the `users` table
      .inTable("users")
      .onDelete("CASCADE"); // Ensure cascading deletes
    table.integer("number"); // Number played during the turn
    table.timestamp("start_time").defaultTo(knex.fn.now()); // Start time of the turn
    table.timestamp("end_time"); // End time of the turn
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("turns");
};
