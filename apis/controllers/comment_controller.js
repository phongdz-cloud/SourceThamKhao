const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { commentService, postService } = require('../services')
const { Post } = require('../models/post_model')
const { Comment } = require('../models/comment_model')

const createComment = catchAsync(async (req, res) => {
    try {
        const {data} = req.body
        const { postId, content, tag, reply, postUserId } = data
        const post = await postService.getPostByIDForComment(postId)
        if(!post) return res.status(400).json({msg: "This post does not exist."})
        if(reply){
            const comment = await commentService.getCommentByID(reply)
            if(!comment) return res.status(400).json({msg: "This comment does not exist."})
        }

        const newComment = await commentService.createComment(req.user._id, content, tag, reply, postUserId, postId)
        console.log("Create comment finished")
        console.log(newComment)
        return res.status(httpStatus.OK).send({newComment})

    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
    
})

const updateComment = catchAsync(async (req, res) => {
    try {
        const { content } = req.body

        const comment = commentService.updateComment(req.params.id, req.user._id, content) 
        
        console.log("Update comment finished")
        console.log(comment)

        return res.status(httpStatus.OK).send({comment})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})

const likeComment = catchAsync(async (req, res) => {
    try {
        const comment = await Comment.find({_id: req.params.id, likes: req.user._id})
        if(comment.length > 0) return res.status(400).json({msg: "You liked this post."})

        await Comment.findOneAndUpdate({_id: req.params.id}, {
            $push: {likes: req.user._id}
        }, {new: true})

        console.log("Like comment finished")
        return res.status(httpStatus.OK).send({msg: 'Liked Comment!'})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const unlikeComment = catchAsync(async (req, res) => {
    try {
        await Comment.findOneAndUpdate({_id: req.params.id}, {
            $pull: {likes: req.user._id}
        }, {new: true})

        console.log("Unlike comment finished")
        return res.status(httpStatus.OK).send({msg: 'UnLiked Comment!'})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const deleteComment = catchAsync(async (req, res) => {
    try {
        const comment = await commentService.deleteComment(req.params.id, req.user)

        console.log("Delete comment finished")
        console.log(comment)
        return res.status(httpStatus.OK).send({comment})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

module.exports = {
    createComment,
    updateComment,
    likeComment,
    unlikeComment,
    deleteComment


}
