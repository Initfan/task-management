const express = require('express')
const projects = require('../model/projects-model')
const projectUser = require('../model/projectUser-model')
const router = express.Router()
const z = require('zod')
const { authorize, roleManager } = require('../auth')

const credentials = (body, cred) => z.object({
    name: z.string(),
    description: z.string(),
    ...cred
}).safeParse(body)

router.route('/projects')
    .all(authorize)
    .get(roleManager, async (req, res) => {
        const user_id = req.user._doc._id;
        const data = await projectUser.find({ user: user_id })
            .populate('project')
            .exec()

        res.json({
            status: 200,
            message: 'projects data',
            data
        })
    })
    .post(async (req, res) => {
        const cred = credentials(req.body)

        if (!cred.success)
            return res.status(402).json({ message: 'Invalid Credentials', error: cred.error })

        const data = await projects.create(cred.data)

        await projectUser.create({
            project: data._id,
            user: req.user._doc._id,
        })

        res.status(201).json({
            message: 'Project created.',
            data
        })
    })
    .put(async (req, res) => {
        const cred = credentials(req.body, { id: z.string() })

        if (!cred.success)
            return res.status(402).json({ message: 'Invalid Credentials', error: cred.error })

        const data = await projects.findByIdAndUpdate(cred.data.id, cred.data)

        res.status(201).json({
            message: 'Project updated.',
            data
        })
    })
    .delete(async (req, res) => {
        try {
            const project = await projects.findByIdAndDelete(req.body.id)
            await projectUser.findOneAndDelete({ project: req.body.id })
            res.status(200).json({
                message: 'Project deleted.',
            })
        } catch (error) {
            res.status(404).json({ message: 'failed delete project', error })
        }

    })

module.exports = router