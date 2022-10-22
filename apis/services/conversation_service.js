const httpStatus = require('http-status')
const { Conversation } = require('../models/conversation_model')
const {Message} = require('../models/message_model')


const updateConversation = async (sender, recipient, text, media, call) => {
    const newConversation = await Conversation.findOneAndUpdate({
        $or: [
            {recipients: [sender, recipient]},
            {recipients: [recipient, sender]}
        ]
    }, {
        recipients: [sender, recipient],
        text, media, call
    }, { new: true, upsert: true })

    return newConversation
}

const deleteConversation = async (userID, paramID) => {
    const newConversation = await Conversation.findOneAndDelete({
        $or: [
            {recipients: [userID, paramID]},
            {recipients: [paramID, userID]}
        ]
    })
    await Message.deleteMany({conversation: newConversation._id})

    return newConversation
}

module.exports = {
    updateConversation,
    deleteConversation
}