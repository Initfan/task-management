const { default: mongoose, Schema } = require("mongoose");

const projectsSchema = new mongoose.Schema({
    name: String,
    description: String,
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
})

const projects = mongoose.model('projects', projectsSchema)

module.exports = projects

