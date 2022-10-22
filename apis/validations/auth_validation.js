const Joi = require('joi')

const { email, password } = require('./customize.validation')

const loginSchema = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
}

const registerSchema = {
    body: Joi.object().keys({
        firstName: Joi.string().max(15).required(),
        lastName: Joi.string().max(30).required(),
        fullName: Joi.string().max(45).required(),
        email: Joi.string().required().custom(email),
        password: Joi.string().required().custom(password),
        birthday: Joi.date(),
        sex: Joi.string().required(),
        mobile: Joi.string().required(),
    }),
}

const activateEmailSchema = {
    body: Joi.object().keys({
        token: Joi.string(),
    }),
}

const forgotPasswordSchema = {
    body: Joi.object().keys({
        email: Joi.string().required().custom(email),
    }),
}

const resetPasswordSchema = {
    body: Joi.object().keys({
        token: Joi.string(),
        password: Joi.string().required().custom(password),
    }),
}

module.exports = {
    loginSchema,
    registerSchema,
    activateEmailSchema,
    forgotPasswordSchema, 
    resetPasswordSchema
}
