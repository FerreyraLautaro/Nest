/**
 * @module FlexxusConfig
 * @description All configuration to instance Flexxus interaction
 * @requires axios
 * @requires qs
 * @requires lodash/toString
 */

// Requiring dependencies
const axios = require('axios');
const qs = require('qs');
const toString = require('lodash/toString');


/** @constant {String} FLX_HOSTNAME Configuration Flexxus object */
/** @constant {String} FLX_AUTH Configuration Flexxus object */
/** @constant {String} FLX_USERNAME Configuration Flexxus object */
/** @constant {String} FLX_PASSWORD Configuration Flexxus object */
/** @constant {String} FLX_API Configuration Flexxus object */
/** @constant {String} FLX_DEVICE_INFO Configuration Flexxus object */
const {
    FLX_HOSTNAME,
    FLX_AUTH,
    FLX_USERNAME,
    FLX_PASSWORD,
    FLX_API,
    FLX_DEVICE_INFO
} = process.env;


/**
 * @constant {JSON} data Authentication object
 * @property {String} FLX_USERNAME Username for connection
 * @property {String} FLX_PASSWORD Password for connection
 * @property {String} FLX_DEVICE_INFO Device Information for connection
 */
const data = qs.stringify({
    'username': `${FLX_USERNAME}`,
    'password': `${FLX_PASSWORD}`,
    'deviceinfo': `${FLX_DEVICE_INFO}`
});

/**
 * @constant {JSON} data Authentication request object
 * @property {String} method HTTP method used for login
 * @property {String} url HTTP uri used for login
 * @property {String} headers HTTP headers needed for login
 * @property {JSON} data HTTP body with authentication configuration for login
 */
const config = {
    method: 'post',
    url: `${FLX_HOSTNAME}/${FLX_API}/${FLX_AUTH}`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
};

/**
 * @constant {Axios} flexxus Axios Base configuration for requests
 */
const flexxus = axios.create({
  baseURL: `${FLX_HOSTNAME}/${FLX_API}/`,
  responseType: 'json'
})

/**
 * @var {String} Token Authentication non-prefixed bearer token
 */
let token = null;

/**
 * @function Axios
 * @description Requesting Flexxus login for get authentication token
 * @param {JSON} config Object with authentication configuration
 * @returns {String} Non-prefixed bearer token
 * @throws {String} Axios throw converted on string
 */
axios(config)
    .then(function(response) {
        token = response.data.token;
    })
    .catch(function(error) {
        console.log(error);
    })

// Adding request interceptor with Authentication header. Used prefixed bearer token
flexxus.interceptors.request.use( async (config) => {
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// Adding response interceptor
flexxus.interceptors.response.use((response) => {
    return response
  },
  (error) => {
  }
)

/**
 * @function flexxusPing
 * @description Get Flexxus connection by authentication method
 * @returns {AxioxResponse}
 * @throws Axios throw converted on string
 */
const flexxusPing = async () => await axios.request(config)
.then(function(response) {
    return response;
})
.catch(function(error) {
    return toString(error);
})

/**
 * @exports flexxus flexxus pre-configured instance
 * @exports flexxusPing flexxus pre-established instance
 */
module.exports = { flexxus , flexxusPing };
