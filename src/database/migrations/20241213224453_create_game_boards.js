/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("game_boards", (table) => {
    table.increments("game_id").primary();
    table.enu("status", ["active", "paused", "completed"]).notNullable();
    table.integer("timer").notNullable();
    table
      .integer("current_turn_user_id")
      .unsigned()
      .references("user_id")
      .inTable("users");
    table
      .integer("winner_user_id")
      .unsigned()
      .references("user_id")
      .inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("game_boards");
};
