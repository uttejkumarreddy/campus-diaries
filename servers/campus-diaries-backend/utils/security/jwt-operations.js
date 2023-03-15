const jwt = require('jsonwebtoken');
const jwtSecret = require('./secret-key').secret;

const getAuthenticatedUserToken = (userInformation) => {
    return jwt.sign({
        ...userInformation
    }, jwtSecret, { expiresIn: 60 * 60 * 24 * 7});
}

const getAnonymousUserToken = () => {
    return jwt.sign({
        //TODO: Decide what information to store in anonymous user token
    }, jwtSecret, { expiresIn: 60 * 60 * 24});
}

const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
}

module.exports = {
    getAuthenticatedUserToken: getAuthenticatedUserToken,
    getAnonymousUserToken: getAnonymousUserToken,
    isValidToken: verifyToken
}