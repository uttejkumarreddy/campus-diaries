"use strict";
const nodemailer = require('nodemailer');
const createTransporter = () => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SERVER_MAIL,
            pass: process.env.SERVER_PASSWORD
        }
    });
    return transporter;
};
exports.createTransporter = createTransporter;
