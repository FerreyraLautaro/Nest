/**
 * @module FlexxusRouter
 * @description All routes to instance Flexxus interaction
 * @requires config
 * @requires lodash
 * @requires lodash/set
 * @requires lodash/toString
 * @requires FlexxusController 
 */

// Requiring dependencies
const set = require('lodash/set');
const toString = require('lodash/toString');
const { info, error, fatal } = require('_config/log');
const { FlexxusController } = require('_controllers/flexxus')

/**
 * @export {express-router} router 
 */
module.exports = (router) => {
  /**
   * @route GET /flexxus/test
   * @route GET /flexxus/ping
   * @description Allows you to test and validate the connection with the Flexxus instance
   * @returns {JSON} Flexxus session object
   */

  router.get(['/flexxus/test', '/flexxus/ping'], async (req, res) => {
    const outcome = {};
    await FlexxusController.ping()
    .then(response => {
        set(outcome,'response',response);
        set(outcome,'error',{});
    })
    .catch(err=>{
        set(outcome,'response',{});
        set(outcome,'error',toString(err));
    })
    res.send(outcome);
  });

  /**
   * @route GET /flexxus/products
   * @description Allows you to get flexxus products list
   * @returns {JSON} Object with flexxus content
   */

  router.get('/flexxus/products', async (req, res) => {
    const outcome = {};
    await FlexxusController.get('products?limit=-1')
    .then(response => {
        set(outcome,'response',response);
        set(outcome,'error',{});
    })
    .catch(err=>{
        set(outcome,'response',{});
        set(outcome,'error',toString(err));
    })
    res.send(outcome);
  });

  /**
   * @route GET /flexxus/products/:id
   * @description Allows you to get flexxus products item
   * @returns {JSON} Object with flexxus content
   */

  router.get('/flexxus/products/:id', async (req, res) => {
    const outcome = {};
    const id = req.params.id
    await FlexxusController.get(`products/${id}`)
    .then(response => {
        set(outcome,'response',response);
        set(outcome,'error',{});
    })
    .catch(err=>{
        set(outcome,'response',{});
        set(outcome,'error',toString(err));
    })
    res.send(outcome);
  });

  /**
   * @route GET /flexxus/products/count
   * @description Allows you to get a count of products items in flexxus
   * @returns {JSON} Object with flexxus a counter
   */

  router.get('/flexxus/products/count', async (req, res) => {
    const outcome = {};
    await FlexxusController.get(`products/count`)
    .then(response => {
        set(outcome,'response',response);
        set(outcome,'error',{});
    })
    .catch(err=>{
        set(outcome,'response',{});
        set(outcome,'error',toString(err));
    })
    res.send(outcome);
  });
 }