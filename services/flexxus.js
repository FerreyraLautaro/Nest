/**
 * @module FlexxusService
 * @description An instantiation for Flexxus REST Client
 * @requires config/flexxus
 */

// Requiring dependencies
const {
    flexxus,
    flexxusPing
} = require('_config/flexxus');
const set = require('lodash/set')
const toString = require('lodash/toString')

/**
 * @class FlexxusService
 * @description Initialize and export Flexxus REST Client
 */
class Service {

    constructor() {}
// TODO: Docs
    async ping() {
        return flexxusPing()
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return toString(err);
            })
    }
// TODO: Docs
    async get(path) {
        return await flexxus.get(path)
            .then(response => {
              return response.data;
            })
            .catch(err => {
              return toString(err);
            })
    }
}


// Instancing Flexxus Service and export it
const FlexxusService = new Service()

/**
 * @exports FlexxusService
 */
module.exports = {
    FlexxusService
};
