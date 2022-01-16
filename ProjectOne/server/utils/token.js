const jwt = require('jsonwebtoken')
const config = require('./config')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

const getUserIdFrom = (request) => {
    const userId = request.get('userId')
    if(userId) {
        return userId
    }
    return null
}


const verifyToken = (request) => {
    const token = getTokenFrom(request)
    const decodeToken = jwt.verify(token, config.SECRET)
    if(!token || !decodeToken.id) {
        return null
    }
    const userId = getUserIdFrom(request)
    return userId
}

module.exports = {verifyToken}