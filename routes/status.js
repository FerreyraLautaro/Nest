/**
 * Requiering dependencies
 */
const Request = require('request');
const { first } = require('lodash');
const { version } = require('_package-json');
const { DbVersion } = require('_controllers');
const { info } = require('_config');

const statusRouter = (router) => {
  /**
   * @route GET /status/ping
   * @description Route to test access to backend
   * @example http http://localhost:4000/status/ping
   * @returns {JSON} pre-defined static object
   */
  router.get('/status/ping', (req, res) => {
    info(`[${req.method}] [${req.path}] Process Successfully`);
    res.send({ ping: 'pong' });
  });

  /**
   * @route GET /status/ping
   * @description Route to test access stability of node process for this app
   * @example http http://localhost:4000/status/healty
   * @returns {JSON} pre-defined static object
   */
  router.get('/status/healty', async (req, res) => {
    info(`[${req.method}] [${req.path}] Process Successfully`);
    res.send({ version });
  });

  /**
   * @route GET /status/ping
   * @description Route to test access to database
   * @example http http://localhost:4000/status/database
   * @returns {JSON} pre-defined static object
   */
  router.get('/status/database', async (req, res) => {
    info(`[${req.method}] [${req.path}] Process Successfully`);
    let outcome = await DbVersion();
    res.send(first(first(outcome)));
  });
};

module.exports = statusRouter;
