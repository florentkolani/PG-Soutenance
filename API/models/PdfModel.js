
const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pdf", PdfSchema);
