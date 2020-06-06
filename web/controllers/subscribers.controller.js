class SubscriberController {
  constructor({ subscriberService }) {
    this.subscriberService = subscriberService;
  }

  async addSubscriber(req, res, next) {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        req.flash('subscriptionMessage', 'Enter your email and name');
        return res.render('index', { title: 'Subscribe to our newsletter', message: req.flash('subscriptionMessage') });
      }
      const result = await this.subscriberService.addSubscriber(name, email);
      if (result) {
        return res.render('subscription-success', { subscriber: result.data });
      }
      req.flash('subscriptionMessage', 'Something went wrong. Please try again after sometime');
      return res.render('index', { title: 'Subscribe to our newsletter', message: req.flash('subscriptionMessage') });
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status >= 500) {
          req.flash('subscriptionMessage', 'Something went wrong. Please try again after sometime');
        } else {
          req.flash('subscriptionMessage', error.response.data.error);
        }
        return res.render('index', { title: 'Subscribe to our newsletter', message: req.flash('subscriptionMessage') });
      }
      return next(error);
    }
  }
}

module.exports = SubscriberController;
