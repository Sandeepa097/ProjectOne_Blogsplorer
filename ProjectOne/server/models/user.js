const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    authorAvatar: String,
    firstName: String,
    lastName: String,
    fullName: String,
    email: String,
    address: String,
    city: String,
    state: String,
    country: String,
    description: String,
    passwordHash: String,
    date: String,
    draft: [{
        backgroundImage: String,
        category: Object,
        categoryTheme: String,
        title: String,
        body: String,
        date: String
    }],
    published: {
        blog: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }],
        blogNoImage: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BlogNoImage'
        }]
    },
    message: {
        old: [{
            body: String,
            from: Object
        }],
        new: [{
            body: String,
            from: Object
        }]
    }
})

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)