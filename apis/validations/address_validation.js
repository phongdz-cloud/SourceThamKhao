const Joi = require('joi')

const { objectId } = require('./customize.validation')

const getDistrictByProvinceSchema = {
    params: Joi.object().keys({
        provinceID: Joi.string().required().custom(objectId),
    }),
}
const getWardsByDistrict = {
    params: Joi.object().keys({
        districtID: Joi.string().required().custom(objectId),
    }),
}

const getProvinceInfoByID = {
    params: Joi.object().keys({
        provinceID: Joi.string().required().custom(objectId),
    }),
}

const getDistrictInfoByID = {
    params: Joi.object().keys({
        districtID: Joi.string().required().custom(objectId),
    }),
}

const getWardInfoByID = {
    params: Joi.object().keys({
        wardID: Joi.string().required().custom(objectId),
    }),
}

const getAddressLineByID = {
    params: Joi.object().keys({
        addressID: Joi.string().required().custom(objectId),
    }),
}

module.exports = {
    getDistrictByProvinceSchema,
    getWardsByDistrict,
    getProvinceInfoByID,
    getDistrictInfoByID,
    getWardInfoByID,
    getAddressLineByID
}
