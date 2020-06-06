const commonConfig = {
  serviceVersion: '1.x.x',
  services: {
    SUBSCRIBERS: 'subscribers',
  },
  failureThreshold: 5, // The maximum time a request to a service should fail
  failureTimeout: 1,

};

module.exports = {
  development: {
    ...commonConfig,
    serviceRegistryUrl: 'http://localhost:3001',
  },
}[process.env.NODE_ENV || 'development'];
