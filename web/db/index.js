const mongoose = require('mongoose');

const { databaseUrl } = require('../config');

mongoose.connect(databaseUrl, { useNewUrlParser: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((e) => console.log('Failed to connect to MongoDB', e));
