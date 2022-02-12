const User = require('../models/user')

const messageNew = async(msg) => {
    const messageObj = {body: msg.body, from: msg.from}
    await User.findByIdAndUpdate(msg.to, {
        $push: {
            "message.new": messageObj
        }
    })
}

const messageOld = async(msg) => {
    const messageObj = {body: msg.body, from: msg.from}
    await User.findByIdAndUpdate(msg.to, {
        $push: {
            "message.old": messageObj
        }
    })
}

module.exports = {messageNew, messageOld}