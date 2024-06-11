const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: { type: String, default: 'developer' },
    created_at: { type: Date, default: Date.now() }
})

const users = mongoose.model('users', usersSchema)

module.exports = users