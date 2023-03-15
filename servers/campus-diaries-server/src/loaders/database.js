const env = process.env.NODE_ENV;
const config = require('../../configurations/database.json')[env];

const { Pool } = require('pg');
const pool = new Pool(config);

module.exports = {
  pool
};