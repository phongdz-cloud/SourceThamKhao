const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { notifyService } = require('../services')
const { Conversation } = require('../models/conversation_model')

const createNotify = catchAsync(async (req, res) => {
    try {
        const {msg} = req.body
        console.log(msg)
        const { id, recipients, url, text, content, image } = msg

        if(recipients.includes(req.user._id.toString())) return;

        const notify = await notifyService.createNotify(id, recipients, url, text, content, image, req.user._id)

        console.log("Create notify finished")
        return res.status(httpStatus.OK).send({notify})

    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
    
})

const removeNotify = catchAsync(async (req, res) => {
    try {
        const notify = await notifyService.removeNotify(req.params.id, req.query.url)

        console.log("Removed notify finished")
        return res.status(httpStatus.OK).send({notify})
        
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})

const getNotifies = catchAsync(async (req, res) => {
    try {
        const notifies = await notifyService.getNotifies(req.user._id)

        console.log("Get notifies finished")
        return res.status(httpStatus.OK).send({notifies})
        
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const deleteAllNotifies = catchAsync(async (req, res) => {
    try {
        const notifies = await notifyService.deleteAllNotifies(req.user._id)
        console.log("Delete all notifies finished")
        return res.status(httpStatus.OK).send({notifies})
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
})

const isReadNotify = catchAsync(async (req, res) => {
    try {
        const notifies = await notifyService.updateReadNotify(req.params.id)

        console.log("Update read notify finished")
        return res.status(httpStatus.OK).send({notifies})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

module.exports = {
    createNotify,
    removeNotify,
    getNotifies,
    deleteAllNotifies,
    isReadNotify
}
