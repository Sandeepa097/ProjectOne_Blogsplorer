const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const {Server} = require('socket.io')

const server = http.createServer(app)
const io = new Server(server, {cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    },
    allowEIO3: true
})

require('./websocket.js')(io)

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})