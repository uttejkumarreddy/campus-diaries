const env = 'test'; // Change config accordingly
const config = require('../src/config/config.json')[env];

const { Pool } = require('pg');
const pool = new Pool(config);

module.exports.seedColleges = async () => {
	let insertQuery =
		`
			INSERT INTO college
			(college_id, name, address, city, state, abbreviation, subscription, customer)
			VALUES
			($1, $2, $3, $4, $5, $6, $7, $8)
		`;

	let data = require('./college').college;
	for (let college of data) {
		try {
			await pool.query(insertQuery, [college.college_id, college.name, college.address, college.city, college.state, college.abbreviation, college.subscription, college.customer]);
		} catch (err) {
			console.log(college.name + ' failed insertion with ' + err);
		}
	}
}

module.exports.seedUsers = async () => {
	let insertQuery =
		`
			INSERT INTO CDUSER
			(user_id, college_id, first_name, last_name, user_name, roll_number, password, email)
			VALUES
			($1, $2, $3, $4, $5, $6, $7, $8)
		`;

	let data = require('./cduser').users;
	for (let user of data) {
		try {
			await pool.query(insertQuery, [user.user_id, user.college_id, user.first_name, user.last_name, user.user_name, user.roll_number, user.password, user.email]);
		} catch (err) {
			console.log(user.user_name + ' failed insertion with ' + err)
		}
	}
}

module.exports.seedAll = async () => {
	await this.seedColleges();
	await this.seedUsers();
}