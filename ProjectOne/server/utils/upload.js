const config = require('./config')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY,
    api_secret: config.API_SECRET
})

const uploadImage = async(base64) => {
    if(!base64) {
        return ''
    }
    const uploadResponse = await cloudinary.uploader.upload(base64, {
        upload_preset: 'projectone'
    })
    return uploadResponse.url
}

module.exports = {uploadImage}