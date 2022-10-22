const {User} = require("../models/user_model")
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")

        if(!token) return res.status(400).json({msg: "Invalid Authentication."})

        const decoded = jwt.verify(token, process.env.PASSPORT_JWT_REFRESH_TOKEN)
        if(!decoded) return res.status(400).json({msg: "Invalid Authentication."})
        const {id} = jwt.decode(token)

        const user = await User.findOne({id})
        req.user = user
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
}


module.exports = auth