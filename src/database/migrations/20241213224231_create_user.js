/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary(); // Auto-incrementing primary key
    table.string("first_name", 255);
    table.string("last_name", 255);
    table.string("username", 255).unique().notNullable();
    table.string("email", 255).unique().notNullable();
    table.string("password", 255).notNullable();
    table.string("profile_picture", 255);
    table.integer("games_played").defaultTo(0);
    table.integer("games_won").defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("users");
};
