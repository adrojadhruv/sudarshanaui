const mongoose = require("mongoose")
const userschema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: false // Changed for OAuth
    },
    googleId: {
        type: String,
        required: false
    },
    githubId: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        default: ""
    },
    isVerificationCandidate: {
        type: Boolean,
        default: false
    },
    role: {

        type: String,
        enum: ["admin", "user", "verifieduser"]

    }
})

module.exports = mongoose.model("user", userschema)