/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("cards", (table) => {
    table.increments("card_id").primary();
    table
      .integer("game_id")
      .unsigned()
      .references("game_id") // Reference the `games` table instead
      .inTable("games")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("numbers").notNullable(); // Store the card's bingo numbers
    table.text("marked_numbers"); // Store the marked numbers
    table.boolean("is_winner").defaultTo(false); // Indicates if this card is a winner
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Timestamp for record creation
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("cards");
};
