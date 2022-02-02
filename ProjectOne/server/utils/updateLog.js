const Log = require('../models/activitylog')

const updateLog = async(userId, fieldName, body) => {
    if(fieldName === "publications") {
        await Log.findOneAndUpdate({author: userId}, {
            $push: {
                publications: body
            }
        })
    }
    else if(fieldName === "draft") {
        await Log.findOneAndUpdate({author: userId}, {
            $push: {
                draft: body
            }
        })
    }
    else {
        await Log.findOneAndUpdate({author: userId}, {
            $push: {
                profile: body
            }
        })
    }
}

module.exports = {updateLog}