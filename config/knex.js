/**
 * Requiering dependencies
 */
const modules = require('.');
const knexModule = require('knex');

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
  pool: { min: 0, max: 5 },
  migrations: {
    directory: KNEX_MIGRATIONS_FOLDER,
    tableName: KNEX_MIGRATIONS_TABLE,
  },
};

/**
 * Knex instace initialized and exported
 */
const knex = knexModule(knexConfig);

module.exports = { knex };
