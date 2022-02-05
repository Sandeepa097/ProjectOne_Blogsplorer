const mongoose = require('mongoose')
const logRouter = require('express').Router()
const Log = require('../models/activitylog')
const {verifyToken} = require('../utils/token')

logRouter.get('/publications/:pageNum', async(request, response) => {
    const skipValue = request.params.pageNum * 10
    const userId = verifyToken(request)
    const objectId = mongoose.Types.ObjectId(userId)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const countLogs = await Log.aggregate([
        {
            $match: {author: objectId}
        },
        {
            $project: {
                count: {
                    $cond: {if: {$isArray: "$publications"}, then: {$size: "$publications"}, else: "NA"}
                }
            }
        }
    ])
    if(!countLogs[0].count){
        return response.status(200).send({count: 0, data: []})
    }
    const value = (countLogs[0].count - (skipValue - 10)) < 10 ? (countLogs[0].count - (skipValue - 10)) : 10
    await Log.find({author: userId}, {"publications": {$slice: [-skipValue, value]}}).exec((err, logs) => {
        if(err){
            return response.status(400).json({count: 0, data: []})
        }
        return response.status(200).send({count: countLogs[0].count, data: logs[0].publications})
    })
    
})

logRouter.get('/draft/:pageNum', async(request, response) => {
    const skipValue = request.params.pageNum * 10
    const userId = verifyToken(request)
    const objectId = mongoose.Types.ObjectId(userId)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const countLogs = await Log.aggregate([
        {
            $match: {author: objectId}
        },
        {
            $project: {
                count: {
                    $cond: {if: {$isArray: "$draft"}, then: {$size: "$draft"}, else: "NA"}
                }
            }
        }
    ])
    if(!countLogs[0].count){
        return response.status(200).send({count: 0, data: []})
    }
    const value = (countLogs[0].count - (skipValue - 10)) < 10 ? (countLogs[0].count - (skipValue - 10)) : 10
    await Log.find({author: userId}, {"draft": {$slice: [-skipValue, value]}}).exec((err, logs) => {
        if(err){
            return response.status(400).json({count: 0, data: []})
        }
        return response.status(200).send({count: countLogs[0].count, data: logs[0].draft})
    })
})

logRouter.get('/profile/:pageNum', async(request, response) => {
    const skipValue = request.params.pageNum * 10
    const userId = verifyToken(request)
    const objectId = mongoose.Types.ObjectId(userId)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const countLogs = await Log.aggregate([
        {
            $match: {author: objectId}
        },
        {
            $project: {
                count: {
                    $cond: {if: {$isArray: "$profile"}, then: {$size: "$profile"}, else: "NA"}
                }
            }
        }
    ])
    if(!countLogs[0].count){
        return response.status(200).send({count: 0, data: []})
    }
    const value = (countLogs[0].count - (skipValue - 10)) < 10 ? (countLogs[0].count - (skipValue - 10)) : 10
    await Log.find({author: userId}, {"profile": {$slice: [-skipValue, value]}}).exec((err, logs) => {
        if(err){
            return response.status(400).json({count: 0, data: []})
        }
        return response.status(200).send({count: countLogs[0].count, data: logs[0].profile})
    })
})

logRouter.delete('/delete/:field', async(request, response) => {
    const fieldName = request.params.field
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    if(fieldName === "publications") {
        await Log.updateOne({author: userId}, { $set: {"publications": []}})
        return response.status(204).end()
    }
    else if(fieldName === "draft") {
        await Log.updateOne({author: userId}, { $set: {"draft": []}})
        return response.status(204).end()
    }
    else {
        await Log.updateOne({author: userId}, { $set: {"profile": []}})
        return response.status(204).end()
    }
})

logRouter.delete('/publications/:id', async(request, response) => {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    await Log.updateOne({author: userId}, {$pull: {publications: {_id: request.params.id}}})
    return response.status(204).end()
})

logRouter.delete('/draft/:id', async(request, response) => {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    await Log.updateOne({author: userId}, {$pull: {draft: {_id: request.params.id}}})
    return response.status(204).end()
})

logRouter.delete('/profile/:id', async(request, response) => {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    await Log.updateOne({author: userId}, {$pull: {profile: {_id: request.params.id}}})
    return response.status(204).end()
})

module.exports = logRouter