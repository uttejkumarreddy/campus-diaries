const _ = require('lodash');
const Schemas = require('../services/Joi');

module.exports = () => {
  // useJoiError determines if we should respond with the base Joi error. Set to true during dev.
  // abortEarly determines if validation should stop after encountering first error. Set to false during dev.
  // boolean: defaults to false
  let _useJoiError = false;
  let abortEarly = true;

  if (process.env.NODE_ENV === 'development') {
    _useJoiError = true;
    abortEarly = false;
  }

  // Enabled HTTP methods for request data validation
  const _supportedMethods = ['post', 'put'];

  // Joi validation options
  const _validationOptions = {
    abortEarly: abortEarly, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true // remove unknown keys from the validated data
  };

  // Return the validation middleware
  return async (req, res, next) => {

    const route = req.originalUrl;
    const method = req.method.toLowerCase();

    if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
      // Get schema for the current route
      const _schema = _.get(Schemas, route);

      if (_schema) {
        // Validate req.body using the schema and validation options
        try {
          const value = await _schema.validateAsync(req.body, _validationOptions);
          req.body = value;
          return next();
        } catch (err) {
          // Joi Error
          const JoiError = {
            success: false,
            msg: {
              original: err._object,

              // Fetch only message and type from each error
              details: _.map(err.details, ({ message, type }) => ({
                message: message.replace(/['"]/g, ''),
                type
              }))
            }
          };

          // Custom Error
          const CustomError = {
            success: false,
            msg: 'Invalid request data. Please review request and try again.'
          };

          // Send back the JSON error response
          return res.status(422).json(_useJoiError ? JoiError : CustomError);
        }
      }
    }
    next();
  };
};