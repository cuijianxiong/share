var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'wgyngbh@163.com',
        pass: 'wgy720258'
    }
});
//console.log(transporter);
var mailOptions = {
    from: 'wgyngbh@163.com', // sender address
    to: 'wgyngbh@live.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
});