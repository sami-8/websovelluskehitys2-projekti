const Knex = require('knex');
const knexConfig = require('../../knexfile');

let db;

if (process.env.NODE_ENV === 'test') {
  db = Knex(knexConfig.test);
} else {
  db = Knex(knexConfig.development);
}

module.exports = db;
