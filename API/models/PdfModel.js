const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  comment: { type: String, required: true },
  title: { type: String, required: true },
  typededemande: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeDeDemande', required: true },
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  createdAt: { type: Date, default: Date.now },
},
  { timestamps: true }
);

module.exports = mongoose.model("Pdf", PdfSchema);
