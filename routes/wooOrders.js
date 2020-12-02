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

  //TODO: Update Docs
  /**
   * @route POST /woo/orders
   * @description Allows you to create an element within a specific module
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @property {string} body.name Name of category
   * @property {string} body.slug Slug of category. Highly recommended use name without spaces
   * @property {string} body.description Description for the category
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.post(['/woo/orders'], async (req, res) => {
    const outcome = {};
    const body = req.body;

    try {
      await WooOrders.post('orders', body)
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
//TODO: Update Docs
  /**
   * @route PUT /woo/orders/:id
   * @param {number} id Specify item ID
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @property {string} body.name Name of category
   * @property {string} body.slug Slug of category. Highly recommended use name without spaces
   * @property {string} body.description Description for the category
   * @description Allows updating an element within a specific module
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.put(['/woo/orders/:id'], async (req, res) => {
    const outcome = {};
    const body = req.body;
    const id = req.params.id;
    try {
      await WooOrders.put(`orders/${id}`, body)
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

  //TODO: Update Docs
  /**
   * @route DELETE /woo/orders/:id
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @property {string} body.name Name of category
   * @property {string} body.slug Slug of category. Highly recommended use name without spaces
   * @property {string} body.description Description for the category
   * @description Allows you to delete an element within a specific module
   * @example http http://localhost:4000/woo/orders/19 (Allows you to delete a order from the order list)
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.delete(['/woo/orders/:id'], async (req, res) => {
    const outcome = {};
    const id = req.params.id;
    const body = req.body;
    try {
      await WooOrders.delete(`orders/${id}`, body)
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
