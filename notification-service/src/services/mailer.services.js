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
}

module.exports = MailerService;
