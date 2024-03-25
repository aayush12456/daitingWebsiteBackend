const mongoose = require("mongoose");
const messageModelSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },
    message: {
      type: String,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);
const message = mongoose.model("Message", messageModelSchema);
module.exports = message;
