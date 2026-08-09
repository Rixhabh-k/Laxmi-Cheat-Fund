const mongoose =  require("mongoose")

const adminSchema = new mongoose.Schema({
    adminUsername: {
        type: String,
        unique: [true, "Username alreday exist"],
        required:[true, "username is required"]
    },
    email:{
        type: String,
        unique: [true, "email already exist"],
        required:[true, "email is required"]
    },
    role:{
        type: String,
        default: "Admin"
    },
    password:{
        type: String,
        required:[true, "password is required"]
    }
})

const adminModel = mongoose.model("admin",adminSchema)

module.exports = adminModel