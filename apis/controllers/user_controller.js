const httpStatus = require('http-status')

const jwt = require('jsonwebtoken')

const catchAsync = require('../../utils/catch-async')
const { userService, tokenService, authService } = require('../services')
const CustomError = require('../../utils/custom-error')
const { User } = require('../models/user_model')

const getUsersBySearch = catchAsync(async (req, res) => {
    const { fullName } = req.body
    const users = await userService.getUsersBySearch(fullName)
    console.log("Search users finished")
    console.log(users)
    res.status(httpStatus.OK).send({users})
})

const getProfileByUserID = catchAsync(async (req, res) => {
    const { id } = req.body
    const user = await userService.getProfileByUserID(id)
    console.log("Get profile finished")
    console.log(user)
    res.status(httpStatus.OK).send({user})
})

const getUser = catchAsync(async (req, res) => {
    const { userID } = req.body
    const user = await userService.getUserByID(userID)
    console.log("Get user finished")
    console.log(user)
    res.status(httpStatus.OK).send({user})
})

const updateUser = catchAsync(async (req, res) => {
    const { userData, address } = req.body
    const user = await userService.updateUser(userData, address)
    console.log("Update user finished")
    console.log(user)
    res.status(httpStatus.OK).send({user})
})

const updateEmail = catchAsync(async (req, res) => {
    const { email, userID } = req.body
    const user = await userService.updateEmail(email, userID)
    console.log("Update email finished")
    console.log(user)
    res.status(httpStatus.OK).send({user})
})

const follow = catchAsync(async (req, res) => {
    try {
        const user = await User.find({_id: req.params.id, followers: req.user._id})
        if(user.length > 0) {
            console.log("You followed this user.")
            return res.status(500).json({msg: "You followed this user."})
        } 
        const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
            $push: {followers: req.user._id}
        }, {new: true}).populate("followers following", "-password")
    
        await User.findOneAndUpdate({_id: req.user._id}, {
            $push: {following: req.params.id}
        }, {new: true})

        console.log("You followed this user.")
        return res.status(httpStatus.OK).send({newUser})
    
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const unfollow = catchAsync(async (req, res) => {
    try {

        const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
            $pull: {followers: req.user._id}
        }, {new: true}).populate("followers following", "-password")

        await User.findOneAndUpdate({_id: req.user._id}, {
            $pull: {following: req.params.id}
        }, {new: true})

        
        console.log("You unfollowed this user.")
        return res.status(httpStatus.OK).send({newUser})


    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const getSuggestionUsers = catchAsync(async (req, res) => {
    try {
        const newArr = [...req.user.following, req.user._id]

        const num  = req.query.num || 10

        const users = await User.aggregate([
            { $match: { _id: { $nin: newArr } } },
            { $sample: { size: Number(num) } },
            { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
            { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
        ]).project("-password")

        console.log("Get suggestion users finished")

        return res.status(httpStatus.OK).send({ users,
            result: users.length})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})


module.exports = {
    getUsersBySearch,
    getProfileByUserID,
    getUser,
    updateUser,
    updateEmail, 
    follow,
    unfollow,
    getSuggestionUsers
}
