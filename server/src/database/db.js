const Knex = require('knex');
const knexConfig = require('../../knexfile');

const db = Knex(knexConfig[process.env.NODE_ENV]);

module.exports = db;
