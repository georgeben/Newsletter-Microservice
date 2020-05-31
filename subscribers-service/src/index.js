const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { scopePerRequest } = require('awilix-express');
const routes = require('./routes');
const container = require('./container');
const { port, serviceName, serviceVersion } = require('./config')[
  process.env.NODE_ENV || 'development'
];
const registerService = require('./utils/registerService');
const unregisterService = require('./utils/unregisterService');
const heartbeat = require('./utils/heartbeat');
const errorHandler = require('./middleware/errorHandler');

const app = express();

require('./db');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(scopePerRequest(container));

app.use('/', routes);

app.use((req, res, next) => next(createError(404, 'Resource not found')));

app.use(errorHandler);

const server = app.listen(port, async () => {
  console.log(`Subscribers service started on ${port}`);
  try {
    const result = await registerService();
    heartbeat.start();
    console.log('Successfully registered subscribers service', result.data);
  } catch (error) {
    console.log('Failed to register service', error);
  }
});

async function gracefulShutdown() {
  console.log(
    `Attempting to unregister ${serviceName} ${serviceVersion} before shutdown`,
  );
  heartbeat.stop();
  try {
    const result = await unregisterService();
    console.log('Successfully unregistered service', result.data);
    server.close((error) => {
      if (error) {
        process.exit(error ? 1 : 0);
      }
      console.log('Info: Shutting down server');
      // eslint-disable-next-line global-require
      require('mongoose')
        .disconnect()
        .then(() => console.log('Successfully disconnected from MongoDB'))
        .catch((err) => process.exit(err ? 1 : 0));
    });
  } catch (error) {
    console.log('An error occurred during shutdown', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await gracefulShutdown();
});

process.on('SIGTERM', async () => {
  await gracefulShutdown();
});

module.exports = app;
