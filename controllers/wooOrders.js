/**
 * @module WooOrders
 * @description All controllers and additional function to manage dataset for order orders of Woocommerce
 * @requires WooController
 */

// Requiring dependencies
const { WooController } = require('_controllers/woocommerce');


/**
 * @class WooOrders
 * @description Class container with controllers and additional function to manage dataset for order orders of Woocommerce
 * @extends WooController
 */

class WooOrders extends WooController {
    constructor(){
    }
}

/**
 * @exports WooOrders Class WooOrders without instancing
 */
module.exports = {
    WooOrders,
};
  