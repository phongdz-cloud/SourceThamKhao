const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { messageService, conversationService } = require('../services')
const { Conversation } = require('../models/conversation_model')
const { Message } = require('../models/message_model')

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


const createMessage = catchAsync(async (req, res) => {
    try {
        const { sender, recipient, text, media, call } = req.body.msg

        if(!recipient || (!text.trim() && media.length === 0 && !call)) return;

        const newConversation = await conversationService.updateConversation(sender, recipient, text, media, call)
        
        const newMessage = await messageService.createMessage(newConversation._id, sender, call, recipient, text, media)
       
        console.log("Add message finished")
        console.log(newMessage)
        return res.status(httpStatus.OK).send({
            newMessage: newMessage})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})

const getConversations = catchAsync(async (req, res) => {
    try {
        const features = new APIfeatures(Conversation.find({
            recipients: req.user._id
        }), req.query).paginating()

        const conversations = await features.query.sort('-updatedAt')
        .populate('recipients', 'avatar username fullName')

        console.log("Get conversations finished")
        return res.status(httpStatus.OK).send({conversations,
            result: conversations.length})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})

const getMessages = catchAsync(async (req, res) => {
    try {
        const features = new APIfeatures(Message.find({
            $or: [
                {sender: req.user._id, recipient: req.params.id},
                {sender: req.params.id, recipient: req.user._id}
            ]
        }), req.query).paginating()

        const messages = await features.query.sort('-createdAt')

        console.log("Get messages finished")
        return res.status(httpStatus.OK).send({messages,
            result: messages.length})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const deleteMessage = catchAsync(async (req, res) => {
    try {
        const message = await messageService.deleteMessage(req.params.id, req.user._id)
        console.log("Delete message finished")
        return res.status(httpStatus.OK).send({msg: 'Delete Success!'})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const deleteConversation = catchAsync(async (req, res) => {
    try {
        const conversation = await conversationService.deleteConversation(req.user._id, req.params.id)
        console.log("Delete conversation finished")
        return res.status(httpStatus.OK).send({msg: 'Delete Success!'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
})

module.exports = {
    createMessage,
    getConversations,
    getMessages,
    deleteMessage,
    deleteConversation
}
