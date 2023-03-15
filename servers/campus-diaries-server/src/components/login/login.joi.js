const Joi = require('@hapi/joi');

const login = Joi.object({
  college: Joi.string().guid({ version: ['uuidv4'] }),
  roll_number: Joi.string().max(20).required(),
  password: Joi.string().required(),
});

const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  '/login': login,
  '/login/forgot-password': forgotPassword,
}