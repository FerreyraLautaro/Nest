/**
 * @module WooController
 * @description All service and additional external dependencies to interconect with Woocommerce
 * @requires WooService
 */

// Requiring dependencies
const { WooService } = require('_services/woocommerce');

/**
 * @class WooController
 * @description Class container with controllers and additional function to manage datasets of Woocommerce
 * @extends WooController
 */

class WooController {

    constructor() {}

    /**
     * @function get Can retrieve dataset in list or element format. Connection are realized directly to woocommerce instance.
     * @param {String} path Path query destination 
     * @returns Woocommerce dataset object
     * @throws Woocommerce error object
     */
    static async get(path){
        return await WooService.get(path);
    }    

    /**
     * @function post Can send dataset to create new element. Connection are realized directly to woocommerce instance.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce dataset object
     * @throws Woocommerce error object
     */
    static async post(path, body){
        return await WooService.post(path, body)
    }   

    /**
     * @function put Can send dataset to update existing element. Connection are realized directly to woocommerce instance.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce dataset object
     * @throws Woocommerce error object
     */
    static async put(path, body){
        return await WooService.put(path, body);
    }   

    /**
     * @function delete Can sent deletion order for an element. Maybe need body with force delete specification. Connection are realized directly to woocommerce instance.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Woocommerce dataset object
     * @throws Woocommerce error object
     */
    static async delete(path, body){
        return await WooService.delete(path, body);
    }   
}

/**
 * @exports WooController Class Woocommerce core controller without instancing
 */
module.exports = {
    WooController,
  };
  