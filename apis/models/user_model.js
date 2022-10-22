const mongoose = require('mongoose')
const { AddressSchema } = require('../models/address_model')

const UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      trim: true,  
      maxlength: 15,
    },

    lastName: {
        type: String,
        required: true,
        trim: true,  
        maxlength: 30,
      },

    fullName: {
        type: String,
        required: true,
        maxlength: 45
    },

    fullNameNotVietnamese: {

    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        private: true,
    },

    avatar:{
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/be-beauty-app.appspot.com/o/avatar.jpg?alt=media&token=4cb911b2-3282-4aea-b03a-0ab9b681602a'
    },

    birthday: {
        type: Date,
    },

    sex: {
        type: String,
        default: 'Male',
    },

    role: {
        type: String, 
        default: 'User'
    },

    mobile: {
        type: String, 
        default: ''
    },

    address: {
        type: AddressSchema,
        default: {}
    },


    story: {
        type: String, 
        default: '',
        maxlength: 500
    },

    website: {
        type: String, 
        default: ''
    },

    followers: [{type: mongoose.Types.ObjectId, ref: 'user'}],

    following: [{type: mongoose.Types.ObjectId, ref: 'user'}],

    saved: [{type: mongoose.Types.ObjectId, ref: 'user'}]
}, {
    timestamps: true
})

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
 UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
    return !!user
}

const User = mongoose.model('user', UserSchema)

module.exports = {
    UserSchema,
    User,
}
