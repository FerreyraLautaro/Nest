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
const { WooCategories } = require('_controllers/wooCategories');
const { info, error, fatal } = require('_config');


/**
 * @export {express-router} router 
 */
module.exports = (router) => {
  /**
   * @route GET /woo/categories/test
   * @route GET /woo/categories/ping
   * @description Allows you to test and validate the connection with the WooCommerce instance
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.get(['/woo/categories/test', '/woo/categories/ping'], async (req, res) => {
    const outcome = {};

    try {
      await WooCategories.get('')
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
   * @route GET /woo/categories
   * @description It allows to obtain the list of product categories items.
   * @example http http://localhost:4000/woo/categories
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.get(['/woo/categories'], async (req, res) => {
    const outcome = {};

    try {
      await WooCategories.get('products/categories')
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
   * @route GET /woo/categories/:id
   * @description It allows to obtain the details of product categories item.
   * @example http http://localhost:4000/woo/categories/19
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.get(['/woo/categories/:id'], async (req, res) => {
    const outcome = {};
    const id = req.params.id

    try {
      await WooCategories.get(`products/categories/${id}`)
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
   * @route POST /woo/categories
   * @description Allows you to create an element within a specific module
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @property {string} body.name Name of category
   * @property {string} body.slug Slug of category. Highly recommended use name without spaces
   * @property {string} body.description Description for the category
   * @example 
   * var request = require('request');
   * var options = {
   *   'method': 'POST',
   *   'url': 'localhost:4000/woo/categories',
   *   'headers': {
   *     'Content-Type': 'application/json'
   *   },
   *   body: JSON.stringify({
   *      "name":"Categoria from service",
   *      "slug":"categoria-from-service",
   *      "description":"Categoria from service description"
   *    })
   * };
   * request(options, function (error, response) {
   *   if (error) throw new Error(error);
   *   console.log(response.body);
   * });
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.post(['/woo/categories'], async (req, res) => {
    const outcome = {};
    const body = req.body;

    try {
      await WooCategories.post('products/categories', body)
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
   * @route PUT /woo/categories/:id
   * @param {number} id Specify item ID
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @property {string} body.name Name of category
   * @property {string} body.slug Slug of category. Highly recommended use name without spaces
   * @property {string} body.description Description for the category
   * @description Allows updating an element within a specific module
   * @example 
   * var request = require('request');
   * var options = {
   *   'method': 'PUT',
   *   'url': 'localhost:4000/woo/categories/19',
   *   'headers': {
   *     'Content-Type': 'application/json'
   *   },
   *   body: JSON.stringify({
   *      "name":"Categoria from service updated",
   *      "slug":"categoria-from-service",
   *      "description":"Categoria from service description"
   *    })
   * };
   * request(options, function (error, response) {
   *   if (error) throw new Error(error);
   *   console.log(response.body);
   * });
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.put(['/woo/categories/:id'], async (req, res) => {
    const outcome = {};
    const body = req.body;
    const id = req.params.id;
    try {
      await WooCategories.put(`products/categories/${id}`, body)
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
   * @route DELETE /woo/categories/:id
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @property {string} body.name Name of category
   * @property {string} body.slug Slug of category. Highly recommended use name without spaces
   * @property {string} body.description Description for the category
   * @description Allows you to delete an element within a specific module
   * @example http http://localhost:4000/woo/categories/19 (Allows you to delete a product from the product list)
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.delete(['/woo/categories/:id'], async (req, res) => {
    const outcome = {};
    const id = req.params.id;
    const body = req.body;
    try {
      await WooCategories.delete(`products/categories/${id}`, body)
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
