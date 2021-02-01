/**
 * @module Sync
 * @memberof Controllers
 * @description Flexxus functions and methods for manipulate orders
*/

const {FlexxusController} = require('_controllers/flexxus');
const {flxOrder} = require('_schemas/flxOrders')
/**
 * @class FlexxusOrders
 * @extends FlexxusController
 * @description Class container with controllers and additional function to manipulate orders with Flexxus
 */



class FlexxusOrders extends FlexxusController {

    constructor() {}

    static async post(path, body){
        const schemaContext = new flxOrder;
        const isValid = schemaContext.isValid(body);
        if (!isValid) {
            throw new Error(schemaContext.validate(body))
        }
        return await super.post(path, body);
    }   

}

/**
 * @exports FlexxusOrders
 */
module.exports = {
    FlexxusOrders
};
