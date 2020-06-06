// TODO Refactor the circuit breaker to use a real db
const moment = require('moment');
const { serviceStatus } = require('./constants');

class CircuitBreaker {
  constructor({ config, axios }) {
    this.serviceStates = {};
    this.failureThreshold = config.failureThreshold;
    this.failureTimeout = config.failureTimeout;
    this.requestTimeout = 10000;
    this.axios = axios;
  }

  async callService(requestOptions) {
    const serviceEndpoint = `${requestOptions.method}:${requestOptions.url}`;
    if (!this.checkAvailability(serviceEndpoint)) return false;
    try {
      const result = await this.axios({
        ...requestOptions,
        // timeout: this.requestTimeout,
      });
      this.onSuccess(serviceEndpoint);
      return result.data;
    } catch (error) {
      console.log(`Request to ${requestOptions.url} failed`, error);
      this.onFailure(serviceEndpoint);
      throw error;
    }
  }

  checkAvailability(serviceEndpoint) {
    if (!this.serviceStates[serviceEndpoint]) {
      this.initializeServiceState(serviceEndpoint);
    }
    const state = this.serviceStates[serviceEndpoint];
    if (state.status === serviceStatus.CONNECTED) return true;
    const now = moment().toDate();
    if (moment(now).isSameOrAfter(state.nextTry)) {
      state.status = serviceStatus.HALF;
      return true;
    }
    return false;
  }

  initializeServiceState(serviceEndpoint) {
    this.serviceStates[serviceEndpoint] = {
      failures: 0,
      failureTimeout: this.failureTimeout,
      status: serviceStatus.CONNECTED,
      nextTry: 0,
    };
  }

  onSuccess(serviceEndpoint) {
    this.initializeServiceState(serviceEndpoint);
  }

  onFailure(serviceEndpoint) {
    const state = this.serviceStates[serviceEndpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.status = serviceStatus.DISCONNECTED;
      state.nextTry = moment().add(this.failureTimeout, 'minutes').toDate();
      console.log(`Failure threshold reached for ${serviceEndpoint}. Setting status to disconnected`);
    }
  }
}

module.exports = CircuitBreaker;
