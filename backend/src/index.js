const express = require('express')
const app = express()
const mongoose = require('mongoose')
const projectRouter = require('../src/router/project-router')
const authRouter = require('./router/auth-router')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.get('/', (req, res) => {
    console.log(req.cookies)
    res.send('hello world')
})

app.use(authRouter)

app.use('/projects', projectRouter)

app.listen(3000, () =>
    mongoose.connect(process.env.MONGO_DB)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err))
)
