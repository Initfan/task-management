const jwt = require('jsonwebtoken')

const authorize = (req, res, next) => {
    if (!req.headers.authorization)
        return res.status(400).json({
            message: 'invalid token',
        })

    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (decoded) {
            req.user = decoded
            next()
        }
        else
            res.status(401).json({ message: 'user not authorize', error: err })
    })
}

const authenticate = (req, res, next) => {
    if (req.cookies.token)
        return res.status(400).json({
            message: 'user authenticated',
            username: req.cookies.user.name
        })
    const token = jwt.sign({ ...req.user }, process.env.SECRET_TOKEN, { expiresIn: '1h' })
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (decoded) {
            console.log('user authenticate')
            res.cookie('token', token)
            res.status(200).json({
                message: 'user authenticate',
                user: req.user.email,
                token
            })
        }
        if (err)
            return res.status(403).json(err.message)
        next();
    })

}

module.exports = { authenticate, authorize }