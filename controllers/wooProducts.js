/**
 * @module WooProducts
 * @description All controllers and additional function to manage dataset for product products of Woocommerce
 * @requires WooController
 * @requires ProductSchema
 */

// Requiring dependencies
const { WooController } = require('_controllers/woocommerce');
const {ProductSchema} = require('_schemas/wooProducts')


/**
 * @class WooProducts
 * @description Class container with controllers and additional function to manage dataset for product products of Woocommerce
 * @extends WooController
 */

class WooProducts extends WooController {
    constructor(){
    }

    /**
     * @function post Method to create a product item.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce product object
     * @throws YUP Validation error message
     */
    static async post(path, body){
        const schemaContext = new ProductSchema;
        const isValid = schemaContext.isValid(body);
        if (!isValid) {
            throw new Error(schemaContext.validate(body))
        }
        return await super.post(path, body);
    }   

    /**
     * @function put Method to update a product item.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce product object
     * @throws YUP Validation error message
     */
    static async put(path, body){
        const schemaContext = new ProductSchema;
        const isValid = schemaContext.isValid(body);
        if (!isValid) {
            throw new Error(schemaContext.validate(body))
        }
        return await super.put(path, body);
    }   

    /**
     * @function delete Method to eliminate a product item. Maybe need body with force delete specification 
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce product object
     * @throws YUP Validation error message
     */
    static async delete(path, body){
        const schemaContext = new ProductSchema;
        const isValid = schemaContext.isValid(body, true);
        if (!isValid) {
            throw new Error(schemaContext.validate(body, true))
        }
        return await super.delete(path, body);
    }   
}

/**
 * @exports WooProducts Class WooProducts without instancing
 */
module.exports = {
    WooProducts,
};
  