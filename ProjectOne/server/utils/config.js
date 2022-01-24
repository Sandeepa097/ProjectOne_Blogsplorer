require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET
const SERVER_URL = process.env.SERVER_URI
const MONGODB_URL = process.env.MONGODB_URI
const CLOUD_NAME = process.env.CLOUD_NAME
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const WEBSOCKET_ORIGIN = process.env.WEBSOCKET_ORIGIN

module.exports = {
    MONGODB_URL,
    PORT,
    SERVER_URL,
    SECRET,
    CLOUD_NAME,
    API_KEY,
    API_SECRET,
    WEBSOCKET_ORIGIN
}