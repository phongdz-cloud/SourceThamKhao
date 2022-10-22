
const { Province } = require('../models/province_model')
const { District } = require('../models/district_model')
const { Ward } = require('../models/ward_model')
const { Address } = require('../models/address_model')


const getProvinces = async () => {
    return Province.find({})
}

const getDistrictsByProvince = async (provinceID) => {
    return District.find({ province_Id: provinceID })
}

const getWardsByDistrict = async (districtID) => {
    return Ward.find({ district_Id: districtID })
}

const getProvinceInfo = async (provinceID) => {
    return Province.findById(provinceID)
}

const getDistrictInfo = async (districtID) => {
    return District.findById(districtID)
}

const getWardInfo = async (wardID) => {
    return Ward.findById(wardID)
}

const getAddressInfo = async (addressID) => {
    return Address.findById(addressID)
}

module.exports = {
    getProvinces,
    getDistrictsByProvince,
    getWardsByDistrict,
    getProvinceInfo,
    getDistrictInfo,
    getWardInfo,
    getAddressInfo
}
