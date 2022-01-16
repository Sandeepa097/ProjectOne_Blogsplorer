require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET
const MONGODB_URL = process.env.MONGODB_URI
const CLOUD_NAME = process.env.CLOUD_NAME
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET

module.exports = {
    MONGODB_URL,
    PORT,
    SECRET,
    CLOUD_NAME,
    API_KEY,
    API_SECRET
}