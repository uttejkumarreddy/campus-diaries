const dotenv = require('dotenv');

const envFound = dotenv.config();
if (!envFound) {
	throw new Error("Couldn't find .env file");
}

module.exports = {
	port: process.env.PORT,

	jwtSecret: process.env.JWT_SECRET
};