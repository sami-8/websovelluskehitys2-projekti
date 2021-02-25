exports.up = function (knex) {
  return knex.schema.table('pastes', (table) => {
    table.string('delpassword');
  });
};

exports.down = function (knex) {
  return knex.schema.table('pastes', (table) => {
    table.dropColumn('delpassword');
  });
};
