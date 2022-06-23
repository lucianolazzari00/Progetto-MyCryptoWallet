var amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');

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

      var mail = msg.content.toString()
      var nome = mail.split("@")[0]

      const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: "mcwprova@outlook.com",
          pass: "Lazi01900"
        }
      });

      const options = {
        from: "mcwprova@outlook.com",
        to: mail,
        subject: "Welcome to MyCriptoWallet",
        text: "Hi " + nome + ", thank you for joining us",
      }

      transporter.sendMail(options, function(err, info){
        if (err) {
          console.log(err);
          return;
        }
        console.log("stato" + info.response)
      })
    
      channel.ack(msg)
    }, {
      noAck: false
    });
  });
});