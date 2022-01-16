const logger = require('./utils/logger')

const activeAuthors = new Set()

module.exports = (io) => {
    io.on("connection", (socket) => {
        logger.info('A user connected...')
        console.log('usersList', activeAuthors)

        socket.on('join', (userId) => {
            logger.info('User Logged...')
            socket.userId = userId
            activeAuthors.add(userId)
            console.log('usersList', activeAuthors)
            io.emit('join', [...activeAuthors])
        })

        socket.on('message', (msg) => {
            console.log('message :' + msg)
        })

        socket.on("disconnect", () => {
            activeAuthors.delete(socket.userId)
            logger.info('User disconnected...')
            console.log('usersList', activeAuthors)
            io.emit('user disconnect', socket.userId)
        })
    })
}