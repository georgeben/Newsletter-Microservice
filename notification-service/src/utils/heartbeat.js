const cron = require('node-cron');
const { serviceName, serviceVersion } = require('../config');
const registerService = require('./registerService');

const task = cron.schedule('* * * * *', async () => {
  try {
    console.log(`Attempting to send heartbeat signal for ${serviceName} ${serviceVersion}`);
    const result = await registerService();
    console.log(`Successfully sent heartbeat signal for ${serviceName} ${serviceVersion}`, result.data);
  } catch (error) {
    console.log(`Failed to send heartbeat signal for ${serviceName} ${serviceVersion}`, error.response);
  }
}, { scheduled: false });

module.exports = task;
