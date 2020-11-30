/**
 * @module Helpers
 * @description All helpers for do easy the coding 
 */


/**
 * @function getResponseData
 * @description Parse sync response interface to get response object
 * @param {JSON} param Sync response interface
 */
const getResponseData = (param) => {
    return param.data.response
}

/**
 * @function getResponseData
 * @description Parse sync response interface to get response object
 * @param {JSON} param Sync response interface
 */
const getErrorData = (param) => {
    return param.data.error
}

module.exports = {
    getResponseData,
    getErrorData
};