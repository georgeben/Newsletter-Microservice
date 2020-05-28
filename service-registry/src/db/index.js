const mongoose = require('mongoose');

const connectionString = process.env.DATABASE_URI;

mongoose.connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((e) => console.log('Failed to connect to MongoDB', e));
