const axios = require('axios');
const { serviceName, serviceRegistryUrl, serviceVersion, port } = require('../config')[process.env.NODE_ENV || 'development'];

module.exports = async function () {
  return axios.put(`${serviceRegistryUrl}/register`, {
    name: serviceName,
    version: serviceVersion,
    port,
  });
};
