const env = 'test'; // Change config accordingly
const config = require('../src/config/config.json')[env];

const { Pool } = require('pg');
const pool = new Pool(config);

module.exports.migrateExtensions = async () => {
	let extensions = require('./extensions');
	for (let i of Object.keys(extensions)) {
		try {
			await pool.query(extensions[i]);
		} catch (err) {
			console.log(i + ' failed execution with ' + err);
		}
	}
};

module.exports.migrateTableSchemas = async () => {
	let tableSchemas = require('./tables');
	for (let i of Object.keys(tableSchemas)) {
		try {
			await pool.query(tableSchemas[i]);
		} catch (err) {
			console.log(i + ' failed execution with ' + err);
		}
	}
};

module.exports.migrateTriggerFunctions = async () => {
	let triggerFunctions = require('./trigger_functions');
	for (let i of Object.keys(triggerFunctions)) {
		try {
			await pool.query(triggerFunctions[i]);
		} catch (err) {
			console.log(i + ' failed execution with ' + err);
		}
	}
}

module.exports.migrateTriggers = async () => {
	let triggers = require('./triggers');
	for (let i of Object.keys(triggers)) {
		try {
			await pool.query(triggers[i]);
		} catch (err) {
			console.log(i + ' failed execution with ' + err);
		}
	}
}

module.exports.migrateAll = async () => {
	await migrateExtensions();
	await migrateTableSchemas();
	await migrateTriggerFunctions();
	await migrateTriggers();
}