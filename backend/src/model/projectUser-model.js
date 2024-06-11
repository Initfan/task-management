const { default: mongoose, Schema } = require('mongoose')

const projectUserSchema = mongoose.Schema({
    project: { type: Schema.Types.ObjectId, ref: 'projects' },
    user: { type: Schema.Types.ObjectId, ref: 'users' }
})

const projectUser = mongoose.model('project-users', projectUserSchema)

module.exports = projectUser