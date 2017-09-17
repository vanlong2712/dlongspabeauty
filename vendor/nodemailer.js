'use strict';
const nodemailer = require('nodemailer');

// Generate test SMTP service object from ethereal.email
// Only needed if you don't have a real mail object for testing
var justSendAEmail = (object) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'd.long271293@gmail.com', // generated ethereal user
            pass: '025334886'  // generated ethereal password
        }
    });

        // verify connection configuration
    transporter.verify(function(error, success) {
       if (error) {
            console.log(error);
       } else {
            console.log('Server is ready to take our messages');
       }
    });


    // setup email data with unicode symbols
    let mailOptions = {
        from: '"XinhXinhSalon 👻" <d.long271293@gmail.com>', // sender address
        to: object.toEmail, // list of receivers
        subject: object.subject, // Subject line
        text: object.text, // plain text body
        html: object.html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal object
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
};

module.exports = {
  nodemailer,
  justSendAEmail
};
