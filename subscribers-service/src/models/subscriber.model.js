const mongoose = require('mongoose');

const { Schema } = mongoose;

const subscriberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
