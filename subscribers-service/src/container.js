const { createContainer, asClass, asValue } = require('awilix');
const jwt = require('jsonwebtoken');
const subscriber = require('./models/subscriber.model');
const subscriberRepository = require('./repository/subscriberRepository');
const config = require('./config')[process.env.NODE_ENV || 'development'];

const container = createContainer();

container.register({
  Subscriber: asValue(subscriber),
  subscriberRepository: asClass(subscriberRepository).scoped(),
  jwt: asValue(jwt),
  config: asValue(config),
});


module.exports = container;
