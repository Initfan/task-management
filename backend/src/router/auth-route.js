const express = require('express')
const { z } = require('zod')
const router = express.Router()
const userModel = require('../model/users-model')
const bcrypt = require('bcrypt')
const { authenticate } = require('../auth')
const users = require('../model/users-model')
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res, next) => {
    console.log(req.cookies.token)
    if (req.cookies.token)
        return res.status(400).json({ status: 400, message: 'user authenticated', })

    const cred = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    }).safeParse(req.body)

    if (!cred.success)
        return res.json({ message: 'invalid credentials', ...cred.error });

    const user = await userModel.findOne({ email: cred.data.email }).exec()

    if (!user)
        return res.status(400).json({
            message: 'User not found.',
        })

    const passMatch = await bcrypt.compare(cred.data.password, user.password);

    if (!passMatch)
        return res.status(400).json({ message: 'invalid credentials' })

    req.user = user;

    next()
}, authenticate)

router.post('/register', async (req, res) => {
    if (req.cookies.token)
        return res.status(400).json({ status: 400, message: 'user authenticated', })

    const cred = z.object({
        username: z.string(),
        email: z.string().email('user email is required'),
        password: z.string().min(6, 'password at least 6 length'),
        role: z.string().nullable()
    }).safeParse(req.body)

    if (!cred.success)
        return res.status(403).json({ message: 'invalid credentials', error: cred.error })

    const takenEmail = await users.findOne({ email: cred.data.email }).exec()
    if (takenEmail)
        return res.status(400).json({ message: 'email has been taken' })

    const passHashed = await bcrypt.hash(cred.data.password, 10)

    cred.data.password = passHashed

    const user = await userModel.create(cred.data);

    res.status(201).json({
        message: 'user register success',
        user
    })
})

router.post('/logout', (req, res) => {
    console.log(req.cookies.token)
    const token = req.cookies.token
    if (!token)
        return res.status(400).json({ status: 400, message: 'user not authenticated' })

    jwt.decode(token)
    res.clearCookie('token')
    return res.json({
        message: 'user logout success'
    })
})

module.exports = router;