const express = require('express')
const { postController } = require('../controllers')

const { passport } = require('../plugins/passport')

const router = express.Router()

router.post('/createPost', passport.authenticate('jwt', { session: false }),  postController.createPost)
router.get('/getPosts', passport.authenticate('jwt', { session: false }),  postController.getPosts)
router.patch('/:id',  passport.authenticate('jwt', { session: false }),  postController.updatePost)
router.patch('/:id/like',  passport.authenticate('jwt', { session: false }),  postController.likePost)
router.patch('/:id/unlike',  passport.authenticate('jwt', { session: false }),  postController.unlikePost)
router.get('/user_posts/:id',  passport.authenticate('jwt', { session: false }),  postController.getUserPosts)
router.post('/getPost', passport.authenticate('jwt', { session: false }),  postController.getPost)
router.get('/post_discover', passport.authenticate('jwt', { session: false }),  postController.getPostsDiscovery)
router.delete('/deletePost/:id', passport.authenticate('jwt', { session: false }),  postController.deletePost)
router.patch('/savePost/:id',  passport.authenticate('jwt', { session: false }),  postController.savePost)
router.patch('/unSavePost/:id',  passport.authenticate('jwt', { session: false }),  postController.unSavePost)
router.get('/getSavePosts', passport.authenticate('jwt', { session: false }), postController.getSavePosts)
module.exports = router