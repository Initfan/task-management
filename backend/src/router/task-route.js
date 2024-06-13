const express = require('express')
const { authorize, roleManager } = require('../auth')
const { z } = require('zod')
const tasks = require('../model/tasks-model')
const router = express.Router()

const credentials = (body, cred) => z.object({
    project_user: z.string(),
    assigned_to: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    priority: z.string(),
    due_date: z.string().date(),
    ...cred
}).safeParse(body)

router.get('/tasks/:user_id', async (req, res) => {
    let data;
    if (req.query.status) {
        data = await tasks.find({
            assigned_to: req.params.user_id,
            status: req.query.status
        }).exec()
    }
    else data = await tasks.find({ assigned_to: req.params.user_id }).exec()

    res.status(200).json({
        message: 'Developer tasks',
        status: req.query.status || 'all',
        data
    })
})

router.route('/tasks')
    .all(authorize)
    .post(async (req, res) => {
        const cred = credentials(req.body)

        if (!cred.success)
            return res.status(400).json({ message: 'Invalid Credentials', error: cred.error })

        const data = await tasks.create(cred.data)

        res.status(201).json({
            message: 'Tasks created.',
            data
        })
    })
    .put(roleManager, async (req, res) => {
        const cred = credentials(req.body, { id: z.string() })

        if (!cred.success)
            return res.status(400).json({ message: 'Invalid Credentials', error: cred.error })

        const data = await tasks.findByIdAndUpdate(cred.data.id, cred.data).exec()

        res.status(201).json({
            message: 'Tasks updated.',
            data
        })
    })
    .delete(roleManager, async (req, res) => {
        if (!req.body.id)
            return res.status(400).json({ message: 'required task id' })

        const data = await tasks.findByIdAndDelete(req.body.id).exec()

        res.json({
            status: 200,
            message: 'Task deleted.',
            data
        })
    })

module.exports = router