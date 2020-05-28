const mongoose = require('mongoose');

const { Schema } = mongoose;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  lastActive: {
    type: Date,
    required: true,
    default: new Date(),
  },
  lastActiveOffset: {
    type: Number,
  },
}, { timestamps: true });

serviceSchema.pre('save', function (next) {
  this.lastActiveOffset = this.lastActive.getTimezoneOffset();
  next();
});

module.exports = () => mongoose.model('Service', serviceSchema);
