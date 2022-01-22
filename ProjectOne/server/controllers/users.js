const {body, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const userRouter = require('express').Router()
const User = require('../models/user')
const {verifyToken} = require('../utils/token')
const {uploadImage} = require('../utils/upload')

userRouter.post('/', [
    body('email').isEmail().not().isEmpty(), 
    body('password').isLength({min: 8})
], async(request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()})
    }

    const emailTaken = await User.findOne({email: request.body.email})
    if(emailTaken) {
        return response.status(409).json({error: "Email already taken"})
    }

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
        return response.status(400).json({
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

userRouter.get('/:id', async(request, response) => {
    await User.findById(request.params.id, {
        authorAvatar: 1, 
        firstName: 1, 
        lastName: 1,
        address: 1,
        city: 1,
        state: 1,
        country: 1,
        description: 1,
        date: 1
    }).populate("published.blog").populate("published.blogNoImage").exec((err, userDetails) => {
        if(err){
            return response.status(400).json({error: "invalid user"})
        }
        return response.status(200).send(userDetails)
    })
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