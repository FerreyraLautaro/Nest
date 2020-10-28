require('dotenv').config();

const {
  DATABASE_HOSTNAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_DATABASE,
  KNEX_MIGRATIONS_FOLDER,
  KNEX_MIGRATIONS_TABLE,
} = process.env;

module.exports = {
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
