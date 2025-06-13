const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comment: { type: String, required: true },
  url: { type: String, required: true },
  TypeDeDemande: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeDeDemande', required: true },
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  allowDownload: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', videoSchema);
