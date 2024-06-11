const { default: mongoose, Schema } = require("mongoose");

const tasksSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    project_id: { type: Schema.Types.ObjectId, ref: 'projects' },
    user_id: { type: Schema.Types.ObjectId, ref: 'users' },
    title: String,
    description: String,
    status: String,
    priority: String,
    due_date: Date,
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
})

const tasks = mongoose.model('tasks', tasksSchema)
module.exports = tasks

