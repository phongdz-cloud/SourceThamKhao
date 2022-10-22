const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema({
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    text: String,
    media: Array,
    call: Object
}, {
    timestamps: true
})


const Conversation = mongoose.model('conversation', ConversationSchema)
module.exports = {
    ConversationSchema,
    Conversation,
}
