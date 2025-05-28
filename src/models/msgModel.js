const {Schema, model} = require('mongoose')

const MsgSchema = new Schema({
    author: {type: Schema.Types.ObjectId, required: true},
    sentAt: {type: Date, default: Date.now, required: true},
    text: {type: String, required: true},
    readAt: {type: Date, default: Date.now},
})

module.exports = model('MsgModel', MsgSchema)