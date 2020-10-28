/**
 * Requiering dependencies
 */
const { set, replace, toString } = require('lodash');
const { WooController } = require('_controllers');
const { info, error, fatal } = require('_config');

/**
 * @module Woo
 * @extends config It requires loading the configuration auto-loading module.
 * @external lodash Requires set, replace
 */

module.exports = (router) => {
  /**
   * @route GET /woo
   * @route GET /woo/test
   * @route GET /woo/ping
   * @description Allows you to test and validate the connection with the WooCommerce instance
   * @returns {JSON} WooCommerce REST API descriptive object
   */

  router.get(['/woo', '/woo/test', '/woo/ping'], async (req, res) => {
    const outcome = {};

    try {
      await WooController.get('')
        .then((response) => {
          set(outcome, 'response', response.data);
          set(outcome, 'errors', {});
          info(`[${req.method}] [${req.path}] Process Successfully`);
        })
        .catch((err) => {
          set(outcome, 'response', {});
          set(outcome, 'errors', err.response.data);
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
   * @route GET /woo/:module
   * @param {string} module Specify the name of the module you want to get data from
   * @description It allows to obtain the list of objects of a specific module or the detail of an element.
   * @example http http://localhost:4000/woo/products (It allows to obtain the list of products)
   * @example http http://localhost:4000/woo/products_categories (It allows to obtain the list of categories for the products)
   * @example http http://localhost:4000/woo/products_categories_16 (It allows to obtain the detail of the element: Product category ID 16)
   * @returns {JSON} WooCommerce REST API descriptive object
   */

  router.get(['/woo/:module'], async (req, res) => {
    const outcome = {};
    const module = replace(req.params.module, /(_)/g, '/');

    try {
      await WooController.get(module)
        .then((response) => {
          set(outcome, 'response', response.data);
          set(outcome, 'errors', {});
          info(`[${req.method}] [${req.path}] Process Successfully`);
        })
        .catch((err) => {
          set(outcome, 'response', {});
          set(outcome, 'errors', err.response.data);
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
   * @route POST /woo/:module
   * @param {string} module Specify the name of the module in which you want to create the element
   * @description Allows you to create an element within a specific module
   * @example http http://localhost:4000/woo/products (Allows you to create a product within the product list)
   * @example http http://localhost:4000/woo/products_categories (Allows you to create a category within the category list for products)
   * @returns {JSON} WooCommerce REST API descriptive object
   */

  router.post(['/woo/:module'], async (req, res) => {
    const outcome = {};
    const module = replace(req.params.module, /(_)/g, '/');
    const body = req.body;

    try {
      await WooController.post(module, body)
        .then((response) => {
          set(outcome, 'response', response.data);
          set(outcome, 'errors', {});
          info(`[${req.method}] [${req.path}] Process Successfully`);
        })
        .catch((err) => {
          set(outcome, 'response', {});
          set(outcome, 'errors', err.response.data);
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
   * @route PUT /woo/:module
   * @param {string} module Specify the name of the module in which you want to update the element and its ID
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @description Allows updating an element within a specific module
   * @example http http://localhost:4000/woo/products_12 (It allows updating a product within the product list)
   * @example http http://localhost:4000/woo/products_categories_16 (Allows you to create an update within the list of categories for the products)
   * @returns {JSON} WooCommerce REST API descriptive object
   */

  router.put(['/woo/:module'], async (req, res) => {
    const outcome = {};
    const module = replace(req.params.module, /(_)/g, '/');
    const body = req.body;
    try {
      await WooController.put(module, body)
        .then((response) => {
          set(outcome, 'response', response.data);
          set(outcome, 'errors', {});
          info(`[${req.method}] [${req.path}] Process Successfully`);
        })
        .catch((err) => {
          set(outcome, 'response', {});
          set(outcome, 'errors', err.response.data);
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
   * @route DELETE /woo/:module
   * @param {string} module Specify the name of the module in which you want to delete the element and its ID
   * @description Allows you to delete an element within a specific module
   * @example http http://localhost:4000/woo/products_12 (Allows you to delete a product from the product list)
   * @example http http://localhost:4000/woo/products_categories_16 (Allows you to create a delete within the list of categories for products)
   * @returns {JSON} WooCommerce REST API descriptive object
   */

  router.delete(['/woo/:module'], async (req, res) => {
    const outcome = {};
    const module = replace(req.params.module, /(_)/g, '/');
    const body = req.body;
    try {
      await WooController.delete(module, body)
        .then((response) => {
          set(outcome, 'response', response.data);
          set(outcome, 'errors', {});
          info(`[${req.method}] [${req.path}] Process Successfully`);
        })
        .catch((err) => {
          set(outcome, 'response', {});
          set(outcome, 'errors', err.response.data);
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
