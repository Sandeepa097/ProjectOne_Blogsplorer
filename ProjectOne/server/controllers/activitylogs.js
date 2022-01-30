const logRouter = require('express').Router()
const Log = require('../models/activitylog')
const {verifyToken} = require('../utils/token')

logRouter.get('/publications/:pageNum', async(request, response) => {
    const skipValue = (request.params.pageNum - 1) * 10
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const logs = await Log.find({author: userId}, {"publications": {$slice: [skipValue, 10]}})
    return response.status(200).send(logs)
})

logRouter.get('/draft/:pageNum', async(request, response) => {
    const skipValue = (request.params.pageNum - 1) * 10
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const logs = await Log.find({author: userId}, {"draft": {$slice: [skipValue, 10]}})
    return response.status(200).send(logs)
})

logRouter.get('/profile/:pageNum', async(request, response) => {
    const skipValue = (request.params.pageNum - 1) * 10
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const logs = await Log.find({author: userId}, {"profile": {$slice: [skipValue, 10]}})
    return response.status(200).send(logs)
})

module.exports = logRouter