const Logger = require('./logger');

const redis = require('redis');
var client = redis.createClient({
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
			Logger.error('Redis server refused connection.');
			// Emit P1 event
			return undefined;
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
			Logger.error('Redis server connection retry timeout.');
			// Emit P1 event
			return undefined;
        }
        if (options.attempt > 10) {
			// Emit P1 event
			Logger.error('Redis server maximum attempts reached.');
            return undefined;
        }

		return 6000;
    }
});


module.exports = {
	client
};