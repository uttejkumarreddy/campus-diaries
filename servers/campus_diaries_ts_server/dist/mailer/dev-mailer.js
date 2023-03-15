"use strict";
const { createTransporter: Transporter } = require('../helpers/mail-transporter');
const sendErrorToDevelopers = (name, msg, stack) => {
    let transporter = Transporter();
    let mailOptions = {
        from: process.env.SERVER_MAIL,
        to: process.env.DEV_MAIL,
        subject: name + ' @ Campus Diaries',
        html: '<h3>' + msg + '</h3></br>' +
            '<h4>' + stack + '</h4>'
    };
    transporter.sendMail(mailOptions)
        .then((res) => {
    })
        .catch((err) => {
    });
};
exports.sendErrorToDevelopers = sendErrorToDevelopers;
