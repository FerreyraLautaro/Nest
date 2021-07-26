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
  WOO_FLX_DATABASE,
  KNEX_MIGRATIONS_FOLDER,
  KNEX_MIGRATIONS_TABLE,
  KNEX_SEEDS_FOLDER,
} = process.env;

/**
 * Configuration object for knex instance.
 * Include database object and migrations configuration
 */
const knexConfig = {
  client: 'mysql2',
  pool: {
    min: 1,
    max: 10,
    createTimeoutMillis: 15000,
    acquireTimeoutMillis: 90000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 6000,
    createRetryIntervalMillis: 1000,
    propagateCreateError: true
  },
  debug: true,
  connection: {
    host: DATABASE_HOSTNAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: WOO_FLX_DATABASE,
  },
  migrations: {
    directory: KNEX_MIGRATIONS_FOLDER,
    tableName: KNEX_MIGRATIONS_TABLE,
  },
  seeds: {
    directory: KNEX_SEEDS_FOLDER
  },
  wrapIdentifier: value => value
};

/**
 * Knex instace initialized and exported
 */
const db = knex(knexConfig);

module.exports = {knex: db} ;
