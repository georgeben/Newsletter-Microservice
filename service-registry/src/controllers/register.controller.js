const status = require('http-status');

class RegisterController {
  constructor({ serviceRepository }) {
    this.serviceRepository = serviceRepository;
  }

  getIp(req) {
    return req.connection.remoteAddress.includes('::')
      ? `[${req.connection.remoteAddress}]`
      : req.connection.remoteAddress;
  }

  async registerService(req, res, next) {
    const { name, version, port } = req.body;
    try {
      if (!name || !version || !port) {
        return res.status(status.BAD_REQUEST).json({
          error: 'Please specify all required fields: name, version and port',
        });
      }
      const serviceIp = this.getIp(req);
      const existingService = await this.serviceRepository.checkService(
        name,
        version,
      );
      if (existingService) {
        console.log(`Updating lastActive for service ${name} ${version}`);
        await this.serviceRepository.updateServiceLastActive(
          existingService._id,
        );
        return res.status(status.OK).json({
          message: 'Successfully updated service',
        });
      }
      const registeredService = await this.serviceRepository.saveService({
        name,
        version,
        port,
        ip: serviceIp,
      });

      return res.status(status.OK).json({
        data: registeredService,
      });
    } catch (error) {
      return next(error);
    }
  }

  async unregisterService(req, res, next) {
    const { name, version, port } = req.body;
    try {
      if (!name || !version || !port) {
        return res.status(status.BAD_REQUEST).json({
          error:
            'Please specify all required fields: name, version, ip and port',
        });
      }
      const serviceIp = this.getIp(req);
      const existingService = await this.serviceRepository.checkService(
        name,
        version,
      );
      if (!existingService) {
        return res.status(status.NOT_FOUND).json({
          error: 'Service not found',
        });
      }
      await this.serviceRepository.deleteService(existingService._id);
      return res.sendStatus(status.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  }

  async getServices(req, res, next) {
    try {
      const services = await this.serviceRepository.getServices();
      return res.status(status.OK).json({
        data: services,
      });
    } catch (error) {
      return next(error);
    }
  }

  async findService(req, res, next) {
    const { name, version } = req.params;
    try {
      const service = await this.serviceRepository.getAvailableService(name, version);
      if (!service) {
        return res.status(status.NOT_FOUND).json({
          error: 'The service you are requesting for was not found',
        });
      }
      return res.status(status.OK).json({
        data: service,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = RegisterController;
