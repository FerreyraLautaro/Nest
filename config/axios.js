/**
 * @module AxiosConfig
 * @description All configuration to instance Axiox HTTP CLI
 * @requires axios
 */
const axios = require('axios')

/** @constant {String} SYNC_HOSTNAME Configuration Sync object */
/** @constant {String} SYNC_PORT Configuration Sync object */
const {
    SYNC_HOSTNAME,
    SYNC_PORT
} = process.env

/** @constant {Axios} instance Axios instanced */

const instance = axios.create({
  baseURL: `${SYNC_HOSTNAME}:${SYNC_PORT}/`,
  responseType: 'json'
})

// Define default headers for HTTP methods (POST, PUT, DELETED) 
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers.put['Content-Type'] = 'application/json';
instance.defaults.headers.delete['Content-Type'] = 'application/json';

// Generate request interceptor 
instance.interceptors.request.use((config) => {
  return config
})

// Generate response interceptor 
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
      return Promise.reject(error)
  }
)

/**
 * @exports axios from instance constant
 */
module.exports = {
    axios: instance,
};