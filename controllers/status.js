/**
 * Requiring dependencies
 */
const { knex, error } = require('_config');
const { toString, assign } = require('lodash');

/**
 * @function DbVersion
 * @description This function get version of MySQL/MariaDB database engine
 */
const DbVersion = () => {
  try {
    return knex.raw('select version() as version');
  } catch (err) {
    error(toString(err));
    return toString(err);
  }
};

module.exports = {
  DbVersion,
};
