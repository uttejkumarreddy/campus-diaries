const nodemailer = require('nodemailer');

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

const getMailTransporter = () => {
  // TODO: Needs to be replaced by an oauth2 transport
  let transporter = nodemailer.createTransport({
    host: '' + EMAIL_HOST,
    service: '' + EMAIL_SERVICE,
    auth: {
      user: '' + EMAIL_ADDRESS,
      pass: '' + EMAIL_PASSWORD
    }
  });

  return transporter;
}

module.exports = {
  getMailTransporter: getMailTransporter,
  FROM_EMAIL: EMAIL_ADDRESS,
};