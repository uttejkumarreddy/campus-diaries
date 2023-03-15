const db = require('./registration.db');
const AuthService = require('../../services/Authentication');
const RegistrationService = require('./registration.services');
const {
  USER_WITH_EMAIL_EXISTS,
  USER_WITH_ROLL_NUMBER_IN_COLLEGE_EXISTS,
  REGISTRATION_ERROR,
  REGISTRATION_SUCCESS,
  SEND_ACTIVATION_LINK,
  INVALID_INPUT,
  ACTIVATION_SUCCESS,
  INVALID_ACTIVATION_INPUTS
} = require('./registration.constants');

const tryRegistration = async (req, res, next) => {
  let user = req.body.user;

  if (!(await db.collegeWithIdExists(user.college))) {
    return next(INVALID_INPUT);
  }

  let password = new Buffer.from(user.password, 'base64').toString('utf-8');
  if (password.length < 8 || password.length > 15) {
    return next(INVALID_INPUT);
  }

  user.passwordHash = await AuthService.generateHash(password);
  user.username = RegistrationService.generateUsername(user);

  let dbResponse = await db.insertNewUser(user);
  if (!dbResponse.inserted) {
    if (dbResponse.errorCode === '23505' && dbResponse.constraint === 'users_pkey') {
      return res.status(403).json({ success: false, message: USER_WITH_ROLL_NUMBER_IN_COLLEGE_EXISTS });
    }
    if (dbResponse.errorCode === '23505' && dbResponse.constraint === 'users_email_key') {
      return res.status(403).json({ success: false, message: USER_WITH_EMAIL_EXISTS });
    }

    return res.status(500).json({ success: false, message: REGISTRATION_ERROR });
  }

  RegistrationService.sendActivationLink(user);
  return res.status(201).json({ success: true, message: REGISTRATION_SUCCESS });
};

const activateAccount = async (req, res, next) => {
  let rollnumber = req.params.rollnumber;
  let activationlink = req.params.activationlink;

  if (!rollnumber || !activationlink) {
    return next(INVALID_INPUT);
  }

  if (!(await db.isActivationLinkAssocToRollnumber(activationlink, rollnumber))) {
    return next(INVALID_ACTIVATION_INPUTS);
  }

  await db.activateAccount(rollnumber);
  return res.status(200).json({ success: true, message: ACTIVATION_SUCCESS });
};

const sendActivationLink = async (req, res, next) => {
  let obj = {
    email: req.body.email,
  };

  let dbResponse = await db.getAssocRollNumberOfEmail(obj.email);
  if (dbResponse.rowCount === 1) {
    obj.roll_number = dbResponse.rows[0].roll_number;
    RegistrationService.sendActivationLink(obj);
  }

  return res.status(200).json({ success: true, message: SEND_ACTIVATION_LINK });
};

module.exports = {
  register: tryRegistration,
  sendActivationLink: sendActivationLink,
  activateAccount: activateAccount,
}