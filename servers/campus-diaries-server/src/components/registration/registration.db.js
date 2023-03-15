const pool = require('../../loaders/database').pool;
const Logger = require('../../loaders/logger');

const collegeWithIdExists = async (collegeID) => {
  let res = await pool.query('SELECT 1 FROM college WHERE id = $1', [collegeID]);
  return (res.rowCount === 1 ? true : false);
}

const getAssocRollNumberOfEmail = async (email) => {
  let res = await pool.query('SELECT roll_number FROM users WHERE email = $1 LIMIT 1', [email]);
  return res;
}

const isActivationLinkAssocToRollnumber = async (activationlink, rollnumber) => {
  let res = await pool.query('SELECT 1 FROM users WHERE roll_number = $1 AND activation_link = $2', [rollnumber, activationlink]);
  return (res.rowCount === 1 ? true : false);
}

const setActivationLink = async (email, activationLink) => {
  let res = await pool.query('UPDATE users SET activation_link = $1 WHERE email = $2', [activationLink, email]);
  return res;
}

const activateAccount = async (rollnumber) => {
  let res = await pool.query('UPDATE users SET activated = true WHERE roll_number = $1', [rollnumber]);
  return res;
}

const insertNewUser = async ({ college, first_name, last_name, roll_number, email, passwordHash, username }) => {
  let response = { inserted: null, errorCode: null, constraint: null };
  try {
    await pool.query(
      `
      INSERT INTO users
      (college_id, first_name, last_name, user_name, roll_number, email, password)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `,
      [college, first_name, last_name, username, roll_number, email, passwordHash]);

    response.inserted = true;
    Logger.info(`REGISTRATION: SUCCESS: Account with roll number ${roll_number} in college ${college} is created.`);
  } catch (err) {
    response.inserted = false;
    if (err.code === '23505') {
      response.errorCode = '23505';
      response.constraint = err.constraint;
      Logger.info('REGISTRATION: DUPLICATE: ' + JSON.stringify(err));
    } else {
      Logger.error('REGISTRATION: ERROR: ' + JSON.stringify(err));
    }
  }
  return response;
};

module.exports = {
  collegeWithIdExists: collegeWithIdExists,
  insertNewUser: insertNewUser,
  getAssocRollNumberOfEmail: getAssocRollNumberOfEmail,
  setActivationLink: setActivationLink,
  isActivationLinkAssocToRollnumber: isActivationLinkAssocToRollnumber,
  activateAccount: activateAccount,
};