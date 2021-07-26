
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
const { toString, head, size, map } = require('lodash');

/**
 * @class SyncService
 * @description Class with all method and functions for do Sync server-client functionally 
 */

class SyncService {

    constructor() {}

    /**
     * @function getEquivalency Method to sync categories
     * @param {String} table Table on database to be querying
     * @param {String} to Field or column on database, equivalent
     * @param {String} from Field or column on database what need equivalency
     * @param {String} id ID value of flexxus object for which the equivalent woocommerce ID is needed
     * @returns {Knex} knex querying instance
     * @throws {string} Knex or Database error on string format. Additionally, this is logged.
     */
    static async getEquivalency(table, to, from, id) {
        try {
            const res = await knex.select(to).from(table).where(from, id)
            return size(res) !== 0 ? head(res)[to] : 0 // This line validate if the response have any content; if this have, return the woo_id value, if not return 0
        } catch (err) {
            error(toString(err));
            return toString(err);
        }
    }

    /**
     * @function getEquivalencyList Method to sync products
     * @param {String} table Table on database to be querying
     * 
     * @returns {Knex} knex querying instance
     * @throws {string} Knex or Database error on string format. Additionally, this is logged.
     */
     static async getEquivalencyList(table) {
        try {
            const res = await knex.select().from(table)
            return size(res) !== 0 ? res : 0
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

    /**
     * @function getSynchronizedList Method to get a list of synchronized objects
     * @param {String} table Table on database to be querying
     * @returns {Knex} knex querying instance
     * @throws {string} Knex or Database error on string format. Additionally, this is logged.
     */
    static async getSynchronizedList(table) {
        try {
            const res = await knex.select('woo_id').from(table)
            return map(res, i => i.woo_id) 
        } catch (error) {
            error(toString(err));
            return toString(err);
        }
    }

}

/**
 * @exports service from SyncService class without instantiation
 */
module.exports = {service: SyncService};