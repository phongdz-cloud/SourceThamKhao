const express = require('express')
const { commentController } = require('../controllers')

const { passport } = require('../plugins/passport')

const router = express.Router()

router.post('/createComment', passport.authenticate('jwt', { session: false }),  commentController.createComment)
router.patch('/:id',  passport.authenticate('jwt', { session: false }),  commentController.updateComment)
router.patch('/:id/like',  passport.authenticate('jwt', { session: false }),  commentController.likeComment)
router.patch('/:id/unlike',  passport.authenticate('jwt', { session: false }),  commentController.unlikeComment)
router.delete('/:id', passport.authenticate('jwt', { session: false }),  commentController.deleteComment)
module.exports = router