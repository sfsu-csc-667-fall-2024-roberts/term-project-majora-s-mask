/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("random_numbers", (table) => {
    table.increments("random_id").primary();
    table
      .integer("game_id")
      .unsigned()
      .references("game_id") // Reference the `games` table instead
      .inTable("games")
      .onDelete("CASCADE"); // Ensure cascading deletes
    table.integer("number").notNullable(); // Store the random number
    table.timestamp("called_at").defaultTo(knex.fn.now()); // Timestamp when the number was called
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("random_numbers");
};
