
export { };
const db = require('./registration.db');
const AuthService = require('../../services/Authentication');
const Constants = require('./registration.constants');
import { Request, Response, NextFunction } from "express";
import { newRegistration } from './registration.interfaces';
const RegistrationService = require('./registration.services');

const tryRegistration = async (req: Request, res: Response, next: NextFunction) => {
  let user: newRegistration = req.body.user;

  // @ts-ignore
  user.password = new Buffer.from(user.password, 'base64').toString('utf-8');
  if (user.password.length < 8 || user.password.length > 15) return '';

  user.password = await AuthService.generateHash(user.password);

  let dbResponse = await db.insertNewUser(user);
  if (!dbResponse.inserted) {
    if (dbResponse.errorCode === '23505') {
      if (dbResponse.constraint === 'users_email_key') return res.status(403).json({ success: false, message: Constants.EMAIL_ALREADY_EXISTS });
      if (dbResponse.constraint === 'users_roll_number_college_id_key') return res.status(403).json({ success: false, message: Constants.ROLL_NUMBER_ALREADY_EXISTS });
      if (dbResponse.constraint === 'users_user_name_key') return res.status(403).json({ success: false, message: Constants.USERNAME_ALREADY_TAKEN });
    }
    if (dbResponse.errorCode === '23503') {
      if (dbResponse.constraint === 'users_college_id_fkey') return res.status(403).json({ success: false, message: Constants.INVALID_INPUT });
    }
    return res.status(500).json({ success: false, message: Constants.REGISTRATION_ERROR });
  }
  RegistrationService.sendActivationLink(user);
  return res.status(201).json({ success: true, message: Constants.REGISTRATION_SUCCESS })
};

const activateAccount = async (req: Request, res: Response, next: NextFunction) => {
  let userName = req.params.userName;
  let activationlink = req.params.activationlink;

  if (!userName || !activationlink) {
    return next(Constants.INVALID_INPUT);
  }

  if (!(await db.isActivationLinkAssocToUserName(activationlink, userName))) {
    return next(Constants.INVALID_ACTIVATION_INPUTS);
  }

  let isActivated = await db.activateAccount(userName);
  if (!isActivated) return res.status(500).json({ success: false, message: Constants.ACTIVATION_ERROR })
  
  db.clearActivationLink(userName);
  
  return res.status(200).render('200', { message: Constants.ACTIVATION_SUCCESS });
};

const sendActivationLink = async (req: Request, res: Response, next: NextFunction) => {
  let obj = {
    email: req.body.email,
    user_name: ''
  };

  let dbResponse = await db.getAssocUserNameOfEmail(obj.email);
  if (dbResponse.rowCount === 1) {
    obj.user_name = dbResponse.rows[0].user_name;
    RegistrationService.sendActivationLink(obj);
  }

  return res.status(200).json({ success: true, message: Constants.SEND_ACTIVATION_LINK });
};

module.exports = {
  register: tryRegistration,
  sendActivationLink: sendActivationLink,
  activateAccount: activateAccount,
}