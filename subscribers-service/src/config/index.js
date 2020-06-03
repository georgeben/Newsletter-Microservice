const commonConfig = {
  serviceName: process.env.SERVICE_NAME,
  serviceVersion: process.env.SERVICE_VERSION,
  port: process.env.PORT || 3002,
  jwtSecret: process.env.JWT_SECRET,
  notificationQueueName: process.env.NOTIFICATION_QUEUE_NAME,
};

module.exports = {
  development: {
    ...commonConfig,
    databaseUrl: process.env.DEV_DATABASE_URL,
    serviceRegistryUrl: process.env.DEV_SERVICE_REGISTRY_URL,
    rabbitMQHostname: process.env.RABBITMQ_HOSTNAME_DEV,
    rabbitMQPort: process.env.RABBITMQ_PORT_DEV,
    rabbitMQUsername: process.env.RABBITMQ_USERNAME_DEV,
    rabbitMQPassword: process.env.RABBITMQ_PASSWORD_DEV,
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
