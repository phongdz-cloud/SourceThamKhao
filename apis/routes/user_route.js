const express = require('express')
const { userController } = require('../controllers')
const { userValidation } = require('../validations')

const { passport } = require('../plugins/passport')

const validate = require('../../middlewares/validate')

const auth = require("../middlewares/auth")

const router = express.Router()

router.post('/search', validate(userValidation.searchUserSchema), passport.authenticate('jwt', { session: false }),  userController.getUsersBySearch)
router.post('/getUser', validate(userValidation.getUserSchema), passport.authenticate('jwt', { session: false }),  userController.getUser)
router.post('/getProfile', passport.authenticate('jwt', { session: false }),  userController.getProfileByUserID)
router.post('/updateUser',  passport.authenticate('jwt', { session: false }),  userController.updateUser)
router.post('/updateEmail',  passport.authenticate('jwt', { session: false }),  userController.updateEmail)
router.patch('/:id/follow',  passport.authenticate('jwt', { session: false }),  userController.follow)
router.patch('/:id/unfollow',  passport.authenticate('jwt', { session: false }),  userController.unfollow)
router.get('/getSuggestionUsers',  passport.authenticate('jwt', { session: false }),  userController.getSuggestionUsers)
module.exports = router