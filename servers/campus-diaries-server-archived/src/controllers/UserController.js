const pool = require('../loaders/database').pool;
const collegeController = require('./CollegeController');

exports.userExistsWith = async (key, value) => {
	let res;
	if (key === 'roll_number') {
		res = await pool.query('SELECT roll_number FROM cduser where roll_number = $1 LIMIT 1', [value]);
		return (res.rows.length === 0 ? false : true);
	}
	if (key === 'email') {
		res = await pool.query('SELECT email FROM cduser where email = $1 LIMIT 1', [value]);
		return (res.rows.length === 0 ? false : true);
	}
	throw 'Bad Request';
}

exports.userInACollegeHas = async (key, value, onboard_number) => {
	let res;
	let college = await collegeController.getCollegeDetailsByOnboardNumber(onboard_number);
	if (key === 'user_name') {
		res = await pool.query('SELECT user_name FROM cduser WHERE user_name = $1 AND college_id = $2 LIMIT 1', [value, college.college_id]);
		return (res.rows.length === 0 ? false : true);
	}
	if (key === 'roll_number') {
		res = await pool.query('SELECT roll_number FROM cduser WHERE roll_number = $1 AND college_id = $2 LIMIT 1', [value, college.college_id]);
		return (res.rows.length === 0 ? false : true);
	}
	throw 'Bad Request';
}