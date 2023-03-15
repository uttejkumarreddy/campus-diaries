const expressJwt = require('express-jwt');
const config = require('../../config');

const authorize = (roles = []) => {
	if (typeof roles === 'string') {
		roles = [roles];
	}

	return [
		// Authenticates JWT token and attaches user to request object (req.user)
		expressJwt({ secret: config.jwtSecret }),

		// Authorize based on user role
		(req, res, next) => {
			if (roles.length && !roles.includes(req.user.role)) {
				next('Insufficient permissions');
			}

			next();
		}
	];
}

module.exports = authorize;
