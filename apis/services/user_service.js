const httpStatus = require('http-status')
const CustomError = require('../../utils/custom-error')
const { User } = require('../models/user_model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { string } = require('joi')

const checkUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new CustomError(401, 'Email already taken')
    }
}

const createUser = async (firstName, lastName, fullName,fullNameNotVietnamese, email, password, birthday, sex) => {
    if (await User.isEmailTaken(email)) {
        throw new CustomError(401, 'Email already taken')
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({
        firstName: firstName, 
        lastName: lastName,
        fullName: fullName,
        fullNameNotVietnamese: fullNameNotVietnamese,
        email: email,
        password: passwordHash,
        birthday: birthday,
        sex: sex
    })

    return newUser.save()
}

const getUser = async (email, password) => {
    const user = await User.findOne({email}).populate("followers following", "avatar fullName firstName lastName followers following")
    if(!user) throw new CustomError(401, 'This email does not exist.')

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new CustomError(402, 'Password is incorrect.')

    return user
}

const getUserByEmail = async (email) => {
    const user = await User.findOne({email}).populate("followers following", "avatar username fullname followers following")
    if(!user) throw new CustomError(400, 'This email does not exist.')
    return user

}

const getUserByRefreshToken = async (refreshToken) => {
    try {
        jwt.verify(refreshToken, process.env.PASSPORT_JWT_REFRESH_TOKEN)
        const { email } = jwt.decode(token)
        const user = await getUserByEmail(email)
        if(!user) return res.status(500).json({msg: 'This account does not exist.'}) 
        return user
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

}

const getUserByID = async (userID) => {
    const user = await User.findOne({_id: userID}).select('-password').populate("followers following", "-password")
    if(!user) throw new CustomError(400, 'This user does not exist.')

    return user

}

const getUsersBySearch = async (fullName) => {
    const search = nonAccentVietnamese(fullName)
    const regex = new RegExp(search, 'i') // i for case insensitive
    const users = await User.find({fullNameNotVietnamese: {$regex: regex}}).limit(10).select("fullName email avatar _id")
    return users
}

const getProfileByUserID = async (id) => {
    const user = await User.findById(id).select('-password').populate("followers following", "-password")
    const temp = user
    temp.password = ""
    return temp
}

function nonAccentVietnamese(str) {
    str = str.toLowerCase();
//     We can also use this instead of from line 11 to line 17
//     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
//     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
//     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
//     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
//     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
//     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
//     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}

const resetPassword = async (token, password) => {
    try {
        jwt.verify(token, process.env.PASSPORT_JWT_RESET_PASSWORD)
        const { email } = jwt.decode(token)
        const user = await getUserByEmail(email)
        const passwordHash = await bcrypt.hash(password, 10)
        user.password = passwordHash
        user.save()
    } catch (err) {
        throw new CustomError(httpStatus.INTERNAL_SERVER_ERROR, err.message)
    }
}

const updateUser = async (userData, address) => {
    const { _id, avatar, fullName, mobile, story, website, birthday, sex} = userData
    const fullNameNotVietnamese = nonAccentVietnamese(fullName)
    const user = await User.findOneAndUpdate({_id: _id}, {
        avatar, fullName, mobile, address, story, website, sex, birthday, fullNameNotVietnamese
    }).select('-password').populate("followers following", "-password")
    const temp = user
    temp.password = ""
    return temp
}

const updateEmail = async (email, userID) => {
    const user = await User.findOneAndUpdate({_id: userID}, {
        email
    }).select('-password').populate("followers following", "-password")
    const temp = user
    temp.password = ""
    return temp
}



module.exports = {
    getUser,
    checkUser,
    createUser,
    getUserByEmail,
    resetPassword,
    getUserByID,
    getUsersBySearch,
    getProfileByUserID,
    updateUser,
    updateEmail,
    getUserByRefreshToken
}
