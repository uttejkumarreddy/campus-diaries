export { };
const pool = require('../../loaders/database').pool;
const constants = require('../../app_constants');

const getCollegeList = async () => {
  return await pool.query(`SELECT college_name AS cname, _id AS cvalue 
    from ${constants.SCHEMA_NAME}.${constants.COLLEGE_TABLE}`);
}

module.exports = {
  getCollegeList: getCollegeList,
}