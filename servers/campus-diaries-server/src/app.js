require('dotenv').config();

const express = require('express');
const Logger = require('./loaders/logger');

const startServer = (async () => {
  const app = express();
  await require('./loaders')({ expressApp: app });
  
  app.listen(process.env.PORT, (err) => {
    if (err) {
      Logger.error('Failed to start server');
      Logger.error(err);
      process.exit(1);
    }
    Logger.info('Server started on port ' + process.env.PORT);
  });
})();