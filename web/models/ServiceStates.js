const mongoose = require('mongoose');
const { serviceStatus } = require('../utils/constants');

const serviceStateSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true,
  },
  failures: {
    type: Number,
    default: 0,
  },
  nextTry: {
    type: Date,
  },
  status: {
    type: String,
    enum: [serviceStatus.CONNECTED, serviceStatus.DISCONNECTED, serviceStatus.TRIAL],
    default: serviceStatus.CONNECTED,
  },
});

module.exports = mongoose.model('ServiceState', serviceStateSchema);
