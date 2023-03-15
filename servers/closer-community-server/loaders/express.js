const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('../services/ErrorHandlerService');

module.exports = ({ app }) => {
  // Health check points
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Some extra protection
  app.use(helmet());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Configuring view engine
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '..', 'views'));

  // Load API routes
  // eslint-disable-next-line global-require
  app.use(require('../components/routes'));

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('PageNotFoundError');
    err.status = 404;
    next(err);
  });

  // Error handler
  app.use(errorHandler);
};
