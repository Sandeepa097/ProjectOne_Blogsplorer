const mongoose = require('mongoose')

const blogNoImageSchema = new mongoose.Schema({
    category: String,
    categoryTheme: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    body: String,
    date: String
})

blogNoImageSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('BlogNoImage', blogNoImageSchema)