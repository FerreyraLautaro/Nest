/**
 * @module Sync
 * @memberof Schemas
 * @description Synchronization schema functionalities
 * @requires lodash/replace
 * @requires lodash/lowerCase
 */

// Requiring dependencies
const { replace, lowerCase } = require("lodash");


/**
 * @class Sync
 * @description Class container with controllers and additional function for doing Sync module fully functionally 
 */
class Sync {
    
    constructor(){}


/**
 * @function categories
 * @description Map JSON input object to format as WooCommerce REST Service need
 * @param {JSON} params 
 * @property {string} params.NOMBRE Needed to set *name* attribute of woocommerce category object
 * @property {string} params.ID_PADRE Needed to set *parent* attribute of woocommerce category object
 * @returns {JSON} 
 * @example {"name": "Una Categoria", "slug": "una-categoria", "parent": 0}
 */
    static categories(params){
        return {
            name: params.NOMBRE,
            slug: replace(lowerCase(params.NOMBRE), / /g, '-'),
            parent: params.ID_PADRE
        }
    }

}

/**
 * @exports schema from Sync class without instancing
 */
module.exports = {
    schema: Sync,
};
  