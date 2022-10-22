const jwt = require('jsonwebtoken')
const moment = require('moment')

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */

const generateTokenForSendVerificationEmail = (userBody) => {
    const payload = {
        firstName: userBody.firstName,
        lastName: userBody.lastName,
        fullName: userBody.fullName,
        email: userBody.email,
        password: userBody.password,
        birthday: userBody.birthday,
        sex: userBody.sex,
        mobile: userBody.mobile
    }
    return jwt.sign(payload, process.env.PASSPORT_JWT_ACCOUNT_ACTIVATION, {
        expiresIn: '5m',
    })
}

const generateAccessToken = (id) => {
    const payload = {
        id: id
    }
    return jwt.sign(payload, process.env.PASSPORT_JWT_ACCESS_TOKEN, {
        expiresIn: '1d',
    })
}

const generateRefreshToken = (id) => {
    const payload = {
        id: id
    }
    return jwt.sign(payload, process.env.PASSPORT_JWT_REFRESH_TOKEN, {
        expiresIn: '7d',
    })
}

const generateResetPasswordToken = (email) => {
    const resetPasswordToken = jwt.sign(
        {
            email,
        },
        process.env.PASSPORT_JWT_RESET_PASSWORD,
        {
            expiresIn: '5m',
        }
    )
    return resetPasswordToken
}

const checkAccessTokenAndRefreshToken = (accessToken, refreshToken) => {
    try {
        jwt.verify(accessToken, process.env.PASSPORT_JWT_ACCESS_TOKEN)
        const token = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
        return token
    } catch (err) {
        try {
            jwt.verify(refreshToken, process.env.PASSPORT_JWT_REFRESH_TOKEN)
            const { id } = jwt.decode(refreshToken)
            const newAccessToken = generateAccessToken(id)
            const newRefreshToken = generateRefreshToken(id)

            const token = {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
            return token
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

}

const getUserIDByRefreshToken= (refreshToken) => {
    try {
        jwt.verify(refreshToken, process.env.PASSPORT_JWT_REFRESH_TOKEN)
        const { id } = jwt.decode(refreshToken)
        return id.id
    } catch (err) {
        throw new CustomError(500, err.message)
    }

}

module.exports = {
    generateTokenForSendVerificationEmail,
    generateAccessToken,
    generateRefreshToken,
    generateResetPasswordToken,
    checkAccessTokenAndRefreshToken,
    getUserIDByRefreshToken,
}
