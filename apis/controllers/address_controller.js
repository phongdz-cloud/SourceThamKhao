const httpStatus = require('http-status')

const catchAsync = require('../../utils/catch-async')
const { addressService } = require('../services')

const getProvinces = catchAsync(async (req, res, next) => {
    const provinces = await addressService.getProvinces()
    return res.status(httpStatus.OK).send(provinces)
})

const getDistrictsByProvince = catchAsync(async (req, res, next) => {
    const districts = await addressService.getDistrictsByProvince(req.params.provinceID)
    return res.status(httpStatus.OK).send(districts)
})

const getWardsByDistrict = catchAsync(async (req, res, next) => {
    const wards = await addressService.getWardsByDistrict(req.params.districtID)
    return res.status(httpStatus.OK).send(wards)
})

const getProvinceById = catchAsync(async (req, res, next) => {
    const province = await addressService.getProvinceInfo(req.params.provinceID)
    return res.status(httpStatus.OK).send(province)
})

const getDistrictById = catchAsync(async (req, res, next) => {
    const district = await addressService.getDistrictInfo(req.params.districtID)
    return res.status(httpStatus.OK).send(district)
})

const getWardById = catchAsync(async (req, res, next) => {
    const ward = await addressService.getWardInfo(req.params.wardID)
    return res.status(httpStatus.OK).send(ward)
})

const getAddressLineByAddressID = catchAsync(async (req, res, next) => {
    const {address} = req.body
    if(address.ward_Id == null) {
        const addressLine = ""
        console.log("Empty address line")
        return res.status(httpStatus.OK).send(addressLine)
    }
    const {province_Id, district_Id, ward_Id} = address
    const province = await addressService.getProvinceInfo(province_Id)
    const district = await addressService.getDistrictInfo(district_Id)
    const ward = await addressService.getWardInfo(ward_Id)
    const addressLine = ward.name + ", " + district.name + ", " + province.name
    console.log("Get address line finished")
    console.log(addressLine)
    return res.status(httpStatus.OK).send(addressLine)
})


module.exports = {
    getProvinces,
    getDistrictsByProvince,
    getWardsByDistrict,
    getProvinceById,
    getDistrictById,
    getWardById,
    getAddressLineByAddressID
}
