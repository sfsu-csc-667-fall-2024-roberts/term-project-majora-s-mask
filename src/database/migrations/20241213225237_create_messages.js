/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("messages", (table) => {
    table.increments("message_id").primary();
    table
      .integer("chat_room_id")
      .unsigned()
      .references("chat_room_id")
      .inTable("chat_rooms")
      .onDelete("CASCADE"); // Ensure cascading deletes
    table
      .integer("sender_user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE"); // Ensure cascading deletes
    table.text("content").notNullable();
    table.timestamp("timestamp").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("messages");
};
