const logger = require('./utils/logger')

const activeAuthors = new Set()

module.exports = (io) => {
    io.on("connection", (socket) => {
        logger.info('A user connected...')

        socket.on('join', (userId) => {
            logger.info('User Logged...')
            socket.userId = userId
            activeAuthors.add(userId)
            io.emit('join', [...activeAuthors])
        })

        socket.on('notify', (notifyObj) => {
            logger.info('Notification emited...')
            console.log("notification", notifyObj)
            socket.broadcast.emit('notify', notifyObj)
        })

        socket.on('message', (msg) => {
            console.log('message :' + msg)
        })

        socket.on("disconnect", () => {
            activeAuthors.delete(socket.userId)
            logger.info('User disconnected...')
            io.emit('user disconnect', socket.userId)
        })
    })
}