
class ServiceRepository {
  constructor({ ServiceModel, config, moment, semver }) {
    this.ServiceModel = ServiceModel;
    this.maxAge = config.maxAge;
    this.moment = moment;
    this.semver = semver;
  }

  async getServices() {
    await this.cleanUp();
    const services = this.ServiceModel.find();
    return services;
  }

  async checkService(name, version) {
    await this.cleanUp();
    const service = await this.ServiceModel.findOne({
      name,
      version,
    });
    return service;
  }

  async getAvailableService(name, version) {
    const result = await this.ServiceModel.find({
      name,
    });
    const matchingServices = result.filter(
      (service) => this.semver.satisfies(service.version, version),
    );
    return matchingServices[Math.floor(Math.random() * matchingServices.length)];
  }

  async deleteService(_id) {
    const result = await this.ServiceModel.deleteOne({
      _id,
    });
  }

  async updateServiceLastActive(id) {
    await this.cleanUp();
    const service = await this.ServiceModel.findById(id);
    service.lastActive = new Date();
    await service.save();
  }

  async saveService({ name, version, port, ip }) {
    await this.cleanUp();
    let service = new this.ServiceModel({
      name,
      version,
      ip,
      port,
    });
    service = await service.save();
    return service;
  }

  async cleanUp() {
    // eslint-disable-next-line prefer-destructuring
    const moment = this.moment;
    const services = await this.ServiceModel.find();
    for (const service of services) {
      const localTime = new Date(service.lastActive.getTime() - (service.lastActiveOffset * 60000));
      const serviceExpiryTime = moment(localTime).add(this.maxAge, 'm').toDate();
      const now = new Date(moment().toDate() - (service.lastActiveOffset * 60000));

      if (moment(now).isAfter(serviceExpiryTime)) {
        console.log(`Attempting to delete ${service.name} ${service.version}`);
        this.deleteService(service._id);
        console.log(`Deleted ${service.name} ${service.version} because it hasn't been active for ${this.maxAge} minutes`);
      }
    }
  }
}


module.exports = ServiceRepository;
