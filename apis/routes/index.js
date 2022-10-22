const express = require('express')
const router = express.Router()

//Client
const authRoute = require('./auth_route')
const userRoute = require('./user_route')
const addressRoute = require('./address_route')
const postRoute = require('./post_route')
const commentRoute = require('./comment_route')
const messageRoute = require('./message_route')
const notifyRoute = require('./notify_route')


//Routes
router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/address', addressRoute)
router.use('/post', postRoute)
router.use('/comment', commentRoute)
router.use('/message', messageRoute)
router.use('/notify', notifyRoute)

module.exports = router
