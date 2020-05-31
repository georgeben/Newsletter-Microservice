const status = require('http-status');

class SubscriberController {
  constructor({ subscriberRepository, jwt, config }) {
    this.subscriberRepository = subscriberRepository;
    this.jwt = jwt;
    this.config = config;
  }

  async addSubscriber(req, res, next) {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(status.BAD_REQUEST).json({
        error: 'Please specify all required fields: name, email',
      });
    }
    try {
      const existingSubscriber = await this.subscriberRepository.findSubscriberByEmail(email);
      if (existingSubscriber) {
        return res.status(status.CONFLICT).json({
          error: 'Someone has already subscribed with this email',
        });
      }
      const newSubscriber = await this.subscriberRepository.createSubscriber({ name, email });
      // TODO Send a message to the notification service to send a welcome email
      // to the new subscriber
      return res.status(status.CREATED).json({
        message: 'Successfully added subscriber',
        data: newSubscriber,
      });
    } catch (error) {
      return next(error);
    }
  }

  async fetchAllSubscribers(req, res, next) {
    try {
      const subscribers = await this.subscriberRepository.getAllSubscribers();
      return res.status(status.OK).json({
        message: 'Successfully fetched all subscribers',
        data: {
          subscribers,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async unsubscribe(req, res, next) {
    /**
     * 1 - Check that the user is a subscriber
     * 2 - Generate a token
     * 3 - Send a message to the notification service to send an un-subscription link
     *     to the specified email
     */
    const { email } = req.body;
    if (!email) {
      return res.status(status.BAD_REQUEST).json({
        error: 'Please specify all required fields: email',
      });
    }
    try {
      const subscriberExists = await this.subscriberRepository.findSubscriberByEmail(email);
      if (!subscriberExists) {
        return res.status(status.NOT_FOUND).json({
          error: 'The subscriber you specified was not found',
        });
      }
      const unsubscribeToken = this.jwt.sign({ email }, this.config.jwtSecret);
      console.log({ unsubscribeToken });
      // TODO Send a message to the notification service with this unsubscribeToken
      return res.status(status.OK).json({
        message: 'An un-subscription mail has been sent to your email',
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteSubscriber(req, res, next) {
    const { token } = req.body;
    if (!token) {
      return res.status(status.BAD_REQUEST).json({
        error: 'Please specify un-subscription token',
      });
    }
    try {
      const decoded = this.jwt.verify(token, this.config.jwtSecret);
      const { email } = decoded;
      const subscriberExists = await this.subscriberRepository.findSubscriberByEmail(email);
      if (!subscriberExists) {
        return res.status(status.NOT_FOUND).json({
          error: 'The subscriber you specified was not found',
        });
      }
      await this.subscriberRepository.deleteSubscriber(email);
      return res.status(status.OK).json({
        message: 'Successfully unsubscribed from newsletter',
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = SubscriberController;
