import {newRegistration} from "./registration.interfaces";

const pool = require('../../loaders/database').pool;
const Logger = require('../../loaders/logger');
const constants = require('../../app_constants');

const insertNewUser = async (user: newRegistration) => {
    let response: {
        inserted: boolean | null,
        errorCode: string | null,
        constraint: string | null
    } = {inserted: null, errorCode: null, constraint: null};
    try {
        await pool.query(
            `
      INSERT INTO ${constants.SCHEMA_NAME}.${constants.USERS_TABLE}
      (college_id, first_name, last_name, user_name, roll_number, email, password)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `,
            [user.college, user.first_name, user.last_name, user.user_name, user.roll_number, user.email, user.password]);
        response.inserted = true;
        Logger.info(`REGISTRATION: SUCCESS: Account with roll number ${user.roll_number} in college ${user.college} is created.`);
    } catch (err) {
        response.inserted = false;
        if (err.code === '23505') { // Unique constraint violation
            response.errorCode = '23505';
            response.constraint = err.constraint;
            Logger.error('REGISTRATION: UNIQUE VIOLATION: ' + JSON.stringify(err));
        } else if (err.code === '23503') { // Foreign key violation
            response.errorCode = '23503';
            response.constraint = err.constraint;
        } else { // Catch all
            Logger.error('REGISTRATION: ERROR: ' + JSON.stringify(err));
        }
    }
    return response;
};

const getAssocUserNameOfEmail = async (email: string) => {
    return await pool.query(`SELECT user_name FROM ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} WHERE email = $1 LIMIT 1`, [email]);
}

const isActivationLinkAssocToUserName = async (activationlink: string, userName: string) => {
    let res = await pool.query(`SELECT 1 FROM ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} WHERE user_name = $1 AND activation_link = $2`, [userName, activationlink]);
    return (res.rowCount === 1);
}

const setActivationLink = async (email: string, activationLink: string) => {
    try {
        let res = await pool.query(`UPDATE ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} SET activation_link = $1 WHERE email = $2`, [activationLink, email]);
        return res;
    } catch (err) {
        // TODO: Alert Dev
        Logger.error('REGISTRATION: db: setActivationLink: ' + JSON.stringify(err));
    }
}

const activateAccount = async (userName: string) => {
    let res = null;
    try {
        res = await pool.query(`UPDATE ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} SET activated = true WHERE user_name = $1`, [userName]);
    } catch (err) {
        // TODO: Alert Dev
        Logger.error('REGISTRATION: db: activateAccount: ' + JSON.stringify(err));
    }
    return res;
}

const clearActivationLink = async (userName: string) => {
    try {
        return await pool.query(`UPDATE ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} SET activation_link = null WHERE user_name = $1`, [userName]);
    } catch (err) {
        // TODO: Alert Dev
        Logger.error('REGISTRATION: db: clearActivationLink: ' + JSON.stringify(err));
    }
}

module.exports = {
    insertNewUser: insertNewUser,
    setActivationLink: setActivationLink,
    activateAccount: activateAccount,
    getAssocUserNameOfEmail: getAssocUserNameOfEmail,
    isActivationLinkAssocToUserName: isActivationLinkAssocToUserName,
    clearActivationLink: clearActivationLink,
}