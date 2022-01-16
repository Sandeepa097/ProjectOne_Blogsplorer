const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const userRouter = require('express').Router()
const User = require('../models/user')
const {verifyToken} = require('../utils/token')
const {uploadImage} = require('../utils/upload')

userRouter.post('/', async(request, response) => {
    const body = request.body
    const saltRounds = Number(config.SALT_ROUNDS)
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        authorAvatar: '',
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        date: body.date,
        passwordHash,
    })

    const savedUser = await user.save()

    const userForToken = {
        id: savedUser._id
    }

    const token = jwt.sign(userForToken, config.SECRET)

    return response.status(200).send({
        token,
        id: savedUser._id
    })
})

userRouter.post('/login', async(request, response) => {
    const body = request.body

    const user = await User.findOne({email: body.email})
    const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

    if(!(user && passwordCorrect)){
        return response.status(401).json({
            error: 'invalid email or password'
        })
    }

    const userForToken = {
        id: user.id
    }

    const token = jwt.sign(userForToken, config.SECRET)

    return response.status(200).send({
        token,
        id: user.id
    })
})

userRouter.get('/', async(request, response) => {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const user = await User.findById(userId)
    return response.json(user)
})

userRouter.get('/all', async(_request, response) => {
    const userDetails = await User.find({}, {authorAvatar:1, firstName:1, lastName:1, id:1})
    return response.status(200).send(userDetails)
})

userRouter.put('/', async(request, response) => {
    const body = {...request.body, 
        authorAvatar: await uploadImage(request.body.authorAvatar), 
    }
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const user = await User.findByIdAndUpdate(userId, body)
    return response.json(user)
})

module.exports = userRouter