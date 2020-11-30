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
const { set, map } = require('lodash');

/**
 * Code Dependencies
 * @requires _services/sync
 * @requires _schemas/sync
 * @requires _schemas/wooCategories/CategorySchema
 */

const { service, getEquivalency } = require('_services/sync')
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
        const result = map(flxCategoriesList, async item => {
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
}

/**
 * @exports sync from class SyncController without instancing
 */
module.exports = {
    sync: SyncController,
};