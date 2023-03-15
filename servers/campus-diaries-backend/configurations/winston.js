const winston = require('winston')
const appRoot = require('app-root-path')

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'error',
            filename: `${appRoot}/logs/error.log`,
            handleExceptions: true,
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            level: 'info',
            filename: `${appRoot}/logs/combined.log`,
            handleExceptions: true,
            json: true,
            colorize: true
        })
    ],
    exitOnError: false
})

logger.stream = {
    write: function (message, encoding) {
        logger.info(message)
    }
}

module.exports = logger
