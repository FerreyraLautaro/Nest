/**
 * @module Sync
 * @memberof Schemas
 * @description Synchronization schema functionalities
 * @requires lodash/replace
 * @requires lodash/lowerCase
 */

// Requiring dependencies
const { replace, lowerCase, toString } = require("lodash");
// const { FLX_IMAGES_HOSTNAME } = process.env
const { STOCK_TO_SYNC } = process.env

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

// }


/**
 * @function products
 * @description Map JSON input object to format as WooCommerce REST Service need
 * @param {JSON} params 
 * @property {string} params.NOMBRE Needed to set *name* attribute of woocommerce category object
 * @property {string} params.ID_PADRE Needed to set *parent* attribute of woocommerce category object
 * @returns {JSON} 
 * @example {
 *    "id": "",
 *    "name": "Producto",
 *    "slug": "producto",
 *    "type": "simle",
 *    "status": "publish",
 *    "description": "description larga",
 *    "short_description": "desc corta",
 *    "sku": "00022",
 *    "price": "22.16",
 *    "regular_price": "22.16",
 *    "sale_price": "22.16",
 *    "stock_quantity": "16",
 *    "stock_status": "instock",
 *    "categories": [{"id":214}],
 *    "images": []
 * }
 */
    static products(params){
        return {
            name: toString(params.NOMBRE),
            slug: toString(replace(lowerCase(params.NOMBRE), / /g, '-')),
            type: toString("simple"),
            status: toString("publish"),
            description: toString(params.DESCRIPCIONLARGA),
            short_description: toString(params.DESCRIPCIONCORTA ),
            sku: toString(params.CODIGO_PRODUCTO),
            price: toString(params.PRECIOVENTA),
            regular_price: toString(params.PRECIOVENTA),
            manage_stock: true,
            stock_quantity: toString(params[STOCK_TO_SYNC]),
            categories: [{id: toString(params.CODIGO_CATEGORIA)}],
            // images: [src: `${FLX_IMAGES_HOSTNAME}/${params.FOTO}`]
        }
    }

}

/**
 * @exports schema from Sync class without instancing
 */
module.exports = {
    schema: Sync,
};
  