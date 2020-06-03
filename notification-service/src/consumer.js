function consumeQueue({ config, getMessageBrokerConnection, constants, mailerService }) {
  getMessageBrokerConnection()
    .then((conn) => conn.createChannel())
    .then((channel) => channel.assertQueue(config.notificationQueueName).then(() => {
      channel.prefetch(1);
      channel.consume(config.notificationQueueName, (msg) => {
        if (msg !== null) {
          console.log(`Received message ${msg.content.toString()}`);
          const data = JSON.parse(msg.content.toString());

          const { emailType, name, email } = data;
          switch (emailType) {
            case constants.EMAIL_TYPES.WELCOME_EMAIL:
              console.log('Sending welcome email');
              mailerService.sendWelcomeMail(name, email)
                .then(() => channel.ack(msg))
                .catch((err) => console.log(`Failed to send welcome email to ${email}`, err));
              break;
            default:
              console.log('Unknown email type');
              channel.ack(msg);
          }
        }
      });
    })).catch((err) => {
      console.log('Error: Failed to connect to RabbitMQ', err);
    });
}

module.exports = consumeQueue;
