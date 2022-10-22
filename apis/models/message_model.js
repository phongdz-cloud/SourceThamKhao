const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'user' },
    recipient: { type: mongoose.Types.ObjectId, ref: 'user' },
    text: String,
    media: Array,
    call: Object
}, {
    timestamps: true
})


const Message = mongoose.model('message', MessageSchema)
module.exports = {
    MessageSchema,
    Message,
}
