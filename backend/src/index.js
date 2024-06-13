const express = require('express')
const app = express()
const mongoose = require('mongoose')
const projectRouter = require('./router/project-route')
const authRouter = require('./router/auth-route')
const taskRouter = require('./router/task-route')
const commentRouter = require('./router/comment-route')
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(cors({
    origin: ['http://localhost:3001'],
    methods: "GET,HEAD,PUT,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/', (req, res) => {
    console.log(req.cookies)
    res.send('hello world')
})

app.use(authRouter)
app.use(taskRouter)
app.use(projectRouter)
app.use(commentRouter)


app.listen(3000, () =>
    mongoose.connect(process.env.MONGO_DB)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err))
)
