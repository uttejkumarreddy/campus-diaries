const envFound = require('dotenv').config();

if (!envFound) {
  // Handle P1 error
  throw new Error('CODE RED: ENVIRONMENT FILE MISSING');
}

const express = require('express');
const Logger = require('./loaders/logger');
const config = require('./config');

async function startServer() {
  const app = express();

  // eslint-disable-next-line global-require
  await require('./loaders')({ expressApp: app });

  app.listen(config.port, (err) => {
    if (err) {
      // Handle P1 error
      throw new Error(`CODE RED: SERVER STARTUP FAILED ${err}`);
    }
    Logger.info(`Server started on port ${config.port}`);
  });
}

startServer();
