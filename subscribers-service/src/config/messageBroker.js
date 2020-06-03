const amqplib = require('amqplib');

module.exports = function ({ config }) {
  return amqplib.connect(
    {
      protocol: 'amqp',
      hostname: config.rabbitMQHostname,
      port: config.rabbitMQPort,
      username: config.rabbitMQUsername,
      password: config.rabbitMQPassword,
      locale: 'en_US',
      frameMax: 0,
      heartbeat: 0,
      vhost: '/',
    },
  );
};
