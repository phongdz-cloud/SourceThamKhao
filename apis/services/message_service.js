const httpStatus = require('http-status')
const { Message } = require('../models/message_model')
const { postService } = require('../services')


const createMessage = async (conversationID, sender, call, recipient, text, media) => {
    const newMessage = new Message({
        conversation: conversationID,
        sender, call,
        recipient, text, media
    })

    await newMessage.save()

    return newMessage
}

const deleteMessage = async (messageID, sender) => {
    const message = await Message.findOneAndDelete({_id: messageID, sender: sender})
    return message
}

module.exports = {
    createMessage,
    deleteMessage
}