const { createContainer, asValue, asClass } = require('awilix');
const axios = require('axios');
const config = require('./config');
const SubscriberService = require('./services/subscribers.services');
const ServiceRegistry = require('./services/registry.services');
const CircuitBreaker = require('./utils/CircuitBreaker');

const container = createContainer();

container.register({
  axios: asValue(axios),
  config: asValue(config),
  subscriberService: asClass(SubscriberService).scoped(),
  serviceRegistry: asClass(ServiceRegistry).scoped(),
  circuitBreaker: asClass(CircuitBreaker).scoped(),
});

module.exports = container;
