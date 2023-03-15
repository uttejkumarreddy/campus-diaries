const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

const salt_rounds = 10;

exports.generateHash = async (text) => {
	let hash = await bcrypt.hash(text, salt_rounds);
	return hash;
};

exports.compareHashes = async (text, hash) => {
	let isSame = bcrypt.compare(text, hash);
	return isSame;
};

exports.generateAuthenticatedUserToken = (userInformation) => {
    return jwt.sign({
        ...userInformation
    }, config.jwtSecret, { expiresIn: 60 * 60 * 24 * 7});
}

exports.generateAnonymousUserToken = () => {
    return jwt.sign({
        //TODO: Decide what information to store in anonymous user token
    }, config.jwtSecret, { expiresIn: 60 * 60 * 24});
}