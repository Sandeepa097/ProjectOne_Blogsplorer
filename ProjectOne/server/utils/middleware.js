const logger = require('./logger')

const requestLogger = (request, _response, next) => {
    const securePassword = () => {
        if(request.body.password){
            return {...request.body, password: ''}
        }
        return request.body
    }
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', securePassword())
    logger.info('---')
    next()
}

const unknownEndPoint = (_request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if(error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if(error.name === 'JsonWebTokenError') {
        return response.status(401).json({error: 'invalid token'})
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndPoint,
    errorHandler
}