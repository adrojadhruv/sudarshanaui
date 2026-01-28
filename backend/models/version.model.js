const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema({
    component: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "component",
        required: true
    },
    version: {
        type: String,
        required: true
    },
    definition: {
        type: Object,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("version", versionSchema);
