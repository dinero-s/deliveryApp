const { Schema } = require('mongoose');

const MsgSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    sentAt: { type: Date, default: Date.now, required: true },
    text: { type: String, required: true },
    readAt: { type: Date }
});

module.exports = MsgSchema;