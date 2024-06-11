const express = require('express')
const projects = require('../model/projects-model')
const router = express.Router()
const z = require('zod')
const { authorize } = require('../auth')

router.route('/')
    .get(authorize, async (req, res) => {
        const data = await projects.find()

        res.json({
            status: 200,
            message: 'projects data',
            data
        })
    })
    .post(authorize, async (req, res, next) => {
        const cred = z.object({
            name: z.string(),
            description: z.string(),
        }).safeParse(req.body)

        if (!cred.success)
            return res.json({ status: 402, message: 'Invalid Credentials', error: cred.error })

        const createdData = await projects.create(cred.data)

        res.status(201).json({
            message: 'Project created.',
            data: createdData
        })
    })

module.exports = router