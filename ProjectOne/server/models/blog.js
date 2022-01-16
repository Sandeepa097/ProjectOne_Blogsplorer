const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    backgroundImage: String,
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

blogSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)