/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("chat_rooms", (table) => {
    table.increments("chat_room_id").primary();
    table
      .integer("game_id")
      .unsigned()
      .references("game_id")
      .inTable("game_boards");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("chat_rooms");
};
