const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId, // Stocke l'ID du créateur (admin)
      ref: "user",
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    groupTheme: {
      type: String,
      required: true,
    },
    members: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        username: String,
        status: String,
      },
    ],
    invitations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invitation",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", groupSchema);
