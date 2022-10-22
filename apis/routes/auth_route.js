const express = require('express')
const { authController } = require('../controllers')
const { authValidation } = require('../validations')

const validate = require('../../middlewares/validate')

const router = express.Router()

router.post('/login', validate(authValidation.loginSchema), authController.login)
router.post('/register', validate(authValidation.registerSchema), authController.register)
router.post('/sendverificationemail', authController.sendVerificationEmail)
router.post('/activate', validate(authValidation.activateEmailTokenSchema), authController.activateEmail)
router.post('/google', authController.authGoogle)
router.post('/forgot', validate(authValidation.forgotPasswordSchema), authController.forgotPassword)
router.post('/reset', validate(authValidation.resetPasswordTokenSchema), authController.resetPassword)
router.post('/checkResetTokenValid', authController.checkResetTokenValid)
router.post('/checkLogin', authController.checkLogin)

module.exports = router
