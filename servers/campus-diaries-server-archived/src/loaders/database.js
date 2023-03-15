const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.json')[env];

const { Pool } = require('pg');
const pool = new Pool(config);

module.exports = {
	pool
};