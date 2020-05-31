/* eslint-disable global-require */
const { asValue, asClass, createContainer, asFunction } = require('awilix');
const moment = require('moment');
const semver = require('semver');
const serviceRepository = require('./repositories/serviceRepository');
const config = require('./config');

const container = createContainer();
container.register({
  serviceRepository: asClass(serviceRepository).scoped(),
  ServiceModel: asFunction(require('./models/service.model')),
  config: asFunction(config),
  moment: asValue(moment),
  semver: asValue(semver),
});

module.exports = container;
