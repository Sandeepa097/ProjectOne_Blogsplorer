const {body, validationResult} = require('express-validator')
const safeRegEx = require('safe-regex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const userRouter = require('express').Router()
const User = require('../models/user')
const Log = require('../models/activitylog')
const {verifyToken} = require('../utils/token')
const {uploadImage} = require('../utils/upload')
const {updateLog} = require('../utils/updateLog')

userRouter.post('/', [
    body('firstName').isString().not().isEmpty().withMessage("First Name is required"),
    body('email').isEmail().not().isEmpty().withMessage("Email is required"), 
    body('password').isString().isLength({min: 8}).withMessage("Password must be at least 8 characters")
], async(request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        return response.status(400).json({error: errors.array()[0].msg})
    }

    const emailTaken = await User.findOne({email: request.body.email})
    if(emailTaken) {
        return response.status(400).json({error: "Email already taken"})
    }

    const body = {...request.body, 
        firstName: request.body.firstName.charAt(0).toUpperCase() + request.body.firstName.slice(1).toLowerCase(),
        lastName: request.body.lastName.charAt(0).toUpperCase() + request.body.lastName.slice(1).toLowerCase()
    }
    const saltRounds = Number(config.SALT_ROUNDS)
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        authorAvatar: '',
        firstName: body.firstName,
        lastName: body.lastName ,
        fullName: body.firstName + ' ' + body.lastName,
        email: body.email,
        address: '',
        city: '',
        state: '',
        country: '',
        description: '',
        draft: [],
        published: {
            blog: [],
            blogNoImage: []
        },
        date: body.date,
        passwordHash,
    })

    const savedUser = await user.save()

    const userForToken = {
        id: savedUser._id
    }

    const token = jwt.sign(userForToken, config.SECRET)

    const newLogAcc = new Log({
        author: savedUser._id
    })
    await newLogAcc.save()
    updateLog(savedUser._id, "profile", {title: "Account was created..", date: Date()})

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
    updateLog(user.id, "profile", {title: "Successfully logged in..", date: Date()})

    return response.status(200).send({
        token,
        id: user.id
    })
})

userRouter.post('/search', async(request, response) => {
    const body = request.body
    if(!body.value){
        return response.status(200).send([])
    }

    if(!safeRegEx(body.value)){
        return response.status(400).json({error: 'invalid input'})
    }
    const regex = new RegExp(body.value, 'gi')
    await User.find({fullName: regex}, {
        _id: 1,
        authorAvatar: 1,
        fullName: 1,
        description: 1
    }).limit(body.limit).exec((err, details) => {
        if(err){
            return response.status(400).json({error: 'error occured'})
        }
        return response.status(200).send(details)
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
    const userDetails = await User.find({}, {authorAvatar:1, fullName:1, id:1})
    return response.status(200).send(userDetails)
})

userRouter.get('/:id', async(request, response) => {
    await User.findById(request.params.id, {
        authorAvatar: 1, 
        firstName: 1, 
        lastName: 1,
        fullName: 1,
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
        firstName: request.body.firstName.charAt(0).toUpperCase() + request.body.firstName.slice(1).toLowerCase(),
        lastName: request.body.lastName.charAt(0).toUpperCase() + request.body.lastName.slice(1).toLowerCase(),
        authorAvatar: await uploadImage(request.body.authorAvatar), 
    }
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    
    
    if(body.authorAvatar === "error"){
        return response.status(400).json({error: 'error on uploading profile picture...'})
    }

    updateLog(userId, "profile", {title: "Profile was updated..", date: Date()})

    const user = await User.findByIdAndUpdate(userId, {...body, fullName: body.firstName + " " + body.lastName})
    return response.json(user)
})

module.exports = userRouter