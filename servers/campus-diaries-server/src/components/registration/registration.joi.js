const Joi = require('@hapi/joi');

const namesRegex = Joi.string().regex(/^[A-Z][A-Za-z\s]+$/);

const newRegistration = Joi.object({
  user: Joi.object({
    college: Joi.string().guid({ version: ['uuidv4'] }),
    first_name: namesRegex.required(),
    last_name: namesRegex.required(),
    roll_number: Joi.string().max(20).required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  }).required()
});

const sendActivationLink = Joi.object({
  email: Joi.string().email().required()
});

module.exports = {
  '/register': newRegistration,
  '/register/send-activation-link': sendActivationLink,
}