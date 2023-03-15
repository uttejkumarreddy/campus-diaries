export { };
const pool = require('../../loaders/database').pool;
const constants = require('../../app_constants');

const isRollnumberRegisteredInCollege = async (college: string, rollnumber: string) => {
  let res = await pool.query(`
    SELECT 1
    FROM ${constants.SCHEMA_NAME}.users
    WHERE roll_number = $1
    AND college_id = $2
    AND verified = true
  `, [rollnumber, college]);
  return (res.rowCount === 1);
}

module.exports = {
  isRollnumberRegisteredInCollege: isRollnumberRegisteredInCollege,
}