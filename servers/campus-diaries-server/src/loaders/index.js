const expressLoader = require('./express');
const Logger = require('./logger');

module.exports = async ({ expressApp }) => {
  const pool = require('./database').pool;
  const res = await pool.query('SELECT NOW()');
  if (res.rowCount != 1) {
    Logger.error('Failed to connect to database.');
    process.exit(1);
  }
  Logger.info('Connected to ' + process.env.NODE_ENV + ' database: ' + res.rows[0].now);

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded.');
};