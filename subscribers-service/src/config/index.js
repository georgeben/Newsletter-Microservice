const commonConfig = {
  serviceName: process.env.SERVICE_NAME,
  serviceVersion: process.env.SERVICE_VERSION,
  port: process.env.PORT || 3002,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = {
  development: {
    ...commonConfig,
    databaseUrl: process.env.DEV_DATABASE_URL,
    serviceRegistryUrl: process.env.DEV_SERVICE_REGISTRY_URL,
  },
  production: {
    ...commonConfig,
    databaseUrl: process.env.DATABASE_URL,
  },
  test: {
    ...commonConfig,
    databaseUrl: process.env.TEST_DATABASE_URL,
  },
};
