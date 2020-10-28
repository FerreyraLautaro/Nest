/**
 * Requiering dependencies
 */
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const { WooConfig } = require('_config');

/**
 * Initialize and export WooCommerce REST API Client
 */
const WooController = new WooCommerceRestApi(WooConfig);

module.exports = { WooController };
