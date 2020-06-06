const moment = require('moment');
const { serviceStatus } = require('./constants');

class CircuitBreaker {
  constructor({ config, axios, ServiceState }) {
    this.failureThreshold = config.failureThreshold;
    this.failureTimeout = config.failureTimeout;
    this.requestTimeout = 10000;
    this.axios = axios;
    this.ServiceState = ServiceState;
  }

  async callService(requestOptions) {
    const serviceEndpoint = `${requestOptions.method}:${requestOptions.url}`;
    const serviceIsAvailable = await this.checkAvailability(serviceEndpoint);
    if (!serviceIsAvailable) return false;
    try {
      const result = await this.axios({
        ...requestOptions,
        // timeout: this.requestTimeout,
      });
      this.onSuccess(serviceEndpoint);
      return result.data;
    } catch (error) {
      if (error.response && error.response.status >= 500) {
        console.log(`Request to ${requestOptions.url} failed`, error);
        await this.onFailure(serviceEndpoint);
      } else if (error.response && error.response.status < 500) {
        await this.onSuccess(serviceEndpoint);
      }
      throw error;
    }
  }

  async getServiceState(serviceEndpoint) {
    return this.ServiceState.findOne({
      endpoint: serviceEndpoint,
    });
  }

  async checkAvailability(serviceEndpoint) {
    const serviceState = await this.getServiceState(serviceEndpoint);
    if (!serviceState) {
      await this.initializeServiceState(serviceEndpoint);
    }
    const state = await this.getServiceState(serviceEndpoint);
    if (state.status === serviceStatus.CONNECTED) return true;
    const now = moment().toDate();
    if (moment(now).isSameOrAfter(state.nextTry)) {
      console.log(`Setting status for ${serviceEndpoint} to ${serviceStatus.TRIAL}`);
      state.status = serviceStatus.TRIAL;
      await state.save();
      return true;
    }
    console.log(`Request cannot be sent to ${serviceEndpoint} because it is unavailable`);
    return false;
  }

  async initializeServiceState(serviceEndpoint) {
    const serviceState = new this.ServiceState({
      endpoint: serviceEndpoint,
    });
    await serviceState.save();
  }

  async resetState(serviceEndpoint) {
    const state = await this.getServiceState(serviceEndpoint);
    state.failures = 0;
    state.status = serviceStatus.CONNECTED;
    await state.save();
  }

  async onSuccess(serviceEndpoint) {
    await this.resetState(serviceEndpoint);
  }

  async onFailure(serviceEndpoint) {
    const state = await this.getServiceState(serviceEndpoint);
    state.failures += 1;
    console.log(`Failures for ${serviceEndpoint}: ${state.failures}`);
    if (state.failures > this.failureThreshold) {
      state.status = serviceStatus.DISCONNECTED;
      state.nextTry = moment().add(this.failureTimeout, 'minutes').toDate();
      console.log(`Failure threshold reached for ${serviceEndpoint}. Setting status to disconnected`);
    }
    await state.save();
  }
}

module.exports = CircuitBreaker;
