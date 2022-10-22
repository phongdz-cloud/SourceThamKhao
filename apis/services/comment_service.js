const httpStatus = require('http-status')
const { Post } = require('../models/post_model')
const {Comment} = require('../models/comment_model')
const { postService } = require('../services')


const getCommentByID = async (id) => {
    const comment = await Comment.findById(id)
    return comment
}

const createComment = async (userID, content, tag, reply, postUserId, postId) => {
    const newComment = new Comment({
        user: userID, content, tag, reply, postUserId, postId
    })
    console.log(newComment)
    const post = await postService.updateCommentsInPost(postId, newComment)
    await newComment.save()
    return newComment
}

const updateComment = async (commentID, userID, content) => {
    const comment = await Comment.findOneAndUpdate({
        _id: commentID, user: userID
    }, {content})

    return comment
}

const getPostByID = async (id) => {
    const post= await Post.findById(id).populate("user likes", "avatar email fullName followers")
    .populate({
        path: "comments",
        populate: {
            path: "user likes",
            select: "-password"
        }
    })
    return post
}

const deleteComment = async (commentID, user) => {
    const comment = await Comment.findOneAndDelete({
        _id: commentID,
        $or: [
            {user: user._id},
            {postUserId: user._id}
        ]
    })

    const post = await postService.updatePostAfterDeleteComment(comment.postId, req.params.id)
    return comment
}

module.exports = {
    getCommentByID,
    createComment,
    updateComment,
    getPostByID,
    deleteComment
}