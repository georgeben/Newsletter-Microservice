const { createContainer, asClass, asValue, asFunction } = require('awilix');
const jwt = require('jsonwebtoken');
const subscriber = require('./models/subscriber.model');
const subscriberRepository = require('./repository/subscriberRepository');
const config = require('./config')[process.env.NODE_ENV || 'development'];
const messageBroker = require('./config/messageBroker');
const constants = require('./utils/constants');

const container = createContainer();

// Creates a resolver that returns a function which, when called, resolves the registration name
function asAliasFactory(registrationName) {
  return {
    resolve(cn) { // cn = container
      return () => cn.resolve(registrationName);
    },
  };
}

container.register({
  Subscriber: asValue(subscriber),
  subscriberRepository: asClass(subscriberRepository).scoped(),
  jwt: asValue(jwt),
  config: asValue(config),
  messageBroker: asFunction(messageBroker)
    .singleton()
    .disposer((p) => p.then((c) => c.close())),
  getRabbitConnection: asAliasFactory('messageBroker'),
  constants: asValue(constants),
});


module.exports = container;
