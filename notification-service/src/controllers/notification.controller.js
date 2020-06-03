const status = require('http-status');

class NotificationController {
  constructor({ mailerService }) {
    this.mailerService = mailerService;
  }

  async sendWelcomeMail(req, res, next) {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(status.BAD_REQUEST).json({
        error: 'Please specify all required fields: email and name',
      });
    }
    try {
      await this.mailerService.sendWelcomeMail(name, email);
      return res.status(status.OK).json({
        message: 'Successfully sent mail',
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = NotificationController;
