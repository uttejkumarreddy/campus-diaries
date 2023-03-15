const expressLoader = require('./express');
const Logger = require('./logger');

module.exports = async ({ expressApp }) => {
  // Database
  // eslint-disable-next-line global-require
  const { pool } = require('./database');
  const res = await pool.query('SELECT NOW()');

  if (res.rowCount !== 1) {
    // Handle P1 error
    throw new Error('CODE RED: DATABASE CONNECTION FAILED');
  }
  Logger.info(`Connected to ${process.env.NODE_ENV} database at ${res.rows[0].now}.`);

  // Express
  await expressLoader({ app: expressApp });
};
