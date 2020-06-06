function consumeQueue({ config, getMessageBrokerConnection, constants, mailerService }) {
  getMessageBrokerConnection()
    .then((conn) => {
      console.log('Successfully connected to RabbitMQ');
      return conn.createChannel();
    })
    .then((channel) => channel.assertQueue(config.notificationQueueName).then(() => {
      channel.prefetch(1);
      channel.consume(config.notificationQueueName, (msg) => {
        if (msg !== null) {
          console.log(`Received message ${msg.content.toString()}`);
          const data = JSON.parse(msg.content.toString());

          const { emailType } = data;
          switch (emailType) {
            case constants.EMAIL_TYPES.WELCOME_EMAIL:
              console.log('Sending welcome email');
              mailerService.sendWelcomeMail(data.name, data.email)
                .then(() => channel.ack(msg))
                .catch((err) => console.log(`Failed to send welcome email to ${data.email}`, err));
              break;
            case constants.EMAIL_TYPES.UNSUBSCRIBE:
              console.log('Sending un-subscription email');
              mailerService.sendUnSubscriptionMail(data.email, data.token)
                .then(() => channel.ack(msg))
                .catch((err) => console.log(`Failed to send un-subscription email to ${data.email}`, err));
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
