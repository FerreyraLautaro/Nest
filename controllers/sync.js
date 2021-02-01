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
const { axios } = require('_config/axios');
const { set, map, head, toNumber, filter, toString, includes } = require('lodash');

/**
 * Code Dependencies
 * @requires _services/sync
 * @requires _schemas/sync
 * @requires _schemas/wooProducts/ProductSchema
 */

const { service, getEquivalency } = require('_services/sync');
const { ProductSchema } = require('_schemas/wooProducts');
const { CategorySchema } = require('_schemas/wooCategories');
const { schema } = require('_schemas/sync');
const { flxOrder } = require('_schemas/flxOrders');

/**
 * Helpers used
 * @requires _helpers/parser
 */
const { getResponseData } = require('_helpers/parser');


/**
 * @class SyncController
 * @description Class container with controllers and additional function to sync Flexxus with WooCommerce instances
 */

class SyncController {

    constructor() { }

    /**
     * @function categories Method to sync categories
     * @returns {Boolean} true if all sync it's fine, false if an error as ocurred
     */

    static async categories() {
        const flxCategories = await axios.get(`/flexxus/categories`);
        const flxCategoriesList = getResponseData(flxCategories).data;
        const result = map(filter(flxCategoriesList, i => i.ACTIVO === 1), async item => {
            const category = schema.categories(item);
            let parent = await service.getEquivalency('categories', 'woo_id', 'flx_id', category.parent);
            set(category, 'parent', parent);
            const schemaContext = new CategorySchema;
            const isValid = schemaContext.isValid(category);
            if (!isValid) {
                throw new Error(schemaContext.validate(category));
            }

            const exist = await service.getEquivalency('categories', 'woo_id', 'flx_id', item.CODIGOCATEGORIA);

            if (exist) {
                const wooCategory = await axios.put(`/woo/categories/${exist}`, category);
                return;
            }
            // const wooCategory = 
            return axios.post(`/woo/categories`, category)
                .then(async wooCategory => {
                    const relations = await service.saveRelation('categories', {
                        flx_id: item.CODIGOCATEGORIA,
                        woo_id: getResponseData(wooCategory).id
                    });
                    // return relations
                })
                .catch(err => {throw new Error(toString(err))});
        });
        return await Promise.all(result);
    }


    /**
    * @function products Method to sync products
    * @returns {Boolean} true if all sync it's fine, false if an error as ocurred
    */

    static async products() {
        const flxProducts = await axios.get(`/flexxus/products`);
        const flxProductsList = getResponseData(flxProducts).data;
        const result = map(filter(flxProductsList, i => i.ACTIVO === 1), async item => {
            const product = schema.products(item);
            let parent = await service.getEquivalency('categories', 'woo_id', 'flx_id', head(product.categories).id);
            set(head(product.categories), 'id', toNumber(parent));
            const schemaContext = new ProductSchema;
            const isValid = schemaContext.isValid(product);
            if (!isValid) {
                throw new Error(schemaContext.validate(product));
            }

            const exist = await service.getEquivalency('products', 'woo_id', 'flx_id', item.ID_ARTICULO);

            if (exist) {
                try {
                    const wooProduct = await axios.put(`/woo/products/${exist}`, product);
                return;    
                } catch (error) {
                }
                
            }
            // const wooProduct = await
            return axios.post(`/woo/products`, product)
                .then(async wooProduct => {
                    const relations = await service.saveRelation('products', {
                        flx_id: item.ID_ARTICULO,
                        woo_id: getResponseData(wooProduct).id
                    });
                    return relations;
                })
                .catch(err => {throw new Error(toString(err))});
        });
        return await Promise.all(result);
    }


    /**
    * @function orders Method to sync orders
    * @returns {Boolean} true if all sync it's fine, false if an error as ocurred
    */

    static async orders() {
        const wooOrders = await axios.get(`/woo/orders`);
        const wooOrdersList = getResponseData(wooOrders);
        const wooOrdersListIds = map(wooOrdersList, i => toString(i.id));
        const synchronizedOrdersList = await service.getSynchronizedList('orders');
        const notSynchronizedOrdersList = filter(wooOrdersList, i => !includes(synchronizedOrdersList, toString(i.id)));
        const result = map(notSynchronizedOrdersList, async item => {
            const preOrder = schema.orders(item);
            const products = await Promise.all(map(preOrder.cart.products, async item => {
                const product_id = await service.getEquivalency('products', 'flx_id', 'woo_id', item.product_id);
                // FIXME: Agregar calculo de precio sin IVA, incluir en la tabla de relaciones.
                // FIXME: Agregar condicion de estado de pedido: Completado (Variabilizar)
                set(item, 'product_id', product_id);
                return item;
            }));
            const state_id = await service.getEquivalency('states', 'flx_id', 'woo_id', preOrder.cart.customer.state_id);
            set(preOrder.cart.customer, 'state_id', state_id);
            const order = preOrder;
            set(order.cart, 'products', products);

            const schemaContext = new flxOrder;
            const isValid = schemaContext.isValid(order);
            if (!isValid) {
                throw new Error(schemaContext.validate(order));
            }
            
            return axios.post(`/flexxus/orders`, order)
                .then(async res => {
                    return await service.saveRelation('orders', {
                        flx_id: getResponseData(res).orderId,
                        woo_id: item.id
                    });
                })
                .catch(err => {throw new Error(toString(err))});
        });
        return await Promise.all(result);
    }
}

/**
 * @exports sync from class SyncController without instancing
 */
module.exports = {
    sync: SyncController,
};