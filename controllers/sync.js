/**
 * @module Sync
 * @description Synchronization funcions and methods for automated jobs
 */

/**
 * 3thParty dependencies
 * @requires axios
 * @requires lodash/set
 * @requires lodash/map
 */
const {axios} = require('_config/axios');
const { set, map, head, toNumber, filter } = require('lodash');

/**
 * Code Dependencies
 * @requires _services/sync
 * @requires _schemas/sync
 * @requires _schemas/wooProducts/ProductSchema
 */

const { service, getEquivalency } = require('_services/sync')
const {ProductSchema} = require('_schemas/wooProducts')
const {CategorySchema} = require('_schemas/wooCategories')
const { schema } = require('_schemas/sync')

/**
 * Helpers used
 * @requires _helpers/parser
 */
const { getResponseData } = require('_helpers/parser')


/**
 * @class SyncController
 * @description Class container with controllers and additional function to sync Flexxus with WooCommerce instances
 */

class SyncController {

    constructor(){}

    /**
     * @function categories Method to sync categories
     * @returns {Boolean} true if all sync it's fine, false if an error as ocurred
     */

    static async categories() {
        const flxCategories = await axios.get(`/flexxus/categories`)
        const flxCategoriesList = getResponseData(flxCategories).data;
        const result = map(filter(flxCategoriesList, i => i.ACTIVO === 1), async item => {
            const category = schema.categories(item);
            let parent = await service.getEquivalency('categories', category.parent)
            set(category, 'parent', parent)
            const schemaContext = new CategorySchema;
            const isValid = schemaContext.isValid(category);
            if (!isValid) {
                throw new Error(schemaContext.validate(category))
            }

            const exist = await service.getEquivalency('categories', item.CODIGOCATEGORIA)

            if (exist) {
                const wooCategory = await axios.put(`/woo/categories/${exist}`, category)
                return;
            }
            const wooCategory = await axios.post(`/woo/categories`, category)
            const relations = await service.saveRelation('categories', {
                flx_id: item.CODIGOCATEGORIA,
                woo_id: getResponseData(wooCategory).id
            })
            return relations
        })
        return await Promise.all(result)
    }


     /**
     * @function products Method to sync products
     * @returns {Boolean} true if all sync it's fine, false if an error as ocurred
     */

    static async products() {
        const flxProducts = await axios.get(`/flexxus/products`)
        const flxProductsList = getResponseData(flxProducts).data;
        const result = map(filter(flxProductsList, i => i.ACTIVO === 1), async item => {
            const product = schema.products(item);
            let parent = await service.getEquivalency('categories', head(product.categories).id)
            set(head(product.categories), 'id', toNumber(parent))
            const schemaContext = new ProductSchema;
            const isValid = schemaContext.isValid(product);
            if (!isValid) {
                throw new Error(schemaContext.validate(product))
            }

            const exist = await service.getEquivalency('products', item.ID_ARTICULO)

            if (exist) {
                const wooProduct = await axios.put(`/woo/products/${exist}`, product)
                return;
            }
            const wooProduct = await axios.post(`/woo/products`, product)
            const relations = await service.saveRelation('products', {
                flx_id: item.ID_ARTICULO,
                woo_id: getResponseData(wooProduct).id
            })
            return relations
        })
        return await Promise.all(result)
    }
}

/**
 * @exports sync from class SyncController without instancing
 */
module.exports = {
    sync: SyncController,
};