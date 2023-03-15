const { getMailTransporter, FROM_EMAIL } = require('../../services/MailTransporter');
const { setActivationLink } = require('./registration.db');
const Logger = require('../../loaders/logger');
const { v1: uuidv1 } = require('uuid');
const HOST_ADDRESS = process.env.HOST_ADDRESS;

const generateActivationLink = () => {
  return uuidv1();
}

const generateUsername = ({ first_name, last_name }) => {
  return (first_name.toLowerCase().replace(' ', '') + '.' + last_name.toLowerCase().replace(' ', '')).substring(0, 20);
};

const sendActivationLink = async ({ email, roll_number }) => {
  let activationLink = generateActivationLink();
  await setActivationLink(email, activationLink);

  let mailConfiguration = {
    from: FROM_EMAIL,
    to: email,
    subject: 'Activation link for your Campus Diaries account',
    html: `<h3>Please click on this <a href="${HOST_ADDRESS}/register/activate/${roll_number}/${activationLink}">this</a> link to activate your account.
           Please ignore this email if you have not registered for an account in Campus Diaries.`
  };

  let transporter = getMailTransporter();
  transporter.sendMail(mailConfiguration)
    .then(res => {
      Logger.info('REGISTRATION: ACTIVATION LINK: SUCCESS: Message ID: ' + res.messageId + ' EMAIL: ' + email);
    })
    .catch(err => {
      // TODO: Alert dev
      Logger.error('REGISTRATION: ACTIVATION LINK: FAILURE: ' + JSON.stringify(err) + ' EMAIL: ' + email);
    })
}

module.exports = {
  sendActivationLink: sendActivationLink,
  generateUsername: generateUsername
};