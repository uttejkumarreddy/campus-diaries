let config = require('./config');
const express = require('express');
const entryLevelLogger = require('./loaders/logger');

const startServer = (async () => {
  const app = express();
  await require('./loaders')({ expressApp: app });
  app.listen(config.port, (err: Error) => {
    if (err) {
      entryLevelLogger.error("Failed to start server");
      entryLevelLogger.error(err);
      process.exit(1);
    }
    entryLevelLogger.info("Server started on port " + config.port);
  });
})();