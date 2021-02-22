exports.up = function (knex) {
  return knex.schema.createTable('pastes', (table) => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table.string('content').notNullable();
    table.boolean('unlisted').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('pastes');
};
