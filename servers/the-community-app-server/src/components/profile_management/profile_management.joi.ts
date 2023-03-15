const Joi = require('@hapi/joi');

const namesRegex = Joi.string().regex(/^[A-Z][A-Za-z\s]+$/);

const updateUserProfile = Joi.object({
    user: Joi.object({
        user_name: Joi.string().regex(/^[a-z]+\.[a-z]+$/).required(),
        first_name: namesRegex,
        last_name: namesRegex,
        email: Joi.string().email(),
        phone_number: Joi.string(),
        deActivated: Joi.boolean(),
        deActivated_reason: Joi.string(),
        profile_description: Joi.string(),
        current_year: Joi.number().integer(),
        course: Joi.string(),
        section: Joi.string()
    }).required()
});

const reportUser = Joi.object({
    reported_by: Joi.string().regex(/^[a-z]+\.[a-z]+$/).required(),
    reported_reason: Joi.string().required(),
    reportee: Joi.string().regex(/^[a-z]+\.[a-z]+$/).required()
});

module.exports = {
    '/profile': updateUserProfile,
    '/profile/report-user': reportUser,
}