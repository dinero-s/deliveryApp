const {Schema, model} = require('mongoose')
const {compareSync} = require("bcrypt");

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    hashPassword: {type: String, required: true},
    name: {type: String, required: true},
    contactPhone: {type: String},
})

module.exports = model('UserModel', UserSchema);