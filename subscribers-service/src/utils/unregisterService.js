const axios = require('axios');
const { serviceName, serviceRegistryUrl, serviceVersion, port } = require('../config')[process.env.NODE_ENV || 'development'];

module.exports = async function () {
  return axios.delete(`${serviceRegistryUrl}/register`, {
    data: {
      name: serviceName,
      version: serviceVersion,
      port,
    },
  });
};
