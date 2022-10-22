const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AddressSchema = new Schema(
    {
        province_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'provinces',
        },
        district_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'districts',
        },
        ward_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'wards',
        },
        note: {
            type: String,
            default:'',
        },

    },
    {
        timestamps: false,
        versionKey: false,
    }
)

const Address = mongoose.model('address', AddressSchema)

module.exports = {
    Address,
    AddressSchema,
}
