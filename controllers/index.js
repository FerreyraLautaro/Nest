/**
 * Requiering dependencies
 */
const DirLoad = require('dir-load');
const path = require('path');
const { forEach, assign, keys, first, capitalize } = require('lodash');
const { info } = require('_config');

/**
 * @function filter
 * @param {Object} item file detected by DirLoad extension
 * @description Callback function for filter files to be loaded be autoload configurations
 */
const filter = (item) => {
  if (path.basename(item.path) === 'index.js') {
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
  info(`Controller loaded: ${capitalize(first(keys(item)))}`);
});
module.exports = modules;
