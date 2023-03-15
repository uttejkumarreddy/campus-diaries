const pool = require('../loaders/database').pool;
const authService = require('../services/AuthenticationService');
const collegeController = require('./CollegeController');
const userController = require('./UserController');

exports.registerUser = async (user) => {
	/* Validating user attributes */
	let alreadyExists;
	
	// Roll Number
	alreadyExists = await userController.userInACollegeHas('roll_number', user.roll_number, user.college);
	if (alreadyExists)
		throw 'Bad Request';
	
	// Email
	alreadyExists = await userController.userExistsWith('email', user.email);
	if (alreadyExists)
		throw 'Bad Request';
	
	// User Name - Construction
	let constructedUsername = this.deriveUsername(user.first_name, user.last_name);
	if (constructedUsername != user.user_name)
		throw 'Bad Request';

	// Password sent from app should have min 8 characters and max 15 characters
	let password = new Buffer.from(user.password, 'base64').toString('utf-8');
	if (password.length < 8 || password.length > 15)
		throw 'Bad Request';
	password = await authService.generateHash(user.password);

	// Everything looks good
	let college = await collegeController.getCollegeDetailsByOnboardNumber(user.college);
	let collegeID = college.college_id;

	const query = {
		text: `
			INSERT INTO cduser
			(college_id, first_name, last_name, user_name, roll_number, email, password)
			VALUES
			($1, $2, $3, $4, $5, $6, $7)
		`,
		values: [
			collegeID,
			user.first_name,
			user.last_name,
			user.user_name,
			user.roll_number,
			user.email,
			password
		]
	};

	await pool.query(query);
};

exports.deriveUsername = (first_name, last_name) => {
	return (first_name.toLowerCase().replace(' ', '') + '.' + last_name.toLowerCase().replace(' ', '')).substring(0, 20);
};