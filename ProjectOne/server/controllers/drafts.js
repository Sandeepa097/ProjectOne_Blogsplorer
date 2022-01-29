const mongoose = require('mongoose')
const axios = require('axios')
const config = require('../utils/config')
const draftRouter = require('express').Router()
const User = require('../models/user')
const {verifyToken} = require('../utils/token')
const {uploadImage} = require('../utils/upload')

const categoryThemes = ["primary", "secondary", "success", "info", "warning", "danger", "royal-blue", "dark"]

draftRouter.put('/', async(request, response) => {
    const themeIndex = Math.floor(Math.random() * categoryThemes.length)
    const theme = categoryThemes[themeIndex]
    const body = {...request.body, 
        backgroundImage: request.body.alreadyAdded ? request.body.alreadyAdded : await uploadImage(request.body.backgroundImage), 
        categoryTheme: theme,
        _id: mongoose.Types.ObjectId()
    }
    if(body.backgroundImage === "error"){
        return response.status(400).json({error: 'error on image uploading'})
    }
    
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const update = await User.findByIdAndUpdate(userId, {
        $push: {
            draft: body
        }
    })
    return response.json(body._id)
})

draftRouter.get('/:limit', async(request, response) => {
    const limit = Number(request.params.limit)
    const userId = verifyToken(request)
    const objectId = mongoose.Types.ObjectId(userId)

    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const countDrafts = await User.aggregate([
        {
            $match: {_id: objectId}
        },
        {
            $project: {
                count: {
                    $cond: {if: {$isArray: "$draft"}, then: {$size: "$draft"}, else: "NA"}
                }
            }
        }
    ])
    const data = limit === 3 ? await User.findById(userId, {draft: {$slice: 3}}) : await User.findById(userId, 'draft')
    return response.status(200).send({data: data.draft, count: countDrafts[0].count})
})

draftRouter.delete('/:id', async(request, response) => {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    await User.updateOne({_id: userId}, {$pull: {draft: {_id: request.params.id}}})
    return response.status(204).end()
})

draftRouter.get('/publish/:id', async(request, response) => {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const post = await User.findById(userId, {
        draft: {
            $elemMatch: {_id: request.params.id}
        }
    })

    const conf = {
        headers: {
            Authorization: request.get('authorization'),
            UserId: userId
        }
    }
    try{
        await axios.post(`${config.SERVER_URL + config.PORT}/api/blogs`, post.draft[0], conf)
        await User.updateOne({_id: userId}, {$pull: {draft: {_id: request.params.id}}})
        return response.status(200).end()
    } 
    catch(error) {
        return response.status(400).json({error: error.response.data.error})
    }
})

module.exports = draftRouter