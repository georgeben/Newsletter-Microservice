const nodemailer = require('nodemailer');

const FROM_EMAIL = 'George Benjamin <george@helloworld.com>';

async function mailer(recipients, subject, message) {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  const result = await transporter.sendMail({
    from: FROM_EMAIL,
    to: recipients,
    subject,
    text: message,
  });
  console.log(`Successfully sent message ${result.messageId}`);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result));
}

module.exports = {
  sendMail: mailer,
};
