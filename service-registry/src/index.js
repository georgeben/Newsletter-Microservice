const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { scopePerRequest } = require('awilix-express');

const routes = require('./routes');
const container = require('./container');


const app = express();
const PORT = process.env.PORT || 3001;

require('./db');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(scopePerRequest(container));

app.use('/', routes);

app.use((req, res, next) => next(createError(404, 'Resource not found')));

app.use((err, req, res, next) => {
  if (app.get('env') !== 'production') {
    console.log(err);
    return res.status(500).json({
      error: err.name,
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(500).json({
    error: err.name,
    message: err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server registry started on ${PORT}`);
});


function gracefulShutdown() {
  server.close((error) => {
    if (error) {
      process.exit(error ? 1 : 0);
    }
    console.log('Info: Shutting down server');
    // eslint-disable-next-line global-require
    require('mongoose').disconnect()
      .then(() => console.log('Successfully disconnected from MongoDB'))
      .catch((err) => process.exit(err ? 1 : 0));
  });
}

process.on('SIGINT', () => {
  gracefulShutdown();
});

process.on('SIGTERM', () => {
  gracefulShutdown();
});

module.exports = app;
