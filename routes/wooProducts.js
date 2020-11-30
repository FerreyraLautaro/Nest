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
const { WooProducts } = require('_controllers/wooProducts');
const { info, error, fatal } = require('_config');


/**
 * @export {express-router} router 
 */
module.exports = (router) => {
  /**
   * @route GET /woo/products/test
   * @route GET /woo/products/ping
   * @description Allows you to test and validate the connection with the WooCommerce instance
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.get(['/woo/products/test', '/woo/products/ping'], async (req, res) => {
    const outcome = {};

    try {
      await WooProducts.get('')
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
   * @route GET /woo/products
   * @description It allows to obtain the list of products items.
   * @example http http://localhost:4000/woo/products
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.get(['/woo/products'], async (req, res) => {
    const outcome = {};

    try {
      await WooProducts.get('products')
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
   * @route GET /woo/products/:id
   * @description It allows to obtain the details of product item.
   * @example http http://localhost:4000/woo/products/19
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.get(['/woo/products/:id'], async (req, res) => {
    const outcome = {};
    const id = req.params.id

    try {
      await WooProducts.get(`products/${id}`)
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
   * @route POST /woo/products
   * @description Allows you to create an element within a specific module
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @property {string} body.name Name of category
   * @property {string} body.slug Slug of category. Highly recommended use name without spaces
   * @property {string} body.description Description for the category
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.post(['/woo/products'], async (req, res) => {
    const outcome = {};
    const body = req.body;

    try {
      await WooProducts.post('products', body)
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
   * @route PUT /woo/products/:id
   * @param {number} id Specify item ID
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @property {string} body.name Name of category
   * @property {string} body.slug Slug of category. Highly recommended use name without spaces
   * @property {string} body.description Description for the category
   * @description Allows updating an element within a specific module
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.put(['/woo/products/:id'], async (req, res) => {
    const outcome = {};
    const body = req.body;
    const id = req.params.id;
    try {
      await WooProducts.put(`products/${id}`, body)
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
   * @route DELETE /woo/products/:id
   * @param {json} body Specify the object in required format with the required attributes specified in the WC API documentation
   * @property {string} body.name Name of category
   * @property {string} body.slug Slug of category. Highly recommended use name without spaces
   * @property {string} body.description Description for the category
   * @description Allows you to delete an element within a specific module
   * @example http http://localhost:4000/woo/products/19 (Allows you to delete a product from the product list)
   * @returns {JSON} WooCommerce REST API descriptive object or Error Object with details of them.
   */

  router.delete(['/woo/products/:id'], async (req, res) => {
    const outcome = {};
    const id = req.params.id;
    const body = req.body;
    try {
      await WooProducts.delete(`products/${id}`, body)
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
