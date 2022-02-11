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
        if(body.title === "Account was created..") {
            const log = new Log({
                author: userId,
                publications: [],
                draft: [],
                profile: []
            })
            await log.save()
        }

        await Log.findOneAndUpdate({author: userId}, {
            $push: {
                profile: body
            }
        })
    }
}

module.exports = {updateLog}