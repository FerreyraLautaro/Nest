/**
 * @module WooOrders
 * @description All controllers and additional function to manage dataset for order orders of Woocommerce
 * @requires WooController
 * @requires OrderSchema
 */

// Requiring dependencies
const { WooController } = require('_controllers/woocommerce');
const {OrderSchema} = require('_schemas/wooOrders')


/**
 * @class WooOrders
 * @description Class container with controllers and additional function to manage dataset for order orders of Woocommerce
 * @extends WooController
 */

class WooOrders extends WooController {
    constructor(){
    }

    /**
     * @function post Method to create a order item.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce order object
     * @throws YUP Validation error message
     */
    static async post(path, body){
        const schemaContext = new OrderSchema;
        const isValid = schemaContext.isValid(body);
        if (!isValid) {
            throw new Error(schemaContext.validate(body))
        }
        return await super.post(path, body);
    }   

    /**
     * @function put Method to update a order item.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce order object
     * @throws YUP Validation error message
     */
    static async put(path, body){
        const schemaContext = new OrderSchema;
        const isValid = schemaContext.isValid(body);
        if (!isValid) {
            throw new Error(schemaContext.validate(body))
        }
        return await super.put(path, body);
    }   

    /**
     * @function delete Method to eliminate a order item. Maybe need body with force delete specification 
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce order object
     * @throws YUP Validation error message
     */
    static async delete(path, body){
        const schemaContext = new OrderSchema;
        const isValid = schemaContext.isValid(body, true);
        if (!isValid) {
            throw new Error(schemaContext.validate(body, true))
        }
        return await super.delete(path, body);
    }   
}

/**
 * @exports WooOrders Class WooOrders without instancing
 */
module.exports = {
    WooOrders,
};
  