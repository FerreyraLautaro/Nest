/**
 * Requiering dependencies
 */
const log4js = require('log4js');
const { set, keys } = require('lodash');
require('dotenv').config();

/**
 * Getting Node Environment variable
 */
const { NODE_ENV } = process.env;

/**
 * Setup appenders for logs
 */
const appenders = {};

/**
 * Setup app logger configuration
 */
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDay();

const appAppender = {
  type: 'file',
  filename: `logs/${year}/${month}/${day}/common.log`,
};
set(appenders, 'app', appAppender);

/**
 * Setup app logger configuration and dump con console
 */
const consoleAppender = { type: 'stdout', layout: { type: 'colored' } };
set(appenders, 'console', consoleAppender);

/**
 * Setup app logger configuration for development mode. An centralized log
 */
if (NODE_ENV === 'dev') {
  const devAppender = { type: 'file', filename: `logs/development.log` };
  set(appenders, 'develop', devAppender);
}

/**
 * Setup categories configuration for logs
 */
const categories = { default: { appenders: keys(appenders), level: 'all' } };

/**
 * Initialize log with configurations
 */
log4js.configure({
  appenders,
  categories,
});

/**
 * Generating instances for logger and logs levels
 */
const logger = log4js.getLogger('[App]');
const trace = (input) => logger.trace(input);
const debug = (input) => logger.debug(input);
const info = (input) => logger.info(input);
const warn = (input) => logger.warn(input);
const error = (input) => logger.error(input);
const fatal = (input) => logger.fatal(input);

module.exports = {
  logger,
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
};
