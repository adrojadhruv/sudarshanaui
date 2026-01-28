const mongoose = require("mongoose");

const collaborationSchema = new mongoose.Schema(
    {
        component: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "component",
            required: true
        },
        baseVersion: {
            type: String,
            required: true
        },
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        proposal: {
            type: Object, // The new component definition
            required: true
        },
        status: {
            type: String,
            enum: ["pending_owner", "pending_admin", "approved", "rejected"],
            default: "pending_owner"
        },
        adminComments: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("collaboration", collaborationSchema);
