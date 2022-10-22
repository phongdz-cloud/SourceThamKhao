const httpStatus = require('http-status')

const jwt = require('jsonwebtoken')

const catchAsync = require('../../utils/catch-async')
const { userService, tokenService, authService } = require('../services')
const CustomError = require('../../utils/custom-error')
const { User } = require('../models/user_model')
const { OAuth2Client } = require('google-auth-library')
const { string } = require('joi')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body
    const user = await userService.getUser(email, password)
    const accessToken = tokenService.generateAccessToken({id: user._id})
    const refreshToken = tokenService.generateRefreshToken({id: user._id})
    console.log("Login sucessfully")
    res.setHeader('Authorization', `Bearer ${refreshToken}`)
    res.status(httpStatus.OK).send({
        user: {
            ...user._doc,
            password: "",
        }, 
        accessToken, 
        refreshToken})
})

const register = catchAsync(async (req, res) => {
    const user = await userService.checkUser(req.body)
    //const token = await tokenService.generateTokenForSendVerificationEmail(req.body)

    console.log("Move to confirm email before sending email")
    res.status(httpStatus.CREATED).send({
        statusCode: 200,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday,
        sex: req.body.sex,
        mobile: req.body.mobile,
        message: 'Valid information. Move to confirm email before sending email activation.',
    })
})

const sendVerificationEmail = catchAsync(async (req, res) => {
    const {email} = req.body
    const token = await tokenService.generateTokenForSendVerificationEmail(req.body)
    await authService.sendVerificationEmail(token, email)
    console.log("Sending email successfully")
    res.status(httpStatus.CREATED).send({
        statusCode: 200,
        token: token,
        email: email, 
        message: 'Sending email successfully',
    })

})

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

const activateEmail = catchAsync(async (req, res) => {
    const { token } = req.body
    console.log(token)
    try {
        jwt.verify(token, process.env.PASSPORT_JWT_ACCOUNT_ACTIVATION)
        const { firstName, lastName, fullName, email, password, birthday, sex} = jwt.decode(token)
        const fullNameNotVietnamese = nonAccentVietnamese(fullName)
        const user = await userService.createUser(firstName, lastName, fullName,fullNameNotVietnamese, email, password, birthday, sex)
        console.log("Register sucessfully")
        res.status(httpStatus.CREATED).send({
            statusCode: 200,
            message: 'Create user successfully',
        })
    } catch (err) {
        throw new CustomError(402, err.message)
    }
   
})

const checkResetTokenValid = catchAsync(async (req, res) => {
    const { token } = req.body
    try {
        jwt.verify(token, process.env.PASSPORT_JWT_RESET_PASSWORD)
        console.log("Valid reset token")
        res.status(httpStatus.CREATED).send({
            statusCode: 200,
            message: 'Valid token',
        })
    } catch (err) {
        throw new CustomError(500, err.message)
    }
   
})

const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body
    const user = await userService.getUserByEmail(email)
    const resetPasswordToken = await tokenService.generateResetPasswordToken(email)
    await authService.sendResetPasswordEmail(resetPasswordToken, email)
    console.log("Send email to reset password")
    res.status(httpStatus.OK).send({
        message: 'Send email to reset password',
        token: resetPasswordToken
    })
})

const resetPassword = catchAsync(async (req, res) => {
    const { token, password } = req.body
    await userService.resetPassword(token, password)
    console.log("Change your password successfully")
    res.status(httpStatus.OK).send({
        message: 'Change your password successfully',
    })
})

const authGoogle = catchAsync(async (req, res) => {
    try {
       const { idToken } = req.body
       client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then((response) => {
           const { email, family_name, given_name, name, picture } = response.payload
           console.log(email)

           User.findOne({ email }).exec((err, user) => {
               if (user) {
                    const accessToken = tokenService.generateAccessToken({id: user._id})
                    const refreshToken = tokenService.generateRefreshToken({id: user._id})
                    const temp = user
                    temp.password = ""
                    console.log("Login by google account successfully")
                   
                    res.setHeader('Authorization', `Bearer ${refreshToken}`)
                    return res.status(httpStatus.OK).send({user: temp, accessToken, refreshToken})
               } else {
                    const fullNameNotVietnamese = nonAccentVietnamese(name)
                    user = new User({
                        firstName: family_name,
                        lastName: given_name,
                        fullName: name,
                        fullNameNotVietnamese: fullNameNotVietnamese,
                        email: email,
                        password: email + '123456',
                        image: picture,
                        birthday: '2001-01-01',
                        mobile: "",
                        })
                        user.save((err, data) => {
                            if (err) {
                                throw new CustomError(500, 'Internet Server Error')
                            }
                             const accessToken = tokenService.generateAccessToken({id: user._id})
                             const refreshToken = tokenService.generateRefreshToken({id: user._id})

                             console.log("Register by google account successfully")
                             res.setHeader('Authorization', `Bearer ${refreshToken}`)

                             const temp = user
                             temp.password = ""
                             return res.status(httpStatus.OK).send({
                                accessToken, 
                                refreshToken,
                                user: temp})
                        })
               }
           })
       })
   } catch (err) {
       throw new CustomError(500, 'Internet Server Error')
   }
})

const checkLogin = catchAsync(async (req, res) => {
    const { accessToken, refreshToken } = req.body
    const token = tokenService.checkAccessTokenAndRefreshToken(accessToken, refreshToken)
    const userID = tokenService.getUserIDByRefreshToken(refreshToken)
    console.log(userID)
    const user = await userService.getUserByID(userID)
    const temp = user
    temp.password = ""
    console.log("Check login successfully")
    res.setHeader('Authorization', `Bearer ${token.refreshToken}`)
    res.status(httpStatus.OK).send({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: temp,
        message: "Check login successfully"
    })

   
   
})



module.exports = {
    login,
    register,
    sendVerificationEmail,
    activateEmail, 
    forgotPassword,
    resetPassword,
    authGoogle,
    checkResetTokenValid, 
    checkLogin
}
