const pool = require('../../loaders/database').pool;

const getUserDetails = async (college, rollNumber) => {
  let res = await pool.query(
    `
      SELECT user_name, password, roll_number, activated, verified, locked_out, deactivated
      FROM users
      WHERE roll_number = $1 AND college_id = $2
    `, [rollNumber, college]
  );
  if (res.rowCount === 1) {
    return res.rows[0];
  }
  return false;
}

const getAssocRollNumberAndCollegeOfEmail = async (email) => {
  let res = await pool.query('SELECT roll_number, college_id FROM users WHERE email = $1 LIMIT 1', [email]);
  return res;
}

const setPasswordResetKey = async (email, passwordResetKey) => {
  let res = await pool.query('UPDATE users SET password_reset_link = $1 WHERE email = $2', [passwordResetKey, email]);
  return res;
}

const userHasPwdReset = async (college_id, rollNumber, passwordResetKey) => {
  let res = await pool.query('SELECT 1 FROM users WHERE roll_number = $1 AND password_reset_link = $2 AND college_id = $3', [rollNumber, passwordResetKey, college_id]);
  return (res.rowCount === 1 ? true : false);
}

const removePasswordResetLink = async (college_id, rollNumber) => {
  let res = await pool.query('UPDATE users SET password_reset_link = $1 WHERE college_id = $2 AND roll_number = $3', ['', college_id, rollNumber]);
  return res;
}

const updatePasswordHash = async (college_id, rollNumber, passwordHash) => {
  let res = await pool.query('UPDATE users SET password = $1 WHERE college_id = $2 AND roll_number = $3 RETURNING email', [passwordHash, college_id, rollNumber]);
  return res;
} 

module.exports = {
  getUserDetails: getUserDetails,
  setPasswordResetKey: setPasswordResetKey,
  getAssocRollNumberAndCollegeOfEmail: getAssocRollNumberAndCollegeOfEmail,
  userHasPwdReset: userHasPwdReset,
  removePasswordResetLink: removePasswordResetLink,
  updatePasswordHash: updatePasswordHash,
}