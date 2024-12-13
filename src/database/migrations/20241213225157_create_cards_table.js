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
      .references("game_id")
      .inTable("game_boards")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("numbers").notNullable();
    table.text("marked_numbers");
    table.boolean("is_winner").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("cards");
};
