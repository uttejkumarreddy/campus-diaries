const pool = require('../loaders/database').pool;

exports.createCollege = async (college) => {
	const query = {
		text: `
			INSERT INTO college
			(name, address, city, state, abbreviation, subscription)
			VALUES
			($1, $2, $3, $4, $5, $6)
			RETURNING name, city, state, abbreviation
		`,
		values: [
			college.name,
			college.address,
			college.city,
			college.state,
			college.abbreviation,
			college.subscription
		]
	};

	const res = await pool.query(query);
	return res.rows;
};

exports.getColleges = async () => {
	const res = await pool.query('SELECT name, customer AS onboard_number FROM college');
	return res.rows;
};

exports.getCollegeDetailsByOnboardNumber = async (customer) => {
	const res = await pool.query('SELECT * FROM college WHERE customer = $1', [customer]);
	if (res.rows.length !== 1)
		throw 'Bad Request';
	return res.rows[0];
};
