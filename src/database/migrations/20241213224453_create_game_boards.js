/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("games", (table) => {
    table.increments("game_id").primary();
    table.enu("status", ["active", "paused", "completed"]).notNullable();
    table.integer("timer").notNullable();
    table
      .integer("current_turn_user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("SET NULL");
    table
      .integer("winner_user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("SET NULL");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("game_boards", (table) => {
    table.increments("board_id").primary();
    table
      .integer("game_id")
      .unsigned()
      .references("game_id")
      .inTable("games")
      .onDelete("CASCADE")
      .notNullable();
    table
      .integer("player_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();
    table.json("board").notNullable();
    table.json("crossed_numbers").notNullable().defaultTo("[]");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Remove the unique constraint on `game_id`
    // Add a composite unique constraint on `game_id` and `player_id`
    table.unique(["game_id", "player_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("game_boards");
  await knex.schema.dropTableIfExists("games");
};
