const passport = require('passport')

//passport Jwt
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const { User } = require('../models/user_model')


//Passport jwt
const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
        secretOrKey: process.env.PASSPORT_JWT_REFRESH_TOKEN,
    },
    async (jwt_payload, done) => {
        try {
            const { id } = jwt_payload

            const user = await User.findById(id.id)

            if (!user) done(null, false)

            return done(null, user)
        } catch (error) {
            console.log(error)
            return done(error, false)
        }
    }
)

module.exports = {
    jwtStrategy,
    passport
}
