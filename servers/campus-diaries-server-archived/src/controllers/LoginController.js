const pool = require('../loaders/database').pool;

const authService = require('../services/AuthenticationService');

exports.loginUser = async (user) => {
	let payload = { token: null, msg: null };

	let res;
	if (user.roll_number) {
		res = await pool.query(`
			SELECT roll_number, password, active, verified, locked_out, customer
			FROM cduser, college 
			WHERE roll_number = $1 
			LIMIT 1`, [user.roll_number]);
	}
	if (user.email) {
		res = await pool.query(`
			SELECT roll_number, password, active, verified, locked_out 
			FROM cduser 
			WHERE email = $1 
			LIMIT 1`, [user.email]);
	}

	// If no account found
	if (res.rowCount != 1) {
		payload.msg = 'Invalid credentials';
		return payload;
	}

	res = res.rows[0];

	// If account is locked out
	if (res.locked_out) {
		payload.msg = 'Your account has been locked out.';
		return payload;
	}

	// If account is not activated
	if (!res.active) {
		payload.msg = 'Your account has not been activated yet.';
		return payload;
	}

	// Verify password
	let password = new Buffer.from(user.password, 'base64').toString('utf-8');
	let passwordsMatch = await authService.compareHashes(password, res.password);

	// Incorrect credentials
	if (!passwordsMatch) {
		payload.msg = 'Invalid credentials';
		return payload;
	}

	// Everything's good. Retrieve that information now.

	let userInformation = {
		roll_number: user.roll_number,

	};

	payload.token = await authService.generateAuthenticatedUserToken(userInformation);

	return payload;
}