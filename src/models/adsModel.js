const {Schema, model} = require('mongoose');

const AdsSchema = new Schema({
    shortText: {type: String, required: true},
    description: {type: String},
    images: {type: [String]},
    userID: {type: Schema.Types.ObjectId, required: true},
    createdAt: {type: Date, default: Date.now, required: true},
    updatedAt: {type: Date, default: Date.now, required: true},
    tags: {type: [String]},
    isDeleted: {type: Boolean, default: false, required: true},
})

module.exports = model('AdsModel', AdsSchema);