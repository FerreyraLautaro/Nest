/**
 * Requiering dependencies
 */
const modules = require('.');
const knex = require('knex');

/**
 * Configuration database object
 */
const {
  DATABASE_HOSTNAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_DATABASE,
  KNEX_MIGRATIONS_FOLDER,
  KNEX_MIGRATIONS_TABLE,
} = process.env;

/**
 * Configuration object for knex instance.
 * Include database object and migrations configuration
 */
const knexConfig = {
  client: 'mysql',
  connection: {
    host: DATABASE_HOSTNAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_DATABASE,
  },
  pool: { min: 5, max: 20},
  migrations: {
    directory: KNEX_MIGRATIONS_FOLDER,
    tableName: KNEX_MIGRATIONS_TABLE,
  },
  wrapIdentifier: value => value
};

/**
 * Knex instace initialized and exported
 */
const db = knex(knexConfig);

module.exports = {knex: db} ;
