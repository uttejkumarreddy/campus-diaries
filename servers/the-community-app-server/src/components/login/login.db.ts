export { };
const pool = require('../../loaders/database').pool;
const Logger = require('../../loaders/logger');
const constants = require('../../app_constants');

const getUserDetails = async (email: string) => {
  let res = await pool.query(
    `
      SELECT _id, user_name, password, roll_number, activated, verified, locked_out, deactivated
      FROM ${constants.SCHEMA_NAME}.${constants.USERS_TABLE}
      WHERE email = $1
    `, [email]
  );
  return res;
}

const getAssocRollNumberAndCollegeOfEmail = async (email: string) => {
  let res = await pool.query(`SELECT roll_number, college_id FROM ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} WHERE email = $1 LIMIT 1`, [email]);
  return res;
}

const setPasswordResetKey = async (email: string, passwordResetKey: string) => {
  let res = null;
  try {
    res = await pool.query(`UPDATE ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} SET password_reset_link = $1 WHERE email = $2`, [passwordResetKey, email]);
  } catch (err) {
    // TODO: Alert dev
    Logger.error('LOGIN: PASSWORD RESET KEY SET ERROR: ' + JSON.stringify(err));
  }
  return res;
}

const userHasPwdReset = async (college_id: string, rollNumber: string, passwordResetKey: string) => {
  let res = await pool.query(`SELECT 1 FROM ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} WHERE roll_number = $1 AND password_reset_link = $2 AND college_id = $3`, [rollNumber, passwordResetKey, college_id]);
  return (res.rowCount === 1);
}

const removePasswordResetLink = async (college_id: string, rollNumber: string) => {
  try {
    await pool.query(`UPDATE ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} SET password_reset_link = $1 WHERE college_id = $2 AND roll_number = $3`, ['', college_id, rollNumber]);
  } catch (err) {
    // TODO: Alert dev
    Logger.error('LOGIN: PASSWORD RESET KEY CLEAR ERROR: ' + JSON.stringify(err));
  }
}

const updatePasswordHash = async (college_id: string, rollNumber: string, passwordHash: string) => {
  let res = null;
  try {
    res = await pool.query(`UPDATE ${constants.SCHEMA_NAME}.${constants.USERS_TABLE} SET password = $1 WHERE college_id = $2 AND roll_number = $3 RETURNING email`, [passwordHash, college_id, rollNumber]);
    return res;
  } catch (err) {
    // TODO: Alert dev
    Logger.error('LOGIN: PASSWORD UPDATE ERROR: ' + JSON.stringify(err));
  }
  
}

module.exports = {
  getUserDetails: getUserDetails,
  setPasswordResetKey: setPasswordResetKey,
  getAssocRollNumberAndCollegeOfEmail: getAssocRollNumberAndCollegeOfEmail,
  userHasPwdReset: userHasPwdReset,
  removePasswordResetLink: removePasswordResetLink,
  updatePasswordHash: updatePasswordHash,
}