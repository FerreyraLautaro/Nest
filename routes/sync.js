/**
 * @module Sync
 * @memberof Router
 * @description All routes for synchronization client (sync-cli REST)
 * @requires lodash/toString
 * @requires lodash/every
 * @requires _controllers/sync
 * @requires _config/log/info
 */

 // Requiring dependencies
const { toString, every } = require('lodash');
const { sync } = require('_controllers');
const { info } = require('_config');



  /**
   * @route GET /sync/categories
   * @description Route to sync flexxus categories with woocommerce categories
   * @example http http://localhost:4000/sync/categories
   * @returns {Boolean} true if all sync it's fine, false if an error as ocurred
   * @throws {String} error as string format and  500 HTTP Error Code
   */
const syncRouter = (router) => {
    router.get('/sync/categories', (req, res) => {
      info(`[${req.method}] [${req.path}] Process Successfully`);
      sync.categories()
      .then(response =>{
          const outcome = every((r) => r === 0);
          info(`[${req.method}] [${req.path}] Process Successfully`);
          res.send(outcome);
        }
      )
      .catch(err=>{
        error(toString(err));
        res.status(500).send(toString(err))
      })
    });

}

/**
 * @exports syncRouter Express router interface without instantiating
 */
module.exports = syncRouter;