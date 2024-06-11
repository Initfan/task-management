const express = require('express')
const { z } = require('zod')
const router = express.Router()
const userModel = require('../model/users-model')
const bcrypt = require('bcrypt')
const { authenticate } = require('../auth')
const jwt = require('jsonwebtoken')
const users = require('../model/users-model')


router.post('/login', async (req, res, next) => {
    const cred = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    }).safeParse(req.body)

    if (!cred.success)
        return res.json({ message: 'invalid credentials', ...cred.error });

    const user = await userModel.findOne({ email: cred.data.email }).exec()

    const passMatch = await bcrypt.compare(cred.data.password, user.password);

    if (!passMatch)
        return res.json({ message: 'invalid credentials' })

    req.user = user;

    next()
}, authenticate)

router.post('/register', authenticate, async (req, res) => {
    const cred = z.object({
        username: z.string(),
        email: z.string().email('user email is required'),
        password: z.string().min(6, 'password at least 6 length')
    }).safeParse(req.body)

    if (!cred.success)
        return res.status(403).json({ message: 'invalid credentials', error: cred.error })

    const takenEmail = await users.findOne({ email: cred.data.email }).exec()
    if (takenEmail)
        return res.status(400).json({ message: 'email has been taken' })

    const passHashed = await bcrypt.hash(cred.data.password, 10)

    cred.data.password = passHashed

    const user = userModel.create(cred.data);

    res.status(201).json({
        message: 'user register success',
        user
    })
})

module.exports = router;