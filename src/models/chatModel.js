const {Schema, model} = require('mongoose');
const messageSchema = require('./msgModel');

const ChatSchema = new Schema({
    users: {type: [Schema.Types.ObjectId], required: true},
    createdAt: {type: Date, default: Date.now, required: true},
    messages: {type: [messageSchema]},
})

module.exports = model('ChatModel', ChatSchema);