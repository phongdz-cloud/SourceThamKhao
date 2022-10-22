const Joi = require('joi')

const { objectId } = require('./customize.validation')

const searchUserSchema = {
    body: Joi.object().keys({
        fullName: Joi.string().required(),
    }),
}

const getUserSchema = {
    body: Joi.object().keys({
        userID: Joi.string().required().custom(objectId),
    }),
}

module.exports = {
    searchUserSchema,
    getUserSchema,
}
