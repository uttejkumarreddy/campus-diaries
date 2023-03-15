const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const salt_rounds = 10;

const generateHash = async (text) => {
  let hash = await bcrypt.hash(text, salt_rounds);
  return hash;
};

const compareHashes = async (text, hash) => {
  let isSame = await bcrypt.compare(text, hash);
  return isSame;
};

const generateAuthenticatedUserToken = (user) => {
  return jwt.sign({
    ...user
  }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 });
};

module.exports = {
  generateHash: generateHash,
  compareHashes: compareHashes,
  generateAuthenticatedUserToken: generateAuthenticatedUserToken,
}