const jwt = require('jsonwebtoken')

const roleManager = (req, res, next) => {
    if (req.user._doc.role != 'manager')
        return res.status(401).json({ message: 'user has no previllage' })
    next();
}

const authorize = (req, res, next) => {
    if (!req.cookies.token)
        return res.status(400).json({
            message: 'user not authenticated',
        })

    // const token = req.headers.authorization.split(' ')[1]
    jwt.verify(req.cookies.token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (decoded) {
            // console.log('user authorize: ', decoded);
            req.user = decoded
            return next()
        } else if (err)
            return res.status(401).json({ message: 'user not authorize', error: err })
    })
}

const authenticate = (req, res, next) => {
    if (req.cookies.token)
        return res.status(400).json({ message: 'user authenticated', })

    const token = jwt.sign({ ...req.user }, process.env.SECRET_TOKEN, { expiresIn: '1h' })
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (decoded) {
            console.log('user authenticated')
            res.cookie('token', token, {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                SameSite: 'Strict',
            })
            res.status(200).json({
                message: 'user authenticate',
                user_id: req.user.name,
            })
            next()
        }
        else return res.status(403).json({ error: err.message })
    })

}

module.exports = { authenticate, authorize, roleManager }