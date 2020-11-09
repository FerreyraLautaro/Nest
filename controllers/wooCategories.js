/**
 * @module WooCategories
 * @description All controllers and additional function to manage dataset for product categories of Woocommerce
 * @requires WooController
 * @requires CategorySchema
 */

// Requiring dependencies
const { WooController } = require('_controllers/woocommerce');
const {CategorySchema} = require('_schemas/wooCategories')


/**
 * @class WooCategories
 * @description Class container with controllers and additional function to manage dataset for product categories of Woocommerce
 * @extends WooController
 */

class WooCategories extends WooController {
    constructor(){
    }

    /**
     * @function post Method to create a category item.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce category object
     * @throws YUP Validation error message
     */
    static async post(path, body){
        const schemaContext = new CategorySchema;
        const isValid = schemaContext.isValid(body);
        if (!isValid) {
            throw new Error(schemaContext.validate(body))
        }
        return await super.post(path, body);
    }   

    /**
     * @function put Method to update a category item.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce category object
     * @throws YUP Validation error message
     */
    static async put(path, body){
        const schemaContext = new CategorySchema;
        const isValid = schemaContext.isValid(body);
        if (!isValid) {
            throw new Error(schemaContext.validate(body))
        }
        return await super.put(path, body);
    }   

    /**
     * @function delete Method to eliminate a category item. Maybe need body with force delete specification 
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce category object
     * @throws YUP Validation error message
     */
    static async delete(path, body){
        const schemaContext = new CategorySchema;
        const isValid = schemaContext.isValid(body, true);
        if (!isValid) {
            throw new Error(schemaContext.validate(body, true))
        }
        return await super.delete(path, body);
    }   
}

/**
 * @exports WooCategories Class WooCategories without instancing
 */
module.exports = {
    WooCategories,
};
  