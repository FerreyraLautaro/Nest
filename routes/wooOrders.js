/**
 * @module WooRouter
 * @description All routes for interact with Woocommerce
 * @requires config
 * @requires lodash
 * @requires lodash/set
 * @requires lodash/replace
 * @requires lodash/toString
 */

// Requiring dependencies
const { set, replace, toString } = require('lodash');
const { WooOrders } = require('_controllers/wooOrders');
const { info, error, fatal } = require('_config');


/**
 * @export {express-router} router 
 */
module.exports = (router) => {
  /**
   * @route GET /woo/orders/test
   * @route GET /woo/orders/ping
   * @description Allows you to test and validate the connection with the WooCommerce instance
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.get(['/woo/orders/test', '/woo/orders/ping'], async (req, res) => {
    const outcome = {};

    try {
      await WooOrders.get('')
        .then((response) => {
          set(outcome, 'response', response.data);
          set(outcome, 'errors', {});
          info(`[${req.method}] [${req.path}] Process Successfully`);
        })
        .catch((err) => {
          const data = (err.response && err.response.data) ?  err.response.data : toString(err);
          set(outcome, 'response', {});
          set(outcome, 'errors', data);
          error(toString(err));
        });
    } catch (err) {
      set(outcome, 'response', {});
      set(outcome, 'errors', 'Internal error server');
      res.status(500);
      fatal(toString(err));
    }

    res.send(outcome);
  });

  /**
   * @route GET /woo/orders
   * @description It allows to obtain the list of orders items.
   * @example http http://localhost:4000/woo/orders
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.get(['/woo/orders'], async (req, res) => {
    const outcome = {};

    try {
      await WooOrders.get('orders')
        .then((response) => {
          set(outcome, 'response', response.data);
          set(outcome, 'errors', {});
          info(`[${req.method}] [${req.path}] Process Successfully`);
        })
        .catch((err) => {
          const data = (err.response && err.response.data) ?  err.response.data : toString(err);
          set(outcome, 'response', {});
          set(outcome, 'errors', data);
          error(toString(err));
        });
    } catch (err) {
      set(outcome, 'response', {});
      set(outcome, 'errors', 'Internal error server');
      res.status(500);
      fatal(toString(err));
    }
    res.send(outcome);
  });

  /**
   * @route GET /woo/orders/:id
   * @description It allows to obtain the details of order item.
   * @example http http://localhost:4000/woo/orders/19
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.get(['/woo/orders/:id'], async (req, res) => {
    const outcome = {};
    const id = req.params.id

    try {
      await WooOrders.get(`orders/${id}`)
        .then((response) => {
          set(outcome, 'response', response.data);
          set(outcome, 'errors', {});
          info(`[${req.method}] [${req.path}] Process Successfully`);
        })
        .catch((err) => {
          const data = (err.response && err.response.data) ?  err.response.data : toString(err);
          set(outcome, 'response', {});
          set(outcome, 'errors', data);
          error(toString(err));
        });
    } catch (err) {
      set(outcome, 'response', {});
      set(outcome, 'errors', 'Internal error server');
      res.status(500);
      fatal(toString(err));
    }
    res.send(outcome);
  });

};
