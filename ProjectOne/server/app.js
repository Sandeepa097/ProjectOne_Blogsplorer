const config = require('./utils/config')
const express = require('express')
const bp = require('body-parser')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const userRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const draftRouter = require('./controllers/drafts')
const countRouter = require('./controllers/docCount')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URL)

mongoose.connect(config.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(bp.json({limit: '20mb'}))
app.use(bp.urlencoded({limit: '20mb' ,extended: true}))
app.use(express.json())
app.use(morgan('tiny'))
app.use(middleware.requestLogger)
app.use(express.static(__dirname + '/public'))

app.use('/api/blogs', blogsRouter)
app.use('/api/draft', draftRouter)
app.use('/api/user', userRouter)
app.use('/count', countRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app