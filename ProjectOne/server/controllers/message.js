const messageRouter = require('express').Router()
const User = require('../models/user')
const {verifyToken} = require('../utils/token')

messageRouter.get('/', async(request, response) => {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const messages = await User.findById(userId, {
        message: 1
    })
    return response.status(200).send(messages)
})

module.exports = messageRouter