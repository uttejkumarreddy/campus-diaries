export {};
const Joi = require('@hapi/joi');

const newItem = Joi.object({
  item: Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().max(300).optional().default(''),
    status: Joi.string().valid('Draft', 'Available to Borrow', 'Available for Sale').required(),
    price: Joi.number().when('status', {is: 'Available for Sale', then: Joi.required(), otherwise: Joi.optional()}).default(0),
    expiration_period: Joi.optional().default(0),
    categories: Joi.array().items(Joi.string()).optional(),
    image: Joi.string().optional(),
  }).required()
});

module.exports = {
  '/item': newItem,
}