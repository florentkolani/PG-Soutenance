const Video = require('../models/videoModel');
const path = require('path');
const fs = require('fs');
const Product = require('../models/productModel'); // Assuming you have a product model
const TypeDeDemande = require('../models/typeDeDemandeModel'); // Assuming you have a type de demande model

exports.uploadVideo = async (req, res) => {
  try {
    const { title, comment, typededemande, produit } = req.body;
    const video = new Video({
      title,
      comment,
      url: `/uploads/${req.file.filename}`,
      TypeDeDemande: typededemande,
      produit: produit,
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la publication de la vidéo', error });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des vidéos', error });
  }
};

exports.downloadVideo = (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).json({ message: 'Erreur lors du téléchargement de la vidéo', error: err });
    }
  });
};

// Add methods for fetching products and types of requests
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error });
  }
};

exports.getTypes = async (req, res) => {
  try {
    const types = await TypeDeDemande.find();
    res.status(200).json({ types });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des types de demande', error });
  }
};
