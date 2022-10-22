const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')
const catchAsync = require('../../utils/catch-async')
const { postService, userService } = require('../services')
const CustomError = require('../../utils/custom-error')
const { Post } = require('../models/post_model')
const { User } = require('../models/user_model')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const createPost = catchAsync(async (req, res) => {
    try {
        const { content, images } = req.body
        if(images.length === 0) return res.status(400).json({msg: "Please add your photo."})
        const newPost = await postService.createPost(content, images, req.user._id)
        console.log("Add new post finished")
        console.log(newPost)
        return res.status(httpStatus.OK).send({newPost: {
            ...newPost._doc,
            user: req.user
        }})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})

const getPosts = catchAsync(async (req, res) => {
    try {
        const features =  new APIfeatures(Post.find({
            user: [...req.user.following, req.user._id]
        }), req.query).paginating()

        const posts = await features.query.sort('-createdAt')
        .populate("user likes", "avatar username fullName followers")
        .populate({
            path: "comments",
            populate: {
                path: "user likes",
                select: "-password"
            }
        })

        console.log("Get posts finished")
        return res.status(httpStatus.OK).send({result: posts.length, posts})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const updatePost = catchAsync(async (req, res) => {
    try {
        const { content, images } = req.body

        const post = await postService.updatePost(content, images, req.params.id)
        console.log("Update post finished")
        console.log(post)
        return res.status(httpStatus.OK).send({
            newPost: {
                ...post._doc,
                content, images
            }
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const likePost = catchAsync(async (req, res) => {
    try {
        const post = await Post.find({_id: req.params.id, likes: req.user._id})
        if(post.length > 0) return res.status(400).json({msg: "You liked this post."})

        const like = await Post.findOneAndUpdate({_id: req.params.id}, {
            $push: {likes: req.user._id}
        }, {new: true})

        if(!like) return res.status(400).json({msg: 'This post does not exist.'})

        console.log("Like post finished")
        return res.status(httpStatus.OK).send({
            msg: 'Liked Post!'
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const unlikePost = catchAsync(async (req, res) => {
    try {
        const like = await Post.findOneAndUpdate({_id: req.params.id}, {
            $pull: {likes: req.user._id}
        }, {new: true})

        if(!like) return res.status(400).json({msg: 'This post does not exist.'})
        
        console.log("Unlike post finished")
        return res.status(httpStatus.OK).send({
            msg: 'UnLiked Post!'
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const getUserPosts = catchAsync(async (req, res) => {
    try {
        const features = new APIfeatures(Post.find({user: req.params.id}), req.query)
        .paginating()
        const posts = await features.query.sort("-createdAt")

        console.log("Get user posts finished")
        console.log(posts)
        return res.status(httpStatus.OK).send({result: posts.length, posts})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const getPost = catchAsync(async (req, res) => {
    try {
        const {id} = req.body
        const post = await postService.getPostByID(id)

        if(!post) return res.status(400).json({msg: 'This post does not exist.'})

        console.log("Get post finished")
        console.log(post)
        return res.status(httpStatus.OK).send({post})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const getPostsDiscovery = catchAsync(async (req, res) => {
    try {
        const newArr = [...req.user.following, req.user._id]

        const num  = req.query.num || 9

        const posts = await Post.aggregate([
            { $match: { user : { $nin: newArr } } },
            { $sample: { size: Number(num) } },
        ])

        console.log("Get post discovery finished")
        console.log('Length post discovery: ' + posts.length)
        return res.status(httpStatus.OK).send({
            result: posts.length,
            posts})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const deletePost = catchAsync(async (req, res) => {
    console.log('here')
    try {
        const post = await postService.deletePost(req.params.id,  req.user._id)

        console.log("Delete post finished")
        console.log(post)
        return res.status(httpStatus.OK).send({
            post: {
                ...post,
                user: req.user
            }
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const savePost = catchAsync(async (req, res) => {
    try {
        const user = await User.find({_id: req.user._id, saved: req.params.id})
        if(user.length > 0) return res.status(400).json({msg: "You saved this post."})
        const save = await User.findOneAndUpdate({_id: req.user._id}, {
            $push: {saved: req.params.id}
        }, {new: true})
        if(!save) return res.status(400).json({msg: 'This user does not exist.'})

        console.log("Saved post finished")
        return res.status(httpStatus.OK).send({
            msg: 'Saved Post!'
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const unSavePost = catchAsync(async (req, res) => {
    try {
        const save = await User.findOneAndUpdate({_id: req.user._id}, {
            $pull: {saved: req.params.id}
        }, {new: true})

        if(!save) return res.status(400).json({msg: 'This user does not exist.'})

        console.log("Unsaved post finished")
        return res.status(httpStatus.OK).send({
            msg: 'Unsaved Post!'
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const getSavePosts = catchAsync(async (req, res) => {
    console.log('here')
    try {
        const features = new APIfeatures(Post.find({
            _id: {$in: req.user.saved}
        }), req.query).paginating()

        const savePosts = await features.query.sort("-createdAt")

        console.log("Get save posts finished")
        console.log(savePosts)
        return res.status(httpStatus.OK).send({
            savePosts,
            result: savePosts.length
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
})


module.exports = {
    createPost,
    getPosts,
    updatePost,
    likePost,
    unlikePost,
    getUserPosts,
    getPost,
    getPostsDiscovery,
    deletePost,
    savePost,
    unSavePost,
    getSavePosts,


}
