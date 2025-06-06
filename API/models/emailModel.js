const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    recipients: {
      type: [String],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Email", emailSchema);
