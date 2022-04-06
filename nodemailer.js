const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function main(html) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'qq',
        port: 587,
        secure: true, // true for 465, false for other ports
        auth: {
            user: '247770359@qq.com', // generated ethereal user
            pass: 'ofrgchifvekkbgij' // generated ethereal password//aqhsdqsypiaobiah
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'ヾ事过情迁 <247770359@qq.com>', // sender address
        to: '247770359@qq.com', // list of receivers
        subject: '部署通知', // Subject line
        // text: 'Hello world?', // plain text body
        html: html // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main
