export { };
const Joi = require('@hapi/joi');

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  '/login': login,
  '/login/forgot-password': forgotPassword,
}