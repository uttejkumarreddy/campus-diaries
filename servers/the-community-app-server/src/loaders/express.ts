import { NextFunction, Request, Response } from "express";

const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('./logger');
const errorHandler = require('../services/ErrorHandler');

module.exports = ({ app }: { app: any }) => {

  // Health check points
  app.get('/status', (req: Request, res: Response) => {
    res.status(200).end();
  });
  app.head('/status', (req: Request, res: Response) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Configure logger
  app.use(morgan('combined', { stream: winston.stream }));

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Some extra protection
  app.use(helmet());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Configuring view engine
  app.set('view engine', 'html');
  const nunjucks = require('nunjucks');
  nunjucks.configure(path.join(__dirname, '..', '..', 'views'), {
    autoescape: true,
    express: app
  });

  // Load API routes
  app.use(require('../routes'));

  // Catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    const err: Error = new Error();
    err.name = 'PageNotFoundError';
    err.message = 'Invalid URL';
    next(err);
  });

  // Error handler
  app.use(errorHandler);
};