
/**
 * @module SyncService
 * @description An instantiation for Sync REST callable server-client
 * @requires _config/error
 * @requires _config/knex
 * @requires lodash/toString
 * @requires lodash/head
 * @requires lodash/size
 */

// Requiring dependencies
const { error } = require('_config');
const {knex}  = require('_config/knex');
const { toString, head, size } = require('lodash');

/**
 * @class SyncService
 * @description Class with all method and functions for do Sync server-client functionally 
 */

class SyncService {

    constructor() {}

    /**
     * @function getEquivalency Method to sync categories
     * @param {String} table Table on database to be querying
     * @param {String} id ID value of flexxus object for which the equivalent woocommerce ID is needed
     * @returns {Knex} knex querying instance
     * @throws {string} Knex or Database error on string format. Additionally, this is logged.
     */
    static async getEquivalency(table, id) {
        try {
            const res = await knex.select('woo_id').from(table).where('flx_id', id)
            return size(res) !== 0 ? head(res).woo_id : 0 // This line validate if the response have any content; if this have, return the woo_id value, if not return 0
        } catch (error) {
            error(toString(err));
            return toString(err);
        }
    }

    /**
     * @function getEquivalency Method to sync categories
     * @param {String} table Table on database to be querying
     * @param {Array} values List a object {key: value} for send to database
     * @property {string} value.key Column name on database
     * @property {string} value.value Column value for an specific column on database
     * @returns {Knex} knex querying instance
     * @throws {string} Knex or Database error on string format. Additionally, this is logged.
     */
    static async saveRelation(table, values) {
        try {
            return await knex.insert(values).into(table);
        } catch (err) {
            error(toString(err));
            return toString(err);
        }

    }


}

/**
 * @exports service from SyncService class without instantiation
 */
module.exports = {service: SyncService};