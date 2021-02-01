/**
 * @module FlexxusRouter
 * @description All routes to instance Flexxus interaction
 * @requires config
 * @requires lodash
 * @requires lodash/set
 * @requires lodash/toString
 * @requires FlexxusOrders 
 */

// Requiring dependencies
const set = require('lodash/set');
const toString = require('lodash/toString');
const { info, error, fatal } = require('_config/log');
const { FlexxusOrders } = require('_controllers/flexxusOrders');
const { isEmpty } = require('lodash');

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
    await FlexxusOrders.ping()
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
   * @route GET /flexxus/orders
   * @description Allows you to get flexxus orders list
   * @returns {JSON} Object with flexxus content
   */

  router.get('/flexxus/orders', async (req, res) => {
    const outcome = {};
    await FlexxusOrders.get('orders')
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
   * @route GET /flexxus/orders/count
   * @description Allows you to get a count of orders items in flexxus
   * @returns {JSON} Object with flexxus a counter
   */

  router.get('/flexxus/orders/count', async (req, res) => {
    const outcome = {};
    await FlexxusOrders.get(`orders/count`)
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
   * @route GET /flexxus/orders/count
   * @description Allows you to get a count of orders items in flexxus
   * @returns {JSON} Object with flexxus a counter
   */

  router.post('/flexxus/orders', async (req, res) => {
    const outcome = {};
    const body = req.body
    await FlexxusOrders.post(`orders`, body)
    .then(response => {
      console.log('route', response);
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