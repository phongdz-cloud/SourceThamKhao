const httpStatus = require('http-status')
const CustomError = require('../../utils/custom-error')
const { Post } = require('../models/post_model')
const {Comment} = require('../models/comment_model')

const createPost = async (content, images, id) => {
    const newPost = new Post({
        content, images, user: id
    })
    return newPost.save()
}

const updatePost = async (content, images, id) => {
    const post = await Post.findOneAndUpdate({_id: id}, {
        content, images
    }).populate("user likes", "avatar email fullName")
    .populate({
        path: "comments",
        populate: {
            path: "user likes",
            select: "-password"
        }
    })
    return post
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

const getPostByIDForComment = async (id) => {
    const post = await Post.findById(id)
    return post
}

const deletePost = async (postID, userID) => {
    const post = await Post.findOneAndDelete({_id: postID, user: userID})
    await Comment.deleteMany({_id: {$in: post.comments }})
    return post
}

const updateCommentsInPost = async (postID, newComment) => {
    const post = await Post.findOneAndUpdate({_id: postID}, {
        $push: {comments: newComment._id}
    }, {new: true})
    return post
}

const updatePostAfterDeleteComment = async (postID, commentID) => {
    const post = await Post.findOneAndUpdate({_id: postID}, {
        $pull: {comments: commentID}
    })
    return post
}

module.exports = {
    createPost,
    updatePost,
    getPostByID,
    deletePost,
    getPostByIDForComment,
    updateCommentsInPost,
    updatePostAfterDeleteComment
}