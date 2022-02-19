const logger = require('./utils/logger')
const {messageNew, messageOld} = require('./utils/message')

const activeAuthors = new Set()
const sessionsMap = {}

module.exports = (io) => {
    io.attach()
    io.on("connection", (socket) => {
        logger.info('A user connected...')

        socket.on('join', (userId) => {
            logger.info('User Logged...')
            socket.userId = userId
            activeAuthors.add(userId)
            sessionsMap[userId] = socket.id
            io.emit('join', [...activeAuthors])
        })

        socket.on('notify', (notifyObj) => {
            logger.info('Notification emitted...')
            socket.broadcast.emit('notify', notifyObj)
        })

        socket.on('message', (msg) => {
            logger.info('Message emitted...')
            const online = activeAuthors.has(msg.to)
            if(!online) {
                console.log('reciever offline')
                messageNew(msg)
            }
            else{
                console.log('reciever online')
                const recieverId = sessionsMap[msg.to]
                messageOld(msg)
                socket.broadcast.to(recieverId).emit('message', msg)
            }
        })

        socket.on('typing', (type) => {
            const recieverId = sessionsMap[type.to]
            socket.broadcast.to(recieverId).emit('typing', type)
        })

        socket.on('logout', () => {
            activeAuthors.delete(socket.userId)
            delete sessionsMap[socket.userId]
            logger.info('User disconnected...')
            io.emit('user disconnect', socket.userId)
        })

        socket.on("disconnect", () => {
            if(socket.userId){
                activeAuthors.delete(socket.userId)
                delete sessionsMap[socket.userId]
                logger.info('User disconnected...')
                io.emit('user disconnect', socket.userId)
            }
        })
    })
}