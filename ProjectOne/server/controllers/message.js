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

messageRouter.put('/', async(request, response) => {
    if(!request.body.msg[0]){
        return response.status(200)
    }
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const senderId = request.body.id
    const seen = request.body.msg
    await User.findByIdAndUpdate(userId, {message: {$pull: {new: {from: senderId}}}})
    await User.findByIdAndUpdate(userId, {$push: {"message.old": seen}})
    return response.status(200)
})

messageRouter.post('/', async(request, response) => {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    await User.findByIdAndUpdate(userId, {$push: {"message.old": request.body}})
    return response.status(200)
})

module.exports = messageRouter