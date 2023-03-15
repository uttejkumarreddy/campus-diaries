const Joi = require('@hapi/joi');

const onlyLetters = Joi.string().regex(/^[A-Z][A-Za-z\s]+$/);

const collegeDataSchema = Joi.object({
	college: Joi.object({
		name: onlyLetters.required(),
		address: Joi.string().required(),
		city: onlyLetters.uppercase().required(),
		state: onlyLetters.uppercase().required(),
		abbreviation: onlyLetters.uppercase(),
		subscription: Joi.string().uppercase().valid('FREE', 'TRIAL', 'PRO', 'STANDARD').required(),
	}).required()
});

const studentRegistrationSchema = Joi.object({
	user: Joi.object({
		college: Joi.number().required(),
		first_name: onlyLetters.required(),
		last_name: onlyLetters.required(),
		user_name: Joi.string().regex(/^[a-z]+\.[a-z]+$/).lowercase().max(20).required(),
		roll_number: Joi.string().max(20).required(),
		password: Joi.string().required(),
		email: Joi.string().email().required(),
	}).required()
});

const loginSchema = Joi.object({
	user: Joi.object({
		roll_number: Joi.string().max(20).allow(''),
		email: Joi.string().email().allow(''),
		password: Joi.string().required(),
	}).required()
})

module.exports = {
	'/college': collegeDataSchema,
	'/register': studentRegistrationSchema,
	'/login': loginSchema
}