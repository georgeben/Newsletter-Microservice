const commonConfig = {
  serviceName: process.env.SERVICE_NAME,
  serviceVersion: process.env.SERVICE_VERSION,
  port: process.env.PORT || 3003,
  jwtSecret: process.env.JWT_SECRET,
  notificationQueueName: process.env.NOTIFICATION_QUEUE_NAME,
};

module.exports = {
  development: {
    ...commonConfig,
    serviceRegistryUrl: process.env.DEV_SERVICE_REGISTRY_URL,
    rabbitMQHostname: process.env.RABBITMQ_HOSTNAME_DEV,
    rabbitMQPort: process.env.RABBITMQ_PORT_DEV,
    rabbitMQUsername: process.env.RABBITMQ_USERNAME_DEV,
    rabbitMQPassword: process.env.RABBITMQ_PASSWORD_DEV,
  },
  production: {
    ...commonConfig,
  },
  test: {
    ...commonConfig,
  },
}[process.env.NODE_ENV || 'development'];
