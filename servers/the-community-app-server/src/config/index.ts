const dotenv = require('dotenv');
const isEnvPresent = dotenv.config();

if (isEnvPresent.error) {
  throw new Error('.env file is not present.');
}

module.exports = {
  port: process.env.PORT,
};