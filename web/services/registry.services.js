class ServiceRegistry {
  constructor({ axios, config }) {
    this.axios = axios;
    this.config = config;
  }

  async getService(servicename) {
    const response = await this.axios.get(
      `${this.config.serviceRegistryUrl}/${servicename}/${this.config.serviceVersion}`,
    );
    return response.data.data;
  }
}

module.exports = ServiceRegistry;
