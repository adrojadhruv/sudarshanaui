const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    definition: {
      type: Object, // stores your component JSON (markup, styles, props)
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    status: {
      type: String,
      enum: ["draft", "pending", "approved"],
      default: "draft"
    },

    version: {
      type: String,
      default: "1.0.0"
    },

    lastCollaborator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },

    collaborators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }],

    // NPM PUBLICATION FIELDS
    npmStatus: {
      type: String,
      enum: ["none", "requested", "published", "rejected"],
      default: "none"
    },
    npmPackageName: {
      type: String
    },
    publishedVersion: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("component", componentSchema);
