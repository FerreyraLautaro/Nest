/**
 * @module Sync
 * @memberof Controllers
 * @description Flexxus functions and methods
 * @requires _services/flexxus
 */

// Requiring dependencies
const {FlexxusService} = require('_services/flexxus')

/**
 * @class FlexxusController
 * @description Class container with controllers and additional function to interact with Flexxus
 */
class FlexxusController {

    constructor() {}

    /**
     * @function ping
     * @description This function test connection with configured Flexxus instance
     */
    static async ping(){
        return await FlexxusService.ping();
    }    

     /**
     * @function get
     * @param {string} path Endpoint to be consulted for get data
     * @description This function get data content from endpoints of configured Flexxus instance
     */
    static async get(path){
        return FlexxusService.get(path);
    }    


     /**
     * @function post Can send dataset to create new element. Connection are realized directly to flexxus instance.
     * @param {String} path Path query destination
     * @param {JSON} body Relative content according to the action to execute
     * @returns Flexxus dataset object
     * @throws Flexxus error object
     */
    static async post(path, body){
        return await FlexxusService.post(path, body)
    }   

}

/**
 * @exports FlexxusController
 */
module.exports = {
    FlexxusController
};
