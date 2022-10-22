const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DistrictSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        province_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'provinces',
        },
    },
    {
        timestamps: false,
        versionKey: false,
    }
)

const District = mongoose.model('districts', DistrictSchema)

module.exports = {
    DistrictSchema,
    District,
}
