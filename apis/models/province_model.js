const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ProvinceSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: false,
        versionKey: false,
    }
)

const Province = mongoose.model('provinces', ProvinceSchema)

module.exports = {
    ProvinceSchema,
    Province,
}
