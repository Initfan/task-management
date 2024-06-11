const { Schema, default: mongoose } = require('mongoose')

const commentSchema = mongoose.Schema({
    task: { type: Schema.Types.ObjectId, ref: 'tasks' },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    comment: String
})

const commentModel = mongoose.model('comments', commentSchema)

module.exports = commentModel