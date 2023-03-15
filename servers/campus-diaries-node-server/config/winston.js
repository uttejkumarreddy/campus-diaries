var appRoot = require('app-root-path');
var winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: `${appRoot}/logs/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${appRoot}/logs/combined.log` })
  ],
  exitOnError: false,
});

module.exports = logger;