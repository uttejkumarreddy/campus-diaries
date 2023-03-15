export {};
const expressLoader = require('./express');
const logger = require('./logger');

module.exports = async ({ expressApp }: { expressApp: any }) => {
  // Connecting to postgresql database
  const pool = require('./database').pool;
  const res = await pool.query('SELECT NOW()');

  if (res.rowCount != 1) {
    logger.error('Failed to connect to database.');
    process.exit(1);
    pool.end();
  }
  logger.info('Connected to ' + process.env.NODE_ENV + ' database: ' + res.rows[0].now);

	// Loading express middlewares
  await expressLoader({ app: expressApp });
  logger.info('Loaded express with specified configurations');
};