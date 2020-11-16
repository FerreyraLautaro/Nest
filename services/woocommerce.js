/**
 * @module WooService
 * @description An instantiation for Woocommerce REST API Client
 * @requires @woocommerce/woocommerce-rest-api
 * @requires config
 */

// Requiring dependencies
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const { WooConfig } = require('_config');

/**
 * @const {WooCommerceRestApi} WooService Initialize and export WooCommerce REST API Client
 */
const WooService = new WooCommerceRestApi(WooConfig);

/**
 * @exports WooService An instance of Woocommerce REST API based on specific configuration
 */
module.exports = { WooService };
