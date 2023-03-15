export {};

const {getMailTransporter, FROM_EMAIL} = require('../services/MailTransporter');
const {v1: uuidv1} = require('uuid');
const HOST_ADDRESS = process.env.HOST_ADDRESS;

const generateActivationLink = () => {
    return uuidv1();
}

const sendActivationLink = async ({email, user_name, activationLink}: { email: string, user_name: string, activationLink: any }) => {
    let mailConfiguration = {
        from: FROM_EMAIL,
        to: email,
        subject: 'Activation link for your Community Store account',
        html: `<h3>Please click on this <a href="${HOST_ADDRESS}/register/activate/${user_name}/${activationLink}">link</a> to verify/activate your account.
           Please ignore this email if you have not registered for an account in Community Store.`
    };

    let transporter = getMailTransporter();
    return transporter.sendMail(mailConfiguration);
}

module.exports = {
    generateActivationLink: generateActivationLink,
    sendActivationLink: sendActivationLink
};