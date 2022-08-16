const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) return res.status(401).send('Authorization token required')

    const token = authorization.replace('Bearer ', '')

    try {
        const { _id } = jwt.verify(token, process.env.SECRET)

        req.user = await User.findById({_id}).select('_id')
        next()
    }
    catch (err) {
        res.status(401).send({error: 'Invalid authorization token'})
    }

}

module.exports = requireAuth