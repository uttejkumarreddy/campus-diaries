require('dotenv').config();

if (process.env.NODE_ENV != 'test') {
	console.log('To run tests, change NODE_ENV to test');
	process.exit(1);
}

const expect = require('expect');
const axios = require('axios').default;

const env = process.env.NODE_ENV;
const config = require('../src/config/config.json')[env];

const { Pool } = require('pg');
const testPool = new Pool(config);

const BASE_URL = 'http://localhost:3000/';

var API = {
	// Server status
	getStatus: 'status/',

	// College
	getCollege: 'college/',
	postCollege: 'college/',

	// Registration
	register: 'register/',

	// Login
	login: 'login/',

	// User
	getUser: 'user/',
}

// Drop existing database
before(async () => {
	let dropSQL = 'DROP SCHEMA IF EXISTS public CASCADE;';
	let createSQL = 'CREATE SCHEMA public;';
	let permissionsSQL = 'GRANT ALL ON SCHEMA public TO postgres';
	let setPostgresPassword = "ALTER USER postgres WITH PASSWORD 'admin'";

	try {
		await testPool.query(dropSQL);
		await testPool.query(createSQL);
		await testPool.query(permissionsSQL);
		await testPool.query(setPostgresPassword);
	} catch (err) {
		expect(err).toBeNull();
	}
});

// Reconstruct database
before(async () => {
	try {
		// Extensions
		let extensions = require('../migrations/extensions');
		for (let i of Object.keys(extensions)) {
			await testPool.query(extensions[i]);
		}

		// Tables
		let tableSchemas = require('../migrations/tables');
		for (let i of Object.keys(tableSchemas)) {
			await testPool.query(tableSchemas[i]);
		}

		// Trigger Functions
		let triggerFunctions = require('../migrations/trigger_functions');
		for (let i of Object.keys(triggerFunctions)) {
			await testPool.query(triggerFunctions[i]);
		}

		// Triggers
		let triggers = require('../migrations/triggers');
		for (let i of Object.keys(triggers)) {
			await testPool.query(triggers[i]);
		}
	} catch (err) {
		expect(err).toBeNull();
	}
});

// Seed data
before(async () => {
	try {
		await require('../seeders/seed').seedAll();
	} catch (err) {
		console.log('Seeding failed with ' + err);
	}
});

before('Server should be up and running', async () => {
	let resp = await axios.get(BASE_URL + API.getStatus);
	if (resp.status != 200)
		throw new Error('Server not up. Aborting further tests...');
});

before('Server should be connected to Postgresql', async () => {
	let resp = await testPool.query('SELECT NOW()');
	if (resp.rowCount != 1)
		throw new Error('Server not connected to database. Aborting further tests...');
});

// List tests in run order

module.exports = {
	API: API,
	BASE_URL: BASE_URL,
	TEST_POOL: testPool,
	AXIOS: axios
}