const db = require('./login.db');
const AuthService = require('../../services/Authentication');
const LoginService = require('./login.services');
const Logger = require('../../loaders/logger');
const {
  INVALID_CREDENTIALS,
  PASSWORD_RESET_LINK,
  INVALID_PASSWORD_RESET_LINK,
  INVALID_NEW_PASSWORD_SUBMISSION,
  SUCCESSFUL_PASSWORD_CHANGE,
  PASSWORD_CHANGE_FAILED } = require('./login.constants');

const tryBasicLogin = async (req, res, next) => {
  // Get user details with that Roll Number in that College
  let user = await db.getUserDetails(req.body.college, req.body.roll_number);

  // If no user found, return Invalid Credentials
  if (!user) {
    return next(INVALID_CREDENTIALS);
  }

  // Checks user login flags: locked_out, deactivated
  let canUserLogIn = LoginService.canUserLogIn(user);
  if (canUserLogIn !== true) {
    return next(canUserLogIn);
  }

  // Convert and compare password
  let password = new Buffer.from(req.body.password, 'base64').toString('utf-8');
  let arePasswordsMatching = await AuthService.compareHashes(password, user.password);
  if (!arePasswordsMatching) {
    return next(INVALID_CREDENTIALS);
  }

  // Generate auth token
  delete user.password;
  let authToken = AuthService.generateAuthenticatedUserToken(user);

  return res.status(200).json({ success: true, message: '', token: authToken });
}

const sendPasswordResetLink = async (req, res, next) => {
  let obj = { email: req.body.email };

  // If email is present in the database, send Passowrd Reset email
  let dbResponse = await db.getAssocRollNumberAndCollegeOfEmail(obj.email);
  if (dbResponse.rowCount === 1) {
    obj.roll_number = dbResponse.rows[0].roll_number;
    obj.college_id = dbResponse.rows[0].college_id;
    LoginService.sendPasswordResetLink(obj);
  }

  return res.status(200).json({ success: true, message: PASSWORD_RESET_LINK });
}

const sendPasswordResetPage = async (req, res, next) => {
  // Inputs from the webpage
  let collegeID = req.params.collegeID;
  let rollnumber = req.params.rollnumber;
  let passwordResetKey = req.params.passwordResetKey;

  // College ID, Roll Number, Password Reset Key should be present.
  if (!collegeID || !rollnumber || !passwordResetKey) {
    return next(INVALID_PASSWORD_RESET_LINK);
  }

  // Check if user in that College with that Roll Number has that Password Reset Key
  if (!(await db.userHasPwdReset(collegeID, rollnumber, passwordResetKey))) {
    return next(INVALID_PASSWORD_RESET_LINK);
  }

  // Take user to password reset page
  return res.status(200).render('password-reset');
}

const acceptPasswordResetPage = async (req, res, next) => {
  // Inputs from the webpage
  let collegeID = req.params.collegeID;
  let rollnumber = req.params.rollnumber;
  let passwordResetKey = req.params.passwordResetKey;
  let password = req.body.password;
  let repeatPassword = req.body.repeatPassword;

  // College ID, Roll Number, Password Reset Link and new Password should be present.
  if (!collegeID || !rollnumber || !passwordResetKey || !password || !repeatPassword) {
    return next(INVALID_NEW_PASSWORD_SUBMISSION);
  }

  // Convert from base64 to utf
  password = new Buffer.from(password, 'base64').toString('utf-8');
  repeatPassword = new Buffer.from(repeatPassword, 'base64').toString('utf-8');

  // Passwords should match and length should be between 8 and 15 characters.
  if ((password !== repeatPassword) || (password.length < 8 || password.length > 15)) {
    return next(INVALID_NEW_PASSWORD_SUBMISSION);
  }

  // Check if user in that College with that Roll Number has that Password Reset Key
  if (!(await db.userHasPwdReset(collegeID, rollnumber, passwordResetKey))) {
    return next(INVALID_PASSWORD_RESET_LINK);
  }

  // Hash the password
  let passwordHash = await AuthService.generateHash(password);

  // Change password and wipe out password reset link
  let passwordUpdateRes = await db.updatePasswordHash(collegeID, rollnumber, passwordHash);
  if (passwordUpdateRes.rowCount === 1 && passwordUpdateRes.rows[0].email) {
    let email = passwordUpdateRes.rows[0].email;
    Logger.info('PASSWORD RESET: FORGOT PASSWORD: SUCCESSFUL: ' + email);

    // Invalidate password reset link and send password change confirmation to user
    await db.removePasswordResetLink(collegeID, rollnumber);
    LoginService.sendPasswordResetConfirmation(email);
  } else {
    // TODO: Alert dev
    Logger.info('PASSWORD RESET: FORGOT PASSWORD: FAILED: ' + email + ' Error: ' + JSON.stringify(passwordUpdateRes));
    return res.status(200).render('200', { message: PASSWORD_CHANGE_FAILED });
  }

  return res.status(200).render('200', { message: SUCCESSFUL_PASSWORD_CHANGE });
}

module.exports = {
  tryBasicLogin: tryBasicLogin,
  sendPasswordResetLink: sendPasswordResetLink,
  sendPasswordResetPage: sendPasswordResetPage,
  acceptPasswordResetPage: acceptPasswordResetPage,
}