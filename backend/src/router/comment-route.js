const express = require('express')
const router = express.Router()
const { authorize } = require('../auth')
const commentModel = require('../model/comments-model')
const { z } = require('zod')

router.get('/comments/:task_id', authorize, async (req, res) => {
    const data = await commentModel.find({ task: req.params.task_id })
        .exec()
        .catch(err => res.status(400).json({
            message: 'invalid task id',
            task_id: err.value
        }))

    res.json({
        status: 200,
        message: 'comments found.',
        data
    })
})

const credentials = (body, cred) => z.object({
    task: z.string(),
    user: z.string(),
    comment: z.string(),
    ...cred,
}).safeParse(body)

router.route('/comments')
    .all(authorize)
    .post(async (req, res) => {
        const cred = credentials(req.body)

        if (!cred.success)
            return res.status(400).json({ message: 'Invalid Credentials', error: cred.error })

        const data = await commentModel.create(cred.data)

        res.status(201).json({
            status: 201,
            message: 'Comment created.',
            data
        })
    })
    .put(async (req, res) => {
        const cred = credentials(req.body, { id: z.string() });

        if (!cred.success)
            return res.status(400).json({ message: 'Invalid Credentials', error: cred.error })

        const updated = await commentModel.findByIdAndUpdate(cred.data.id, cred.data)
            .catch(err => res.json({ message: 'error updating', ...err }));

        res.status(201).json({
            status: 201,
            message: 'comment was updated.',
            data: updated,
        })
    })
    .delete(async (req, res) => {
        const deleted = await commentModel.findByIdAndDelete(req.body.id)
            .catch(err => res.json({ ...err }))

        res.json({
            status: 200,
            message: 'Comment was deleted.',
            data: deleted
        })
    })

module.exports = router