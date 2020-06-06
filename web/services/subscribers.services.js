class SubscriberService {
  constructor({ config, serviceRegistry, circuitBreaker }) {
    this.config = config;
    this.serviceRegistry = serviceRegistry;
    this.circuitBreaker = circuitBreaker;
  }

  async addSubscriber(name, email) {
    const { ip, port } = await this.serviceRegistry.getService(this.config.services.SUBSCRIBERS);
    const subscriberServiceUrl = `http://${ip}:${port}/subscribers`;
    const requestOptions = {
      method: 'POST',
      url: subscriberServiceUrl,
      data: {
        name,
        email,
      },
    };
    return this.callService(requestOptions);
  }

  async callService(requestOptions) {
    const result = await this.circuitBreaker.callService(requestOptions);
    return result;
  }
}

module.exports = SubscriberService;
