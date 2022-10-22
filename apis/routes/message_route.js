const express = require('express')
const { messageController } = require('../controllers')

const { passport } = require('../plugins/passport')

const router = express.Router()

router.post('/createMessage', passport.authenticate('jwt', { session: false }),  messageController.createMessage)
router.get('/conversations',  passport.authenticate('jwt', { session: false }),  messageController.getConversations)
router.get('/:id',  passport.authenticate('jwt', { session: false }),  messageController.getMessages)
router.delete('/:id', passport.authenticate('jwt', { session: false }),  messageController.deleteMessage)
router.delete('/conversations/:id', passport.authenticate('jwt', { session: false }),  messageController.deleteConversation)
module.exports = router