export { };
const db = require('./login.db');
const { v4: uuidv4 } = require('uuid');
const HOST_ADDRESS = process.env.HOST_ADDRESS;
const Logger = require('../../loaders/logger');
const Constants = require('./login.constants');
const { getMailTransporter, FROM_EMAIL } = require('../../services/MailTransporter');

const generatePasswordResetKey = () => {
  return uuidv4();
}

const sendPasswordResetLink = async ({ email, roll_number, college_id }: { email: string, roll_number: string, college_id: string }) => {
  let passwordResetKey = generatePasswordResetKey();
  let res = await db.setPasswordResetKey(email, passwordResetKey);
  if (!res) return res.status(500).json({ success: false, message: Constants.INTERNAL_SERVER_ERROR });

  let mailConfiguration = {
    from: FROM_EMAIL,
    to: email,
    subject: 'Password Reset Link for your Community Store account',
    html: `<h3>Please click on this <a href="${HOST_ADDRESS}/login/reset-password/${college_id}/${roll_number}/${passwordResetKey}">link</a> to reset your password.</h3>
           <h2>Please ignore this email if you have not requested for a password reset.</h2>`
  };

  let transporter = getMailTransporter();
  transporter.sendMail(mailConfiguration)
    .then((res: any) => {
      Logger.info('LOGIN: PASSWORD RESET LINK: SUCCESS: Message ID: ' + res.messageId + ' EMAIL: ' + email);
    })
    .catch((err: Error) => {
      // TODO: Alert dev
      Logger.error('LOGIN: PASSWORD RESET LINK: FAILURE: ' + JSON.stringify(err) + ' EMAIL: ' + email);
    })
}

const sendPasswordResetConfirmation = async (email: string) => {
  let mailConfiguration = {
    from: FROM_EMAIL,
    to: email,
    subject: 'Password changed for your Community Store account',
    html: `<h3>Your password was changed successfully just now. If you did not initiate this process, please contact us immediately.</h3>`
  };

  let transporter = getMailTransporter();
  transporter.sendMail(mailConfiguration)
    .then((res: any) => {
      Logger.info('LOGIN: PASSWORD CHANGE CONFIRMATION: SUCCESS: Message ID: ' + res.messageId + ' EMAIL: ' + email);
    })
    .catch((err: Error) => {
      // TODO: Alert dev
      Logger.error('LOGIN: PASSWORD CHANGE CONFIRMATION: FAILURE: ' + JSON.stringify(err) + ' EMAIL: ' + email);
    })
}

module.exports = {
  sendPasswordResetLink: sendPasswordResetLink,
  sendPasswordResetConfirmation: sendPasswordResetConfirmation,
}