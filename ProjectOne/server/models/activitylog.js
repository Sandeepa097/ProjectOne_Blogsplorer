const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    publications: [{
        title: String,
        date: Date
    }],
    draft: [{
        title: String,
        date: Date
    }],
    profile: [{
        title: String,
        date: Date
    }]
})

logSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Log', logSchema)