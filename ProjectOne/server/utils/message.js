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

const messageFromNewToOld = async(data) => {
    const msg = await User.findById(data.userId, {
        message: {$elemMatch : {"new._id": data.id}}
    })
    await User.findByIdAndUpdate(data.userId, {
        $push : {
            "message.old": msg.message[0]
        },
        $pull: {
            "message.new": {_id: data.id}
        }
    })
}

module.exports = {messageNew, messageOld, messageFromNewToOld}