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
      .references("game_id")
      .inTable("game_boards");
    table.integer("user_id").unsigned().references("user_id").inTable("users");
    table.integer("number");
    table.timestamp("start_time").defaultTo(knex.fn.now());
    table.timestamp("end_time");
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("turns");
};
