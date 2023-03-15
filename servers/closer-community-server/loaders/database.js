const { Pool } = require('pg');

const env = process.env.NODE_ENV;
const config = require('../config/dbconfig.json')[env];

const pool = new Pool(config);

module.exports = {
  pool,
};
