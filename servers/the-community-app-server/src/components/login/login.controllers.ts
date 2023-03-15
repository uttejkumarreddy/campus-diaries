export { };
const db = require('./login.db');
import { Request, Response, NextFunction } from "express";
import { LoginInterface } from "./login.interfaces";
const AuthService = require('../../services/Authentication');
const Constants = require('./login.constants');
const Logger = require('../../loaders/logger');
const LoginService = require('./login.services');
import { AuthenticatedUser } from './login.interfaces';

const tryBasicLogin = async (req: Request, res: Response, next: NextFunction) => {
  let loginDetails: LoginInterface = {
    email: req.body.email,
    password: req.body.password
  };

  let dbResponse = await db.getUserDetails(loginDetails.email);
  if (dbResponse.rowCount !== 1) return res.status(403).json({ success: false, message: Constants.INVALID_CREDENTIALS });

  let user: AuthenticatedUser = dbResponse.rows[0];
  if (user.locked_out) return res.status(403).json({ success: false, message: Constants.ACCOUNT_LOCKED });
  if (user.deactivated) return res.status(403).json({ success: false, message: Constants.ACCOUNT_DEACTIVATED });

  // @ts-ignore
  let password = new Buffer.from(loginDetails.password, 'base64').toString('utf-8');
  let arePasswordsMatching = await AuthService.compareHashes(password, user.password);
  if (!arePasswordsMatching) return res.status(403).json({ success: false, message: Constants.INVALID_CREDENTIALS });

  delete user.password;
  let authToken = AuthService.generateAuthenticatedUserToken(user);

  return res.status(200).json({ success: true, message: '', token: authToken });
}

const sendPasswordResetLink = async (req: Request, res: Response, next: NextFunction) => {
  let obj = { email: req.body.email, roll_number: '', college_id: '' };

  // If email is present in the database, send Password Reset email
  let dbResponse = await db.getAssocRollNumberAndCollegeOfEmail(obj.email);
  if (dbResponse.rowCount === 1) {
    obj.roll_number = dbResponse.rows[0].roll_number;
    obj.college_id = dbResponse.rows[0].college_id;
    LoginService.sendPasswordResetLink(obj);
  }

  return res.status(200).json({ success: true, message: Constants.PASSWORD_RESET_LINK });
}

const sendPasswordResetPage = async (req: Request, res: Response, next: NextFunction) => {
  // Inputs from the webpage
  let collegeID = req.params.collegeID;
  let rollnumber = req.params.rollnumber;
  let passwordResetKey = req.params.passwordResetKey;

  // College ID, Roll Number, Password Reset Key should be present.
  if (!collegeID || !rollnumber || !passwordResetKey) {
    return next(Constants.INVALID_PASSWORD_RESET_LINK);
  }

  // Check if user in that College with that Roll Number has that Password Reset Key
  if (!(await db.userHasPwdReset(collegeID, rollnumber, passwordResetKey))) {
    return next(Constants.INVALID_PASSWORD_RESET_LINK);
  }

  // Take user to password reset page
  return res.status(200).render('password-reset');
}

const acceptPasswordResetPage = async (req: Request, res: Response, next: NextFunction) => {
  // Inputs from the webpage
  let collegeID = req.params.collegeID;
  let rollnumber = req.params.rollnumber;
  let passwordResetKey = req.params.passwordResetKey;
  let password = req.body.password;
  let repeatPassword = req.body.repeatPassword;

  // College ID, Roll Number, Password Reset Link and new Password should be present.
  if (!collegeID || !rollnumber || !passwordResetKey || !password || !repeatPassword) {
    return next(Constants.INVALID_NEW_PASSWORD_SUBMISSION);
  }

  // @ts-ignore
  password = new Buffer.from(password, 'base64').toString('utf-8');
  // @ts-ignore
  repeatPassword = new Buffer.from(repeatPassword, 'base64').toString('utf-8');

  // Passwords should match and length should be between 8 and 15 characters.
  if ((password !== repeatPassword) || (password.length < 8 || password.length > 15)) {
    return next(Constants.INVALID_NEW_PASSWORD_SUBMISSION);
  }

  // Check if user in that College with that Roll Number has that Password Reset Key
  if (!(await db.userHasPwdReset(collegeID, rollnumber, passwordResetKey))) {
    return next(Constants.INVALID_PASSWORD_RESET_LINK);
  }

  // Hash the password
  let passwordHash = await AuthService.generateHash(password);

  // Change password and wipe out password reset link
  let passwordUpdateRes = await db.updatePasswordHash(collegeID, rollnumber, passwordHash);
  if (!passwordUpdateRes) return res.status(500).json({ success: false, message: Constants.INTERNAL_SERVER_ERROR });

  let email;
  if (passwordUpdateRes.rowCount === 1 && passwordUpdateRes.rows[0].email) {
    email = passwordUpdateRes.rows[0].email;
    Logger.info('PASSWORD RESET: FORGOT PASSWORD: SUCCESSFUL: ' + email);

    // Invalidate password reset link and send password change confirmation to user
    db.removePasswordResetLink(collegeID, rollnumber);
    LoginService.sendPasswordResetConfirmation(email);
  } else {
    // TODO: Alert dev
    Logger.info('PASSWORD RESET: FORGOT PASSWORD: FAILED: ' + collegeID + ' ' + rollnumber + ' Error: ' + JSON.stringify(passwordUpdateRes));
    return res.status(200).render('200', { message: Constants.PASSWORD_CHANGE_FAILED });
  }

  return res.status(200).render('200', { message: Constants.SUCCESSFUL_PASSWORD_CHANGE });
}


module.exports = {
  tryBasicLogin: tryBasicLogin,
  sendPasswordResetLink: sendPasswordResetLink,
  sendPasswordResetPage: sendPasswordResetPage,
  acceptPasswordResetPage: acceptPasswordResetPage,
}