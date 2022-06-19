var amqp = require('amqplib/callback_api');

amqp.connect('amqp://guest:guest@rabbitmq:5672', function(err, connection) {
  if (err) {
    throw err;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = 'mail_queue1';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);

    console.log("NodeMailer waiting for messages");

    channel.consume(queue, function(msg) {
      console.log("Received %s", msg.content.toString());
      //invia la mail
      channel.ack(msg)
    }, {
      noAck: false
    });
  });
});