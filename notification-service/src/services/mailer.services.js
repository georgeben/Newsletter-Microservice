class MailerService {
  constructor({ mailer }) {
    this.mailer = mailer;
  }

  async sendWelcomeMail(name, email) {
    const subject = 'Thank you for subscribing to our newsletter';
    const message = `Hello ${name}, thank you for subscribing to our newsletter. You will now receive weekly updates
    about us. Cheers!`;
    return this.mailer.sendMail(
      email,
      subject,
      message,
    );
  }

  async sendUnSubscriptionMail(email, token) {
    const subject = 'Unsubscribe from newsletter';
    const message = 'Sorry to see you go! Please click on this link to unsubscribe from our newsletter';
    const link = `http://appurl.com/unsubscribe?token=${token}`; // This should be added to the app's config variables
    return this.mailer.sendMail(
      email,
      subject,
      message,
    );
  }
}

module.exports = MailerService;
