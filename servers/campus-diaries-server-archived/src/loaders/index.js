const expressLoader = require('./express');
const Logger = require('./logger');

module.exports = async ({ expressApp }) => {
	/* ---------------------
		Postgres
	--------------------- */
	const pool = require('./database').pool;
	const res = await pool.query('SELECT NOW()');

	if (res.rowCount != 1) {
		Logger.error('Failed to connect to database.');
		// Emit P1 event
		process.exit(1);
	}
	Logger.info('Connected to ' + process.env.NODE_ENV + ' database: ' + res.rows[0].now);

	/* ---------------------
		Redis 
	------------------------
	const client = require('./cache').client;

	client.on('error', function (err) {
		Logger.error('Failed to connect to redis cache.');
	});

	client.on('connect', function (err) {
		Logger.info('Connected to redis cache.');
	});
	--------------------- */

	/* ---------------------
		Starting express 
	--------------------- */
	await expressLoader({ app: expressApp });
	Logger.info('Express loaded.');
};