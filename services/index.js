/**
 * @module Autoloader
 * @requires path Native
 * @requires dirLoad From external library
 * @requires lodash From external library
 * @requires lodash/forEach From external library
 * @requires lodash/assign From external library
 * @requires lodash/keys From external library
 * @requires lodash/first From external library
 * @requires lodash/capitalize From external library
 * @requires lodash/includes From external library
 * @requires config/log/info From internal library
 */


// Requiring dependencies
const DirLoad = require('dir-load');
const path = require('path');
const { forEach, assign, keys, first, capitalize, includes } = require('lodash');
const { info } = require('_config');

/**
 * @function filter
 * @param {Object} item file detected by DirLoad extension
 * @description Callback function for filter files to be loaded be autoload configurations
 */
const filter = (item) => {
  const excludes = [
    'index.js'
  ]
  if (includes(excludes, path.basename(item.path))) {
    return false;
  }
  return true;
};

/**
 * Configuration object for DirLoad extension
 */
const dirLoadConfig = {
  includedExtensions: '.js',
  loadAsync: false,
  loadRecursive: true,
  filter: (input) => filter(input),
};

/**
 * Loading configurations files
 */
const modulesFound = new DirLoad(__dirname, dirLoadConfig);

/**
 * Generating exportable configurations modules
 */
const modules = {};
const modulesRequired = modulesFound.requireAll();
const loop = forEach(modulesRequired, (item) => {
  assign(modules, modules, item);
  info(`Service loaded: ${capitalize(first(keys(item)))}`);
});
module.exports = modules;
