const { createContainer, asFunction, asValue, asClass } = require('awilix');
const mailer = require('./utils/mailer');
const mailerService = require('./services/mailer.services');
const messageBroker = require('./config/messageBroker');
const config = require('./config');
const constants = require('./utils/constants');

const container = createContainer();

function asAliasFactory(registrationName) {
  return {
    resolve(cont) {
      return () => cont.resolve(registrationName);
    },
  };
}

container.register({
  mailer: asValue(mailer),
  mailerService: asClass(mailerService).scoped(),
  messageBroker: asFunction(messageBroker)
    .singleton()
    .disposer((p) => p.then((c) => c.close())),
  getMessageBrokerConnection: asAliasFactory('messageBroker'),
  config: asValue(config),
  constants: asValue(constants),
});

module.exports = container;
