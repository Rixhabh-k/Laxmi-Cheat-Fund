const mongoose = require("mongoose")

const auditSchema = new mongoose.Schema({
    action:{
        type:String,
        required: true
    },
    login:{
        type:String,
    },
    logout:{
        type:String,
    },
    status:{
        type:String,
    },
    user:{
        type:String,
    },
    targatedUser:{
        type:String,
    },
    ipAddress:{
        type:String,
    },
    location:{
        type:String,
    },

})

const auditLogsModel = mongoose.model("auditLogs",auditSchema)

module.exports = auditLogsModel


/**
 * user
 * login
 * logout
 * status
 * action
 * targatedUser
 * ip
 * location
 */