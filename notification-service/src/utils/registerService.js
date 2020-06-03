const axios = require('axios');
const { serviceName, serviceRegistryUrl, serviceVersion, port } = require('../config');

module.exports = async function () {
  return axios.put(`${serviceRegistryUrl}/register`, {
    name: serviceName,
    version: serviceVersion,
    port,
  });
};
