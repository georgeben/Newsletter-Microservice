const axios = require('axios');
const { serviceName, serviceRegistryUrl, serviceVersion, port } = require('../config');

module.exports = async function () {
  return axios.delete(`${serviceRegistryUrl}/register`, {
    data: {
      name: serviceName,
      version: serviceVersion,
      port,
    },
  });
};
