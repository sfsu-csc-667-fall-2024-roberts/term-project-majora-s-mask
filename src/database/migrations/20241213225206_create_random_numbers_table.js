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
      .references("game_id")
      .inTable("game_boards");
    table.integer("number").notNullable();
    table.timestamp("called_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("random_numbers");
};
