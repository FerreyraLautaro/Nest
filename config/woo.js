/**
 * Getting WooCommerce environment variables
 */
const { WOO_HOSTNAME, WOO_KEY, WOO_SECRET, WOO_API, WOO_VERSION } = process.env;

/**
 * Configuration object for WooCommers API Client and export it
 */
const WooConfig = {
  url: WOO_HOSTNAME,
  consumerKey: WOO_KEY,
  consumerSecret: WOO_SECRET,
  wpAPI: WOO_API,
  version: WOO_VERSION,
};

module.exports = { WooConfig };
